import { Card , castcardsToCards } from "./hanabiAPI";

class LocalHanabiGame{

    constructor(numPlayers = 4){
        this.numPlayers = numPlayers
        this.gameInitialized = false
        this.gameEnded = false
        this.players = {}
        this.deck = []
        this.history = []
        this.discard = []
        this.tableau = {}
        this.hints = -1
        this.hintsUsed = -1
        this.fuses = -1

        this.initGame()
    }


    //TODO: Fix general mess
    initGame () {

        console.log("Initializing Game")

        // Build Deck & Tableau
        const colors = ["Red", "Blue", "Green", "Yellow", "White"]
        const numberPairs = {1: 3, 2: 2, 3: 2, 4: 2, 5: 1}
        const decksObj = this.buildDecks(colors, numberPairs)
        // console.log("Deck:")
        // console.log(decksObj.deck)
        this.deck = decksObj.deck
        this.tableau = decksObj.tableau

        // Shuffle Deck
        this.deck = this.shuffleDeck(this.deck)

        // Init Markers
        this.hints = 8
        this.hintsUsed = 0
        this.fuses = 3

        // Deal & Init Players
        const numPlayersToCardsDealt = {2:5, 3:5, 4:4, 5:4}
        this.players = this.deal(this.numPlayers, numPlayersToCardsDealt)
        // Sets first player
        this.players["P1"].activePlayer = true

        // Sets Game Init Flag
        this.gameInitialized = true
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

    deal(numPlayers, numPlayersToCardsDealt){
        const players = {}
        for(let i = 1; i <= numPlayers; i++){
            players["P" + i] = {"name": "P" + i}
            players["P" + i].activePlayer = false
            let hand = []
            for(let j = 0; j < numPlayersToCardsDealt[numPlayers]; j++){
                hand.push(this.deck.pop())
            }
            players["P" + i].hand = hand
        }
        return players
    }

    shuffleDeck(deck) {
        return deck.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
    }

    makeCard(card){
        return new Card(card.suit, card.value)
    }

    // TODO: Make more efficient
    getGameDeepCopy () {
        return castcardsToCards(JSON.parse(JSON.stringify(this)))
    }

    getGameImage(player = null) {
        if(player === null){
            return this
        }
        const gameView = this.getGameDeepCopy()
        const blankHand = []
        for(let i = 1; i <= gameView.players[player].hand.length; i++){
            blankHand.push(new Card("Card", i))
        }
        gameView.players[player].hand = blankHand
        return gameView
    }

    // Index starts at 1 -> Cards in hand
    playCard(player, index){
        // console.log(player)
        if(!this.gameInitialized || this.gameEnded || (Object.keys(this.players).indexOf(player) == -1) || !(this.players?.[player].activePlayer) || this.players[player].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.players[player].hand[index-1]

        const successfulPlay = this.canPlayCard(card)
        if(successfulPlay){
            this.tableau[card.suit] = card

            if(card.value === 5 && this.hintsUsed > 0){
                this.hints = this.hints + 1
                this.hintsUsed = this.hintsUsed - 1
            }
        }
        else {
            this.discard.push(card)
            this.fuses = this.fuses - 1
        }

        this.players[player].hand[index-1] = this.drawCard()

        const playStr = `${player}: Plays their ${index} card, a ${card.suit} ${card.value}. ${successfulPlay ? "Success!" : "Failed and discarded."}`
        console.info(playStr)
        this.history.push(playStr)

        this.checkGameOver()
        this.advancePlayer()
        return this.players[player].hand[index-1]
    }

    // Index starts at 1 -> Cards in hand
    discardCard(player, index){        
        if(!this.gameInitialized || this.gameEnded || (Object.keys(this.players).indexOf(player) == -1) || !(this.players?.[player].activePlayer) || this.players[player].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.players[player].hand[index-1]

        this.discard.push(card)

        if(this.hintsUsed > 0){
            this.hints = this.hints + 1
            this.hintsUsed = this.hintsUsed - 1
        }

        this.players[player].hand[index-1] = this.drawCard()

        const discStr = `${player}: Discards their ${index} card, a ${card.suit} ${card.value}.`
        console.info(discStr)
        this.history.push(discStr)

        this.checkGameOver()
        this.advancePlayer()
        return this.players[player].hand[index-1]
    }

    handleHint(turnPlayer, type, targetVal, targetPlayer){
        if(this.hints < 1){
            return undefined
        }
        if(!this.gameInitialized || this.gameEnded || (Object.keys(this.players).indexOf(turnPlayer) == -1) || !(this.players?.[turnPlayer].activePlayer) || !this.players?.[targetPlayer]?.hand){
            return undefined
        }

        let indexes = []
        for(let i = 0; i < this.players[targetPlayer].hand.length; i++){
            const card = this.players[targetPlayer].hand[i]
            if(type == "suit" && card.suit == targetVal){
                indexes.push(i+1)
            }
            else if(type == "value" && card.value == targetVal){
                indexes.push(i+1)
            }
        }

        const hintStr = `${turnPlayer}: Hints - "${targetPlayer}: The cards ${indexes} are ${targetVal}${type=="value" ? "'s": ""}".`
        console.info(hintStr)
        this.history.push(hintStr)


        this.hints = this.hints - 1
        this.hintsUsed = this.hintsUsed + 1

        this.checkGameOver()
        this.advancePlayer()
        return hintStr
    }

    
    // TODO: Make Smoother / faster
    advancePlayer(){
        let arrPlayers = []
        let activePlayer = ""
        for(let [playerName, player] of Object.entries(this.players)){
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
            this.players[arrPlayers[0]].activePlayer = true
            return this.players?.[arrPlayers[0]].name
        } else{
            this.players[arrPlayers[inx+1]].activePlayer = true
            return this.players?.[arrPlayers[inx+1]].name
        }
    }


    canPlayCard(card){
        return this.tableau?.[card.suit].isPrevCard(card)
    }

    drawCard(){
        return this.deck.pop()
    }

    getActivePlayer(){
        for(let [playerName, player] of Object.entries(this.players)){
            if(player.activePlayer){
                return playerName
            }
        }
    }

    checkGameOver(){
        if(this.fuses < 1 || this.deck.length < 1){
            this.gameOver()
            return true
        }
        let all5s = true
        for(let [suit, card] of Object.entries(this.tableau)){
            if(card.value !== 5){
                all5s = false
            }
        }
        if(all5s){
            this.gameOver()
            return true
        }
        return false
    }

    gameOver(){
        const gameOverMessage = "Game Over! Score: " + this.scoreGame()
        console.info("Game Over! Score: " + this.scoreGame())
        this.history.push(gameOverMessage)
        this.gameEnded = true
        return true
    }

    scoreGame(){
        let sum = 0;

        for(let [suit, card] of Object.entries(this.tableau)){
            sum += parseInt(card.value)
        }
        return sum
    }

    toString(){
        return JSON.stringify(this)
    }
}

export {LocalHanabiGame}