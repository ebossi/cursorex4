class Blackjack {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.chips = 1000;
        this.currentBet = 0;
        this.gameStarted = false;

        // DOM 요소
        this.playerCards = document.getElementById('playerCards');
        this.dealerCards = document.getElementById('dealerCards');
        this.playerScore = document.getElementById('playerScore');
        this.dealerScore = document.getElementById('dealerScore');
        this.chipsDisplay = document.getElementById('chips');
        this.betDisplay = document.getElementById('bet');
        this.gameStatus = document.getElementById('gameStatus');
        
        // 버튼
        this.startButton = document.getElementById('startGame');
        this.hitButton = document.getElementById('hit');
        this.standButton = document.getElementById('stand');
        this.resetButton = document.getElementById('resetGame');
        this.betButtons = {
            bet10: document.getElementById('bet10'),
            bet50: document.getElementById('bet50'),
            bet100: document.getElementById('bet100')
        };

        this.init();
    }

    init() {
        this.createDeck();
        this.setupEventListeners();
        this.updateUI();
    }

    createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.hitButton.addEventListener('click', () => this.hit());
        this.standButton.addEventListener('click', () => this.stand());
        this.resetButton.addEventListener('click', () => this.resetGame());

        // 배팅 버튼 이벤트
        this.betButtons.bet10.addEventListener('click', () => this.placeBet(10));
        this.betButtons.bet50.addEventListener('click', () => this.placeBet(50));
        this.betButtons.bet100.addEventListener('click', () => this.placeBet(100));
        this.resetBetButton = document.getElementById('resetBet');
        this.resetBetButton.addEventListener('click', () => this.resetBet());
    }

    placeBet(amount) {
        if (this.gameStarted) return;
        if (this.chips >= amount) {
            this.currentBet += amount;
            this.chips -= amount;
            this.updateUI();
        }
    }

    startGame() {
        if (this.gameStarted || this.currentBet === 0) return;

        this.gameStarted = true;
        this.playerHand = [];
        this.dealerHand = [];
        this.gameStatus.textContent = ''; // 게임 상태 메시지 초기화
        
        // 카드 분배
        this.playerHand.push(this.dealCard());
        this.dealerHand.push(this.dealCard());
        this.playerHand.push(this.dealCard());
        this.dealerHand.push(this.dealCard());

        this.updateUI();
        this.checkBlackjack();
    }

    dealCard() {
        if (this.deck.length === 0) {
            this.createDeck();
        }
        return this.deck.pop();
    }

    hit() {
        if (!this.gameStarted) return;

        this.playerHand.push(this.dealCard());
        this.updateUI();

        if (this.calculateScore(this.playerHand) > 21) {
            this.endGame('bust');
        }
    }

    stand() {
        if (!this.gameStarted) return;

        this.dealerPlay();
    }

    dealerPlay() {
        while (this.calculateScore(this.dealerHand) < 17) {
            this.dealerHand.push(this.dealCard());
        }
        this.updateUI();
        this.endGame();
    }

    calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === 'A') {
                aces += 1;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }

        for (let i = 0; i < aces; i++) {
            if (score + 11 <= 21) {
                score += 11;
            } else {
                score += 1;
            }
        }

        return score;
    }

    checkBlackjack() {
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);

        if (playerScore === 21) {
            if (dealerScore === 21) {
                this.endGame('push');
            } else {
                this.endGame('blackjack');
            }
        }
    }

    endGame(result) {
        this.gameStarted = false;
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);

        let message = '';
        let chipsWon = 0;

        switch (result) {
            case 'bust':
                message = '버스트! 딜러의 승리입니다.';
                break;
            case 'blackjack':
                message = '블랙잭! 플레이어의 승리입니다!';
                chipsWon = this.currentBet * 2.5;
                break;
            case 'push':
                message = '푸시! 무승부입니다.';
                chipsWon = this.currentBet;
                break;
            default:
                if (playerScore > dealerScore || dealerScore > 21) {
                    message = '플레이어의 승리입니다!';
                    chipsWon = this.currentBet * 2;
                } else if (playerScore < dealerScore) {
                    message = '딜러의 승리입니다.';
                } else {
                    message = '무승부입니다.';
                    chipsWon = this.currentBet;
                }
        }

        this.chips += chipsWon;
        this.currentBet = 0;
        this.gameStatus.textContent = message;
        this.updateUI();
    }

    resetGame() {
        this.gameStarted = false;
        this.currentBet = 0;
        this.playerHand = [];
        this.dealerHand = [];
        this.chips = 1000;
        this.createDeck();
        this.updateUI();
    }

    resetBet() {
        if (this.gameStarted) return;
        this.chips += this.currentBet;
        this.currentBet = 0;
        this.updateUI();
    }

    updateUI() {
        // 플레이어 카드 표시
        this.playerCards.innerHTML = '';
        this.playerHand.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.playerCards.appendChild(cardElement);
        });

        // 딜러 카드 표시
        this.dealerCards.innerHTML = '';
        this.dealerHand.forEach((card, index) => {
            const cardElement = this.createCardElement(
                this.gameStarted && index === 0 ? { suit: 'back', value: 'back' } : card
            );
            this.dealerCards.appendChild(cardElement);
        });

        // 점수 업데이트
        this.playerScore.textContent = this.calculateScore(this.playerHand);
        this.dealerScore.textContent = this.gameStarted ? '?' : this.calculateScore(this.dealerHand);

        // 칩과 배팅 금액 업데이트
        this.chipsDisplay.textContent = this.chips;
        this.betDisplay.textContent = this.currentBet;

        // 버튼 상태 업데이트
        this.startButton.disabled = this.gameStarted || this.currentBet === 0;
        this.hitButton.disabled = !this.gameStarted;
        this.standButton.disabled = !this.gameStarted;
        
        // 배팅 버튼 상태 업데이트
        Object.values(this.betButtons).forEach(button => {
            button.disabled = this.gameStarted || this.chips < parseInt(button.textContent);
        });
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        if (card.suit === 'back') {
            cardElement.style.backgroundImage = 'url(card/Card-back.png)';
        } else {
            // 카드 값 변환 (예: '10' -> '10', 'J' -> 'J', 'Q' -> 'Q', 'K' -> 'K', 'A' -> 'A')
            const value = card.value;
            // 카드 문양 변환 (예: 'hearts' -> 'H', 'diamonds' -> 'D', 'clubs' -> 'C', 'spades' -> 'S')
            const suit = card.suit.charAt(0).toUpperCase();
            cardElement.style.backgroundImage = `url(card/${value}${suit}.png)`;
        }
        
        return cardElement;
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new Blackjack();
}); 