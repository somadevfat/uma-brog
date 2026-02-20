import { createRoute } from 'honox/factory'
import ContactForm from '../islands/contact-form'

export default createRoute((c) => {
  return c.render(
    <div class="px-6 py-12 max-w-4xl mx-auto">
      <header class="mb-16">
        <h1 class="text-4xl font-thin mb-2 tracking-widest uppercase">SIGNAL_STATION</h1>
        <div class="h-1 bg-accent-red w-24"></div>
        <p class="text-secondary mono text-sm mt-4">Establish an uplink to the archive administrator.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="md:col-span-2">
          <ContactForm />
        </div>
        
        <div class="space-y-8">
          <div class="blueprint-border p-6">
            <h2 class="mono text-xs mb-4 border-b border-border-line pb-1">LOCATION</h2>
            <p class="text-sm">NEO_TOKYO_ARCHIVE / SECTOR-07</p>
          </div>
          
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
