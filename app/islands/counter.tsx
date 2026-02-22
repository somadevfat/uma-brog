import { useState } from 'hono/jsx'

/**
 * シンプルなカウンターコンポーネント。
 * ボタンをクリックすることでカウントを増やします。
 * @returns {JSX.Element} レンダリングされたカウンター。
 */
export default function Counter() {
  // カウント状態を管理
  const [count, setCount] = useState(0)

  return (
    <div>
      <p class="py-2 text-2xl">{count}</p>
      <button
        type="button"
        class="px-4 py-2 bg-orange-400 text-white rounded cursor-pointer"
        // クリック時にカウントをインクリメント
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  )
}
