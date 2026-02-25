import { HttpResponse, http } from 'msw'

/**
 * MSW リクエストハンドラー定義。
 * E2E テスト時（VITE_MSW=true）に API リクエストをインターセプトしてモックレスポンスを返す。
 * 本番ビルドには含まれない（VITE_MSW=true のときだけ動的インポートされる）。
 */
export const handlers = [
  /**
   * お問い合わせ送信 API のモック。
   * DB への書き込みをスキップして即 200 を返す。
   */
  http.post('/api/contact', () => {
    return HttpResponse.json({ success: true }, { status: 200 })
  }),
]
