import { createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import { buildPlantsFilterHref } from "~/lib/plants/plants-url";
import {
  answersToPlantFilter,
  getDefaultLightForPlacement,
  isPlantFinderComplete,
  PLANT_FINDER_STEP_COUNT,
  type PlantFinderAnswers,
  type PlantFinderCare,
  type PlantFinderLight,
  type PlantFinderPlacement,
} from "~/lib/plants/plant-finder";
import { formatPageTitle } from "~/lib/seo/meta";

const PLACEMENT_OPTIONS: PlantFinderPlacement[] = [
  "indoor",
  "balcony",
  "rooftop",
  "outdoor",
];

const LIGHT_OPTIONS: PlantFinderLight[] = ["low", "indirect", "bright", "direct"];

const CARE_OPTIONS: PlantFinderCare[] = ["easy", "moderate", "demanding"];

export default function PlantFinderPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = createSignal(1);
  const [answers, setAnswers] = createSignal<PlantFinderAnswers>({});

  const optionButtonClass = (selected: boolean) =>
    `w-full text-left px-5 py-4 rounded-xl border transition-standard body-small font-medium ${
      selected
        ? "border-forest-600 bg-forest-50 dark:bg-forest-800 text-forest-900 dark:text-cream-50 ring-2 ring-forest-500/30"
        : "border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 hover:border-forest-300 dark:hover:border-forest-500"
    }`;

  const goNextFromPlacement = () => {
    const placement = answers().placement;
    if (!placement) return;
    setAnswers((prev) => ({
      ...prev,
      light: prev.light ?? getDefaultLightForPlacement(placement),
    }));
    setStep(2);
  };

  const handleSubmit = () => {
    const a = answers();
    if (!isPlantFinderComplete(a)) return;
    navigate(buildPlantsFilterHref(answersToPlantFilter(a)));
  };

  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12 px-4">
      <Title>{formatPageTitle(t("landing.plantFinder.pageTitle"))}</Title>
      <Meta name="robots" content="noindex, nofollow" />

      <div class="max-w-lg mx-auto">
        <p class="body-small text-gray-500 dark:text-gray-400 text-center mb-2">
          {t("landing.plantFinder.stepLabel", {
            current: step(),
            total: PLANT_FINDER_STEP_COUNT,
          })}
        </p>
        <div
          class="flex justify-center gap-2 mb-8"
          role="progressbar"
          aria-valuenow={step()}
          aria-valuemin={1}
          aria-valuemax={PLANT_FINDER_STEP_COUNT}
        >
          <For each={[1, 2, 3]}>
            {(n) => (
              <span
                class={`h-2 w-8 rounded-full ${
                  n <= step()
                    ? "bg-forest-600"
                    : "bg-cream-200 dark:bg-forest-700"
                }`}
              />
            )}
          </For>
        </div>

        <h1 class="h3 text-center mb-2">
          <Show when={step() === 1}>{t("landing.plantFinder.steps.placement.title")}</Show>
          <Show when={step() === 2}>{t("landing.plantFinder.steps.light.title")}</Show>
          <Show when={step() === 3}>{t("landing.plantFinder.steps.care.title")}</Show>
        </h1>
        <p class="body-small text-gray-600 dark:text-gray-400 text-center mb-8">
          {t("landing.plantFinder.disclaimer")}
        </p>

        <Show when={step() === 1}>
          <div class="space-y-3" role="radiogroup" aria-label={t("landing.plantFinder.steps.placement.title")}>
            <For each={PLACEMENT_OPTIONS}>
              {(id) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={answers().placement === id}
                  class={optionButtonClass(answers().placement === id)}
                  onClick={() => setAnswers((prev) => ({ ...prev, placement: id }))}
                >
                  {t(`landing.plantFinder.steps.placement.options.${id}`)}
                </button>
              )}
            </For>
          </div>
        </Show>

        <Show when={step() === 2}>
          <div class="space-y-3" role="radiogroup" aria-label={t("landing.plantFinder.steps.light.title")}>
            <For each={LIGHT_OPTIONS}>
              {(id) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={answers().light === id}
                  class={optionButtonClass(answers().light === id)}
                  onClick={() => setAnswers((prev) => ({ ...prev, light: id }))}
                >
                  {t(`landing.plantFinder.steps.light.options.${id}`)}
                </button>
              )}
            </For>
          </div>
        </Show>

        <Show when={step() === 3}>
          <div class="space-y-3" role="radiogroup" aria-label={t("landing.plantFinder.steps.care.title")}>
            <For each={CARE_OPTIONS}>
              {(id) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={answers().care === id}
                  class={optionButtonClass(answers().care === id)}
                  onClick={() => setAnswers((prev) => ({ ...prev, care: id }))}
                >
                  {t(`landing.plantFinder.steps.care.options.${id}`)}
                </button>
              )}
            </For>
          </div>
        </Show>

        <div class="flex flex-col sm:flex-row gap-3 mt-10">
          <Show
            when={step() === 1}
            fallback={
              <Button variant="outline" class="flex-1" onClick={() => setStep((s) => s - 1)}>
                {t("landing.plantFinder.actions.back")}
              </Button>
            }
          >
            <Button variant="outline" class="flex-1" onClick={() => navigate("/")}>
              {t("landing.plantFinder.actions.cancel")}
            </Button>
          </Show>

          <Show
            when={step() < PLANT_FINDER_STEP_COUNT}
            fallback={
              <Button
                variant="primary"
                class="flex-1"
                disabled={!isPlantFinderComplete(answers())}
                onClick={handleSubmit}
              >
                {t("landing.plantFinder.actions.submit")}
              </Button>
            }
          >
            <Button
              variant="primary"
              class="flex-1"
              disabled={
                (step() === 1 && !answers().placement) ||
                (step() === 2 && !answers().light)
              }
              onClick={() => {
                if (step() === 1) goNextFromPlacement();
                else if (step() === 2 && answers().light) setStep(3);
              }}
            >
              {t("landing.plantFinder.actions.next")}
            </Button>
          </Show>
        </div>
      </div>
    </div>
  );
}
