import { useEffect, useMemo, useRef } from 'react'
import { mulberry32 } from '../../lib/rng'
import type { ConnectionMode } from '../desktop/types'

type Props = {
  seed: number
  variant: string
  mode: ConnectionMode
  glitchBoost?: boolean
  className?: string
}

export default function AnimatedPoster({
  seed,
  variant,
  mode,
  glitchBoost,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const palette = useMemo(() => {
    const base = [
      ['#00ff9a', '#00b8ff', '#ff2bd6', '#ffd400', '#00ff4f'],
      ['#66ff00', '#ff00a8', '#00c3ff', '#fff200', '#7c4dff'],
      ['#00ffea', '#ff3b3b', '#00ff5b', '#ffe600', '#ff7a00'],
    ]
    const p = base[seed % base.length]
    // Variant perturbs order to avoid all posters looking same.
    if (variant.length % 2 === 0) return [p[2], p[0], p[4], p[1], p[3]]
    return [p[0], p[1], p[2], p[3], p[4]]
  }, [seed, variant])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 96
    const H = 96
    canvas.width = W
    canvas.height = H
    ctx.imageSmoothingEnabled = false

    const rand = mulberry32(seed)

    const speed = mode === 'slow' ? 0.6 : mode === 'bad' ? 1.75 : 1.0
    const glitch = glitchBoost ? 1.0 : 0.35

    let raf = 0
    const start = performance.now()

    const draw = () => {
      const t = (performance.now() - start) * 0.001 * speed

      // Background
      ctx.fillStyle = '#0b0b0f'
      ctx.fillRect(0, 0, W, H)

      // Soft grid (pixel-ish)
      ctx.globalAlpha = 0.18
      ctx.fillStyle = '#a7fff0'
      for (let y = 0; y < H; y += 8) {
        if ((y + seed) % 16 === 0) ctx.fillRect(0, y, W, 1)
      }
      ctx.globalAlpha = 1

      // Big blocks
      const cy = Math.floor(H * (0.2 + 0.6 * (0.5 + 0.5 * Math.cos(t * 0.55))))

      const blockCount = 18 + Math.floor(rand() * 8)
      for (let i = 0; i < blockCount; i++) {
        const x = Math.floor(rand() * (W - 1))
        const y = Math.floor(rand() * (H - 1))
        const size = 2 + Math.floor(rand() * 9)
        const color = palette[(i + Math.floor(t)) % palette.length]
        const wobble = (rand() - 0.5) * glitch * 6
        ctx.globalAlpha = 0.35 + rand() * 0.65
        ctx.fillStyle = color
        ctx.fillRect(x, y, size, size)
        // Occasional streak near center.
        if (i % 7 === 0) {
          const sy = Math.max(0, Math.min(H - 2, cy + Math.floor(wobble)))
          ctx.globalAlpha = 0.25 + rand() * 0.5
          ctx.fillRect(0, sy, W, 1)
        }
      }
      ctx.globalAlpha = 1

      // "Glitch offset": draw a second layer shifted by a few pixels.
      if (mode !== 'good' && glitchBoost) {
        const off = Math.floor((rand() - 0.5) * 10 * glitch)
        ctx.globalAlpha = 0.28
        ctx.fillStyle = palette[3]
        ctx.fillRect(Math.max(0, off), 0, W - Math.abs(off), H)
        ctx.globalAlpha = 1
      }

      // Border frame
      ctx.globalAlpha = 0.35
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.strokeRect(1, 1, W - 3, H - 3)
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [seed, variant, palette, mode, glitchBoost])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
        filter: 'contrast(1.15) saturate(1.35) blur(0.2px)',
      }}
    />
  )
}

