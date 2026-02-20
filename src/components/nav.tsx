export const Nav = () => {
  const links = [
    { href: '/', label: 'HOME' },
    { href: '/portfolio', label: 'BLUEPRINTS' },
    { href: '/contact', label: 'SIGNAL' },
  ]

  return (
    <nav class="border-b border-border-line bg-bg-color sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" class="mono text-lg tracking-widest hover:text-accent-red font-thin">
          UMA-BROG<span class="text-accent-red">_</span>
        </a>
        <div class="flex gap-8">
          {links.map(link => (
            <a key={link.href} href={link.href} class="mono text-xs hover:text-accent-red tracking-widest relative group">
              {link.label}
              <span class="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-red group-hover:w-full transition-all"></span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
