import { Component, createMemo, createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, A, createAsync, action, useAction, useSubmission, useParams } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { MapPinIcon, ChevronLeftIcon } from "~/components/icons";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { AdvancedSelect } from "~/components/ui/AdvancedSelect";
import { updateAddress, invalidateAddresses, getAddressById } from "~/lib/api/endpoints/buyer/address.api";
import { getDivisions } from "~/lib/api/endpoints/public/locations.api";
import { ApiError } from "~/lib/api/types";
import { toaster } from "~/components/ui/Toast";
import { buyerAddressSchema } from "~/schemas/buyer-address.schema";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { AddressSkeleton } from "../__components__";

interface FormState {
    label: string;
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    divisionId: string;
    districtId: string;
    postalCode: string;
    companyName: string;
    deliveryInstructions: string;
    billingNotes: string;
    isDefault: boolean;
}

interface UpdateAddressActionData {
    id: string;
    data: ReturnType<typeof buildDto>;
}

const updateAddressAction = action(async (input: UpdateAddressActionData) => {
    "use server";
    try {
        await updateAddress(input.id, input.data);
        invalidateAddresses();
        return { success: true };
    } catch (error) {
        const apiError = error as ApiError;
        return {
            success: false,
            error: {
                statusCode: apiError.statusCode,
                message: apiError.response?.message ?? apiError.message,
                validationErrors: apiError.response?.validationErrors,
            },
        };
    }
}, "update-address-action");

const buildDto = (form: FormState) => {
    return {
        label: form.label,
        recipientName: form.recipientName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || null,
        districtId: form.districtId,
        divisionId: form.divisionId,
        postalCode: form.postalCode || null,
        country: "Bangladesh",
        companyName: form.companyName || null,
        deliveryInstructions: form.deliveryInstructions || null,
        billingNotes: form.billingNotes || null,
        isDefault: form.isDefault,
    };
};

