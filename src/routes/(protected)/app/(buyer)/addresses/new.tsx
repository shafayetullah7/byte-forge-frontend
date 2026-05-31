import { Component, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate, A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { MapPinIcon, ChevronLeftIcon } from "~/components/icons";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { AdvancedSelect } from "~/components/ui/AdvancedSelect";
import { createAddress } from "~/lib/api/endpoints/buyer/address.api";
import { getDivisions } from "~/lib/api/endpoints/public/locations.api";
import type { CreateAddressRequest } from "~/lib/api/types/address.types";
import { toaster } from "~/components/ui/Toast";
import { buyerAddressSchema } from "~/schemas/buyer-address.schema";

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

const NewAddressPage: Component = () => {
    const { t } = useI18n();
    const navigate = useNavigate();

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

    const [errors, setErrors] = createStore<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    const handleInput = (field: keyof FormState, max: number) =>
        (e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            setForm(field, value.slice(0, max));
        };

    // Fetch divisions from public API
    const divisions = createAsync(() => getDivisions(), {
        deferStream: true,
    });

    // Selected division (to get its districts)
    const selectedDivision = createMemo(() =>
        divisions()?.find((d) => d.id === form.divisionId)
    );

    // District options for the selected division
    const districtOptions = createMemo(() =>
        selectedDivision()?.districts.map((d) => ({
            value: d.id,
            label: d.name,
        })) ?? []
    );

    // Reset district when division changes
    const handleDivisionChange = (id: string) => {
        setForm("divisionId", id);
        setForm("districtId", "");
    };

    const validate = (): boolean => {
        const fieldErrors: Record<string, string> = {};

        if (!form.divisionId.trim()) {
            fieldErrors.division = t("buyer.addresses.form.division.required");
        }

        if (!form.districtId.trim()) {
            fieldErrors.district = t("buyer.addresses.form.district.required");
        }

        const result = buyerAddressSchema.safeParse({
            label: form.label,
            recipientName: form.recipientName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: districtOptions().find((d) => d.value === form.districtId)?.label ?? "",
            state: selectedDivision()?.name,
            postalCode: form.postalCode,
            country: "Bangladesh",
            companyName: form.companyName,
            deliveryInstructions: form.deliveryInstructions,
            billingNotes: form.billingNotes,
            isDefault: form.isDefault,
        });

        if (!result.success) {
            for (const issue of result.error.issues) {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            }
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        const data: CreateAddressRequest = {
            type: "shipping",
            label: form.label.trim(),
            recipientName: form.recipientName.trim(),
            phone: form.phone.trim(),
            addressLine1: form.addressLine1.trim(),
            addressLine2: form.addressLine2.trim() || undefined,
            city: districtOptions().find((d) => d.value === form.districtId)?.label ?? "",
            state: selectedDivision()?.name,
            postalCode: form.postalCode.trim() || undefined,
            country: "Bangladesh",
            companyName: form.companyName.trim() || undefined,
            deliveryInstructions: form.deliveryInstructions.trim() || undefined,
            billingNotes: form.billingNotes.trim() || undefined,
            isDefault: form.isDefault,
        };

        try {
            await createAddress(data);
            toaster.success(t("buyer.addresses.form.success"));
            navigate("/app/addresses");
        } catch (error) {
            toaster.error(t("buyer.addresses.form.error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                                {t("buyer.addresses.form.pageTitle")}
                            </h1>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {t("buyer.addresses.form.pageSubtitle")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit}>
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        {/* Form Fields */}
                        <div class="p-6 space-y-5">
                            {/* Label */}
                            <Input
                                label={t("buyer.addresses.form.label.label")}
                                placeholder={t("buyer.addresses.form.label.placeholder")}
                                value={form.label}
                                onInput={handleInput("label", 50)}
                                error={errors.label}
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
                                    onInput={handleInput("recipientName", 100)}
                                    error={errors.recipientName}
                                    maxLength={100}
                                    required
                                />
                                <Input
                                    label={t("buyer.addresses.form.phone.label")}
                                    placeholder={t("buyer.addresses.form.phone.placeholder")}
                                    value={form.phone}
                                    onInput={handleInput("phone", 20)}
                                    error={errors.phone}
                                    maxLength={20}
                                    required
                                />
                            </div>

                            {/* Address Line 1 */}
                            <Input
                                label={t("buyer.addresses.form.addressLine1.label")}
                                placeholder={t("buyer.addresses.form.addressLine1.placeholder")}
                                value={form.addressLine1}
                                onInput={handleInput("addressLine1", 255)}
                                error={errors.addressLine1}
                                maxLength={255}
                                required
                            />

                            {/* Address Line 2 */}
                            <Input
                                label={`${t("buyer.addresses.form.addressLine2.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                placeholder={t("buyer.addresses.form.addressLine2.placeholder")}
                                value={form.addressLine2}
                                onInput={handleInput("addressLine2", 255)}
                                error={errors.addressLine2}
                                maxLength={255}
                            />

                            {/* Division & District */}
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <AdvancedSelect
                                    label={t("buyer.addresses.form.division.label")}
                                    placeholder={divisions() ? t("buyer.addresses.form.division.placeholder") : "Loading..."}
                                    value={form.divisionId || null}
                                    onChange={(val) => handleDivisionChange(val || "")}
                                    error={errors.division}
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
                                    error={errors.district}
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
                                    onInput={handleInput("postalCode", 20)}
                                    error={errors.postalCode}
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
                                    onInput={handleInput("companyName", 255)}
                                    error={errors.companyName}
                                    maxLength={255}
                                />
                            </div>

                            {/* Delivery Instructions */}
                            <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <Textarea
                                    label={`${t("buyer.addresses.form.deliveryInstructions.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                    placeholder={t("buyer.addresses.form.deliveryInstructions.placeholder")}
                                    value={form.deliveryInstructions}
                                    onInput={handleInput("deliveryInstructions", 1000)}
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
                                    onInput={handleInput("billingNotes", 1000)}
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
            </div>
        </div>
    );
};

export default NewAddressPage;
