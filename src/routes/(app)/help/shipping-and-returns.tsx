import { useI18n } from "~/i18n";
import StaticContentPage from "~/components/content/StaticContentPage";

export default function ShippingHelpPage() {
  const { t } = useI18n();

  return (
    <StaticContentPage
      path="/help/shipping-and-returns"
      title={t("help.shipping.title")}
      description={t("help.shipping.description")}
      sections={[
        {
          title: t("help.shipping.sections.delivery.title"),
          paragraphs: [t("help.shipping.sections.delivery.body")],
        },
        {
          title: t("help.shipping.sections.livePlants.title"),
          bullets: [
            t("help.shipping.sections.livePlants.bullets.0"),
            t("help.shipping.sections.livePlants.bullets.1"),
            t("help.shipping.sections.livePlants.bullets.2"),
          ],
        },
        {
          title: t("help.shipping.sections.returns.title"),
          paragraphs: [t("help.shipping.sections.returns.body")],
        },
      ]}
      relatedLinks={[
        { href: "/help", label: t("help.hub.title") },
        { href: "/help/cod", label: t("help.hub.links.cod") },
      ]}
    />
  );
}
