import { useI18n } from "~/i18n";
import StaticContentPage from "~/components/content/StaticContentPage";

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <StaticContentPage
      path="/legal/terms"
      title={t("legal.terms.title")}
      description={t("legal.terms.description")}
      sections={[
        {
          title: t("legal.terms.sections.intro.title"),
          paragraphs: [t("legal.terms.sections.intro.body")],
        },
        {
          title: t("legal.terms.sections.buyers.title"),
          bullets: [
            t("legal.terms.sections.buyers.bullets.0"),
            t("legal.terms.sections.buyers.bullets.1"),
            t("legal.terms.sections.buyers.bullets.2"),
          ],
        },
        {
          title: t("legal.terms.sections.sellers.title"),
          bullets: [
            t("legal.terms.sections.sellers.bullets.0"),
            t("legal.terms.sections.sellers.bullets.1"),
            t("legal.terms.sections.sellers.bullets.2"),
          ],
        },
        {
          title: t("legal.terms.sections.liability.title"),
          paragraphs: [t("legal.terms.sections.liability.body")],
        },
      ]}
    />
  );
}
