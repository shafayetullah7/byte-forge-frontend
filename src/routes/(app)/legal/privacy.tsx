import { useI18n } from "~/i18n";
import StaticContentPage from "~/components/content/StaticContentPage";

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <StaticContentPage
      path="/legal/privacy"
      title={t("legal.privacy.title")}
      description={t("legal.privacy.description")}
      sections={[
        {
          title: t("legal.privacy.sections.intro.title"),
          paragraphs: [t("legal.privacy.sections.intro.body")],
        },
        {
          title: t("legal.privacy.sections.data.title"),
          bullets: [
            t("legal.privacy.sections.data.bullets.0"),
            t("legal.privacy.sections.data.bullets.1"),
            t("legal.privacy.sections.data.bullets.2"),
            t("legal.privacy.sections.data.bullets.3"),
          ],
        },
        {
          title: t("legal.privacy.sections.use.title"),
          bullets: [
            t("legal.privacy.sections.use.bullets.0"),
            t("legal.privacy.sections.use.bullets.1"),
            t("legal.privacy.sections.use.bullets.2"),
            t("legal.privacy.sections.use.bullets.3"),
          ],
        },
        {
          title: t("legal.privacy.sections.contact.title"),
          paragraphs: [t("legal.privacy.sections.contact.body")],
        },
      ]}
    />
  );
}
