export const ErrorPage = ({ message, status }: { message: string; status: number }) => {
  return (
    <div class="py-24 text-center">
      <div class="blueprint-border inline-block p-12 bg-[#0D0D0D]">
        <h2 class="text-5xl mono text-accent-red mb-4 animate-pulse">FAULT_DETECTED</h2>
        <div class="h-[2px] bg-accent-red w-24 mx-auto mb-8"></div>
        <div class="mono text-xs text-secondary space-y-2 uppercase">
          <p>Status_Code: {status}</p>
          <p>System_Message: {message}</p>
          <p class="mt-8 text-[10px] text-border-color">--- SIGNAL_TERMINATED ---</p>
        </div>
        <a href="/" class="btn inline-block mt-12 mono text-xs uppercase tracking-widest">
          Return_to_Safe_Sector
        </a>
      </div>
    </div>
  )
}
