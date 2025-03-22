'use client'
import Link from "next/link";
import { useState } from "react";
import "../../../app/ui/css/random.css"
import { RedirectType, redirect } from "next/navigation";
import { useEffect } from "react";


export default function HanabiLobby() {

    let key = 0;
    function getKey() {
        key = key + 1
        return key
    }

    const maxPlayers = 5

    // const [numPlayers, setNumPlayers] = useState(-1)
    const [numPlayers, setNumPlayers] = useState(2)
    const [playerSelector, setPlayerSelector] = useState([])
    const [playerNames, setplayerNames] = useState(["","","","",""])


    useEffect(() => {
        setPlayerSelector(Array.from({length: maxPlayers}, (_, index) => "Human"))
        setplayerNames(Array.from({length: maxPlayers}, (_, index) => `P${index+1}`))
    }, [])
    useEffect(() => {


    }, [playerSelector])

    // const [update, setUpdate] = useState(true)
    // function forceUpdate(){
    //      setUpdate(!update)
    // }
    // console.log("Update")

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

        const playerData = playerNames.map((k, i) => {
            return {name: k, input: playerSelector[i]}
        })

        const hanabiMetaData = {
            numPlayers: numPlayers,
            playerData: playerData,
            spoilerWall: false,
        }
        sessionStorage.setItem("LoadingHanabiGameMetaData", JSON.stringify(hanabiMetaData))
        console.log("game built")
        return true
    }

    function updateListState(updateFunction, originalArray,  index, newValue){
        const newArr = [...originalArray]
        newArr[index] = newValue
        updateFunction(newArr)
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
                    <select 
                        value={numPlayers} 
                        onChange={(event) => setNumPlayers(event.target.value)} 
                    >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    {/* <input type="text" name="numPlayers" placeholder="2-5" className="border-2 p-1" onChange={(event) => setNumPlayers(event.target.value)}></input> */}
                </div>
                <div>
                    {(Array.from({length: numPlayers}, (_, index) => index)).map((index) => (
                        <div key={index}>
                            <span>Player {index+1}: </span>
                            <span>
                                <select 
                                    value={playerSelector[index]} 
                                    onChange={(event) => {
                                        updateListState(setPlayerSelector, playerSelector, index, event.target.value)
                                        // console.log(playeSelector)
                                        }} 
                                    >
                                    <option value="Human">Human</option>
                                    <option value="AIv1 ">Radish</option>
                                    <option value="AIv1">AI v.1</option>
                                </select>
                            </span>
                            <span>
                                
                                <input type="text" value={playerNames[index]} placeholder="name" className="border-2 p-1" onChange={(event) => {
                                    // playerNames[index] = event.target.value
                                    updateListState(setplayerNames, playerNames, index, event.target.value)
                                    // console.log(playerNames)
                                    // forceUpdate()
                                }}></input>
                            </span>
                        </div>
                    ))}
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

                
                {/* <div className="mt-10">
                    {["Red", "Blue", "Green", "Yellow", "White"].map((color) =>(
                        <div key={color} className="flex flex-row">
                            {[1,2,3,4,5].map((num) => (
                                <div key={color + num}>
                                    <Image
                                        src={`/Cards/${color}-${num}.png`} 
                                        width={100}
                                        height={1} 
                                        alt={`fireworks ${color}-${num}...`}
                                        className="hover:border-2 border-green-300 m-2"
                                        
                                    ></Image>
                                </div>
                            ))}
                        </div>
                    ))}
                    <Image
                        src={`/Cards/CardBack.png`} 
                        width={100}
                        height={1} 
                        alt={`fireworks CB...`}
                        className="hover:border-2 border-green-300 m-2"
                                        
                    ></Image>
                </div> */}
            </div>
        </div>
    );
}
