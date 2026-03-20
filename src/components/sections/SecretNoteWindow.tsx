export default function SecretNoteWindow() {
  return (
    <div>
      <div style={{ fontWeight: 1000, fontSize: 15, marginBottom: 10 }}>СЕКРЕТНОЕ СООБЩЕНИЕ</div>
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
        наблюдение: система получила фрагменты истории от пользователя.
      </div>

      <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.4 }}>
        Мы обнаружили совпадение: открыты экспонаты из двух разных “температур” эпохи.
        Поэтому интерфейс открывает ответ не через чтение, а через взаимодействие.
      </div>

      <div style={{ marginTop: 12, padding: 10, border: '2px solid rgba(0,0,0,0.18)', background: 'rgba(255,255,255,0.6)' }}>
        <div style={{ fontWeight: 1000, fontFamily: "'MS Sans Serif', Arial, sans-serif" }}>
          сервисный протокол
        </div>
        <div style={{ marginTop: 8, fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9 }}>
          • если хочешь увидеть “итог”, открой рефлексию
          <br />
          • если хочешь стереть следы — начни заново
        </div>
      </div>
    </div>
  )
}

