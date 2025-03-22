'use client'
import { useState } from "react"
import "../css/random.css"
import { colorDict } from "@/app/lib/hanabiConsts"
import Image from 'next/image';


export default function Card({suit, value, player, canSee, cardSelected, index, notInteractable}) {

    const cardsAsImages = true
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
        <span className="m-1">
            {cardsAsImages && 
                <span>
                    {notInteractable &&
                        <Image
                        src={`/webpage/Cards/${value === 0 ? "Blank" : suit}-${value}.png`} 
                        width={80}
                        height={1} 
                        alt={`fireworks ${suit}-${value}`}
                        className=" m-2"    
                        ></Image>
                    ||
                        <Image
                            src={`/webpage/Cards/${suit === "Card" ? "CardBack" : suit}${suit !== "Card" ? `-${value}` : ""}.png`} 
                            width={80}
                            height={1} 
                            alt={`fireworks ${suit}-${value}`}
                            onClick={handleClick}
                            className={` ${clicked ? "border-4 border-green-600 hover:border-green-500": "hover:border-2 border-green-400"} `} 
                        ></Image>
                    }
                </span>
                ||
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
            }
        </span>
    )
}