import {
  Hero,
  TrustBar,
  LiveCampaigns,
  FeaturedPlants,
  TrendingPlants,
  FeaturedShops,
  HowItWorks,
  SeasonalPicks,
  WhyChooseByteForge,
  SellerCTA,
  Testimonials,
  Newsletter,
  Footer,
} from "~/components/home";

export default function Home() {
  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900">
      <Hero />
      <TrustBar />
      <LiveCampaigns />
      <FeaturedPlants />
      <TrendingPlants />
      <FeaturedShops />
      <HowItWorks />
      <SeasonalPicks />
      <WhyChooseByteForge />
      <SellerCTA />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
