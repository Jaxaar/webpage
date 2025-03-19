'use client'
import { useState, useEffect, useRef } from "react";
import "../../ui/css/random.css"
import { Suspense } from 'react'
import HanabiGameInterface from "./hanabiGameInterface";
import { HanabiControllerLocalHotseat } from "@/app/lib/hanabiController";
import { HanabiDBAIv1 } from "@/app/lib/HanabiPlayers/hanabiAI";
import { HanabiDBHuman } from "@/app/lib/HanabiPlayers/HanabiHumans";


function ActualHanabiLobby() {

    const [controller, setcontroller] = useState({})
    const [controllerLoaded, setControllerLoaded] = useState(false)

    useEffect(() =>{        
        const hanabiMetaData = JSON.parse(sessionStorage.getItem("LoadingHanabiGameMetaData"))
        
        const players = []
        for(let i = 0; i < hanabiMetaData.playerData.length; i++){
            players[i] = createNewPlayer(hanabiMetaData.playerData[i])
        }
        // console.log(hanabiMetaData)
        // console.log(players)

        const contr = new HanabiControllerLocalHotseat(hanabiMetaData.numPlayers, players, hanabiMetaData?.spoilerWall)
        contr.runGame()
        setcontroller(contr)
        setControllerLoaded(true)
      }, [])

    function createNewPlayer(data){
        switch (data.input.toLowerCase().replaceAll(" ", "")){
            case "human":
                return new HanabiDBHuman(data.name)
                // break
            case "aiv1":
                return new HanabiDBAIv1(data.name)
                // break
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