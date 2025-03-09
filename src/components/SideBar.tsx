"use client";
import Link from "next/link";
import { useState } from "react";
import {Home,Settings,Menu,ChevronLeft} from "lucide-react";

const sidebarItems = [
    {name: "Dashboard", href:"/dashboard", icon: <Home size = {20}/>},
    {name: "Settings", href:"/settings",icon: <Settings size={20} />}
];

export default function Sidebar(){
    const [isOpen, setIsOpen] = useState(true); // Side Bar open/not open
    return(
        <aside className={`h-screen bg-gray-900 text-white p-4 transition-all duration-300 ${
            isOpen ? "w-64" : "w-25"
          } flex flex-col`}>
            {/* Open Close sidebar*/}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 relative z-50 h-12 p-4 mt-18">
            {isOpen && <span className="text-lg font-bold">Menu</span>}
                <button
                    onClick = {() => setIsOpen(!isOpen)}
                    className="p-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 transition"
                >
                    {isOpen ? <ChevronLeft size = {24}/> : <Menu size = {24}/>}
                </button>
            </div>
            {/*Side Bar*/}
            <nav className="mt-4 space-y-2 flex-grow">
                <ul>
                    {sidebarItems.map((item) => (
                        <li key = {item.name}>
                            <Link 
                                href = {item.href} 
                                className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-700 ${
                                    isOpen ? "gap-3" : "justify-center"
                                  }`}>
                            {item.icon} {/* Always showing icon */}
                            {isOpen && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}