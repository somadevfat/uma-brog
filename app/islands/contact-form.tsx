import { useState } from 'hono/jsx'

export default function ContactForm() {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SUCCESS' | 'ERROR'>('IDLE')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`])
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setStatus('TRANSMITTING')
    setLogs([])
    
    addLog('INITIALIZING_UPLINK...')
    await new Promise(r => setTimeout(r, 500))
    addLog('ENCRYPTING_PACKETS...')
    
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData as any)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error()

      addLog('SIGNAL_ACQUIRED_BY_RECIPIENT')
      await new Promise(r => setTimeout(r, 500))
      addLog('TRANSMISSION_COMPLETE')
      setStatus('SUCCESS')
    } catch (err) {
      addLog('TRANSMISSION_FAILED: UPLINK_INTERRUPTED')
      setStatus('ERROR')
    }
  }

  if (status === 'SUCCESS') {
    return (
      <div class="blueprint-border p-8 text-center animate-pulse">
        <h2 class="text-2xl mono text-accent-red mb-4">SIGNAL_SENT</h2>
        <div class="mono text-xs text-secondary space-y-1 mb-8">
          {logs.map((log, i) => <p key={i}>{log}</p>)}
        </div>
        <button onClick={() => setStatus('IDLE')} class="btn-blueprint">SEND_NEW_SIGNAL</button>
      </div>
    )
  }

  return (
    <div class="blueprint-border p-8 relative">
      <div class="absolute top-0 right-0 p-2 text-[10px] text-secondary mono">TERMINAL_REF: SIG-B1</div>
      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label class="block mono text-xs mb-2">IDENTIFIER / NAME</label>
          <input name="senderName" required class="w-full bg-transparent border border-border-line p-2 text-sm focus:border-accent-red outline-none" />
        </div>
        <div>
          <label class="block mono text-xs mb-2">RETURN_PATH / EMAIL</label>
          <input name="senderEmail" type="email" required class="w-full bg-transparent border border-border-line p-2 text-sm focus:border-accent-red outline-none" />
        </div>
        <div>
          <label class="block mono text-xs mb-2">SIGNAL_SUBJECT</label>
          <input name="subject" required class="w-full bg-transparent border border-border-line p-2 text-sm focus:border-accent-red outline-none" />
        </div>
        <div>
          <label class="block mono text-xs mb-2">DATALINK_BODY</label>
          <textarea name="body" required rows={5} class="w-full bg-transparent border border-border-line p-2 text-sm focus:border-accent-red outline-none resize-none" />
        </div>
        
        <div class="flex items-center justify-between pt-4">
          <div class="mono text-[10px] text-secondary">
             {status === 'TRANSMITTING' ? 'STATUS: TRANSMITTING...' : 'STATUS: READY_TO_SEND'}
          </div>
          <button type="submit" disabled={status === 'TRANSMITTING'} class="btn-blueprint disabled:opacity-50">
            {status === 'TRANSMITTING' ? 'SENDING...' : 'INITIATE_TRANSMISSION'}
          </button>
        </div>
      </form>

      {status === 'TRANSMITTING' && (
        <div class="mt-8 pt-4 border-t border-border-line mono text-[10px] text-accent-red opacity-80">
          {logs.map((log, i) => <p key={i}>{log}</p>)}
        </div>
      )}
    </div>
  )
}
