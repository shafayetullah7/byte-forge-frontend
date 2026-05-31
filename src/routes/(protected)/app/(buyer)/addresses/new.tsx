import { Component, createSignal, createMemo } from "solid-js";
import { useNavigate, A, createAsync } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { MapPinIcon, ChevronLeftIcon } from "~/components/icons";
import Input from "~/components/ui/Input";
import Textarea from "~/components/ui/Textarea";
import { AdvancedSelect } from "~/components/ui/AdvancedSelect";
import { createAddress } from "~/lib/api/endpoints/buyer/address.api";
import { getDivisions } from "~/lib/api/endpoints/public/locations.api";
import type { AddressType, CreateAddressRequest } from "~/lib/api/types/address.types";
import { toaster } from "~/components/ui/Toast";

const NewAddressPage: Component = () => {
    const { t } = useI18n();
    const navigate = useNavigate();

    const [addressType, setAddressType] = createSignal<AddressType>("shipping");
    const [label, setLabel] = createSignal("");
    const [recipientName, setRecipientName] = createSignal("");
    const [phone, setPhone] = createSignal("");
    const [addressLine1, setAddressLine1] = createSignal("");
    const [addressLine2, setAddressLine2] = createSignal("");
    const [divisionId, setDivisionId] = createSignal("");
    const [districtId, setDistrictId] = createSignal("");
    const [postalCode, setPostalCode] = createSignal("");
    const [companyName, setCompanyName] = createSignal("");
    const [gstin, setGstin] = createSignal("");
    const [deliveryInstructions, setDeliveryInstructions] = createSignal("");
    const [billingNotes, setBillingNotes] = createSignal("");
    const [isDefault, setIsDefault] = createSignal(false);

    const [errors, setErrors] = createSignal<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    // Fetch divisions from public API
    const divisions = createAsync(() => getDivisions(), {
        deferStream: true,
    });

    // Selected division (to get its districts)
    const selectedDivision = createMemo(() =>
        divisions()?.find((d) => d.id === divisionId())
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
        setDivisionId(id);
        setDistrictId("");
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!label().trim()) {
            newErrors.label = t("common.required");
        } else if (label().trim().length > 50) {
            newErrors.label = "Label cannot exceed 50 characters";
        }

        if (!recipientName().trim()) {
            newErrors.recipientName = t("common.required");
        } else if (recipientName().trim().length > 100) {
            newErrors.recipientName = "Recipient name cannot exceed 100 characters";
        }

        if (!phone().trim()) {
            newErrors.phone = t("common.required");
        } else if (phone().trim().length > 20) {
            newErrors.phone = "Phone number cannot exceed 20 characters";
        }

        if (!addressLine1().trim()) {
            newErrors.addressLine1 = t("buyer.addresses.form.addressLine1.required");
        } else if (addressLine1().trim().length > 255) {
            newErrors.addressLine1 = "Address line 1 cannot exceed 255 characters";
        }

        if (!divisionId().trim()) {
            newErrors.division = t("buyer.addresses.form.division.required");
        }

        if (!districtId().trim()) {
            newErrors.district = t("buyer.addresses.form.district.required");
        }

        if (addressLine2().trim().length > 255) {
            newErrors.addressLine2 = "Address line 2 cannot exceed 255 characters";
        }

        if (postalCode().trim().length > 20) {
            newErrors.postalCode = "Postal code cannot exceed 20 characters";
        }

        if (companyName().trim().length > 255) {
            newErrors.companyName = "Company name cannot exceed 255 characters";
        }

        if (gstin().trim().length > 20) {
            newErrors.gstin = "GSTIN cannot exceed 20 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        const data: CreateAddressRequest = {
            type: addressType(),
            label: label().trim(),
            recipientName: recipientName().trim(),
            phone: phone().trim(),
            addressLine1: addressLine1().trim(),
            addressLine2: addressLine2().trim() || undefined,
            city: districtOptions().find((d) => d.value === districtId())?.label ?? "",
            state: selectedDivision()?.name,
            postalCode: postalCode().trim() || undefined,
            country: "Bangladesh",
            companyName: companyName().trim() || undefined,
            gstin: gstin().trim() || undefined,
            deliveryInstructions: deliveryInstructions().trim() || undefined,
            billingNotes: billingNotes().trim() || undefined,
            isDefault: isDefault(),
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
                        {/* Address Type Selection */}
                        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                {t("buyer.addresses.form.addressType.label")} <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAddressType("shipping")}
                                    class={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                        addressType() === "shipping"
                                            ? "border-forest-500 dark:border-forest-400 bg-forest-50 dark:bg-forest-900/30"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <div class={`p-2 rounded-lg ${
                                        addressType() === "shipping"
                                            ? "bg-forest-100 dark:bg-forest-900/40"
                                            : "bg-gray-100 dark:bg-gray-700"
                                    }`}>
                                        <MapPinIcon class={`w-5 h-5 ${
                                            addressType() === "shipping"
                                                ? "text-forest-600 dark:text-sage-400"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`} />
                                    </div>
                                    <span class={`text-sm font-semibold ${
                                        addressType() === "shipping"
                                            ? "text-forest-800 dark:text-cream-50"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}>
                                        {t("buyer.addresses.form.addressType.shipping")}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAddressType("billing")}
                                    class={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                        addressType() === "billing"
                                            ? "border-sage-500 dark:border-sage-400 bg-sage-50 dark:bg-sage-900/30"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                >
                                    <div class={`p-2 rounded-lg ${
                                        addressType() === "billing"
                                            ? "bg-sage-100 dark:bg-sage-900/40"
                                            : "bg-gray-100 dark:bg-gray-700"
                                    }`}>
                                        <svg class={`w-5 h-5 ${
                                            addressType() === "billing"
                                                ? "text-sage-600 dark:text-sage-400"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <span class={`text-sm font-semibold ${
                                        addressType() === "billing"
                                            ? "text-sage-800 dark:text-cream-50"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}>
                                        {t("buyer.addresses.form.addressType.billing")}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div class="p-6 space-y-5">
                            {/* Label */}
                            <Input
                                label={t("buyer.addresses.form.label.label")}
                                placeholder={t("buyer.addresses.form.label.placeholder")}
                                value={label()}
                                onInput={(e) => setLabel(e.currentTarget.value)}
                                error={errors().label}
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
                                    value={recipientName()}
                                    onInput={(e) => setRecipientName(e.currentTarget.value)}
                                    error={errors().recipientName}
                                    required
                                />
                                <Input
                                    label={t("buyer.addresses.form.phone.label")}
                                    placeholder={t("buyer.addresses.form.phone.placeholder")}
                                    value={phone()}
                                    onInput={(e) => setPhone(e.currentTarget.value)}
                                    error={errors().phone}
                                    required
                                />
                            </div>

                            {/* Address Line 1 */}
                            <Input
                                label={t("buyer.addresses.form.addressLine1.label")}
                                placeholder={t("buyer.addresses.form.addressLine1.placeholder")}
                                value={addressLine1()}
                                onInput={(e) => setAddressLine1(e.currentTarget.value)}
                                error={errors().addressLine1}
                                required
                            />

                            {/* Address Line 2 */}
                            <Input
                                label={`${t("buyer.addresses.form.addressLine2.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                placeholder={t("buyer.addresses.form.addressLine2.placeholder")}
                                value={addressLine2()}
                                onInput={(e) => setAddressLine2(e.currentTarget.value)}
                                error={errors().addressLine2}
                            />

                            {/* Division & District */}
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <AdvancedSelect
                                    label={t("buyer.addresses.form.division.label")}
                                    placeholder={divisions() ? t("buyer.addresses.form.division.placeholder") : "Loading..."}
                                    value={divisionId() || null}
                                    onChange={(val) => handleDivisionChange(val || "")}
                                    error={errors().division}
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
                                    value={districtId() || null}
                                    onChange={(val) => setDistrictId(val || "")}
                                    error={errors().district}
                                    disabled={!divisionId()}
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
                                    value={postalCode()}
                                    onInput={(e) => setPostalCode(e.currentTarget.value)}
                                    error={errors().postalCode}
                                />
                                <Input
                                    label={t("buyer.addresses.form.country.label")}
                                    value="Bangladesh"
                                    readonly
                                    disabled
                                />
                            </div>

                            {/* Company Name & GSTIN (for billing) */}
                            {addressType() === "billing" && (
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <Input
                                        label={`${t("buyer.addresses.form.companyName.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                        placeholder={t("buyer.addresses.form.companyName.placeholder")}
                                        value={companyName()}
                                        onInput={(e) => setCompanyName(e.currentTarget.value)}
                                        error={errors().companyName}
                                    />
                                    <Input
                                        label={`${t("buyer.addresses.form.gstin.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                        placeholder={t("buyer.addresses.form.gstin.placeholder")}
                                        value={gstin()}
                                        onInput={(e) => setGstin(e.currentTarget.value)}
                                        error={errors().gstin}
                                    />
                                </div>
                            )}

                            {/* Delivery Instructions */}
                            <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <Textarea
                                    label={`${t("buyer.addresses.form.deliveryInstructions.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                    placeholder={t("buyer.addresses.form.deliveryInstructions.placeholder")}
                                    value={deliveryInstructions()}
                                    onInput={(e) => setDeliveryInstructions(e.currentTarget.value)}
                                    rows={4}
                                />
                            </div>

                            {/* Billing Notes (billing only) */}
                            {addressType() === "billing" && (
                                <div class="pt-2">
                                    <Textarea
                                        label={`${t("buyer.addresses.form.billingNotes.label")} (${t("buyer.addresses.form.addressLine2.optional")})`}
                                        placeholder={t("buyer.addresses.form.billingNotes.placeholder")}
                                        value={billingNotes()}
                                        onInput={(e) => setBillingNotes(e.currentTarget.value)}
                                        rows={4}
                                    />
                                </div>
                            )}

                            {/* Set as Default */}
                            <div class="pt-2 border-t border-gray-100 dark:border-gray-700">
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isDefault()}
                                        onChange={(e) => setIsDefault(e.currentTarget.checked)}
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
