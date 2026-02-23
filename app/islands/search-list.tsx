import { useState } from 'hono/jsx'
import {
  type CardItem,
  ContentCard,
  postToCardItem,
  projectToCardItem,
} from '../../src/components/ui/content-card'
import type { Post } from '../../src/features/blog/types'
import type { Project } from '../../src/features/portfolio/types'

// ---- 検索バーコンポーネント（インライン定義） ----

/**
 * 検索UIコンポーネント（テキスト入力 + アクティブタグ表示）。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {string} props.query - 現在の検索クエリ。
 * @param {string} props.activeTag - アクティブなタグフィルタ。
 * @param {(v: string) => void} props.onQueryChange - クエリ変更ハンドラ。
 * @param {() => void} props.onClearTag - タグクリアハンドラ。
 * @param {number} props.resultCount - 現在の表示件数。
 * @param {number} props.totalCount - 全件数。
 */
const SearchBar = ({
  query,
  activeTag,
  onQueryChange,
  onClearTag,
  resultCount,
  totalCount,
}: {
  query: string
  activeTag: string
  onQueryChange: (v: string) => void
  onClearTag: () => void
  resultCount: number
  totalCount: number
}) => (
  <div class="search-bar-wrapper">
    <div class="search-bar">
      {/* 検索アイコン */}
      <svg
        class="search-icon-inline"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        id="search-input"
        type="search"
        placeholder="SEARCH_QUERY..."
        value={query}
        onInput={(e) => onQueryChange((e.target as HTMLInputElement).value)}
        class="search-input"
        aria-label="タイトル検索"
        autocomplete="off"
      />
      {/* クリアボタン（入力中のみ表示） */}
      {query && (
        <button
          type="button"
          class="search-clear"
          onClick={() => onQueryChange('')}
          aria-label="検索をクリア"
        >
          ✕
        </button>
      )}
    </div>

    {/* アクティブなタグフィルタ表示 */}
    {activeTag && (
      <div class="search-active-tag">
        <span class="mono text-xs" style={{ color: 'var(--text-sub)' }}>
          TAG_FILTER:
        </span>
        <span class="post-tag" style={{ cursor: 'default' }}>
          #{activeTag}
        </span>
        <button
          type="button"
          class="search-clear"
          onClick={onClearTag}
          aria-label="タグフィルタをクリア"
        >
          ✕
        </button>
      </div>
    )}

    {/* 件数表示 */}
    <div class="search-count mono">
      {resultCount === totalCount
        ? `${totalCount} RECORDS`
        : `${resultCount} / ${totalCount} RECORDS`}
    </div>
  </div>
)

// ---- メイン Island エクスポート ----

/**
 * ブログ一覧用の検索付きIslandコンポーネント。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Post[]} props.posts - 表示するブログ記事の配列。
 * @returns {JSX.Element} 検索付きブログ一覧。
 */
export function BlogSearchList({ posts }: { posts: Post[] }) {
  const items = posts.map(postToCardItem)
  return <SearchList items={items} emptyLabel="NO_LOGS_FOUND" />
}

/**
 * ポートフォリオ一覧用の検索付きIslandコンポーネント。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Project[]} props.projects - 表示するプロジェクトの配列。
 * @returns {JSX.Element} 検索付きプロジェクト一覧。
 */
export function ProjectSearchList({ projects }: { projects: Project[] }) {
  const items = projects.map(projectToCardItem)
  return <SearchList items={items} emptyLabel="NO_PROJECTS_FOUND" />
}

/**
 * 検索・タグフィルタ機能付きの汎用リストコンポーネント（Island本体）。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {SearchItem[]} props.items - 表示するアイテムの配列。
 * @param {string} props.emptyLabel - アイテムが0件の場合に表示するラベル。
 * @returns {JSX.Element} 検索付きリスト。
 */
function SearchList({ items, emptyLabel }: { items: CardItem[]; emptyLabel: string }) {
  // テキスト検索クエリの状態
  const [query, setQuery] = useState('')
  // アクティブなタグフィルタの状態
  const [activeTag, setActiveTag] = useState('')

  // タグクリックでフィルタをセット（同じタグをクリックでトグル解除）
  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? '' : tag))
  }

  // クエリとタグで絞り込み
  const filtered = items.filter((item) => {
    const lowerQuery = query.toLowerCase()
    // タイトル検索：クエリが空、またはタイトルに含まれる場合
    const matchesQuery = !lowerQuery || item.title.toLowerCase().includes(lowerQuery)
    // タグフィルタ：アクティブタグが空、またはタグに含まれる場合
    const matchesTag = !activeTag || item.tags.some((t) => t === activeTag)
    return matchesQuery && matchesTag
  })

  return (
    <div>
      {/* 検索バー */}
      <SearchBar
        query={query}
        activeTag={activeTag}
        onQueryChange={setQuery}
        onClearTag={() => setActiveTag('')}
        resultCount={filtered.length}
        totalCount={items.length}
      />

      {/* アイテムグリッド */}
      <div class="projects-grid">
        {filtered.map((item) => (
          <ContentCard key={item.key} item={item} onTagClick={handleTagClick} />
        ))}

        {/* 0件時のプレースホルダー */}
        {filtered.length === 0 && (
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
    </div>
  )
}
