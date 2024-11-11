


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
        return (parseInt(this.value) + 1) == otherCard.value
    }
}

class HanabiGame{

    game;

    constructor(){
        this.game = {
            gameInitialized: false,
            gameEnded: false,
            players: {},
            deck: [],
            history: [],
            discard: [],
            tableau: {},
            hints: -1,
            hintsUsed: -1,
            fuses: -1,
        }
    }

    makeCard(card){
        return new Card(card.suit, card. value)
    }

    // TODO: Make more efficient
    getGameDeepCopy () {
        return this.castcardsToCards(JSON.parse(JSON.stringify(this.game)))
    }
    
    castcardsToCards(gameImage){
        for (let [pName, p] of Object.entries(gameImage.players)){
            let deck = []
            for(let c of p.hand){
                deck.push(this.makeCard(c))
            }
            p.hand = deck
        }
        const newTab = {}
        for(let [suit, card] of Object.entries(gameImage.tableau)){
            newTab[suit] = this.makeCard(card)
        }
        gameImage.tableau = newTab
        return gameImage
    }

    getGameState(player = null) {
        if(player === null){
            return this.game
        }
        const gameView = this.getGameDeepCopy()
        const blankHand = []
        for(let i = 1; i <= gameView.players[player].hand.length; i++){
            blankHand.push(new Card("Card", i))
        }
        gameView.players[player].hand = blankHand
        return gameView
        return this.game
    }

    //TODO: Fix HORRIBLE function design to remove side-effects & general mess
    initGame (numPlayers = 4) {
        this.game = {
            gameInitialized: false,
            gameEnded: false,
            players: {},
            deck: [],
            history: [],
            discard: [],
            tableau: {},
            hints: -1,
            hintsUsed: -1,
            fuses: -1,
        }

        console.log("Initializing Game")
        this.game.gameInitialized = false

        // Build Deck & Tableau

        const colors = ["Red", "Blue", "Green", "Yellow", "White"]
        const numberPairs = {1: 3, 2: 2, 3: 2, 4: 2, 5: 1}
        const decksObj = this.buildDecks(colors, numberPairs)
        // console.log("Deck:")
        // console.log(decksObj.deck)
        this.game.deck = decksObj.deck
        this.game.tableau = decksObj.tableau

        // Shuffle Deck
        this.shuffleDeck()

        // Init Markers
        this.game.hints = 8
        this.game.hintsUsed = 0
        this.game.fuses = 3

        // Deal
        this.deal(numPlayers)

        // Sets first player
        this.game.players["P1"].activePlayer = true

        // Sets Game Init Flag
        this.game.gameInitialized = true
    }

    buildDecks(suits, valueCounts) {
        let deck = []
        let tableau = {}
        for (const suit of suits){
            tableau[suit] = (new Card(suit, 0))
            for (const value in valueCounts){
                for(let i = 0; i < valueCounts[value]; i++){
                    deck.push(new Card(suit, value))
                }
            }
        }
        return {
            deck: deck,
            tableau: tableau
        }
    }

    deal(numPlayers){
        const numPlayersToCardsDealt = {2:5, 3:5, 4:4, 5:4}

        const players = {}
        for(let i = 1; i <= numPlayers; i++){
            players["P" + i] = {"name": "P" + i}
            players["P" + i].activePlayer = false
            let hand = []
            for(let j = 0; j < numPlayersToCardsDealt[numPlayers]; j++){
                hand.push(this.game.deck.pop())
            }
            players["P" + i].hand = hand
        }
        this.game.players = players
    }

    shuffleDeck() {
        this.game.deck = this.game.deck
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
    }

    // TODO: Make Smoother / faster
    advancePlayer(){
        let arrPlayers = []
        let activePlayer = ""
        for(let [playerName, player] of Object.entries(this.game.players)){
            arrPlayers.push(playerName)
            if(player.activePlayer){
                activePlayer = playerName
                player.activePlayer = false
            }
        }
        arrPlayers = arrPlayers.sort((a,b) => {
            return parseInt(a.substring(1)) - parseInt(b.substring(1))
        })

        const inx = arrPlayers.indexOf(activePlayer)
        if(inx+1 > arrPlayers.length - 1){
            this.game.players[arrPlayers[0]].activePlayer = true
            return this.game.players?.[arrPlayers[0]].name
        } else{
            this.game.players[arrPlayers[inx+1]].activePlayer = true
            return this.game.players?.[arrPlayers[inx+1]].name
        }
    }

