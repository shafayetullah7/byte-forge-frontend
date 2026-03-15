import { A, useNavigate, action, useSubmission, useAction } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { EyeIcon, EyeSlashIcon } from "~/components/icons";
import { loginSchema, type LoginFormData } from "~/schemas/login.schema";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

/**
 * Login Action
 * Handles server-side authentication and automatic session revalidation.
 */
const loginAction = action(async (data: LoginFormData) => {
  "use server";
  try {
    const result = await authApi.login({
      email: data.email,
      password: data.password,
    });

    if (result.user && !result.user.emailVerified) {
      return { success: true, target: "/verify-account" };
    }

    return { success: true, target: "/" };
  } catch (error) {
    // Return error as result instead of throwing to prevent h3 from setting invalid headers
    const apiError = error as any;
    return {
      success: false,
      error: {
        message: apiError.message || "Login failed",
        response: apiError.response,
        statusCode: apiError.statusCode,
      },
    };
  }
}, "login-action");

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const loginTrigger = useAction(loginAction);
  const submission = useSubmission(loginAction);
  const [showPassword, setShowPassword] = createSignal(false);

  const [loginForm, { Form, Field }] = createForm<LoginFormData>({
    validate: (values) => {
      const result = loginSchema.safeParse(values);
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

  // Handle server errors from the action - show in toast only
  createEffect(() => {
    const result = submission.result as any;
    if (result && result.success === false && result.error) {
      const errorData = result.error;
      const message = errorData.message || "auth.login.failed";
      const displayMessage = message.includes(".") ? t(message) : message;

      // Show error in toast - simple and clean
      toaster.error(displayMessage);
    }
  });

  // Handle successful login
  createEffect(() => {
    if (submission.result?.success) {
      toaster.success(t("auth.login.success"));
      navigate(submission.result.target || "/", { replace: true });
    }
  });

  const handleSubmit = (values: LoginFormData) => {
    console.log("Submitting login form...");
    loginTrigger(values);
  };

  return (
    <div class="w-full sm:min-w-[360px] max-w-md">
      <Form onSubmit={handleSubmit} class="space-y-6">
        {/* Email Field */}
        <Field name="email">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label={t("auth.login.emailLabel")}
                type="email"
                placeholder={t("auth.login.emailPlaceholder")}
                value={field.value || ""}
                required
                disabled={submission.pending}
                autocomplete="username"
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        {/* Password Field */}
        <Field name="password">
          {(field, props) => (
            <div class="relative">
              <Input
                {...props}
                label={t("auth.login.passwordLabel")}
                type={showPassword() ? "text" : "password"}
                placeholder={t("auth.login.passwordPlaceholder")}
                value={field.value || ""}
                required
                disabled={submission.pending}
                autocomplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword())}
                class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label={showPassword() ? "Hide password" : "Show password"}
                disabled={submission.pending}
              >
                {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        {/* Remember Me & Forgot Password */}
        <div class="flex items-center justify-between">
          <Field name="rememberMe" type="boolean">
            {(field, props) => (
              <label class="flex items-start gap-2 text-sm text-forest-800 dark:text-cream-200 cursor-pointer group">
                <input
                  {...props}
                  type="checkbox"
                  checked={field.value || false}
                  class="mt-1 rounded border-gray-300 dark:border-forest-700 text-terracotta-600 focus:ring-terracotta-500 transition-colors"
                  disabled={submission.pending}
                />
                <span class="group-hover:text-forest-600 dark:group-hover:text-cream-100 transition-colors">
                  {t("auth.login.rememberMe")}
                </span>
              </label>
            )}
          </Field>
          <A
            href="/forgot-password"
            class="text-sm font-medium text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 transition-colors underline-offset-4 hover:underline"
          >
            {t("auth.login.forgotPassword")}
          </A>
        </div>

        {/* Sign In Button */}
        <Button
          variant="primary"
          size="lg"
          class="w-full shadow-sm"
          type="submit"
          disabled={submission.pending}
        >
          {submission.pending ? t("auth.login.submitting") : t("auth.login.submit")}
        </Button>

        {/* Sign Up Link */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
          {t("auth.login.noAccount")}{" "}
          <A
            href="/register"
            class="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 font-bold transition-colors underline-offset-4 hover:underline"
          >
            {t("auth.login.createAccount")}
          </A>
        </p>
      </Form>
    </div>
  );
}
