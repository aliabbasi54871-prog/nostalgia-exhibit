import { useEffect, useState } from 'react'
import AnimatedPoster from './AnimatedPoster'
import type { ConnectionMode } from '../desktop/types'

type Props = {
  seed: number
  variant: string
  mode: ConnectionMode
  glitchBoost?: boolean
  imageSrc?: string
  className?: string
  alt?: string
}

export default function ExhibitPoster({
  seed,
  variant,
  mode,
  glitchBoost,
  imageSrc,
  className,
  alt,
}: Props) {
  const [useImage, setUseImage] = useState(Boolean(imageSrc))

  useEffect(() => {
    setUseImage(Boolean(imageSrc))
  }, [imageSrc])

  if (useImage && imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={alt ?? variant}
        className={className}
        onError={() => setUseImage(false)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          imageRendering: 'pixelated',
          filter: 'contrast(1.15) saturate(1.35)',
        }}
      />
    )
  }

  return (
    <AnimatedPoster
      seed={seed}
      variant={variant}
      mode={mode}
      glitchBoost={glitchBoost}
      className={className}
    />
  )
}

