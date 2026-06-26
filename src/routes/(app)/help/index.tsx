import { useI18n } from "~/i18n";
import StaticContentPage from "~/components/content/StaticContentPage";

export default function HelpHubPage() {
  const { t } = useI18n();

  return (
    <StaticContentPage
      path="/help"
      title={t("help.hub.title")}
      description={t("help.hub.description")}
      sections={[
        {
          title: t("help.hub.sections.intro.title"),
          paragraphs: [t("help.hub.sections.intro.body")],
        },
      ]}
      relatedLinks={[
        { href: "/help/shipping-and-returns", label: t("help.hub.links.shipping") },
        { href: "/help/cod", label: t("help.hub.links.cod") },
        { href: "/legal/privacy", label: t("help.hub.links.privacy") },
        { href: "/legal/terms", label: t("help.hub.links.terms") },
      ]}
    />
  );
}
