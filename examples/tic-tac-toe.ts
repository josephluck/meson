import { h, View, app } from '../src'

type Player = 'x' | 'o'
type Square = '' | Player
type Row = Square[]
type Board = Row[]
type Winner = Player | boolean
type State = {
  board: Board
  turn: Player
  winner: Winner
}

function getAllColumns(board: Board): Board {
  return Array.from({ length: board.length })
    .map((_, columnIndex) => board.reduce((prev, row) => {
      return [...prev, row[columnIndex]]
    }, [] as Square[]))
}

function isWon(vertice: Square[]): boolean {
  return vertice.every(square => square === 'x') || vertice.every(square => square === 'o')
}

function determineWinner(board: Board): Winner {
  const combos = [...board, ...getAllColumns(board)]
  return combos
    .reduce((prev, vertice) => {
      return prev ? prev : isWon(vertice) ? vertice[0] as Player : false
    }, false as Winner)
}

function createEmptyBoard(length): Board {
  return Array.from({ length }).map(() => Array.from({ length }).map(() => '' as Square))
}

function updateBoard(state: State, clickedRowIndex: number, clickedColumnIndex: number): State {
  const turn = state.turn === 'x' ? 'o' : 'x'
  const board = state.board.map((row, rowIndex) => row.map((square, columnIndex) => {
    const isWherePlayerClicked = clickedRowIndex === rowIndex && clickedColumnIndex === columnIndex && square === ''
    return isWherePlayerClicked ? turn : square
  }))
  return state.winner ? state : { board, turn, winner: determineWinner(board) }
}

const renderSquare = (onclick: (rowIndex: number, columnIndex: number) => any, rowIndex: number) => (square: Square, columnIndex: number) => {
  return h('div', {
    style: 'width: 10px; height: 10px; display: inline-block; margin: 5px; border: solid 1px black;',
    onclick: square === '' ? () => onclick(rowIndex, columnIndex) : undefined,
  }, square)
}

const renderRow = (onclick: (rowIndex: number, columnIndex: number) => any) => (row: Row, rowIndex: number) => {
  return h('div', {}, row.map(renderSquare(onclick, rowIndex)))
}

const defaultState: State = {
  board: createEmptyBoard(3),
  turn: 'x',
  winner: false,
}

const view: View<State> = (state = defaultState, update) => {
  const onclick = (rowIndex: number, columnIndex: number) => update(updateBoard(state, rowIndex, columnIndex))
  const renderWinner = () => state.winner ? `Player ${state.winner} won!` : null
  const renderBoard = () => h('div', {}, state.board.map(renderRow(onclick)))
  return h('div', {}, [renderBoard(), renderWinner()])
}

export default function () {
  const node = document.createElement('div')
  node.style.margin = '100px'
  document.body.appendChild(node)
  const { run } = app(defaultState)
  run(node, view)
}
