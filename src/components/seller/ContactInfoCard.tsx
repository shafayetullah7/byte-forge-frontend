import type { ShopContact } from "~/lib/api/endpoints/seller/shop-detail.api";
import { useI18n } from "~/i18n";
import { EnvelopeIcon, PhoneIcon, PencilIcon, ArrowTopRightOnSquareIcon, ChatBubbleLeftRightIcon } from "~/components/icons";

interface ContactInfoCardProps {
  contact: ShopContact | null;
  onEdit?: () => void;
}

interface ContactItemProps {
  icon: string;
  label: string;
  value: string;
  href: string;
  color: "terracotta" | "forest" | "green" | "blue" | "gray";
  isExternal?: boolean;
}

function ContactItem(props: ContactItemProps) {
  const colorClasses = {
    terracotta: "from-terracotta-500 to-terracotta-600 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20",
    forest: "from-forest-500 to-forest-600 hover:bg-forest-50 dark:hover:bg-forest-900/20",
    green: "from-green-500 to-green-600 hover:bg-green-50 dark:hover:bg-green-900/20",
    blue: "from-blue-500 to-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    gray: "from-gray-600 to-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
  };

  const textColors = {
    terracotta: "hover:text-terracotta-600 dark:hover:text-terracotta-400",
    forest: "hover:text-forest-600 dark:hover:text-forest-400",
    green: "hover:text-green-600 dark:hover:text-green-400",
    blue: "hover:text-blue-600 dark:hover:text-blue-400",
    gray: "hover:text-gray-600 dark:hover:text-gray-400",
  };

  return (
    <a
      href={props.href}
      target={props.isExternal ? "_blank" : undefined}
      rel={props.isExternal ? "noopener noreferrer" : undefined}
      class={`group flex items-center gap-3 p-3 rounded-xl transition-all ${colorClasses[props.color]}`}
    >
      <div class={`w-9 h-9 rounded-lg bg-gradient-to-br ${colorClasses[props.color].split(' ')[0] + ' ' + colorClasses[props.color].split(' ')[1]} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={props.icon} />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{props.label}</p>
        <p class={`text-gray-900 dark:text-gray-100 font-medium truncate ${textColors[props.color]} transition-colors`}>
          {props.value}
        </p>
      </div>
      {props.isExternal && <ArrowTopRightOnSquareIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />}
    </a>
  );
}

export default function ContactInfoCard(props: ContactInfoCardProps) {
  const { t } = useI18n();
  const contact = props.contact;

  const hasContact = contact && (
    contact.businessEmail ||
    contact.phone ||
    contact.alternativePhone ||
    contact.whatsapp ||
    contact.telegram
  );

  const hasSocial = contact && (
    contact.facebook ||
    contact.instagram ||
    contact.x
  );

  return (
    <div class="bg-white dark:bg-forest-800 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Card Header */}
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-md shadow-forest-500/20">
            <EnvelopeIcon class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t("seller.shop.myShop.contactAndSocial.title")}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {t("seller.shop.myShop.contactAndSocial.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={props.onEdit}
          class="p-2 text-gray-400 hover:text-terracotta-500 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 rounded-lg transition-all" 
          title={t("common.edit")}
          disabled={!props.onEdit}
        >
          <PencilIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta-500 to-terracotta-600 flex items-center justify-center">
              <PhoneIcon class="w-4 h-4 text-white" />
            </div>
            <h4 class="font-bold text-gray-900 dark:text-gray-100">
              {t("seller.shop.myShop.contactAndSocial.contactDetails")}
            </h4>
          </div>

          {hasContact ? (
            <div class="space-y-2.5">
              {contact?.businessEmail && (
                <ContactItem
                  icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  label={t("seller.shop.myShop.contactAndSocial.email")}
                  value={contact.businessEmail}
                  href={`mailto:${contact.businessEmail}`}
                  color="terracotta"
                />
              )}

              {contact?.phone && contact.phone.trim() !== '' && (
                <ContactItem
                  icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  label={t("seller.shop.myShop.contactAndSocial.phone")}
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                  color="forest"
                />
              )}

              {contact?.alternativePhone && contact.alternativePhone.trim() !== '' && (
                <ContactItem
                  icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  label={t("seller.shop.myShop.contactAndSocial.alternativePhone")}
                  value={contact.alternativePhone}
                  href={`tel:${contact.alternativePhone}`}
                  color="forest"
                />
              )}

              {contact?.whatsapp && (
                <ContactItem
                  icon="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  label={t("seller.shop.myShop.contactAndSocial.whatsapp")}
                  value={contact.whatsapp}
                  href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  color="green"
                  isExternal
                />
              )}

              {contact?.telegram && (
                <ContactItem
                  icon="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                  label={t("seller.shop.myShop.contactAndSocial.telegram")}
                  value={contact.telegram}
                  href={`https://t.me/${contact.telegram.replace('@', '')}`}
                  color="blue"
                  isExternal
                />
              )}
            </div>
          ) : (
            <div class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <div class="w-14 h-14 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <EnvelopeIcon class="w-7 h-7 text-gray-400 dark:text-gray-500" />
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">
                {t("seller.shop.myShop.contactAndSocial.noContactInfo")}
              </p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center">
                {t("seller.shop.myShop.contactAndSocial.noContactInfoHint")}
              </p>
            </div>
          )}
        </div>

        {/* Social Media */}
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center">
              <ChatBubbleLeftRightIcon class="w-4 h-4 text-white" />
            </div>
            <h4 class="font-bold text-gray-900 dark:text-gray-100">
              {t("seller.shop.myShop.contactAndSocial.socialMedia")}
            </h4>
          </div>

          {hasSocial ? (
            <div class="space-y-2.5">
              {contact?.facebook && (
                <ContactItem
                  icon="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  label={t("seller.shop.myShop.contactAndSocial.facebook")}
                  value="Facebook"
                  href={contact.facebook}
                  color="blue"
                  isExternal
                />
              )}

              {contact?.instagram && (
                <ContactItem
                  icon="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  label={t("seller.shop.myShop.contactAndSocial.instagram")}
                  value="Instagram"
                  href={contact.instagram}
                  color="terracotta"
                  isExternal
                />
              )}

              {contact?.x && (
                <ContactItem
                  icon="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  label={t("seller.shop.myShop.contactAndSocial.x")}
                  value="X (Twitter)"
                  href={contact.x}
                  color="gray"
                  isExternal
                />
              )}
            </div>
          ) : (
            <div class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
              <div class="w-14 h-14 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ChatBubbleLeftRightIcon class="w-7 h-7 text-gray-400 dark:text-gray-500" />
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium text-sm text-center">
                {t("seller.shop.myShop.contactAndSocial.noSocialMedia")}
              </p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center">
                {t("seller.shop.myShop.contactAndSocial.noSocialMediaHint")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
