'use client'
import Link from "next/link";
import { hanabiGame } from "../../lib/hanabiAPI";
import { useState } from "react";
import "../HanabiUI/css/hanabiPage.css"
import { RedirectType, redirect } from "next/navigation";
import { LocalHanabiGame } from "@/app/lib/LocalHanabiGame";


export default function HanabiLobby() {

    const [numPlayers, setNumPlayers] = useState(-1)


    function onStartButtonPress(){
        if(buildLocalGame()){
            redirect("localGame", RedirectType.push)
        }
    }

    function buildLocalGame(){
        if(numPlayers < 2 || numPlayers > 5){
            console.info("Please use a number from 2-5 inclusive")
            return false
        }

        const game = new LocalHanabiGame(numPlayers)
        sessionStorage.setItem("CurLocalHanabiGame", game.toString())
        console.log("game built")
        return true
    }

    return (
        <div className="m-4">
            <div className="font-bold">
                Welcome to the Hanabi Lobby!
            </div>
            <div>
                <div>
                    Play Local Game:
                </div>
                <div>
                    <span>Number of players: </span>
                    <input type="text" name="numPlayers" placeholder="" className="border-2 p-1" onChange={(event) => setNumPlayers(event.target.value)}></input>
                </div>
                <div>
                    <span>Use Spoiler Wall: </span>
                    <input type="checkbox" name="spoilerWall" placeholder="" className="border-2 p-1"></input>
                </div>
                <div onClick={onStartButtonPress} className="rand-button mt-4 w-32">
                    Start Game
                </div>
                <div className="mt-4">
                    <Link href={"localGame"} className="rand-button mt-4 w-36 ">Restart Game</Link>
                </div>
            </div>
        </div>
    );
}
