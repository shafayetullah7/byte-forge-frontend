import { A, useNavigate, action, useSubmission, useAction, redirect } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
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

/**
 * Register Action
 * Handles server-side registration.
 */
const registerAction = action(async (data: RegisterFormData) => {
  "use server";
  await authApi.register({
    firstName: data.firstName,
    lastName: data.lastName,
    userName: data.userName,
    email: data.email,
    password: data.password,
  });
  return { success: true };
}, "register-action");

export default function Register() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const registerTrigger = useAction(registerAction);
  const submission = useSubmission(registerAction);
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

  // Map server errors from the action back to the form fields
  createEffect(() => {
    if (submission.error) {
      console.log("Registration error caught:", submission.error);
      const error = submission.error;
      const errorData = (error as any).response;

      if (errorData) {
        console.log("Error details from API:", errorData);
        let handled = false;

        // 1. Handle structured validation errors from backend
        if (Array.isArray(errorData.validationErrors)) {
          errorData.validationErrors.forEach((err: ValidationErrors) => {
            const field = err.field.toLowerCase();
            const msg = err.message;
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

        // 2. Handle Conflict errors (Duplicate entry) or other messages
        const message = errorData.message || (error as any).message;
        if (!handled && message) {
          const lowerMsg = message.toLowerCase();
          if (lowerMsg.includes("email")) {
            setError(registerForm, "email", message);
            handled = true;
          } else if (lowerMsg.includes("username") || lowerMsg.includes("user_name")) {
            setError(registerForm, "userName", message);
            handled = true;
          }
        }

        if (!handled) {
          const msg =
            errorData.message || (error as any).message || "auth.register.failed";
          setErrorMessage(msg.includes(".") ? t(msg) : msg);
          toaster.error(msg.includes(".") ? t(msg) : msg);
        }
      } else {
        const msg = (error as any).message || "auth.register.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
        toaster.error(t("common.networkError"));
      }
    }
  });

  // Handle successful registration
  createEffect(() => {
    if (submission.result?.success) {
      toaster.success(t("auth.register.success"));
      navigate("/login");
    }
  });

  const handleSubmit = (values: RegisterFormData) => {
    console.log("Submitting registration...");
    setErrorMessage(null);
    registerTrigger(values);
  };

  return (
    <div class="w-full sm:min-w-[400px] md:min-w-[500px] max-w-2xl transition-all">
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
                  disabled={submission.pending}
                  autocomplete="given-name"
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.error.includes(".") ? t(field.error) : field.error}
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
                  disabled={submission.pending}
                  autocomplete="family-name"
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {field.error.includes(".") ? t(field.error) : field.error}
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
                label={t("auth.register.userNameLabel")}
                type="text"
                placeholder={t("auth.register.userNamePlaceholder")}
                value={field.value || ""}
                required
                disabled={submission.pending}
                autocomplete="username"
              />
              {!field.error && (
                <p class="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide px-1">
                  {t("auth.register.userNameHint")}
                </p>
              )}
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
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
                disabled={submission.pending}
                autocomplete="email"
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
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
                disabled={submission.pending}
                onInput={props.onInput}
                autocomplete="new-password"
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

              {/* Password Criteria Checklist */}
              <PasswordCriteria password={() => field.value} />

              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
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
                disabled={submission.pending}
                autocomplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                class="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label={
                  showConfirmPassword() ? "Hide password" : "Show password"
                }
                disabled={submission.pending}
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

        {/* Terms and Conditions */}
        <Field name="agreeToTerms" type="boolean">
          {(field, props) => (
            <div class="pt-2">
              <label class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  {...props}
                  type="checkbox"
                  checked={field.value || false}
                  class="mt-0.5 rounded border-gray-300 text-forest-600 focus:ring-forest-500 dark:border-forest-600 dark:bg-forest-700"
                  required
                  disabled={submission.pending}
                />
                <span>
                  {t("auth.register.acceptTerms")}
                  {/* Links removed for brevity but could be parameterized or separate spans */}
                </span>
              </label>
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
                </p>
              )}
            </div>
          )}
        </Field>

        {/* Create Account Button - Disabled if form is invalid or submitting */}
        <div class="pt-2">
          <Button
            variant="primary"
            size="lg"
            class="w-full shadow-sm"
            type="submit"
            disabled={submission.pending}
          >
            {submission.pending ? t("auth.register.submitting") : t("auth.register.submit")}
          </Button>
        </div>

        {/* Sign In Link */}
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.register.hasAccount")}{" "}
          <A
            href="/login"
            class="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 font-bold transition-colors underline-offset-4 hover:underline"
          >
            {t("auth.register.signIn")}
          </A>
        </p>
      </Form>
    </div>
  );
}
