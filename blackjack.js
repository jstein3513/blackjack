document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    const gameArea = document.getElementById('gameArea'); // Make sure this is correctly referenced
    const dealerActionDiv = document.createElement('div');
    dealerActionDiv.setAttribute('id', 'dealerAction'); // Set an ID for styling or reference

    let playerCards = [], dealerCards = [], deck = [];
    let inGame = false, playerTurnOver = false;

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
        playerTurnOver = false;
        updateGameArea();
        dealerActionDiv.textContent = ''; // Reset dealer actions
        gameStatusDiv.textContent = ''; // Clear previous game status
    }

    function hit() {
        if (!inGame || playerTurnOver) return;
        playerCards.push(deck.pop());
        let playerScore = calculateScore(playerCards);
        updateGameArea();
        if (playerScore > 21) {
            gameStatusDiv.textContent = `Bust! Your score: ${playerScore}`; // Show 'Bust' next to the player's score
            playerTurnOver = true; // Player busts
            setTimeout(() => {
                dealerPlay(); // Delay the dealer's turn to simulate real play
            }, 1000); // Wait 1 second before starting dealer's turn
        }
    }

    function stand() {
        if (!inGame || playerTurnOver) return;
        playerTurnOver = true; // Player ends turn
        dealerPlay(); // Process dealer's turn
    }

    function dealerPlay() {
        let actionTaken = false;
        while (calculateScore(dealerCards) < 17) {
            dealerCards.push(deck.pop());
            actionTaken = true; // Indicates dealer took a hit
        }

              function dealerDrawCard() {
            if (calculateScore(dealerCards) < 17) {
                dealerCards.push(deck.pop());
                updateDealerAreaWithDelay(); // Update dealer's hand with a delay
            } else {
                endGame(); // End the game if dealer decides to stand
            }
        }

        function updateDealerAreaWithDelay() {
            updateGameArea(); // Update the game area with current state
            dealerActionDiv.textContent = 'Dealer Hits'; // Update action text
            if (calculateScore(dealerCards) >= 17) {
                dealerActionDiv.textContent = 'Dealer Stands';
                setTimeout(endGame, 1000); // Wait before showing the game's outcome
            } else {
                setTimeout(dealerDrawCard, 1000); // Continue drawing cards with a delay
            }
        }

        dealerDrawCard(); // Start dealer's card drawing process
    }
        
        dealerActionDiv.textContent = actionTaken ? 'Dealer Hits' : 'Dealer Stands';
        endGame();
    }

    function endGame() {
        inGame = false;
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        if (playerScore > 21) {
            gameStatusDiv.textContent = 'You bust! Dealer wins.';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            gameStatusDiv.textContent = 'You win!';
        } else if (dealerScore > playerScore) {
            gameStatusDiv.textContent = 'Dealer wins.';
        } else {
            gameStatusDiv.textContent = 'Draw!';
        }
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
        dealerCardsDiv.innerHTML = dealerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        playerCardsDiv.innerHTML = playerCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');

        // Append the dealer's action text to the dealer's area
        dealerCardsDiv.appendChild(dealerActionDiv);

        // Display the game area and scores only if the game has started or if it's the player's turn
        gameArea.style.display = inGame || playerTurnOver ? 'block' : 'none';
        if (!inGame) {
            // Show final scores when the game ends
            gameStatusDiv.textContent += ` Your score: ${calculateScore(playerCards)}, Dealer's score: ${calculateScore(dealerCards)}`;
        } else {
            // Show only the player's score during the game
            gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
        }
    }

    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});

