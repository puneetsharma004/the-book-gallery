import React from 'react'
import HeroSection from './landingPage/HeroSection.jsx'
import Footer from './components/common/Footer.jsx'
import FinalCTA from './landingPage/FinalCTA.jsx'
import WhyBuiltThis from './landingPage/WhyBuiltThis.jsx'
import StorySection from './landingPage/StorySection.jsx'
import FeatureGrid from './landingPage/FeatureGrid'
import ParallaxHero from './landingPage/ParallaxHero.jsx'
import ShowcasePreview from './landingPage/ShowcasePreview.jsx'
import FeaturedBooks from './landingPage/FeaturedBooks.jsx'


export default function page() {

  return (
    <>
    <main className="relative overflow-hidden bg-linear-to-b from-[#0c0c0d] via-[#121214] to-[#0d0e10]">
    <div className="relative z-10">
      <HeroSection />
      
      <FeaturedBooks/>

      <StorySection/>

      <ParallaxHero/>

      <ShowcasePreview />

      <FeatureGrid/>

      <WhyBuiltThis/>

      <FinalCTA/>

      <Footer />
    </div>
    <div className="fixed inset-0 pointer-events-none opacity bg-[radial-gradient(ellipse_at_center,#1a1f2b,#0b0f17)]" />
    </main>
    </>
  )
}
