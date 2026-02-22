import { describe, expect, it } from 'vitest'
import ContactForm from '../../islands/contact-form'
import Counter from '../../islands/counter'

/**
 * Islands コンポーネントのテスト。
 */
describe('Islands SSR Check', () => {
  it('Counter island exists', () => {
    expect(Counter).toBeDefined()
  })

  it('ContactForm island exists', () => {
    expect(ContactForm).toBeDefined()
  })
})
