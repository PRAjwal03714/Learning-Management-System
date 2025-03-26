import { ReactNode } from "react";
import Sidebar from "./SideBar";

export default function Layout({children}: {children: ReactNode}){
    return(
        <div className="flex h-screen">
            {/*SideBar on the left */}
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-100 overflow=auto">{children}</main>
        </div>
    )
}