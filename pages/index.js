import { useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

const ROWS = 20
const COLS = 10

const SHAPES = {
  I: [
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
    ],
  ],
  J: [
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 2],
      [1, 2],
    ],
  ],
  L: [
    [
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  ],
  O: [
    [
      [1, 0],
      [2, 0],
      [1, 1],
      [2, 1],
    ],
  ],
  S: [
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
    ],
    [
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  T: [
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  Z: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [2, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 2],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  ],
}

const PIECE_COLORS = {
  I: '#64c7ff',
  J: '#4a6cd4',
  L: '#ff9248',
  O: '#ffd953',
  S: '#71e48f',
  T: '#c36bff',
  Z: '#ff6b6b',
}

const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null))

const randomPieceType = () => {
  const types = Object.keys(SHAPES)
  return types[Math.floor(Math.random() * types.length)]
}

const createPiece = (type) => ({
  type,
  rotation: 0,
  position: { x: Math.floor(COLS / 2) - 2, y: 0 },
  color: PIECE_COLORS[type],
})

const checkCollision = (board, piece) => {
  const shape = SHAPES[piece.type][piece.rotation]
  return shape.some(([offsetX, offsetY]) => {
    const x = piece.position.x + offsetX
    const y = piece.position.y + offsetY

    if (x < 0 || x >= COLS || y >= ROWS) {
      return true
    }

    if (y >= 0 && board[y][x]) {
      return true
    }

    return false
  })
}

const mergePiece = (board, piece) => {
  const newBoard = board.map((row) => [...row])
  const shape = SHAPES[piece.type][piece.rotation]

  shape.forEach(([offsetX, offsetY]) => {
    const x = piece.position.x + offsetX
    const y = piece.position.y + offsetY

    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
      newBoard[y][x] = piece.color
    }
  })

  return newBoard
}

const clearFullRows = (board) => {
  const filtered = board.filter((row) => row.some((cell) => !cell))
  const clearedRows = ROWS - filtered.length

  while (filtered.length < ROWS) {
    filtered.unshift(Array(COLS).fill(null))
  }

  return { board: filtered, clearedRows }
}

const lineScores = [0, 40, 100, 300, 1200]

