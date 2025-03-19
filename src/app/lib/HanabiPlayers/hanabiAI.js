import { Suits, Values} from "../hanabiConsts";
import {Card} from "../HanabiGame/HanabiCard";
import { KnowledgeDatabase, HanabiDBInput } from "./HanabiDB";
import react from "react";


class HanabiDBAIv1 extends HanabiDBInput{

    constructor(name, waitForPermission = false){
        super(name)
        this.waitForPermission = waitForPermission
    }

    /**
     * @override
     * @param {*} controller 
     * @param {*} gameImage 
     * @returns 
     */
    async determinePlay(controller, gameImage){

        if(this.waitForPermission){
            const reply = await this.listenForMakePlayEvent()
            // console.log(reply)
        }

        const safePlay = this.kb.getSafePlay(gameImage)
        if(safePlay !== undefined){
            // console.log("safe Play")
            return controller.playCard(this.playerID, safePlay)
        }

        // Might want this after Hint
        const safeDiscard = this.kb.getSafeDiscard(gameImage)
        if(safeDiscard !== undefined){
            // console.log("safe Discard")
            return controller.discardCard(this.playerID, safeDiscard)
        }

        const bestHint = this.kb.getBestHint(gameImage)
        if(bestHint !== undefined){
            // console.log("Hint")
            return controller.handleHint(this.playerID, bestHint.type, bestHint.val, bestHint.targetPlayerID)
        }

        const defaultDiscard = this.kb.getdefaultDiscard(gameImage)
        if(defaultDiscard !== undefined){
            // console.log("Default Discard")
            return controller.discardCard(this.playerID, defaultDiscard)   
        }


        console.log("uh oh")
        return undefined
        
    }

    async listenForMakePlayEvent(){
        const p = new Promise(resolve => {
            document.addEventListener("HanabiAIGoAhead", resolve, {once: true})
        })
        // console.log(p)
        return p
    }
}


export {HanabiDBAIv1}