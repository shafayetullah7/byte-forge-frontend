import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { loginSchema, type LoginFormData } from "~/schemas/login.schema";
import { authApi, ApiError } from "~/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

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

  const handleSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await authApi.login({
        email: values.email,
        password: values.password,
      });

      if (response.success) {
        console.log("Login successful:", response.data);
        // On success, redirect to dashboard or home
        navigate("/");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(
          error.message || "Login failed. Please check your credentials."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} class="space-y-6">
      {/* Error Message Display */}
      {errorMessage() && (
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
        </div>
      )}

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
              disabled={isSubmitting()}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Password Field */}
      <Field name="password">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={field.value || ""}
              required
              disabled={isSubmitting()}
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {field.error}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Remember Me & Forgot Password */}
      <div class="flex items-center justify-between">
        <Field name="rememberMe" type="boolean">
          {(field, props) => (
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                {...props}
                type="checkbox"
                checked={field.value}
                class="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                disabled={isSubmitting()}
              />
              Remember me
            </label>
          )}
        </Field>
        <A
          href="/forgot-password"
          class="text-sm text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300"
        >
          Forgot password?
        </A>
      </div>

      {/* Sign In Button */}
      <Button
        variant="primary"
        class="w-full"
        type="submit"
        disabled={isSubmitting()}
      >
        {isSubmitting() ? "Signing In..." : "Sign In"}
      </Button>

      {/* Sign Up Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <A
          href="/register"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
        >
          Create one now
        </A>
      </p>
    </Form>
  );
}
