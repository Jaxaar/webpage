import { Suits, Values} from "../hanabiConsts";
import {Card} from "../HanabiGame/HanabiCard";
import { HanabiPlayer } from "./HanabiPlayer";



class HanabiDBInput extends HanabiPlayer{
    constructor(name){
        super(name)
        this.kb = undefined
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
        // console.log(this.kb)


        return this.determinePlay(controller, gameImage)

    }

    init(controller, id){
        super.init(id)
        this.kb = new KnowledgeDatabase(controller.getGameImage(this.playerID), this.playerID)
        // console.log(this.kb)
    }

    assimilateRound(history){
        this.kb.assimilateRound(history)
    }

    async determinePlay(controller, gameImage){
        return undefined
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
        // console.log("Initializing DB")

        // Init blank knowledge for each player
        for(let p of gameImage.players){
            this.knowledgeOfHands[p.id] = []
            for(let c of p.hand){
                this.knowledgeOfHands[p.id].push(new Knowledge())
            }
        }

        // Set Cards which aren't seen to all
        this.cardsUnseen = this.getAllCards()

        // console.log(gameImage.players)
        // Remove the cards which the other players have
        for(let p of gameImage.players){
            if(p.id !== this.playerID){
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

    assimilateRound(history){
        // console.log("Handle Round")

        let i = history.length
        while(i > 0){
            i--
            const obj = history[i]
            if((obj.typeOfMove === "hint" || obj.typeOfMove === "play" || obj.typeOfMove === "discard") && obj.sourcePlayerID === this.playerID){
                // console.log("Stop")
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

            const targetKnowledge = this.knowledgeOfHands[histObj.targetPlayerID]
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
        if(histObj.sourcePlayerID === this.playerID){
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.card)), 1)
        }
        else if(histObj.drawnCard !== undefined){
            this.cardsUnseen.splice(this.cardsUnseen.findIndex((x) => x.equals(histObj.drawnCard)), 1)
        }
        this.cardsVisibleToEveryone.push(histObj.card)
        this.knowledgeOfHands[histObj.sourcePlayerID][histObj.targetCardIndex - 1] = new Knowledge(history.length)
    }

    getSafePlay(gameImage){
        for(let i = 0; i < this.knowledgeOfHands[this.playerID].length; i++){
            const result = this.checkIfCardIsSafePlay(gameImage, this.knowledgeOfHands[this.playerID][i])
            if(result){
                return i + 1
            }
        }
        return undefined
    }

    checkIfCardIsSafePlay(gameImage, knowledge){
        const possibleCards = this.getAllPossibleCards(gameImage, knowledge)
        if(possibleCards.length == 0){
            console.log("Minor Error, Knowledge entry concluded their hand was impossible, Discarding anomaly"); //TODO Fix anomaly (maybe just reload possibilities every time you cull??
            return false;
        }
        for(const c of possibleCards){
            if(!gameImage.canPlayCard(c)){
                return false;
            }
        }
        return true;
    }
    
    getSafeDiscard(gameImage){
        for(let i = 0; i < this.knowledgeOfHands[this.playerID].length; i++){
            const result = this.checkIfCardIsSafeDiscard(gameImage, this.knowledgeOfHands[this.playerID][i])
            if(result){
                return i + 1
            }
        }
    }

    checkIfCardIsSafeDiscard(gameImage, knowledge){
        const possibleCards = this.getAllPossibleCards(gameImage, knowledge)
        if(possibleCards.length === 0){
            console.log("Error?? No possibilites? Discard ig");
            return true;
        }
        for(const c of possibleCards){
            if(c.value >= gameImage.tableau[c.suit].value){
                return false;
            }
        }
        return true;
    }

    getBestHint(gameImage){

        if(gameImage.hints <= 0){
            return undefined
        }

        // TODO: Check for save hints

        // Play Hints
        for(const p of gameImage.players){ //Make it start at the next player not player 0...
            if(p.id === this.playerID){
                continue
            }
            for(let i = 0; i < p.hand.length; i++){
                const card = p.hand[i]
                if(!gameImage.canPlayCard(card)){
                    continue
                }
                const cardKnowledge = this.knowledgeOfHands[p.id][i]

                if(cardKnowledge.value === -1){
                    return {
                        targetPlayerID: p.id,
                        type: "value",
                        val: card.value
                    }
                }
                else if(cardKnowledge.suit === ""){
                    return {
                        targetPlayerID: p.id,
                        type: "suit",
                        val: card.suit
                    }
                }
                else{
                    continue
                }
            }
        } 
        return undefined
    }

    getdefaultDiscard(gameImage){
        let minIdx = 0
        const vals = this.knowledgeOfHands[this.playerID].map(k => k.timeDrawn)
        for(let i = 0; i < vals.length; i++){
            if(vals[i] <= vals[minIdx]){
                minIdx = i
            }
        }
        return minIdx + 1
    }

    getAllPossibleCards(gameImage, knowledge){
        const possibilites = []
        for(const c of this.cardsUnseen){
            let toAdd = true
            if(knowledge.value !== -1){
                toAdd = (c.value === knowledge.value)
            }
            if(toAdd && knowledge.suit !== ""){
                toAdd = (c.suit === knowledge.suit)
            }
            if(toAdd){
                possibilites.push(c)
            }
        }
        return possibilites
    }

}


class Knowledge{
    constructor(time = 0){
        this.suit = ""
        this.value = -1
        this.timeDrawn = time
    }
}

export {KnowledgeDatabase, HanabiDBInput}