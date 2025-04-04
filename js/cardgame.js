class CardGame {
    constructor() {
        this.cards = [];
        this.selectedCards = [];
        this.score = 0;
        this.isGameStarted = false;
        this.cardContainer = document.getElementById('cardContainer');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('startGame');
        this.resetButton = document.getElementById('resetGame');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    startGame() {
        if (this.isGameStarted) return;
        this.isGameStarted = true;
        this.score = 0;
        this.updateScore();
        this.initializeCards();
        this.shuffleCards();
        this.displayCards();
    }

    resetGame() {
        this.isGameStarted = false;
        this.cards = [];
        this.selectedCards = [];
        this.score = 0;
        this.updateScore();
        this.cardContainer.innerHTML = '';
    }

    initializeCards() {
        const suits = ['H', 'D', 'C', 'S'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        // 8개의 카드만 사용 (4쌍)
        const selectedValues = values.slice(0, 10);
        
        this.cards = [];
        for (let suit of suits.slice(1, 3)) { // 2개의 문양만 사용
            for (let value of selectedValues) {
                this.cards.push({
                    suit,
                    value,
                    image: `card/${value}${suit}.png`,
                    isFlipped: false
                });
            }
        }
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    displayCards() {
        this.cardContainer.innerHTML = '';
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('img');
            cardElement.className = 'card';
            cardElement.src = 'card/Card-back.png';
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', () => this.flipCard(index));
            this.cardContainer.appendChild(cardElement);
        });
    }

    flipCard(index) {
        if (!this.isGameStarted || this.cards[index].isFlipped || this.selectedCards.length >= 2) return;

        const card = this.cards[index];
        card.isFlipped = true;
        this.selectedCards.push(index);

        const cardElement = this.cardContainer.children[index];
        cardElement.src = card.image;

        if (this.selectedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [index1, index2] = this.selectedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];

        if (card1.value === card2.value) {
            this.score += 10;
            this.updateScore();
            this.selectedCards = [];
            
            if (this.cards.every(card => card.isFlipped)) {
                setTimeout(() => {
                    alert(`게임 종료! 최종 점수: ${this.score}`);
                    this.resetGame();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.cardContainer.children[index1].src = 'card/Card-back.png';
                this.cardContainer.children[index2].src = 'card/Card-back.png';
                this.selectedCards = [];
            }, 1000);
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }
}

// 게임 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const game = new CardGame();
}); 