const EditAddressPage: Component = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams<{ address_id: string }>();

    const address = createAsync(
        () => getAddressById(params.address_id),
        { deferStream: true }
    );

    const [form, setForm] = createStore<FormState>({
        label: "",
        recipientName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        divisionId: "",
        districtId: "",
        postalCode: "",
        companyName: "",
        deliveryInstructions: "",
        billingNotes: "",
        isDefault: false,
    });

    const [initialized, setInitialized] = createSignal(false);

    createMemo(() => {
        const addr = address();
        if (addr && !initialized()) {
            setForm({
                label: addr.label,
                recipientName: addr.recipientName,
                phone: addr.phone,
                addressLine1: addr.addressLine1,
                addressLine2: addr.addressLine2 ?? "",
                divisionId: addr.divisionId,
                districtId: addr.districtId,
                postalCode: addr.postalCode ?? "",
                companyName: addr.companyName ?? "",
                deliveryInstructions: addr.deliveryInstructions ?? "",
                billingNotes: addr.billingNotes ?? "",
                isDefault: addr.isDefault,
            });
            setInitialized(true);
        }
    });

    const [errors, setErrors] = createStore<Record<string, string | undefined>>({});

    const updateAddressTrigger = useAction(updateAddressAction);
    const addressSubmission = useSubmission(updateAddressAction);
    const isSubmitting = () => addressSubmission.pending;

    const getErrorMessage = (error: string | undefined): string | undefined => {
        if (!error) return undefined;
        if (error.includes(".") && error.startsWith("buyer.")) {
            return t(error as any);
        }
        return error;
    };

    const handleInput = (field: keyof FormState) =>
        (e: InputEvent) => {
            const target = e.target as HTMLInputElement;
            setForm(field, target.value);
            if (errors[field]) {
                setErrors(field, undefined);
            }
        };

    const divisions = createAsync(() => getDivisions(), {
        deferStream: true,
    });

    const selectedDivision = createMemo(() =>
        divisions()?.find((d) => d.id === form.divisionId)
    );

    const districtOptions = createMemo(() =>
        selectedDivision()?.districts.map((d) => ({
            value: d.id,
            label: d.name,
        })) ?? []
    );

    const handleDivisionChange = (id: string) => {
        setForm("divisionId", id);
        setForm("districtId", "");
    };

    const validate = (): ReturnType<typeof buildDto> | null => {
        const fieldErrors: Record<string, string> = {};

        if (!form.divisionId.trim()) {
            fieldErrors.division = "buyer.addresses.validation.divisionRequired";
        }

        if (!form.districtId.trim()) {
            fieldErrors.district = "buyer.addresses.validation.districtRequired";
        }

        const dto = buildDto(form);

        const result = buyerAddressSchema.safeParse(dto);

        if (!result.success) {
            for (const issue of result.error.issues) {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            }
        }

        setErrors(() => fieldErrors);

        if (Object.keys(fieldErrors).length > 0) {
            return null;
        }

        return dto;
    };

    createEffect(() => {
        const result = addressSubmission.result;
        if (!result) return;

        if (result.success === true) {
            toaster.success(t("buyer.addresses.form.updateSuccess"));
            navigate("/app/addresses");
        } else if (result.success === false && result.error) {
            const err = result.error;
            if (err.statusCode === 400 && err.validationErrors) {
                const fieldErrors: Record<string, string> = {};
                for (const ve of err.validationErrors) {
                    fieldErrors[ve.field] = ve.message;
                }
                setErrors(() => fieldErrors);
                toaster.error(t("buyer.addresses.form.validationError"));
            } else if (err.statusCode === 401) {
                toaster.error(t("buyer.addresses.form.unauthorized"));
            } else if (err.statusCode === 404) {
                toaster.error(t("buyer.addresses.form.notFound"));
                navigate("/app/addresses");
            } else if (err.statusCode === 409) {
                toaster.error(t("buyer.addresses.form.conflict"));
            } else {
                toaster.error(err.message || t("buyer.addresses.form.error"));
            }
        }
    });

    const handleSubmit = (e: Event) => {
        e.preventDefault();

        const parsed = validate();
        if (!parsed) return;

        updateAddressTrigger({ id: params.address_id, data: parsed });
    };

    return (
        <SafeErrorBoundary
            fallback={(err, reset) => (
                <InlineErrorFallback error={err} reset={reset} label={t("buyer.addresses.title")} />
            )}
        >
        <div class="min-h-screen py-8">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div class="mb-8">
                    <div class="flex items-center gap-3">
                        <A
                            href="/app/addresses"
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </A>
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
                            <MapPinIcon class="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {t("buyer.addresses.form.editTitle")}
                            </h1>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {t("buyer.addresses.form.editSubtitle")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {(() => {
                    const addr = address();
                    if (!addr && !initialized()) {
                        return <AddressSkeleton />;
                    }

                    return (
                        <form onSubmit={handleSubmit}>
                            <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                {/* Form Fields */}
                                <div class="p-6 space-y-5">
                                    {/* Label */}
                                    <Input
                                        label={t("buyer.addresses.form.label.label")}
                                        placeholder={t("buyer.addresses.form.label.placeholder")}
                                        value={form.label}
                                        onInput={handleInput("label")}
                                        error={getErrorMessage(errors.label)}
                                        maxLength={50}
                                        required
                                    />
                                    <p class="text-xs text-gray-500 dark:text-gray-400 -mt-3">
                                        {t("buyer.addresses.form.label.hint")}
                                    </p>

                                    {/* Recipient Name & Phone */}
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input
                                            label={t("buyer.addresses.form.recipientName.label")}
                                            placeholder={t("buyer.addresses.form.recipientName.placeholder")}
                                            value={form.recipientName}
                                            onInput={handleInput("recipientName")}
                                            error={getErrorMessage(errors.recipientName)}
                                            maxLength={100}
                                            required
                                        />
                                        <Input
                                            label={t("buyer.addresses.form.phone.label")}
                                            placeholder={t("buyer.addresses.form.phone.placeholder")}
                                            value={form.phone}
                                            onInput={handleInput("phone")}
                                            error={getErrorMessage(errors.phone)}
                                            maxLength={20}
                                            required
                                        />
                                    </div>

                                    {/* Address Line 1 */}
                                    <Input
                                        label={t("buyer.addresses.form.addressLine1.label")}
                                        placeholder={t("buyer.addresses.form.addressLine1.placeholder")}
                                        value={form.addressLine1}
                                        onInput={handleInput("addressLine1")}
                                        error={getErrorMessage(errors.addressLine1)}
                                        maxLength={255}
                                        required
                                    />

                                    {/* Address Line 2 */}
                                    <Input
                                        label={`${t("buyer.addresses.form.addressLine2.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                        placeholder={t("buyer.addresses.form.addressLine2.placeholder")}
                                        value={form.addressLine2}
                                        onInput={handleInput("addressLine2")}
                                        error={getErrorMessage(errors.addressLine2)}
                                        maxLength={255}
                                    />

                                    {/* Division & District */}
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                         <AdvancedSelect
                                            label={t("buyer.addresses.form.division.label")}
                                            placeholder={divisions() ? t("buyer.addresses.form.division.placeholder") : "Loading..."}
                                            value={form.divisionId || null}
                                            onChange={(val) => handleDivisionChange(val || "")}
                                            error={getErrorMessage(errors.division)}
                                            disabled={!divisions()}
                                            required
                                            allowClear
                                            options={divisions()?.map((d) => ({
                                                value: d.id,
                                                label: d.name,
                                            })) ?? []}
                                        />
                                        <AdvancedSelect
                                            label={t("buyer.addresses.form.district.label")}
                                            placeholder={t("buyer.addresses.form.district.placeholder")}
                                            value={form.districtId || null}
                                            onChange={(val) => setForm("districtId", val || "")}
                                            error={getErrorMessage(errors.district)}
                                            disabled={!form.divisionId}
                                            required
                                            allowClear
                                            options={districtOptions()}
                                        />
                                    </div>

                                    {/* Postal Code & Country */}
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                         <Input
                                            label={`${t("buyer.addresses.form.postalCode.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                            placeholder={t("buyer.addresses.form.postalCode.placeholder")}
                                            value={form.postalCode}
                                            onInput={handleInput("postalCode")}
                                            error={getErrorMessage(errors.postalCode)}
                                            maxLength={20}
                                        />
                                        <Input
                                            label={t("buyer.addresses.form.country.label")}
                                            value="Bangladesh"
                                            readonly
                                            disabled
                                        />
                                    </div>

                                    {/* Company Name */}
                                    <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                         <Input
                                            label={`${t("buyer.addresses.form.companyName.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                            placeholder={t("buyer.addresses.form.companyName.placeholder")}
                                            value={form.companyName}
                                            onInput={handleInput("companyName")}
                                            error={getErrorMessage(errors.companyName)}
                                            maxLength={255}
                                        />
                                    </div>

                                    {/* Delivery Instructions */}
                                    <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                         <Textarea
                                            label={`${t("buyer.addresses.form.deliveryInstructions.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                            placeholder={t("buyer.addresses.form.deliveryInstructions.placeholder")}
                                            value={form.deliveryInstructions}
                                            onInput={handleInput("deliveryInstructions")}
                                            error={getErrorMessage(errors.deliveryInstructions)}
                                            rows={4}
                                            maxLength={1000}
                                        />
                                    </div>

                                    {/* Billing Notes */}
                                    <div class="pt-2">
                                         <Textarea
                                            label={`${t("buyer.addresses.form.billingNotes.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                            placeholder={t("buyer.addresses.form.billingNotes.placeholder")}
                                            value={form.billingNotes}
                                            onInput={handleInput("billingNotes")}
                                            error={getErrorMessage(errors.billingNotes)}
                                            rows={4}
                                            maxLength={1000}
                                        />
                                    </div>

                                    {/* Set as Default */}
                                    <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <label class="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.isDefault}
                                                onChange={(e) => setForm("isDefault", e.currentTarget.checked)}
                                                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-forest-600 dark:text-sage-600 focus:ring-forest-500 dark:focus:ring-sage-500 cursor-pointer"
                                            />
                                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t("buyer.addresses.form.isDefault.label")}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div class="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-forest-900/30 rounded-b-xl">
                                    <A
                                        href="/app/addresses"
                                        class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold text-sm transition-colors"
                                    >
                                        {t("common.cancel")}
                                    </A>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting()}
                                        class="px-6 py-2.5 rounded-xl bg-forest-600 dark:bg-sage-600 hover:bg-forest-700 dark:hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        {isSubmitting() && (
                                            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        )}
                                        {isSubmitting() ? t("buyer.addresses.form.submitting") : t("buyer.addresses.form.submit")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    );
                })()}
            </div>
        </div>
        </SafeErrorBoundary>
    );
};

export default EditAddressPage;
