import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CompareSlider, FilmButton } from '@/components/media/Interactive'
import { HudHeading, PageHeader, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getStudioItems, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, streamSource, youtubeId, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/studio', { title: labels.studio.title, description: labels.studio.intro })
}

// STUDIO (design/06): 제작 과정 (#process) · 기술 쇼케이스 (#showcase: 전후 비교 + 보유 기술 카드)
export default async function StudioPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [items, labels] = await Promise.all([getStudioItems(locale), getUiLabels(locale)])
  const process = items.filter((i) => i.kind === 'process')
  const comparisons = items.filter((i) => i.kind === 'comparison')
  const technology = items.filter((i) => i.kind === 'technology')
  const s = labels.studio

  return (
    <PageShell>
      <PageHeader eyebrow="Core_Module // Studio_Interface" title={s.title} />
      <p className="-mt-4 mb-20 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">{s.intro}</p>

      <section id="process" className="mb-32 scroll-mt-28">
        <HudHeading tag="Workflow_Sequence" title={s.process} size="lg" />
        {process.length ? (
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {process.map((step, index) => {
              const stream = streamSource(step.streamId)
              const poster = mediaUrl(step.image, 'card') ?? stream?.thumbnail
              const film = { src: mediaUrl(step.video) ?? stream?.hls, youtubeId: youtubeId(step.youtubeUrl), title: step.title }
              const thumb = (
                <span className="relative block aspect-video overflow-hidden rounded-xl border border-white/5 bg-[#111]">
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover brightness-[0.6] grayscale transition duration-500 group-hover:scale-105 group-hover:brightness-[0.8] group-hover:grayscale-0" />
                  ) : null}
                  <span className="scanlines absolute inset-0" />
                </span>
              )
              return (
                <li key={step.id} className="group rounded-[20px] border border-line bg-white/[0.02] p-8 transition-all duration-500 hover:border-cyan/30 hover:bg-white/[0.04]">
                  <p className="mb-3 font-mono text-[10px] text-lime uppercase">{step.tag || `${s.phase}_${String(index + 1).padStart(2, '0')}`}</p>
                  <h3 className="text-xl font-bold uppercase">{step.title}</h3>
                  {step.description ? <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-white/50">{step.description}</p> : null}
                  {film.src || film.youtubeId ? (
                    <FilmButton film={film} closeLabel={labels.common.close} label={labels.family.watchFilm} className="mt-6">
                      {thumb}
                    </FilmButton>
                  ) : poster ? (
                    <div className="mt-6">{thumb}</div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="glass rounded-2xl p-12 text-center font-mono text-sm tracking-[0.15em] text-white/50 uppercase">{labels.common.empty}</p>
        )}
      </section>

      <section id="showcase" className="scroll-mt-28">
        <HudHeading tag="Core_Technology" title={s.showcase} size="lg" />
        {comparisons.map((item) => {
          const before = mediaUrl(item.before, 'large')
          const after = mediaUrl(item.after, 'large')
          if (!before || !after) return null
          return (
            <div key={item.id} className="mb-16">
              <CompareSlider before={before} after={after} beforeLabel={item.beforeLabel || 'Before'} afterLabel={item.afterLabel || 'After'} hint={s.dragToCompare} />
              <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <p className="font-bold">{item.title}</p>
                  {item.description ? <p className="mt-1 text-sm text-white/50">{item.description}</p> : null}
                </div>
                <Link href={localePath(locale, '/business/campaign')} className="btn-irid shrink-0">
                  {s.buildCampaign} <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          )
        })}

        {technology.length ? (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {technology.map((tech) => {
              const image = mediaUrl(tech.image, 'card')
              return (
                <li key={tech.id} className="group rounded-2xl border border-line bg-white/[0.02] p-5 transition-all hover:border-pink hover:bg-white/[0.05] md:p-6">
                  <div className="mb-5 aspect-square overflow-hidden rounded-lg bg-[#0a0a0a]">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={image} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition group-hover:grayscale-0" />
                    ) : (
                      <span className="block h-full w-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    )}
                  </div>
                  {tech.tag ? <p className="font-mono text-[8px] tracking-[0.1em] text-cyan uppercase">{tech.tag}</p> : null}
                  <h3 className="mt-2 text-sm font-bold uppercase">{tech.title}</h3>
                  {tech.description ? <p className="mt-2 text-xs leading-relaxed text-white/45">{tech.description}</p> : null}
                </li>
              )
            })}
          </ul>
        ) : null}

        {!comparisons.length && !technology.length ? (
          <p className="glass rounded-2xl p-12 text-center font-mono text-sm tracking-[0.15em] text-white/50 uppercase">{labels.common.empty}</p>
        ) : (
          <div className="mt-16 flex justify-start">
            {comparisons.length ? null : (
              <Link href={localePath(locale, '/business/campaign')} className="btn-irid">
                {s.buildCampaign} <ArrowUpRight size={16} aria-hidden />
              </Link>
            )}
          </div>
        )}
      </section>
    </PageShell>
  )
}
