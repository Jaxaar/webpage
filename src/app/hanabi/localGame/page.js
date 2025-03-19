'use client'
import { useState, useEffect, useRef } from "react";
import "../../ui/css/random.css"
import { Suspense } from 'react'
import HanabiGameInterface from "./hanabiGameInterface";
import { HanabiControllerLocalHotseat } from "@/app/lib/hanabiController";
import { HanabiDBAI, HanabiDBHuman } from "@/app/lib/hanabiAI";


function ActualHanabiLobby() {

    const [controller, setcontroller] = useState({})
    const [controllerLoaded, setControllerLoaded] = useState(false)

    useEffect(() =>{        
        const hanabiMetaData = JSON.parse(sessionStorage.getItem("LoadingHanabiGameMetaData"))
        
        const players = []
        for(let i = 0; i < hanabiMetaData.numPlayers; i++){
            players[i] = createNewPlayer(hanabiMetaData.playerTypes?.[i], i, hanabiMetaData.playerNames?.[i])
        }
        // console.log(hanabiMetaData)
        // console.log(players)

        const contr = new HanabiControllerLocalHotseat(hanabiMetaData.numPlayers, players, hanabiMetaData?.spoilerWall)
        contr.runGame()
        setcontroller(contr)
        setControllerLoaded(true)
      }, [])

    function createNewPlayer(type, id, name){
        switch (type.toLowerCase().replaceAll(" ", "")){
            case "human":
                return {
                    input: new HanabiDBHuman(id),
                    name: name,
                }
                // break
            case "aiv1":
                return {
                    input: new HanabiDBAI(id),
                    name: name,
                }                // break
        }


    }


    return (
        <div>
            <div className="font-bold ml-2">
                Welcome to the game page!
            </div>
            {(controllerLoaded &&
                <HanabiGameInterface gameController={controller}></HanabiGameInterface>
             ) ||
             <div className="ml-2">
                Loading game...
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