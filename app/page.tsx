import type { Metadata } from "next";
import LandingNavbar from "./components/landing/LandingNavbar";
import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import StatsSection from "./components/landing/StatsSection";
import CTASection from "./components/landing/CTASection";
import LandingFooter from "./components/landing/LandingFooter";
import { cacheLife } from "next/cache";

export const metadata: Metadata = {
  title: "BuddyScript — Connect. Share. Belong.",
  description:
    "The social platform where real connections happen. Post moments, chat with friends, and discover communities.",
};

export default async function HomePage() {
  "use cache";
  cacheLife("hours");
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <LandingFooter />
    </main>
  );
}
