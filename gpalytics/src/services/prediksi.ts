import { IPK } from "./IP";

export async function PrediksiIPK(id_mahasiswa: string) {
    const semuaSemester = await IPK.getAll(id_mahasiswa);
    if (!semuaSemester || semuaSemester.length === 0) return null;

    let lastKnownIndex = -1;
    let lastKnownIPK: number | null = null;

    for (let i = semuaSemester.length - 1; i >= 0; i--) {
        if (semuaSemester[i].ipk !== null) {
            lastKnownIndex = i;
            lastKnownIPK = semuaSemester[i].ipk;
            break;
        }
    }

    if (lastKnownIndex === -1 || lastKnownIndex < 1) {
        return { prediksi: null, catatan: "Data IPS terlalu sedikit untuk prediksi." };
    }

    const deltaList: number[] = [];

    for (let i = 1; i <= lastKnownIndex; i++) {
        const prev = semuaSemester[i - 1];
        const curr = semuaSemester[i];
        if (prev.ipk !== null && curr.ipk !== null) {
            const delta = curr.ipk - prev.ipk;
            deltaList.push(delta);
        }
    }

    if (lastKnownIndex === -1 || lastKnownIndex < 1 || lastKnownIPK === null) {
        return { prediksi: null, catatan: "Data IPS terlalu sedikit untuk prediksi." };
    }

    const rata2Delta = deltaList.reduce((a, b) => a + b, 0) / deltaList.length;

    const prediksi = parseFloat((lastKnownIPK + rata2Delta).toFixed(2));

    return {
        prediksi,
        semester: lastKnownIndex + 2,
        penjelasan: `Prediksi berdasarkan rata-rata perubahan IPK dari semester 1–${lastKnownIndex + 1}.`,
    };
}
interface PrediksiLulusProgres {
    totalSKS: number;
    ipk: number;
    semesterAktif: number;
    tahunMasuk: number;
    status: 'Tepat Waktu' | 'Berpotensi Terlambat' | 'Terlambat';
    tahunLulusPerkiraan: number;
    catatan: string;
}

export function prediksiLulusBerdasarkanProgres({
    totalSKS,
    ipk,
    semesterAktif,
    tahunMasuk
}: {
    totalSKS: number;
    ipk: number;
    semesterAktif: number;
    tahunMasuk: number;
}): PrediksiLulusProgres {

    const sksTarget = 144;
    const semesterTarget = 8;
    const ipkMinimum = 2.00;

    const sisaSKS = sksTarget - totalSKS;
    const sisaSemester = semesterTarget - semesterAktif;

    const status =
        semesterAktif > semesterTarget
        ? 'Terlambat'
        : sisaSKS / Math.max(sisaSemester, 1) > 24
        ? 'Berpotensi Terlambat'
        : 'Tepat Waktu';

    const tahunLulusPerkiraan = tahunMasuk + Math.ceil((semesterAktif + Math.ceil(sisaSKS / 20)) / 2);

    let catatan = '';

    if (status === 'Terlambat') {
        catatan = 'Mahasiswa telah melewati batas semester ideal (8 semester).';
    } else if (status === 'Berpotensi Terlambat') {
        catatan = 'Beban SKS per semester ke depan terlalu berat (>24 SKS/semester).';
    } else if (ipk < ipkMinimum) {
        catatan = 'IPK saat ini di bawah ambang batas kelulusan.';
    } else {
        catatan = 'Progres mengarah ke kelulusan tepat waktu.';
    }

    return {
        totalSKS,
        ipk,
        semesterAktif,
        tahunMasuk,
        status,
        tahunLulusPerkiraan,
        catatan
    };
}

