import './css/Login.css'

import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useCookies } from 'react-cookie';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../api/login';
import { postRegister } from '../api/register';

function Login() {
    const usernameRefLogin = useRef(null)
    const passwordRefLogin = useRef()
    const usernameRef = useRef(null)
    const passwordRef = useRef()
    const emailRef = useRef()

    const { dispatch } = useContext(AppContext);
    const [, setCookie] = useCookies(['jwt'])
    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: postLogin,
        onSuccess: data => {
            queryClient.setQueryData(["login", data.ut.at], data)
            queryClient.invalidateQueries(["login"], { exact: true })

            const token = {
                token: data.ut.at,
                rt: data.ut.rt,
                user: data.username
            }

            dispatch({
                type: 'ADD_TOKEN',
                payload: token
            })

            setCookie('jwt', data.ut.at)
            setCookie('jwtRT', data.ut.rt)
            navigate('/')
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    const registerMutation = useMutation({
        mutationFn: postRegister,
        onSuccess: data => {
            queryClient.invalidateQueries(["register"], { exact: true })

            alert(data.message)
        },
        onError: error => {
            alert(error.response.data.message)
        }
    })

    function handleSubmitLogin(e) {
        e.preventDefault();
        const data = {
            username: usernameRefLogin.current.value,
            password: passwordRefLogin.current.value
        }
        loginMutation.mutate(data)
    }

    function handleSubmitRegister(e) {
        e.preventDefault();
        const data = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        registerMutation.mutate(data)
    }

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
            <div className="container p-3 rounded shadow-lg border border-secondary-subtle loginScreen" style={{
                backgroundColor: '#f4f4f4',
            }}>
                <div className="card p-3 border-0 bg-transparent">
                    <ul className="nav nav-pills nav-justified mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="pills-login-tab" data-bs-toggle="pill" data-bs-target="#pills-login" type="button" role="tab" aria-controls="pills-login" aria-selected="true">Login</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pills-register-tab" data-bs-toggle="pill" data-bs-target="#pills-register" type="button" role="tab" aria-controls="pills-register" aria-selected="false">Register</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab">
                            <form onSubmit={handleSubmitLogin}>
                                <div className="form mb-4">
                                    <label htmlFor="loginUsername" className="form-label">Username</label>
                                    <input type='text' id='loginUsername' className='form-control' placeholder='Username' ref={usernameRefLogin} />
                                </div>
                                <div className="form mb-4">
                                    <label htmlFor="loginPassword" className="form-label">Password</label>
                                    <input type='password' id='loginPassword' className='form-control' placeholder='Password' ref={passwordRefLogin} />
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Link to='#'>Forgot password?</Link>
                                </div>
                                <div className='d-grid mt-4 mb-4'>
                                    <button disabled={loginMutation.isLoading} className='btn btn-primary'>Sign in</button>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="pills-register-tab">
                            <form onSubmit={handleSubmitRegister}>
                                <div className="form mb-4">
                                    <label htmlFor="registerUsername" className="form-label">Username</label>
                                    <input type='text' id='registerUsername' ref={usernameRef} className='form-control' placeholder='Enter your username' />
                                </div>
                                <div className="form mb-4">
                                    <label htmlFor="registerEmail" className="form-label">Email address</label>
                                    <input type='email' id='registerEmail' ref={emailRef} className='form-control' placeholder='Enter your Email address' />
                                </div>
                                <div className="form mb-4">
                                    <label htmlFor="registerPassword" className="form-label">Password</label>
                                    <input type='password' id='registerPassword' ref={passwordRef} className='form-control' placeholder='Enter your Password' />
                                </div>
                                <div className='d-grid mt-4 mb-4'>
                                    <button disabled={registerMutation.isLoading} className='btn btn-primary'>Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;