'use client'
import Layout from "@/components/Layout";


function classButton() {
    console.log("Class Button pressed")
}
export default function dashboard() {
    return (
        <Layout>
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            
            {/*Class Module Structure*/}
            <div id = 'Class1 Module' className= 'flex flex-col justify-center p-2'>
                <div id ='Class1-title-section' className = 'flex items-center justify-center max-w-xs h-12 relative'>
                    <button 
                        id = 'Class1-name'
                        onClick={classButton}
                        className='w-full h-full flex items-center justify-center max-w-xs h-12 border-solid border-2 border-black bg-blue-500 text-white rounded-t-lg hover:bg-blue-600 transition'>Class Name</button>
                    <h1 id = 'Class1-grade' className= 'absolute top-1 right-2 text-sm'>100.00% - A</h1>
                </div>
                <h1 id = 'class-Body' className ='flex items-center bg-gray-400 border-2 border-black border-solid p-2 border-t-0 rounded-b-lg hover:bg-gray-500 max-w-xs h-32'>Class Body here</h1>

            </div>
            
        </div>
        <div>
            {/*Upcoming Section*/}
            <div id = "Upcoming button" className = "flex flex-col absolute top-20 right-30 max-w-xs p-r-5 border-solid border-2 ">
                <button 
                    id = "Upcoming"
                    onClick = {classButton}
                    className = "bg-purple-200 w-full"
                >Upcoming</button>
            </div>
        </div>
        </Layout>
    )}