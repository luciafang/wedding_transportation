/**
 * Vercel Serverless Function
 * Forwards form submissions to Google Apps Script.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!googleScriptUrl) {
    return res.status(500).json({
      status: 'error',
      message: 'Missing GOOGLE_SCRIPT_URL environment variable.'
    });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const upstreamResponse = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const upstreamText = await upstreamResponse.text();

    let upstreamBody;
    try {
      upstreamBody = JSON.parse(upstreamText);
    } catch {
      upstreamBody = { raw: upstreamText };
    }

    if (!upstreamResponse.ok) {
      return res.status(502).json({
        status: 'error',
        message: 'Google Apps Script request failed.',
        upstreamStatus: upstreamResponse.status,
        upstreamBody
      });
    }

    return res.status(200).json({ status: 'success', upstream: upstreamBody });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error && error.message ? error.message : String(error)
    });
  }
}
