import { useState } from 'hono/jsx'

export default function ContactForm() {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SUCCESS' | 'ERROR'>('IDLE')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `> ${msg}`])
  }

  // biome-ignore lint/suspicious/noExplicitAny: Convert FormData to object securely
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus('TRANSMITTING')
    setLogs([])

    addLog('INITIALIZING_UPLINK...')
    await new Promise((r) => setTimeout(r, 500))
    addLog('ENCRYPTING_PACKETS...')

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    // biome-ignore lint/suspicious/noExplicitAny: Convert FormData to object securely
    const data = Object.fromEntries(formData as any)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('NETWORK_RESPONSE_NOT_OK')
      }

      addLog('SIGNAL_ACQUIRED_BY_RECIPIENT')
      await new Promise((r) => setTimeout(r, 500))
      addLog('TRANSMISSION_COMPLETE')
      setStatus('SUCCESS')
    } catch (_err) {
      addLog('TRANSMISSION_FAILED: UPLINK_INTERRUPTED')
      setStatus('ERROR')
    }
  }

  if (status === 'SUCCESS') {
    return (
      <div class="blueprint-border p-8 text-center animate-pulse">
        <h2 class="text-2xl mono text-accent-red mb-4">SIGNAL_SENT</h2>
        <div class="mono text-xs text-secondary space-y-1 mb-8">
          {logs.map((log) => (
            <p key={log}>{log}</p>
          ))}
        </div>
        <button type="button" onClick={() => setStatus('IDLE')} class="btn-blueprint">
          SEND_NEW_SIGNAL
        </button>
      </div>
    )
  }

  return (
    <div class="blueprint-border p-8 relative">
      <div class="absolute top-0 right-0 p-2 text-[10px] text-secondary mono">
        TERMINAL_REF: SIG-B1
      </div>
      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label htmlFor="senderName" class="block mono text-[10px] text-sub mb-2">
            IDENTIFIER / NAME
          </label>
          <input
            id="senderName"
            name="senderName"
            required
            placeholder="TYPE_YOUR_NAME"
            class="w-full resize-none"
          />
        </div>
        <div>
          <label htmlFor="senderEmail" class="block mono text-[10px] text-sub mb-2">
            RETURN_PATH / EMAIL
          </label>
          <input
            id="senderEmail"
            name="senderEmail"
            type="email"
            required
            placeholder="EMAIL_ADDRESS@EXAMPLE.COM"
            class="w-full resize-none"
          />
        </div>
        <div>
          <label htmlFor="subject" class="block mono text-[10px] text-sub mb-2">
            SIGNAL_SUBJECT
          </label>
          <input
            id="subject"
            name="subject"
            required
            placeholder="SIGNAL_TITLE"
            class="w-full resize-none"
          />
        </div>
        <div>
          <label htmlFor="body" class="block mono text-[10px] text-sub mb-2">
            DATALINK_BODY
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            placeholder="ENTER_TRANSMISSION_DATA_HERE..."
            class="w-full resize-none"
          />
        </div>

        <div class="flex items-center justify-between pt-4">
          <div class="mono text-[10px] text-sub">
            {status === 'TRANSMITTING' ? 'STATUS: TRANSMITTING...' : 'STATUS: READY_TO_SEND'}
          </div>
          <button
            type="submit"
            disabled={status === 'TRANSMITTING'}
            class="btn disabled-opacity-50"
            style={{ width: 'auto', paddingLeft: '20px', paddingRight: '20px' }}
          >
            {status === 'TRANSMITTING' ? 'SENDING...' : 'INITIATE_TRANSMISSION'}
          </button>
        </div>
      </form>

      {status === 'TRANSMITTING' && (
        <div class="mt-8 pt-4 border-t border-border-line mono text-[10px] text-accent-red opacity-80">
          {logs.map((log) => (
            <p key={log}>{log}</p>
          ))}
        </div>
      )}
    </div>
  )
}
