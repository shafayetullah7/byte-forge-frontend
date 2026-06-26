import { useI18n } from "~/i18n";
import StaticContentPage from "~/components/content/StaticContentPage";

export default function CodHelpPage() {
  const { t } = useI18n();

  return (
    <StaticContentPage
      path="/help/cod"
      title={t("help.cod.title")}
      description={t("help.cod.description")}
      sections={[
        {
          title: t("help.cod.sections.how.title"),
          bullets: [
            t("help.cod.sections.how.bullets.0"),
            t("help.cod.sections.how.bullets.1"),
            t("help.cod.sections.how.bullets.2"),
          ],
        },
        {
          title: t("help.cod.sections.notes.title"),
          bullets: [
            t("help.cod.sections.notes.bullets.0"),
            t("help.cod.sections.notes.bullets.1"),
            t("help.cod.sections.notes.bullets.2"),
          ],
        },
      ]}
      relatedLinks={[
        { href: "/help", label: t("help.hub.title") },
        { href: "/help/shipping-and-returns", label: t("help.hub.links.shipping") },
      ]}
    />
  );
}
