'use client'
import Image from "next/image";
import { GET, logMsgL, POST, POSTjson } from "./lib/requests";

export default function Home() {

    const apiURLExtension = `/api/v1`
    const apiURLBase = `${window.location.protocol}//${window.location.hostname}:3001${apiURLExtension}`

    async function testLogin(){
        const response = await POSTjson(`${apiURLBase}/login`, {
            body_json: {
                username: "testUser",
                password: "test"
            },
            onErr: logMsgL("Error /w login post"),
            // useJWT: true,
        });
        console.log(response)
    }

    async function testGet(){
        const response = await GET(`${apiURLBase}/xyz`, {
            onErr: logMsgL("Error /w post"),
            // useJWT: true,
        });
        console.log(response)
    }

    async function testPost(){
        const response = await POSTjson(`${apiURLBase}/`, {
            body_json: {
                text: ""
            },
            onErr: logMsgL("Error /w post"),
            useJWT: true,
        });
        console.log(response)
    }

    return (
        <div>
            <div className="font-bold">
                Hello!
            </div>
            <div>
                WIP... I Hope... Maybe got shelved... Idk
            </div>
            <div>
                <div onClick={testLogin}>
                        Test Login
                </div>
                <div onClick={testGet}>
                        Test Get
                </div>
                <div onClick={testPost}>
                        Test Post
                </div>
            </div>
            <div>
            {/* <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/fOk8Tm815lE?si=Z_uSqLuBfIaVq1a9&amp;start=846&autoplay=true&end=850" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerpolicy="strict-origin-when-cross-origin" 
                allowfullscreen></iframe> */}
            </div>
        </div>
    );
}
