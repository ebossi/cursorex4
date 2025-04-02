class Minesweeper {
    constructor() {
        this.board = document.getElementById('board');
        this.minesLeft = document.getElementById('minesLeft');
        this.timer = document.getElementById('timer');
        this.gameStatus = document.getElementById('gameStatus');
        this.newGameBtn = document.getElementById('newGame');
        this.backToPortfolioBtn = document.getElementById('backToPortfolio');

        this.ROWS = 10;
        this.COLS = 10;
        this.MINES = 10;
        this.cells = [];
        this.mines = [];
        this.flags = 0;
        this.revealed = 0;
        this.gameOver = false;
        this.timerInterval = null;
        this.seconds = 0;

        this.init();
    }

    init() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.backToPortfolioBtn.addEventListener('click', () => window.location.href = 'index.html');
        this.startNewGame();
    }

    startNewGame() {
        this.resetGame();
        this.createBoard();
        this.placeMines();
        this.calculateNumbers();
    }

    resetGame() {
        this.board.innerHTML = '';
        this.cells = [];
        this.mines = [];
        this.flags = 0;
        this.revealed = 0;
        this.gameOver = false;
        this.seconds = 0;
        this.minesLeft.textContent = this.MINES;
        this.timer.textContent = '0';
        this.gameStatus.textContent = '';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    createBoard() {
        this.board.style.gridTemplateColumns = `repeat(${this.COLS}, 1fr)`;
        
        for (let i = 0; i < this.ROWS; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.COLS; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', (e) => this.handleClick(e));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(e);
                });
                
                this.board.appendChild(cell);
                this.cells[i][j] = { element: cell, isMine: false, value: 0, revealed: false, flagged: false };
            }
        }
    }

    placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < this.MINES) {
            const row = Math.floor(Math.random() * this.ROWS);
            const col = Math.floor(Math.random() * this.COLS);
            
            if (!this.cells[row][col].isMine) {
                this.cells[row][col].isMine = true;
                this.mines.push({ row, col });
                minesPlaced++;
            }
        }
    }

    calculateNumbers() {
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS; j++) {
                if (!this.cells[i][j].isMine) {
                    let count = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            const ni = i + di;
                            const nj = j + dj;
                            if (ni >= 0 && ni < this.ROWS && nj >= 0 && nj < this.COLS && this.cells[ni][nj].isMine) {
                                count++;
                            }
                        }
                    }
                    this.cells[i][j].value = count;
                }
            }
        }
    }

    handleClick(e) {
        if (this.gameOver) return;
        
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.cells[row][col].flagged || this.cells[row][col].revealed) return;
        
        if (this.revealed === 0) {
            this.startTimer();
        }
        
        this.revealCell(row, col);
    }

    handleRightClick(e) {
        if (this.gameOver) return;
        
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (this.cells[row][col].revealed) return;
        
        if (!this.cells[row][col].flagged && this.flags < this.MINES) {
            this.cells[row][col].flagged = true;
            this.flags++;
            cell.classList.add('flagged');
            this.minesLeft.textContent = this.MINES - this.flags;
        } else if (this.cells[row][col].flagged) {
            this.cells[row][col].flagged = false;
            this.flags--;
            cell.classList.remove('flagged');
            this.minesLeft.textContent = this.MINES - this.flags;
        }
    }

    revealCell(row, col) {
        if (row < 0 || row >= this.ROWS || col < 0 || col >= this.COLS) return;
        if (this.cells[row][col].revealed || this.cells[row][col].flagged) return;
        
        const cell = this.cells[row][col];
        cell.revealed = true;
        this.revealed++;
        cell.element.classList.add('revealed');
        
        if (cell.isMine) {
            cell.element.classList.add('mine');
            this.gameOver = true;
            this.revealAllMines();
            this.gameStatus.textContent = '게임 오버!';
            clearInterval(this.timerInterval);
            return;
        }
        
        if (cell.value > 0) {
            cell.element.textContent = cell.value;
            cell.element.dataset.value = cell.value;
        } else {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    this.revealCell(row + di, col + dj);
                }
            }
        }
        
        if (this.revealed === this.ROWS * this.COLS - this.MINES) {
            this.gameOver = true;
            this.gameStatus.textContent = '축하합니다! 승리하셨습니다!';
            clearInterval(this.timerInterval);
        }
    }

    revealAllMines() {
        this.mines.forEach(mine => {
            const cell = this.cells[mine.row][mine.col];
            cell.element.classList.add('mine');
        });
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.timer.textContent = this.seconds;
        }, 1000);
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
}); 