import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/Mahasiswa.css'
import Sidebar from '../components/Sidebar'
import { use, useEffect, useRef, useState } from 'react';
import { createDataNilai, getListNilaiTertinggi } from '../services/Nilai';
import type { NilaiMatkulDenganAkhir } from '../services/Nilai';
import { useIPKData } from '../hooks/useIPK';
import { mataKuliah } from '../services/mataKuliah';
import type { DataNilaiInput } from '../services/Nilai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import guestImg from '../assets/guest.png'
import { FiEdit3, FiUser, FiEye, FiEyeOff, FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import { useProfile } from '../hooks/useProfile';
import { usePassword } from '../hooks/usePassword';
import { useAlert } from '../hooks/useAlert';

const URL = `${import.meta.env.VITE_URL_HOST}/api`;

const Mahasiswa = () => {
    const { getProfile, updateProfile, setUpdateProfile } = useProfile();
    const { isLoading, ipkTerakhir } = useIPKData();
    const [isFlipped, setIsFlipped] = useState(false);
    const [showPassword, togglePassword] = usePassword();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { alert, showSuccess, showError } = useAlert(2000);
    const [listNilai, setListNilai] = useState<NilaiMatkulDenganAkhir[] | null>(null);
    const [nilaiTertinggi, setNilaiTertinggi] = useState<any>(null);
    const [doAction, setDoAction] = useState(false)
    const [listMatkul, setListMatkul] = useState<any[] | null> (null);
    const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all');
    const [searchKeyword, setSearchKeyword] = useState('');


    useEffect(() => {
        const fetchNilai = async () => {
            if (!getProfile?._id) return;
            const data = await getListNilaiTertinggi(getProfile?._id);
            setListNilai(data ?? null);
            setNilaiTertinggi(data?.[0] || null)
        };
        fetchNilai();
    }, [getProfile?._id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdateProfile(prev => ({...prev, photo: reader.result as string}));
            };
            reader.readAsDataURL(file);
            }
        } else {
            setUpdateProfile(prev => ({...prev, [target.name]: target.value}));
        }
    };

    useEffect(() => {
        const getListMatkul = async () => {
            const data = await mataKuliah.getAll();
            setListMatkul(data ?? null);
        }
        getListMatkul()
    }, [])
    
    const refCreateData = useRef<Partial<DataNilaiInput>>({});
    useEffect(() => {
        if (getProfile?._id) {
            refCreateData.current = {
                ...refCreateData.current,
                id_mahasiswa: getProfile._id
            };
        }
    }, [getProfile?._id]);

    function handleChangeTambah(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        refCreateData.current = {
            ...refCreateData.current,
            [name]: name === 'nilai' || name === 'semester' ? Number(value) : value
        };
    }
    const handleSubmitTambah = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = refCreateData.current;

        if (
            data &&
            typeof data.id_mahasiswa === 'string' &&
            typeof data.id_mk === 'string' &&
            typeof data.nilai === 'number' &&
            typeof data.tipe_nilai === 'string' &&
            typeof data.semester === 'number'
        ) {
            try {
            const success = await createDataNilai(data as DataNilaiInput);
            if (success) {
                showSuccess('Berhasil tambah nilai');
                localStorage.removeItem(`ipkData-${getProfile._id}`);
            }
            } catch (error) {
            showError('Gagal tambah nilai');
            }
        } else {
            showError('Data belum lengkap!');
        }
    };


    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        axios.put(`${URL}/mahasiswa/${getProfile.email}`, updateProfile)
        .then(() => {
            setIsFlipped(false)
            showSuccess('Updated')
        })
        .catch((err) => {showError(err)})
    }
    
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>, item: any) {
        if (e.target.checked) {
            setSelectedItems(prev => [...prev, item]);
        } else {
            setSelectedItems(prev => prev.filter(i => i !== item));
        }
    }
    useEffect(() => {
        if(!doAction){
            setSelectedItems([]);
        }
    },[doAction])
    
    const [editItems, setEditItems] = useState<any[]>([]);

    const initializedRef = useRef(false);

    useEffect(() => {
        if (!selectedItems || initializedRef.current) return;

        const init = selectedItems.map((item: any) => ({
            mataKuliah: item.mataKuliah,
            semester: item.semester,
            nilaiTugas: item.nilaiTugas,
            nilaiTugasBaru: item.nilaiTugas,
            nilaiUTS: item.nilaiUTS,
            nilaiUTSBaru: item.nilaiUTS,
            nilaiUAS: item.nilaiUAS,
            nilaiUASBaru: item.nilaiUAS
        }));

        setEditItems(init);
        initializedRef.current = true;
    }, [selectedItems]);


    const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const updatedItems: any[] = [];

        for (const item of editItems) {
            const { semester } = item;

            if (item.nilaiTugas !== item.nilaiTugasBaru && item.nilaiTugasBaru != null) {
                await axios.put(`${URL}/nilai/${getProfile._id}/${semester}/Tugas/${item.nilaiTugas}`, {
                    nilai: item.nilaiTugasBaru
                });
                item.nilaiTugas = item.nilaiTugasBaru;
            }

            if (item.nilaiUTS !== item.nilaiUTSBaru && item.nilaiUTSBaru != null) {
                await axios.put(`${URL}/nilai/${getProfile._id}/${semester}/UTS/${item.nilaiUTS}`, {
                    nilai: item.nilaiUTSBaru
                });
                item.nilaiUTS = item.nilaiUTSBaru;
            }

            if (item.nilaiUAS !== item.nilaiUASBaru && item.nilaiUASBaru != null) {
                await axios.put(`${URL}/nilai/${getProfile._id}/${semester}/UAS/${item.nilaiUAS}`, {
                    nilai: item.nilaiUASBaru
                });
                item.nilaiUAS = item.nilaiUASBaru;
            }

            updatedItems.push(item);
        }

        // Perbarui nilai di tampilan
        setListNilai(prev =>
            prev?.map(item =>
                updatedItems.find(u => u.mataKuliah === item.mataKuliah && u.semester === item.semester) || item
            ) || null
        );

        showSuccess("Simpan perubahan");
        localStorage.removeItem(`ipkData-${getProfile._id}`);
    } catch (err) {
        console.error("Gagal menyimpan:", err);
    }
};

    const handleSubmitDelete = async () => {
        if (!getProfile || !selectedItems) return;

        const deleteRequests = selectedItems.flatMap((item: any) => {
            const requests: Promise<any>[] = [];

            if (item.nilaiTugas) {
                const target = `${URL}/nilai/${getProfile._id}/${item.semester}/Tugas/${item.nilaiTugas}`;
                requests.push(axios.delete(target));
            }
            if (item.nilaiUTS) {
                const target = `${URL}/nilai/${getProfile._id}/${item.semester}/UTS/${item.nilaiUTS}`;
                requests.push(axios.delete(target));
            }
            if (item.nilaiUAS) {
                const target = `${URL}/nilai/${getProfile._id}/${item.semester}/UAS/${item.nilaiUAS}`;
                requests.push(axios.delete(target));
            }

            return requests;
        });

        try {
            await Promise.all(deleteRequests);
            showSuccess('Deleted!');
        } catch (err) {
            console.error('Gagal menghapus sebagian nilai:', err);
        }
    };

    return (
        <div className="mahasiswa container-fluid min-vh-100 bg-light">
            <div className="row">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className='upper d-md-none d-flex fixed-top align-items-center justify-content-between p-2 ps-3 bg-primary mb-1'>
                    <div className='m-0 p-0 text-light d-flex align-items-center gap-2' style={{fontSize: '1.5rem'}}>
                        <FiUser size={24} />Mahasiswa
                    </div>
                    <button className="btn py-2 px-3 border border-primary" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FontAwesomeIcon className='text-light' icon={faBars} />
                    </button>
                </div>
                {/* Modal Delete */}
                <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            <h5 className="modal-title" id="deleteModalLabel">Apakah kamu yakin mengapus data ini?</h5>
                            <button type="button" className="btn m-0 p-0 border-none" data-bs-dismiss="modal" aria-label="Close"><AiOutlineClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                { selectedItems && (
                                    selectedItems.map((item:any)=>(
                                        <div className='border-bottom text-muted mb-1'>{item.mataKuliah} | sem {item.semester} | {item.sks} sks | ({item.nilaiTugas??'null'}:{item.nilaiUTS??'null'}:{item.nilaiUAS??'null'})</div>
                                    ))
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary mt-3" onClick={handleSubmitDelete}>Delete</button>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Modal Edit */}
                <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            <h5 className="modal-title" id="editModalLabel">Edit Nilai</h5>
                            <button type="button" className="btn m-0 p-0 border-none" data-bs-dismiss="modal" aria-label="Close"><AiOutlineClose size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitEdit}>
                                <div style={{ maxHeight: '25rem', overflowY: 'auto' }}>
                                    {selectedItems && selectedItems.length > 0 ? (
                                        selectedItems.map((item: any, index: number) => (
                                            <div key={index} className="border-bottom pb-1 mb-2">
                                                <h5>{item.mataKuliah}</h5>
                                                <div className="d-flex gap-2">
                                                    <div className="mb-3">
                                                        <label className="form-label">Tugas</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={
                                                                editItems[index]?.nilaiTugasBaru !== undefined
                                                                    ? editItems[index].nilaiTugasBaru
                                                                    : item.nilaiTugas
                                                            }
                                                            onChange={(e) => {
                                                                const updated = [...editItems];
                                                                updated[index] = {
                                                                    ...(updated[index] || item),
                                                                    nilaiTugasBaru: Number(e.target.value)
                                                                };
                                                                setEditItems(updated);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">UTS</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={
                                                                editItems[index]?.nilaiUTSBaru !== undefined
                                                                    ? editItems[index].nilaiUTSBaru
                                                                    : item.nilaiUTS
                                                            }
                                                            onChange={(e) => {
                                                                const updated = [...editItems];
                                                                updated[index] = {
                                                                    ...(updated[index] || item),
                                                                    nilaiUTSBaru: Number(e.target.value)
                                                                };
                                                                setEditItems(updated);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label">UAS</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={
                                                                editItems[index]?.nilaiUASBaru !== undefined
                                                                    ? editItems[index].nilaiUASBaru
                                                                    : item.nilaiUAS
                                                            }
                                                            onChange={(e) => {
                                                                const updated = [...editItems];
                                                                updated[index] = {
                                                                    ...(updated[index] || item),
                                                                    nilaiUASBaru: Number(e.target.value)
                                                                };
                                                                setEditItems(updated);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>Please, select first!</div>
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Modal Tambah */}
                <div className="modal fade" id="tambahModal" tabIndex={-1} aria-labelledby="tambahModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header d-flex align-items-center">
                            <h5 className="modal-title" id="editModalLabel">Tambah Data</h5>
                            <button type="button" className="btn m-0 p-0 border-none" data-bs-dismiss="modal" aria-label="Close"><AiOutlineClose size={20} /></button>
                        </div>
                        <div className="modal-body" style={{maxHeight: '100%', overflowY: 'auto'}}>
                            <form onSubmit={handleSubmitTambah}>
                                <div className='border-bottom pb-1 mb-2'>
                                    <div>
                                        <label htmlFor="id_mk" className="form-label fw-semibold">Pilih Mata Kuliah:</label>
                                        <select name="id_mk" id="id_mk" className="form-select" onChange={handleChangeTambah}>
                                            <option value="">-- Pilih --</option>
                                            {listMatkul?.map((item: any) => (
                                                <option key={item._id} value={item._id}>{item.nama_mk}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='col d-md-flex mt-2 gap-3 mb-3'>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Nilai</label>
                                            <input
                                                type="number"
                                                name="nilai"
                                                className="form-control"
                                                step="0.01"
                                                onChange={(e) => {
                                                    const nilai = parseFloat(e.target.value);
                                                    if (!isNaN(nilai)) {
                                                    refCreateData.current = { ...refCreateData.current, nilai };
                                                }}}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Tipe Nilai</label>
                                            <select
                                                name="tipe_nilai"
                                                className="form-select"
                                                onChange={handleChangeTambah}
                                            >
                                                <option value="">-- Pilih --</option>
                                                <option value="Tugas">Tugas</option>
                                                <option value="UTS">UTS</option>
                                                <option value="UAS">UAS</option>
                                            </select>
                                        </div>

                                        <div className="">
                                            <label className="form-label fw-semibold">Semester</label>
                                            <input
                                                type="number"
                                                name="semester"
                                                className="form-control"
                                                onChange={handleChangeTambah}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary">Simpan</button>
                            </form>
                            {/* )} */}
                        </div>
                        </div>
                    </div>
                </div>
                <div className="bottomer col-md-10 p-2 ms-auto">
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
                    <div className='induk-profile position-relative' style={{height: "20.5rem"}}>
                        <div className="profile-card-container">
                            <div className={`profile-card-inner ${isFlipped ? 'flipped' : ''}`}>
                                {/* Front */}
                                <div className="profile-card-front detailProfile bg-white d-flex gap-3 rounded shadow-sm p-4 mb-2">
                                    <div className="columnLeft col-md-3 d-grid align-items-center">
                                        <img src={updateProfile?.photo || guestImg} alt="Foto Mahasiswa" className="rounded-circle me-4" />
                                        <div>
                                            <h4 className="mb-1">{updateProfile?.nama || 'Guest'}</h4>
                                            <p className="mb-2 text-muted">{updateProfile?.email || 'guest@gmail.com'}</p>
                                            <button className="btn btn-outline-primary btn-sm"
                                            onClick={() => setIsFlipped(true)}
                                            >
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                    <div className="vr col-md-1 mx-3"></div>
                                    <div className="ColumnRight col-md-8 row mt-3">
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">Gender</span>
                                            <strong className="d-block">{updateProfile?.gender || 'L/P'}</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">Umur</span>
                                            <strong className="d-block">{updateProfile?.umur || '-'}</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">Status</span>
                                            <strong className="d-block">Aktif</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">NIM</span>
                                            <strong className="d-block">{updateProfile?.nim || '-'}</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">Angkatan</span>
                                            <strong className="d-block">{updateProfile?.angkatan || '-'}</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <span className="d-block mb-1">Prodi</span>
                                            <strong className="d-block">{updateProfile?.prodi || '-'}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* Back */}
                                <form onSubmit={handleUpdate} className="profile-card-back detailProfile bg-white d-flex gap-3 rounded shadow-sm p-4 mb-2">
                                    <div className="columnLeft col-md-3 d-grid align-items-center">
                                        <div className='position-relative d-inline-block'>
                                            <input className='position-absolute top-0 start-0 d-none'
                                            type="file"
                                            accept="image/*"
                                            name="photo" id="PhotoProfile"
                                            onChange={handleChange}
                                            style={{ cursor: 'pointer'}}
                                            />
                                            <label
                                                htmlFor="PhotoProfile"
                                                className="position-absolute translate-middle labelPhoto"
                                                style={{ cursor: 'pointer', top: '70%', left: '27%' }}
                                            >
                                                <FiEdit3 size={30} className="text-light bg-primary rounded-circle p-1" />
                                            </label>
                                            <img src={updateProfile?.photo || guestImg} alt="Foto Mahasiswa" className="rounded-circle me-4"
                                            style={{width: '5rem', height: '5rem'}} />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                name="nama"
                                                value={updateProfile?.nama || 'Guest'}
                                                onChange={handleChange}
                                                placeholder="Nama"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control mb-2 text-muted"
                                                value={getProfile?.email || 'guest@gmail.com'}
                                                placeholder="Email"
                                                readOnly
                                            />
                                            <div className='position-relative'>
                                                <input
                                                    type={showPassword? 'text': 'password'}
                                                    name="password"
                                                    className="form-control mb-2"
                                                    defaultValue={updateProfile?.password || ''}
                                                    onChange={handleChange}
                                                    placeholder="Password"
                                                />
                                                <span
                                                    onClick={togglePassword}
                                                    style={{
                                                    position: 'absolute',
                                                    top: '0.5rem',
                                                    right: '1rem',
                                                    cursor: 'pointer',
                                                    userSelect: 'none',
                                                    }}
                                                >
                                                    {showPassword ? <FiEye size={20} />: <FiEyeOff size={20} />}
                                                </span>
                                            </div>
                                            <div className='d-flex gap-2'>
                                                <button type='reset' onClick={() => setIsFlipped(false)} className="btn btn-secondary btn-sm py-1">Cancel</button>
                                                <button type="submit" className="btn btn-success py-1 btn-sw">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="vr col-md-1 mx-3"></div>
                                    <div className="ColumnRight col-md-8 row mt-3">
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">Gender</label>
                                            <select name="gender"
                                            value={updateProfile?.gender || "Laki-laki/Perempuan"}
                                            onChange={handleChange}
                                            className="form-select"
                                            >
                                                <option value="" selected>Laki-laki/Perempuan</option>
                                                <option value="Laki-laki">Laki-laki</option>
                                                <option value="Perempuan">Perempuan</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">Umur</label>
                                            <input type="number" name="umur" className="form-control"
                                            defaultValue={getProfile?.umur || ''}
                                            onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">Status</label>
                                            <strong>Aktif</strong>
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">NIM</label>
                                            <input type="text" name="nim" className="form-control"
                                            defaultValue={getProfile?.nim || ''}
                                            onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">Angkatan</label>
                                            <input type="number" name="angkatan" className="form-control" 
                                            defaultValue={getProfile?.angkatan || ''}
                                            onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6 col-4 mb-3">
                                            <label className="d-block mb-1">Prodi</label>
                                            <input type="text" name="prodi" className="form-control"
                                            defaultValue={getProfile?.prodi || ''}
                                            onChange={handleChange} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* Data Analisis */}
                    <div className="row g-2 mb-2">
                        <div className="col-md-3">
                            <div className="d-flex flex-column align-items-center justify-content-center bg-white h-100 rounded shadow-sm p-3 text-center border-bottom border-primary border-3">
                                <h6 className='my-1'>IPK Semester Ini</h6>
                                <h2 className="text-success my-1">{ipkTerakhir !== null? ipkTerakhir : '_._'}</h2>
                                <p className="text-muted small my-1">Berdasarkan rata-rata nilai semester 4</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex flex-column align-items-center justify-content-center bg-white h-100 rounded shadow-sm p-3 text-center border-bottom border-warning border-3">
                                <h6 className='my-1'>Mata Kuliah Terbaik</h6>
                                <h4 className="my-1">{nilaiTertinggi?.mataKuliah || '- - -'}<br />({nilaiTertinggi?.nilaiAkhir || '__'})</h4>
                                <p className="text-muted my-1 small">Jumlah SKS: {nilaiTertinggi?.sks || '-'}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex flex-column align-items-center justify-content-center bg-white h-100 rounded shadow-sm p-3 text-center border-bottom border-success border-3">
                                <h6 className='m-1'>Jumlah SKS Saat Ini</h6>
                                <h2 className='m-1'>12 SKS</h2>
                                <p className="text-muted m-1 small">Total SKS dari 4 matkul semester 4</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="d-flex flex-column align-items-center justify-content-center bg-white h-100 rounded shadow-sm p-3 text-center border-bottom border-danger border-3">
                                <h6 className='m-1'>Prediksi Lulus</h6>
                                <h2 className='m-1'>2026</h2>
                                <p className="text-muted m-1 small">Berdasarkan progres SKS & IPK saat ini</p>
                            </div>
                        </div>
                    </div>

                    {/* Data Nilai */}
                    <div className="bg-white rounded-4 shadow p-4">
                        <div className='d-flex flex-column flex-md-row align-items-center gap-2 justify-content-between mb-4'>
                            <h5 className="text-primary fw-semibold m-0">Data Nilai</h5>
                            {/* Pencarian */}
                            <div className="input-group search input-group-sm w-auto" style={{ maxWidth: '15rem' }}>
                                <span className="input-group-text bg-white border-end-0">
                                    <FiSearch className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '0.9rem' }}
                                    placeholder="Cari mata kuliah..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </div>

                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <button
                                    className={`btn btn-sm ${semesterFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setSemesterFilter('all')}
                                >
                                    Semua
                                </button>
                                {[...new Set((listNilai ?? []).map((item) => item.semester))].sort().map((sem) => (
                                    <button
                                    key={sem}
                                    className={`btn btn-sm ${semesterFilter === sem ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setSemesterFilter(sem)}
                                    >
                                    Sem {sem}
                                    </button>
                                ))}
                            </div>
                            <div className='d-flex'>
                                {doAction ? (
                                    <div className='d-flex'>
                                        <div
                                            className="d-flex transition-btn-action"
                                            style={{
                                                transform: 'translateX(0)',
                                            }}
                                        >
                                            <button className='btn btn-outline-danger me-1' data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                                            <button className='btn btn-outline-primary me-1' data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                                            <button className='btn btn-outline-success me-1' data-bs-toggle="modal" data-bs-target="#tambahModal">Tambah</button>
                                        </div>
                                        <div>
                                            <button className='btn btn-danger' onClick={()=>setDoAction(false)}><AiOutlineClose size={20} /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className='btn btn-outline-primary text-primary' onClick={() => setDoAction(true)}>
                                        <FiEdit3 size={20} />
                                    </button>
                                )}
                                
                            </div>
                            
                        </div>
                        <div className="table-responsive" style={{maxHeight: '15rem', overflowY: 'auto'}}>
                            <table className="table fixed-header-table table-bordered text-center table-striped table-hover shadow-sm rounded-3">
                                <thead className="text-white" style={{
                                    background: 'linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%)'
                                }}>
                                    <tr>
                                    {doAction && (
                                        <th>[{selectedItems.length}]</th>
                                    )}
                                    <th>No</th>
                                    <th>Mata Kuliah</th>
                                    <th>SKS</th>
                                    <th>Semester</th>
                                    <th>Nilai Tugas</th>
                                    <th>Nilai UTS</th>
                                    <th>Nilai UAS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listNilai && (
                                        listNilai
                                            .filter((item) =>
                                            (semesterFilter === 'all' || item.semester === semesterFilter) &&
                                            item.mataKuliah.toLowerCase().includes(searchKeyword.toLowerCase())
                                            )
                                            .map((item: any, index: number) => (
                                            <tr key={index}>
                                                {doAction && (
                                                <td>
                                                    <input
                                                    type="checkbox"
                                                    value={item}
                                                    onChange={(e) => handleCheckboxChange(e, item)}
                                                    />
                                                </td>
                                                )}
                                                <td>{index + 1}</td>
                                                <td>{item.mataKuliah}</td>
                                                <td><span className="badge bg-warning text-dark">{item.sks}</span></td>
                                                <td>{item.semester}</td>
                                                <td><span className="badge bg-secondary">{item.nilaiTugas}</span></td>
                                                <td><span className="badge bg-primary">{item.nilaiUTS}</span></td>
                                                <td><span className="badge bg-success">{item.nilaiUAS}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mahasiswa;
