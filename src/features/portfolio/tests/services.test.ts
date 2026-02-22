import { describe, expect, it } from 'vitest'
import { portfolioService } from '../services'

/**
 * ポートフォリオサービス (portfolioService) のテスト。
 */
describe('portfolioService', () => {
  describe('getAllProjects()', () => {
    it('正常系：プロジェクトのリストが返され、必要なフィールドが含まれていること', async () => {
      // ## Arrange ##
      // 静的データのため準備不要

      // ## Act ##
      const projects = await portfolioService.getAllProjects()

      // ## Assert ##
      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)

      const firstProject = projects[0]
      expect(firstProject).toHaveProperty('id')
      expect(firstProject).toHaveProperty('title')
      expect(firstProject).toHaveProperty('description')
      expect(firstProject).toHaveProperty('imageUrl')
      expect(firstProject).toHaveProperty('techStack')
      expect(Array.isArray(firstProject.techStack)).toBe(true)
    })
  })
})
