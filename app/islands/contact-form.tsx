import { hc } from 'hono/client'
import { useState } from 'hono/jsx'
import type { AppType } from '../routes/api/contact'

/**
 * Hono RPC クライアントの初期化。
 */
const client = hc<AppType>('/')

/**
 * お問い合わせフォームコンポーネント。
 * 送信プロセスをシミュレートするログ表示機能を備えています。
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
    addLog('接続を確立中...')
    await new Promise((r) => setTimeout(r, 500))
    addLog('データを暗号化中...')

    // フォームデータをオブジェクトに変換
    const target = e.target as HTMLFormElement
    const formData = new FormData(target)
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
        throw new Error('送信に失敗しました')
      }

      // 送信成功時のログ演出
      addLog('受信を確認しました')
      await new Promise((r) => setTimeout(r, 500))
      addLog('送信完了')
      setStatus('SUCCESS')
    } catch (_err) {
      // エラー発生時の処理
      addLog('送信失敗：接続が中断されました')
      setStatus('ERROR')
    }
  }

  // 送信成功時の表示
  if (status === 'SUCCESS') {
    return (
      <div class="blueprint-border p-8" style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '20px',
            color: 'var(--accent-red)',
            marginBottom: '16px',
            fontFamily: '"Courier New", monospace',
          }}
        >
          送信完了
        </h2>
        <p class="text-sm mb-4" style={{ color: 'var(--text-sub)' }}>
          お問い合わせありがとうございます。内容を確認次第ご連絡いたします。
        </p>
        <div
          class="mono text-xs space-y-1 mb-4"
          style={{ color: 'var(--text-sub)', textAlign: 'left' }}
        >
          {logs.map((log) => (
            <p key={log}>{log}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStatus('IDLE')}
          class="btn"
          style={{ width: 'auto', paddingLeft: '20px', paddingRight: '20px' }}
        >
          新しいメッセージを送る
        </button>
      </div>
    )
  }

  // フォーム本体のレンダリング
  return (
    <div class="blueprint-border p-8">
      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label
            htmlFor="senderName"
            class="block mono text-xs mb-2"
            style={{ color: 'var(--text-sub)' }}
          >
            お名前
          </label>
          <input
            id="senderName"
            name="senderName"
            required
            placeholder="お名前を入力"
            class="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="senderEmail"
            class="block mono text-xs mb-2"
            style={{ color: 'var(--text-sub)' }}
          >
            メールアドレス
          </label>
          <input
            id="senderEmail"
            name="senderEmail"
            type="email"
            required
            placeholder="例: taro@example.com"
            class="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            class="block mono text-xs mb-2"
            style={{ color: 'var(--text-sub)' }}
          >
            件名
          </label>
          <input id="subject" name="subject" required placeholder="件名を入力" class="w-full" />
        </div>
        <div>
          <label
            htmlFor="body"
            class="block mono text-xs mb-2"
            style={{ color: 'var(--text-sub)' }}
          >
            メッセージ
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={6}
            placeholder="メッセージ内容を入力してください"
            class="w-full resize-none"
          />
        </div>

        <div class="flex items-center justify-between pt-4">
          <div class="mono text-xs" style={{ color: 'var(--text-sub)' }}>
            {status === 'TRANSMITTING' ? '送信中...' : '入力待ち'}
          </div>
          <button
            type="submit"
            disabled={status === 'TRANSMITTING'}
            class="btn disabled-opacity-50"
            style={{ width: 'auto', paddingLeft: '20px', paddingRight: '20px' }}
          >
            {status === 'TRANSMITTING' ? '送信中...' : '送信する'}
          </button>
        </div>
      </form>

      {/* 送信中のログ表示 */}
      {status === 'TRANSMITTING' && (
        <div
          class="mt-8 pt-4 mono text-xs"
          style={{
            borderTop: '1px solid var(--border-color)',
            color: 'var(--accent-red)',
            opacity: 0.8,
          }}
        >
          {logs.map((log) => (
            <p key={log}>{log}</p>
          ))}
        </div>
      )}
    </div>
  )
}
