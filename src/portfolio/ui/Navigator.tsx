'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { WheelCarousel, type WheelCarouselItem } from '@/components/ui/wheel-carousel'
import { getChapter, getServerChapter, subscribeChapter } from '@/portfolio/journey/journey'
import { getActive, getServerActive, select, subscribeSelection } from '@/portfolio/state/selection'
import { CARDS } from './cardContent'

/**
 * The navigator: a ribbon on the left edge that opens the wheel.
 *
 * Collapsed, it is a slim vertical tab naming the chapter the visitor is in.
 * Clicking it dims the world and brings up the circular wheel of chapters;
 * choosing one closes the wheel and opens that section — the same `select()`
 * a card click uses, so there is one selection and one behaviour. Escape or
 * the backdrop closes the wheel without choosing.
 *
 * Never a navigation bar: nothing is permanently laid across the composition.
 */

/*
 * The wheel always renders a photo panel, and this portfolio has no pictures
 * yet (`VISUALS` is empty). The panel is collapsed to zero width and given an
 * inert pixel: nothing drawn, nothing requested.
 */
const NO_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const ITEMS: WheelCarouselItem[] = CARDS.map((c) => ({
  label: c.label.toUpperCase(),
  image: NO_IMAGE,
  imageAlt: '',
}))

export function Navigator() {
  const active = useSyncExternalStore(subscribeSelection, getActive, getServerActive)
  const chapter = useSyncExternalStore(subscribeChapter, getChapter, getServerChapter)
  const [open, setOpen] = useState(false)

  /* Escape closes the wheel. The content view has its own Escape; the two
     never overlap because the ribbon hides while a section is open. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  /* The ribbon names where the visitor is: the open section if there is one,
     otherwise the chapter the camera is nearest. The hero has no card, so it
     reads as the way in. */
  const current = CARDS.find((c) => c.id === (active ?? chapter))
  const label = current ? current.label : 'Explore'
  const index = Math.max(0, CARDS.findIndex((c) => c.id === (active ?? chapter)))

  return (
    <>
      <button
        type="button"
        className="ribbon"
        aria-expanded={open}
        aria-controls="chapter-menu"
        aria-label={`${label}. Open chapters`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ribbon-dot" aria-hidden="true" />
        <span className="ribbon-label" aria-hidden="true">
          {label}
        </span>
        <span className="ribbon-hint" aria-hidden="true">
          Menu
        </span>
      </button>

      {open ? (
        <div
          className="menu"
          id="chapter-menu"
          role="dialog"
          aria-modal="false"
          aria-label="Chapters"
          onClick={() => setOpen(false)}
        >
          <div className="menu-wheel" onClick={(e) => e.stopPropagation()}>
            <WheelCarousel
              items={ITEMS}
              mode="custom"
              photoWidth={0}
              contentWidth={560}
              radius={230}
              spacing={13}
              visibleItems={5}
              apexInset={10}
              markerSize={10}
              markerGap={16}
              background="transparent"
              panelColor="transparent"
              textColor="rgba(242,235,221,0.34)"
              selectedColor="rgba(242,235,221,0.96)"
              markerColor="rgba(190,206,170,0.95)"
              edgeFade
              edgeFadeSize={22}
              initialIndex={index}
              /* An explicit height: the wheel's rows are h-full inside a parent
                 with only a min-height, which resolves to 0px and clips every
                 label. min-h-0 stops its own min-h-[420px] re-widening it. */
              className="h-full min-h-0"
              itemClassName="text-[clamp(1.1rem,2.6vw,1.7rem)] tracking-[0.14em]"
              onItemSelect={(_item, i) => {
                setOpen(false)
                select(CARDS[i].id)
              }}
            />
          </div>
          <p className="menu-hint">Scroll or drag the wheel · click a chapter · Esc to close</p>
        </div>
      ) : null}
    </>
  )
}
