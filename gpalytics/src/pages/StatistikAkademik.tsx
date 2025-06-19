import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/StatistikAkademik.css'
import Sidebar from '../components/Sidebar'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FiBarChart2 } from 'react-icons/fi';


import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const distribusiNilai = [
  { range: '90 - 100', jumlah: 4 },
  { range: '80 - 89', jumlah: 9 },
  { range: '70 - 79', jumlah: 7 },
  { range: '60 - 69', jumlah: 5 },
  { range: '< 60', jumlah: 2 },
];

const ipSemester = [
  { semester: '1', ip: 3.2 },
  { semester: '2', ip: 3.5 },
  { semester: '3', ip: 3.6 },
  { semester: '4', ip: 3.4 },
  { semester: '5', ip: 3.8 },
  { semester: '6', ip: 3.7 },
];

const prediksiIpkData = [
  { semester: '1', ipk: 3.2 },
  { semester: '2', ipk: 3.4 },
  { semester: '3', ipk: 3.5 },
  { semester: '4', ipk: 3.55 },
  { semester: '5', ipk: 3.58 },
  { semester: '6', ipk: 3.60 },
  { semester: '7', ipk: 3.62 },
  { semester: '8', ipk: 3.64 },
];

const regresiData = [
  { semester: 1, nilai: 76, prediksi: 77.2 },
  { semester: 2, nilai: 79, prediksi: 80.1 },
  { semester: 3, nilai: 83, prediksi: 83.0 },
  { semester: 4, nilai: 85, prediksi: 85.9 },
  { semester: 5, nilai: 88, prediksi: 88.8 },
  { semester: 6, nilai: 91, prediksi: 91.7 },
];


const data = [
    { semester: 1, tugas: 80, uts: 74, uas: 67 },
    { semester: 2, tugas: 75, uts: 76, uas: 80 },
    { semester: 3, tugas: 73, uts: 80, uas: 95 },
    { semester: 4, tugas: 77, uts: 86, uas: 70 },
    { semester: 5, tugas: 83, uts: 79, uas: 78 },
    { semester: 6, tugas: 88, uts: 77, uas: 84 },
    { semester: 7, tugas: 91, uts: 81, uas: 90 },
    { semester: 8, tugas: 89, uts: 80, uas: 95 },
];

