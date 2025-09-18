// html2canvas/jsPDF는 유틸에서 한 번만 임포트
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/** 엘리먼트를 캔버스로 캡처 */
export async function captureElementToCanvas(el, { scale = 3, bg = '#ffffff' } = {}) {
  if (!el) throw new Error('captureElementToCanvas: 대상 엘리먼트가 없습니다.')
  return await html2canvas(el, {
    backgroundColor: bg,
    scale,
    useCORS: true,
    allowTaint: false,
    scrollX: 0,
    scrollY: -window.scrollY,
  })
}

/** PNG로 저장 */
export async function saveCanvasAsImage(canvas, { filename = 'capture.png', quality = 0.95 } = {}) {
  const dataUrl = canvas.toDataURL('image/png', quality)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/** 여러 페이지 PDF로 저장 */
export async function saveCanvasAsPagedPdf(
  canvas,
  {
    filename = 'capture.pdf',
    format = 'a4',
    orientation = 'p',         // 'p'|'l'
    marginMM = 10,
    shrink = 0.75,             // 콘텐츠 폭 축소율
    jpegQuality = 0.95,
  } = {}
) {
  const pdf = new jsPDF(orientation, 'mm', format)
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  const contentW = (pageW - marginMM * 2) * shrink
  const ratio = contentW / canvas.width
  const contentHPxPerPage = Math.floor((pageH - marginMM * 2) / ratio)

  let sy = 0, remaining = canvas.height, first = true
  while (remaining > 0) {
    const sliceH = Math.min(contentHPxPerPage, remaining)
    const slice = document.createElement('canvas')
    slice.width = canvas.width
    slice.height = sliceH
    const ctx = slice.getContext('2d')
    ctx.drawImage(canvas, 0, sy, canvas.width, sliceH, 0, 0, canvas.width, sliceH)

    const imgData = slice.toDataURL('image/jpeg', jpegQuality)
    const imgWmm = contentW
    const imgHmm = sliceH * ratio

    if (!first) pdf.addPage()
    pdf.addImage(imgData, 'JPEG', marginMM, marginMM, imgWmm, imgHmm)

    first = false
    sy += sliceH
    remaining -= sliceH
  }
  pdf.save(filename)
}

/** PNG + PDF 둘 다 저장 */
export async function saveElementAsImageAndPdf(el, {
  baseName = 'capture',
  ts = new Date(),
  scale = 3,
  format = 'a4',
  orientation = 'p',
  marginMM = 10,
  shrink = 0.75,
} = {}) {
  const y = ts.getFullYear()
  const m = String(ts.getMonth()+1).padStart(2,'0')
  const d = String(ts.getDate()).padStart(2,'0')
  const hh = String(ts.getHours()).padStart(2,'0')
  const mm = String(ts.getMinutes()).padStart(2,'0')
  const stamp = `${y}${m}${d}_${hh}${mm}`

  const canvas = await captureElementToCanvas(el, { scale })
  await saveCanvasAsImage(canvas, { filename: `${baseName}_${stamp}.png` })
  await saveCanvasAsPagedPdf(canvas, {
    filename: `${baseName}_${stamp}.pdf`,
    format, orientation, marginMM, shrink
  })
}
