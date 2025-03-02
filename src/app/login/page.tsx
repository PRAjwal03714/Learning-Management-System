export default function login() {
    return (
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            <div id='popup' className='flex flex-col shadow-xl shadow-gray-400 bg-blue-50 border-1 h-80 w-85 ml-auto mr-auto' >
                <h1 id='loginText' className='text-3xl mt-7 mr-auto ml-auto'>Login</h1>
                <input id='username' placeholder='UserName' type="email" className='border-1 rounded-sm h-8.5 mt-6 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='passwrd' placeholder='Password' type="password" className='border-1 rounded-sm h-8.5 mb-6 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <button id='signInBtn' className='border-2 w-3/5 h-10 ml-auto mr-auto rounded-md bg-gray-100 shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Sign In</button>
                <a id='resetPasswrd' href="/reset" className=' text-blue-500 mt-5 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>Reset Password</a>
                <span id='toCreate' className='text-black mb-3 mt-2 mr-auto ml-auto'>Dont have an account? Create one <a href='/signup' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>here</a></span>
            </div>
        </div>
    )
}