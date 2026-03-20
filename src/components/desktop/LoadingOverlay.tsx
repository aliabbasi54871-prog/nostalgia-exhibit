import { useEffect, useState } from 'react'

type Props = {
  onDone: () => void
}

export default function LoadingOverlay({ onDone }: Props) {
  const [progress, setProgress] = useState(0)
  const [line, setLine] = useState('Подключение к интернету…')

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = () => {
      const t = performance.now() - start
      const pct = Math.min(100, Math.floor((t / 4200) * 100))
      setProgress(pct)

      if (pct < 25) setLine('Подключение: модем ищет сигнал…')
      else if (pct < 55) setLine('Протокол: рукопожатие пакетов…')
      else if (pct < 80) setLine('Загрузка: адреса в очереди…')
      else if (pct < 100) setLine('Готово. Кэш почти сохранился.')

      if (pct >= 100) {
        onDone()
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <div className="v-DialupOverlay" role="status" aria-live="polite">
      <div className="v-DialupBox">
        <div className="v-DialupTitle">WINNET 1.0</div>
        <div className="v-DialupLine">
          {line}
          <br />
          Пожалуйста, не закрывайте окно — система стареет на глазах.
        </div>
        <div className="v-ProgressBar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

