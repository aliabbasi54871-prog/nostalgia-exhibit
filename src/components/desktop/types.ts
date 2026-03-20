export type WindowKind =
  | 'about'
  | 'theory'
  | 'aesthetics'
  | 'exhibition'
  | 'composer'
  | 'reflection'
  | 'serviceLog'
  | 'exhibitViewer'
  | 'secretNote'

export type WindowKey =
  | 'about'
  | 'theory'
  | 'aesthetics'
  | 'exhibition'
  | 'composer'
  | 'reflection'
  | 'serviceLog'
  | `exhibitViewer:${string}`
  | 'secretNote'

export type DesktopWindow = {
  id: string
  kind: WindowKind
  key: WindowKey
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
  glitchOnOpen?: boolean
  exhibitId?: string
}

export type ConnectionMode = 'good' | 'slow' | 'bad'

