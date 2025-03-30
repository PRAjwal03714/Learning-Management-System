import Image from 'next/image'

export function GoogleSignInButton(){
    return (
        <button className=" shadow-2xl shadow-gray-400 mb-3 ml-auto mr-auto h-11 w-85 bg-white hover:bg-gray-200 text-blue-500 font-bold rounded active:bg-blue-100 active:shadow-none">
            <div className='flex justify-center'>
                <div>
                <Image src="/Google-Logo.png" className='ml-3 mr-3' width={25} height={25} alt="google logo"></Image> 
                </div>
                <div>
                    Sign in with Google
                </div>
            </div>
            
        </button>
    );
};

export function FacebookSignInButton() {
    return (
        <button className=" shadow-2xl shadow-gray-400 ml-auto mr-auto h-11 w-85 bg-white hover:bg-gray-200 text-blue-500 font-bold rounded active:bg-blue-100 active:shadow-none">
            <div className='flex justify-center'>
                <div>
                    <svg className='mr-3' aria-hidden="true" width="25" height="25" viewBox="0 0 18 18"><path fill="#4167B2" d="M3 1a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm6.55 16v-6.2H7.46V8.4h2.09V6.61c0-2.07 1.26-3.2 3.1-3.2.88 0 1.64.07 1.87.1v2.16h-1.28c-1 0-1.2.48-1.2 1.18V8.4h2.39l-.31 2.42h-2.08V17z"></path></svg>
                </div>
                <div>
                    Sign in with Facebook
                </div>
            </div>
        </button>
    )
    
}

export default function login() {
    return (
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            <div id='popup' className='flex flex-col shadow-xl shadow-gray-400 bg-blue-50 h-85 w-85 ml-auto mr-auto rounded-sm' >
                <h1 id='loginText' className='text-3xl mt-7 mr-auto ml-auto'>Login</h1>
                <input id='username' placeholder=' UserName' type="email" className='border-1 rounded-sm h-8.5 mt-6 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='passwrd' placeholder=' Password' type="password" className='border-1 rounded-sm h-8.5 mb-6 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <button id='signInBtn' className=' w-3/5 h-11 mb-2 text-bold ml-auto mr-auto rounded-sm bg-white shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-blue-100 active:shadow-none'>Sign In</button>
                <a id='resetPasswrd' href="/reset" className='mt-5 text-blue-500 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>Reset Password</a>
                <span id='toCreate' className='text-black mb-3 mt-2 mr-auto ml-auto'>Dont have an account? Create one <a href='/signup' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>here</a></span>
            </div>
            <div className='flex flex-col mt-5'>
                <GoogleSignInButton />
                <FacebookSignInButton />
            </div>
        </div>
    )
}