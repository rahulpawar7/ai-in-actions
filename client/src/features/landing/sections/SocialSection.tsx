import { Section, SectionHeader } from '@/components/ui/Section';
import { InteractiveCard } from '@/components/motion/InteractiveCard';
import { Reveal, Stagger, StaggerChild } from '@/components/motion/Reveal';
import { VideoShowcase } from '@/components/media/VideoShowcase';
import { TestimonialStage } from '@/components/media/TestimonialStage';
import { list } from './utils';
import type { PublicContent } from '@/types/content';

export function SocialSection({ content }: { content: PublicContent }) {
  const gallery = list(content.gallery);
  const videos = gallery.filter(
    (g) => g.media?.kind === 'video' || g.category === 'workshop' || g.category === 'demo' || g.category === 'ai-action',
  );
  const people = list(content.speakers).length ? list(content.speakers) : list(content.contacts);
  const videoSection = content.sections.videos;

  return (
    <>
      {people.length > 0 ? (
        <Section id="speakers" tone="paper">
          <SectionHeader
            invert
            align="center"
            eyebrow={content.sections.speakers?.eyebrow}
            title={content.sections.speakers?.title}
            emphasis={content.sections.speakers?.titleEmphasis}
          />
          <Stagger className="grid gap-6 md:grid-cols-2">
            {people.map((person) => (
              <StaggerChild key={person.id}>
                <InteractiveCard glow="royal" className="p-8 sm:p-10">
                  <h3 className="font-display text-display-xs font-bold text-ink sm:text-display-sm">{person.name}</h3>
                  <p className="mt-2 label-mono text-ember-600">{'role' in person ? person.role : ''}</p>
                  {'bio' in person && person.bio ? (
                    <p className="lead mt-5 text-ink/75">{person.bio}</p>
                  ) : null}
                </InteractiveCard>
              </StaggerChild>
            ))}
          </Stagger>
        </Section>
      ) : null}

      {videos.length > 0 ? (
        <div id="videos">
          <VideoShowcase
            items={videos}
            eyebrow={videoSection?.eyebrow ?? 'Workshop preview'}
            title={videoSection?.title ?? 'Watch the batch'}
            emphasis={videoSection?.titleEmphasis ?? 'come alive.'}
          />
        </div>
      ) : (
        <Section id="videos">
          <SectionHeader eyebrow={videoSection?.eyebrow} title={videoSection?.title} emphasis={videoSection?.titleEmphasis} />
          <Reveal>
            <p className="body-muted text-center">Workshop films will appear here once uploaded in the CMS.</p>
          </Reveal>
        </Section>
      )}

      <Section id="testimonials" fullBleed>
        <SectionHeader
          align="center"
          eyebrow={content.sections.testimonials?.eyebrow}
          title={content.sections.testimonials?.title}
          emphasis={content.sections.testimonials?.titleEmphasis}
          subtitle="Real owners. Real systems shipped. Not generic praise."
        />
        <TestimonialStage items={list(content.testimonials)} />
      </Section>
    </>
  );
}
