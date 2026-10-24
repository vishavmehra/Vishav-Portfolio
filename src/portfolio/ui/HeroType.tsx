'use client'

import { Signature } from '@/components/ui/signature'
import { TextRepel } from '@/components/ui/text-repel'
import { PROFILE } from '@/portfolio/data'
import { useNarrow } from './useNarrow'

/**
 * The name and the role — the only things in the hero that are not the world.
 *
 * The name is the signature, drawn once as the composition settles, at a size
 * that reads as a name rather than a mark. It replaced the particle typography
 * for two reasons: the dotted face was hard to read, and that component ran
 * its own animation loop every frame for as long as it was mounted. A drawn
 * SVG costs nothing after its one entrance.
 *
 * Every string here comes from the résumé-derived profile; nothing is written
 * into this component.
 */
export function HeroType() {
  const narrow = useNarrow()

  return (
    <div className="hero-type par" style={{ ['--pd' as string]: 16, ['--pr' as string]: 1.1 }}>
      <div className="hero-name">
        <Signature
          text={PROFILE.name}
          color="#efe6d2"
          fontSize={narrow ? 46 : 84}
          duration={2.0}
          delay={0.9}
        />
      </div>

      <div className="hero-role">
        <TextRepel
          text={PROFILE.title.toUpperCase()}
          radius={narrow ? 70 : 110}
          strength={narrow ? 16 : 26}
          stiffness={150}
          damping={17}
          mass={0.5}
          letterClassName="hero-role-letter"
        />
      </div>
    </div>
  )
}
