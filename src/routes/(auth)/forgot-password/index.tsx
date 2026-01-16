import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const [forgotForm, { Form, Field }] = createForm<ForgotPasswordForm>({
    validate: (values) => {
      const result = forgotPasswordSchema.safeParse(values);
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

  const handleSubmit = async (values: ForgotPasswordForm) => {
    setErrorMessage(null);

    try {
      const response = await authApi.forgotPassword({ email: values.email });
      if (response.success) {
        const sessionData = {
          token: response.data?.token,
          expiresAt: response.data?.expiresAt,
          email: values.email
        };

        // Persist to localStorage for page reloads
        localStorage.setItem("byteforge_reset_verify", JSON.stringify(sessionData));

        toaster.success(response.message || "Reset code sent!");
        // Navigate to verify page with state (optional now, but good for immediate transition)
        navigate("/verify-reset", {
          state: sessionData
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div class="space-y-6">


      <Form onSubmit={handleSubmit} class="space-y-6">
        {errorMessage() && (
          <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
          </div>
        )}

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
                disabled={forgotForm.submitting}
              />
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
          disabled={forgotForm.submitting}
        >
          {forgotForm.submitting ? "Sending..." : "Send Reset Code"}
        </Button>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
          <A
            href="/login"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Back to Sign In
          </A>
        </p>
      </Form>
    </div>
  );
}
