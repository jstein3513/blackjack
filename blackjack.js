document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const dealerCardsDiv = document.getElementById('dealerCards');
    const playerCardsDiv = document.getElementById('playerCards');
    const gameStatusDiv = document.getElementById('gameStatus');
    const gameArea = document.getElementById('gameArea');
    const dealerActionDiv = document.createElement('div');
    dealerActionDiv.setAttribute('id', 'dealerAction');
    displayCardBacks();
   
    let playerCards = [], dealerCards = [], deck = [];
    let inGame = false, playerTurnOver = false;
let wins = 0;
let losses = 0;
   
   function displayCardBacks() {
    // Clear any existing cards
    dealerCardsDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';

    // Create two card backs for the dealer and two for the player
    for (let i = 0; i < 2; i++) {
        dealerCardsDiv.appendChild(createCardBack());
        playerCardsDiv.appendChild(createCardBack());
    }
}

function createCardBack() {
    const cardBackDiv = document.createElement('div');
    cardBackDiv.classList.add('card', 'back');
    cardBackDiv.textContent = '?'; // Or you could use an image or any design you prefer for the back
    return cardBackDiv;
}
   

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
    inGame = true; // Ensure game state is set to indicate that a game is currently in progress
    playerTurnOver = false; // Ensure player turn is not marked as over at the start of the game
    document.getElementById('dealerHeader').classList.remove('hidden');
    document.getElementById('playerHeader').classList.remove('hidden');
    updateGameArea();
    dealerActionDiv.textContent = '';
    gameStatusDiv.textContent = '';

    // Ensure the "Hit" and "Stand" buttons are enabled at the start of the game
    hitButton.disabled = false;
    standButton.disabled = false;
}


function hit() {
    if (!inGame || playerTurnOver) return;
    playerCards.push(deck.pop());
    const playerScore = calculateScore(playerCards);
    updateGameArea(); // Update UI to show the latest card

    if (playerScore > 21) {
        gameStatusDiv.textContent = 'Bust!'; // Update game status immediately
       losses++;
      document.getElementById('scoreboard').textContent = `Wins: ${wins} | Losses: ${losses}`;
        playerTurnOver = true; // Player busts
        setTimeout(() => {
            stand(); // Proceed with the end of the player's turn after a short delay
        }, 1000); // Delay before ending the player's turn
    }
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
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 1 second between actions for dramatic effect
            dealerCards.push(deck.pop());
            dealerScore = calculateScore(dealerCards);
            updateGameArea(); // Update UI with each new card
            actionTaken = true;
        }
        
        //dealerActionDiv.textContent = actionTaken ? 'Dealer Hits' : 'Dealer Stands';
        endGame();
    }

function endGame() {
    inGame = false;
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    // Determine outcome and update counts
    if (playerScore > 21) {
        gameStatusDiv.textContent += ' You bust! Dealer wins.';
        losses++;
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        gameStatusDiv.textContent += ' You win!';
        wins++;
    } else if (dealerScore > playerScore) {
        gameStatusDiv.textContent += ' Dealer wins.';
        losses++;
    } else {
        gameStatusDiv.textContent += ' Draw!';
        // Draws do not count towards wins or losses
    }

    // Update the scoreboard
    document.getElementById('scoreboard').textContent = `Wins: ${wins} | Losses: ${losses}`;

        // Reveal dealer's hidden card
        if (dealerCards.length > 0) {
            const firstDealerCardDiv = dealerCardsDiv.firstChild;
            firstDealerCardDiv.classList.remove('back');
            firstDealerCardDiv.textContent = ''; // Clear the '?'
            const firstCard = dealerCards[0];
            firstDealerCardDiv.appendChild(createCardElement(firstCard, false));
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
        dealerCardsDiv.innerHTML = '';
        playerCardsDiv.innerHTML = '';

        dealerCards.forEach((card, index) => {
            dealerCardsDiv.appendChild(createCardElement(card, index === 0 && inGame));
        });

        playerCards.forEach(card => {
            playerCardsDiv.appendChild(createCardElement(card, false));
        });

        // Append the dealer's action text to the dealer's area
        dealerCardsDiv.appendChild(dealerActionDiv);

        // Display the game area and scores only if the game has started or if it's the player's turn
        gameArea.style.display = inGame || playerTurnOver ? 'block' : 'none';
        if (!inGame && !playerTurnOver) {
            if (calculateScore(playerCards) > 21) {
                //gameStatusDiv.textContent = `Bust! Your score: ${calculateScore(playerCards)}`;
            } else {
                //gameStatusDiv.textContent += ` Your score: ${calculateScore(playerCards)}, Dealer's score: ${calculateScore(dealerCards)}`;
            }
} else if (inGame) {
            // Show only the player's score during the game
            //gameStatusDiv.textContent = `Your score: ${calculateScore(playerCards)}`;
        }
    }

    function createCardElement(card, isHidden) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', card.suit.toLowerCase());
        if (!isHidden) {
            const suitSymbol = getSuitSymbol(card.suit);
            cardDiv.innerHTML = `<span class="suit">${suitSymbol}</span><span class="value">${card.value}</span>`;
        } else {
            // If the card should be hidden, add the 'back' class and a placeholder
            cardDiv.classList.add('back');
            cardDiv.textContent = '?';
        }
        return cardDiv;
    }

    function getSuitSymbol(suit) {
        switch (suit) {
            case 'Hearts': return '♥';
            case 'Diamonds': return '♦';
            case 'Clubs': return '♣';
            case 'Spades': return '♠';
            default: return '';
        }
    }
    
    startGameButton.addEventListener('click', startGame);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
});
            // Show only the player's score during the
