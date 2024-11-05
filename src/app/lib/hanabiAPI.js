

function hanabiGame() {
    let game = {
        gameInitialized: false,
        players: {},
        deck: [],
    }

    class Card {
        constructor(suit, value) {
            this.suit = suit
            this.value = value
        }
        toString() {
            return this.suit + " " + this.value
        }
        isSameSuitAs(otherCard){
            return this.suit == otherCard.suit
        }
        isPrevCard(otherCard){
            return (this.value + 1) == otherCard.value
        }
    }

    const initGame = (numPlayers = 4) => {
        console.log("Initializing Game")
        // Build Deck & Playing Field
        const colors = ["Red", "Blue", "Green", "Yellow", "White"]
        const numberPairs = {1: 3, 2: 2, 3: 2, 4: 2, 5: 1}
        let deck = []
        let playingField = []
        for (const color of colors){
            playingField.push(new Card(color, 0))
            for (const number in numberPairs){
                for(let i = 0; i < numberPairs[number]; i++){
                    deck.push(new Card(color, number))
                }
            }
        }
        // console.log("Deck:")
        // console.log(deck)
        game.deck = deck
        game.playingField = playingField

        // Shuffle Deck
        shuffleDeck()

        // Init Markers
        game.hints = 8
        game.hintsUsed = 0
        game.fuses = 3

        const numPlayersToCardsDealt = {2:5, 3:5, 4:4, 5:4}

        // Deal
        const players = {}
        for(let i = 1; i <= numPlayers; i++){
            players["P" + i] = {"name": "P" + i}
            let hand = []
            for(let j = 0; j < numPlayersToCardsDealt[numPlayers]; j++){
                hand.push(game.deck.pop())
            }
            players["P" + i].hand = hand
        }
        game.players = players

        game.gameInitialized = true
    }

    const shuffleDeck = () => {
        game.deck = game.deck
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }




    return {
        initGame: initGame,
        getGame: game,
    };
}

export {hanabiGame}