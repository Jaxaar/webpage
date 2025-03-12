import { Suits, Values} from "./hanabiConsts";
import {Card} from "./HanabiCard";


class HanabiDBHuman{

    constructor(){
        this.kb = undefined
        this.playerId = ""
    }

    // Is called every time the player needs to make a move:
    // curPlayer.getAction(game.getGameImage(curPlayerStr))

    // Valid Actions:
    // Format: Hint-P#-Type-value  - where p# is the target player Id, Type is Suit or Value, and value is the actual value (color/number) of the clue
    // Format: Play-#: where # is the index and a num 1-handLimit
    // Format: Discard-#: where # is the index and a num 1-handLimit
    async getAction(controller){

        const gameImage = controller.getGameImage()
        // console.log(gameImage)

        // if(this.kb === undefined){
        //     initKB(gameImage)
        // }

        // this.initKB(gameImage)
        // console.log(this.kb)
        // this.assimilateRound(gameImage.history)

        return this.determinePlay(controller, gameImage)

    }

    initKB(gameImage){
        if(this.playerId === ""){
            // console.log(gameImage)
            this.playerId = gameImage.getActivePlayer()
        }
        this.kb = new KnowledgeDatabase(gameImage)

    }

    assimilateRound(history){
        this.kb.assimilateRound(history)
    }

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


class HanabiDBAI{

    constructor(){
        this.kb = undefined
        this.playerId = ""
    }

    // Is called every time the player needs to make a move:
    // curPlayer.getAction(game.getGameImage(curPlayerStr))

    // Valid Actions:
    // Format: Hint-P#-Type-value  - where p# is the target player Id, Type is Suit or Value, and value is the actual value (color/number) of the clue
    // Format: Play-#: where # is the index and a num 1-handLimit
    // Format: Discard-#: where # is the index and a num 1-handLimit
    getAction(controller){
        const gameImage = controller.getGameImage()
        console.log(gameImage)

        // if(this.kb === undefined){
        //     initKB(gameImage)
        // }
        // console.log(gameImage)
        // this.initKB(gameImage)
        // console.log(this.kb)
        // this.assimilateRound(gameImage.history)

        return this.determinePlay(controller, gameImage)

    }

    initKB(gameImage){
        if(this.playerId === ""){
            // console.log(gameImage)
            this.playerId = gameImage.getActivePlayer()
        }
        this.kb = new KnowledgeDatabase(gameImage)

    }

    assimilateRound(history){
        this.kb.assimilateRound(history)
    }

    determinePlay(controller, gameImage){

        return controller.discardCard(controller.getActivePlayer(), 1)
        // console.log(gameImage)
        // let userInput = prompt("Please enter a move:", "Discard-1");
        // console.log("You entered:", userInput);
        // return userInput
    }
}

class KnowledgeDatabase{
    constructor(gameImage){
        this.cardsVisibleToEveryone = []
        this.cardsUnseen = []
        this.knowledgeOfHands = {}
        this.playerId = ""

        this.initDB(gameImage)
    }

    initDB(gameImage){
        console.log("Initializing DB")
        this.playerId = gameImage.getActivePlayer()


        // Set Cards which aren't seen to all
        this.cardsUnseen = this.getAllCards()

        // Remove the cards which the other players have
        for(let [pkey, p] of Object.entries(gameImage.players)){
            if(pkey !== this.playerId){
                for(let c of p.hand){
                    // console.log(c)
                    // console.log(this.cardsUnseen)
                    // console.log(this.cardsUnseen.findIndex((x) => x.equals(c)))
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)), 1)
                }
            }
        }


        // if(!this.reloadEveryTurn){
        //     // Set cardsVisibleToEveryone (none at the start of the game)
        //     for(let c of gameImage.discard){
        //         this.cardsVisibleToEveryone.push(c)
        //     }
        //     for(let [suit, c] of Object.entries(gameImage.tableau)){
        //         if(c.value !== 0) this.cardsVisibleToEveryone.push(c)
        //     }

        //     // Remove cards everyone can see from the unseen array
        //     for(let c of this.cardsVisibleToEveryone){
        //         this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)), 1)
        //     }
        // }

        // Only for testing. Practically the db must be initialized raw at the start of each game not turn to work right
        this.assimilateHistory(gameImage.history)

        // Init blank knowledge for each player
        for(let [pkey, p] of Object.entries(gameImage.players)){
            this.knowledgeOfHands[pkey] = []
            for(let c of p.hand){
                this.knowledgeOfHands[pkey].push(new Knowledge())
            }
        }
    }

    assimilateHistory(history){
        console.log("Handle History")
        for(let obj of history){
            this.readHistoryEvent(obj)
        }
    }

    assimilateRound(history){
        console.log("Handle Round")
        for(let obj of history){
            const t = this.readHistoryEvent(obj)
            if(t === "hint" || t === "play" || t === "discard"){
                return t
            }
        }
    }

    readHistoryEvent(histObj){
        console.log(histObj)

        if(histObj.typeOfMove === "hint"){
            console.log("Hint")

        }
        else if(histObj.typeOfMove === "play"){
            console.log("Play")

            if(histObj.successfulPlay){

            }
            else{

            }

            if(histObj.sourcePlayer !== this.playerId){
                this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.card)), 1)
            }
            this.cardsVisibleToEveryone.push(histObj.card)

            // Clear player knowledge

        }
        else if(histObj.typeOfMove === "discard"){
            // console.log("Discard")

            if(histObj.sourcePlayer !== this.playerId){
                console.log("Split")
                console.log(this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.card)), 1))
            }
            this.cardsVisibleToEveryone.push(histObj.card)
            
            // Clear player knowledge
        }
        return histObj.typeOfMove
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
    constructor(){
        this.suit = ""
        this.value = -1
        this.timeDrawn = 0
    }
}

export {HanabiDBAI, HanabiDBHuman}