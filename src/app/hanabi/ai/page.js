'use client'
import Link from "next/link";
import { HanabiAPI, runSingleGame } from "../../lib/hanabiAPI";
import { HanabiDBAI, HanabiDBHuman } from "@/app/lib/hanabiAI";
import { useState } from "react";
import "../../ui/css/random.css"
import { RedirectType, redirect } from "next/navigation";
import { LocalHanabiGame } from "@/app/lib/LocalHanabiGame";
import HanabiGameInterface from "../localGame/hanabiGameInterface";
import { HanabiControllerLocalHotseat, HanabiControllerMultiplayer } from "@/app/lib/hanabiController";

export default function HanabiAIPage() {

    const [numPlayers, setNumPlayers] = useState(2)
    const [numGames, setNumGames] = useState(1)
    const [buttonsClickable, setButtonsClickable] = useState(true)
    const [AIShouldWait, setAIShouldWait] = useState(false)
    const [avgScore, setAvgScore] = useState(undefined)

    function onStartButtonPress(){
        if(numGames < 0 || numGames > 10000){
            console.log("Error Bad number of games")
            return
        }
        // if(numPlayers != 2){
        if(numPlayers < 2 || numPlayers > 5){
            console.log("Error Bad number of players")
            return
        }

        console.log(`Starting ${numGames} game(s) with ${numPlayers} players`)
        // setButtonsClickable(false)
        runGames()
    }

    async function runGames(){
        let score = 0
        for(let i = 0; i < numGames; i++){
            score += await runGame()
        }
        console.log(`Avg. Score from ${numGames} games: ${score*1.0 / numGames}`)
        setAvgScore(score*1.0 / numGames)
        return true
    }

    async function runGame(){
        const players = []
        
        for(let i = 0; i < numPlayers; i++){
            players.push({
                input: new HanabiDBAI(i, false)
            })
        }
        
        const controller = new HanabiControllerMultiplayer(numPlayers, players)

        const score = await controller.runGame()
        console.log(`Score: ${score}`)
        return score
    }

    const [game2Running, setGame2Running] = useState(false)
    const [g2Controller, setG2Controller] = useState({})
    function onStart2ButtonPress(){
        if(numGames < 0 || numGames > 10000){
            console.log("Error Bad number of games")
            return
        }
        if(numPlayers != 2){
            console.log("Error Bad number of players. Only 2 allowed rn")
            return
        }
        console.log(`Starting ${numGames} game2(s) with ${numPlayers}`)
        // const controller = new HanabiControllerMultiplayer(2, [new HanabiDBAI("P1", true), new HanabiDBAI("P2", true)])
        const controller = new HanabiControllerMultiplayer(2, [{input: new HanabiDBHuman(0)}, {input:new HanabiDBAI(1, AIShouldWait)}])
        // const controller = new HanabiControllerMultiplayer(3, [new HanabiDBHuman("P1"), new HanabiDBHuman("P2"), new HanabiDBHuman("P3")])

        controller.runGame()
        setG2Controller(controller)
        setGame2Running(true)
    }

    function AIGoAhead(){
        document.dispatchEvent(new CustomEvent("HanabiAIGoAhead"))
    }

    return (
        <div className="m-4">
            <div className="font-bold">
                Welcome to the Hanabi AI Workspace!
            </div>
            <div>
                <div>
                    Setup AI Game:
                </div>
                <div>
                    <span className="italic">Number of players: </span>
                    <input type="text" name="numPlayers"  value = {numPlayers} placeholder="" className="border-2 p-1" onChange={(event) => buttonsClickable ? setNumPlayers(event.target.value) : () => {}}></input>
                </div>
                <div>
                    <span className="italic">Number games: </span>
                    <input type="text" name="numGames" value = {numGames} placeholder="" className="border-2 p-1" onChange={(event) => buttonsClickable ? setNumGames(event.target.value) : () => {}}></input>
                </div>
                <div onClick={() => buttonsClickable ? onStartButtonPress() : () => {}} className={`${buttonsClickable ? "rand-button" : "rand-button-unclickable"} mt-4 w-40`}>
                    Run Simulation
                </div>
                {avgScore &&
                    <div className="italic ml-6">
                        Avg. Score: {avgScore}
                    </div>
                }


                <div className="mt-4">
                    Play with the AI:
                </div>
                <div>
                    <span className="italic">AI should wait for permission to play: </span>
                    <input type="checkbox" name="aiWaiting" onChange={(event) => setAIShouldWait(event.target.value)} className="border-2 p-1"></input>
                </div>
                <div onClick={() => buttonsClickable ? onStart2ButtonPress() : () => {}} className={`${buttonsClickable ? "rand-button" : "rand-button-unclickable"} mt-4 w-32`}>
                    Play AI
                </div>
                {game2Running && <div className="m-4 h-[700]">
                    {AIShouldWait &&
                        <div onClick={() => buttonsClickable ? AIGoAhead() : () => {}} className={`${buttonsClickable ? "rand-button" : "rand-button-unclickable"} mt-4 w-32`}>
                            Let AI Play Move
                        </div>
                    }
                    <HanabiGameInterface gameController={g2Controller}></HanabiGameInterface>
                </div>}
            </div>
        </div>
    );
}
