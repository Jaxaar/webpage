import { Suits, Values} from "../hanabiConsts";
import {Card} from "../HanabiGame/HanabiCard";
import { KnowledgeDatabase, HanabiDBInput } from "./HanabiDB";
import react from "react";


class HanabiDBHuman extends HanabiDBInput{

    constructor(name){
        super(name)
    }


    /**
     * @override
     * @param {*} controller 
     * @param {*} gameImage 
     * @returns 
     */
    async determinePlay(controller, gameImage){

        const promisedEvent = await this.listenForHanabiInterfaceEvent()

        // console.log(gameImage)
        // let userInput = prompt("Please enter a move:", "Discard-1");
        // console.log("You entered:", userInput);
        return promisedEvent.detail
    }

    async listenForHanabiInterfaceEvent(){
        const p = new Promise(resolve => {
            document.addEventListener("HanabiActionTaken", resolve, {once: true})
        })
        // console.log(p)
        return p
    }
}


export{HanabiDBHuman}