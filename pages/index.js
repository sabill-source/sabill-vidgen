import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(6)
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const pollRef = useRef(null)

  async function startGenerate() {
    if (!prompt.trim()) return alert('Masukkan prompt dulu')
    setIsGenerating(true)
    setVideoUrl('')
    setStatus('creating')
    try {
      const res = await fetch('/api/hailuo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration })
      })
      const data = await res.json()
      if (res.ok) {
        setJobId(data.job_id)
        setStatus('queued')
      } else {
        throw new Error(data.error || 'Gagal membuat job')
      }
    } catch (e) {
      alert('Error: ' + e.message)
      setIsGenerating(false)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (!jobId) return
    const poll = async () => {
      try {
        const st = await fetch(`/api/hailuo/status/${jobId}`)
        const d = await st.json()
        setStatus(d.status)
        if (d.status === 'succeeded' && d.output_url) {
          setVideoUrl(d.output_url)
          setIsGenerating(false)
          clearInterval(pollRef.current)
        } else if (d.status === 'failed') {
          alert('Job gagal: ' + (d.error || 'unknown'))
          setIsGenerating(false)
          clearInterval(pollRef.current)
        }
      } catch (e) {
        console.error('poll err', e)
      }
    }
    // start polling
    pollRef.current = setInterval(poll, (parseInt(process.env.NEXT_PUBLIC_POLL_SECONDS) || 2) * 1000)
    // run immediately
    poll()
    return () => clearInterval(pollRef.current)
  }, [jobId])

  return (
    <div style={{ minHeight: '100vh', background: '#0b1220', color: '#e6eef8', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 980, margin: '32px auto', padding: 24 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>Sabill VidGen — Dark</h1>
          <div style={{ opacity: 0.7, fontSize: 13 }}>Vercel deploy ready</div>
        </header>

        <main style={{ marginTop: 20 }}>
          <section style={{ background: '#071025', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.6)' }}>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 8 }}>Prompt (deskripsikan adegan singkat)</label>
            <textarea rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#021025', color: '#e6eef8', border: '1px solid #133' }} />

            <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: 13, opacity: 0.8 }}>Durasi (detik)</label>
                <input type="number" value={duration} min={1} max={30} onChange={e=>setDuration(Number(e.target.value))} style={{ width: 86, display: 'block', padding: 8, borderRadius: 8, background: '#021025', color: '#e6eef8', border: '1px solid #133' }} />
              </div>

              <div style={{ marginLeft: 'auto' }}>
                <button onClick={startGenerate} disabled={isGenerating} style={{ padding: '10px 16px', borderRadius: 10, background: isGenerating ? '#2b5' : '#0066ff', border: 'none', color: 'white', fontWeight: '600' }}>
                  {isGenerating ? 'Generating…' : 'Generate Video'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
              Status: <strong>{status || 'idle'}</strong> {jobId ? `(job: ${jobId})` : ''}
            </div>

            {videoUrl && (
              <div style={{ marginTop: 18 }}>
                <h3 style={{ margin: '8px 0' }}>Hasil Video</h3>
                <video src={videoUrl} controls style={{ width: '100%', borderRadius: 10, background: '#000' }} />
                <div style={{ marginTop: 8 }}>
                  <a href={videoUrl} target="_blank" rel="noreferrer" style={{ color: '#9be' }}>Download / Open in new tab</a>
                </div>
              </div>
            )}

          </section>

          <section style={{ marginTop: 18, color: '#9fb' }}>
            <h4 style={{ marginTop: 0 }}>Tips</h4>
            <ul>
              <li>Mulai dengan prompt pendek yang menggambarkan suasana, aksi, dan kamera (misal: "Cinematic aerial shot of a lighthouse at sunset, slow dolly")</li>
              <li>Durasi pendek (4–10s) untuk hasil awal; naikkan kalau kualitas pelayanan Hailuo mendukung</li>
            </ul>
          </section>

        </main>
      </div>
    </div>
  )
}
