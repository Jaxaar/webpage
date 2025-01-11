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
        this.kb.assimilateRound(history)
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
        this.playerId = gameImage.getActivePlayer()

        // Set cardsVisibleToEveryone
        for(let c of gameImage.discard){
            this.cardsVisibleToEveryone.push(c)
        }
        for(let [suit, c] of Object.entries(gameImage.tableau)){
            if(c.value !== 0) this.cardsVisibleToEveryone.push(c)
        }

        this.cardsUnseen = this.getAllCards()
        for(let c of this.cardsVisibleToEveryone){
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(c)))
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

    assimilateRound(history){
        console.log("Handle History")
        for(let str of history){

            const colonSplit = str.split(": ")
            const player = colonSplit[0]
            console.log(player)
            console.log(colonSplit)
            if(colonSplit?.[1] == undefined){
                console.log("History Err, invalid string")
                continue
            }

            const spaceSplit = colonSplit[1].split(" ")
            console.log(spaceSplit)

            if(spaceSplit[0] === "Hints"){
                console.log("Hint")

            }
            else if(spaceSplit[0] === "Plays"){
                console.log("Play")
                const cardIndex = parseInt(spaceSplit[3])
                
                const card = new Card(spaceSplit[6], parseInt(spaceSplit[7]))

                // if(str.includes("Success!")){

                // }
                // else{

                // }

                if(player !== this.playerId){
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(card)), 1)
                }
                this.cardsVisibleToEveryone.push(card)

                // Clear player knowledge

            }
            else if(spaceSplit[0] === "Discards"){
                console.log("Discard")
                const cardIndex = parseInt(spaceSplit[3])
                const card = new Card(spaceSplit[6], parseInt(spaceSplit[7]))

                if(player !== this.playerId){
                    this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(card)), 1)
                }
                this.cardsVisibleToEveryone.push(card)
                
                // Clear player knowledge
            }
        }

    }

// :
// "P1: Hints - "P2: The cards 2 are 1's"."
// 1
// :
// "P2: Plays their 2 card, a Blue 1. Success!"
// 2
// :
// "P1: Hints "P2 - The cards 2 are 1's"."
// 3
// :
// "P2: Plays their 2 card, a Yellow 1. Success!"
// 4
// :
// "P1: Plays their 3 card, a Blue 5. Failed and discarded."
// 5
// :
// "P2: Discards their 2 card, a Red 4."
// 6
// :
// "P1: Hints "P2 - The cards 1,2 are Yellow"."
// 7
// :
// "P2: Hints "P1 - The cards 2,4 are 2's"."
// 8
// :
// "P1: Discards their 4 card, a Red 2."
// 9
// :
// "P2: Hints - "P1: The cards 2,4 are 2's"."
// 10
// :
// "P1: Plays their 4 card, a Blue 2. Success!"
// 11
// :
// "P2: Plays their 3 card, a Blue 3. Success!"
// 12
// :
// "P1: Hints - "P2: The cards 1,2 are Yellow"."
// 13
// :
// "P2: Discards their 1 card, a Yellow 3."

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