import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import LoadingOverlay from './LoadingOverlay'
import DesktopIcon from './DesktopIcon'
import WindowFrame from './WindowFrame'
import type { ConnectionMode, DesktopWindow, WindowKind, WindowKey } from './types'
import { exhibits } from '../../data/exhibits'
import type { Exhibit } from '../../data/exhibits'
import AboutWindow from '../sections/AboutWindow'
import TheoryWindow from '../sections/TheoryWindow'
import AestheticsWindow from '../sections/AestheticsWindow'
import ExhibitGallery from '../exhibits/ExhibitGallery'
import ExhibitViewer from '../exhibits/ExhibitViewer'
import VintageComposerWindow from '../creator/VintageComposerWindow'
import ReflectionWindow from '../sections/ReflectionWindow'
import SessionLogWindow, { type LogEntry } from './SessionLogWindow'
import SecretNoteWindow from '../sections/SecretNoteWindow'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

type MainKey =
  | 'about'
  | 'theory'
  | 'aesthetics'
  | 'exhibition'
  | 'composer'
  | 'reflection'
  | 'serviceLog'
  | 'secretNote'

const mainDefaults: Record<MainKey, { title: string; kind: WindowKind; width: number; height: number; glitchOnOpen?: boolean }> = {
  about: { title: 'О проекте', kind: 'about', width: 560, height: 430, glitchOnOpen: true },
  theory: { title: 'Теория', kind: 'theory', width: 640, height: 520 },
  aesthetics: { title: 'Эстетика', kind: 'aesthetics', width: 650, height: 520 },
  exhibition: { title: 'Выставка', kind: 'exhibition', width: 860, height: 560, glitchOnOpen: true },
  composer: { title: 'Создать', kind: 'composer', width: 980, height: 620 },
  reflection: { title: 'Рефлексия', kind: 'reflection', width: 740, height: 560 },
  serviceLog: { title: 'Системные сообщения', kind: 'serviceLog', width: 740, height: 520 },
  secretNote: { title: 'Секретный протокол', kind: 'secretNote', width: 680, height: 420, glitchOnOpen: true },
}

function getExhibitById(exhibitId: string, userExhibit: Exhibit | null) {
  if (userExhibit && userExhibit.id === exhibitId) return userExhibit
  return exhibits.find((e) => e.id === exhibitId) ?? null
}

