import { Card } from "./HanabiCard"
import { numberSuffixes } from "./hanabiConsts"


/**
 * @abstract
 */
class HanabiMove{
    constructor(typeOfMove, sourcePlayer){
        this.typeOfMove = typeOfMove
        this.sourcePlayer = sourcePlayer
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s`
    }
}

class HanabiMovePlay extends HanabiMove{
    constructor(sourcePlayer, targetCardIndex, card, drawnCard, successfulPlay){
        super("play", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.successfulPlay = successfulPlay
        this.drawnCard = drawnCard
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s their ${this.targetCardIndex}${numberSuffixes[this.targetCardIndex]} card, a ${this.card.toString()}. ${this.successfulPlay ? "Success!" : "Failed and discarded."}`
    }
}

class HanabiMoveDiscard extends HanabiMove{
    constructor(sourcePlayer, targetCardIndex, card, drawnCard){
        super("discard", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.drawnCard = drawnCard
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s their ${this.targetCardIndex}${numberSuffixes[this.targetCardIndex]} card, a ${this.card.toString()}.`
    }
}

class HanabiMoveHint extends HanabiMove{
    constructor(sourcePlayer, targetPlayer, hintType, hintValue, targetCardIndices){
        super("hint", sourcePlayer)
        this.targetPlayer = targetPlayer
        this.hintType = hintType
        this.hintValue = hintValue
        this.targetCardIndices = targetCardIndices
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s - "${this.targetPlayer}: The card${this.targetCardIndices.length > 1 ? "s" : ""} ${this.targetCardIndices} ${this.targetCardIndices.length > 1 ? "are" : "is a"} ${this.hintValue}${this.targetCardIndices.length > 1 ? "s" : ""}`
    }
}

class HanabiHistoryMessage extends HanabiMove{
    constructor(sourcePlayer, text, displayOrigin = true){
        super("message", sourcePlayer)
        this.text = text
    }

    toString(){
        return `${this.displayOrigin ? this.source : ""} ${this.text}`
    }
}

function convertObjectToHanabiMove(x){
    x.card = Object.assign(new Card, x.card)
    x.drawnCard = Object.assign(new Card, x.drawnCard)
    if(x.typeOfMove === "hint"){
        return Object.assign(new HanabiMoveHint, x)
    }
    else if(x.typeOfMove === "discard"){
        return Object.assign(new HanabiMoveDiscard, x)
    }
    else if(x.typeOfMove === "play"){
        return Object.assign(new HanabiMovePlay, x)
    }
    else if(x.typeOfMove === "message"){
        return Object.assign(new HanabiHistoryMessage, x)
    }
}


export {HanabiMove, HanabiMoveDiscard, HanabiMovePlay, HanabiMoveHint, HanabiHistoryMessage, convertObjectToHanabiMove}