import { A, useNavigate, revalidate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { createForm, setError } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { EyeIcon, EyeSlashIcon } from "~/components/icons";
import { loginSchema, type LoginFormData } from "~/schemas/login.schema";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useI18n();
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
          // Map Zod errors to translation keys if possible, or use standard z.message
          // For now we will rely on schema being updated to return keys, or just use what is there.
          // In the next step I will update the schema to return keys like "auth.validation.emailRequired"
          errors[issue.path.join(".")] = issue.message;
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setErrorMessage(null);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        toaster.success(t("auth.login.success"));
        // Keep the form in 'submitting' state during the delay to prevent double-clicks
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Revalidate session to update UI immediately
        await revalidate("user-session");

        if (response.data && response.data.user && !response.data.user.emailVerified) {
          navigate("/verify-account");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      if (error instanceof ApiError && error.response) {
        const errorData = error.response;
        let handled = false;

        // 1. Handle structured validation errors from backend
        if (Array.isArray(errorData.validationErrors)) {
          errorData.validationErrors.forEach((err) => {
            const field = err.field.toLowerCase();
            // TODO: backend should return keys or we translate keys here.
            // For Level 2, backend returns translated string or key.
            if (field === "email") {
              setError(loginForm, "email", err.message);
              handled = true;
            } else if (field === "password") {
              setError(loginForm, "password", err.message);
              handled = true;
            }
          });
        }

        // 2. Handle unauthorized/invalid credentials (401)
        if (!handled && error.statusCode === 401) {
          const msg = errorData.message || "Invalid email or password";
          setErrorMessage(msg);
          toaster.error(msg);
          handled = true;
        }

        if (!handled) {
          const msg = errorData.message || error.message || "Login failed";
          setErrorMessage(msg);
          toaster.error(msg);
        }
      } else {
        setErrorMessage(t("common.error"));
        toaster.error("Network error or server unreachable");
      }
      console.error("Login error:", error);
    }
  };

  return (
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
              disabled={loginForm.submitting}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error) /* Try to translate error if it's a key */}
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
              disabled={loginForm.submitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword())}
              class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={showPassword() ? "Hide password" : "Show password"}
              disabled={loginForm.submitting}
            >
              {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Remember Me & Forgot Password */}
      <div class="flex items-center justify-between">
        <Field name="rememberMe" type="boolean">
          {(field, props) => (
            <label class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                {...props}
                type="checkbox"
                checked={field.value || false}
                class="mt-0.5 rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                disabled={loginForm.submitting}
              />
              {t("auth.login.rememberMe")}
            </label>
          )}
        </Field>
        <A
          href="/forgot-password"
          class="text-sm text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 transition-colors underline-offset-2 hover:underline"
        >
          {t("auth.login.forgotPassword")}
        </A>
      </div>

      {/* Sign In Button */}
      <Button
        variant="primary"
        class="w-full"
        type="submit"
        disabled={loginForm.submitting || loginForm.invalid}
      >
        {loginForm.submitting ? t("auth.login.submitting") : t("auth.login.submit")}
      </Button>

      {/* Sign Up Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("auth.login.noAccount")}{" "}
        <A
          href="/register"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium transition-colors underline-offset-2 hover:underline"
        >
          {t("auth.login.createAccount")}
        </A>
      </p>
    </Form>
  );
}
