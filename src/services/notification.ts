const FCM_TOKEN = process.env.FCM_DEVICE_TOKEN
const GOOGLE_CREDS = process.env.GOOGLE_APPLICATION_CREDENTIALS

export class NotificationService {
  async send(data: { token?: string; title: string; body: string; data?: Record<string, unknown> | null }) {
    const deviceToken = data.token || FCM_TOKEN
    if (!deviceToken) throw new Error('Device token is required')

    const access = await this._googleAccessToken()
    const res = await fetch('https://fcm.googleapis.com/v1/projects/nuxt-app-b2acb/messages:send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          token: deviceToken,
          notification: { title: data.title, body: data.body },
          data: data.data || {},
        },
      }),
    })
    const result = (await res.json()) as { name?: string }
    return { success: true, messageId: result.name ?? null }
  }

  private async _googleAccessToken(): Promise<string> {
    const fs = await import('fs')
    const key = JSON.parse(fs.readFileSync(GOOGLE_CREDS!, 'utf-8'))

    const header = { alg: 'RS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const claims = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: key.token_uri || 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }

    const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '')
    const toSign = `${enc(header)}.${enc(claims)}`

    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8', new TextEncoder().encode(key.private_key),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
    )
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(toSign))
    const jwt = `${toSign}.${btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, '')}`

    const res = await fetch(key.token_uri || 'https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    })
    return ((await res.json()) as { access_token: string }).access_token
  }
}
