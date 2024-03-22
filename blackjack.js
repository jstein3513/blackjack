document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const splitButton = document.getElementById('split');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    let playerHands = [[]], dealerCards = [], deck = [];
    let inGame = false, currentPlayerHandIndex = 0;

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
        playerHands = [[deck.pop(), deck.pop()]];
        inGame = true;
        currentPlayerHandIndex = 0;
        updateGameArea();
        checkForSplit();
    }

    function canSplit(cards) {
        return cards.length === 2 && cards[0].value === cards[1].value;
    }

    function hit() {
        if (!inGame) return;
        let currentHand = playerHands[currentPlayerHandIndex];
        currentHand.push(deck.pop());
        if (calculateScore(currentHand) > 21) {
            moveToNextHandOrEndGame();
        }
        updateGameArea();
    }

    function split() {
        if (canSplit(playerHands[currentPlayerHandIndex])) {
            let currentHand = playerHands[currentPlayerHandIndex];
            let cardToSplit = currentHand.pop();
            playerHands.push([cardToSplit, deck.pop()]);
            currentHand.push(deck.pop());
            updateGameArea();
            checkForSplit(); // Check if the new hand can be split again
        }
    }

    function moveToNextHandOrEndGame() {
        currentPlayerHandIndex++;
        if (currentPlayerHandIndex >= playerHands.length) {
            endPlayerTurn();
        } else {
            updateGameArea(); // Update to show the next hand
            checkForSplit(); // Check if the new hand can be split
        }
    }

    // Checks if the current hand can be split
    function checkForSplit() {
        let currentHand = playerHands[currentPlayerHandIndex];
        splitButton.style.display = canSplit(currentHand) ? 'inline' : 'none';
    }

    // Determines if a hand can be split
    function canSplit(hand) {
        return hand.length === 2 && hand[0].value === hand[1].value;
    }


function stand() {
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
        playerCardsDiv.innerHTML = '';
        playerHands.forEach((hand, index) => {
            let handDiv = document.createElement('div');
            handDiv.classList.add('hand');
            handDiv.innerHTML = hand.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');
            if (index === currentPlayerHandIndex) {
                let actionButtonsDiv = document.createElement('div');
                actionButtonsDiv.appendChild(hitButton);
                actionButtonsDiv.appendChild(standButton);
                actionButtonsDiv.appendChild(splitButton);
                handDiv.appendChild(actionButtonsDiv);
            }
            playerCardsDiv.appendChild(handDiv);
        });
    }

    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', () => moveToNextHandOrEndGame());
    splitButton.addEventListener('click', split);
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
