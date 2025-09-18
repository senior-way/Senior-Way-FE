// html2canvas/jsPDF는 유틸에서 한 번만 임포트
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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

export async function saveCanvasAsImage(canvas, { filename = 'capture.png', quality = 0.95 } = {}) {
  const dataUrl = canvas.toDataURL('image/png', quality)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/* 기존 Paged PDF 함수는 놔둬도 되고, 안 쓰면 됨 */
export async function saveCanvasAsPagedPdf(
  canvas,
  {
    filename = 'capture.pdf',
    format = 'a4',
    orientation = 'p',
    marginMM = 10,
    shrink = 0.75,
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

/* ★ A4 가로에 A5 두 장 2-up 배치 */
export async function saveCanvasAsTwoUpPdf(
  canvas,
  {
    filename = 'capture.pdf',
    marginMM = 10,
    gutterMM = 6,
    jpegQuality = 0.95,
  } = {}
) {
  const pdf = new jsPDF('l', 'mm', 'a4')
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const slotW = (pageW - marginMM * 2 - gutterMM) / 2
  const slotH = pageH - marginMM * 2
  const ratio = slotW / canvas.width
  const sliceHPx = Math.floor(slotH / ratio)

  let sy = 0
  let remaining = canvas.height

  while (remaining > 0) {
    const h1 = Math.min(sliceHPx, remaining)
    const left = document.createElement('canvas')
    left.width = canvas.width
    left.height = h1
    left.getContext('2d').drawImage(canvas, 0, sy, canvas.width, h1, 0, 0, canvas.width, h1)
    const img1 = left.toDataURL('image/jpeg', jpegQuality)
    pdf.addImage(img1, 'JPEG', marginMM, marginMM, slotW, h1 * ratio)
    sy += h1
    remaining -= h1

    if (remaining > 0) {
      const h2 = Math.min(sliceHPx, remaining)
      const right = document.createElement('canvas')
      right.width = canvas.width
      right.height = h2
      right.getContext('2d').drawImage(canvas, 0, sy, canvas.width, h2, 0, 0, canvas.width, h2)
      const img2 = right.toDataURL('image/jpeg', jpegQuality)
      const x2 = marginMM + slotW + gutterMM
      pdf.addImage(img2, 'JPEG', x2, marginMM, slotW, h2 * ratio)
      sy += h2
      remaining -= h2
    }

    if (remaining > 0) pdf.addPage()
  }

  pdf.save(filename)
}

/* ★ PNG + 2-up PDF를 둘 다 저장 */
export async function saveElementAsImageAndPdf(el, {
  baseName = 'capture',
  ts = new Date(),
  scale = 3,
  marginMM = 10,
  gutterMM = 6,
  jpegQuality = 0.95,
  pngQuality = 0.95,
} = {}) {
  const y = ts.getFullYear()
  const m = String(ts.getMonth()+1).padStart(2,'0')
  const d = String(ts.getDate()).padStart(2,'0')
  const hh = String(ts.getHours()).padStart(2,'0')
  const mm = String(ts.getMinutes()).padStart(2,'0')
  const stamp = `${y}${m}${d}_${hh}${mm}`

  const canvas = await captureElementToCanvas(el, { scale })
  await saveCanvasAsImage(canvas, { filename: `${baseName}_${stamp}.png`, quality: pngQuality })
  await saveCanvasAsTwoUpPdf(canvas, {
    filename: `${baseName}_${stamp}.pdf`,
    marginMM,
    gutterMM,
    jpegQuality,
  })
}
