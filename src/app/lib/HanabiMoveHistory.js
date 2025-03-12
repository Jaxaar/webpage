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
    constructor(sourcePlayer, targetCardIndex, card, successfulPlay){
        super("play", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
        this.successfulPlay = successfulPlay
    }

    toString(){
        return `${this.sourcePlayer} ${this.typeOfMove}s their ${this.targetCardIndex}${numberSuffixes[this.targetCardIndex]} card, a ${this.card.toString()}. ${this.successfulPlay ? "Success!" : "Failed and discarded."}`
    }
}

class HanabiMoveDiscard extends HanabiMove{
    constructor(sourcePlayer, targetCardIndex, card){
        super("discard", sourcePlayer)
        this.targetCardIndex = targetCardIndex
        this.card = card
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

function convertObjectToHanabiMove(x){
    x.card = Object.assign(new Card, x.card)
    if(x.typeOfMove === "hint"){
        return Object.assign(new HanabiMoveHint, x)
    }
    else if(x.typeOfMove === "discard"){
        return Object.assign(new HanabiMoveDiscard, x)
    }
    else if(x.typeOfMove === "play"){
        return Object.assign(new HanabiMovePlay, x)
    }
}


export {HanabiMove, HanabiMoveDiscard, HanabiMovePlay, HanabiMoveHint, convertObjectToHanabiMove}