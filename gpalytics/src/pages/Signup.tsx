import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from '../assets/bg.webp';
import googleImg from '../assets/google.png';
import './styles/Signup.css';
import axios from 'axios'
import { FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { usePassword } from '../hooks/usePassword';
import { useAnimateSignForm } from '../hooks/useAnimateSignForm';
import { useAlert } from '../hooks/useAlert';

const URL = `${import.meta.env.VITE_URL_HOST}/api/mahasiswa`;

function Signup() {
    const navigate = useNavigate();
    const [showPassword, togglePassword] = usePassword();
    const { overlayRef, animationClass, handleClose } = useAnimateSignForm('/login');
    const { alert, showSuccess, showError } = useAlert(2000);
    const [acceptance, setAcceptace] = useState(false);
    const [form, setForm] = useState({
        nama: '',
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post(URL, form);
            console.log(res.data)
            if (!res.data) {
                showError(res.data.message || 'Registrasi gagal.');
                return;
            }
            showSuccess('Selamat Datang di GPAlytics!')
            localStorage.clear()
            localStorage.setItem('user', JSON.stringify(res.data));
            setForm({ nama: '', email: '', password: '' });
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Terjadi kesalahan saat menambahkan data';
            showError(msg);
        }

    };

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
                    <div ref={overlayRef} className={`p-5 h-100 rounded text-white signupOverlay formOverlay ${animationClass}`}>
                        <div className='headLogin pb-4 d-flex px-5 mx-3'>
                            <h3 className='text-multicolor'>Mulai Sekarang !</h3>
                        </div>
                        <div className='formnya'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 mt-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                    type="text"
                                    className="form-control bg-transparent text-white"
                                    id="name"
                                    placeholder="Enter name"
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    required
                                    />
                                </div>
                                <div className="mb-3">
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
                                        checked={acceptance}
                                        onChange={(e) => setAcceptace(e.target.checked)}
                                        required
                                        />{' '}
                                        Saya menyetujui <a href="/kebijakan" className="text-decoration-none text-multicolor">Kebijakan</a> dan <a href="/privasi" className="text-decoration-none text-multicolor">Privasi</a>
                                    </label>
                                </div>
                                <button type="submit" className="btn button-scale btn-form w-100 mt-2 shadow text-light"><FiLogIn /> Sign Up</button>
                            </form>

                            <div className='d-grid gap-3 align-items-center justify-content-center my-5 py-3'>
                                <div className='loginGoogle'>
                                    <a href="" className='btn button-scale btn-outline-light d-flex gap-2 align-items-center'>
                                        <div className='logoGoogle d-flex align-items-center'>
                                            <img src={googleImg} alt="Google" style={{ width: '20px' }} />
                                        </div>
                                        <div>
                                            <span>Sign Up with Google</span>
                                        </div>
                                    </a>
                                </div>
                                <div className='swaping d-flex gap-1'>
                                    <span>Sudah punya akun?</span>
                                    <a href="/login" className='text-decoration-none text-multicolor'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClose();
                                    }}
                                    >Log In</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;