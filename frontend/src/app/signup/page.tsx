'use client'

import { GoogleSignInButton } from "../login/page"
import { FacebookSignInButton } from "../login/page"
import React, { ChangeEvent, ChangeEventHandler, useState} from 'react'

export default function signup() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [securityQuestion, setSecurityQuestion] = useState('Pick a security question')
    const [securityAnswer, setSecurityAnswer] = useState('')
    
    function handleEmail(e: React.FormEvent<HTMLInputElement>) {
        setEmail(e.currentTarget.value)
    }

    function handleUsername(e: React.FormEvent<HTMLInputElement>) {
        setUsername(e.currentTarget.value)
    }

    function handlePassword(e: React.FormEvent<HTMLInputElement>) {
        setPassword(e.currentTarget.value)
    }

    function handleConfirmPassword(e: React.FormEvent<HTMLInputElement>) {
        setConfirmPassword(e.currentTarget.value)
    }

    function handleSecurityQuestion(e: React.FormEvent<HTMLSelectElement>) {
        setSecurityQuestion(e.currentTarget.value)
    }

    function handleSecurityAnswer(e: React.FormEvent<HTMLInputElement>) {
        setSecurityAnswer(e.currentTarget.value)
    }

    const createAccount = () => {
        const message = {
            "name":username,
            "email":email,
            "password":password,
            "role":"student",
            "securityQuestion": securityQuestion,
            "securityAnswer": securityAnswer,
        }

        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
    }

    return (
        <div id='wrapper' className='flex flex-col h-full w-full justify-center'>
            <div id='popup' className='rounded-sm flex flex-col shadow-xl shadow-gray-400 bg-blue-50 h-125 w-85 ml-auto mr-auto mb-5' >
                <h1 id='signUpText' className='text-3xl mt-8 mr-auto ml-auto'>Sign Up</h1>
                <input id='email' value={email} type="email" onInput={e => handleEmail(e)} placeholder=' Email' className='border-1 rounded-sm h-8.5 mt-8 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='username' value={username} onInput={e => handleUsername(e)} placeholder=' Username' type="text" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='password' value={password} onInput={e => handlePassword(e)} placeholder=' Password' type="password" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <input id='confirmPassword' value={confirmPassword} onInput={e => handleConfirmPassword(e)} placeholder=' Confirm Password' type="password" className='border-1 rounded-sm h-8.5 mb-3 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>
                <select id='securityQuestion' value={securityQuestion} onInput={e => handleSecurityQuestion(e)} className=' text-gray-500 w-9/10 mr-auto mb-3 ml-auto border-1 bg-gray-100 h-8.5 rounded-sm shadow-gray-300 shadow-md hover:bg-gray-200'>
                    <option value='DEFAULT'  disabled hidden>Pick a security question</option>
                    <option value='Q1'>What is your favorite color? </option>
                    <option value='Q2'>In what town were you born?</option>
                    <option value='Q3'>What was the name of your first pet?</option>
                    <option value='Q4'>In what town did you meet your partner?</option>
                </select>  
                <input id='securityAnswer' value={securityAnswer} onChange={e => handleSecurityAnswer(e)} placeholder=' Security Question Answer' type="text" className='border-1 rounded-sm h-8.5 mb-7 ml-auto mr-auto w-9/10 bg-gray-100 shadow-gray-300 shadow-md hover:bg-gray-200 active:bg-gray-100'></input>             
                <button id ='createAccount' onClick={createAccount} className=' w-3/5 h-10 ml-auto mr-auto rounded-sm bg-white shadow-gray-300 shadow-md hover:bg-blue-50 active:bg-blue-100 active:shadow-none'>Create Account</button>
                <span id='toSignIn' className='text-black mt-5 mr-auto ml-auto'>Already have an account? Sign in <a href='/login' className='text-blue-500 mt-8 mr-auto ml-auto hover:underline active:underline active:text-blue-300'>here</a></span>
            </div>
            <GoogleSignInButton />
            <FacebookSignInButton />
        </div>
    )
}
