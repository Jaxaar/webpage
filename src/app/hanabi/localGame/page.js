'use client'
import Image from "next/image";
import { HanabiGame } from "../../lib/hanabiAPI";
import Card from "../HanabiUI/Card";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import "../HanabiUI/css/hanabiPage.css"


export default function HanabiLobby() {

    const params = useSearchParams()

    // const localHanabiGame = {}
    let key = 0;
    function getKey() {
        key = key + 1
        return key
    }
    const numPlayers = params.get("players") ? params.get("players") : 4
    

    // const {initGame, getGameState, playCard, getActivePlayer} = hanabiGame()
    const [game, setGame] = useState(new HanabiGame())
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

    // let fullGame = game.getGameState()
    
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
        game.initGame(numPlayers)
        // fullGame = game.getGameState()
        // setGame(game.getGameState(playerID))
        
        // console.log(game.getGameState())
        // console.log(game.getGameState(playerID))
        // console.log(game)

        clearSelectedCard()
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
        if(type === "suit"){
            console.log("Hint suit")


        } else if (type === "value"){
            console.log("Hint value")


        }
        game.playCard(playerID, type, targetPlayer)
        
        clearSelectedCard()
    }

    function playCard(){
        console.log("play: " + currentlySelectedCard.index)
        const playVal = game.playCard(playerID, currentlySelectedCard.index)
        // console.log(playVal)
        clearSelectedCard()
        setPlayerID(game.getActivePlayer())
    }

    function advPlayer(){
        setPlayerID(game.advancePlayer())
    }

    function discardCard(){
        console.log("disc")

        clearSelectedCard()
    }

    return (
        <div className="m-2 ">
            <div className="font-bold">
                Welcome to the game page!
            </div>
            <div>
                Players: {numPlayers}
            </div>
            <button onClick={start} className="rand-button">Start</button>
            <button onClick={advPlayer} className="rand-button">ADV.</button>



            { game.game.gameInitialized &&
                <div className="bg-gray-500 p-2"> 
                    {/* {console.log(game)} */}
                    <div>
                        GAME State:
                    </div>
                    {/* Row Per Player */}
                    <div>
                        {Object.entries(game.getGameState(playerID).players).map(([playerKey, player]) => (
                            <div key={playerKey} className="flex flex-row">
                                <div className="m-2">
                                    {player.activePlayer 
                                    && <span className = "ml-1.5">{" > "}</span> 
                                    || <span className= "ml-5"></span>
                                    }
                                    <span className="">{player.name}: </span>
                                </div>
                                <div className="grid grid-cols-6 w-10/12 max-w-screen-sm">
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
                    <div>
                        {currentlySelectedCard.canSee === true &&
                        <div> {/* Other players card */}
                            <span  className= "mr-3">
                                To {currentlySelectedCard.player}:
                            </span>
                            <button onClick={() => hint("suit")} className= "mr-3">
                                Hint: {currentlySelectedCard.suit}
                            </button>
                            <button onClick={() => hint("value")}>
                                Hint: {currentlySelectedCard.value}'s
                            </button>
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
                </div>
            }
        </div>
    );
}
