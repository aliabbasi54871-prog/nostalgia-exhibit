type Props = {
  label: string
  hint?: string
  onClick: () => void
}

export default function DesktopIcon({ label, hint, onClick }: Props) {
  return (
    <button className="v-IconBtn" onClick={onClick} type="button">
      <div className="v-IconGlyph" />
      <div className="v-IconLabel">{label}</div>
      {hint ? <div className="v-MiniHint">{hint}</div> : null}
    </button>
  )
}

