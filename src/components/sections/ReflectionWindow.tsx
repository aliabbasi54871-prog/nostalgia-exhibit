import { useMemo, useState } from 'react'

type Props = {
  sessionInfo: {
    openedCount: number
    visitedExhibits: string[]
  }
  onResetSession: () => void
}

const options = [
  {
    id: 'shape',
    label: 'мы ностальгируем по форме опыта',
    text:
      'Ранний интернет запоминался не “содержимым”, а способом видеть: шумом, скоростью, ошибками. Ностальгия здесь — это память о наблюдении.',
  },
  {
    id: 'auth',
    label: 'потому что там ощущается авторство',
    text:
      'Ручной характер веба превращал страницу в письмо. Мы тянемся к узнаваемому почерку, даже когда знаем, что это реконструкция.',
  },
  {
    id: 'delay',
    label: 'потому что задержка была частью эмоции',
    text:
      'Медленное подключение и ожидание делали просмотр событием. Сегодня интерфейсы ускорены — и вместе с этим исчезает “ритм памяти”.',
  },
  {
    id: 'archive',
    label: 'потому что архив стал художественным',
    text:
      'Мы возвращаемся к фрагментам как к материалам искусства. Потеря данных и битые ссылки превращаются в язык рассказа.',
  },
] as const

export default function ReflectionWindow({ sessionInfo, onResetSession }: Props) {
  const [selected, setSelected] = useState<(typeof options)[number]['id'] | null>(null)

  const selectedOption = useMemo(() => {
    return options.find((o) => o.id === selected) ?? null
  }, [selected])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontWeight: 1000, fontSize: 15 }}>
        Почему мы ностальгируем по раннему интернету?
      </div>

      <div style={{ border: '2px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.65)' }}>
        <div style={{ padding: 10 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
            выбери вариант — это будет финальным “переосмыслением”
          </div>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {options.map((o) => (
              <label
                key={o.id}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
              >
                <input
                  type="radio"
                  name="reflection"
                  checked={selected === o.id}
                  onChange={() => setSelected(o.id)}
                />
                <span style={{ fontFamily: "'MS Sans Serif', Arial, sans-serif", fontWeight: 900, fontSize: 12 }}>
                  {o.label}
                </span>
              </label>
            ))}
          </div>

          {selectedOption ? (
            <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.4 }}>
              <b>ответ системы:</b> {selectedOption.text}
            </div>
          ) : (
            <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
              выбери вариант — и “система” соберет твою версию истории.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        <div style={{ border: '2px dashed rgba(0,0,0,0.22)', background: 'rgba(255,255,255,0.55)', padding: 10 }}>
          <div style={{ fontWeight: 1000, fontSize: 13 }}>Карта сессии</div>
          <div style={{ marginTop: 6, fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
            окна открыто: <b>{sessionInfo.openedCount}</b>
            <br />
            экспонаты просмотрены: <b>{sessionInfo.visitedExhibits.length}</b>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sessionInfo.visitedExhibits.slice(0, 8).map((id) => (
              <span
                key={id}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 11,
                  padding: '3px 6px',
                  border: '1px solid rgba(0,0,0,0.22)',
                  background: 'rgba(0,255,180,0.08)',
                }}
              >
                {id}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onResetSession}
          style={{
            border: '2px solid rgba(0,0,0,0.22)',
            background: 'rgba(255,20,140,0.12)',
            padding: '8px 10px',
            cursor: 'pointer',
            fontFamily: "'MS Sans Serif', Arial, sans-serif",
            fontWeight: 1000,
          }}
        >
          начать заново (стереть следы сессии)
        </button>
      </div>
    </div>
  )
}

