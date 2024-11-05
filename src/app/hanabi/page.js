'use client'
import Image from "next/image";
import { hanabiGame } from "../lib/hanabiAPI";
import { useState } from "react";
import "./hanabiPage.css"


export default function Hanabi() {

    // const localHanabiGame = {}
    let key = 0;
    const getKey = () => {
        key = key + 10
        return key
    }

    const {initGame, getGame} = hanabiGame()
    const [game, setGame] = useState(getGame)

    const test = () => {
        initGame()
        console.log(getGame)
        setGame(getGame)
    }

    return (
        <div>
            <div className="font-bold">
                Hello!
            </div>
            <div>
                This is HL
            </div>
            <div>
                <button onClick={test}>Test</button>
            </div>
            {game.gameInitialized &&
                <div className="bg-gray-500"> 
                    <div>
                        GAME:
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
