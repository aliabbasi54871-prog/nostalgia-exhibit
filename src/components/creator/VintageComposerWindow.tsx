import { useMemo, useState } from 'react'
import { hashStringToSeed } from '../../lib/rng'
import type { Exhibit } from '../../data/exhibits'

type MotifId = 'scanStar' | 'captchaSpinner' | 'bubbleBounce' | 'pixelMarquee'
type BackgroundId = 'acidGrid' | 'crtGlow' | 'webStripes' | 'plainNoise'

type Props = {
  onCreateAsExhibit: (exhibit: Exhibit) => void
}

function makeHtml({
  background,
  accent,
  motif,
  text,
  seed,
}: {
  background: string
  accent: string
  motif: MotifId
  text: string
  seed: number
}) {
  const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const motifClass =
    motif === 'scanStar'
      ? 'v-motif-scan'
      : motif === 'captchaSpinner'
        ? 'v-motif-captcha'
        : motif === 'bubbleBounce'
          ? 'v-motif-bubble'
          : 'v-motif-marquee'

  // Inline CSS so the exported page is self-contained.
  const bgCss =
    background === 'acidGrid'
      ? `background:
        radial-gradient(circle at 10% 20%, ${accent}33, transparent 40%),
        repeating-linear-gradient(90deg, rgba(0,255,200,0.15) 0 1px, transparent 1px 8px),
        repeating-linear-gradient(0deg, rgba(0,255,200,0.12) 0 1px, transparent 1px 8px),
        #06070d;`
      : background === 'crtGlow'
        ? `background:
        radial-gradient(circle at 30% 20%, ${accent}55, transparent 45%),
        radial-gradient(circle at 70% 65%, #00ffcc44, transparent 40%),
        repeating-linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.12) 2px, transparent 4px),
        #05050a;`
        : background === 'webStripes'
          ? `background:
        repeating-linear-gradient(135deg, rgba(255,255,0,0.12) 0 8px, transparent 8px 18px),
        repeating-linear-gradient(45deg, rgba(0,255,170,0.09) 0 6px, transparent 6px 14px),
        #070a10;`
          : `background:
        radial-gradient(circle at 30% 40%, ${accent}44, transparent 45%),
        repeating-linear-gradient(90deg, rgba(0,255,180,0.08) 0 1px, transparent 1px 7px),
        #06070d;`

  const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Web 1.0: моя страница</title>
  <style>
    body{
      margin:0;
      font-family: Arial, "Times New Roman", "MS Sans Serif", sans-serif;
      color:#eaffff;
      overflow:hidden;
      ${bgCss}
    }
    .frame{
      border:3px solid #2a2a2a;
      margin:18px;
      background: rgba(255,255,255,0.06);
      box-shadow: 8px 8px 0 rgba(0,0,0,0.25);
      image-rendering: pixelated;
    }
    .titlebar{
      height:26px;
      background: #0b2a7a;
      color:#e7f1ff;
      display:flex;
      align-items:center;
      padding: 0 10px;
      font-weight:700;
      border-bottom:2px solid rgba(255,255,255,0.18);
    }
    .content{
      padding: 12px;
    }
    table{
      width:100%;
      border-collapse: collapse;
      background: rgba(0,0,0,0.25);
    }
    td{
      border:1px dashed rgba(255,255,255,0.18);
      padding:10px;
      vertical-align: top;
    }
    .left{ width: 30%; }
    .motif{
      height:52px;
      border:2px inset rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.06);
      position: relative;
      overflow:hidden;
    }
    .${motifClass}{
      position:absolute; left:0; top:0; right:0; bottom:0;
    }
    .v-motif-scan{
      background:
        repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 8px);
      animation: scanmove 1.2s steps(6) infinite;
    }
    @keyframes scanmove{
      0%{ transform: translateX(-14px) }
      100%{ transform: translateX(14px) }
    }
    .v-motif-captcha{
      background:
        radial-gradient(circle at 30% 50%, ${accent}66 0 8px, transparent 9px),
        radial-gradient(circle at 70% 50%, #00ffcc55 0 8px, transparent 9px);
      animation: captchaSpin 1.1s steps(12) infinite;
    }
    @keyframes captchaSpin{
      0%{ transform: rotate(0deg) scale(1.0) }
      100%{ transform: rotate(360deg) scale(1.05) }
    }
    .v-motif-bubble{
      background:
        radial-gradient(circle at 20% 80%, ${accent}55 0 8px, transparent 9px),
        radial-gradient(circle at 45% 60%, #00ffcc55 0 7px, transparent 8px),
        radial-gradient(circle at 80% 40%, ${accent}66 0 6px, transparent 7px);
      animation: bubbleUp 1.6s steps(8) infinite;
    }
    @keyframes bubbleUp{
      0%{ transform: translateY(10px) }
      60%{ transform: translateY(-8px) }
      100%{ transform: translateY(10px) }
    }
    .v-motif-marquee{
      background: repeating-linear-gradient(90deg,
        rgba(255,255,255,0.12) 0 10px, transparent 10px 22px);
      animation: marquee 1.0s steps(10) infinite;
    }
    @keyframes marquee{
      0%{ transform: translateX(0) }
      100%{ transform: translateX(22px) }
    }
    .text{
      font-size: 14px;
      line-height: 1.35;
      white-space: pre-wrap;
      opacity: 0.95;
    }
    .status{
      margin-top: 10px;
      font-family: "Courier New", monospace;
      font-size: 12px;
      opacity: 0.85;
    }
  </style>
</head>
<body>
  <div class="frame">
    <div class="titlebar">Web 1.0 page / seed:${seed}</div>
    <div class="content">
      <table>
        <tr>
          <td class="left">
            <div style="font-weight:900; margin-bottom:8px;">Навигация</div>
            <div style="font-family: 'Courier New', monospace; font-size:12px;">
              <div>• Главная</div>
              <div>• Архив</div>
              <div>• Обо мне</div>
              <div style="margin-top:8px; opacity:0.8;">ссылка (битая): /soon.html</div>
            </div>
          </td>
          <td>
            <div style="font-weight:900; margin-bottom:8px;">Приветствие</div>
            <div class="motif"><div class="${motifClass}"></div></div>
            <div class="text" style="margin-top:10px;">${safeText}</div>
            <div class="status">Подключение: медленная очередь. Время: ${new Date().toLocaleTimeString()}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`

  return html
}

export default function VintageComposerWindow({ onCreateAsExhibit }: Props) {
  const [background, setBackground] = useState<BackgroundId>('acidGrid')
  const [accent, setAccent] = useState('#00ffcc')
  const [motif, setMotif] = useState<MotifId>('scanStar')
  const [text, setText] = useState('Здравствуйте.\nЭто мой старый сайт.\nПожалуйста, не чините глитч — он авторский.')

  const seed = useMemo(() => hashStringToSeed(`${background}|${accent}|${motif}|${text}`), [background, accent, motif, text])

  function downloadHtml() {
    const html = makeHtml({ background, accent, motif, text, seed })
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `web1_my_site_${seed}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  function createAsExhibit() {
    const exhibit: Exhibit = {
      id: `user-${seed}`,
      index: 0,
      title: 'Мой старый сайт',
      subtitle: `web1.${seed.toString(16).slice(0, 6)}`,
      seed,
      curator: 'Пользовательская сборка: интерфейс как воспоминание.',
      curatorLong:
        'Экспонат создан конструктором: это не “точная копия” раннего веба, а художественная реконструкция привычки смотреть. Здесь намеренно остаются несовпадения и тени ошибок.',
      tags: ['пользователь', motif, background],
    }
    onCreateAsExhibit(exhibit)
  }

  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 1000, fontSize: 15, marginBottom: 10 }}>Создай свой старый сайт</div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
            фон
          </div>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value as BackgroundId)}
            style={{ width: '100%', padding: 8, fontFamily: 'inherit' }}
          >
            <option value="acidGrid">acid grid</option>
            <option value="crtGlow">crt glow</option>
            <option value="webStripes">web stripes</option>
            <option value="plainNoise">plain noise</option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
            цвет акцента
          </div>
          <input value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: '100%', padding: 8 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.8, marginTop: 6 }}>
            подсказка: попробуй `#ff00cc` или `#00ffcc`
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
            “GIF” мотив (анимация)
          </div>
          <select value={motif} onChange={(e) => setMotif(e.target.value as MotifId)} style={{ width: '100%', padding: 8, fontFamily: 'inherit' }}>
            <option value="scanStar">scan star</option>
            <option value="captchaSpinner">captcha spinner</option>
            <option value="bubbleBounce">bubble bounce</option>
            <option value="pixelMarquee">pixel marquee</option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.9, marginBottom: 6 }}>
            текст (в стиле “страница на салфетке”)
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: 8,
              fontFamily: "'MS Sans Serif', Arial, sans-serif, monospace",
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={createAsExhibit}
            style={{
              border: '2px solid rgba(0,0,0,0.22)',
              background: 'rgba(0,255,180,0.18)',
              padding: '10px 10px',
              cursor: 'pointer',
              fontFamily: "'MS Sans Serif', Arial, sans-serif",
              fontWeight: 1000,
              flex: '1 1 auto',
              minWidth: 130,
            }}
          >
            сохранить как экспонат
          </button>
          <button
            type="button"
            onClick={downloadHtml}
            style={{
              border: '2px solid rgba(0,0,0,0.22)',
              background: 'rgba(255,214,0,0.14)',
              padding: '10px 10px',
              cursor: 'pointer',
              fontFamily: "'MS Sans Serif', Arial, sans-serif",
              fontWeight: 1000,
              flex: '1 1 auto',
              minWidth: 130,
            }}
          >
            скачать HTML
          </button>
        </div>

        <div style={{ marginTop: 10, fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
          системное примечание: экспорт намеренно “чуть битый” — как и должно быть.
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.85, marginBottom: 8 }}>
          предпросмотр (имитация Web 1.0)
        </div>

        <div
          style={{
            border: '3px solid rgba(0,0,0,0.38)',
            boxShadow: '10px 10px 0 rgba(0,0,0,0.25)',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              height: 26,
              background: '#0b2a7a',
              color: '#e7f1ff',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              fontWeight: 900,
              borderBottom: '2px solid rgba(255,255,255,0.18)',
              fontFamily: "'MS Sans Serif', Arial, sans-serif",
              imageRendering: 'pixelated',
            }}
          >
            Web 1.0 / seed:{seed}
          </div>
          <div
            style={{
              padding: 12,
              color: '#eaffff',
              background:
                background === 'acidGrid'
                  ? `radial-gradient(circle at 10% 20%, ${accent}33, transparent 40%), repeating-linear-gradient(90deg, rgba(0,255,200,0.15) 0 1px, transparent 1px 8px), repeating-linear-gradient(0deg, rgba(0,255,200,0.12) 0 1px, transparent 1px 8px), #06070d`
                  : background === 'crtGlow'
                    ? `radial-gradient(circle at 30% 20%, ${accent}55, transparent 45%), radial-gradient(circle at 70% 65%, #00ffcc44, transparent 40%), repeating-linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.12) 2px, transparent 4px), #05050a`
                    : background === 'webStripes'
                      ? `repeating-linear-gradient(135deg, rgba(255,255,0,0.12) 0 8px, transparent 8px 18px), repeating-linear-gradient(45deg, rgba(0,255,170,0.09) 0 6px, transparent 6px 14px), #070a10`
                      : `radial-gradient(circle at 30% 40%, ${accent}44, transparent 45%), repeating-linear-gradient(90deg, rgba(0,255,180,0.08) 0 1px, transparent 1px 7px), #06070d`,
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(0,0,0,0.25)' }}>
              <tbody>
                <tr>
                  <td style={{ width: '30%', border: '1px dashed rgba(255,255,255,0.18)', padding: 10, verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 1000, marginBottom: 8, fontSize: 13 }}>Навигация</div>
                    <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12 }}>
                      <div>• Главная</div>
                      <div>• Архив</div>
                      <div>• Обо мне</div>
                      <div style={{ marginTop: 8, opacity: 0.8 }}>ссылка (битая): /soon.html</div>
                    </div>
                  </td>
                  <td style={{ border: '1px dashed rgba(255,255,255,0.18)', padding: 10 }}>
                    <div style={{ fontWeight: 1000, marginBottom: 8, fontSize: 13 }}>Приветствие</div>
                    <div
                      style={{
                        height: 52,
                        border: '2px inset rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.06)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          // Inline motif styles rely on keyframes defined in index.css via class names.
                        }}
                        className={
                          motif === 'scanStar'
                            ? 'v-motif-scan'
                            : motif === 'captchaSpinner'
                              ? 'v-motif-captcha'
                              : motif === 'bubbleBounce'
                                ? 'v-motif-bubble'
                                : 'v-motif-marquee'
                        }
                      />
                      {/* override motif colors */}
                      <style>{`
                        .v-motif-scan{ background: repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 8px); animation: scanmove 1.2s steps(6) infinite; }
                        .v-motif-captcha{ background: radial-gradient(circle at 30% 50%, ${accent}66 0 8px, transparent 9px), radial-gradient(circle at 70% 50%, #00ffcc55 0 8px, transparent 9px); animation: captchaSpin 1.1s steps(12) infinite; }
                        .v-motif-bubble{ background: radial-gradient(circle at 20% 80%, ${accent}55 0 8px, transparent 9px), radial-gradient(circle at 45% 60%, #00ffcc55 0 7px, transparent 8px), radial-gradient(circle at 80% 40%, ${accent}66 0 6px, transparent 7px); animation: bubbleUp 1.6s steps(8) infinite; }
                      `}</style>
                    </div>
                    <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.35 }}>
                      {text}
                    </div>
                    <div style={{ marginTop: 10, fontFamily: "'Courier New', monospace", fontSize: 12, opacity: 0.85 }}>
                      Подключение: медленная очередь. Время: {new Date().toLocaleTimeString()}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 10, fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.85 }}>
          подсказка: открой “сохранить как экспонат” — он появится в галерее как отдельная работа
        </div>
      </div>
    </div>
  )
}

