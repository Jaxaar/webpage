


class Card {
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    toString() {
        return this.suit + " " + this.value
    }
    isSameSuitAs(otherCard){
        return this.suit == otherCard.suit
    }
    isPrevCard(otherCard){
        return (parseInt(this.value) + 1) == otherCard.value
    }
    isAfterCard(otherCard){
        return (parseInt(this.value)) > otherCard.value
    }
    equals(otherCard){
        return (this.suit === otherCard?.suit && this.value === otherCard?.value)
    }

}

function castcardsToCards(gameImage){
    for (let [pName, p] of Object.entries(gameImage.players)){
        let deck = []
        for(let c of p.hand){
            deck.push(makeCard(c))
        }
        p.hand = deck
    }
    const newTab = {}
    for(let [suit, card] of Object.entries(gameImage.tableau)){
        newTab[suit] = makeCard(card)
    }
    gameImage.tableau = newTab

    const deck = []
    for(let c of gameImage.deck){
        deck.push(makeCard(c))
    }
    gameImage.deck = deck
    
    return gameImage
}

function makeCard(card){
    return new Card(card.suit, card. value)
}

export {Card, castcardsToCards, makeCard}