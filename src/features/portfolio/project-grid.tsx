import { ContentGrid, projectToCardItem } from '../../components/ui/content-card'
import type { Project } from './types'

/**
 * プロジェクト一覧をグリッド表示するコンポーネント。
 * 共通 ContentGrid + ContentCard を利用。
 * @param {Object} props - コンポーネントのプロパティ。
 * @param {Project[]} props.projects - 表示するプロジェクトの配列。
 * @returns {JSX.Element} プロジェクトグリッド。
 */
export const ProjectGrid = ({ projects }: { projects: Project[] }) => {
  // Project → CardItem に変換してグリッドに渡す
  const items = projects.map(projectToCardItem)
  return <ContentGrid items={items} emptyLabel="NO_PROJECTS" />
}
