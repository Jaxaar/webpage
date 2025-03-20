import { Suits, Values} from "../hanabiConsts";
import { HanabiHistoryMessage, HanabiMove, HanabiMoveDiscard, HanabiMoveHint, HanabiMovePlay, convertObjectToHanabiMove } from "./HanabiMoveHistory";
import { Card, makeCard, castcardsToCards} from "./HanabiCard"

class LocalHanabiGame{

    constructor(numPlayers = 2, playerInputs, printToConsole = false){

        // There's gotta be a better way to prevent a ton of extra initializations just for type casting
        if(playerInputs?.length != numPlayers){
            // console.error("New Game???")
            return
        }
        // console.log(playerInputs)

        this.numPlayers = numPlayers
        this.gameInitialized = false
        this.gameEnded = false
        this.players = []
        this.deck = []
        this.history = []
        this.discard = []
        this.tableau = {}
        this.hints = -1
        this.hintsUsed = -1
        this.fuses = -1


        this.printToConsole = printToConsole

        this.initGame()

        // Side effects on the inputs...
        for(let i = 0; i < playerInputs.length; i++){
            this.players[i].name = (playerInputs?.[i]?.name || "P"+(i+1))
            playerInputs?.[i].assignID(i)
        }
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
        // this.players["P1"].activePlayer = true

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
        // const players = {}
        const players = []
        for(let i = 0; i < numPlayers; i++){
            // players["P" + (i+1)] = {"name": "P" + (i+1)}
            // players["P" + (i+1)].activePlayer = false
            players[i] = {
                id: i,
                activePlayer: (i===0),
            }
            let hand = []
            for(let j = 0; j < numPlayersToCardsDealt[numPlayers]; j++){
                hand.push(this.deck.pop())
            }
            // players["P" + (i+1)].hand = hand
            players[i].hand = hand
        }
        return players
    }

    shuffleDeck(deck) {
        return deck.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
    }



    // TODO: Make more efficient
    getGameDeepCopy () {
        const image = castcardsToCards(JSON.parse(JSON.stringify(this)))
        image.history = image.history.map((x) => convertObjectToHanabiMove(x))
        const imageObj = Object.assign(new LocalHanabiGame, image)
        return imageObj
    }

    // TODO Add removing your drawnCards from the gameImage
    getGameImage(playerID = null) {
        if(playerID === null){
            return this
        }
        const gameView = this.getGameDeepCopy()
        const blankHand = []
        for(let i = 1; i <= gameView.players[playerID].hand.length; i++){
            blankHand.push(new Card("Card", i))
        }
        gameView.players[playerID].hand = blankHand
        return gameView
    }

    // Index starts at 1 -> Cards in hand
    playCard(playerID, index){
        // if(this.printToConsole) console.log(playerID)
        if(!this.gameInitialized || this.gameEnded || /**(Object.keys(this.players).indexOf(playerID) == -1) ||**/ !(this.players?.[playerID].activePlayer) || this.players[playerID].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.players[playerID].hand[index-1]

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

        const drawnCard = this.drawCard()
        this.players[playerID].hand[index-1] = drawnCard

        const playObj = new HanabiMovePlay(playerID, index, card, drawnCard, successfulPlay, this.players[playerID].name)
        // const playStr = `${playerID}: Plays their ${index} card, a ${card.suit} ${card.value}. ${successfulPlay ? "Success!" : "Failed and discarded."}`
        if(this.printToConsole) console.info(playObj.toString())
        this.history.push(playObj)

        this.checkGameOver()
        this.advancePlayer()
        // return this.players[playerID].hand[index-1]
        return playObj
    }

    // Index starts at 1 -> Cards in hand
    discardCard(playerID, index){        
        if(!this.gameInitialized || this.gameEnded || /**(Object.keys(this.players).indexOf(playerID) == -1) ||**/ !(this.players?.[playerID].activePlayer) || this.players[playerID].hand.length < index || index < 1){
            return undefined
        }
        
        const card = this.players[playerID].hand[index-1]

        this.discard.push(card)

        if(this.hintsUsed > 0){
            this.hints = this.hints + 1
            this.hintsUsed = this.hintsUsed - 1
        }
        const drawnCard = this.drawCard()
        this.players[playerID].hand[index-1] = drawnCard

        const discObj = new HanabiMoveDiscard(playerID, index, card, drawnCard, this.players[playerID].name)
        // const discStr = `${player}: Discards their ${index} card, a ${card.suit} ${card.value}.`
        if(this.printToConsole) console.info(discObj.toString())
        this.history.push(discObj)

        this.checkGameOver()
        this.advancePlayer()
        // return this.players[playerID].hand[index-1]
        return discObj
    }

    handleHint(sourcePlayer, type, targetVal, targetPlayer){
        if(this.hints < 1){
            return undefined
        }
        if(!this.gameInitialized || this.gameEnded || /**(Object.keys(this.players).indexOf(sourcePlayer) == -1) ||**/ !(this.players?.[sourcePlayer].activePlayer) || !this.players?.[targetPlayer]?.hand){
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

        const hintObj = new HanabiMoveHint(sourcePlayer, targetPlayer, type, targetVal, indexes, this.players[sourcePlayer].name, this.players[targetPlayer].name)
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

        for(const p of this.players){
            if(p.activePlayer === true){
                p.activePlayer = false
                this.players[(p.id+1) % this.players.length].activePlayer = true
                return ((p.id+1) % this.players.length)
            }
        }

        // let arrPlayers = []
        // let activePlayer = ""
        // for(let [playerName, player] of Object.entries(this.players)){
        //     arrPlayers.push(playerName)
        //     if(player.activePlayer){
        //         activePlayer = playerName
        //         player.activePlayer = false
        //     }
        // }
        // arrPlayers = arrPlayers.sort((a,b) => {
        //     return parseInt(a.substring(1)) - parseInt(b.substring(1))
        // })

        // const inx = arrPlayers.indexOf(activePlayer)
        // if(inx+1 > arrPlayers.length - 1){
        //     this.players[arrPlayers[0]].activePlayer = true
        //     return this.players?.[arrPlayers[0]].name
        // } else{
        //     this.players[arrPlayers[inx+1]].activePlayer = true
        //     return this.players?.[arrPlayers[inx+1]].name
        // }
    }


    canPlayCard(card){
        return this.tableau?.[card.suit].isPrevCard(card)
    }

    drawCard(){
        return this.deck.pop()
    }

    getActivePlayer(){
        for(const player of this.players){
            if(player.activePlayer){
                return player.id
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
        const gameOverMessage = new HanabiHistoryMessage("TheGame", "Game Over! Score: " + this.scoreGame(), false)
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

export {LocalHanabiGame}
