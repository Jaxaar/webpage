'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation'
import "./NavBar.css"


export default function NavBar() {
    return (
        <ul className = "nav-container h-14">
            <li className="nav-item">
                <div className="button-box">
                    <Link  href= "/" className={usePathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
                </div>
            </li>
            <li className="nav-item">
                <div className="button-box">
                    <Link  href= "/hanabi/lobby" className={usePathname ==='/hanabi/lobby' ? 'nav-link active' : 'nav-link'}>Hanabi</Link>
                </div>
            </li>
            <li className="nav-item">
                <div className="button-box">
                    <Link  href= "/hanabi/ai" className={usePathname ==='/hanabi/ai' ? 'nav-link active' : 'nav-link'}>Hanabi AI</Link>
                </div>
            </li>
        </ul>
    );
}
