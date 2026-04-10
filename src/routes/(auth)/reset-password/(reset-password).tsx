import { useNavigate, useLocation, A, action, useSubmission, useAction } from "@solidjs/router";
import { createSignal, onMount, createEffect, onCleanup } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { EyeIcon, EyeSlashIcon } from "~/components/icons";
import { PasswordCriteria } from "~/components/auth/PasswordCriteria";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { z } from "zod";
import { passwordSchema } from "~/schemas/password.schema";
import { useI18n } from "~/i18n";

const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.validation.passwordsDoNotMatch",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

/**
 * Reset Password Action
 */
const resetPasswordAction = action(async (data: { token: string; password: string }) => {
  "use server";
  await authApi.resetPassword(data);
  return { success: true };
}, "reset-password-action");

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const resetPasswordTrigger = useAction(resetPasswordAction);
  const submission = useSubmission(resetPasswordAction);

  const getInitialState = () => {
    const locState = location.state as { token?: string; expiresAt?: string } | undefined;
    if (locState?.token) return locState;

    const saved = localStorage.getItem("byteforge_reset_confirm");
    if (saved) return JSON.parse(saved);
    return null;
  };

  const initialState = getInitialState();
  const [token] = createSignal<string | null>(initialState?.token || null);
  const [expiresAt] = createSignal<Date | null>(initialState?.expiresAt ? new Date(initialState.expiresAt) : null);

  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [timeLeft, setTimeLeft] = createSignal<string>("");
  const [isSessionExpired, setIsSessionExpired] = createSignal(false);

  // Redirect if no token state
  onMount(() => {
    if (!token()) {
      toaster.error(t("auth.resetPassword.sessionTimeout"));
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
        setTimeLeft(t("auth.resetPassword.sessionExpired"));
        setIsSessionExpired(true);
      }
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  createEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    onCleanup(() => clearInterval(timer));
  });

  // Handle Success Flow
  createEffect(() => {
    if (submission.result?.success) {
      localStorage.removeItem("byteforge_reset_confirm");
      toaster.success(t("auth.resetPassword.success"));
      navigate("/login", { replace: true });
    }
  });

  // Handle Error Flow
  createEffect(() => {
    if (submission.error) {
      console.log("Reset password error caught:", submission.error);
      const error = submission.error;
      const errorData = (error as any).response;

      if (errorData) {
        console.log("Error details from API:", errorData);
        const msg = errorData.message || (error as any).message || "auth.resetPassword.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      } else {
        const msg = (error as any).message || "auth.resetPassword.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      }
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

  const handleSubmit = (values: ResetPasswordForm) => {
    const currentToken = token();
    if (!currentToken) return;
    setErrorMessage(null);
    resetPasswordTrigger({
      token: currentToken,
      password: values.password
    });
  };

  return (
    <div class="w-full sm:min-w-[400px] max-w-md mx-auto">
      <div class="text-center -mt-4 mb-2">
        {timeLeft() && (
          <p class={`text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full inline-block transition-colors ${isSessionExpired()
            ? "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30"
            : "text-terracotta-700 bg-terracotta-50 dark:text-terracotta-400 dark:bg-terracotta-900/20 border border-terracotta-100 dark:border-terracotta-900/30"
            }`}>
            {isSessionExpired() ? t("auth.resetPassword.sessionExpired") : `${t("auth.resetPassword.sessionExpiresIn")} ${timeLeft()}`}
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
              {t("auth.resetPassword.sessionTimeout")}
            </p>
            <A
              href="/forgot-password"
              class="text-terracotta-600 hover:text-terracotta-700 dark:text-terracotta-400 dark:hover:text-terracotta-300 font-bold transition-colors underline-offset-4 hover:underline"
            >
              {t("auth.resetPassword.startOver")}
            </A>
          </div>
        )}

        <fieldset disabled={isSessionExpired() || submission.pending} class="space-y-6 disabled:opacity-50">
          {/* Wrap fields in fieldset to easily disable all */}
          <Field name="password">
            {(field, props) => (
              <div class="relative">
                <Input
                  {...props}
                  label={t("auth.resetPassword.newPasswordLabel")}
                  type={showPassword() ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  value={field.value || ""}
                  required
                  onInput={props.onInput}
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword())}
                  class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showPassword() ? "Hide password" : "Show password"}
                >
                  {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
                </button>

                <PasswordCriteria password={() => field.value} />

                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.error.includes(".") ? t(field.error) : field.error}
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
                  label={t("auth.resetPassword.confirmPasswordLabel")}
                  type={showConfirmPassword() ? "text" : "password"}
                  placeholder={t("auth.register.confirmPasswordPlaceholder")}
                  value={field.value || ""}
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label={showConfirmPassword() ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword() ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
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
            size="lg"
            class="w-full shadow-sm"
            type="submit"
            disabled={submission.pending || isSessionExpired()}
          >
            {submission.pending ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}
