import type { Post } from '../../features/blog/types'
import type { Project } from '../../features/portfolio/types'

// ---- 共通カードアイテム型 ----

/**
 * カード表示用の共通アイテム型。
 * Post と Project の差異をこの型に吸収し、カード描画ロジックを統一する。
 */
export interface CardItem {
  /** 一意のキー（slug または id） */
  key: string
  /** タイトル */
  title: string
  /** 説明・抜粋文 */
  description: string
  /** サムネイル画像URL（任意） */
  thumbnail?: string
  /** タグ一覧 */
  tags: string[]
  /** カード全体のリンク先（任意） */
  primaryHref?: string
  /** カード下部の追加リンク（外部リンク等） */
  links: CardLink[]
}

/**
 * カード内に表示する追加リンクの型。
 */
export interface CardLink {
  /** リンクラベル */
  label: string
  /** リンクURL */
  href: string
  /** 外部リンクかどうか */
  external?: boolean
}

// ---- アダプター関数 ----

/**
 * Post を CardItem に変換するアダプター関数。
 * @param {Post} post - ブログ記事。
 * @returns {CardItem} 共通カードアイテム。
 */
export const postToCardItem = (post: Post): CardItem => ({
  key: post.slug,
  title: post.title,
  description: post.excerpt,
  thumbnail: post.thumbnail,
  tags: post.tags,
  primaryHref: `/blog/${post.slug}`,
  links: [],
})

/**
 * Project を CardItem に変換するアダプター関数。
 * @param {Project} project - プロジェクト情報。
 * @returns {CardItem} 共通カードアイテム。
 */
export const projectToCardItem = (project: Project): CardItem => ({
  key: project.id,
  title: project.title,
  description: project.description,
  thumbnail: project.imageUrl,
  tags: project.tags,
  primaryHref: project.liveUrl || project.githubUrl,
  links: [
    ...(project.githubUrl ? [{ label: 'GitHub', href: project.githubUrl, external: true }] : []),
    ...(project.liveUrl ? [{ label: 'Live', href: project.liveUrl, external: true }] : []),
  ],
})

// ---- SVGプレースホルダー ----

/**
 * サムネイルが未設定の場合に表示するSVGプレースホルダー。
 * @returns {JSX.Element} SVG要素。
 */
const PlaceholderSvg = () => (
  <svg viewBox="0 0 100 50" stroke="#888" stroke-width="1" fill="none" aria-hidden="true">
    <title>Placeholder Graphic</title>
    <polyline points="10,40 40,15 60,30 90,10" />
    <line x1="0" y1="40" x2="100" y2="40" />
  </svg>
)

// ---- 共通カードコンポーネント ----

/**
 * 共通カードコンポーネント。
 * ブログ記事・プロジェクトの両方をカード形式で表示する。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {CardItem} props.item - 表示するアイテム。
 * @param {(tag: string) => void} [props.onTagClick] - タグクリック時のハンドラ（任意）。
 * @returns {JSX.Element} カード要素。
 */
export const ContentCard = ({
  item,
  onTagClick,
}: {
  item: CardItem
  onTagClick?: (tag: string) => void
}) => {
  const isExternal = item.primaryHref?.startsWith('http')

  // カード内部のコンテンツ
  const content = (
    <>
      {/* サムネイル領域 */}
      <div class="card-img">
        {item.thumbnail ? <img src={item.thumbnail} alt={item.title} /> : <PlaceholderSvg />}
      </div>

      {/* タイトルと説明 */}
      <h3>
        {item.primaryHref ? (
          <a
            href={item.primaryHref}
            class="card-main-link"
            {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
      <p>{item.description}</p>

      {/* タグ一覧 */}
      {item.tags.length > 0 && (
        <div class="post-tags" style={{ position: 'relative', zIndex: 10 }}>
          {item.tags.map((tag) =>
            onTagClick ? (
              <button
                key={tag}
                type="button"
                class="post-tag"
                onClick={(e: Event) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onTagClick(tag)
                }}
                title={`#${tag} でフィルタ`}
              >
                #{tag}
              </button>
            ) : (
              <span key={tag} class="post-tag" style={{ cursor: 'default' }}>
                #{tag}
              </span>
            )
          )}
        </div>
      )}

      {/* 追加リンクボタン群（外部リンク等） */}
      {item.links.length > 0 && (
        <div class="flex gap-2" style={{ position: 'relative', zIndex: 10 }}>
          {item.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              class="btn"
              style={{ width: 'auto', paddingLeft: '12px', paddingRight: '12px' }}
              onClick={(e: Event) => e.stopPropagation()}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  )

  return (
    <article class={`card ${item.primaryHref ? 'card-link' : ''}`} style={{ position: 'relative' }}>
      {content}
    </article>
  )
}

// ---- 共通グリッドコンポーネント ----

/**
 * カードをグリッド形式で表示するラッパーコンポーネント。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {CardItem[]} props.items - 表示するアイテムの配列。
 * @param {string} [props.emptyLabel] - アイテムが0件の場合に表示するラベル。
 * @returns {JSX.Element} グリッド要素。
 */
export const ContentGrid = ({
  items,
  emptyLabel = 'NO_DATA',
}: {
  items: CardItem[]
  emptyLabel?: string
}) => (
  <div class="projects-grid">
    {items.map((item) => (
      <ContentCard key={item.key} item={item} />
    ))}

    {/* 0件時のプレースホルダー */}
    {items.length === 0 && (
      <div
        class="card"
        style={{
          borderStyle: 'dashed',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-sub)',
        }}
      >
        <p class="mono text-xs">{emptyLabel}</p>
      </div>
    )}
  </div>
)
