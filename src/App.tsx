import { useState } from 'react'

// 言葉の定義
type Quote = {
  id: number
  text: string
  source: string
}

// サンプルデータ（仮）
const quotes: Quote[] = [
  { id: 1, text: '少しくらいは僕らを捌いたっていいじゃないですか', source: 'ヨルシカ 強盗と花束'},
  { id: 2, text: '神様だって作品なんだから', source: 'ヨルシカ レプリカント'},
  { id: 3, text: '僕は愛を，底が抜けた柄杓で呑んでる', source: 'ヨルシカ 嘘月'}
]

function App() {
  //現在表示している言葉の番号（最初は０番目）
  const [currentIndex, setCurrentIndex] = useState(0)

  //今表示する言葉
  const currentQuote = quotes[currentIndex]

  //ランダムで次の言葉に切り替える（今表示されているものは除く）
  const handleRandom = () => {
    //現在のインデックスを除いた候補リストを作る
    const candidates = quotes
    .map((_, index) => index)
    .filter((index) => index !== currentIndex)

    //候補の中からランダムに選ぶ
    const randomIndex = candidates[Math.floor(Math.random() * candidates.length)]
    setCurrentIndex(randomIndex)
  }

  return (
    <div className="app">
      <p>{currentQuote.text}</p>
      <p>{currentQuote.source}</p>
      <button onClick={handleRandom}>ランダム</button>
    </div>
  )
}

export default App