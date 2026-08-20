import { Suspense, lazy } from 'react';

import { HelmetSeo } from './LandingSeo';

import { Footer, Navbar, StickyCta } from './components/Chrome';

import { HeroSection } from './sections/HeroSection';

import { EngineSection } from './sections/EngineSection';

import { AmbientBackdrop } from '@/components/motion/Backdrop';

import { ScrollProgress } from '@/components/motion/ScrollProgress';

import { SectionPulse } from '@/components/motion/SectionPulse';

import { LoadingStudio, SectionFallback, UnavailableStudio } from '@/components/ui/StudioStates';

import { isSectionVisible, useContent } from '@/hooks/useContent';



const AiVideoReel = lazy(() =>

  import('@/components/media/AiVideoReel').then((m) => ({ default: m.AiVideoReel })),

);

const VisualizationSection = lazy(() =>

  import('./sections/VisualizationSection').then((m) => ({ default: m.VisualizationSection })),

);

const TransformationSection = lazy(() =>

  import('./sections/TransformationSection').then((m) => ({ default: m.TransformationSection })),

);

const ExperienceSection = lazy(() =>

  import('./sections/ExperienceSection').then((m) => ({ default: m.ExperienceSection })),

);

const CurriculumSection = lazy(() =>

  import('./sections/CurriculumSection').then((m) => ({ default: m.CurriculumSection })),

);

const SocialSection = lazy(() =>

  import('./sections/SocialSection').then((m) => ({ default: m.SocialSection })),

);

const OfferSection = lazy(() =>

  import('./sections/OfferSection').then((m) => ({ default: m.OfferSection })),

);

const ClosingSection = lazy(() =>

  import('./sections/ClosingSection').then((m) => ({ default: m.ClosingSection })),

);



export function LandingPage() {

  const { content, isLoading, isError, refetch } = useContent();



  if (isLoading) return <LoadingStudio label="Loading workshop" />;

  if (isError || !content) return <UnavailableStudio onRetry={refetch} />;



  if (content.site?.maintenanceMode?.isEnabled) {

    return (

      <main className="grid min-h-screen place-items-center px-6 text-center">

        <AmbientBackdrop />

        <div className="relative">

          <h1 className="font-display text-display-sm font-bold">{content.site?.brandName ?? 'AI IN ACTION'}</h1>

          <p className="mt-4 text-mist">{content.site?.maintenanceMode?.message ?? 'We will be back shortly.'}</p>

        </div>

      </main>

    );

  }



  const show = (key: string) => isSectionVisible(content, key);



  return (

    <>

      <HelmetSeo content={content} />

      <AmbientBackdrop />

      <ScrollProgress />

      <Navbar content={content} />

      <main id="main">

        <HeroSection content={content} />

        <SectionPulse />

        <Suspense fallback={<SectionFallback />}>

          <AiVideoReel content={content} />

        </Suspense>

        {show('engine') ? (

          <>

            <SectionPulse />

            <EngineSection content={content} />

          </>

        ) : null}

        {show('visualization') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <VisualizationSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('transformation') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <TransformationSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('experience') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <ExperienceSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('curriculum') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <CurriculumSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('speakers') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <SocialSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('pricing') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <OfferSection content={content} />

            </Suspense>

          </>

        ) : null}

        {show('faq') ? (

          <>

            <SectionPulse />

            <Suspense fallback={<SectionFallback />}>

              <ClosingSection content={content} />

            </Suspense>

          </>

        ) : null}

      </main>

      <Footer content={content} />

      <StickyCta content={content} />

    </>

  );

}

