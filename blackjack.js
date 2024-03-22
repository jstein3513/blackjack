document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    const dealerActionDiv = document.createElement('div');
    dealerActionDiv.setAttribute('id', 'dealerAction');
    const splitButton = document.getElementById('split');
    let splitCards = []; // To store split hand cards
    let isSplit = false; // Flag to check if a split occurred
    let activeHand = 'player'; // To track which hand is currently in play ('player' or 'split')


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
            [deck[i], deck[j]] = [deck[j], deck[i]];
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
        dealerActionDiv.textContent = '';
        gameStatusDiv.textContent = '';
        splitButton.style.display = canSplit(playerCards) ? 'inline' : 'none'; // Show split button if possible

    }

    function canSplit(cards) {
        return cards.length === 2 && cards[0].value === cards[1].value;
    }

    function hit() {
        if (!inGame || playerTurnOver) return;
        let targetCards = activeHand === 'player' ? playerCards : splitCards;
        targetCards.push(deck.pop());
        const score = calculateScore(targetCards);
        if (score > 21) {
            if (activeHand === 'split') {
                playerTurnOver = true; // End turn if on split hand
                stand();
            } else if (isSplit) {
                activeHand = 'split'; // Move to split hand if player busts
                updateGameArea();
            } else {
                playerTurnOver = true; // Player busts without a split hand
                setTimeout(stand, 1000);
            }
        } else {
            updateGameArea();
        }
    }    function stand() {
        if (!inGame || playerTurnOver) return;
        playerTurnOver = true; // Player ends turn
        dealerPlay(); // Process dealer's turn
    }

    async function dealerPlay() {
        let actionTaken = false;
        let dealerScore = calculateScore(dealerCards);
        while (dealerScore < 17) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between actions for dramatic effect
            dealerCards.push(deck.pop());
            dealerScore = calculateScore(dealerCards);
            updateGameArea(); // Update UI with each new card
            actionTaken = true;
        }
        
        dealerActionDiv.textContent = actionTaken ? 'Dealer Hits' : 'Dealer Stands';
        endGame();
    }

    function endGame() {

        if (activeHand === 'player' && isSplit) {
            activeHand = 'split';
            playerTurnOver = false; // Allow playing the split hand
            updateGameArea();
            return; // Exit without setting inGame to false to allow playing the split hand
        }

        inGame = false;
        const playerScore = calculateScore(playerCards);
        const dealerScore = calculateScore(dealerCards);
        if (playerScore > 21) {
            gameStatusDiv.textContent += ' You bust! Dealer wins.';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            gameStatusDiv.textContent += ' You win!';
        } else if (dealerScore > playerScore) {
            gameStatusDiv.textContent += ' Dealer wins.';
        } else {
            gameStatusDiv.textContent += ' Draw!';
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

        if (isSplit) {
            playerCardsDiv.innerHTML += ' (Split Hand)'; // Indicate the split hand
            playerCardsDiv.innerHTML += splitCards.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
        }

        splitButton.style.display = activeHand === 'player' && canSplit(playerCards) ? 'inline' : 'none';
    splitButton.addEventListener('click', () => {
        if (canSplit(playerCards)) {
            isSplit = true;
            splitCards.push(playerCards.pop()); // Move one card to the split hand
            playerCards.push(deck.pop()); // Draw new cards for each hand
            splitCards.push(deck.pop());
            updateGameArea();
        }
    });

        // Append the dealer's action text to the dealer's area
        dealerCardsDiv.appendChild(dealerActionDiv);

        // Display the game area and scores only if the game has started or if it's the player's turn
        gameArea.style.display = inGame || playerTurnOver ? 'block' : 'none';
        if (!inGame && !playerTurnOver) {
            // Update to reflect bust condition more accurately
            if (calculateScore(playerCards) > 21) {
                gameStatusDiv.textContent = `Bust! Your score: ${calculateScore(playerCards)}`;
            } else {
                // Show final scores when the game ends
                gameStatusDiv.textContent += ` Your score: ${calculateScore(playerCards)}, Dealer's score: ${calculateScore(dealerCards)}`;
            }
        } else if (inGame) {
            // Show only the player's score during the game
            gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
        }
    }
    
    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});
