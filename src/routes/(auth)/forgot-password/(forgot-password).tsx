import { A, useNavigate, action, useSubmission, useAction } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { authApi, ApiError } from "~/lib/api";
import { toaster } from "~/components/ui/Toast";
import { z } from "zod";
import { useI18n } from "~/i18n";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "auth.validation.emailRequired").email("auth.validation.invalidEmail"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Action
 */
const forgotPasswordAction = action(async (data: { email: string }) => {
  "use server";
  return await authApi.forgotPassword({ email: data.email });
}, "forgot-password-action");

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const forgotPasswordTrigger = useAction(forgotPasswordAction);
  const submission = useSubmission(forgotPasswordAction);
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

  const handleSubmit = (values: ForgotPasswordForm) => {
    setErrorMessage(null);
    forgotPasswordTrigger(values);
  };

  // Handle successful submission result (client-side persistence)
  createEffect(() => {
    if (submission.result) {
      const response = submission.result;

      const sessionData = {
        token: response.token,
        expiresAt: response.expiresAt,
        email: submission.input?.[0]?.email || ""
      };

      // Persist to localStorage for page reloads
      localStorage.setItem("byteforge_reset_verify", JSON.stringify(sessionData));

      toaster.success(t("auth.forgotPassword.success"));
      // Navigate to verify page with state
      navigate("/verify-reset", {
        state: sessionData
      });
    }
  });

  // Handle action errors
  createEffect(() => {
    if (submission.error) {
      const error = submission.error;
      const errorData = (error as any).response;

      if (errorData) {
        console.log("Error details from API:", errorData);
        const msg = errorData.message || (error as any).message || "auth.forgotPassword.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      } else {
        const msg = (error as any).message || "auth.forgotPassword.failed";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      }
      console.error("Forgot password action error:", submission.error);
    }
  });

  return (
    <div class="w-full sm:min-w-[360px] max-w-md mx-auto space-y-6">
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
                label={t("auth.login.emailLabel")}
                type="email"
                placeholder={t("auth.login.emailPlaceholder")}
                value={field.value || ""}
                required
                disabled={submission.pending}
              />
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
          disabled={submission.pending}
        >
          {submission.pending ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
        </Button>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400 pt-6 border-t border-gray-100 dark:border-forest-800">
          <A
            href="/login"
            class="text-terracotta-600 dark:text-terracotta-400 hover:text-terracotta-700 dark:hover:text-terracotta-300 font-bold transition-colors underline-offset-4 hover:underline"
          >
            {t("auth.forgotPassword.backToLogin")}
          </A>
        </p>
      </Form>
    </div>
  );
}
