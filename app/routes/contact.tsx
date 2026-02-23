import { createRoute } from 'honox/factory'
import ContactForm from '../islands/contact-form'

/**
 * お問い合わせページのルート定義。
 * コンタクトフォームと関連情報を表示します。
 */
export default createRoute((c) => {
  return c.render(
    <div class="py-12">
      <h2 class="section-title">CONTACT</h2>

      <div class="grid grid-cols-1 md-grid-cols-3 gap-12">
        <div class="md-col-span-2">
          {/* コンタクトフォーム（Island） */}
          <ContactForm />
        </div>

        <div class="space-y-8">
          {/* 所在地情報 */}
          <div class="blueprint-border p-6">
            <h3
              class="mono text-xs mb-4"
              style={{
                color: 'var(--text-sub)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '4px',
              }}
            >
              所在地
            </h3>
            <p class="text-sm">東京</p>
          </div>

          {/* 対応可能なこと */}
          <div class="blueprint-border p-6">
            <h3
              class="mono text-xs mb-4"
              style={{
                color: 'var(--text-sub)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '4px',
              }}
            >
              対応可能
            </h3>
            <ul class="text-xs mono space-y-2" style={{ color: 'var(--text-sub)' }}>
              <li>&gt; Web アプリケーション開発</li>
              <li>&gt; システム設計・アーキテクチャ</li>
              <li>&gt; コンサルティング</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})
