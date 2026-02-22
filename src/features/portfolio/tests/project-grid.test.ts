import type { Child } from 'hono/jsx'
import { describe, expect, it } from 'vitest'
import { ProjectGrid } from '../project-grid'

/**
 * ProjectGrid コンポーネントのテスト。
 */
describe('ProjectGrid', () => {
  it('正常系：すべてのフィールドが揃っているプロジェクトをレンダリングすること', () => {
    // ## Arrange ##
    const projects = [
      {
        id: '1',
        title: 'PROJECT_TITLE_X',
        description: 'Desc',
        imageUrl: '/img.png',
        githubUrl: 'https://github/repo',
        liveUrl: 'https://live/site',
        techStack: ['TS'],
        date: '2026',
      },
    ]

    // ## Act ##
    // JSX ノードの検証のため JSON.stringify を使用。any を避け unknown を経由
    const node = ProjectGrid({ projects }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('PROJECT_TITLE_X')
    expect(html).toContain('/img.png')
    expect(html).toContain('https://github/repo')
    expect(html).toContain('https://live/site')
  })

  it('正常系：imageUrl がない場合にプレースホルダー（SVG）をレンダリングすること', () => {
    // ## Arrange ##
    const projects = [
      {
        id: '2',
        title: 'NO_IMAGE_PROJECT',
        description: 'Desc',
        techStack: [],
        date: '2026',
        // imageUrl なし
      },
    ]

    // ## Act ##
    const node = ProjectGrid({ projects }) as unknown as Child

    // ## Assert ##
    const html = JSON.stringify(node)
    expect(html).toContain('NO_IMAGE_PROJECT')
    expect(html).toContain('svg')
    // <img タグが含まれていないことを確認
    expect(html).not.toContain('<img')
  })
})
