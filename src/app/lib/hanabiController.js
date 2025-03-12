import { LocalHanabiGame } from "./LocalHanabiGame"




/**
 * @abstract
 */

class HanabiController {

    constructor(game){
        this.game = game
    }

    getThisPlayer(){
        return undefined
    }

    getActivePlayer(){
        return this.game.getActivePlayer()
    }

    getGameImage() {
        return this.game.getGameImage(this.getThisPlayer())
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

    constructor(playerCount, spoilerWall, printToConsole = false){
        super(new LocalHanabiGame(playerCount, printToConsole))
        this.useSpoilerWallFlag = spoilerWall

    }

    /**
     * @override
     * @returns the active player since it's local
     */
    getThisPlayer(){
        return this.getActivePlayer()
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
        super(new LocalHanabiGame(playerCount, printToConsole))
        this.waitingForPlayer = true
        this.arrOfPlayers = players
        // this.player = "P1"
        this.runGame()
    }

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
            const curPlayerStr = this.getActivePlayer()
            const curPlayer = this.arrOfPlayers[parseInt(curPlayerStr.substring(1)) - 1]
            console.log(`Player ${curPlayerStr}'s Turn -----------------------------------`)
            const action = await curPlayer.getAction(this) // Not a huge fan, kinda means there'll be sideffects... To change later perhaps
            console.log(action)
            console.log(this)
            document.dispatchEvent(new CustomEvent("HanabiGamestateChanged"))
            // console.log(getGameImage().history.map((x) => x.toString()))
        }
        return this.scoreGame()



    }
}

export {HanabiControllerLocalHotseat, HanabiControllerMultiplayer}