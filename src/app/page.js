'use client'
import Image from "next/image";

export default function Home() {
    async function testFetch(){
        const result = await fetch(`/webpage/api/test`)
        console.log(result)
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
                <div onClick={testFetch}>
                        Test
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
