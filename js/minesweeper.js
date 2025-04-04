class Minesweeper {
    constructor() {
        this.difficultySettings = {
            easy: { rows: 9, cols: 9, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };
        this.currentDifficulty = 'easy';
        this.board = [];
        this.mines = [];
        this.gameOver = false;
        this.firstClick = true;
        this.timer = 0;
        this.timerInterval = null;
        this.flaggedCells = 0;

        // DOM 요소
        this.boardElement = document.getElementById('board');
        this.minesLeftDisplay = document.getElementById('minesLeft');
        this.timerDisplay = document.getElementById('timer');
        this.gameStatus = document.getElementById('gameStatus');
        this.startButton = document.getElementById('startGame');
        this.resetButton = document.getElementById('resetGame');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');

        this.init();
    }

    init() {
        // 이벤트 리스너 설정
        this.startButton.addEventListener('click', () => this.startNewGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        
        // 난이도 버튼 이벤트 리스너
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.difficultyButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                this.currentDifficulty = button.dataset.difficulty;
                this.resetGame();
            });
        });

        // 게임 초기화
        this.createBoard();
    }

    createBoard() {
        const settings = this.difficultySettings[this.currentDifficulty];
        this.boardElement.style.gridTemplateColumns = `repeat(${settings.cols}, 35px)`;
        
        this.board = [];
        for (let i = 0; i < settings.rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < settings.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // 더블클릭 이벤트 리스너 추가
                let clickCount = 0;
                let clickTimer = null;
                
                cell.addEventListener('click', (e) => {
                    clickCount++;
                    if (clickCount === 1) {
                        clickTimer = setTimeout(() => {
                            clickCount = 0;
                            this.handleClick(i, j);
                        }, 250);
                    } else {
                        clearTimeout(clickTimer);
                        clickCount = 0;
                        this.handleDoubleClick(i, j);
                    }
                });
                
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleRightClick(i, j);
                });
                
                this.boardElement.appendChild(cell);
                this.board[i][j] = {
                    element: cell,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    value: 0
                };
            }
        }
        
        this.minesLeftDisplay.textContent = settings.mines;
        this.flaggedCells = 0;
    }

    startNewGame() {
        this.resetGame();
        this.placeMines();
        this.calculateNumbers();
    }

    resetGame() {
        this.gameOver = false;
        this.firstClick = true;
        this.timer = 0;
        this.timerDisplay.textContent = '0';
        this.gameStatus.textContent = '';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.boardElement.innerHTML = '';
        this.createBoard();
    }

    placeMines() {
        const settings = this.difficultySettings[this.currentDifficulty];
        let minesPlaced = 0;
        
        while (minesPlaced < settings.mines) {
            const row = Math.floor(Math.random() * settings.rows);
            const col = Math.floor(Math.random() * settings.cols);
            
            if (!this.board[row][col].isMine) {
                this.board[row][col].isMine = true;
                minesPlaced++;
            }
        }
    }

    calculateNumbers() {
        const settings = this.difficultySettings[this.currentDifficulty];
        
        for (let i = 0; i < settings.rows; i++) {
            for (let j = 0; j < settings.cols; j++) {
                if (!this.board[i][j].isMine) {
                    let count = 0;
                    for (let di = -1; di <= 1; di++) {
                        for (let dj = -1; dj <= 1; dj++) {
                            const newRow = i + di;
                            const newCol = j + dj;
                            if (newRow >= 0 && newRow < settings.rows && 
                                newCol >= 0 && newCol < settings.cols && 
                                this.board[newRow][newCol].isMine) {
                                count++;
                            }
                        }
                    }
                    this.board[i][j].value = count;
                }
            }
        }
    }

    handleClick(row, col) {
        if (this.gameOver || this.board[row][col].isFlagged) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.startTimer();
            this.placeMines();
            this.calculateNumbers();
        }

        if (this.board[row][col].isMine) {
            this.gameOver = true;
            this.revealAllMines();
            this.gameStatus.textContent = '게임 오버!';
            clearInterval(this.timerInterval);
            return;
        }

        this.revealCell(row, col);
        this.checkWin();
    }

    handleRightClick(row, col) {
        if (this.gameOver || this.board[row][col].isRevealed) return;

        const cell = this.board[row][col];
        const settings = this.difficultySettings[this.currentDifficulty];

        if (!cell.isFlagged && this.flaggedCells < settings.mines) {
            cell.isFlagged = true;
            cell.element.classList.add('flagged');
            this.flaggedCells++;
            this.minesLeftDisplay.textContent = settings.mines - this.flaggedCells;
        } else if (cell.isFlagged) {
            cell.isFlagged = false;
            cell.element.classList.remove('flagged');
            this.flaggedCells--;
            this.minesLeftDisplay.textContent = settings.mines - this.flaggedCells;
        }
    }

    revealCell(row, col) {
        if (this.board[row][col].isRevealed || this.board[row][col].isFlagged) return;

        const cell = this.board[row][col];
        cell.isRevealed = true;
        cell.element.classList.add('revealed');

        if (cell.value > 0) {
            cell.element.textContent = cell.value;
            cell.element.dataset.value = cell.value;
        } else {
            const settings = this.difficultySettings[this.currentDifficulty];
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const newRow = row + di;
                    const newCol = col + dj;
                    if (newRow >= 0 && newRow < settings.rows && 
                        newCol >= 0 && newCol < settings.cols) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    revealAllMines() {
        const settings = this.difficultySettings[this.currentDifficulty];
        for (let i = 0; i < settings.rows; i++) {
            for (let j = 0; j < settings.cols; j++) {
                if (this.board[i][j].isMine) {
                    this.board[i][j].element.classList.add('mine');
                }
            }
        }
    }

    checkWin() {
        const settings = this.difficultySettings[this.currentDifficulty];
        let unrevealed = 0;
        
        for (let i = 0; i < settings.rows; i++) {
            for (let j = 0; j < settings.cols; j++) {
                if (!this.board[i][j].isRevealed && !this.board[i][j].isMine) {
                    unrevealed++;
                }
            }
        }
        
        if (unrevealed === 0) {
            this.gameOver = true;
            this.gameStatus.textContent = '축하합니다! 게임에서 승리하셨습니다!';
            clearInterval(this.timerInterval);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerDisplay.textContent = this.timer;
        }, 1000);
    }

    // 더블클릭 핸들러 추가
    handleDoubleClick(row, col) {
        if (this.gameOver || !this.board[row][col].isRevealed) return;

        const cell = this.board[row][col];
        if (cell.value === 0) return;

        const settings = this.difficultySettings[this.currentDifficulty];
        let flaggedCount = 0;
        let unrevealedCount = 0;

        // 주변 칸의 깃발 수와 열리지 않은 칸 수를 계산
        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                const newRow = row + di;
                const newCol = col + dj;
                if (newRow >= 0 && newRow < settings.rows && 
                    newCol >= 0 && newCol < settings.cols) {
                    const neighbor = this.board[newRow][newCol];
                    if (neighbor.isFlagged) flaggedCount++;
                    if (!neighbor.isRevealed && !neighbor.isFlagged) unrevealedCount++;
                }
            }
        }

        // 주변 깃발 수가 현재 칸의 숫자와 같으면 나머지 칸들을 자동으로 열기
        if (flaggedCount === cell.value && unrevealedCount > 0) {
            for (let di = -1; di <= 1; di++) {
                for (let dj = -1; dj <= 1; dj++) {
                    const newRow = row + di;
                    const newCol = col + dj;
                    if (newRow >= 0 && newRow < settings.rows && 
                        newCol >= 0 && newCol < settings.cols) {
                        const neighbor = this.board[newRow][newCol];
                        if (!neighbor.isRevealed && !neighbor.isFlagged) {
                            if (neighbor.isMine) {
                                this.gameOver = true;
                                this.revealAllMines();
                                this.gameStatus.textContent = '게임 오버!';
                                clearInterval(this.timerInterval);
                                return;
                            }
                            this.revealCell(newRow, newCol);
                        }
                    }
                }
            }
            this.checkWin();
        }
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
}); 