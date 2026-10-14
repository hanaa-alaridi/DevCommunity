'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {NAV_ITEMS} from '@/constants/nav'
import Image from 'next/image'
import { useState } from 'react'

export default function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-3 left-3 z-50 p-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg focus:outline-none" aria-label="Toggle navigation menu">
                {isOpen ? '✕' : '☰'}
            </button>
            {isOpen && (
                <div onClick={() => setIsOpen(false)} className="md:hidden fixed inset-0 bg-black/70 z-40"/>
            )}
            <aside className={`fixed md:static top-0 left-0 z-40 w-64 h-full bg-black border-r border-surface-border min-h-screen p-4 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center gap-2 px-2 pb-6 pt-2 border-b border-surface-border mb-4"> 
                    <Image src="/favicon.ico" alt="DevCommunity Logo" width={32} height={32} className="rounded-lg object-contain"/>
                    <Link href="/dashboard">DevCommunity</Link> 
                </div>
                <ul>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href}  onClick={() => setIsOpen(false)} className={`block py-2 px-4 rounded ${pathname === item.href ? "text-brand bg-zinc-900 border-l-2 border-brand font-medium" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"}`}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    )
}
