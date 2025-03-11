import { Suits, Values} from "./hanabiConsts";
import {Card} from "./hanabiAPI";





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
    getAction(gameImage){
        // if(this.kb === undefined){
        //     initKB(gameImage)
        // }
        // console.log(gameImage)
        this.initKB(gameImage)
        console.log(this.kb)
        this.assimilateRound(gameImage.history)

        return this.determinePlay(gameImage)

    }

    initKB(gameImage){
        if(this.playerId === ""){
            // console.log(gameImage)
            this.playerId = gameImage.getActivePlayer()
        }
        this.kb = new KnowledgeDatabase(gameImage)

    }

    assimilateRound(history){
        this.kb.assimilateHistory(history)
    }

    determinePlay(gameImage){
        console.log(gameImage)
        let userInput = prompt("Please enter a move:", "Discard-1");
        console.log("You entered:", userInput);
        return userInput
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


        // Set cardsVisibleToEveryone
        // Can probably remove once history is working
        for(let c of gameImage.discard){
            this.cardsVisibleToEveryone.push(c)
        }
        for(let [suit, c] of Object.entries(gameImage.tableau)){
            if(c.value !== 0) this.cardsVisibleToEveryone.push(c)
        }



        this.cardsUnseen = this.getAllCards()
        for(let c of this.cardsVisibleToEveryone){
            console.log(c)
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)), 1)
        }

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

            console.log(obj)

            if(obj.typeOfMove === "hint"){
                console.log("Hint")

            }
            else if(obj.typeOfMove === "play"){
                console.log("Play")

                if(obj.successfulPlay.includes("Success!")){

                }
                else{

                }

                if(obj.sourcePlayer !== this.playerId){
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(obj.card)), 1)
                }
                this.cardsVisibleToEveryone.push(obj.card)

                // Clear player knowledge

            }
            else if(obj.typeOfMove === "discard"){
                console.log("Discard")

                if(obj.sourcePlayer !== this.playerId){
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(obj.card)), 1)
                }
                this.cardsVisibleToEveryone.push(obj.card)
                
                // Clear player knowledge
            }
        }

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

export {HanabiDBAI}