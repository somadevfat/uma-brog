import { Message } from '../../contact/domain/message'

export const AdminDashboard = ({ messages }: { messages: Message[] }) => {
  return (
    <div class="py-12">
      <header class="mb-12 border-b border-accent-red pb-4">
        <h1 class="text-3xl font-thin tracking-widest uppercase">STRATEGIC_MANAGEMENT_CONSOLE</h1>
        <p class="mono text-[10px] text-accent-red mt-2">ACCESS_LEVEL: AUTHORIZED_ONLY</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1 space-y-4">
          <div class="blueprint-border p-4 bg-[#0D0D0D]">
            <h2 class="mono text-[10px] text-secondary mb-2">SYSTEM_HEALTH</h2>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_green]"></div>
              <span class="mono text-xs">D1_DB: CONNECTED</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <h2 class="text-xl font-thin mb-6 mono uppercase tracking-widest">INCOMING_SIGNALS</h2>
          <div class="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} class="blueprint-border p-6 hover:bg-white/[0.02] transition-colors relative">
                <div class="absolute top-2 right-4 mono text-[10px] text-secondary">
                  {msg.createdAt.toLocaleString()}
                </div>
                <h3 class="mono text-sm text-accent-red mb-1">{msg.subject}</h3>
                <p class="text-xs mb-4">From: <span class="text-secondary">{msg.senderName} &lt;{msg.senderEmail}&gt;</span></p>
                <div class="p-4 bg-black/50 border border-border-line mono text-xs text-secondary leading-relaxed">
                  {msg.body}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div class="blueprint-border p-12 text-center text-secondary mono text-xs">
                NO_SIGNALS_RECEIVED_IN_CURRENT_BUFFER
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
