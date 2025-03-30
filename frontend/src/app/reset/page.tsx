export default function passwordReset() {
    return (
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            <div id='popup' className=' rounded-sm flex flex-col shadow-xl shadow-gray-400 bg-blue-50 border-1 h-80 w-85 ml-auto mr-auto' >
                <h1 id='resetPasswrdText' className='text-3xl mt-8 mr-auto ml-auto'>Reset Password</h1>
                <span id='prompt' className=" text-center text-gray-500 mt-5 mr-auto ml-auto">Enter your Username and we'll send you a code to reset your password.</span>                    
                <input id='username' placeholder=' UserName' type="email" className='border-1 rounded-sm h-8.5 mt-5 mb-6 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <button id='resetPasswrdBtn' className='border-2 w-3/5 h-10 ml-auto mr-auto rounded-md bg-gray-100 shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Reset Password</button>
                <span id='toLogin' className='text-black mb-3 mt-5 mr-auto ml-auto'>Return to <a href='/login' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>login</a></span>
            </div>
        </div>
    )
}
