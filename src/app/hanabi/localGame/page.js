'use client'
import { HanabiAPI, makeGameFromJSON } from "../../lib/hanabiAPI";
import { LocalHanabiGame } from "@/app/lib/LocalHanabiGame";
import Card from "../HanabiUI/Card";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation'
import "../HanabiUI/css/hanabiPage.css"
import { Suspense } from 'react'


function ActualHanabiLobby() {

    const params = useSearchParams()

    // const localHanabiGame = {}
    let key = 0;
    function getKey() {
        key = key + 1
        return key
    }
    const numPlayers = params.get("players") ? params.get("players") : 4

    function setInitGame(){
        return Object.assign(new LocalHanabiGame, makeGameFromJSON(sessionStorage.getItem("CurLocalHanabiGame")))
    }

    // const {initGame, getGameState, playCard, getActivePlayer} = hanabiGame()
    const [game, setGame] = useState({})
    const [playerID, setPlayerID] = useState("P1")
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
    const [useSpoilerWall, setUseSpoilerWall] = useState(false)

    const transcriptEnd = useRef(null)

    // let fullGame = game.getGameState()

    useEffect(() => {
        if (transcriptEnd.current) {
          transcriptEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
      });

      useEffect(() =>{        
        setGame(setInitGame())
      }, [])


    
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

    function start() {
        // game.initGame()
        // setGame(new LocalHanabiGame(numPlayers))
        // fullGame = game.getGameState()
        // setGame(game.getGameState(playerID))
        
        // console.log(game.getGameState())
        // console.log(game.getGameState(playerID))
        // console.log(game)
        // clearSelectedCard()
        // setPlayerID(game.getActivePlayer())
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

        console.log("Hint: " + targetVal + " to: " + targetPlayer)
        const hintVal = game.handleHint(playerID, type, targetVal, targetPlayer)
        if(hintVal === undefined){
            console.info("Action Failed")
            return
        }

        if(useSpoilerWall){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setPlayerID(game.getActivePlayer())
    }

    function playCard(){
        console.log("play: " + currentlySelectedCard.index)
        const playVal = game.playCard(playerID, currentlySelectedCard.index)

        if(playVal === undefined){
            console.info("Action Failed")
            return
        }

        // console.log(playVal)
        if(useSpoilerWall){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setPlayerID(game.getActivePlayer())
    }

    function advPlayer(){
        setPlayerID(game.advancePlayer())
    }

    function discardCard(){
        console.log("discard: " + currentlySelectedCard.index)
        const discVal = game.discardCard(playerID, currentlySelectedCard.index)

        if(discVal === undefined){
            console.info("Action Failed")
            return
        }

        if(useSpoilerWall){
            setSpoilerWall(true)
        }

        clearSelectedCard()
        setPlayerID(game.getActivePlayer())
    }

    return (
        <div className="m-2 ">
            <div className="font-bold">
                Welcome to the game page!
            </div>
            <div>
                Players: {game.numPlayers}
            </div>
            { !game.gameInitialized &&
                <div>
                    <button onClick={start} className="rand-button">{game.gameInitialized ? "Restart?" : "Start"}</button>
                    {/* <button onClick={advPlayer} className="rand-button">ADV.</button> */}
                    <button onClick={() => setUseSpoilerWall(!useSpoilerWall)} className="rand-button">Turn Spoiler Wall {useSpoilerWall ? "Off" : "On"}</button>
                </div>
            }
            { game.gameInitialized &&
                <div className="p-2 flex flex-row max-w-[61rem] border-black border-2"> 
                    <div>
                        {/* {console.log(game)} */}
                        {/* <div>Game State:</div> */}
                        <div className="mt-2 ml-4">
                            <div className="mb-1">Tableau:</div>
                            <div className="mt-2 flex flex-row">
                                {Object.entries(game.tableau).map(([suit, card]) => (
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
                            <span className="">Cards left: {game.deck.length}</span>
                            <span className="ml-4">Hint tokens remaining: {game.hints}/{game.hintsUsed + game.hints}</span>
                            <span className="ml-6">Fuses: {game.fuses}</span>
                        </div>
                        { !spoilerWall &&
                        <div className="mt-3">
                            {/* Row Per Player */}
                            <div>
                                {Object.entries(game.getGameImage(playerID).players).map(([playerKey, player]) => (
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
                                                    canSee={playerKey !== playerID} 
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
                        <div className="rand-button" onClick={() => setSpoilerWall(false)}>{playerID + "'s"} Turn - Click To Show</div>
                        }
                        {!game.gameEnded &&
                            <div className="mt-3">
                                {currentlySelectedCard.canSee === true &&
                                <div> {/* Other players card */}
                                    <span  className= "mr-3">
                                        To {currentlySelectedCard.player}:
                                    </span>
                                    {game.hints > 0 &&
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
                                <div className="mt-2"> Game Over! Score: {game.scoreGame()}</div>
                                <button className="rand-button" onClick={start}>Play Again?</button>
                            </div>
                        }
                        <div className="mt-8">
                            <div className="ml-1">Discard:</div>
                            <div className="mt-2 grid grid-cols-6 grid-flow-row w-[29rem] gap-y-4">
                                {game.discard.map((card) => (
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
                            {game.history.map((event) => (
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


export default function HanabiLobby() {

    return (
        <Suspense>
            <ActualHanabiLobby></ActualHanabiLobby>
        </Suspense>

    )
}