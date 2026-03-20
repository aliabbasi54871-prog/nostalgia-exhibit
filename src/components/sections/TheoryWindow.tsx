import { useMemo, useState } from 'react'

type NodeId = 'nostalgia' | 'memory-media' | 'internet-memories'

type Node = {
  id: NodeId
  label: string
  body: string
  x: number
  y: number
}

const nodes: Node[] = [
  {
    id: 'nostalgia',
    label: 'цифровая ностальгия',
    body:
      'Это не просто тоска. Это “режим чтения”: прошлое становится способом ощущать медиа, скорость, ошибки и интерфейс как авторский почерк.',
    x: 55,
    y: 34,
  },
  {
    id: 'memory-media',
    label: 'память и медиа',
    body:
      'Память хранит не только факты, но и форму опыта: как страница загружалась, как курсор дрожал, как визуальная система “объясняла” себя.',
    x: 18,
    y: 66,
  },
  {
    id: 'internet-memories',
    label: 'интернет как воспоминание',
    body:
      'Сеть превращается в архив ощущений. Возврат туда не воспроизводит оригинал, а создаёт новую работу — интерпретацию эпохи через её следы.',
    x: 82,
    y: 68,
  },
]

export default function TheoryWindow() {
  const [openIds, setOpenIds] = useState<NodeId[]>([])

  const connectors = useMemo(() => {
    // SVG координаты в процентах контейнера.
    return [
      { a: 'nostalgia', b: 'memory-media' },
      { a: 'nostalgia', b: 'internet-memories' },
      { a: 'memory-media', b: 'internet-memories' },
    ] as const
  }, [])

  function toggle(id: NodeId) {
    setOpenIds((prev) => {
      const exists = prev.includes(id)
      if (exists) return prev.filter((x) => x !== id)
      // держим “исследование” в разумных рамках
      if (prev.length >= 3) return [prev[1], prev[2], id].filter(Boolean)
      return [...prev, id]
    })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontWeight: 1000, fontSize: 15 }}>Теоретический раздел</div>
      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 320,
          border: '2px dashed rgba(0,0,0,0.28)',
          background:
            'linear-gradient(135deg, rgba(0,255,170,0.08), transparent 55%), rgba(255,255,255,0.55)',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="g">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" />
              <feDisplacementMap in="SourceGraphic" scale="0.8" />
            </filter>
          </defs>
          {connectors.map((c, i) => {
            const A = nodes.find((n) => n.id === c.a)!
            const B = nodes.find((n) => n.id === c.b)!
            return (
              <path
                key={i}
                d={`M ${A.x} ${A.y} Q 50 50 ${B.x} ${B.y}`}
                fill="none"
                stroke={i % 2 === 0 ? 'rgba(0,40,255,0.35)' : 'rgba(255,0,170,0.25)'}
                strokeWidth={0.9}
                strokeDasharray="2 2"
                filter="url(#g)"
              />
            )
          })}
        </svg>

        {nodes.map((n) => {
          const isOpen = openIds.includes(n.id)
          return (
            <div
              key={n.id}
              style={{
                position: 'absolute',
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isOpen ? 280 : 220,
                background: isOpen ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)',
                border: '2px solid rgba(0,0,0,0.22)',
                padding: 8,
                cursor: 'pointer',
                boxShadow: isOpen ? '0 0 0 4px rgba(0,255,180,0.08)' : 'none',
              }}
              role="button"
              tabIndex={0}
              onClick={() => toggle(n.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggle(n.id)
              }}
            >
              <div style={{ fontFamily: "'MS Sans Serif', Arial, sans-serif", fontWeight: 1000, fontSize: 12 }}>
                {n.label}
              </div>
              {isOpen ? (
                <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.35 }}>{n.body}</div>
              ) : (
                <div style={{ marginTop: 6, fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
                  щелкни: откроется фрагмент
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
        подсказка: открой до 3 узлов одновременно — так появляется эффект “сопоставления”
      </div>
    </div>
  )
}

