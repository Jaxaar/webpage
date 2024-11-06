'use client'
import Link from "next/link";
import { hanabiGame } from "../../lib/hanabiAPI";
import { useState } from "react";
import "../hanabiPage.css"


export default function HanabiLobby() {



    return (
        <div>
            <div className="font-bold">
                Hello!
            </div>
            <div>
                This is Hanabi Local
            </div>
            <div>
                <Link href={"localGame?players=4"} className="rand-button">To Game</Link>
            </div>
        </div>
    );
}
