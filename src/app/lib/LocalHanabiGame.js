import { Card , castcardsToCards, makeGameFromJSON } from "./hanabiAPI";
import { Suits, Values} from "./hanabiConsts";

class LocalHanabiGame{

    constructor(numPlayers = 4, printToConsole = false){
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


        this.printToConsole = printToConsole

        this.initGame()
    }


    //TODO: Fix general mess
    initGame () {

        if(this.printToConsole) console.log("Initializing Game")

        // Build Deck & Tableau
        const decksObj = this.buildDecks(Suits, Values)
        // if(this.printToConsole) console.log("Deck:")
        // if(this.printToConsole) console.log(decksObj.deck)
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
        const image = makeGameFromJSON(JSON.stringify(this))
        image.history = image.history.map((x) => convertObjectToHanabiMove(x))
        return image
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
        // if(this.printToConsole) console.log(player)
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

        const playObj = new HanabiMovePlay(player, index, card, successfulPlay)
        // const playStr = `${player}: Plays their ${index} card, a ${card.suit} ${card.value}. ${successfulPlay ? "Success!" : "Failed and discarded."}`
        if(this.printToConsole) console.info(playObj.toString())
        this.history.push(playObj)

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

        const discObj = new HanabiMoveDiscard(player, index, card)
        // const discStr = `${player}: Discards their ${index} card, a ${card.suit} ${card.value}.`
        if(this.printToConsole) console.info(discObj.toString())
        this.history.push(discObj)

        this.checkGameOver()
        this.advancePlayer()
        return this.players[player].hand[index-1]
    }

    handleHint(sourcePlayer, type, targetVal, targetPlayer){
        if(this.hints < 1){
            return undefined
        }
        if(!this.gameInitialized || this.gameEnded || (Object.keys(this.players).indexOf(sourcePlayer) == -1) || !(this.players?.[sourcePlayer].activePlayer) || !this.players?.[targetPlayer]?.hand){
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

        const hintObj = new HanabiMoveHint(sourcePlayer, targetPlayer, type, targetVal, indexes)
        // const hintStr = `${sourcePlayer}: Hints "${targetPlayer} - The cards ${indexes} are ${targetVal}${type=="value" ? "'s": ""}".`
        if(this.printToConsole) console.info(hintObj.toString())
        this.history.push(hintObj)


        this.hints = this.hints - 1
        this.hintsUsed = this.hintsUsed + 1

        this.checkGameOver()
        this.advancePlayer()
        return hintObj
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
        if(this.printToConsole) console.info("Game Over! Score: " + this.scoreGame())
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

function convertObjectToHanabiMove(x){
    x.card = Object.assign(new Card, x.card)
    if(x.typeOfMove === "hint"){
        return Object.assign(new HanabiMoveHint, x)
    }
    else if(x.typeOfMove === "discard"){
        return Object.assign(new HanabiMoveDiscard, x)
    }
    else if(x.typeOfMove === "play"){
        return Object.assign(new HanabiMovePlay, x)
    }
}

/**
 * @abstract
 */
class HanabiMove{
    constructor(typeOfMove, sourcePlayer){
        this.typeOfMove = typeOfMove
        this.sourcePlayer = sourcePlayer
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s`
    }
}

class HanabiMovePlay extends HanabiMove{
    constructor(sourcePlayer, targetCardIndex, card, successfulPlay){
        super("play", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.successfulPlay = successfulPlay
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s their ${this.targetCardIndex}${numSuffix[this.targetCardIndex]} card, a ${this.card.toString()}. ${this.successfulPlay ? "Success!" : "Failed and discarded."}`
    }
}

class HanabiMoveDiscard extends HanabiMove{
    constructor(sourcePlayer, targetCardIndex, card){
        super("discard", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s their ${this.targetCardIndex}${numSuffix[this.targetCardIndex]} card, a ${this.card.toString()}.`
    }
}

class HanabiMoveHint extends HanabiMove{
    constructor(sourcePlayer, targetPlayer, hintType, hintValue, targetCardIndices){
        super("hint", sourcePlayer)
        this.targetPlayer = targetPlayer
        this.hintType = hintType
        this.hintValue = hintValue
        this.targetCardIndices = targetCardIndices
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s - "${this.targetPlayer}: The card${this.targetCardIndices.length > 1 ? "s" : ""} ${this.targetCardIndices} ${this.targetCardIndices.length > 1 ? "are" : "is a"} ${this.hintValue} ${this.targetCardIndices.length > 1 ? "s" : ""}`
    }
}

const numSuffix = {
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th"
}


// :
// "P1: Hints - "P2: The cards 2 are 1's"."
// 1
// :
// "P2: Plays their 2 card, a Blue 1. Success!"
// 2
// :
// "P1: Hints "P2 - The cards 2 are 1's"."
// 3
// :
// "P2: Plays their 2 card, a Yellow 1. Success!"
// 4
// :
// "P1: Plays their 3 card, a Blue 5. Failed and discarded."
// 5
// :
// "P2: Discards their 2 card, a Red 4."
// 6
// :
// "P1: Hints "P2 - The cards 1,2 are Yellow"."
// 7
// :
// "P2: Hints "P1 - The cards 2,4 are 2's"."
// 8
// :
// "P1: Discards their 4 card, a Red 2."
// 9
// :
// "P2: Hints - "P1: The cards 2,4 are 2's"."
// 10
// :
// "P1: Plays their 4 card, a Blue 2. Success!"
// 11
// :
// "P2: Plays their 3 card, a Blue 3. Success!"
// 12
// :
// "P1: Hints - "P2: The cards 1,2 are Yellow"."
// 13
// :
// "P2: Discards their 1 card, a Yellow 3."

export {LocalHanabiGame, HanabiMove}
