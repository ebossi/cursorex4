class NumberGuessingGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.highScore = localStorage.getItem('highScore') || '-';
        this.gameOver = false;
        this.attemptsList = [];

        // DOM 요소
        this.guessInput = document.getElementById('guessInput');
        this.submitButton = document.getElementById('submitGuess');
        this.newGameButton = document.getElementById('newGame');
        this.resetGameButton = document.getElementById('resetGame');
        this.attemptsDisplay = document.getElementById('attempts');
        this.highScoreDisplay = document.getElementById('highScore');
        this.gameStatus = document.getElementById('gameStatus');
        this.attemptsListElement = document.getElementById('attemptsList');

        this.init();
    }

    init() {
        // 이벤트 리스너 설정
        this.submitButton.addEventListener('click', () => this.checkGuess());
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.resetGameButton.addEventListener('click', () => this.resetGame());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkGuess();
            }
        });

        // 게임 초기화
        this.startNewGame();
        this.updateHighScore();
    }

    startNewGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameOver = false;
        this.attemptsList = [];
        this.updateUI();
        this.guessInput.value = '';
        this.guessInput.focus();
        this.gameStatus.textContent = '';
        this.attemptsListElement.innerHTML = '';
    }

    resetGame() {
        this.highScore = '-';
        localStorage.removeItem('highScore');
        this.updateHighScore();
        this.startNewGame();
    }

    checkGuess() {
        if (this.gameOver) return;

        const guess = parseInt(this.guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.gameStatus.textContent = '1부터 100 사이의 숫자를 입력해주세요.';
            return;
        }

        this.attempts++;
        let result = '';
        let className = '';

        if (guess === this.targetNumber) {
            result = `축하합니다! ${this.attempts}번 만에 숫자를 맞추셨습니다!`;
            className = 'correct';
            this.gameOver = true;
            this.updateHighScore();
        } else if (guess > this.targetNumber) {
            result = '더 작은 숫자입니다.';
            className = 'high';
        } else {
            result = '더 큰 숫자입니다.';
            className = 'low';
        }

        this.attemptsList.push({ guess, result, className });
        this.updateUI();
        this.guessInput.value = '';
        this.guessInput.focus();
    }

    updateUI() {
        this.attemptsDisplay.textContent = this.attempts;
        this.gameStatus.textContent = this.gameOver ? 
            `게임 오버! 정답은 ${this.targetNumber}였습니다.` : '';
        
        this.attemptsListElement.innerHTML = this.attemptsList
            .slice()
            .reverse()
            .map(attempt => `<div class="attempt-item ${attempt.className}">
                ${attempt.guess} - ${attempt.result}
            </div>`)
            .join('');

        // 스크롤을 최상단으로 이동
        this.attemptsListElement.scrollTop = 0;
    }

    updateHighScore() {
        if (this.highScore === '-' || this.attempts < parseInt(this.highScore)) {
            this.highScore = this.attempts.toString();
            localStorage.setItem('highScore', this.highScore);
        }
        this.highScoreDisplay.textContent = this.highScore;
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new NumberGuessingGame();
}); 