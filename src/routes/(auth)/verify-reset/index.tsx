import { useNavigate, useLocation } from "@solidjs/router";
import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { z } from "zod";

const verifyResetSchema = z.object({
    otp: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only digits"),
});

type VerifyResetForm = z.infer<typeof verifyResetSchema>;

export default function VerifyReset() {
    const navigate = useNavigate();
    const location = useLocation();
    const getInitialState = () => {
        const locState = location.state as { token?: string; expiresAt?: string; email?: string } | undefined;
        if (locState?.token) return locState;

        // Try localStorage
        try {
            const stored = localStorage.getItem("byteforge_reset_verify");
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse stored session", e);
        }
        return {};
    };

    const initialState = getInitialState();
    const [token, setToken] = createSignal<string | null>(initialState?.token || null);
    const [expiresAt, setExpiresAt] = createSignal<Date | null>(initialState?.expiresAt ? new Date(initialState.expiresAt) : null);
    const email = initialState?.email; // Derived signal not needed if just for display

    // Timer State
    const [timeLeft, setTimeLeft] = createSignal<string>("");
    const [canResend, setCanResend] = createSignal(false);
    const [resendStatus, setResendStatus] = createSignal<string | null>(null);
    const [isResending, setIsResending] = createSignal(false);

    const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

    // Redirect if no token state
    onMount(() => {
        if (!token()) {
            toaster.error("Session invalid. Please start over.");
            navigate("/forgot-password", { replace: true });
        }
    });

    // Countdown Logic
    const updateTimer = () => {
        const expiry = expiresAt();
        if (!expiry) return;

        const now = new Date();
        const diff = expiry.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeLeft("Expired");
            setCanResend(true);
            return;
        }

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    createEffect(() => {
        if (expiresAt()) {
            const timer = setInterval(updateTimer, 1000);
            onCleanup(() => clearInterval(timer));
            updateTimer();
        }
    });

    const [verifyForm, { Form, Field }] = createForm<VerifyResetForm>({
        validate: (values) => {
            const result = verifyResetSchema.safeParse(values);
            if (result.success) {
                return {};
            }
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                if (issue.path.length > 0) {
                    errors[issue.path.join(".")] = issue.message;
                }
            });
            return errors;
        },
    });

    const handleSubmit = async (values: VerifyResetForm) => {
        const currentToken = token();
        if (!currentToken) return;

        try {
            const response = await authApi.verifyResetOtp({
                token: currentToken,
                otp: values.otp
            });

            if (response.success) {
                const sessionData = {
                    token: response.data?.token,
                    expiresAt: response.data?.expiresAt
                };

                // Clear previous stage
                localStorage.removeItem("byteforge_reset_verify");
                // Set next stage
                localStorage.setItem("byteforge_reset_confirm", JSON.stringify(sessionData));

                toaster.success("Code verified! Set your new password.");
                navigate("/reset-password", {
                    state: sessionData,
                    replace: true
                });
            }
        } catch (error) {
            if (error instanceof ApiError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Invalid code. Please try again.");
            }
        }
    };

    const handleResend = async () => {
        const currentToken = token();
        if (!currentToken) return;

        setIsResending(true);
        setResendStatus("sending");

        try {
            const response = await authApi.resendResetOtp({ token: currentToken });
            if (response.success && response.data) {
                setToken(response.data.token); // Update request token
                setExpiresAt(new Date(response.data.expiresAt));
                setCanResend(false);
                setResendStatus("sent");
                toaster.success("New code sent!");
                setTimeout(() => setResendStatus(null), 3000);
            }
        } catch (error) {
            setResendStatus(null);
            if (error instanceof ApiError) {
                toaster.error(error.message);
            } else {
                toaster.error("Failed to resend code.");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div class="space-y-6">
            <div class="text-center -mt-4 mb-6">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    We sent a code to <span class="font-medium text-gray-900 dark:text-gray-200">{email}</span>
                </p>
            </div>


            <Form onSubmit={handleSubmit} class="space-y-6">
                {errorMessage() && (
                    <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
                    </div>
                )}

                <div class="text-center space-y-2">
                    {timeLeft() && (
                        <p class="text-sm font-medium text-forest-600 dark:text-sage-400 bg-forest-50 dark:bg-forest-900/20 py-1 px-3 rounded-full inline-block">
                            Code expires in {timeLeft()}
                        </p>
                    )}
                </div>

                <Field name="otp">
                    {(field, props) => (
                        <div>
                            <Input
                                {...props}
                                label="Verification Code"
                                type="text"
                                placeholder="Enter 6-digit code"
                                maxlength={6}
                                value={field.value || ""}
                                required
                                disabled={verifyForm.submitting}
                                autocomplete="one-time-code"
                            />
                            {field.error && (
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {field.error}
                                </p>
                            )}
                        </div>
                    )}
                </Field>

                <Button
                    variant="primary"
                    class="w-full"
                    type="submit"
                    disabled={verifyForm.submitting}
                >
                    {verifyForm.submitting ? "Verifying..." : "Verify Code"}
                </Button>

                <div class="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending() || (!canResend() && !timeLeft()?.includes("Expired"))}
                        // Simple logic: disable if resending. Enable if expired OR standard resend link logic.
                        // Actually, let's allow resend anytime? Or follow similar logic to verify-account.
                        // Let's just use canResend signal which is true when expired? 
                        // Or better: Always allow resend but maybe with cooldown? 
                        // For now, let's just make it clickable.
                        class="text-sm text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resendStatus() === "sending" ? "Sending..." : "Resend Code"}
                    </button>
                </div>
            </Form>
        </div>
    );
}
