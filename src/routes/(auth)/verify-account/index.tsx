import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { verifySchema, type VerifyFormData } from "~/schemas/verify.schema";
import { authApi, ApiError } from "~/lib/api";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [resendStatus, setResendStatus] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  const [verifyForm, { Form, Field }] = createForm<VerifyFormData>({
    validate: (values) => {
      const result = verifySchema.safeParse(values);
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

  const handleSubmit = async (values: VerifyFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await authApi.verifyEmail({
        otp: values.otp,
      });

      if (response.success) {
        console.log("Verification successful");
        // Redirect to login after successful verification
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(
          error.message || "Verification failed. Please check the code."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResendStatus("sending");
    setErrorMessage(null);

    try {
      const response = await authApi.sendVerificationEmail();
      if (response.success) {
        setResendStatus("sent");
        setTimeout(() => setResendStatus(null), 5000);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(
          error.message || "Failed to resend verification email."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setResendStatus(null);
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

      {/* Success Message for Resend */}
      {resendStatus() === "sent" && (
        <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p class="text-sm text-green-600 dark:text-green-400">
            A new verification code has been sent to your email.
          </p>
        </div>
      )}

      {/* Verification Code Field */}
      <Field name="otp">
        {(field, props) => (
          <div>
            <Input
              {...props}
              label="Verification Code"
              type="text"
              placeholder="Enter 6-digit code"
              maxlength={6}
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

      {/* Verify Button */}
      <Button
        variant="primary"
        class="w-full"
        type="submit"
        disabled={isSubmitting()}
      >
        {isSubmitting() ? "Verifying..." : "Verify Account"}
      </Button>

      {/* Resend Code Link */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isSubmitting() || resendStatus() === "sending"}
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium disabled:opacity-50"
        >
          {resendStatus() === "sending" ? "Sending..." : "Resend Code"}
        </button>
      </p>

      {/* Back to Login */}
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        <A
          href="/login"
          class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium"
        >
          Back to Sign In
        </A>
      </p>
    </Form>
  );
}