export default function Home() {
  const [board, setBoard] = useState(() => createEmptyBoard())
  const [activePiece, setActivePiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [score, setScore] = useState(0)
  const [linesCleared, setLinesCleared] = useState(0)
  const [level, setLevel] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const dropSpeed = useMemo(
    () => Math.max(100, 800 - level * 70),
    [level]
  )

  useEffect(() => {
    if (!activePiece && !gameOver) {
      const typeToUse = nextPiece ?? randomPieceType()
      const newPiece = createPiece(typeToUse)

      if (checkCollision(board, newPiece)) {
        setGameOver(true)
        setIsPaused(false)
        setActivePiece(null)
        return
      }

      setActivePiece(newPiece)
      setNextPiece(randomPieceType())
    }
  }, [activePiece, board, gameOver, nextPiece])

  const attemptMove = useCallback(
    (offsetX, offsetY, rotate = false) => {
      if (!activePiece) return false

      const rotations = SHAPES[activePiece.type]
      const nextRotation = rotate
        ? (activePiece.rotation + 1) % rotations.length
        : activePiece.rotation

      const candidate = {
        ...activePiece,
        rotation: nextRotation,
        position: {
          x: activePiece.position.x + offsetX,
          y: activePiece.position.y + offsetY,
        },
      }

      if (!checkCollision(board, candidate)) {
        setActivePiece(candidate)
        return true
      }

      return false
    },
    [activePiece, board]
  )

  const handleLockPiece = useCallback(() => {
    if (!activePiece) return

    const merged = mergePiece(board, activePiece)
    const { board: clearedBoard, clearedRows } = clearFullRows(merged)

    setBoard(clearedBoard)

    if (clearedRows > 0) {
      setLinesCleared((prev) => {
        const totalLines = prev + clearedRows
        const newLevel = Math.floor(totalLines / 10)

        setLevel(newLevel)
        setScore((prevScore) =>
          prevScore + lineScores[clearedRows] * (newLevel + 1)
        )

        return totalLines
      })
    }

    const incomingPiece = createPiece(nextPiece ?? randomPieceType())
    setNextPiece(randomPieceType())

    if (checkCollision(clearedBoard, incomingPiece)) {
      setGameOver(true)
      setActivePiece(null)
      return
    }

    setActivePiece(incomingPiece)
  }, [activePiece, board, nextPiece])

  const drop = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return

    const moved = attemptMove(0, 1)
    if (!moved) {
      handleLockPiece()
    }
  }, [activePiece, attemptMove, gameOver, handleLockPiece, isPaused])

  useEffect(() => {
    if (isPaused || gameOver) return

    const interval = setInterval(() => {
      drop()
    }, dropSpeed)

    return () => clearInterval(interval)
  }, [drop, dropSpeed, gameOver, isPaused])

  const hardDrop = useCallback(() => {
    if (!activePiece || gameOver || isPaused) return

    let targetY = activePiece.position.y
    while (
      !checkCollision(board, {
        ...activePiece,
        position: { x: activePiece.position.x, y: targetY + 1 },
      })
    ) {
      targetY += 1
    }

    setActivePiece((prev) =>
      prev
        ? {
            ...prev,
            position: { ...prev.position, y: targetY },
          }
        : prev
    )

    setTimeout(() => {
      handleLockPiece()
    }, 0)
  }, [activePiece, board, gameOver, handleLockPiece, isPaused])

  const togglePause = useCallback(() => {
    if (gameOver) return
    setIsPaused((prev) => !prev)
  }, [gameOver])

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setActivePiece(null)
    setNextPiece(randomPieceType())
    setScore(0)
    setLinesCleared(0)
    setLevel(0)
    setIsPaused(false)
    setGameOver(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          attemptMove(-1, 0)
          break
        case 'ArrowRight':
          event.preventDefault()
          attemptMove(1, 0)
          break
        case 'ArrowDown':
          event.preventDefault()
          attemptMove(0, 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          attemptMove(0, 0, true)
          break
        case ' ': {
          event.preventDefault()
          hardDrop()
          break
        }
        case 'p':
        case 'P':
          event.preventDefault()
          togglePause()
          break
        case 'r':
        case 'R':
          event.preventDefault()
          resetGame()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [attemptMove, gameOver, hardDrop, resetGame, togglePause])

  const displayBoard = useMemo(() => {
    const boardCopy = board.map((row) => [...row])

    if (activePiece) {
      const shape = SHAPES[activePiece.type][activePiece.rotation]
      shape.forEach(([offsetX, offsetY]) => {
        const x = activePiece.position.x + offsetX
        const y = activePiece.position.y + offsetY

        if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
          boardCopy[y][x] = activePiece.color
        }
      })
    }

    return boardCopy
  }, [activePiece, board])

  const nextPreview = useMemo(() => {
    const size = 4
    const preview = Array.from({ length: size }, () => Array(size).fill(null))

    if (nextPiece) {
      const template = SHAPES[nextPiece][0]
      template.forEach(([offsetX, offsetY]) => {
        if (offsetY < size && offsetX < size) {
          preview[offsetY][offsetX] = PIECE_COLORS[nextPiece]
        }
      })
    }

    return preview
  }, [nextPiece])

  return (
    <>
      <Head>
        <title>俄罗斯方块</title>
        <meta
          name="description"
          content="A modern implementation of the classic Tetris puzzle game"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1 className={styles.title}>俄罗斯方块</h1>
        <p className={styles.subtitle}>
          使用键盘控制方块，挑战更高分数！
        </p>

        <div className={styles.tetrisContainer}>
          <div className={styles.board}>
            {displayBoard.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.row}>
                {row.map((cell, columnIndex) => (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    className={styles.cell}
                    style={{
                      backgroundColor: cell ?? 'rgba(255, 255, 255, 0.05)',
                      boxShadow: cell
                        ? `inset 0 0 0 1px rgba(255, 255, 255, 0.3)`
                        : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.panel}>
              <h2>统计</h2>
              <p>
                分数：<strong>{score}</strong>
              </p>
              <p>
                等级：<strong>{level + 1}</strong>
              </p>
              <p>
                消除行数：<strong>{linesCleared}</strong>
              </p>
            </div>

            <div className={styles.panel}>
              <h2>下一个</h2>
              <div className={styles.preview}>
                {nextPreview.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.previewRow}>
                    {row.map((cell, columnIndex) => (
                      <div
                        key={`${rowIndex}-${columnIndex}`}
                        className={styles.previewCell}
                        style={{ backgroundColor: cell ?? 'transparent' }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <h2>操作提示</h2>
              <ul className={styles.controlsList}>
                <li>← →：左右移动</li>
                <li>↓：快速下落</li>
                <li>↑：旋转方块</li>
                <li>空格：一键下落到底</li>
                <li>P：暂停/继续</li>
                <li>R：重新开始</li>
              </ul>
            </div>

            <div className={styles.actions}>
              <button onClick={togglePause} disabled={gameOver}>
                {isPaused ? '继续游戏' : '暂停游戏'}
              </button>
              <button onClick={resetGame}>重新开始</button>
            </div>

            {gameOver && (
              <div className={styles.statusMessage}>
                <p>游戏结束！</p>
                <p>按 R 键或点击重新开始继续挑战。</p>
              </div>
            )}

            {isPaused && !gameOver && (
              <div className={styles.statusMessage}>
                <p>游戏已暂停</p>
                <p>按 P 键或点击继续游戏。</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  )
}
