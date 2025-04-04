class Roulette {
    constructor() {
        console.log('Roulette constructor 시작');
        
        this.chips = 1000;
        this.currentBet = 0;
        this.selectedColor = null;
        this.isSpinning = false;

        // DOM 요소
        this.rouletteWheel = document.getElementById('rouletteWheel');
        this.chipsDisplay = document.getElementById('chips');
        this.betDisplay = document.getElementById('bet');
        this.gameStatus = document.getElementById('gameStatus');
        
        // 버튼
        this.spinButton = document.getElementById('spin');
        this.resetButton = document.getElementById('resetGame');
        this.resetBetButton = document.getElementById('resetBet');

        // 배팅 버튼 직접 가져오기
        this.bet10Button = document.getElementById('bet10');
        this.bet50Button = document.getElementById('bet50');
        this.bet100Button = document.getElementById('bet100');

        // 배팅 옵션
        this.betOptions = document.querySelectorAll('.bet-option');

        console.log('DOM 요소 확인:', {
            bet10: this.bet10Button,
            bet50: this.bet50Button,
            bet100: this.bet100Button,
            spinButton: this.spinButton,
            resetButton: this.resetButton
        });

        this.init();
    }

    init() {
        console.log('init 시작');
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        console.log('setupEventListeners 시작');
        
        if (this.spinButton) {
            this.spinButton.addEventListener('click', () => this.spin());
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.resetGame());
        }
        if (this.resetBetButton) {
            this.resetBetButton.addEventListener('click', () => this.resetBet());
        }

        // 배팅 버튼 이벤트
        if (this.bet10Button) {
            console.log('bet10Button 이벤트 리스너 설정');
            this.bet10Button.onclick = () => {
                console.log('10 칩 배팅 버튼 클릭됨');
                this.placeBet(10);
            };
        }
        if (this.bet50Button) {
            console.log('bet50Button 이벤트 리스너 설정');
            this.bet50Button.onclick = () => {
                console.log('50 칩 배팅 버튼 클릭됨');
                this.placeBet(50);
            };
        }
        if (this.bet100Button) {
            console.log('bet100Button 이벤트 리스너 설정');
            this.bet100Button.onclick = () => {
                console.log('100 칩 배팅 버튼 클릭됨');
                this.placeBet(100);
            };
        }

        // 배팅 옵션 이벤트
        this.betOptions.forEach(option => {
            option.addEventListener('click', () => this.selectColor(option));
        });

        console.log('이벤트 리스너 설정 완료');
    }

    placeBet(amount) {
        console.log('placeBet 함수 호출됨, amount:', amount);
        console.log('현재 상태:', {
            isSpinning: this.isSpinning,
            selectedColor: this.selectedColor,
            chips: this.chips,
            currentBet: this.currentBet
        });

        if (this.isSpinning) {
            console.log('룰렛이 회전 중입니다.');
            return;
        }
        if (!this.selectedColor) {
            console.log('색상을 선택해주세요.');
            this.gameStatus.textContent = '색상을 먼저 선택해주세요!';
            return;
        }
        if (this.chips >= amount) {
            this.currentBet += amount;
            this.chips -= amount;
            console.log('배팅 성공:', {
                newBet: this.currentBet,
                newChips: this.chips
            });
            this.updateUI();
        } else {
            console.log('칩이 부족합니다.');
            this.gameStatus.textContent = '보유 칩이 부족합니다!';
        }
    }

    selectColor(option) {
        if (this.isSpinning) return;
        this.betOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedColor = option.dataset.color;
        this.updateUI();
    }

    spin() {
        if (this.isSpinning || this.currentBet === 0 || !this.selectedColor) return;

        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.gameStatus.textContent = '';

        // 룰렛 회전
        const spins = 5 + Math.random() * 5; // 5-10회 회전
        const degrees = spins * 360 + Math.random() * 360; // 랜덤 각도
        this.rouletteWheel.style.transform = `rotate(${degrees}deg)`;

        // 결과 계산
        setTimeout(() => {
            const result = this.getResult(degrees);
            this.checkWin(result);
            this.isSpinning = false;
            this.spinButton.disabled = false;
            this.updateUI();
        }, 3000);
    }

    getResult(degrees) {
        const normalizedDegrees = degrees % 360;
        if (normalizedDegrees < 2.7) return 'green';
        const segment = Math.floor(normalizedDegrees / 2.7);
        return segment % 2 === 0 ? 'red' : 'black';
    }

    checkWin(result) {
        let message = '';
        let chipsWon = 0;

        if (result === this.selectedColor) {
            const multiplier = result === 'green' ? 14 : 2;
            chipsWon = this.currentBet * multiplier;
            message = `축하합니다! ${result}색에 당첨되었습니다! (${multiplier}배)`;
        } else {
            message = `아쉽습니다! ${result}색이 나왔습니다.`;
        }

        this.chips += chipsWon;
        this.currentBet = 0;
        this.selectedColor = null;
        this.betOptions.forEach(opt => opt.classList.remove('selected'));
        this.gameStatus.textContent = message;
    }

    resetBet() {
        console.log('resetBet 함수 호출됨');
        if (this.isSpinning) return;
        this.chips += this.currentBet;
        this.currentBet = 0;
        this.updateUI();
    }

    resetGame() {
        this.isSpinning = false;
        this.currentBet = 0;
        this.selectedColor = null;
        this.chips = 1000;
        this.rouletteWheel.style.transform = 'rotate(0deg)';
        this.betOptions.forEach(opt => opt.classList.remove('selected'));
        this.gameStatus.textContent = '';
        this.updateUI();
    }

    updateUI() {
        this.chipsDisplay.textContent = this.chips;
        this.betDisplay.textContent = this.currentBet;

        // 버튼 상태 업데이트
        this.spinButton.disabled = this.isSpinning || this.currentBet === 0 || !this.selectedColor;
        
        // 배팅 버튼 상태 업데이트
        if (this.bet10Button) {
           this.bet10Button.disabled = this.isSpinning|| this.chips < 10;
        }
        if (this.bet50Button) {
            this.bet50Button.disabled = this.isSpinning|| this.chips < 50;
        }
        if (this.bet100Button) {
            this.bet100Button.disabled = this.isSpinning || this.chips < 100;
        }
        if(this.resetBetButton){
            this.resetBetButton.disabled = this.isSpinning || this.currentBet === 0;
        }

        // 배팅 옵션 상태 업데이트
        this.betOptions.forEach(option => {
            option.style.cursor = this.isSpinning ? 'not-allowed' : 'pointer';
        });
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new Roulette();
}); 