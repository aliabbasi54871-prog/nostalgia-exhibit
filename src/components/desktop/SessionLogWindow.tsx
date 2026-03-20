import type { ConnectionMode } from './types'

export type LogEntry = {
  id: string
  time: number
  text: string
}

type Props = {
  entries: LogEntry[]
  onReset: () => void
  connectionMode?: ConnectionMode
}

export default function SessionLogWindow({
  entries,
  onReset,
  connectionMode,
}: Props) {
  return (
    <div>
      <div style={{ fontWeight: 1000, fontSize: 15, marginBottom: 10 }}>Служебный журнал</div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
        режим соединения: <b>{connectionMode ?? '—'}</b>
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          type="button"
          onClick={onReset}
          style={{
            border: '2px solid rgba(0,0,0,0.22)',
            background: 'rgba(255,214,0,0.14)',
            padding: '6px 10px',
            cursor: 'pointer',
            fontFamily: "'MS Sans Serif', Arial, sans-serif",
            fontWeight: 1000,
          }}
        >
          очистить лог
        </button>
      </div>

      <div style={{ marginTop: 12, border: '2px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.65)' }}>
        <div style={{ padding: 10, maxHeight: 340, overflow: 'auto' }}>
          {entries.length === 0 ? (
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.85 }}>
              лога пока нет. открой окно — и система запишет след.
            </div>
          ) : null}
          {entries.slice().reverse().map((e) => (
            <div
              key={e.id}
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                padding: '6px 0',
                borderBottom: '1px dashed rgba(0,0,0,0.18)',
                whiteSpace: 'pre-wrap',
              }}
            >
              [{new Date(e.time).toLocaleTimeString()}] {e.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