    // Index starts at 1 -> Cards in hand
    playCard(player, index){
        // console.log(player)
        if(!this.game.gameInitialized || this.game.gameOver || (Object.keys(this.game?.players).indexOf(player) == -1) || !(this.game?.players?.[player].activePlayer) || this.game.players[player].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.game.players[player].hand[index-1]

        if(this.canPlayCard(card)){
            this.game.tableau[card.suit] = card

            if(card.value === 5 && this.game.hintsUsed > 0){
                this.game.hints = this.game.hints + 1
                this.game.hintsUsed = this.game.hintsUsed - 1
            }
        }
        else {
            this.game.discard.push(card)
            this.game.fuses = this.game.fuses - 1
        }

        this.game.players[player].hand[index-1] = this.drawCard()

        this.checkGameOver()
        this.advancePlayer()
        return this.game.players[player].hand[index-1]
    }

    // Index starts at 1 -> Cards in hand
    discardCard(player, index){
        // console.log(player)
        if(!this.game.gameInitialized || this.game.gameOver || (Object.keys(this.game?.players).indexOf(player) == -1) || !(this.game?.players?.[player].activePlayer) || this.game.players[player].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.game.players[player].hand[index-1]

        this.game.discard.push(card)

        if(this.game.hintsUsed > 0){
            this.game.hints = this.game.hints + 1
            this.game.hintsUsed = this.game.hintsUsed - 1
        }

        this.game.players[player].hand[index-1] = this.drawCard()

        this.checkGameOver()
        this.advancePlayer()
        return this.game.players[player].hand[index-1]
    }

    handleHint(turnPlayer, type, targetVal, targetPlayer){
        if(this.game.hints < 1){
            return undefined
        }

        if(!this.game.gameInitialized || this.game.gameOver || (Object.keys(this.game?.players).indexOf(turnPlayer) == -1) || !(this.game?.players?.[turnPlayer].activePlayer) || !this.game.players?.[targetPlayer]?.hand){
            return undefined
        }

        let indexes = []
        this.game?.players[targetPlayer]?.hand
        for(let i = 0; i < this.game.players[targetPlayer].hand.length; i++){
            const card = this.game.players[targetPlayer].hand[i]
            if(type == "suit" && card.suit == targetVal){
                indexes.push(i+1)
            }
            else if(type == "value" && card.value == targetVal){
                indexes.push(i+1)
            }
        }
        console.log(`"${targetPlayer}: The cards ${indexes} are ${targetVal}${type=="value" ? "'s": ""}"`)


        this.game.hints = this.game.hints - 1
        this.game.hintsUsed = this.game.hintsUsed + 1

        this.checkGameOver()
        this.advancePlayer()
    }

    canPlayCard(card){
        return this.game.tableau?.[card.suit].isPrevCard(card)
    }

    drawCard(){
        return this.game.deck.pop()
    }

    getActivePlayer(){
        for(let [playerName, player] of Object.entries(this.game.players)){
            if(player.activePlayer){
                return playerName
            }
        }
    }

    checkGameOver(){
        if(this.game.fuses < 1 || this.game.deck.length < 1){
            this.gameOver()
        }
        let all5s = true
        for(let [suit, card] of Object.entries(this.game.tableau)){
            if(card.value !== 5){
                all5s = false
            }
        }
        if(all5s){
            this.gameOver()
        }
    }

    gameOver(){

        console.log("Game Over")
        this.game.gameEnded = true
    }

    scoreGame(){
        let sum = 0;

        for(let [suit, card] of Object.entries(this.game.tableau)){
            sum += parseInt(card.value)
        }
        return sum
    }

    // return {
    //     initGame: initGame,
    //     getGameState: getGameState,
    //     playCard, playCard,
    //     getActivePlayer, getActivePlayer,
    // };
}

export {HanabiGame}