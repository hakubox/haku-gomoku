import React from 'react';
import "./gomoku.css";

function calculateWinner(squares, rowNumber, colNumber) {
  let winner = {
    loc: [-1 , -1],
    winSquares: [],
    value: null
  };
  squares.filter(i => i).some(i => {
    if(
      (squares[i.rowIndex * rowNumber + i.colIndex + 1] || {}).value === i.value &&
      (squares[i.rowIndex * rowNumber + i.colIndex + 2] || {}).value === i.value &&
      (squares[i.rowIndex * rowNumber + i.colIndex + 3] || {}).value === i.value &&
      (squares[i.rowIndex * rowNumber + i.colIndex + 4] || {}).value === i.value
    ) {
      winner.winSquares = [
        i.rowIndex * rowNumber + i.colIndex,
        i.rowIndex * rowNumber + i.colIndex + 1,
        i.rowIndex * rowNumber + i.colIndex + 2,
        i.rowIndex * rowNumber + i.colIndex + 3,
        i.rowIndex * rowNumber + i.colIndex + 4
      ];
      winner.value = i.value;
      return true;
    } else if (
      (squares[(i.rowIndex + 1) * rowNumber + i.colIndex] || {}).value === i.value &&
      (squares[(i.rowIndex + 2) * rowNumber + i.colIndex] || {}).value === i.value &&
      (squares[(i.rowIndex + 3) * rowNumber + i.colIndex] || {}).value === i.value &&
      (squares[(i.rowIndex + 4) * rowNumber + i.colIndex] || {}).value === i.value
    ) {
      winner.winSquares = [
        (i.rowIndex) * rowNumber + i.colIndex,
        (i.rowIndex + 1) * rowNumber + i.colIndex,
        (i.rowIndex + 2) * rowNumber + i.colIndex,
        (i.rowIndex + 3) * rowNumber + i.colIndex,
        (i.rowIndex + 4) * rowNumber + i.colIndex
      ];
      winner.value = i.value;
      return true;
    } else if (
      (squares[(i.rowIndex + 1) * rowNumber + i.colIndex + 1] || {}).value === i.value &&
      (squares[(i.rowIndex + 2) * rowNumber + i.colIndex + 2] || {}).value === i.value &&
      (squares[(i.rowIndex + 3) * rowNumber + i.colIndex + 3] || {}).value === i.value &&
      (squares[(i.rowIndex + 4) * rowNumber + i.colIndex + 4] || {}).value === i.value
    ) {
      winner.winSquares = [
        (i.rowIndex) * rowNumber + i.colIndex,
        (i.rowIndex + 1) * rowNumber + i.colIndex + 1,
        (i.rowIndex + 2) * rowNumber + i.colIndex + 2,
        (i.rowIndex + 3) * rowNumber + i.colIndex + 3,
        (i.rowIndex + 4) * rowNumber + i.colIndex + 4
      ];
      winner.value = i.value;
      return true;
    } else if (
      (squares[(i.rowIndex - 1) * rowNumber + i.colIndex + 1] || {}).value === i.value &&
      (squares[(i.rowIndex - 2) * rowNumber + i.colIndex + 2] || {}).value === i.value &&
      (squares[(i.rowIndex - 3) * rowNumber + i.colIndex + 3] || {}).value === i.value &&
      (squares[(i.rowIndex - 4) * rowNumber + i.colIndex + 4] || {}).value === i.value
    ) {
      winner.winSquares = [
        (i.rowIndex) * rowNumber + i.colIndex,
        (i.rowIndex - 1) * rowNumber + i.colIndex + 1,
        (i.rowIndex - 2) * rowNumber + i.colIndex + 2,
        (i.rowIndex - 3) * rowNumber + i.colIndex + 3,
        (i.rowIndex - 4) * rowNumber + i.colIndex + 4
      ];
      winner.value = i.value;
      return true;
    }
    return null;
  });
  return winner;
}

/**
 * @class 棋盘格
 */
export function Square(props) {
  return (
    <button type={props.value} index={props.index} className={'square' + (props.value ? ' disabled' : '') + (props.winSquares.indexOf(props.index) >= 0 ? ' win' : '')} onMouseDown={props.onMouseDown}>
    </button>
  );
}

/**
 * @class 棋盘
 */
export class Board extends React.Component {
  renderSquare(i, rowIndex, colIndex) {
    return (
      <Square
        key={i}
        index={i}
        winSquares={this.props.winSquares}
        value={this.props.squares[i] ? this.props.squares[i].value : ''}
        onMouseDown={e => this.props.onMouseDown(i, rowIndex, colIndex)}
      />
    );
  }

  renderRow() {
    return Array(this.props.rowNumber).fill(null).map((item, rowIndex) =>
      <div index={rowIndex} key={rowIndex} className="board-row">
        {this.renderCell(rowIndex)}
      </div>
    );
  }

  renderCell(rowIndex) {
    return Array(this.props.colNumber).fill(null).map((item, colIndex) =>
      this.renderSquare(rowIndex * this.props.colNumber + colIndex, rowIndex, colIndex)
    )
  }

  render() {
    return (
      <div>
        {this.renderRow()}
      </div>
    );
  }
}

export class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [],
      colNumber: 20,
      rowNumber: 20,
      stepNumber: 0,
      xIsNext: true
    };
    this.state.history.push({
      squares: Array(this.state.colNumber * this.state.rowNumber).fill(null),
      winSquares: [],
    });
  }

  handleClick(i, rowIndex, colIndex) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //有一方赢了或者当前格子落子后不允许重新落子
    if(calculateWinner(squares, this.state.rowNumber, this.state.colNumber).value || squares[i]) {
      return;
    }
    squares[i] = {
      rowIndex: rowIndex,
      colIndex: colIndex,
      step: this.state.stepNumber + 1,
      value: this.state.xIsNext ? 'X' : 'O'
    };
    this.setState({
      history: history.concat([{
        squares: squares,
        rowIndex: rowIndex,
        colIndex: colIndex,
        winSquares: []
      }]),
      squares: squares,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2)
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.rowNumber, this.state.colNumber);

    const moves = history.map((step, index) =>
      <li key={index}>
        <span className={(index % 2 ? 'x' : 'o') + (index === this.state.stepNumber ? ' active' : '')} onMouseDown={e => this.jumpTo(index)}>
          {index ? `第${index}步：${index % 2 ? '红' : '黑'} ${history[index].rowIndex}:${history[index].colIndex}` : '棋局开始！'}
        </span>
      </li>
    )

    let status;
    if(winner.value) {
      current.winSquares = winner.winSquares;
      status = '赢家：' + (winner.value === 'X' ? '红' : '黑');
    } else {
      status = '下一步: ' + (this.state.xIsNext ? '红' : '黑');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rowNumber={this.state.rowNumber}
            colNumber={this.state.colNumber}
            squares={current.squares}
            winSquares={current.winSquares}
            onMouseDown={(i, rowIndex, colIndex) => this.handleClick(i, rowIndex, colIndex)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
