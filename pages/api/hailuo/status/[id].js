import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const endpoint = process.env.HAILUO_ENDPOINT || 'https://api.hailuoai.video/v1'
  const apiKey = process.env.HAILUO_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Server missing HAILUO_API_KEY env' })

  try {
    const r = await fetch(`${endpoint}/jobs/${id}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })
    const data = await r.json()
    if (!r.ok) return res.status(500).json({ error: data })
    // Normalize response with fields: status, output_url, error
    const out = {
      status: data.status || data.state || 'unknown',
      output_url: data.output_url || data.result?.url || data.result?.output_url || null,
      raw: data,
      error: data.error || null
    }
    return res.status(200).json(out)
  } catch (e) {
    console.error('hailuo status err', e)
    return res.status(500).json({ error: String(e) })
  }
}
