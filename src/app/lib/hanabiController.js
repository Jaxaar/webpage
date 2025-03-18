import { LocalHanabiGame } from "./LocalHanabiGame"




/**
 * @abstract
 */

class HanabiController {

    constructor(game, players){
        this.game = game
        this.arrOfPlayers = players
        for(const p of this.arrOfPlayers){
            p.init(this)
        }
    }

    getThisPlayer(){
        return undefined
    }

    getActivePlayer(){
        return this.game.getActivePlayer()
    }

    getGameImage(player = this.getThisPlayer()) {
        return this.game.getGameImage(player)
    }

    // Index starts at 1 -> Cards in hand
    playCard(player, index){
        return this.game.playCard(player, index)
    }

    // Index starts at 1 -> Cards in hand
    discardCard(player, index){
        return this.game.discardCard(player, index)
    }

    handleHint(turnPlayer, type, targetVal, targetPlayer){
        return this.game.handleHint(turnPlayer, type, targetVal, targetPlayer)
    }

    checkGameOver(){
        return this.game.checkGameOver()
    }

    scoreGame(){
        return this.game.scoreGame()
    }

    useSpoilerWall(){
        return false
    }
}

class HanabiControllerLocalHotseat extends HanabiController{

    constructor(playerCount, players, spoilerWall, printToConsole = false){
        super(new LocalHanabiGame(playerCount, players.map(x => x?.name), printToConsole), players.map(x => x?.input))
        this.useSpoilerWallFlag = spoilerWall
    }

    /**
     * @override
     * @returns the active player since it's local
     */
    getThisPlayer(){
        return this.getActivePlayer()
    }

    async runGame(){
        while(!this.checkGameOver()){
            const curPlayerID = this.getActivePlayer()
            console.log(this.arrOfPlayers)
            console.log(curPlayerID)
            const curPlayer = this.arrOfPlayers[curPlayerID]
            console.log(curPlayer)
            if(this.printToConsole){console.log(`-----------------------------------\n\n ${curPlayer.name}'s Turn \n\n-----------------------------------`)}
            const action = await curPlayer.getAction(this) // Not a huge fan, kinda means there'll be sideffects... To change later perhaps
            // console.log(action)
            // console.log(this)
            document.dispatchEvent(new CustomEvent("HanabiGamestateChanged"))
            // console.log(getGameImage().history.map((x) => x.toString()))
        }
        return this.scoreGame()
    }

    /**
     * @override
     * @returns useSpoilerWallFlag
     */
    useSpoilerWall(){
        return this.useSpoilerWallFlag
    }
}

class HanabiControllerMultiplayer extends HanabiController{

    constructor(playerCount, players, printToConsole = false){
        super(new LocalHanabiGame(playerCount, players.map(x => x?.name), printToConsole),  players.map(x => x?.input))
        this.waitingForPlayer = true
        
        // this.player = "P1"
        // this.runGame()
    }

    // Update to show the active play If human otherwise the most recent active
    /**
     * @override
     * @returns the active player since it's local
     */
    getThisPlayer(){
        // return this.player
        return this.getActivePlayer()
    }

    async runGame(){
        while(!this.checkGameOver()){
            const curPlayerID = this.getActivePlayer()
            const curPlayer = this.arrOfPlayers[curPlayerID]
            if(this.printToConsole){console.log(`-----------------------------------\n\n ${curPlayer.name}'s Turn \n\n-----------------------------------`)}
            const action = await curPlayer.getAction(this) // Not a huge fan, kinda means there'll be sideffects... To change later perhaps
            // console.log(action)
            // console.log(this)
            document.dispatchEvent(new CustomEvent("HanabiGamestateChanged"))
            // console.log(getGameImage().history.map((x) => x.toString()))
        }
        return this.scoreGame()



    }
}

export {HanabiControllerLocalHotseat, HanabiControllerMultiplayer}