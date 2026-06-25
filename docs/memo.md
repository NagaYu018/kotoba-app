# setQuotesの扱い
具体的にどう違うのか
ReactはsetStateを呼んでも、即座に更新するわけではなく、まとめて処理することがあるという仕様があります。

tsx// 例：2回連続でsetQuotesを呼ぶ場合
setQuotes(quotes.map(...追加1...))  // quotesは古い状態
setQuotes(quotes.map(...追加2...))  // quotesはまだ古い状態のまま！
// → 追加1が消えてしまう可能性がある