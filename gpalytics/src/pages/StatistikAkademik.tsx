import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/StatistikAkademik.css'
import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { getListNilaiTertinggi } from '../services/Nilai';
import type { NilaiMatkulDenganAkhir } from '../services/Nilai';
import Sidebar from '../components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FiBarChart2 } from 'react-icons/fi';
import {
    BarChart, Bar, LineChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

import {
  getDistribusiNilai,
  getIPSPerSemester,
  getIPKPredictionData,
  getRegresiDataLinear,
  getTugasUTSUASData
} from '../services/statistikAkademik';


type DistribusiItem = { range: string; jumlah: number };
type IPSItem = { semester: string; ips: number | null };
type IPKPrediksiItem = { semester: string; ipk: number };
type RegresiItem = { semester: number; nilai: number; prediksi?: number };
type NilaiRataItem = { semester: number; tugas: number; uts: number; uas: number };

const StatistikAkademik = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { getProfile } = useProfile();

    const [distribusi, setDistribusi] = useState<DistribusiItem[]>([]);
    const [ips, setIPS] = useState<IPSItem[]>([]);
    const [ipkPrediksi, setIpkPrediksi] = useState<IPKPrediksiItem[]>([]);
    const [tugasUtsUas, setTugasUtsUas] = useState<NilaiRataItem[]>([]);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const id_mahasiswa = user?._id;

      if (!id_mahasiswa) return;

      async function fetchData() {
        setDistribusi(await getDistribusiNilai(id_mahasiswa));
        setIPS(await getIPSPerSemester(id_mahasiswa));
        setIpkPrediksi(await getIPKPredictionData(id_mahasiswa));
        setTugasUtsUas(await getTugasUTSUASData(id_mahasiswa));
      }

      fetchData();
    }, []);

    const [regresi, setRegresi] = useState<{ semester: number; nilai: number | null; prediksi: number; }[]>([]);
    const [persamaan, setPersamaan] = useState<string>('');
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const id_mahasiswa = user?._id;

      if (!id_mahasiswa) return;
      async function fetchData() {
        const hasil = await getRegresiDataLinear(id_mahasiswa);
        setRegresi(hasil.data);
        setPersamaan(hasil.persamaan);
      }
      fetchData();
    }, []);

    const [prediksiManual, setPrediksiManual] = useState(false)
    const [semesterSekarang, setSemesterSekarang] = useState<number>(1);
    const [targetNilai, setTargetNilai] = useState<'A' | 'B+' | 'B'>('A');
    const [sksTersisa, setSksTersisa] = useState<number>(60);
    const [prediksiIPK, setPrediksiIPK] = useState<{ semester: string, ipk: number }[]>([]);
    const [prediksiNilaiAkhir, setPrediksiNilaiAkhir] = useState<number>(0);

    function getTargetIPK(nilai: string): number {
      switch (nilai) {
        case 'A': return 4.0;
        case 'B+': return 3.5;
        case 'B': return 3.0;
        default: return 3.0;
      }
    }
    function hitungPrediksiIPK() {
      const target = getTargetIPK(targetNilai);

      const dataSebelum = ipkPrediksi.filter((d) => +d.semester <= semesterSekarang);
      const sksSebelum = dataSebelum.length * 20;
      const totalSks = sksSebelum + sksTersisa;

      const totalMutuSebelum = dataSebelum.reduce((sum, d) => sum + d.ipk * 20, 0);
      const totalMutuTarget = target * sksTersisa;
      const prediksiAkhir = (totalMutuSebelum + totalMutuTarget) / totalSks;

      const prediksiData = [...dataSebelum];
      let sisaSemester = Math.ceil(sksTersisa / 20);
      for (let i = 1; i <= sisaSemester; i++) {
        prediksiData.push({
          semester: (semesterSekarang + i).toString(),
          ipk: target
        });
      }

      setPrediksiIPK(prediksiData);
      setPrediksiNilaiAkhir(parseFloat(prediksiAkhir.toFixed(2)));
    }
    useEffect(() => {
      hitungPrediksiIPK();
    }, [semesterSekarang, targetNilai, sksTersisa, ipkPrediksi]);


    const [listNilai, setListNilai] = useState<NilaiMatkulDenganAkhir[] | null>(null);
    const [jumlahSKS, setJumlahSKS] = useState<number>()
    useEffect(() => {
        const fetchNilai = async () => {
            if (!getProfile?._id) return;
            const data = await getListNilaiTertinggi(getProfile?._id);
            setListNilai(data ?? null);
            const totalSKS = data.reduce((acc: number, item: any) => acc + item.sks, 0);
            setJumlahSKS(totalSKS);
        };
        fetchNilai();
    }, [getProfile?._id]);
    
    const [rataRata, setRataRata] = useState(0);
    useEffect(() => {
      if (!tugasUtsUas.length) return;

      const total = tugasUtsUas.reduce(
        (sum, item) => sum + item.tugas + item.uts + item.uas,
        0
      );
      const rata = total / (tugasUtsUas.length * 3);
      setRataRata(+rata.toFixed(2));
    }, [tugasUtsUas]);

    const semuaNilai = tugasUtsUas.flatMap(item => [item.tugas, item.uts, item.uas]);
    const nilaiMinimum = Math.floor(Math.min(...semuaNilai));
    const semuaIPS = ips.flatMap(item => item.ips ? [item.ips] : []);
    const nilaiMinimumIPS = Math.min(...semuaIPS);
    const semuaIPK = prediksiIPK.flatMap(item => item.ipk ? [item.ipk] : []);
    const nilaiMinimumIPK = Math.min(...semuaIPK);
    const semuaRegresi = regresi.flatMap(item => [item.prediksi]);
    const nilaiMinimumRegresi = Math.floor(Math.min(...semuaRegresi));

    console.log(nilaiMinimumRegresi)

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
                          <h1 className="fw-bold text-dark display-6 mb-0">{listNilai?.length || '__'}</h1>
                          <p className="text-muted small mt-1">Total dari seluruh semester</p>
                          </div>
                      </div>

                      {/* Jumlah SKS */}
                      <div className="col-md-4">
                          <div className="border-start border-4 border-success bg-white rounded shadow p-4 h-100">
                          <p className="text-uppercase text-secondary fw-semibold mb-2 small">Jumlah SKS</p>
                          <h1 className="fw-bold text-dark display-6 mb-0">{jumlahSKS ?? '__'}<span className="text-muted fs-5"> / 144</span></h1>
                          <p className="text-muted small mt-1">Total SKS lulus dibanding maksimum</p>
                          </div>
                      </div>

                      {/* Rata-rata Nilai */}
                      <div className="col-md-4">
                          <div className="border-start border-4 border-warning bg-white rounded shadow p-4 h-100">
                          <p className="text-uppercase text-secondary fw-semibold mb-2 small">Rata-rata Nilai</p>
                          <h1 className="fw-bold text-dark display-6 mb-0">{rataRata ?? '__._'}</h1>
                          <p className="text-muted small mt-1">Skor gabungan seluruh semester</p>
                          </div>
                      </div>
                    </div>


                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                        <h5 className="fw-semibold mb-3">Semua Nilai</h5>
                        <ResponsiveContainer key={tugasUtsUas.length} width="100%" height={300}>
                          <LineChart data={tugasUtsUas}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                              <YAxis domain={[nilaiMinimum? nilaiMinimum-10 : 20, 100]} label={{ value: "Nilai", angle: -90, position: "insideLeft" }} />
                              <Tooltip />
                              <Legend verticalAlign="top" align="right" />
                              <Line type="monotone" dataKey="tugas" stroke="#d1d1d1" strokeWidth={3} name="Tugas" />
                              <Line type="monotone" dataKey="uts" stroke="#007bff" strokeWidth={3} name="UTS" />
                              <Line type="monotone" dataKey="uas" stroke="#28a745" strokeWidth={3} name="UAS" />
                              <ReferenceLine y={rataRata} stroke="#ffc107" strokeDasharray="3 3"
                              label={{
                                value: `Rata-rata (${rataRata})`,
                                position: "top",
                                fill: "#ffc107",
                                fontSize: 15,
                                fontWeight: "bold",
                              }}
                              />
                          </LineChart>
                        </ResponsiveContainer>
                    </div>


                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                      <h5 className="fw-semibold mb-3">Distribusi Nilai</h5>
                      <ResponsiveContainer key={distribusi.length} width="100%" height={250}>
                        <BarChart data={distribusi}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" label={{ value: "Range", position: "insideBottom", offset: -5 }} />
                          <YAxis label={{ value: "Jumlah", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Bar dataKey="jumlah" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    
                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                      <h5 className="fw-semibold mb-3">Regresi Linier: Prediksi Nilai Akhir per Semester</h5>

                      <ResponsiveContainer key={regresi.length} width="100%" height={250}>
                        <LineChart data={regresi}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                          <YAxis domain={[nilaiMinimumRegresi? nilaiMinimumRegresi-10 : 20, 100]} label={{ value: "Nilai", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="nilai" stroke="#0d6efd" strokeWidth={3} name="Nilai Akhir" />
                          <Line type="monotone" dataKey="prediksi" stroke="#ffc107" strokeWidth={3} strokeDasharray="5 5" name="Regresi" />
                        </LineChart>
                      </ResponsiveContainer>

                      <div className="mt-3 text-muted large fw-bold">
                        Persamaan regresi: <code>{persamaan}</code> <br />
                      </div>
                    </div>



                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                      <h5 className="fw-semibold mb-3">Indeks Prestasi per Semester</h5>
                      <ResponsiveContainer key={ips.length} width="100%" height={250}>
                        <LineChart data={ips}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                          <YAxis domain={[nilaiMinimumIPS?parseFloat((nilaiMinimumIPS-0.2).toFixed(2)):2, 4]} label={{ value: "IPS", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="ips" stroke="#ffc107" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>


                    <div className="bg-white rounded shadow-sm p-4 mb-2">
                      <div className='d-flex justify-content-between'>
                        <h5 className="fw-semibold mb-3">Prediksi IPK Akhir</h5>
                        <div className="form-check form-switch">
                          <label className="form-check-label" htmlFor="togglePrediksi">
                            {prediksiManual ? 'Manual On' : 'Manual Off'}
                          </label>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="togglePrediksi"
                            checked={prediksiManual}
                            onChange={() => setPrediksiManual(!prediksiManual)}
                          />
                        </div>
                      </div>

                      {/* Kontrol prediksi */}
                      <div className="row g-3 mb-2">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Semester Saat Ini</label>
                            <select className="form-select" value={semesterSekarang} onChange={(e) => setSemesterSekarang(+e.target.value)}
                              disabled={!prediksiManual}
                              >
                              {ipkPrediksi.map((s) => (
                                <option key={s.semester} value={s.semester}>Semester {s.semester}</option>
                              ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Target Nilai Tiap Matkul</label>
                          <select className="form-select" value={targetNilai} onChange={(e) => setTargetNilai(e.target.value as any)}
                            disabled={!prediksiManual}
                            >
                            <option value="A">A (90-100)</option>
                            <option value="B+">B+ (80-89)</option>
                            <option value="B">B (70-79)</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Bobot SKS Tersisa</label>
                          <input
                            type="number"
                            className="form-control"
                            value={sksTersisa}
                            onChange={(e) => setSksTersisa(+e.target.value)}
                            disabled={!prediksiManual}
                          />
                        </div>
                      </div>

                      {/* Hasil prediksi */}
                      <div className="alert alert-info d-flex justify-content-between align-items-center">
                        <div>
                          Dengan skenario ini, <strong>prediksi IPK akhir kamu</strong> adalah:
                        </div>
                        <h3 className="fw-bold text-primary m-0">
                          {
                            prediksiManual
                              ? prediksiIPK[prediksiIPK.length - 1]?.ipk.toFixed(2)
                              : ipkPrediksi[ipkPrediksi.length - 1]?.ipk.toFixed(2)
                          }
                        </h3>
                      </div>

                      {/* Grafik prediksi */}
                      <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={prediksiManual? prediksiIPK : ipkPrediksi}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="semester" label={{ value: "Semester", position: "insideBottom", offset: -5 }} />
                          <YAxis domain={[nilaiMinimumIPK?parseFloat((nilaiMinimumIPK-0.2).toFixed(2)):2, 4]} label={{ value: "IPK", angle: -90, position: "insideLeft" }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="ipk" stroke="#20c997" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatistikAkademik;
