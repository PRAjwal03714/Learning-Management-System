export default function signUp() {
    return (
        <div className='flex h-6/8 justify-center content-center'>
            <div className='flex flex-col h-full w-2/6 justify-center'>
                <div className='flex flex-col shadow-xl shadow-gray-400 bg-blue-50 border-1 h-3/8' >
                    <h1 className='flex justify-center text-3xl mt-7'>Login</h1>
                    <input placeholder='UserName' type="email" className='border-1 rounded-sm h-8.5 mt-8 mb-3 ml-3.5 w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                    <input placeholder='Password' type="password" className='border-1 rounded-sm h-8.5 mb-9 ml-3.5 w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                    <button className='border-2 w-3/5 h-1/7 ml-13.5 rounded-md bg-gray-100 shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Sign In</button>
                </div>
            </div>
        </div>
    )
}