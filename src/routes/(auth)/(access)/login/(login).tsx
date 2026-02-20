import { A, useNavigate, action, useSubmission, useAction, redirect } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createForm, setError } from "@modular-forms/solid";
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
  const result = await authApi.login({
    email: data.email,
    password: data.password,
  });

  if (result.user && !result.user.emailVerified) {
    return { success: true, target: "/verify-account" };
  }

  return { success: true, target: "/" };
}, "login-action");

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const loginTrigger = useAction(loginAction);
  const submission = useSubmission(loginAction);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
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

  // Map server errors from the action back to the form fields
  createEffect(() => {
    if (submission.error) {
      console.log("Submission error caught:", submission.error);
      const error = submission.error;
      const errorData = (error as any).response;

      if (errorData) {
        console.log("Error details from API:", errorData);
        let handled = false;

        // 1. Handle structured validation errors
        if (Array.isArray(errorData.validationErrors)) {
          errorData.validationErrors.forEach((err: any) => {
            const field = err.field.toLowerCase();
            if (field === "email") {
              setError(loginForm, "email", err.message);
              handled = true;
            } else if (field === "password") {
              setError(loginForm, "password", err.message);
              handled = true;
            }
          });
        }

        // 2. Handle 401/400 and other errors by checking the message
        const message = errorData.message || (error as any).message;
        if (!handled && message) {
          const lowerMsg = message.toLowerCase();
          if (lowerMsg.includes("password")) {
            setError(loginForm, "password", message);
            handled = true;
          } else if (lowerMsg.includes("email") || lowerMsg.includes("user")) {
            setError(loginForm, "email", message);
            handled = true;
          }
        }

        if (!handled) {
          const msg = errorData.message || (error as any).message || "auth.login.failed";
          setErrorMessage(msg.includes(".") ? t(msg) : msg);
          toaster.error(msg.includes(".") ? t(msg) : msg);
        }
      } else {
        const msg = (error as any).message || "auth.login.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
        toaster.error(t("common.networkError"));
      }
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
    setErrorMessage(null);
    loginTrigger(values);
  };

  return (
    <div class="w-full sm:min-w-[360px] max-w-md">
      <Form onSubmit={handleSubmit} class="space-y-6">
        {/* Error Message Display */}
        {errorMessage() && (
          <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
            <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
          </div>
        )}

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
