import Layout from "@/components/Layout";

export default function dashboard() {
    return (
        <Layout>
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            
            <div id = 'Class1 Module' className= 'flex flex-col justify-center p-2'>
                <div id ='Class1-title-section' className = 'flex items-center justify-center border-2 border-black border-solid p-2 max-w-xs h-15 relative'>
                    <h1 id = 'Class1-name' className='flex items-center justify-center max-w-xs h-15'>Class Name</h1>
                    <h1 id = 'Class1-grade' className= 'top-right absolute top-1 right-2 text-sm'>100.00% - A</h1>
                </div>
                <h1 id = 'class-Body' className ='flex items-center border-2 border-black border-solid border-t-0 p-2 max-w-xs h-25'>Class Body here</h1>
            </div>
            
        </div>
        </Layout>
    )}