export default function login() {
    return (
        <div className='flex h-6/8 justify-center content-center'>
            <div className='flex flex-col h-full w-2/6 justify-center'>
                <div className='flex flex-col shadow-xl shadow-gray-400 bg-blue-50 border-1 h-90 w-75 ml-auto mr-auto' >
                    <h1 className='text-3xl mt-8 mr-auto ml-auto'>Login</h1>
                    <input placeholder='UserName' type="email" className='border-1 rounded-sm h-8.5 mt-8 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                    <input placeholder='Password' type="password" className='border-1 rounded-sm h-8.5 mb-9 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                    <button className='border-2 w-3/5 h-1/7 ml-auto mr-auto rounded-md bg-gray-100 shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Sign In</button>
                    <a href="/reset" className=' text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>Reset Password</a>
                    <span className='text-black mb-3 mt-3 mr-auto ml-auto'>Dont have an account? Create one <a href='/signup' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>here</a></span>
                </div>
            </div>
        </div>
    )
}