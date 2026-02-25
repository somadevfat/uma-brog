import { createRoute } from 'honox/factory'
import ContactForm from '../islands/contact-form'

/**
 * お問い合わせページのルート定義。
 * コンタクトフォームと関連情報を日本語で表示します。
 */
export default createRoute((c) => {
  return c.render(
    <div class="py-12">
      <h2 class="section-title">お問い合わせ</h2>

      <p
        class="text-sm mb-12"
        style={{ color: 'var(--text-sub)', maxWidth: '640px', lineHeight: '1.8' }}
      >
        お仕事のご依頼やご相談など、お気軽にお問い合わせください。
        内容を確認次第、折り返しご連絡いたします。
      </p>

      <div class="grid grid-cols-1 md-grid-cols-3 gap-12">
        <div class="md-col-span-2">
          {/* コンタクトフォーム（Island） */}
          <ContactForm />
        </div>

        <div class="space-y-8">
          {/* 所在地情報 */}
          <div class="blueprint-border p-6">
            <h3
              class="text-xs mb-4"
              style={{
                color: 'var(--text-sub)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              📍 所在地
            </h3>
            <p class="text-sm">東京</p>
          </div>

          {/* 対応可能なこと */}
          <div class="blueprint-border p-6">
            <h3
              class="text-xs mb-4"
              style={{
                color: 'var(--text-sub)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              🛠 対応可能な内容
            </h3>
            <ul class="text-xs space-y-2" style={{ color: 'var(--text-sub)', lineHeight: '1.8' }}>
              <li>Web アプリケーション開発</li>
              <li>システム設計・アーキテクチャ</li>
              <li>技術コンサルティング</li>
            </ul>
          </div>

          {/* レスポンスタイム */}
          <div class="blueprint-border p-6">
            <h3
              class="text-xs mb-4"
              style={{
                color: 'var(--text-sub)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '8px',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              ⏱ 返信について
            </h3>
            <p class="text-xs" style={{ color: 'var(--text-sub)', lineHeight: '1.8' }}>
              通常 1〜2 営業日以内にお返事いたします。
              お急ぎの場合はその旨をメッセージにご記載ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})
