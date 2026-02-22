import { hc } from 'hono/client'
import { useState } from 'hono/jsx'
import type { AppType } from '../routes/api/contact'

/**
 * Hono RPC クライアントの初期化。
 */
const client = hc<AppType>('/')

/**
 * お問い合わせフォームコンポーネント。
 * レトロフューチャーなデザインで、送信プロセスをシミュレートするログ表示機能を備えています。
 * @returns {JSX.Element} レンダリングされたお問い合わせフォーム。
 */
export default function ContactForm() {
  // フォームの送信ステータスを管理
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SUCCESS' | 'ERROR'>('IDLE')
  // 送信プロセスのログを保持
  const [logs, setLogs] = useState<string[]>([])

  /**
   * ログ配列に新しいメッセージを追加します。
   * @param {string} msg - 追加するログメッセージ。
   */
  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `> ${msg}`])
  }

  /**
   * フォームの送信イベントをハンドリングします。
   * APIへの送信と同時に、視覚的なフィードバック用のログを表示します。
   * @param {Event} e - フォームイベント。
   */
  const handleSubmit = async (e: Event) => {
    // デフォルトの送信挙動を抑制
    e.preventDefault()
    setStatus('TRANSMITTING')
    setLogs([])

    // 送信プロセスのシミュレーション開始
    addLog('INITIALIZING_UPLINK...')
    await new Promise((r) => setTimeout(r, 500))
    addLog('ENCRYPTING_PACKETS...')

    // フォームデータをオブジェクトに変換
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const senderName = formData.get('senderName') as string
    const senderEmail = formData.get('senderEmail') as string
    const subject = formData.get('subject') as string
    const body = formData.get('body') as string

    try {
      // Hono RPC クライアントを使用して API にデータを送信
      const res = await client.api.contact.$post({
        json: {
          senderName,
          senderEmail,
          subject,
          body,
        },
      })

      if (!res.ok) {
        throw new Error('NETWORK_RESPONSE_NOT_OK')
      }

      // 送信成功時のログ演出
      addLog('SIGNAL_ACQUIRED_BY_RECIPIENT')
      await new Promise((r) => setTimeout(r, 500))
      addLog('TRANSMISSION_COMPLETE')
      setStatus('SUCCESS')
    } catch (_err) {
      // エラー発生時の処理
      addLog('TRANSMISSION_FAILED: UPLINK_INTERRUPTED')
      setStatus('ERROR')
    }
  }

  // 送信成功時の表示
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

  // フォーム本体のレンダリング
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

      {/* 送信中のログ表示 */}
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
