
/**
 * @abstract
 */
class HanabiPlayer{

    constructor(name){
        this.name = name
        this.playerID = undefined
    }

    async getAction(controller){

        const gameImage = controller.getGameImage(this.playerID)

        return this.determinePlay(controller, gameImage)

    }

    // Called once before the game begins
    init(){
        if(this.playerID === undefined){
            console.error("ERROR, No Player ID before initialization!!!")
            return undefined
        }
    }

    assignID(id){
        this.playerID = id
    }

    async determinePlay(controller, gameImage){
        return undefined
    }
}

export {HanabiPlayer}




