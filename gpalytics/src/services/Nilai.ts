// services/getNilaiTertinggi.ts
import axios from 'axios'

const URL = `${import.meta.env.VITE_URL_HOST}/api/nilai`

export interface NilaiMatkul {
    mataKuliah: string;
    sks: number;
    semester: number;
    nilaiUAS: number;
    nilaiUTS: number;
    nilaiTugas: number;
}

export interface NilaiMatkulDenganAkhir extends NilaiMatkul {
    nilaiAkhir: number;
}

export async function getListNilaiTertinggi(id_mahasiswa: string): Promise<NilaiMatkulDenganAkhir[]> {
    try {
        const res = await axios.get<NilaiMatkul[]>(`${URL}/all?id_mahasiswa=${id_mahasiswa}`);
        const nilaiList = res.data;

        const daftarNilai: NilaiMatkulDenganAkhir[] = nilaiList.map(item => {
            const tugas = item.nilaiTugas ?? 0;
            const uts = item.nilaiUTS ?? 0;
            const uas = item.nilaiUAS ?? 0;

            const nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);

            return { ...item, nilaiAkhir };
        });

        daftarNilai.sort((a, b) => b.nilaiAkhir - a.nilaiAkhir);

        return daftarNilai;
    } catch (err) {
        console.error('Gagal mengambil daftar nilai:', err);
        return [];
    }
}

export interface NilaiMatkulDenganId {
    idNilai: string[];
    mataKuliah: string;
    sks: number;
    semester: number;
    nilaiTugas?: number;
    nilaiUTS?: number;
    nilaiUAS?: number;
}

export async function getListNilai(id_mahasiswa: string): Promise<NilaiMatkulDenganId[]> {
    try {
        const res = await axios.get<NilaiMatkulDenganId[]>(`${URL}/all?id_mahasiswa=${id_mahasiswa}`);
        return res.data;
    } catch (err) {
        console.error('Gagal mengambil daftar nilai:', err);
        return [];
    }
}


export interface DataNilaiInput {
    id_mahasiswa: string;
    id_mk: string;
    nilai: number;
    tipe_nilai: 'Tugas' | 'UTS' | 'UAS';
    semester: number;
}

export async function createDataNilai(data: DataNilaiInput): Promise<boolean> {
    try {
        const res = await axios.post(URL, data);
        return res.status === 201;
    } catch (err) {
        console.error('Gagal mengirim data nilai:', err);
        return false;
    }
}

export async function getTotalSKS(id_mahasiswa: string): Promise<{
    semesterSaatIni: number;
    totalSKS: number;
    }> {
    try {
        const daftarNilai = await getListNilaiTertinggi(id_mahasiswa);

        if (!daftarNilai.length) {
        return {
            semesterSaatIni: 0,
            totalSKS: 0,
        };
        }

        const totalSKS = daftarNilai.reduce((sum, item) => sum + (item.sks || 0), 0);
        const semesterSaatIni = Math.max(...daftarNilai.map(item => item.semester));

        return {
        semesterSaatIni,
        totalSKS,
        };
    } catch (err) {
        console.error('Gagal menghitung total SKS:', err);
        return {
        semesterSaatIni: 0,
        totalSKS: 0,
        };
    }
}

