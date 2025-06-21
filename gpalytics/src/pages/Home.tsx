import { useState } from 'react';
import ConsultationModal from '../components/ConsultationModal';
import { Link } from 'react-router-dom';
import bgImg from '../assets/bg.png';
import './styles/Home.css'
import { FaUserPlus, FaSignInAlt, FaChevronDown, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaAngleUp } from "react-icons/fa";
import { FiInfo, FiPhone, FiFileText, FiCpu, FiArrowRight, FiChevronRight } from 'react-icons/fi';

function Home() {
    const [showModal, setShowModal] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const [active, setActive] = useState(false);

    return (
        <div className="bg">
            <ConsultationModal show={showModal} onClose={() => setShowModal(false)} />
            <img className='bg-image' src={bgImg} alt="" />
            <nav className="nav-home glossy-sweep mt-4 shadow navbar-expand-md navbar-light fixed-top shadow-sm px-md-3 py-md-2 rounded">
                <div className="container-fluid px-md-3 px-0">
                    <button className="d-md-none d-flex gap-4 align-items-center justify-content-center navbar-toggler w-100 text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <p className="d-flex align-items-center navbar-toggler-icon p-0 m-0">Menu</p>
                        <span><FaChevronDown/></span>
                    </button>

                    <div className="collapse navbar-collapse p-md-2" id="navbarNav">
                        <ul className="navbar-nav gap-2 my-md-0">
                            <li className="nav-item">
                                <a className="nav-link btn btn-outline-primary px-3 d-flex align-items-center justify-content-between" href="#">
                                    <span className='d-flex align-items-center gap-2'><FiInfo size={20} />About</span><FiChevronRight className='d-md-none' size={20} />
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link to="/support-center" className="nav-link btn btn-outline-primary px-3 d-flex align-items-center justify-content-between">
                                    <span className='d-flex align-items-center gap-2'><FiPhone size={20} /> Contact</span><FiChevronRight className='d-md-none' size={20} />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => setShowModal(true)} className="nav-link btn btn-outline-primary px-3 d-flex align-items-center justify-content-between">
                                    <span className='d-flex align-items-center gap-2'><FiCpu size={20} /> AI Chatbot</span><FiChevronRight className='d-md-none' size={20} />
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="px-3 btn btn-outline-primary rounded-md py-md-2 py-3 rounded-md-1 d-flex align-items-center gap-2" href="#">
                                    <FiFileText size={20} /> DOCUMENTS
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="content d-flex align-items-center px-md-5">
                <div className='d-grid gap-3'>
                    <div className="heading text-dark">
                        <p>GP<span className='text-primary'>A</span>lytics</p>
                    </div>
                    <div className="text warp-text text-dark w-50">
                        <p>Optimalkan Performa Akademik Anda dengan GPAlytics - Analisis, Prediksi, dan Rekomendasi Cerdas untuk Mencapai IPK Terbaik!</p>
                    </div>
                    <div className="button d-flex gap-5">
                        <Link to="/signup" className="btn-signup btn px-4 btn-primary shadow d-flex align-items-center gap-2">
                            <FaUserPlus /><span>Sign Up</span>
                        </Link>
                        <Link to="/login" className="btn px-4 btn-outline-primary shadow d-flex align-items-center gap-2">
                            <FaSignInAlt /><span>Sign In</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='overlay-footer footer-hover-container fixed-bottom bottom-0 my-4 text-light'
                onMouseEnter={() => setShowFooter(true)}
                onMouseLeave={() => {setShowFooter(false); setActive(false)}}
            >
                <button className={`btn btn-dark d-flex align-items-center justify-content-between
                button-footer glossy-sweep shadow navbar-expand-md bg-dark shadow-sm px-3 py-2 rounded
                ${active ? "active" : ""}`}
                onClick={() => setActive((prev) => !prev)}
                >
                    <div className='d-flex align-items-center gap-2'><FaAngleUp className='text-dark rounded rounded-full bg-white'/> Footer</div>
                </button>
                <div className={`footer-content rounded bg-dark shadow-lg footer-animated ${showFooter ? 'show' : ''} ${active ? "active" : ""}`} style={{zIndex: 999}}>
                    <div className="container">
                        <div className="row">
                            {/* Logo dan Deskripsi */}
                            <div className="col-md-4 mb-3 pt-3">
                                <h5 className="fw-bold text-primary">GPAlytics</h5>
                                <hr />
                                <p className="small">
                                Platform cerdas untuk menganalisis dan memprediksi performa akademik Anda, membantu mencapai IPK terbaik.
                                </p>
                                <hr />
                            </div>

                            <div className='col-md-8 row'>
                                {/* Navigasi Cepat */}
                                <div className="col-md-4 mt-3">
                                    <h6 className="fw-semibold">Navigasi</h6>
                                    <ul className="list-unstyled small">
                                    <li><a href="#beranda" className="text-light text-decoration-none">Beranda</a></li>
                                    <li><a href="#fitur" className="text-light text-decoration-none">Fitur</a></li>
                                    <li><a href="#tentang" className="text-light text-decoration-none">Tentang Kami</a></li>
                                    <li><a href="#kontak" className="text-light text-decoration-none">Kontak</a></li>
                                    </ul>
                                </div>

                                {/* Alamat dan CTA */}
                                <div className="col-md-4 my-3">
                                    <h6 className="fw-semibold">Alamat</h6>
                                    <address className="small">
                                    GPAlytics HQ<br />
                                    Jl. Intelektual No. 21, Ciputat, Tangerang Selatan<br />
                                    Banten 15419, Indonesia
                                    </address>
                                    <Link to="/signup" className="btn btn-primary btn-sm rounded-pill mt-2">Gabung Sekarang</Link>
                                </div>
                                <div className='col-md-4 mt-3 mb-2'>
                                    <div className="d-flex flex-column gap-2 justify-center gap-6 text-xl">
                                        <a href="https://facebook.com" className='d-flex gap-1 align-items-center' target="_blank" rel="noopener noreferrer">
                                            <FaFacebook size={35} className="hover:text-blue-500 transition" />
                                            <div className='bg-primary text-light p-1 px-2 rounded'>Facebook</div>
                                        </a>
                                        <a href="https://twitter.com" className='d-flex gap-1 align-items-center' target="_blank" rel="noopener noreferrer">
                                            <FaGithub size={35} className="hover:text-sky-400 transition" />
                                            <div className='bg-primary text-light p-1 px-2 rounded'>Github</div>
                                        </a>
                                        <a href="https://instagram.com" className='d-flex gap-1 align-items-center' target="_blank" rel="noopener noreferrer">
                                            <FaInstagram size={35} className="hover:text-pink-500 transition" />
                                            <div className='bg-primary text-light p-1 px-2 rounded'>Instragram</div>
                                        </a>
                                        <a href="https://linkedin.com" className='d-flex gap-1 align-items-center' target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin size={35} className="hover:text-blue-300 transition" />
                                            <div className='bg-primary text-light p-1 px-2 rounded'>LinkedIn</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bawah Footer */}
                        <div className="text-center border-top pt-3 pb-3 small">
                        &copy; {new Date().getFullYear()} GPAlytics. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;