import { useState } from 'react'

export default function AboutWindow() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div style={{ fontWeight: 1000, fontSize: 15, marginBottom: 8 }}>
        О проекте
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.4 }}>
        <b>«Эстетика цифровой ностальгии»</b> — это виртуальная выставка, где ранний интернет (Web 1.0–2.0)
        рассматривается не как “история технологий”, а как культурная и художественная форма.
        Интерфейс здесь — часть высказывания: он намеренно неидеальный, чтобы вернуть ощущение эпохи.
      </div>

      <div style={{ marginTop: 12, fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
        цифровая ностальгия — это когда прошлое не “возвращают”, а переизобретают
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            border: '2px solid rgba(0,0,0,0.22)',
            background: 'rgba(255,255,255,0.65)',
            padding: '6px 10px',
            cursor: 'pointer',
            fontFamily: "'MS Sans Serif', Arial, sans-serif",
            fontWeight: 900,
          }}
        >
          {open ? 'свернуть пояснение' : 'развернуть пояснение'}
        </button>
      </div>

      {open ? (
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.4 }}>
          Ностальгия по раннему вебу — это память о способе смотреть: медленнее, шумнее, ближе к человеческому “почерку”.
          Мы сохраняем следы: пиксельность, гиф-ритм, случайные перекрытия, странные статусы загрузки.
          В этой выставке “ошибка” становится материалом, а хаос — методом.
        </div>
      ) : null}

      <div style={{ marginTop: 14 }}>
        <span
          className="v-LinkLike"
          onClick={() => window.dispatchEvent(new CustomEvent('open:exhibition'))}
        >
          перейти в галерею
        </span>
      </div>
    </div>
  )
}

