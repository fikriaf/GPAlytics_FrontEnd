import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/bg.webp';
import googleImg from '../assets/google.png';
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import './styles/Login.css';
import { usePassword } from '../hooks/usePassword';
import { useAnimateSignForm } from '../hooks/useAnimateSignForm';
import { useAlert } from '../hooks/useAlert';

const URL = `${import.meta.env.VITE_URL_HOST}/api/mahasiswa`;

function Login() {
    const navigate = useNavigate();
    const [showPassword, togglePassword] = usePassword();
    const { overlayRef, animationClass, handleClose } = useAnimateSignForm('/signup');
    const { alert, showSuccess, showError } = useAlert(2000);
    
    const [remember, setRemember] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.get(`${URL}/${form.email}`)
            const user = res.data
            if (user.password === form.password) {
                showSuccess('Login berhasil!')
                localStorage.clear()
                localStorage.setItem('user', JSON.stringify(user))
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }else{
                showError('Username/Password salah')
            }
        } catch (error) {
            console.error(error)
            showError('Terjadi kesalahan saat login')
        }
    }

    return (
        <>
            <div className="bg">
                <img className='bg-image' src={bgImg} alt="" />
                <div className='d-flex align-items-center h-100'>
                    {alert && (
                        <div
                            className={`alert alert-${alert.type} alert-slide shadow-sm border-0 rounded-4 px-4 py-3 text-white position-fixed top-0 end-0 mt-4 me-4`}
                            role="alert"
                            style={{
                            zIndex: 999999,
                            minWidth: '280px',
                            maxWidth: '90%',
                            backgroundColor: alert.type === 'success' ? '#198754' : '#dc3545',
                            }}
                        >
                            <strong className="me-2">
                            {alert.type === 'success' ? 'Berhasil!' : 'Gagal!'}
                            </strong>
                            <span>{alert.message}</span>
                        </div>
                    )}
                    <div ref={overlayRef} className={`p-5 h-100 rounded text-white loginOverlay formOverlay ${animationClass}`}>
                        <div className='headLogin d-grid'>
                            <h3>Selamat Datang Kembali</h3>
                            <span>Masukkan Email dan Password untuk mengakses</span>
                            <span> akun Anda.</span>
                        </div>
                        <hr />
                        <div className='formnya'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-5 mt-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                    type="email"
                                    className="form-control bg-transparent text-white"
                                    id="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div className="mb-3 position-relative">
                                    <label htmlFor="pwd" className="form-label">Password</label>
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control bg-transparent text-white"
                                    id="pwd"
                                    placeholder="Enter password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    />
                                    <span
                                        onClick={togglePassword}
                                        style={{
                                        position: 'absolute',
                                        top: '55%',
                                        right: '1rem',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        }}
                                        >
                                        {showPassword ? <FiEye size={20} />: <FiEyeOff size={20} />}
                                    </span>
                                </div>
                                <div className="form-check mb-3 mt-4">
                                    <label className="form-check-label">
                                        <input
                                            className="form-check-input bg-transparent"
                                            type="checkbox"
                                            name="remember"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                        /> Remember me
                                    </label>
                                </div>
                                <button type="submit" className="btn button-scale btn-login btn-form shadow text-white w-100 mt-2">
                                    <FiLogIn  /> Log In
                                </button>
                            </form>
                            <hr />
                            <div className='d-grid gap-3 align-items-center justify-content-center my-5 mt-3 py-3'>
                                <div className='loginGoogle'>
                                    <a href="" className='btn button-scale btn-outline-light d-flex gap-2 align-items-center'>
                                        <div className='logoGoogle d-flex align-items-center'>
                                            <img src={googleImg} alt="Google" style={{ width: '20px' }} />
                                        </div>
                                        <div>
                                            <span>Log In with Google</span>
                                        </div>
                                    </a>
                                </div>
                                <div className='swaping d-flex gap-1'>
                                    <span>Tidak punya akun?</span>
                                    <a href="/signup" className='text-decoration-none text-multicolor'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClose();
                                    }}
                                    >Sign Up</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;