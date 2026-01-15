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

interface ValidationErrors {
  field: string;
  message: string;
  code?: string;
}

export default function Register() {
  const navigate = useNavigate();
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
        toaster.success("Account created successfully! Redirecting...");
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
            if (field === "username" || field === "user_name") {
              setError(registerForm, "userName", err.message);
              handled = true;
            } else if (field === "email") {
              setError(registerForm, "email", err.message);
              handled = true;
            } else if (field === "firstname" || field === "first_name") {
              setError(registerForm, "firstName", err.message);
              handled = true;
            } else if (field === "lastname" || field === "last_name") {
              setError(registerForm, "lastName", err.message);
              handled = true;
            } else if (field === "password") {
              setError(registerForm, "password", err.message);
              handled = true;
            }
          });
        }

        // 2. Handle Conflict errors (Duplicate entry) where no structured validation error exists
        // Backend returns raw details in dev: "Key (email)=(...) already exists"
        if (!handled && errorData.statusCode === 409) {
          const details = (errorData.details || "").toLowerCase();
          const message = (errorData.message || "").toLowerCase();
          const combined = `${message} ${details}`;

          if (combined.includes("email")) {
            setError(registerForm, "email", "This email is already registered");
            handled = true;
          } else if (
            combined.includes("username") ||
            combined.includes("user_name")
          ) {
            setError(registerForm, "userName", "This username is taken");
            handled = true;
          }
        }

        if (!handled) {
          const msg =
            errorData.message || error.message || "Registration failed";
          setErrorMessage(msg);
          toaster.error(msg);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        toaster.error("Network error or server unreachable");
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
                label="First Name"
                type="text"
                placeholder="John"
                value={field.value || ""}
                required
                disabled={registerForm.submitting}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error}
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
                label="Last Name"
                type="text"
                placeholder="Doe"
                value={field.value || ""}
                required
                disabled={registerForm.submitting}
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error}
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
              label="Username"
              type="text"
              placeholder="johndoe_123"
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
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
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={field.value || ""}
              required
              disabled={registerForm.submitting}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
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
              label="Password"
              type={showPassword() ? "text" : "password"}
              placeholder="Create a password"
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
                {field.error}
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
              label="Confirm Password"
              type={showConfirmPassword() ? "text" : "password"}
              placeholder="Confirm your password"
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
                {field.error}
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
                I agree to the{" "}
                <A
                  href="/terms"
                  class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium transition-colors underline-offset-2 hover:underline"
                >
                  Terms of Service
                </A>{" "}
                and{" "}
                <A
                  href="/privacy"
                  class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium transition-colors underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </A>
              </span>
            </label>
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
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
        {registerForm.submitting ? "Creating Account..." : "Create Account"}
      </Button>

      {/* Sign In Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <A
          href="/login"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium transition-colors underline-offset-2 hover:underline"
        >
          Sign in
        </A>
      </p>
    </Form>
  );
}
