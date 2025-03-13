import { Suits, Values} from "./hanabiConsts";
import {Card} from "./HanabiCard";


class HanabiDBInput{
    constructor(playerID){
        this.kb = undefined
        this.playerID = playerID
    }

    // Is called every time the player needs to make a move:
    // curPlayer.getAction(game.getGameImage(curPlayerStr))

    // Valid Actions:
    // Format: Hint-P#-Type-value  - where p# is the target player Id, Type is Suit or Value, and value is the actual value (color/number) of the clue
    // Format: Play-#: where # is the index and a num 1-handLimit
    // Format: Discard-#: where # is the index and a num 1-handLimit
    async getAction(controller){

        const gameImage = controller.getGameImage(this.playerID)
        // console.log(controller)
        // console.log(gameImage)

        this.assimilateRound(gameImage.history)
        console.log(this.kb)


        return this.determinePlay(controller, gameImage)

    }

    init(controller){
        this.kb = new KnowledgeDatabase(controller.getGameImage(this.playerID), this.playerID)
        console.log(this.kb)
    }

    assimilateRound(history){
        this.kb.assimilateRound(history)
    }

    async determinePlay(controller, gameImage){
        return undefined
    }
}

class HanabiDBHuman extends HanabiDBInput{

    constructor(playerID){
        super(playerID)
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


class HanabiDBAI extends HanabiDBInput{

    constructor(playerID){
        super(playerID)
    }

    /**
     * @override
     * @param {*} controller 
     * @param {*} gameImage 
     * @returns 
     */
    determinePlay(controller, gameImage){

        return controller.discardCard(gameImage.getActivePlayer(), 1)
        
    }
}

class KnowledgeDatabase{
    constructor(gameImage, playerID){
        this.playerID = playerID
        this.cardsVisibleToEveryone = []
        this.cardsUnseen = []
        this.knowledgeOfHands = {}

        this.initDB(gameImage)
    }

    initDB(gameImage){
        console.log("Initializing DB")

        // Init blank knowledge for each player
        for(let [pkey, p] of Object.entries(gameImage.players)){
            this.knowledgeOfHands[pkey] = []
            for(let c of p.hand){
                this.knowledgeOfHands[pkey].push(new Knowledge())
            }
        }

        // Set Cards which aren't seen to all
        this.cardsUnseen = this.getAllCards()

        console.log(gameImage.players)
        // Remove the cards which the other players have
        for(let [pkey, p] of Object.entries(gameImage.players)){
            if(pkey !== this.playerID){
                for(let c of p.hand){
                    // console.log(c)
                    // console.log(this.cardsUnseen)
                    // console.log(this.cardsUnseen.findIndex((x) => x.equals(c)))
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)), 1)
                }
            }
        }

        // // Set cardsVisibleToEveryone (none at the start of the game)
        // for(let c of gameImage.discard){
        //     this.cardsVisibleToEveryone.push(c)
        // }
        // for(let [suit, c] of Object.entries(gameImage.tableau)){
        //     if(c.value !== 0) this.cardsVisibleToEveryone.push(c)
        // }

        // // Remove cards everyone can see from the unseen array
        // for(let c of this.cardsVisibleToEveryone){
        //     this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)), 1)
        // }
    }



    assimilateRound(history){
        // console.log("Handle Round")

        let i = history.length
        while(i > 0){
            i--
            const obj = history[i]
            if((obj.typeOfMove === "hint" || obj.typeOfMove === "play" || obj.typeOfMove === "discard") && obj.sourcePlayer === this.playerID){
                console.log("Stop")
                break;
            }
        }
        // console.log(i)
        // console.log(history)
        while(i < history.length){
            this.readHistoryEvent(history[i], history)
            i++
        }
    }

    readHistoryEvent(histObj, history){
        // console.log(histObj)

        if(histObj.typeOfMove === "hint"){
            // console.log("Hint")
            // console.log(histObj)

            const targetKnowledge = this.knowledgeOfHands[histObj.targetPlayer]
            for(const i of histObj.targetCardIndices){
                targetKnowledge[i-1][histObj.hintType] = histObj.hintValue
            }
            // console.log(targetKnowledge)
            // console.log(this.knowledgeOfHands)


        }
        else if(histObj.typeOfMove === "play"){
            // console.log("Play")

            if(histObj.successfulPlay){

            }
            else{

            }

            this.clearAndReplaceCard(histObj, history)

            // Clear player knowledge

        }
        else if(histObj.typeOfMove === "discard"){
            // console.log("Discard")

            this.clearAndReplaceCard(histObj, history)
            
            // Clear player knowledge
        }
        return histObj
    }

    clearAndReplaceCard(histObj, history){
        if(histObj.sourcePlayer === this.playerID){
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.card)), 1)
        }
        else if(histObj.drawnCard !== undefined){
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.drawnCard)), 1)
        }
        this.cardsVisibleToEveryone.push(histObj.card)

        this.knowledgeOfHands[histObj.sourcePlayer][histObj.targetCardIndex - 1] = new Knowledge(history.length)
    }

    getAllCards(){
        const deck = []
        for (const suit of Suits){
            for (const value in Values){
                for(let i = 0; i < Values[value]; i++){
                    deck.push(new Card(suit, value))
                }
            }
        }
        return deck
    }

}


class Knowledge{
    constructor(time = 0){
        this.suit = ""
        this.value = -1
        this.timeDrawn = time
    }
}

export {HanabiDBAI, HanabiDBHuman}