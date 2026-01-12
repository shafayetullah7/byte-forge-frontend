import { Button } from "~/components/ui";

export default function Home() {
  return (
    <main class="min-h-screen flex items-center justify-center bg-cream-50 dark:bg-forest-900">
      <div class="text-center px-4">
        <h1 class="text-6xl font-bold bg-gradient-to-r from-forest-600 to-sage-500 bg-clip-text text-transparent mb-4">
          ByteForge
        </h1>
        <p class="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Bring Nature Into Your Home
        </p>
        <div class="flex gap-4 justify-center">
          <Button variant="primary" size="lg">
            Shop Plants
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
}
