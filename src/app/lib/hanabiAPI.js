import { HanabiControllerLocalHotseat } from "./hanabiController"
import { LocalHanabiGame } from "./LocalHanabiGame"









function runSingleGame(arrOfPlayers, showINFO){

    const gameController = new HanabiControllerLocalHotseat(arrOfPlayers.length, false, showINFO)

    while(!gameController.checkGameOver()){
        const curPlayerStr = gameController.getActivePlayer()
        const curPlayer = arrOfPlayers[parseInt(curPlayerStr.substring(1)) - 1]
        console.log(`Player ${curPlayerStr}'s Turn -----------------------------------`)
        const rawAction = curPlayer.getAction(gameController.getGameImage())
        if(rawAction == null){
            console.log("nope")
            console.log(gameController)
            return -1
        }


        const action = rawAction.split("-")

        // Format: Hint-P#-Type-value  - where p# is the target player Id, Type is Suit or Value, and value is the actual value (color/number) of the clue
        if(action[0] === "Hint" && action.length === 4){
            gameController.handleHint(curPlayerStr, action[2], action[3], action[1])
        }
        // Format: Play-#: where # is the index and a num 1-handLimit
        else if(action[0] ==="Play" && action.length === 2){
            gameController.playCard(curPlayerStr, action[1])
        }
        // Format: Discard-#: where # is the index and a num 1-handLimit
        else if(action[0] === "Discard" && action.length === 2){
            gameController.discardCard(curPlayerStr, action[1])
        }
        else{
            console.log("Uh Oh... Something broke")
            console.log(gameController)
            console.log(curPlayerStr)
            console.log(action)
            return -1
        }
        console.log(gameController.getGameImage().history.map((x) => x.toString()))
    }
    return gameController.scoreGame()
}



export {HanabiAPI, runSingleGame}