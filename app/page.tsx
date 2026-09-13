import { Header } from "@/components/home/header"
import { Hero } from "@/components/home/hero"
import { TrustStrip } from "@/components/home/trust-strip"
import { FeaturedTraining } from "@/components/home/featured-training"
import { HowItWorks } from "@/components/home/how-it-works"
import { StatsBand } from "@/components/home/stats-band"
import { BrowseCategory } from "@/components/home/browse-category"
import { ComplianceCallout } from "@/components/home/compliance-callout"
import { Testimonial } from "@/components/home/testimonial"
import { Footer } from "@/components/home/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <FeaturedTraining />
        <HowItWorks />
        <StatsBand />
        <BrowseCategory />
        <ComplianceCallout />
        <Testimonial />
      </main>
      <Footer />
    </div>
  )
}
