# setQuotesの扱い
具体的にどう違うのか
ReactはsetStateを呼んでも、即座に更新するわけではなく、まとめて処理することがあるという仕様があります。

tsx// 例：2回連続でsetQuotesを呼ぶ場合
setQuotes(quotes.map(...追加1...))  // quotesは古い状態
setQuotes(quotes.map(...追加2...))  // quotesはまだ古い状態のまま！
// → 追加1が消えてしまう可能性がある

# 新出の概念
① useRef    → 画面上の要素を直接参照する仕組み
② getBoundingClientRect() → 要素の実際の位置・サイズを取得する
③ Pointer Events → マウスと指のタッチを統一して扱うイベント

画面上のある要素が実際にどの位置にどのサイズで表示されているのかを取得する関数
const rect = containerRef.current.getBoundingClientRect()
構造体は以下の通り
rect
├── left   → 要素の左端が画面左から何pxか
├── top    → 要素の上端が画面上から何pxか
├── width  → 要素の横幅（px）
└── height → 要素の縦幅（px）

quote-textをタップする
↓
① quote-textのonPointerDownが発火する → activeTarget = 'textLayout'
↓
② イベントが「親要素」にも伝わっていく(バブリング)
↓
③ .appのonPointerDownも発火してしまう → activeTarget = null
↓
結果：選択されたと思ったら、すぐにnullに戻ってしまう