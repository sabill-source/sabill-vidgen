import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { prompt, duration } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const endpoint = process.env.HAILUO_ENDPOINT || 'https://api.hailuoai.video/v1'
  const apiKey = process.env.HAILUO_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Server missing HAILUO_API_KEY env' })

  try {
    const r = await fetch(`${endpoint}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ prompt, duration })
    })
    const data = await r.json()
    if (!r.ok) return res.status(500).json({ error: data })
    // return job id
    return res.status(200).json({ job_id: data.job_id || data.id || data.task_id || data.id ?? null, raw: data })
  } catch (e) {
    console.error('hailuo create err', e)
    return res.status(500).json({ error: String(e) })
  }
}