const StatistikAkademik = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="statistik-akademik container-fluid min-vh-100 bg-light">
            <div className="row">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className='upper d-md-none d-flex fixed-top align-items-center justify-content-between p-2 ps-3 bg-primary mb-1'>
                    <div className='m-0 p-0 text-light d-flex align-items-center gap-2' style={{fontSize: '1.5rem'}}>
                        <FiBarChart2 size={24} />Statistik
                    </div>
                    <button className="btn py-2 px-3 border border-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FontAwesomeIcon className='text-light' icon={faBars} />
                    </button>
                </div>
                <div className="bottomer col-md-10 pt-2 ms-auto">
                  {/* Statistik Ringkasan */}
                    <div className="row g-2 mb-3">
                      {/* Mata Kuliah */}
                      <div className="col-md-4">
                          <div className="border-start border-4 border-primary bg-white rounded shadow p-4 h-100">
                          <p className="text-uppercase text-secondary fw-semibold mb-2 small">Jumlah Mata Kuliah</p>
                          <h1 className="fw-bold text-dark display-6 mb-0">27</h1>
                          <p className="text-muted small mt-1">Total dari seluruh semester</p>
                          </div>
                      </div>

                      {/* Jumlah SKS */}
                      <div className="col-md-4">
                          <div className="border-start border-4 border-success bg-white rounded shadow p-4 h-100">
                          <p className="text-uppercase text-secondary fw-semibold mb-2 small">Jumlah SKS</p>
                          <h1 className="fw-bold text-dark display-6 mb-0">87<span className="text-muted fs-5"> / 144</span></h1>
                          <p className="text-muted small mt-1">Total SKS lulus dibanding maksimum</p>
                          </div>
                      </div>

                      {/* Rata-rata Nilai */}
                      <div className="col-md-4">
                          <div className="border-start border-4 border-warning bg-white rounded shadow p-4 h-100">
                          <p className="text-uppercase text-secondary fw-semibold mb-2 small">Rata-rata Nilai</p>
                          <h1 className="fw-bold text-dark display-6 mb-0">83.4</h1>
                          <p className="text-muted small mt-1">Skor gabungan seluruh semester</p>
                          </div>
                      </div>
                    </div>
                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                        <h5 className="fw-semibold mb-3">Semua Nilai</h5>
                        <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                            <YAxis domain={[0, 100]} label={{ value: "Nilai", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend verticalAlign="top" align="right" />
                            <Line type="monotone" dataKey="tugas" stroke="#d1d1d1" strokeWidth={3} name="Tugas" />
                            <Line type="monotone" dataKey="uts" stroke="#007bff" strokeWidth={3} name="UTS" />
                            <Line type="monotone" dataKey="uas" stroke="#28a745" strokeWidth={3} name="UAS" />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
<div className="bg-white rounded shadow-sm p-4 mb-2">
  <h5 className="fw-semibold mb-3">Distribusi Nilai Mahasiswa</h5>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={distribusiNilai}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="range" label={{ value: "Range", position: "insideBottom", offset: -5 }} />
      <YAxis label={{ value: "Jumlah", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Bar dataKey="jumlah" fill="#0d6efd" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

<div className="bg-white rounded shadow-sm p-4 mb-2">
  <h5 className="fw-semibold mb-3">Indeks Prestasi per Semester</h5>
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={ipSemester}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
      <YAxis domain={[0, 4]} label={{ value: "IPK", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Line type="monotone" dataKey="ip" stroke="#ffc107" strokeWidth={3} dot={{ r: 5 }} />
    </LineChart>
  </ResponsiveContainer>
</div>
<div className="bg-white rounded shadow-sm p-4 mb-2">
  <h5 className="fw-semibold mb-3">Prediksi IPK Akhir</h5>

  {/* Kontrol prediksi */}
  <div className="row g-3 mb-2">
    <div className="col-md-4">
      <label className="form-label fw-semibold">Semester Saat Ini</label>
      <select className="form-select">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <option key={s}>Semester {s}</option>
        ))}
      </select>
    </div>
    <div className="col-md-4">
      <label className="form-label fw-semibold">Target Nilai Tiap Matkul</label>
      <select className="form-select">
        <option value="A">A (90-100)</option>
        <option value="B+">B+ (80-89)</option>
        <option value="B">B (70-79)</option>
      </select>
    </div>
    <div className="col-md-4">
      <label className="form-label fw-semibold">Bobot SKS Tersisa</label>
      <input type="number" className="form-control" defaultValue={60} />
    </div>
  </div>

  {/* Hasil prediksi */}
  <div className="alert alert-info d-flex justify-content-between align-items-center">
    <div>
      Dengan skenario ini, <strong>prediksi IPK akhir kamu</strong> adalah:
    </div>
    <h3 className="fw-bold text-primary m-0">3.64</h3>
  </div>

  {/* Grafik prediksi */}
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={prediksiIpkData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
      <YAxis domain={[0, 4]} label={{ value: "IPK", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Line type="monotone" dataKey="ipk" stroke="#20c997" strokeWidth={3} />
    </LineChart>
  </ResponsiveContainer>
</div>

<div className="bg-white rounded shadow-sm p-4 mb-2">
  <h5 className="fw-semibold mb-3">Regresi Linier: Prediksi Nilai Akhir per Semester</h5>

  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={regresiData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
      <YAxis domain={[0, 100]} label={{ value: "Nilai", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="nilai" stroke="#0d6efd" strokeWidth={3} name="Nilai Akhir" />
      <Line type="monotone" dataKey="prediksi" stroke="#ffc107" strokeWidth={3} strokeDasharray="5 5" name="Regresi" />
    </LineChart>
  </ResponsiveContainer>

  <div className="mt-3 text-muted small">
    Persamaan regresi: <code>y = 2.87x + 74.3</code> <br />
    Nilai R²: <strong>0.89</strong> → tren meningkat cukup kuat
  </div>
</div>

                    
                </div>
            </div>
        </div>
    );
};

export default StatistikAkademik;
