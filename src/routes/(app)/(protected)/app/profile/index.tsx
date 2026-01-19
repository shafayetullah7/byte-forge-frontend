import { Component } from "solid-js";
import { useSession, performLogout } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { useNavigate } from "@solidjs/router";

const Profile: Component = () => {
    const user = useSession();
    const { t } = useI18n();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await performLogout();
        navigate("/login");
    };

    // Format date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                {/* Header */}
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t("buyer.profile.title")}
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        {t("buyer.profile.subtitle")}
                    </p>
                </div>

                {/* Profile Card */}
                <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Personal Information Section */}
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            {t("buyer.profile.personalInfo")}
                        </h2>
                        <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t("buyer.profile.fields.userName")}
                                </dt>
                                <dd class="text-base font-semibold text-gray-900 dark:text-white">
                                    {user()?.userName || "N/A"}
                                </dd>
                            </div>

                            {/* Email */}
                            <div>
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t("buyer.profile.fields.email")}
                                </dt>
                                <dd class="flex items-center gap-2">
                                    <span class="text-base font-semibold text-gray-900 dark:text-white">
                                        {user()?.email || "N/A"}
                                    </span>
                                    {user()?.emailVerified && (
                                        <span class="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                            </svg>
                                            {t("buyer.profile.status.verified")}
                                        </span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Account Information Section */}
                    <div class="p-6 bg-gray-50 dark:bg-forest-900/30">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            {t("buyer.profile.accountInfo")}
                        </h2>
                        <dl class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Status */}
                            <div>
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t("buyer.profile.fields.accountStatus")}
                                </dt>
                                <dd>
                                    <span class="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                                        {t("buyer.profile.status.active")}
                                    </span>
                                </dd>
                            </div>

                            {/* Member Since */}
                            <div>
                                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    {t("buyer.profile.fields.memberSince")}
                                </dt>
                                <dd class="text-base font-semibold text-gray-900 dark:text-white">
                                    {formatDate(user()?.createdAt)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Actions Section */}
                    <div class="p-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            {t("buyer.profile.actions.title")}
                        </h2>
                        <div class="flex flex-wrap gap-4">
                            {/* Edit Profile Button (Future) */}
                            <button
                                disabled
                                class="px-6 py-3 bg-forest-600 dark:bg-sage-600 text-white rounded-lg hover:bg-forest-700 dark:hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {t("buyer.profile.actions.edit")}
                            </button>

                            {/* Change Password Button (Future) */}
                            <button
                                disabled
                                class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {t("buyer.profile.actions.changePassword")}
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                class="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors font-medium"
                            >
                                {t("buyer.profile.actions.logout")}
                            </button>
                        </div>
                        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            * {t("buyer.profile.comingSoon")}
                        </p>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                        <div>
                            <h3 class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                {t("buyer.profile.securityTip.title")}
                            </h3>
                            <p class="text-sm text-blue-800 dark:text-blue-400">
                                {t("buyer.profile.securityTip.message")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
