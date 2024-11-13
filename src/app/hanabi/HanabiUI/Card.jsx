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

    const cardClasses = `border-gray-600 bg-gray-500 border-2 p-1 m-1`
    return (
        <span>
            {notInteractable &&
            <span className={`${colorClass} ${cardClasses}`}>
                {`${suit} ${value}`}
            </span>
            ||
            <span onClick={handleClick} className={`${canSee ? colorClass : "text-black"} ${clicked ? "bg-stone-600 hover:bg-stone-500": "hover:bg-stone-400"} ${cardClasses} `}>
                {`${suit} ${value}`}
            </span>
            }
        </span>
    )
}