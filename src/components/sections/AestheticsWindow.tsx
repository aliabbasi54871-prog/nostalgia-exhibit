import { useMemo, useState } from 'react'
import AnimatedPoster from '../media/AnimatedPoster'
import type { ConnectionMode } from '../desktop/types'

const tabs = [
  { id: 'pixel', label: 'пиксельная графика', seed: 2221 },
  { id: 'gif', label: 'GIF-культура', seed: 3337 },
  { id: 'chaos', label: 'хаотичные интерфейсы', seed: 4441 },
  { id: 'hand', label: 'ручной интернет', seed: 5559 },
] as const

type TabId = (typeof tabs)[number]['id']

type Props = {
  mode?: ConnectionMode
}

export default function AestheticsWindow({ mode = 'good' }: Props) {
  const [active, setActive] = useState<TabId>('pixel')

  const content = useMemo(() => {
    const map: Record<TabId, { thesis: string; details: string[] }> = {
      pixel: {
        thesis: 'Пиксельность — не “дефект”, а способ видеть эпоху.',
        details: [
          'Низкое разрешение делает структуру медиа заметной.',
          'Контур и форма важнее гладкости — как в живой печати.',
          'Мы оставляем след: интерполяция не скрывает время.',
        ],
      },
      gif: {
        thesis: 'GIF-ритм задает темп просмотра, а не просто анимацию.',
        details: [
          'Мерцание — это скорость памяти: “успеть увидеть”.',
          'Повтор превращается в художественную грамматику.',
          'Мы сохраняем “ручную” настройку времени.',
        ],
      },
      chaos: {
        thesis: 'Хаотичный интерфейс — это автограф создателя страницы.',
        details: [
          'Перекрытия и глитчи работают как эмоциональные акценты.',
          'Сетка “не идеальна”, зато честно видна работа руками.',
          'Визуальная свобода делает навигацию исследованием.',
        ],
      },
      hand: {
        thesis: 'Ручной интернет — когда страница ощущается как письма и коллаж.',
        details: [
          'Локальные правила и субъективные цвета — часть узнаваемости.',
          'Ошибки не скрываются: они становятся сюжетными узлами.',
          'Страница “говорит” своим несовпадением с нормой.',
        ],
      },
    }
    return map[active]
  }, [active])

  const tabSeed = tabs.find((t) => t.id === active)!.seed

  return (
    <div>
      <div style={{ fontWeight: 1000, fontSize: 15, marginBottom: 10 }}>Эстетика раннего интернета</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {tabs.map((t) => {
          const isOn = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              style={{
                border: '2px solid rgba(0,0,0,0.22)',
                background: isOn ? 'rgba(0,255,180,0.17)' : 'rgba(255,255,255,0.55)',
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Arial, sans-serif",
                fontWeight: 1000,
                fontSize: 12,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 12, alignItems: 'start' }}>
        <div style={{ width: 170, height: 170, border: '2px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.55)' }}>
          <AnimatedPoster seed={tabSeed} variant={active} mode={mode} glitchBoost />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
            тезис
          </div>
          <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.4, fontWeight: 900 }}>
            {content.thesis}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.4 }}>
            {content.details.map((d, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 6 }}>
                — {d}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
            Важно: здесь “красота” сознательно включает шум и ошибку.
          </div>
        </div>
      </div>
    </div>
  )
}

