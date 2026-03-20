import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
  focused: boolean
  glitchOnOpen?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
  children: ReactNode
}

export default function WindowFrame(props: Props) {
  const dragRef = useRef<{
    startX: number
    startY: number
    winX: number
    winY: number
    pointerId: number
  } | null>(null)

  const resizeRef = useRef<{
    startX: number
    startY: number
    startW: number
    startH: number
    pointerId: number
  } | null>(null)

  const style = useMemo(
    () => ({
      left: props.x,
      top: props.y,
      width: props.width,
      height: props.height,
      zIndex: props.z,
    }),
    [props.x, props.y, props.width, props.height, props.z],
  )

  function onHeaderPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    props.onFocus()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      winX: props.x,
      winY: props.y,
      pointerId: e.pointerId,
    }
  }

  function onHeaderPointerMove(e: React.PointerEvent) {
    const state = dragRef.current
    if (!state) return
    if (state.pointerId !== e.pointerId) return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY
    props.onMove(state.winX + dx, state.winY + dy)
  }

  function onHeaderPointerUp(e: React.PointerEvent) {
    if (!dragRef.current) return
    if (dragRef.current.pointerId !== e.pointerId) return
    dragRef.current = null
  }

  function onResizePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    e.stopPropagation()
    props.onFocus()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: props.width,
      startH: props.height,
      pointerId: e.pointerId,
    }
  }

  function onResizePointerMove(e: React.PointerEvent) {
    const state = resizeRef.current
    if (!state) return
    if (state.pointerId !== e.pointerId) return

    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY

    const nextW = Math.max(320, state.startW + dx)
    const nextH = Math.max(220, state.startH + dy)
    props.onResize(nextW, nextH)
  }

  function onResizePointerUp(e: React.PointerEvent) {
    if (!resizeRef.current) return
    if (resizeRef.current.pointerId !== e.pointerId) return
    resizeRef.current = null
  }

  return (
    <section
      className={[
        'v-Window',
        props.focused ? 'v-WindowFocus' : '',
        props.glitchOnOpen ? 'v-GlitchFlash' : '',
      ].join(' ')}
      style={style}
      onPointerDown={() => props.onFocus()}
    >
      <div
        className="v-WindowHeader"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        role="button"
        aria-label={`Window header: ${props.title}`}
        tabIndex={-1}
      >
        <div className="v-WindowTitle">{props.title}</div>
        <div className="v-WindowHeaderButtons">
          <div className="v-WindowBtn" role="button" onClick={props.onClose}>
            ×
          </div>
        </div>
      </div>
      <div className="v-WindowBody">
        <div className="v-WindowInner">{props.children}</div>
        <div
          className="v-ResizeHandle"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}

