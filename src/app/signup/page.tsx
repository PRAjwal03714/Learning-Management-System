export default function signup() {
    return (
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            <div id='popup' className='flex flex-col shadow-xl shadow-gray-400 bg-blue-50 border-1 h-125 w-85 ml-auto mr-auto' >
                <h1 id='signUpText' className='text-3xl mt-8 mr-auto ml-auto'>Sign Up</h1>
                <input id='email' placeholder='Email' type="email" className='border-1 rounded-sm h-8.5 mt-8 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='username' placeholder='Username' type="text" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='password' placeholder='Password' type="password" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='confirmPassword' placeholder='Confirm Password' type="password" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <select id='securityQuestion' defaultValue={'DEFAULT'} className=' text-gray-500 w-9/10 mr-auto mb-3 ml-auto border-1 bg-gray-100 h-8.5 rounded-sm shadow-gray-300 shadow-md hover:bg-gray-200'>
                    <option value='DEFAULT' disabled hidden>Pick a securityQuestion</option>
                    <option value='Q1'>What color is your favorite? </option>
                    <option value='Q2'>What was the name of the town you grew up in?</option>
                    <option value='Q3'>What was the name of your first pet?</option>
                    <option value='Q4'>In what town did you meet your partner?</option>
                </select>  
                <input id='securityAnswer' placeholder='Security Question Answer' type="text" className='border-1 rounded-sm h-8.5 mb-7 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>             
                <button id ='createAccount' className='border-2 w-3/5 h-10 ml-auto mr-auto rounded-sm bg-gray-100 shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Create Account</button>
                <span id='toSignIn' className='text-black mt-5 mr-auto ml-auto'>Already have an account? Sign in <a href='/login' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>here</a></span>
            </div>
        </div>
    )
}