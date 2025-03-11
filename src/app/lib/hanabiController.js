const { LocalHanabiGame } = require("./LocalHanabiGame")





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


export {HanabiControllerLocalHotseat}