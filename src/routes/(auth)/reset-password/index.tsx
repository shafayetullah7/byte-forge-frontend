import { useNavigate, useLocation, A } from "@solidjs/router";
import { createSignal, onMount, createEffect, onCleanup } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { EyeIcon, EyeSlashIcon } from "~/components/icons";
import { PasswordCriteria } from "~/components/auth/PasswordCriteria";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { z } from "zod";
import { passwordSchema } from "~/schemas/password.schema";

const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialState = () => {
    const locState = location.state as { token?: string; expiresAt?: string } | undefined;
    if (locState?.token) return locState;

    // Try localStorage
    try {
      const stored = localStorage.getItem("byteforge_reset_confirm");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored session", e);
    }
    return {};
  };

  const initialState = getInitialState();
  const [token, setToken] = createSignal<string | null>(initialState?.token || null);
  const [expiresAt, setExpiresAt] = createSignal<Date | null>(initialState?.expiresAt ? new Date(initialState.expiresAt) : null);
  const [timeLeft, setTimeLeft] = createSignal<string>("");
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [isSessionExpired, setIsSessionExpired] = createSignal(false);

  // Redirect if no token state
  onMount(() => {
    if (!token()) {
      toaster.error("Session expired or invalid. Start over.");
      navigate("/forgot-password", { replace: true });
    }
  });

  const updateTimer = () => {
    const expiry = expiresAt();
    if (!expiry) return;

    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      if (!isSessionExpired()) {
        setTimeLeft("Expired");
        setIsSessionExpired(true);
        // Optional: Auto redirect after few seconds?
        // navigate("/login", { replace: true }); 
      }
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

  const [resetForm, { Form, Field }] = createForm<ResetPasswordForm>({
    validate: (values) => {
      const result = resetPasswordSchema.safeParse(values);
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

  const handleSubmit = async (values: ResetPasswordForm) => {
    const currentToken = token();
    if (!currentToken) return;

    setErrorMessage(null);

    try {
      const response = await authApi.resetPassword({
        token: currentToken,
        password: values.password
      });

      if (response.success) {
        // Clear session on success
        localStorage.removeItem("byteforge_reset_confirm");
        toaster.success("Password reset successfully!");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to reset password.");
      }
    }
  };

  return (
    <div class="space-y-6">
      <div class="text-center -mt-4 mb-2">
        {timeLeft() && (
          <p class={`text-sm font-medium py-1 px-3 rounded-full inline-block ${isSessionExpired()
            ? "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
            : "text-forest-600 dark:text-sage-400 bg-forest-50 dark:bg-forest-900/20"
            }`}>
            {isSessionExpired() ? "Session Expired" : `Session expires in ${timeLeft()}`}
          </p>
        )}
      </div>

      <Form onSubmit={handleSubmit} class="space-y-6">
        {errorMessage() && (
          <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
          </div>
        )}

        {isSessionExpired() && (
          <div class="text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your session has timed out. Please request a new code.
            </p>
            <A
              href="/forgot-password"
              class="text-forest-600 hover:text-forest-700 dark:text-sage-400 dark:hover:text-sage-300 font-medium"
            >
              Start Over
            </A>
          </div>
        )}

        <fieldset disabled={isSessionExpired() || resetForm.submitting} class="space-y-6 disabled:opacity-50">
          {/* Wrap fields in fieldset to easily disable all */}
          <Field name="password">
            {(field, props) => (
              <div class="relative">
                <Input
                  {...props}
                  label="New Password"
                  type={showPassword() ? "text" : "password"}
                  placeholder="Unbreakable password"
                  value={field.value || ""}
                  required
                  // disabled={resetForm.submitting} -> handled by fieldset
                  onInput={props.onInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword())}
                  class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword() ? "Hide password" : "Show password"}
                // disabled={resetForm.submitting} -> handled by fieldset
                >
                  {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
                </button>

                <PasswordCriteria password={() => field.value} />

                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.error}
                  </p>
                )}
              </div>
            )}
          </Field>

          <Field name="confirmPassword">
            {(field, props) => (
              <div class="relative">
                <Input
                  {...props}
                  label="Confirm Password"
                  type={showConfirmPassword() ? "text" : "password"}
                  placeholder="Repeat password"
                  value={field.value || ""}
                  required
                // disabled={resetForm.submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showConfirmPassword() ? "Hide password" : "Show password"}
                // disabled={resetForm.submitting}
                >
                  {showConfirmPassword() ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
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
            disabled={resetForm.submitting || isSessionExpired()}
          >
            {resetForm.submitting ? "Resetting..." : "Reset Password"}
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}
