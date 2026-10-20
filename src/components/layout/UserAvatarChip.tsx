import { A } from "@solidjs/router";
import { getInitials } from "~/lib/utils/string.utils";
import { useI18n } from "~/i18n";

export interface UserAvatarChipUser {
  userName: string;
  email: string;
}

const AVATAR_SIZE_CLASS = {
  md:
    "w-8 h-8 text-xs font-bold ring-2 ring-white dark:ring-forest-800 shadow-sm",
  sm: "w-6 h-6 text-[10px] font-semibold ring-1 ring-cream-200 dark:ring-forest-600",
} as const;

const AVATAR_BASE_CLASS =
  "rounded-full bg-linear-to-br from-forest-500 to-forest-600 dark:from-forest-400 dark:to-forest-500 text-white dark:text-cream-50 flex items-center justify-center shrink-0";

export function UserAvatarChip(props: {
  user: UserAvatarChipUser;
  size?: keyof typeof AVATAR_SIZE_CLASS;
  class?: string;
}) {
  const size = () => props.size ?? "md";
  const displayName = () =>
    props.user.userName || props.user.email?.split("@")[0] || "U";

  return (
    <div
      class={`${AVATAR_BASE_CLASS} ${AVATAR_SIZE_CLASS[size()]} ${props.class ?? ""}`}
      aria-hidden="true"
    >
      {getInitials(displayName())}
    </div>
  );
}

export function MobileHeaderAccountLink(props: { user: UserAvatarChipUser }) {
  const { t } = useI18n();

  return (
    <A
      href="/app"
      class="p-2.5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/30"
      aria-label={t("landing.nav.accountAriaLabel")}
    >
      <UserAvatarChip user={props.user} size="sm" />
    </A>
  );
}
