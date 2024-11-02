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
                    <Link  href= "/hanabi" className={usePathname === '/hanabi' ? 'nav-link active' : 'nav-link'}>Hanabi</Link>
                </div>
            </li>
        </ul>
    );
}
