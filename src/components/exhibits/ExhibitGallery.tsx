import ExhibitPoster from '../media/ExhibitPoster'
import type { ConnectionMode } from '../desktop/types'
import { exhibits } from '../../data/exhibits'
import type { Exhibit } from '../../data/exhibits'

type Props = {
  mode: ConnectionMode
  onOpen: (exhibitId: string) => void
  userExhibit?: Exhibit | null
}

export default function ExhibitGallery({ mode, onOpen, userExhibit }: Props) {
  const all = userExhibit ? [userExhibit, ...exhibits] : exhibits

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 6 }}>
            Экспозиция
          </div>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
            кликни по экспонату: откроется отдельное окно просмотра
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
          режим соединения: <span style={{ fontWeight: 900 }}>{mode}</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginTop: 12,
        }}
      >
        {all.map((ex) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => onOpen(ex.id)}
            style={{
              textAlign: 'left',
              border: '2px solid rgba(0,0,0,0.18)',
              background: 'rgba(255,255,255,0.6)',
              padding: 10,
              cursor: 'pointer',
              borderRadius: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 96, height: 96, flex: '0 0 auto' }}>
                <ExhibitPoster
                  seed={ex.seed}
                  variant={ex.subtitle}
                  mode={mode}
                  glitchBoost={false}
                  imageSrc={ex.imageSrc}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 13 }}>
                  {ex.index ? `№${ex.index}` : ''} {ex.title}
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                  {ex.subtitle}
                </div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, marginTop: 8 }}>
                  {ex.curator}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ex.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 10,
                        padding: '3px 6px',
                        border: '1px solid rgba(0,0,0,0.2)',
                        background: 'rgba(0,255,180,0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                opacity: 0.7,
              }}
            >
              открыть...
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