export default function DesktopShell() {
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [windows, setWindows] = useState<DesktopWindow[]>([])
  const windowsRef = useRef<DesktopWindow[]>([])
  const [zCursor, setZCursor] = useState(10)
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('good')
  const [userExhibit, setUserExhibit] = useState<Exhibit | null>(null)

  const [sessionOpenedCount, setSessionOpenedCount] = useState(0)
  const [visitedExhibits, setVisitedExhibits] = useState<string[]>([])
  const visitedRef = useRef<string[]>([])
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [secretOpened, setSecretOpened] = useState(false)
  const secretOpenedRef = useRef(false)

  const viewport = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    return { w, h }
  }, [])

  useEffect(() => {
    windowsRef.current = windows
  }, [windows])

  useEffect(() => {
    visitedRef.current = visitedExhibits
  }, [visitedExhibits])

  useEffect(() => {
    secretOpenedRef.current = secretOpened
  }, [secretOpened])

  useEffect(() => {
    function onOpenEx() {
      openMain('exhibition')
    }
    window.addEventListener('open:exhibition', onOpenEx as EventListener)
    return () => window.removeEventListener('open:exhibition', onOpenEx as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function log(text: string) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      time: Date.now(),
      text,
    }
    setLogEntries((prev) => [...prev, entry])
  }

  function bringToFront(id: string) {
    setWindows((prev) => {
      const idx = prev.findIndex((w) => w.id === id)
      if (idx === -1) return prev
      const z = zCursor + 1
      setZCursor(z)
      const next = prev.slice()
      next[idx] = { ...next[idx], z }
      return next
    })
    setFocusedId(id)
  }

  function nextPos(w: number, h: number, count: number) {
    // Винтажная “ручность”: оффсеты слегка гуляют.
    const baseX = 80 + (count * 42) % 240
    const baseY = 70 + (count * 28) % 220
    const x = clamp(baseX + (count % 2 ? 16 : -10), 10, Math.max(10, viewport.w - w - 10))
    const y = clamp(baseY + (count % 3 ? -6 : 10), 10, Math.max(10, viewport.h - h - 30))
    return { x, y }
  }

  function openMain(key: MainKey) {
    const existing = windowsRef.current.find((win) => win.key === key)
    if (existing) {
      bringToFront(existing.id)
      return
    }

    const meta = mainDefaults[key]
    if (!meta) return

    const id = `${key}-${Date.now()}`
    const { x, y } = nextPos(meta.width, meta.height, windowsRef.current.length + 1)
    const z = zCursor + 1
    setZCursor(z)

    const win: DesktopWindow = {
      id,
      kind: meta.kind,
      key,
      title: meta.title,
      x,
      y,
      width: meta.width,
      height: meta.height,
      z,
      glitchOnOpen: meta.glitchOnOpen,
    }

    setWindows((prev) => [...prev, win])
    setFocusedId(id)
    setSessionOpenedCount((c) => c + 1)
    log(`Открыто окно: ${meta.title}`)
  }

  function openExhibit(exhibitId: string) {
    const key = `exhibitViewer:${exhibitId}` as WindowKey
    const existing = windowsRef.current.find((win) => win.key === key)
    if (existing) {
      bringToFront(existing.id)
      return
    }

    const meta = { title: 'Просмотр экспоната', width: 860, height: 620 }
    const { x, y } = nextPos(meta.width, meta.height, windowsRef.current.length + 2)
    const z = zCursor + 1
    setZCursor(z)
    const id = `${key}-${Date.now()}`

    const win: DesktopWindow = {
      id,
      kind: 'exhibitViewer',
      key,
      title: 'Просмотр экспоната',
      x,
      y,
      width: meta.width,
      height: meta.height,
      z,
      glitchOnOpen: true,
      exhibitId,
    }

    setWindows((prev) => [...prev, win])
    setFocusedId(id)
    setSessionOpenedCount((c) => c + 1)
    log(`Открыт экспонат: ${exhibitId}`)
  }

  function closeWindow(id: string) {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setFocusedId((prev) => (prev === id ? null : prev))
  }

  function updateWindowPos(id: string, x: number, y: number) {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }

  function updateWindowSize(id: string, width: number, height: number) {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)))
  }

  function resetSession() {
    setWindows([])
    setFocusedId(null)
    setConnectionMode('good')
    setUserExhibit(null)
    setSessionOpenedCount(0)
    setVisitedExhibits([])
    setLogEntries([])
    setSecretOpened(false)
    // Для реального “исследования” иногда полезно начать заново с выставки.
    setTimeout(() => openMain('exhibition'), 120)
  }

  function handleVisited(exhibitId: string) {
    setVisitedExhibits((prev) => uniq([...prev, exhibitId]))
    log(`Просмотр: ${exhibitId}`)

    // Пасхалка: открываем секрет, если посетили два “температурных” экспоната.
    if (!secretOpenedRef.current) {
      const a = 'ex-04'
      const b = 'ex-08'
      const next = uniq([...visitedRef.current, exhibitId])
      if (next.includes(a) && next.includes(b)) {
        setSecretOpened(true)
        openMain('secretNote')
        log('Активация: секретный протокол')
      }
    }
  }

  function createAsExhibit(ex: Exhibit) {
    setUserExhibit(ex)
    log(`Создан пользовательский экспонат: ${ex.id}`)
    openMain('exhibition')
    // После создания открываем просмотр сразу.
    setTimeout(() => openExhibit(ex.id), 160)
  }

  // Boot: после “подключения” поднимаем несколько окон случайно, чтобы старт был художественным.
  useEffect(() => {
    if (!isLoading) {
      // Стартовое распределение: выставка почти всегда, остальное — “случайность эпохи”.
      openMain('exhibition')
      const rnd = Math.random()
      if (rnd < 0.5) openMain('about')
      if (rnd > 0.7) openMain('aesthetics')
      log('Система поднята. Начинается блуждание.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const sessionInfo = useMemo(
    () => ({
      openedCount: sessionOpenedCount,
      visitedExhibits,
    }),
    [sessionOpenedCount, visitedExhibits],
  )

  return (
    <div className="v-DesktopRoot" ref={desktopRef}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(0,255,180,0.18), transparent 45%), radial-gradient(circle at 85% 65%, rgba(255,20,170,0.14), transparent 38%), #06070d',
        }}
      />
      <div className="v-Noise" />
      <div className="v-Scanlines" />

      <div className="v-DesktopIcons" aria-label="Desktop icons">
        <DesktopIcon label="О проекте" hint="Ctrl+щелчок не нужен" onClick={() => openMain('about')} />
        <DesktopIcon label="Теория" hint="узлы вместо страниц" onClick={() => openMain('theory')} />
        <DesktopIcon label="Эстетика" hint="пиксель / GIF / хаос" onClick={() => openMain('aesthetics')} />
        <DesktopIcon label="Выставка" hint="экспонаты в окнах" onClick={() => openMain('exhibition')} />
        <DesktopIcon label="Создать" hint="конструктор Web 1.0" onClick={() => openMain('composer')} />
      </div>

      {windows.map((w) => {
        const focused = focusedId === w.id
        const exhibit = w.kind === 'exhibitViewer' ? getExhibitById(w.exhibitId ?? '', userExhibit) : null
        let content: ReactNode = null

        if (w.kind === 'about') content = <AboutWindow />
        if (w.kind === 'theory') content = <TheoryWindow />
        if (w.kind === 'aesthetics') content = <AestheticsWindow mode={connectionMode} />
        if (w.kind === 'exhibition')
          content = (
            <ExhibitGallery mode={connectionMode} onOpen={openExhibit} userExhibit={userExhibit} />
          )
        if (w.kind === 'composer')
          content = <VintageComposerWindow onCreateAsExhibit={createAsExhibit} />
        if (w.kind === 'reflection')
          content = (
            <ReflectionWindow sessionInfo={sessionInfo} onResetSession={resetSession} />
          )
        if (w.kind === 'serviceLog')
          content = <SessionLogWindow entries={logEntries} onReset={() => setLogEntries([])} connectionMode={connectionMode} />
        if (w.kind === 'secretNote') content = <SecretNoteWindow />
        if (w.kind === 'exhibitViewer' && exhibit)
          content = (
            <ExhibitViewer
              exhibit={exhibit}
              initialMode={connectionMode}
              onModeChange={(m) => setConnectionMode(m)}
              onVisited={handleVisited}
            />
          )

        return (
          <WindowFrame
            key={w.id}
            title={w.title}
            x={w.x}
            y={w.y}
            width={w.width}
            height={w.height}
            z={w.z}
            focused={focused}
            glitchOnOpen={w.glitchOnOpen}
            onClose={() => closeWindow(w.id)}
            onFocus={() => bringToFront(w.id)}
            onMove={(nx, ny) => updateWindowPos(w.id, nx, ny)}
            onResize={(nw, nh) => updateWindowSize(w.id, nw, nh)}
          >
            {w.kind === 'exhibition' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ flex: '1 1 auto' }}>
                  {content}
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => openMain('reflection')}
                      style={{
                        border: '2px solid rgba(0,0,0,0.22)',
                        background: 'rgba(255,20,140,0.12)',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        fontFamily: "'MS Sans Serif', Arial, sans-serif",
                        fontWeight: 1000,
                      }}
                    >
                      к финалу: рефлексия
                    </button>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
                      пасхалка: секрет активируется после открытия `ex-04` и `ex-08`
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              content
            )}
          </WindowFrame>
        )
      })}

      <div className="v-DesktopBar" aria-label="System status bar">
        <div
          className="v-StatusPill"
          onClick={() => openMain('serviceLog')}
          role="button"
          tabIndex={0}
        >
          [system] соединение={connectionMode} | окна={windows.length} | журнал={logEntries.length} | щелкни для сообщений
        </div>
        <div
          style={{
            flex: '0 0 auto',
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            opacity: 0.85,
            color: 'rgba(225,250,255,0.95)',
            paddingRight: 8,
          }}
        >
          WINNET • виртуальная выставка
        </div>
      </div>

      {isLoading ? <LoadingOverlay onDone={() => setIsLoading(false)} /> : null}
    </div>
  )
}

