import { Card } from "./HanabiCard"
import { numberSuffixes } from "./hanabiConsts"


/**
 * @abstract
 */
class HanabiMove{
    constructor(typeOfMove, sourcePlayerID, name = undefined){
        this.typeOfMove = typeOfMove
        this.sourcePlayerID = sourcePlayerID
        this.name = name
    }

    toString(){
        return `${this.name || this.sourcePlayerID} ${this.typeOfMove}s`
    }
}

class HanabiMovePlay extends HanabiMove{
    constructor(sourcePlayerID, targetCardIndex, card, drawnCard, successfulPlay, name = undefined){
        super("play", sourcePlayerID, name)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.successfulPlay = successfulPlay
        this.drawnCard = drawnCard
    }

    toString(){
        return `${this.name || this.sourcePlayerID} ${this.typeOfMove}s their ${this.targetCardIndex}${numberSuffixes[this.targetCardIndex]} card, a ${this.card.toString()}. ${this.successfulPlay ? "Success!" : "Failed and discarded."}`
    }
}

class HanabiMoveDiscard extends HanabiMove{
    constructor(sourcePlayerID, targetCardIndex, card, drawnCard, name = undefined){
        super("discard", sourcePlayerID, name)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.drawnCard = drawnCard
    }

    toString(){
        return `${this.name || this.sourcePlayerID} ${this.typeOfMove}s their ${this.targetCardIndex}${numberSuffixes[this.targetCardIndex]} card, a ${this.card.toString()}.`
    }
}

class HanabiMoveHint extends HanabiMove{
    constructor(sourcePlayerID, targetPlayerID, hintType, hintValue, targetCardIndices, name = undefined){
        super("hint", sourcePlayerID, name)
        this.targetPlayerID = targetPlayerID
        this.hintType = hintType
        this.hintValue = hintValue
        this.targetCardIndices = targetCardIndices
    }

    toString(){
        return `${this.name || this.sourcePlayerID} ${this.typeOfMove}s - "${this.targetPlayerID}: The card${this.targetCardIndices.length > 1 ? "s" : ""} ${this.targetCardIndices} ${this.targetCardIndices.length > 1 ? "are" : "is a"} ${this.hintValue}${this.targetCardIndices.length > 1 ? "s" : ""}`
    }
}

class HanabiHistoryMessage extends HanabiMove{
    constructor(sourcePlayerID, text, displayOrigin = true, name = undefined){
        super("message", sourcePlayerID, name)
        this.text = text
    }

    toString(){
        return `${this.displayOrigin ? (this.name || this.source) : ""} ${this.text}`
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