import { useEffect, useMemo, useState } from 'react'
import ExhibitPoster from '../media/ExhibitPoster'
import type { ConnectionMode } from '../desktop/types'
import type { Exhibit } from '../../data/exhibits'

type Props = {
  exhibit: Exhibit
  initialMode: ConnectionMode
  onModeChange?: (m: ConnectionMode) => void
  onVisited?: (exhibitId: string) => void
}

const modeLabels: Record<ConnectionMode, string> = {
  good: 'нормальный',
  slow: 'медленный',
  bad: 'плохой',
}

export default function ExhibitViewer({
  exhibit,
  initialMode,
  onModeChange,
  onVisited,
}: Props) {
  const [mode, setMode] = useState<ConnectionMode>(initialMode)
  const [glitchBoost, setGlitchBoost] = useState(false)
  const openedAt = useMemo(() => new Date(), [])

  useEffect(() => {
    onVisited?.(exhibit.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhibit.id])

  function setAndNotify(next: ConnectionMode) {
    setMode(next)
    onModeChange?.(next)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 1000, fontSize: 15 }}>
            {exhibit.title}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 3 }}>
            {exhibit.subtitle}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 12,
            opacity: 0.9,
            whiteSpace: 'nowrap',
          }}
        >
          открыто: {openedAt.toLocaleTimeString()}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, alignItems: 'start' }}>
        <div style={{ width: 140, height: 140, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid rgba(0,0,0,0.18)',
              background: 'rgba(255,255,255,0.4)',
            }}
          />
          <ExhibitPoster
            seed={exhibit.seed}
            variant={exhibit.subtitle}
            mode={mode}
            glitchBoost={glitchBoost}
            className="v-PosterCanvas"
            imageSrc={exhibit.imageSrc}
            alt={exhibit.title}
          />
          <div className={glitchBoost ? 'v-GlitchLayer v-GlitchOn' : 'v-GlitchLayer'} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
            кураторский комментарий
          </div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.35 }}>
            {exhibit.curatorLong}
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
              соединение:
            </div>
            {(['good', 'slow', 'bad'] as ConnectionMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAndNotify(m)}
                style={{
                  border: '2px solid rgba(0,0,0,0.22)',
                  background: m === mode ? 'rgba(0,255,180,0.15)' : 'rgba(255,255,255,0.5)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {modeLabels[m]}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={glitchBoost}
                onChange={(e) => setGlitchBoost(e.target.checked)}
              />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 900 }}>
                усилить шум интерфейса
              </span>
            </label>

            <button
              type="button"
              onClick={() => setGlitchBoost((v) => !v)}
              style={{
                border: '2px outset rgba(0,0,0,0.2)',
                background: 'rgba(255,214,0,0.16)',
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Arial, sans-serif",
                fontWeight: 900,
              }}
            >
              подергать картинку
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {exhibit.tags.map((t) => (
            <span
              key={t}
              style={{
                border: '1px solid rgba(0,0,0,0.22)',
                background: 'rgba(0,120,255,0.08)',
                padding: '3px 6px',
                fontSize: 11,
                fontFamily: "'Courier New', monospace",
                fontWeight: 900,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

