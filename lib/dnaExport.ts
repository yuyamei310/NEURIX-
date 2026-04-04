import html2canvas from 'html2canvas'

export async function exportDNACard(canvasDataUrl?: string): Promise<void> {
  // If we have a Three.js canvas screenshot, inject it into the card
  if (canvasDataUrl) {
    const img = document.getElementById('dna-card-3d-img') as HTMLImageElement | null
    if (img) img.src = canvasDataUrl
    // Wait a tick for image to load
    await new Promise((r) => setTimeout(r, 100))
  }

  const cardEl = document.getElementById('dna-card')
  if (!cardEl) return

  const canvas = await html2canvas(cardEl, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const link = document.createElement('a')
  link.download = 'my-athlete-dna.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
