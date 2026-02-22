import { createRoute } from 'honox/factory'
import ContactForm from '../islands/contact-form'

/**
 * お問い合わせページのルート定義。
 * コンタクトフォームと関連情報を表示します。
 */
export default createRoute((c) => {
  return c.render(
    <div class="py-12">
      <header class="mb-12">
        <h2 class="section-title">SIGNAL_STATION</h2>
        <p class="text-sub font-xs mono mt-4">Establish an uplink to the archive administrator.</p>
      </header>

      <div class="grid grid-cols-1 md-grid-cols-3 gap-12">
        <div class="md-col-span-2">
          {/* 未ハイドレーション状態でも表示されるアイランドコンポーネント */}
          <ContactForm />
        </div>

        <div class="space-y-8">
          {/* ロケーション情報セクション */}
          <div class="blueprint-border p-6">
            <h2 class="mono text-xs mb-4 border-b border-border-line pb-1">LOCATION</h2>
            <p class="text-sm">NEO_TOKYO_ARCHIVE / SECTOR-07</p>
          </div>

          {/* プロトコル情報セクション */}
          <div class="blueprint-border p-6">
            <h2 class="mono text-xs mb-4 border-b border-border-line pb-1">PROTOCOLS</h2>
            <ul class="text-[10px] mono text-secondary space-y-2">
              <li>&gt; HTTPS_SECURED</li>
              <li>&gt; DISCORD_WEBHOOK_READY</li>
              <li>&gt; D1_PERSISTENCE_ON</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
})
