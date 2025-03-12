'use client'
import { useState, useEffect, useRef } from "react";
import "../../ui/css/random.css"
import { Suspense } from 'react'
import HanabiGameInterface from "./hanabiGameInterface";
import { HanabiControllerLocalHotseat } from "@/app/lib/hanabiController";


function ActualHanabiLobby() {

    const [controller, setcontroller] = useState({})
    const [controllerLoaded, setControllerLoaded] = useState(false)

    useEffect(() =>{        
        const hanabiMetaData = JSON.parse(sessionStorage.getItem("LoadingHanabiGameMetaData"))
        const contr = new HanabiControllerLocalHotseat(hanabiMetaData?.numPlayers , hanabiMetaData?.spoilerWall)
        setcontroller(contr)
        setControllerLoaded(true)
      }, [])


    return (
        <div>
            {controllerLoaded &&
                <HanabiGameInterface gameController={controller}></HanabiGameInterface>
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