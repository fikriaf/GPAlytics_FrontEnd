import axios from 'axios';
import { useIPKData } from '../hooks/useIPK';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Dashboard.css'
import Sidebar from '../components/Sidebar';
import ConsultationModal from '../components/ConsultationModal';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FiGrid } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

const URL = `${import.meta.env.VITE_URL_HOST}/api`;

const GPALyticsDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [Allmatkul, setALLmatkul] = useState<any>([]);
    const {
        isLoading,
        ipkTerakhir,
        ipsTerakhir,
        prediksiIPK,
        data,
        ipsMin,
        ipsMax,
        ipkMin,
        ipkMax,
        semesterInfo,
    } = useIPKData();
    
    let domainMin = ipsMin ? parseFloat((ipsMin - 0.5).toFixed(2)) : ipsMin

    useEffect(() => {
        axios.get(`${URL}/mata-kuliah`)
        .then(res => setALLmatkul(res.data))
        .catch(err => console.log(err))
    },[])

    return (
        <>
            <div className="dashboard container-fluid min-vh-100 bg-light">
                <div className="row">
                    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    <div className='upper d-md-none d-flex fixed-top align-items-center justify-content-between p-2 ps-3 bg-primary mb-1'>
                        <div className='m-0 p-0 text-light d-flex align-items-center gap-2' style={{fontSize: '1.5rem'}}>
                            <FiGrid size={24} />Dashboard
                        </div>
                        <button className="btn py-2 px-3 border border-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <FontAwesomeIcon className='text-light' icon={faBars} />
                        </button>
                    </div>
                    <div className="bottomer col-md-10 p-2 ms-auto">
                        <div className="row g-2" style={{ minHeight: '100vh', maxHeight: '100vh' }}>
                            <div className="col-md-4">
                                <div className="bg-white h-100 p-3 rounded shadow-sm d-flex flex-column justify-content-center">
                                    <h6 className='d-flex gap-2'>
                                        <div>IPK</div>
                                        {isLoading && (
                                            <div className="d-flex justify-content-center align-items-center top-0 end-50">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            </div>
                                        )}
                                    </h6>
                                    <h2 className="text-success">{ipkTerakhir !== null ? ipkTerakhir : '_._'} ↑</h2>
                                    <p className="text-muted m-0">Increase compared to last week</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="bg-white h-100 p-3 rounded shadow-sm d-flex flex-column justify-content-center">
                                    <h6 className='d-flex gap-2'>
                                        <div>IPS</div>
                                        {isLoading && (
                                            <div className="d-flex justify-content-center align-items-center top-0 end-50">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            </div>
                                        )}
                                    </h6>
                                    <h2>{ipsTerakhir !== null ? ipsTerakhir : '_._'}</h2>
                                    <p className="text-muted m-0">You got {ipsTerakhir !== null ? ipsTerakhir : '_._'} out of 4</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="bg-white h-100 p-3 rounded shadow-sm d-flex flex-column justify-content-center">
                                    <h6 className='d-flex gap-2'>
                                        <div>Prediksi IPK Berikutnya</div>
                                        {isLoading && (
                                            <div className="d-flex justify-content-center align-items-center top-0 end-50">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                            </div>
                                        )}
                                    </h6>
                                    <h2 className="text-primary">{prediksiIPK !== null ? prediksiIPK : '_._'}</h2>
                                    <a className='text-decoration-none' href="#">Selengkapnya →</a>
                                </div>
                            </div>

                            {/* Mata Kuliah */}
                            <div className="col-md-6">
                                <div className="bg-white h-100 p-3 rounded shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-2 mx-3 me-4">
                                        <h6 className='d-flex align-items-center m-0 gap-2'>
                                            <div>Mata Kuliah</div>
                                            {isLoading ? (
                                                <div className="d-flex justify-content-center align-items-center top-0 end-50">
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                                </div>
                                            ) : (
                                                <span className='badge bg-info text-dark'>{Allmatkul.length}</span>
                                            )}
                                        </h6>
                                        <span className='d-flex m-0 p-0 fw-semibold'>Tugas | UTS | UAS</span>
                                    </div>
                                    <ul className="list-group list-group-flush normal-scroll" style={{height: '10rem', overflowY: 'auto'}}>
                                        {Allmatkul.length > 0 ? (
                                            Allmatkul.map((item: any, index: number) => (
                                                <li key={index} className={`list-group-item d-flex justify-content-between 
                                                ${index%2 == 0? 'bg-light' : 'bg-white'}`}
                                                >
                                                    <span>{item.nama_mk}</span>
                                                    <span>{item.penilaian.tugas}% | {item.penilaian.uts}% | {item.penilaian.uas}%</span>
                                                </li>
                                            ))
                                        ): (
                                            <li className="list-group-item text-muted">Belum ada mata kuliah</li>
                                        )}
                                    </ul>
                                    <a className='text-decoration-none' href="#">Selengkapnya →</a>
                                </div>
                            </div>

                            {/* Grafik IPK */}
                            <div className="col-md-6">
                                <div className="bg-white h-100 p-3 rounded shadow-sm">
                                    <div className="d-flex justify-content-between">
                                        <h6 className='d-flex gap-2'>
                                            <div>Grafik IPK</div>
                                            {isLoading && (
                                                <div className="d-flex justify-content-center align-items-center top-0 end-50">
                                                    <div className="spinner-border spinner-border-sm text-primary" role="status" />
                                                </div>
                                            )}
                                        </h6>
                                        <span>Semester ▼</span>
                                    </div>
                                    <ResponsiveContainer key={data.length} className="pe-4" width="100%" height={150}>
                                        <LineChart data={data}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                                            <YAxis domain={[domainMin?? 2, 4]} label={{ value: "IPK", angle: -90, position: "insideLeft" }} />
                                            <Tooltip />
                                            <Legend verticalAlign="top" align="right" />
                                            {/* Garis IPK */}
                                            <Line
                                                type="monotone"
                                                dataKey="ipk"
                                                stroke="#0d6efd"
                                                strokeWidth={3}
                                                dot={{ r: 4, stroke: '#0d6efd', strokeWidth: 2, fill: '#ffffff' }}
                                                activeDot={{ r: 6, stroke: '#0d6efd', strokeWidth: 3, fill: '#ffffff' }}
                                                name="IPK"
                                            />

                                            {/* Garis IPS */}
                                            <Line
                                                type="monotone"
                                                dataKey="ips"
                                                stroke="#ffc107"
                                                strokeWidth={3}
                                                dot={{ r: 4, stroke: '#ffc107', strokeWidth: 2, fill: '#ffffff' }}
                                                activeDot={{ r: 6, stroke: '#ffc107', strokeWidth: 3, fill: '#ffffff' }}
                                                name="IPS"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className="d-flex justify-content-between mt-2">
                                        <small>IPS Tertinggi/Sem: {ipsMax} - {semesterInfo.semesterMaxips}</small>
                                        <small>IPK Tertinggi/Thn: {ipkMax} - 2023</small>
                                    </div>
                                </div>
                            </div>

                            {/* AI Consultant */}
                            <div className="col-md-4 aiDesktop">
                                <div className="bg-white h-100 p-3 rounded shadow-sm d-flex flex-column justify-content-between">
                                <div>
                                    <h6 className="fw-bold mb-1 d-flex align-items-center">
                                        🤖 AI Consultant
                                        <span className="badge bg-success ms-2">Online</span>
                                    </h6>
                                    <p className="text-muted small mb-2">Siap bantu kamu kapan saja!</p>

                                    <div className='d-flex flex-column gap-1'>
                                        <button className="rounded p-1 small text-muted btn btn-outline-primary" style={{ fontStyle: 'italic'}}>
                                        “Analisis Data Akademik Saya”
                                        </button>
                                        <button className="rounded p-1 small text-muted btn btn-outline-primary" style={{ fontStyle: 'italic'}}>
                                        “Buatkan Jadwal Belajar 1 Mingggu”
                                        </button>
                                        <button className="rounded p-1 small text-muted btn btn-outline-primary" style={{ fontStyle: 'italic'}}>
                                        “Jelaskan apa itu Neural Network?”
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-1">
                                    <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>
                                    Buka Konsultasi
                                    </button>
                                </div>
                                </div>
                            </div>

                            <div className='aiMobile d-md-none w-auto position-fixed bottom-0 end-0'>
                                <button className='btn btn-primary p-2 px-3 m-4 rounded' onClick={() => setShowModal(true)} style={{fontSize: "1.3rem", fontWeight: "600", zIndex: "999999999"}}>
                                    🤖 AI Consultant
                                </button>
                            </div>

                            <ConsultationModal show={showModal} onClose={() => setShowModal(false)} />

                            {/* Nilai Tertinggi */}
                            <div className="col-md-4">
                                <div className="bg-white h-100 p-3 rounded shadow-sm">
                                    <h6>Mata kuliah Dengan Nilai Tertinggi</h6>
                                    <ul className="list-group">
                                        <li className="list-group-item">KOMPUTASI BERBASIS WEB - 4</li>
                                        <li className="list-group-item">SOFTWARE ENGINEERING - 3.7</li>
                                        <li className="list-group-item">STATISTIKA DASAR - 3.5</li>
                                        <li className="list-group-item">BASIS DATA - 3.3</li>
                                    </ul>
                                    <a className='text-decoration-none' href="#">Selengkapnya →</a>
                                </div>
                            </div>

                            {/* Rekomendasi */}
                            <div className="col-md-4">
                                <div className="bg-white h-100 p-3 rounded shadow-sm">
                                    <h6>Rekomendasi Mata Kuliah</h6>
                                    <span className="badge bg-primary me-2">Sistem digital</span>
                                    <span className="badge bg-secondary">Psikologi</span>
                                    <br />
                                    <a className='text-decoration-none' href="#">Selengkapnya →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GPALyticsDashboard;

