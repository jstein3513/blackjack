document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    const gameArea = document.getElementById('gameArea'); // Ensure you have this line if it's missing

    let playerCards = [], dealerCards = [], deck = [];
    let inGame = false;

    function createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({value, suit});
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
        }
    }

    function startGame() {
        deck = createDeck();
        shuffleDeck(deck);
        dealerCards = [deck.pop(), deck.pop()];
        playerCards = [deck.pop(), deck.pop()];
        inGame = true;
        updateGameArea();
    }

    function hit() {
        if (!inGame) return;
        playerCards.push(deck.pop());
        if (calculateScore(playerCards) > 21) {
            stand(); // Invoke stand if player busts to let dealer play
        }
        updateGameArea();
    }

    function stand() {
        if (!inGame) return;
        inGame = false; // Update game state to reflect end of player's turn
        
        // Dealer's turn: dealer must hit if score is below 17
        let dealerScore = calculateScore(dealerCards);
        while (dealerScore < 17) {
            dealerCards.push(deck.pop());
            dealerScore = calculateScore(dealerCards);
        }
        
        // After dealer's turn, finalize and display the game outcome
        endGame();
    }

    function endGame() {
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        let resultMessage;
        
        if (playerScore > 21) {
            resultMessage = 'You bust! Dealer wins.';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            resultMessage = 'You win!';
        } else if (dealerScore > playerScore) {
            resultMessage = 'Dealer wins.';
        } else {
            resultMessage = 'It\'s a draw!';
        }
        
        gameStatusDiv.textContent = resultMessage;
        updateGameArea();
    }

    function calculateScore(cards) {
        let score = 0;
        let aceCount = 0;
        for (let card of cards) {
            if (card.value === 'A') {
                score += 11;
                aceCount += 1;
            } else if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }

        return score;
    }

    function updateGameArea() {
        gameArea.style.display = inGame ? 'block' : 'none';
        dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        if (!inGame) {
            gameStatusDiv.textContent += ` Dealer score: ${calculateScore(dealerCards)}`;
        } else {
            gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
        }
    }
    // Finish setting up event listeners
    startGameButton.addEventListener('click', () => {
        startGame(); // Reset and start a new game
    });

    hitButton.addEventListener('click', () => {
        hit(); // Player chooses to take another card
    });

    standButton.addEventListener('click', () => {
        stand(); // Player chooses to end their turn
    });
});

   
