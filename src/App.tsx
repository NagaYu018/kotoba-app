import React, { useState, useRef } from 'react'
import './App.css'

//textの位置
type TextPosition = {
  x: number //横位置（0~100の％）
  y: number //縦位置（0~100の％）
}
//文字形式
type TextStyle = {
  fontFamily: string 
  fontSize: number
  fontWeight: number
  color: string
  fontStyle: 'normal' | 'italic'          //斜体
  lineHeight: number                      //行間
  textAlign: 'left' | 'center' | 'right'  //配置
  letterSpacing: number                   //文字間隔
}
//背景
type Background = {
  //将来的に画像を扱う場合に備えた拡張性
  | {type: 'color'; value: string }
  | {type:'image'; url:string } //例：'#1a2a4a'
}
//テキスト情報まとめ
type TextElement = {
  position: TextPosition
  style: TextStyle
}

// 言葉の定義
type Quote = {
  id: number
  text: string
  source: string
  background: Background
  textLayout: TextElement
  sourceLayout: TextElement
}

// サンプルデータ（仮）
const initialQuotes: Quote[] = [
  { 
    id: 1, 
    text: '少しくらいは僕らを捌いたっていいじゃないですか',
    source: 'ヨルシカ 強盗と花束', 
    background: {type: 'color', value: '#1a2a4a'},
    textLayout: {
      position: { x: 50, y: 50 },
      style: {
        fontFamily: "'Noto Serif JP', serif",
        fontSize: 24,
        fontWeight: 400,
        color: '#ffffff',
        fontStyle: 'normal',
        lineHeight: 1.6,
        textAlign: 'center',
        letterSpacing: 0,
      },
    },
    sourceLayout: {
      position: { x: 50, y: 70 },
      style: {
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 14,
        fontWeight: 300,
        color: '#cccccc',
        fontStyle: 'italic',
        lineHeight: 1.4,
        textAlign: 'center',
        letterSpacing: 1,
      },
    },
  },
  { 
    id: 2, 
    text: '神様だって作品なんだから', 
    source: 'ヨルシカ レプリカント',
    background: {type: 'color', value: '#2a1a3a'},
    textLayout: {
      position: { x: 50, y: 10 },
      style: {
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 28,
        fontWeight: 700,
        color: '#f0e6ff',
        fontStyle: 'italic',
        lineHeight: 1.4,
        textAlign: 'center',
        letterSpacing: 1,
      },
    },
    sourceLayout: {
      position: { x: 50, y: 30 },
      style: {
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: '#cccccc',
        fontStyle: 'italic',
        lineHeight: 1.4,
        textAlign: 'center',
        letterSpacing: 1,
      },
    },
  },
  { id: 3, 
    text: '僕は愛を，底が抜けた柄杓で呑んでる', 
    source: 'ヨルシカ 嘘月', 
    background: {type: 'color', value: '#1a3a2a'},
    textLayout: {
      position: { x: 20, y: 80 },
      style: {
        fontFamily: "'Shippori Mincho', serif",
        fontSize: 24,
        fontWeight: 400,
        color: '#ffffff',
        fontStyle: 'normal',
        lineHeight: 1.4,
        textAlign: 'right',
        letterSpacing: 1.5,
      },
    },
    sourceLayout: {
      position: { x: 20, y: 90 },
      style: {
        fontFamily: "'Noto Sans JP', sans-serif",
        fontSize: 14,
        fontWeight: 200,
        color: '#cccccc',
        fontStyle: 'normal',
        lineHeight: 1.4,
        textAlign: 'right',
        letterSpacing: 1.5,
      },
    },
  },
]

