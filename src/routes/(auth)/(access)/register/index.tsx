import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createForm, setError } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { EyeIcon, EyeSlashIcon } from "~/components/icons";
import {
  registerSchema,
  type RegisterFormData,
} from "~/schemas/register.schema";
import { authApi, ApiError } from "~/lib/api";
import { PasswordCriteria } from "~/components/auth/PasswordCriteria";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

interface ValidationErrors {
  field: string;
  message: string;
  code?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const [registerForm, { Form, Field }] = createForm<RegisterFormData>({
    validate: (values) => {
      const result = registerSchema.safeParse(values);
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

  const handleSubmit = async (values: RegisterFormData) => {
    setErrorMessage(null);

    try {
      const response = await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        userName: values.userName,
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        toaster.success(t("auth.register.success"));
        // Keep the form in 'submitting' state during the delay to prevent double-clicks
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof ApiError && error.response) {
        const errorData = error.response;
        let handled = false;

        // 1. Handle structured validation errors from backend (Zod/ClassValidator)
        if (Array.isArray(errorData.validationErrors)) {
          errorData.validationErrors.forEach((err: ValidationErrors) => {
            const field = err.field.toLowerCase();
            // TODO: Ensure backend uses keys or handle it
            const msg = err.message; // Potentially translate here if needed
            if (field === "username" || field === "user_name") {
              setError(registerForm, "userName", msg);
              handled = true;
            } else if (field === "email") {
              setError(registerForm, "email", msg);
              handled = true;
            } else if (field === "firstname" || field === "first_name") {
              setError(registerForm, "firstName", msg);
              handled = true;
            } else if (field === "lastname" || field === "last_name") {
              setError(registerForm, "lastName", msg);
              handled = true;
            } else if (field === "password") {
              setError(registerForm, "password", msg);
              handled = true;
            }
          });
        }

        // 2. Handle Conflict errors (Duplicate entry) where no structured validation error exists
        if (!handled && errorData.statusCode === 409) {
          const details = (errorData.details || "").toLowerCase();
          const message = (errorData.message || "").toLowerCase();
          const combined = `${message} ${details}`;

          if (combined.includes("email")) {
            setError(registerForm, "email", t("auth.register.emailTaken")); // Need to add this key
            handled = true;
          } else if (
            combined.includes("username") ||
            combined.includes("user_name")
          ) {
            setError(registerForm, "userName", t("auth.register.userNameTaken")); // Need to add this key
            handled = true;
          }
        }

        if (!handled) {
          const msg =
            errorData.message || error.message || t("auth.register.failed");
          setErrorMessage(msg);
          toaster.error(msg);
        }
      } else {
        setErrorMessage(t("common.error"));
        toaster.error(t("common.networkError"));
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} class="space-y-5">
      {/* Error Message Display (Global) */}
      {errorMessage() && (
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
          <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
        </div>
      )}

      {/* Name Fields - Side by Side (responsive) */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field name="firstName">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label={t("auth.register.nameLabel")}
                type="text"
                placeholder={t("auth.register.namePlaceholder")}
                value={field.value || ""}
                required
                disabled={registerForm.submitting}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {t(field.error)}
                </p>
              )}
            </div>
          )}
        </Field>

        <Field name="lastName">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label={t("auth.register.lastNameLabel")} // Need key
                type="text"
                placeholder={t("auth.register.lastNamePlaceholder")} // Need key
                value={field.value || ""}
                required
                disabled={registerForm.submitting}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {t(field.error)}
                </p>
              )}
            </div>
          )}
        </Field>
      </div>

      {/* Username Field */}
      <Field name="userName">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label={t("auth.register.userNameLabel")} // Need key
              type="text"
              placeholder={t("auth.register.userNamePlaceholder")}
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Email Field */}
      <Field name="email">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label={t("auth.register.emailLabel")}
              type="email"
              placeholder={t("auth.register.emailPlaceholder")}
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Password Field with Toggle & Criteria */}
      <Field name="password">
        {(field, props) => (
          <div class="relative">
            <Input
              {...props}
              label={t("auth.register.passwordLabel")}
              type={showPassword() ? "text" : "password"}
              placeholder={t("auth.register.passwordPlaceholder")}
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
              onInput={props.onInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword())}
              class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={showPassword() ? "Hide password" : "Show password"}
              disabled={registerForm.submitting}
            >
              {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>

            {/* Password Criteria Checklist */}
            <PasswordCriteria password={() => field.value} />

            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Confirm Password Field with Toggle */}
      <Field name="confirmPassword">
        {(field, props) => (
          <div class="relative">
            <Input
              {...props}
              label={t("auth.register.confirmPasswordLabel")}
              type={showConfirmPassword() ? "text" : "password"}
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword())}
              class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label={
                showConfirmPassword() ? "Hide password" : "Show password"
              }
              disabled={registerForm.submitting}
            >
              {showConfirmPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Terms and Conditions */}
      <Field name="agreeToTerms" type="boolean">
        {(field, props) => (
          <div class="pt-2">
            <label class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                {...props}
                type="checkbox"
                checked={field.value || false}
                class="mt-0.5 rounded border-gray-300 text-forest-600 focus:ring-forest-500 dark:border-gray-600 dark:bg-gray-700"
                required
                disabled={registerForm.submitting}
              />
              <span>
                {t("auth.register.acceptTerms")}
                {/* Links removed for brevity but could be parameterized or separate spans */}
              </span>
            </label>
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {t(field.error)}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Create Account Button - Disabled if form is invalid or submitting */}
      <Button
        variant="primary"
        class="w-full"
        type="submit"
        disabled={registerForm.submitting || registerForm.invalid}
      >
        {registerForm.submitting ? t("auth.register.submitting") : t("auth.register.submit")}
      </Button>

      {/* Sign In Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        {t("auth.register.hasAccount")}{" "}
        <A
          href="/login"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium transition-colors underline-offset-2 hover:underline"
        >
          {t("auth.register.signIn")}
        </A>
      </p>
    </Form>
  );
}
