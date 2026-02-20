import { useNavigate, action, useSubmission, useAction, redirect } from "@solidjs/router";
import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { Button, Input } from "~/components/ui";
import { verifySchema, type VerifyFormData } from "~/schemas/verify.schema";
import { authApi, ApiError } from "~/lib/api";
import { useSession } from "~/lib/auth";
import { toaster } from "~/components/ui/Toast";
import { useI18n } from "~/i18n";

/**
 * Send Verification Email Action
 */
const sendVerificationAction = action(async () => {
  "use server";
  return await authApi.sendVerificationEmail();
}, "send-verification-action");

/**
 * Verify Email Action
 */
const verifyEmailAction = action(async (data: VerifyFormData) => {
  "use server";
  await authApi.verifyEmail({
    otp: data.otp,
  });
  return { success: true };
}, "verify-email-action");

export default function VerifyAccount() {
  const navigate = useNavigate();
  const user = useSession();
  const { t } = useI18n();

  const sendVerificationTrigger = useAction(sendVerificationAction);
  const verifyEmailTrigger = useAction(verifyEmailAction);

  const sendSubmission = useSubmission(sendVerificationAction);
  const verifySubmission = useSubmission(verifyEmailAction);

  const [resendStatus, setResendStatus] = createSignal<string | null>(null);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  // Timer State
  const [expiresAt, setExpiresAt] = createSignal<Date | null>(null);
  const [timeLeft, setTimeLeft] = createSignal<string>("");
  const [canResend, setCanResend] = createSignal(false);
  const [cooldown, setCooldown] = createSignal(0);

  // Auto-redirect if verified
  createEffect(() => {
    if (user()?.emailVerified) {
      navigate("/", { replace: true });
    }
  });

  // Countdown Logic
  const updateTimer = () => {
    const expiry = expiresAt();
    if (!expiry) return;

    const now = new Date();
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft(t("auth.verifyAccount.expired"));
      setCanResend(true);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  createEffect(() => {
    if (cooldown() > 0) {
      const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
      onCleanup(() => clearInterval(timer));
    }
  });

  createEffect(() => {
    if (expiresAt()) {
      const timer = setInterval(updateTimer, 1000);
      onCleanup(() => clearInterval(timer));
      updateTimer(); // Initial call
    }
  });

  // Handle Send Verification Result
  createEffect(() => {
    if (sendSubmission.result) {
      const response = sendSubmission.result;
      if (response.expiresAt) {
        setExpiresAt(new Date(response.expiresAt));
        setCooldown(60);
        setResendStatus("sent");
        setTimeout(() => setResendStatus(null), 5000);
      }
    }
  });

  // Handle Send Verification Error
  createEffect(() => {
    if (sendSubmission.error) {
      console.log("Resend verification error caught:", sendSubmission.error);
      const error = sendSubmission.error;
      const errorData = (error as any).response;

      if (errorData && errorData.statusCode === 409) {
        // Already verified
        navigate("/", { replace: true });
        return;
      }

      const msg = errorData?.message || (error as any).message || "auth.verifyAccount.errorResend";
      setErrorMessage(msg.includes(".") ? t(msg) : msg);
    }
  });

  // Handle Verify Email Error
  createEffect(() => {
    if (verifySubmission.error) {
      console.log("Verify email error caught:", verifySubmission.error);
      const error = verifySubmission.error;
      const errorData = (error as any).response;

      if (errorData) {
        if (errorData.statusCode === 409) {
          navigate("/", { replace: true });
          return;
        }
        const msg = errorData.message || (error as any).message || "auth.verifyAccount.errorVerify";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      } else {
        const msg = (error as any).message || "auth.verifyAccount.errorUnexpected";
        setErrorMessage(msg.includes(".") ? t(msg) : msg);
      }
    }
  });

  // Handle successful verification
  createEffect(() => {
    if (verifySubmission.result?.success) {
      toaster.success(t("auth.verifyAccount.success") || "Account verified successfully!");
      navigate("/", { replace: true });
    }
  });

  onMount(() => {
    // Auto-trigger on mount
    if (user() && !user()?.emailVerified && !sendSubmission.pending) {
      sendVerificationTrigger();
    }
  });

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

  const handleSubmit = (values: VerifyFormData) => {
    setErrorMessage(null);
    verifyEmailTrigger(values);
  };

  const handleResend = () => {
    if (cooldown() > 0) return;
    setErrorMessage(null);
    sendVerificationTrigger();
  };

  return (
    <div class="w-full sm:min-w-[400px] max-w-md mx-auto">
      <Form onSubmit={handleSubmit} class="space-y-6">
        {/* Error Message Display */}
        {errorMessage() && (
          <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
          </div>
        )}

        {/* Success/Info Message */}
        <div class="text-center space-y-2">
          {timeLeft() && (
            <p class="text-sm font-medium text-forest-600 dark:text-sage-400 bg-forest-50 dark:bg-forest-900/20 py-1 px-3 rounded-full inline-block">
              {t("auth.verifyAccount.expiresIn")} {timeLeft()}
            </p>
          )}
          {resendStatus() === "sent" && (
            <p class="text-sm text-green-600 dark:text-green-400 animate-fade-in">
              {t("auth.verifyAccount.resendSent")}
            </p>
          )}
        </div>

        {/* Verification Code Field */}
        <Field name="otp">
          {(field, props) => (
            <div>
              <Input
                {...props}
                label={t("auth.verifyAccount.otpLabel")}
                type="text"
                placeholder={t("auth.verifyAccount.otpPlaceholder")}
                maxlength={6}
                value={field.value || ""}
                required
                disabled={verifySubmission.pending}
                autocomplete="one-time-code"
              />
              {field.error && (
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {field.error.includes(".") ? t(field.error) : field.error}
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
          disabled={verifySubmission.pending}
        >
          {verifySubmission.pending ? t("auth.verifyAccount.submitting") : t("auth.verifyAccount.submit")}
        </Button>

        {/* Resend Code Link */}
        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {t("auth.verifyAccount.notReceived")}
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={verifySubmission.pending || sendSubmission.pending || cooldown() > 0}
            class="text-forest-600 dark:text-sage-400 hover:text-forest-700 dark:hover:text-sage-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {sendSubmission.pending
              ? t("auth.verifyAccount.resending")
              : cooldown() > 0
                ? `${t("auth.verifyAccount.resendAvailable")} ${cooldown()}s`
                : t("auth.verifyAccount.resend")}
          </button>
        </div>

        <div class="text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={async () => {
              const { performLogout } = await import("~/lib/auth");
              await performLogout();
              navigate("/login");
            }}
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {t("auth.verifyAccount.notYou")}
          </button>
        </div>
      </Form>
    </div>
  );
}
