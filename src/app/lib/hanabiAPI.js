import { LocalHanabiGame } from "./LocalHanabiGame"

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
    isAfterCard(otherCard){
        return (parseInt(this.value)) > otherCard.value
    }
    equals(otherCard){
        return this.suit === otherCard?.suit && this.suit === otherCard?.suit
    }

}

function castcardsToCards(gameImage){
    for (let [pName, p] of Object.entries(gameImage.players)){
        let deck = []
        for(let c of p.hand){
            deck.push(makeCard(c))
        }
        p.hand = deck
    }
    const newTab = {}
    for(let [suit, card] of Object.entries(gameImage.tableau)){
        newTab[suit] = makeCard(card)
    }
    gameImage.tableau = newTab

    const deck = []
    for(let c of gameImage.deck){
        deck.push(makeCard(c))
    }
    gameImage.deck = deck
    
    return gameImage
}

function makeCard(card){
    return new Card(card.suit, card. value)
}

function makeGameFromJSON(game){
    return Object.assign(new LocalHanabiGame, castcardsToCards(JSON.parse(game)))
}

class HanabiAPI{

    constructor(){
        this.game = undefined
    }

    startGame(local, playerCount, printToConsole){
        if(local){
            this.game = new LocalHanabiGame(playerCount, printToConsole)
        }
        else{
            console.log("Failed. Not Local??")
        }
    }

    getGameImage(player = null) {
        if(player === null){
            return this.game.getGameImage()
        }
        return this.game.getGameImage(player)
    }

    // advancePlayer(){
    //     this.game.advancePlayer()
    // }

    // Index starts at 1 -> Cards in hand
    playCard(player, index){
        // console.log(player)
        return this.game.playCard(player, index)
    }

    // Index starts at 1 -> Cards in hand
    discardCard(player, index){
        
        return this.game.discardCard(player, index)
    }

    handleHint(turnPlayer, type, targetVal, targetPlayer){
        return this.game.handleHint(turnPlayer, type, targetVal, targetPlayer)
    }

    getActivePlayer(){
        return this.game.getActivePlayer()
    }

    checkGameOver(){
        return this.game.checkGameOver()
    }

    scoreGame(){
        return this.game.scoreGame()
    }
}

function runSingleGame(arrOfPlayers, showINFO){

    const game = new HanabiAPI()
    game.startGame(true, arrOfPlayers.length, showINFO)
    while(!game.checkGameOver()){
        const curPlayerStr = game.getActivePlayer()
        const curPlayer = arrOfPlayers[parseInt(curPlayerStr.substring(1)) - 1]
        console.log(curPlayerStr)
        const rawAction = curPlayer.getAction(game.getGameImage(curPlayerStr))
        if(rawAction == null){
            console.log("nope")
            console.log(game)
            return -1
        }


        const action = rawAction.split("-")

        // Format: Hint-P#-Type-value  - where p# is the target player Id, Type is Suit or Value, and value is the actual value (color/number) of the clue
        if(action[0] === "Hint" && action.length === 4){
            game.handleHint(curPlayerStr, action[2], action[3], action[1])
        }
        // Format: Play-#: where # is the index and a num 1-handLimit
        else if(action[0] ==="Play" && action.length === 2){
            game.playCard(curPlayerStr, action[1])
        }
        // Format: Discard-#: where # is the index and a num 1-handLimit
        else if(action[0] === "Discard" && action.length === 2){
            game.discardCard(curPlayerStr, action[1])
        }
        else{
            console.log("Uh Oh... Something broke")
            console.log(game)
            console.log(curPlayerStr)
            console.log(action)
            return -1
        }
        console.log(game.game.history)
    }
    return game.scoreGame()
}



export {HanabiAPI, Card, castcardsToCards, makeGameFromJSON, runSingleGame}