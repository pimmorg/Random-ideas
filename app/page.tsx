import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { WhyItMatters } from "@/components/site/why-it-matters";
import { Benefits } from "@/components/site/benefits";
import { DemoIntake } from "@/components/site/demo-intake";
import { ForAttorneys } from "@/components/site/for-attorneys";
import { Testimonials } from "@/components/site/testimonials";
import { FAQ } from "@/components/site/faq";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <WhyItMatters />
        <Benefits />
        <DemoIntake />
        <ForAttorneys />
        <Testimonials />
        <FAQ />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
