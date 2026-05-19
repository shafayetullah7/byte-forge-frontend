import { For, type Component } from "solid-js";
import type { PublicPlantListItem } from "~/lib/api/types/public/plants.types";
import { PlantCard } from "../../plant-card";
import SectionHeader from "./SectionHeader";
import type { Component as SolidComponent } from "solid-js";

const PlantGridSection: Component<{
  icon: SolidComponent<{ class?: string }>;
  title: string;
  subtitle: string;
  action?: { label: string; href: string };
  plants: PublicPlantListItem[];
}> = (props) => {
  return (
    <div class="mt-12 mb-12">
      <SectionHeader
        icon={props.icon}
        title={props.title}
        subtitle={props.subtitle}
        action={props.action}
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <For each={props.plants}>
          {(plant) => <PlantCard plant={plant} />}
        </For>
      </div>
    </div>
  );
};

export default PlantGridSection;
