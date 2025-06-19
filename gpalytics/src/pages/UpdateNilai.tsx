import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/UpdateMahasiswa.css'
import Sidebar from '../components/Sidebar'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const UpdateNilai = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="update-nilai container-fluid max-vh-100 bg-light">
            <div className="row">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className='upper d-md-none fixed-top d-flex items-align-center justify-content-between p-2 ps-3 bg-primary mb-1'>
                    <h1 className='m-0 text-light'>Update Nilai</h1>
                    <button className="btn py-2 px-3 border border-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FontAwesomeIcon className='text-light' icon={faBars} />
                    </button>
                </div>
                <div className="bottomer col-md-10 p-2 h-100 ms-auto">
                    <h6 className="fw-bold border-bottom border-2 p-3 border-primary bg-white rounded rounded-bottom-0 p-2">
                        Pengaturan Penilaian
                    </h6>

                    <div className='d-flex flex-md-row flex-column'>
                        <div className='h-100 w-100'>
                            {/* Edit Bobot */}
                            <form className="col-md-6 border w-100 rounded p-3 mb-1 bg-white shadow-sm">
                                {/* Pilih Mata Kuliah */}
                                <div className="border rounded p-3 mb-3 bg-white shadow-sm">
                                    <label htmlFor="matkul" className="form-label fw-semibold">Pilih Mata Kuliah:</label>
                                    <select id="matkul" className="form-select">
                                        <option>Komputasi Berbasis Web</option>
                                        <option>Algoritma & Struktur Data</option>
                                        <option>AI Dasar</option>
                                        <option>Pemrograman Lanjut</option>
                                    </select>
                                </div>
                                <h6 className="fw-bold mb-3">Edit Bobot Penilaian (%)</h6>

                                {[
                                ['Tugas', 30],
                                ['UTS', 30],
                                ['UAS', 30],
                                ['Partisipasi', 10],
                                ].map(([label, defaultVal], idx) => (
                                <div key={idx} className="mb-3 row align-items-center">
                                    <label className="col-sm-4 col-form-label">Bobot {label}</label>
                                    <div className="col-sm-3">
                                    <input type="number" className="form-control" defaultValue={defaultVal} />
                                    </div>
                                    <div className="col-sm-1">%</div>
                                </div>
                                ))}

                                <div className="row align-items-center">
                                    <label className="col-sm-4 col-form-label text-primary">Total</label>
                                    <div className="col-sm-3">
                                        <input type="number" className="form-control bg-light" value={100} disabled />
                                    </div>
                                    <div className="col-sm-1">%</div>
                                </div>
                                {/* Tombol */}
                                <div className="d-flex gap-2 justify-content-end mt-4">
                                    <button type="reset" className="btn btn-danger px-4">Reset</button>
                                    <button type="submit" className="btn btn-success px-4">Simpan</button>
                                </div>
                            </form>
                            <div className="border rounded p-3 bg-white shadow-sm pb-4">
                                <h6 className="fw-bold mb-3">🕒 Riwayat Perubahan</h6>

                                <ul className="list-unstyled small text-muted">
                                    <li className="mb-2">
                                    <span className="text-success fw-semibold">✔️ 12 Juni 2025</span> — Bobot UTS diubah dari <strong>40%</strong> → <strong>30%</strong>
                                    </li>
                                    <li className="mb-2">
                                    <span className="text-success fw-semibold">✔️ 10 Juni 2025</span> — Tambah aturan konversi nilai <strong>{'< 40'}</strong> → <strong>0.0</strong>
                                    </li>
                                </ul>

                                <div className="text-end">
                                    <button className="btn btn-sm btn-outline-secondary">Lihat Semua</button>
                                </div>
                                </div>

                        </div>

                        {/* Edit Konversi Nilai */}
                        <form className=" col-md-6 border rounded p-3 bg-white shadow-sm">
                            <h6 className="fw-bold mb-3">Edit Konversi Nilai ke Skala 4.0</h6>

                            {[
                            ['>= 90', '4.0'],
                            ['>= 80', '3.7'],
                            ['>= 75', '3.3'],
                            ['>= 70', '3.0'],
                            ['>= 65', '2.7'],
                            ['>= 60', '2.3'],
                            ['>= 55', '2.0'],
                            ['>= 50', '1.7'],
                            ['>= 40', '1.0'],
                            ['< 40', '0.0'],
                            ].map(([rule, skor], idx) => (
                            <div key={idx} className="mb-2 row align-items-center">
                                <div className="col-sm-4 text-muted">Jika nilai {rule}</div>
                                <div className="col-sm-3">Konversi ke</div>
                                <div className="col-sm-2">
                                <input type="number" step="0.1" className="form-control" defaultValue={skor} />
                                </div>
                            </div>
                            ))}

                            {/* Tombol */}
                            <div className="d-flex gap-2 justify-content-end mt-4">
                            <button type="reset" className="btn btn-danger px-4">Reset</button>
                            <button type="submit" className="btn btn-success px-4">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNilai;
