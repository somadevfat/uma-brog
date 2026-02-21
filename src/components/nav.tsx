export const Nav = ({ path }: { path?: string }) => {
  const links = [
    { href: '/', label: 'About' },
    { href: '/portfolio', label: 'Projects' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header class="site-header container">
      <a href="/" class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20M2 12h20"></path>
        </svg>
        GRU Space
      </a>
      <nav class="main-nav">
        {links.map(link => (
          <a 
            key={link.href} 
            href={link.href} 
            class={path === link.href || (link.href !== '/' && path?.startsWith(link.href)) ? 'active' : ''}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div class="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </header>
  )
}
