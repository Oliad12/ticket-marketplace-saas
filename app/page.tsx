import LandingHero from "@/components/LandingHero";      // Hero + Search Bar + Categories
import FeaturedEvents from "@/components/FeaturedEvents"; // Featured Events
import EventList from "@/components/EventList";           // All Events
import HowItWorks from "@/components/HowItWorks";         // How It Works
import WhyChooseUs from "@/components/WhyChooseUs";       // Why Choose Us
import CTASection from "@/components/CTASection";         // CTA Section
// Footer rendered in layout.tsx

export default function Home() {
  return (
    <>
      <LandingHero />
      <FeaturedEvents />
      <div id="events">
        <EventList />
      </div>
      <HowItWorks />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
