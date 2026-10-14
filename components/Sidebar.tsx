'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {NAV_ITEMS} from '@/constants/nav'
import Image from 'next/image'

export default function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="w-64 h-full bg-black border-r border-surface-border min-h-screen p-4">
            <div className="flex items-center gap-2 px-2 pb-6 pt-2 border-b border-surface-border mb-4"> 
                <Image src="/favicon.ico" alt="DevCommunity Logo" width={32} height={32} className="rounded-lg object-contain"/>
                <Link href="/dashboard">DevCommunity</Link> 
            </div>
            <ul>
                {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                        <Link href={item.href} className={`block py-2 px-4 rounded ${pathname === item.href ? "text-brand bg-zinc-900 border-l-2 border-brand font-medium" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"}`}>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}