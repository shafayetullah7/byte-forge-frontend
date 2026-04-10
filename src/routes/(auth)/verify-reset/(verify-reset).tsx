import { useNavigate, useLocation, action, useSubmission, useAction } from "@solidjs/router";
import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";
import { z } from "zod";

const verifyResetSchema = z.object({
    otp: z.string().length(6, "auth.validation.otpLength").regex(/^\d+$/, "auth.validation.otpDigits"),
});

type VerifyResetForm = z.infer<typeof verifyResetSchema>;

/**
 * Verify Reset OTP Action
 */
const verifyResetAction = action(async (data: { token: string; otp: string }) => {
    "use server";
    return await authApi.verifyResetOtp(data);
}, "verify-reset-action");

/**
 * Resend Reset OTP Action
 */
const resendResetAction = action(async (data: { token: string }) => {
    "use server";
    return await authApi.resendResetOtp(data);
}, "resend-reset-action");

export default function VerifyReset() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useI18n();

    const verifyResetTrigger = useAction(verifyResetAction);
    const resendResetTrigger = useAction(resendResetAction);

    const verifySubmission = useSubmission(verifyResetAction);
    const resendSubmission = useSubmission(resendResetAction);

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
    const email = initialState?.email;

    // Timer State
    const [timeLeft, setTimeLeft] = createSignal<string>("");
    const [canResend, setCanResend] = createSignal(false);
    const [resendStatus, setResendStatus] = createSignal<string | null>(null);

    const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

    // Redirect if no token state
    onMount(() => {
        if (!token()) {
            toaster.error(t("auth.verifyReset.invalidSession") || "Session invalid. Please start over.");
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
            setTimeLeft(t("auth.verifyAccount.expired"));
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

    // Handle Verify Success
    createEffect(() => {
        if (verifySubmission.result) {
            const response = verifySubmission.result;
            const sessionData = {
                token: response.token,
                expiresAt: response.expiresAt
            };

            // Clear previous stage
            localStorage.removeItem("byteforge_reset_verify");
            // Set next stage
            localStorage.setItem("byteforge_reset_confirm", JSON.stringify(sessionData));

            toaster.success(t("auth.verifyReset.success") || "Code verified! Set your new password.");
            navigate("/reset-password", {
                state: sessionData,
                replace: true
            });
        }
    });

    // Handle Resend Success
    createEffect(() => {
        if (resendSubmission.result) {
            const response = resendSubmission.result;
            setToken(response.token);
            setExpiresAt(new Date(response.expiresAt));
            setCanResend(false);
            setResendStatus("sent");
            toaster.success(t("auth.verifyAccount.resendSent"));
            setTimeout(() => setResendStatus(null), 3000);
        }
    });

    // Handle Resend Error
    createEffect(() => {
        if (resendSubmission.error) {
            console.log("Resend reset OTP error caught:", resendSubmission.error);
            const error = resendSubmission.error;
            const errorData = (error as any).response;
            const msg = errorData?.message || (error as any).message || "Failed to resend code.";
            toaster.error(msg.includes(".") ? t(msg) : msg);
        }
    });

    // Handle Verify Error
    createEffect(() => {
        if (verifySubmission.error) {
            console.log("Verify reset OTP error caught:", verifySubmission.error);
            const error = verifySubmission.error;
            const errorData = (error as any).response;

            if (errorData) {
                console.log("Error details from API:", errorData);
                if (errorData.statusCode === 401 || errorData.statusCode === 404) {
                    setErrorMessage(t("auth.verifyReset.invalidSession"));
                    return;
                }
                const msg = errorData.message || (error as any).message || "auth.verifyAccount.errorVerify";
                setErrorMessage(msg.includes(".") ? t(msg) : msg);
            } else {
                const msg = (error as any).message || "Invalid code. Please try again.";
                setErrorMessage(msg.includes(".") ? t(msg) : msg);
            }
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

    const handleSubmit = (values: VerifyResetForm) => {
        const currentToken = token();
        if (!currentToken) return;
        setErrorMessage(null);
        verifyResetTrigger({
            token: currentToken,
            otp: values.otp
        });
    };

    const handleResend = () => {
        const currentToken = token();
        if (!currentToken) return;
        setErrorMessage(null);
        resendResetTrigger({ token: currentToken });
    };

    return (
        <div class="w-full sm:min-w-[360px] max-w-md mx-auto space-y-6">
            <div class="text-center -mt-4 mb-6">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    {t("auth.verifyReset.sentTo")} <span class="font-medium text-gray-900 dark:text-gray-200">{email}</span>
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
                            {t("auth.verifyAccount.expiresIn")} {timeLeft()}
                        </p>
                    )}
                </div>

                <Field name="otp">
                    {(field, props) => (
                        <div>
                            <Input
                                {...props}
                                label={t("auth.verifyAccount.otpLabel")}
                                type="text"
                                placeholder={t("auth.verifyAccount.otpPlaceholder")}
                                maxlength={6}
                                value={field.value || ""}
                                required
                                disabled={verifySubmission.pending}
                                autocomplete="one-time-code"
                            />
                            {field.error && (
                                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {field.error.includes(".") ? t(field.error) : field.error}
                                </p>
                            )}
                        </div>
                    )}
                </Field>

                <Button
                    variant="primary"
                    class="w-full"
                    type="submit"
                    disabled={verifySubmission.pending}
                >
                    {verifySubmission.pending ? t("auth.verifyAccount.submitting") : t("auth.verifyAccount.submit")}
                </Button>

                <div class="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={verifySubmission.pending || resendSubmission.pending || (!canResend() && !timeLeft()?.includes("Expired"))}
                        class="text-sm text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {resendSubmission.pending ? t("auth.verifyAccount.resending") : t("auth.verifyAccount.resend")}
                    </button>
                </div>
            </Form>
        </div>
    );
}
