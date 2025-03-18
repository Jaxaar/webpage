import { Suits, Values} from "./hanabiConsts";
import {Card} from "./HanabiCard";
import react from "react";


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
        // console.log(this.kb)


        return this.determinePlay(controller, gameImage)

    }

    init(controller){
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

    constructor(playerID, waitForPermission = false){
        super(playerID)
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

export {HanabiDBAI, HanabiDBHuman}









/**
 * 
 * 
 * 
    public String getSafePlay(Board boardState, Hand partnerHand){
        for(int i  = 0; i < handSize; i++){
            if(myKnowledge.get(i).isSafePlay(boardState)){
                resetKnowledge(i, PLAYER.Me, partnerHand);
                return "PLAY " + i + " " + i;
            }
        }
        return "NONE";
    }

    public String getSafeDiscard(Board boardState, Hand partnerHand){
        if(boardState.numHints == boardState.MAX_HINTS){
            return "NONE";
        }
        for(int i  = 0; i < handSize; i++){
            if(myKnowledge.get(i).isSafeDiscard(boardState)){
                resetKnowledge(i, PLAYER.Me, partnerHand);
                return "DISCARD " + i + " " + i;
            }
        }
        return "NONE";
    }
 * 
    public String getBestHint(Board boardState, Hand partnerHand){
        // TODO Check for danger cards ... make it work
//        if(boardState.numHints > 0){
//            String hint = getDangerCardHint(boardState, partnerHand);
//            if(!hint.equals("NONE")){
//                return hint;
//            }
//        }

        if(boardState.numHints < 1){
            return "NONE";
        }

        // Gets hint if it is
        try {
            for(int i = 0; i < partnerKnowledge.size(); i++){

                if(boardState.isLegalPlay(partnerHand.get(i))) {

                    String hint = partnerKnowledge.get(i).getHintType();

                    if(hint.equals("NUMBERHINT ")) {
                        hint += partnerHand.get(i).value;
                        tellPartnerNumber(partnerHand, partnerHand.get(i).value);
                        return hint;

                    } else if (hint.equals("COLORHINT ")) {
                        hint += partnerHand.get(i).color;
                        tellPartnerColor(partnerHand, partnerHand.get(i).color);
                        return hint;

                    } else if (hint.equals("NONE")) {
//                        System.out.println("Slot Already completely hinted");
                    } else {
                        System.out.println("HintReturning Failure - KB85");
                    }
                }
            }
        }catch (Exception e){
            System.out.println(e.toString());
        }

        return "NONE";
    }








    public boolean isSafePlay(Board boardState){
        if(possibleCards.size() == 0){
//            System.out.println("Error??? No possibilites");
            System.out.println("Minor Error, Knowledge entry concluded their hand was impossible, Discarding anomaly"); //TODO Fix anomaly (maybe just reload possibilities every time you cull??
            return false;
        }
        for(int i = 0; i < possibleCards.size(); i++){
            if(!boardState.isLegalPlay(possibleCards.get(i))){
                return false;
            }
        }
        return true;
    }

    public boolean isSafeDiscard(Board boardState){
        if(possibleCards.size() == 0){
//            System.out.println("Error?? No possibilites? Discard ig");
//            System.out.println(boardState);
//            System.out.println(Colors.suitColor(color));
//            System.out.println(value);
            return true;
        }
        for(int i = 0; i < possibleCards.size(); i++){
            Card c = possibleCards.get(i);
            if(c.value >= boardState.tableau.get(c.color)){
                return false;
            }
        }
        return true;
    }

    public String getHintType(){
//        System.out.println("Num " + value + "; Col " + color);
        if(value == -1){
            return "NUMBERHINT ";
        }
        if(color == -1){
            return "COLORHINT ";
        }
        else{
            return "NONE";
        }
    }

    private void cullPossibilities(){
//        System.out.println("********************CULLINIG ************");
//        System.out.println(possibleCards);
//        System.out.println(value);
//        System.out.println(Colors.suitColor(color));
        for(int i  = 0; i < possibleCards.size(); i++){
            boolean remove = false;
            if(value != -1){
                if(possibleCards.get(i).value != value){
                    remove = true;
                }
            }
            if(color != -1){
                if(possibleCards.get(i).color != color){
                    remove = true;
                }
            }
            if(remove){
                possibleCards.remove(i);
                i--;
            }
        }
//        System.out.println(possibleCards);

    }



 */