function App() {
  //現在表示している言葉の番号（最初は０番目）
  //usestate > Reactが再描画してくれる
  const [currentIndex, setCurrentIndex] = useState(0)
  //画面上の要素の位置やサイズを取得
  const  containerRef = useRef<HTMLDivElement>(null)
  //ドラッグの開始の有無を管理
  const draggingTarget = useRef<'textLayout' | 'sourceLayout' | null>(null)
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [activeTarget, setActiveTarget] = useState<'textLayout' | 'sourceLayout' | null>(null)
  //指と言葉の中心のズレを記憶
  const dragOffset = useRef({ x: 0, y: 0 })

  //今表示する言葉
  const currentQuote = quotes[currentIndex]
 //引数：どの軸を変えるか(axis)，どんな値に変えるか(value)
  const handleTextPositionChange = (
    target: 'textLayout' | 'sourceLayout',
    axis: 'x' | 'y', 
    value: number) => {
    setQuotes((prevQuotes) => 
      prevQuotes.map((quote, index) => {
        if (index !== currentIndex) {
          return quote
        }
        return {
          ...quote,  //quoteの中身を全部コピー
          [target]: { //textLayoutだけ新しく上書き
            ...quote[target], //text or sourceの中身を全部コピー
            position: {          //positionだけ新しく上書き
              ...quote[target].position, //psitionの中身を全部コピー
              [axis]: value, //x or y を上書き
            },
          },
        }
      })
    )
  }

  //ドラッグ処理
  const handlePointerDown = (
    target: 'textLayout' | 'sourceLayout',
    e: React.PointerEvent<HTMLParagraphElement>
  ) => {
    e.stopPropagation()
    if(!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100

    const currentPosition = currentQuote[target].position

    dragOffset.current = {
      x: currentPosition.x - pointerX,
      y: currentPosition.y - pointerY,
    }
    
    draggingTarget.current = target
    setActiveTarget(target)
  }

  //ドラッグ中
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingTarget.current) return
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const pointerX = ((e.clientX - rect.left) / rect.width) * 100
    const pointerY = ((e.clientY - rect.top) / rect.height) * 100

    const x = Math.round(pointerX + dragOffset.current.x)
    const y = Math.round(pointerY + dragOffset.current.y)

    handleTextPositionChange(draggingTarget.current, 'x', Math.max(0, Math.min(100, x)))
    handleTextPositionChange(draggingTarget.current, 'y', Math.max(0, Math.min(100, y)))
  }

  //ドラッグ終了
  const handlePointerUp = () => {
    draggingTarget.current = null 
  } 
  //ランダムで次の言葉に切り替える（今表示されているものは除く）
  const handleRandom = () => {
    //現在のインデックスを除いた候補リストを作る
    const candidates = quotes
    .map((_, index) => index)
    .filter((index) => index !== currentIndex)

    //候補の中からランダムに選ぶ
    //math.floor > 小数点切り捨て
    const randomIndex = candidates[Math.floor(Math.random() * candidates.length)]
    setCurrentIndex(randomIndex)
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="app"
        style={{ backgroundColor: currentQuote.background.value }}
        onPointerDown={() => setActiveTarget(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <p
        className={`quote-text ${activeTarget === 'textLayout' ? 'selected' : ''}`}
        onPointerDown={(e) => handlePointerDown('textLayout', e)}
        style={{
          left: `${currentQuote.textLayout.position.x}%`,
          top: `${currentQuote.textLayout.position.y}%`,
          fontFamily: currentQuote.textLayout.style.fontFamily,
          fontSize: `${currentQuote.textLayout.style.fontSize}px`,
          fontWeight: currentQuote.textLayout.style.fontWeight,
          color: currentQuote.textLayout.style.color,
          fontStyle: currentQuote.textLayout.style.fontStyle,
          lineHeight: currentQuote.textLayout.style.lineHeight,
          textAlign: currentQuote.textLayout.style.textAlign,
          letterSpacing: `${currentQuote.textLayout.style.letterSpacing}px`,
          }}
        >
          {currentQuote.text}
        </p>
        <p
        className={`source-text ${activeTarget === 'sourceLayout' ? 'selected' : ''}`}
        onPointerDown={(e) => handlePointerDown('sourceLayout', e)}
        style={{
          left: `${currentQuote.sourceLayout.position.x}%`,
          top: `${currentQuote.sourceLayout.position.y}%`,
          fontFamily: currentQuote.sourceLayout.style.fontFamily,
          fontSize: `${currentQuote.sourceLayout.style.fontSize}px`,
          fontWeight: currentQuote.sourceLayout.style.fontWeight,
          color: currentQuote.sourceLayout.style.color,
          fontStyle: currentQuote.sourceLayout.style.fontStyle,
          lineHeight: currentQuote.sourceLayout.style.lineHeight,
          textAlign: currentQuote.sourceLayout.style.textAlign,
          letterSpacing: `${currentQuote.sourceLayout.style.letterSpacing}px`,
        }}
        >
          {currentQuote.source}
        </p>
        <button className="random-button" onClick={handleRandom}>
          ランダム
        </button>
      </div>

      <div
        className="editor-controls"
      >
        <label>
          X: {currentQuote.textLayout.position.x}
          <input
            type="range"
            min={0}
            max={100}
            value={currentQuote.textLayout.position.x}
            onChange={(e) =>
              handleTextPositionChange('textLayout', 'x', Number(e.target.value))
            }
          />  
        </label>
        <label>
          Y: {currentQuote.textLayout.position.y}
          <input
            type="range"
            min={0}
            max={100}
            value={currentQuote.textLayout.position.y}
            //変数名eは特に指定はなくonClick, onChange等により構造体の中身が変わる
            onChange={(e) =>
              handleTextPositionChange('textLayout','y', Number(e.target.value))
            }
          />
        </label>
      </div>
    </>
  )
}

export default App
