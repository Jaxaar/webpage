'use client'
import { useState } from "react"
import "./css/hanabiPage.css"
import { colorDict } from "@/app/lib/hanabiConsts"


export default function Card({suit, value, player, canSee, cardSelected, index, notInteractable}) {


    const colorClass = colorDict[suit] ? colorDict[suit] : "text-black"
    const [clicked, setClicked] = useState(false)

    function handleClick(){
        if(clicked){
            cardSelected("", 0, "", undefined, () => {})
            return
        }
        setClicked(!clicked)
        cardSelected(suit, value, player, canSee, setClicked, index)
    }

    return (
        <span>
            {notInteractable &&
            <span className={`${colorClass} border-gray-600 border-2 p-1 m-1`}>
                {`${suit} ${value}`}
            </span>
            ||
            <span onClick={handleClick} className={`${canSee ? colorClass : "text-black"} ${clicked ? "card-clicked": ""} border-gray-600 border-2 p-1 m-1 card`}>
                {`${suit} ${value}`}
            </span>
            }
        </span>
    )
}