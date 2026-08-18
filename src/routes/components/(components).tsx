import { Button, Badge, Card, Input, Select, Textarea } from "~/components/ui";

export default function ComponentShowcase() {
  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="mb-16">
          <h1 class="text-5xl font-bold text-forest-700 dark:text-sage-300 mb-4">
            UI Component Showcase
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Reusable components for the ByteForge platform
          </p>
        </div>

        {/* Buttons */}
        <section class="mb-16">
          <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-6">
            Buttons
          </h2>

          <div class="space-y-8">
            {/* Button Variants */}
            <div>
              <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                Variants
              </h3>
              <div class="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                Sizes
              </h3>
              <div class="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Disabled State */}
            <div>
              <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                Disabled
              </h3>
              <div class="flex flex-wrap gap-4">
                <Button variant="primary" disabled>
                  Disabled Primary
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section class="mb-16">
          <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-6">
            Badges
          </h2>
          <div class="flex flex-wrap gap-3">
            <Badge variant="forest">Forest</Badge>
            <Badge variant="sage">Sage</Badge>
            <Badge variant="terracotta">Terracotta</Badge>
            <Badge variant="cream">Cream</Badge>
            <Badge variant="default">Default</Badge>
          </div>
        </section>

        {/* Cards */}
        <section class="mb-16">
          <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-6">
            Cards
          </h2>
          <div class="grid md:grid-cols-3 gap-6">
            <Card
              variant="default"
              title="Default Card"
              description="A simple card with no border or shadow"
            >
              <p class="text-gray-600 dark:text-gray-400">
                Card content goes here.
              </p>
            </Card>

            <Card
              variant="bordered"
              title="Bordered Card"
              description="Card with a sage green border"
            >
              <p class="text-gray-600 dark:text-gray-400">
                Card content goes here.
              </p>
            </Card>

            <Card
              variant="bordered"
              title="Elevated Card"
              description="Card with shadow for depth"
            >
              <p class="text-gray-600 dark:text-gray-400">
                Card content goes here.
              </p>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section class="mb-16">
          <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-6">
            Form fields
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
            Default (`md`) is for page forms. Compact (`sm`) is for toolbars and side panels.
            Labels are `text-sm`, never headings. Focus is forest.
          </p>

          <div class="grid md:grid-cols-2 gap-10 max-w-4xl">
            <div class="space-y-4">
              <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">
                Default (md)
              </h3>
              <Input label="Shop name" required placeholder="Green Leaf Nursery" />
              <Textarea label="About" rows={3} placeholder="Short shop story" />
              <Select
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                ]}
                value="draft"
              />
              <Input
                label="Name (error)"
                placeholder="John Doe"
                error="This field is required"
              />
            </div>
            <div class="space-y-4">
              <h3 class="text-xl font-medium text-gray-700 dark:text-gray-300">
                Compact (sm)
              </h3>
              <Input size="sm" label="Courier" placeholder="Pathao" />
              <Textarea size="sm" label="Note" rows={3} placeholder="Note to buyer" />
              <Select
                size="sm"
                label="Method"
                options={[
                  { value: "courier", label: "Courier" },
                  { value: "pickup", label: "Pickup" },
                ]}
                value="courier"
              />
              <Input size="sm" label="Disabled" placeholder="Cannot edit" disabled />
            </div>
          </div>
        </section>

        {/* Combined Example */}
        <section class="mb-16">
          <h2 class="text-3xl font-semibold text-forest-600 dark:text-forest-400 mb-6">
            Combined Example
          </h2>
          <Card variant="bordered" class="max-w-md">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-forest-700 dark:text-sage-300">
                Product Card
              </h3>
              <Badge variant="terracotta">Sale</Badge>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              A beautiful plant for your home
            </p>
            <div class="flex gap-3">
              <Button variant="primary" size="sm">
                Add to Cart
              </Button>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
