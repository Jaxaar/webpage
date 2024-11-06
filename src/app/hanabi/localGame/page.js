'use client'
import Image from "next/image";
import { hanabiGame } from "../../lib/hanabiAPI";
import { useState } from "react";
import { useSearchParams } from 'next/navigation'
import "../hanabiPage.css"


export default function HanabiLobby() {

    const params = useSearchParams()

    // const localHanabiGame = {}
    let key = 0;
    function getKey() {
        key = key + 10
        return key
    }
    const numPlayers = params.get("players") ? params.get("players") : 4
    const playerID = "P1"
    

    const {initGame, getGameState, castHandsToCards} = hanabiGame()
    const [game, setGame] = useState(getGameState)

    let fullGame = getGameState()




    function start() {
        initGame(numPlayers)
        fullGame = getGameState()
        console.log(getGameState())
        setGame(castHandsToCards(getGameState(playerID)))
        console.log(getGameState(playerID))
    }

    return (
        <div>
            <div className="font-bold">
                Welcome to the game page!
            </div>
            <div>
                Players: {numPlayers}
            </div>
            <div>
                <button onClick={start} className="rand-button">Start</button>
            </div>







            {game.gameInitialized &&
                <div className="bg-gray-500"> 
                    <div>
                        GAME State:
                    </div>
                    {Object.entries(game.players).map(([playerKey, player]) => (
                        <div key={playerKey}>
                            <div>{player.name}</div>
                            {player.hand.map((card) =>(
                                <span className={card.suit} key={getKey()}>{card.toString()}, </span>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
