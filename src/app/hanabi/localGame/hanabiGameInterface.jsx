'use client'
import Card from "../../ui/hanabiComponents/Card";
import { useState, useEffect, useRef } from "react";
import "../../ui/css/random.css"
import { Suspense } from 'react'

export default function HanabiGameInterface(gameController) {

    let key = 0;
    function getKey() {
        key = key + 1
        return key
    }

    const [controller, setGameController] = useState(gameController.gameController)
    const [gameImage, setGameImage] = useState(controller.getGameImage())
    const [currentlySelectedCard, setCurrentlySelectedCard] = useState({
        setClicked: () => {},
        suit: "",
        value: 0,
        player: "",
        canSee: undefined,
        index: -1,
    })

    const [update, setUpdate] = useState(true)
    const [spoilerWall, setSpoilerWall] = useState(false)

    const transcriptEnd = useRef(null)

    useEffect(() => {
        if (transcriptEnd.current) {
          transcriptEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
      });

    
    function clearSelectedCard(){
        currentlySelectedCard.setClicked(false)
        setCurrentlySelectedCard({
            setClicked: () => {},
            suit: "",
            value: 0,
            player: "",
            canSee: undefined,
            index: -1,
        })
    }

    function cardSelected(suit, value, player, canSee, setClicked, index){
        currentlySelectedCard.setClicked(false)
        setCurrentlySelectedCard({
            setClicked: setClicked,
            suit: suit,
            value: value,
            player: player,
            canSee: canSee,
            index: index,
        })
    }

    function hint(type){
        const targetPlayer = currentlySelectedCard.player
        const targetVal = type==="suit" ? currentlySelectedCard.suit : currentlySelectedCard.value

        console.info("Hint: " + targetVal + " to: " + targetPlayer)
        const hintVal = controller.handleHint(controller.getThisPlayer(), type, targetVal, targetPlayer)
        if(hintVal === undefined){
            console.info("Action Failed")
            return
        }

        if(controller.useSpoilerWall()){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setGameImage(controller.getGameImage())
    }

    function playCard(){
        console.info("play: " + currentlySelectedCard.index)
        const playVal = controller.playCard(controller.getThisPlayer(), currentlySelectedCard.index)

        if(playVal === undefined){
            console.info("Action Failed")
            return
        }

        // console.log(playVal)
        if(controller.useSpoilerWall()){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setGameImage(controller.getGameImage())
    }

    function discardCard(){
        console.info("discard: " + currentlySelectedCard.index)
        const discVal = controller.discardCard(controller.getThisPlayer(), currentlySelectedCard.index)

        if(discVal === undefined){
            console.info("Action Failed")
            return
        }

        if(controller.useSpoilerWall()){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setGameImage(controller.getGameImage())
    }

    return (
        <div className="m-2 ">
            <div className="font-bold">
                Welcome to the game page!
            </div>
            <div>
                Players: {gameImage.numPlayers}
            </div>
            { gameImage.gameInitialized &&
                <div className="p-2 flex flex-row max-w-[61rem] border-black border-2"> 
                    <div>
                        {/* {console.log(controller)}
                        {console.log(gameImage)} */}
                        {/* <div>Game State:</div> */}
                        <div className="mt-2 ml-4">
                            <div className="mb-1">Tableau:</div>
                            <div className="mt-2 flex flex-row">
                                {Object.entries(gameImage.tableau).map(([suit, card]) => (
                                    <Card 
                                    key={getKey()} 
                                    suit={card.suit} 
                                    value={card.value}
                                    notInteractable={true}
                                    ></Card>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="">Cards left: {gameImage.deck.length}</span>
                            <span className="ml-4">Hint tokens remaining: {gameImage.hints}/{gameImage.hintsUsed + gameImage.hints}</span>
                            <span className="ml-6">Fuses: {gameImage.fuses}</span>
                        </div>
                        { !spoilerWall &&
                        <div className="mt-3">
                            {/* Row Per Player */}
                            <div>
                                {Object.entries(gameImage.players).map(([playerKey, player]) => (
                                    <div key={playerKey} className="flex flex-row">
                                        <div className="m-2">
                                            {player.activePlayer 
                                            && <span className = "ml-1.5">{" > "}</span> 
                                            || <span className= "ml-5"></span>
                                            }
                                            <span className="">{player.name}: </span>
                                        </div>
                                        <div className="grid grid-cols-6 w-[30rem]">
                                            {player.hand.map((card, index) =>(
                                                // <span className={card.suit} key={getKey()}>{card.toString()}, </span>
                                                <Card 
                                                    key={getKey()} 
                                                    suit={card.suit} 
                                                    value={card.value}
                                                    player={playerKey}
                                                    canSee={playerKey !== controller.getThisPlayer()} 
                                                    cardSelected = {cardSelected}
                                                    index={index+1}
                                                ></Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        ||
                        <div className="rand-button" onClick={() => setSpoilerWall(false)}>{controller.getActivePlayer() + "'s"} Turn - Click To Show</div>
                        }
                        {!gameImage.gameEnded &&
                            <div className="mt-3">
                                {currentlySelectedCard.canSee === true &&
                                <div> {/* Other players card */}
                                    <span  className= "mr-3">
                                        To {currentlySelectedCard.player}:
                                    </span>
                                    {gameImage.hints > 0 &&
                                        <span>
                                            <button onClick={() => hint("suit")} className= "mr-3">
                                                Hint: {currentlySelectedCard.suit}
                                            </button>
                                            <button onClick={() => hint("value")}>
                                                Hint: {currentlySelectedCard.value}s
                                            </button>
                                        </span>
                                        ||
                                        <span>No Hints Remaining...</span>
                                    }
                                </div>
                                || currentlySelectedCard.canSee === false &&
                                <div> {/* This players card */}
                                    <button onClick={playCard} className= "mr-3">
                                        Play: {currentlySelectedCard.suit + " " + currentlySelectedCard.value}
                                    </button>
                                    <button onClick={discardCard}>
                                        Discard: {currentlySelectedCard.suit + " " + currentlySelectedCard.value}
                                    </button>
                                </div>
                                || currentlySelectedCard.canSee == undefined &&
                                <div> {/* No card */}
                                    Select a Card
                                </div>
                                }
                                
                            </div>
                            ||
                            <div>
                                <div className="mt-2"> Game Over! Score: {gameImage.scoreGame()}</div>
                                <button className="rand-button" onClick={start}>Play Again?</button>
                            </div>
                        }
                        <div className="mt-8">
                            <div className="ml-1">Discard:</div>
                            <div className="mt-2 grid grid-cols-6 grid-flow-row w-[29rem] gap-y-4">
                                {gameImage.discard.map((card) => (
                                    <Card 
                                    key={getKey()} 
                                    suit={card.suit} 
                                    value={card.value}
                                    notInteractable={true}
                                    ></Card>
                                ))}
                            </div>
                        </div> 
                    </div>
                    <div className="bg-white p-2 m-2 w-[26rem] border-2 border-black">
                        <div className="font-bold border-b-2 border-black">Transcript</div>
                        <div className="overflow-auto max-h-72">
                            {gameImage.history.map((x) => x.toString()).map((event) => (
                                <div key={getKey()}>{event}</div>
                            ))}
                            <div ref={transcriptEnd}></div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}