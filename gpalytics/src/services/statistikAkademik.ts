import { getListNilaiTertinggi } from './Nilai';
import type { NilaiMatkulDenganAkhir } from './Nilai';
import { IPK } from './IP';
import { getTotalSKS } from './Nilai';

// Distribusi nilai
export async function getDistribusiNilai(id_mahasiswa: string) {
    const data = await getListNilaiTertinggi(id_mahasiswa);
    const distribusi = [
        { range: '90 - 100', jumlah: 0 },
        { range: '80 - 89', jumlah: 0 },
        { range: '70 - 79', jumlah: 0 },
        { range: '60 - 69', jumlah: 0 },
        { range: '< 60', jumlah: 0 },
    ];

    data.forEach((item) => {
        const nilai = item.nilaiAkhir;
        if (nilai >= 90) distribusi[0].jumlah++;
        else if (nilai >= 80) distribusi[1].jumlah++;
        else if (nilai >= 70) distribusi[2].jumlah++;
        else if (nilai >= 60) distribusi[3].jumlah++;
        else distribusi[4].jumlah++;
    });

    return distribusi;
}

// IPS per semester
export async function getIPSPerSemester(id_mahasiswa: string) {
    const data = await IPK.getAll(id_mahasiswa);
    return data.map((v) => ({
        semester: v.semester.toString(),
        ips: v.ips ?? null,
    }));
}
export async function getIPKPredictionData(id_mahasiswa: string) {
    const data = await IPK.getAll(id_mahasiswa);

    const filtered = data
        .filter((v) => v.ipk !== null)
        .sort((a, b) => a.semester - b.semester);

    if (filtered.length === 0) return [];

    const lastKnown = filtered[filtered.length - 1];
    const deltaList: number[] = [];

    for (let i = 1; i < filtered.length; i++) {
        const prev = filtered[i - 1].ipk ?? 0;
        const curr = filtered[i].ipk ?? 0;
        deltaList.push(curr - prev);
    }

    const avgDelta =
        deltaList.length > 0
        ? deltaList.reduce((a, b) => a + b, 0) / deltaList.length
        : 0;

    const prediksiData = filtered.map((v) => ({
        semester: v.semester.toString(),
        ipk: v.ipk ?? 0,
    }));

    let lastIPK = lastKnown.ipk ?? 0;
    const lastSemester = lastKnown.semester;

    for (let i = lastSemester + 1; i <= 8; i++) {
        lastIPK = parseFloat((lastIPK + avgDelta).toFixed(2));
        prediksiData.push({ semester: i.toString(), ipk: lastIPK });
    }

    return prediksiData;
}



// Data regresi IP nilai akhir
export async function getRegresiDataLinear(id_mahasiswa: string) {
    const data = await getListNilaiTertinggi(id_mahasiswa);
    const semesterMap: Record<number, number[]> = {};

    data.forEach((item) => {
        if (!semesterMap[item.semester]) semesterMap[item.semester] = [];
        semesterMap[item.semester].push(item.nilaiAkhir);
    });

    const nilaiSemester = Object.entries(semesterMap).map(([s, list]) => {
        const semester = parseInt(s);
        const avg = list.reduce((a, b) => a + b, 0) / list.length;
        return { semester, nilai: parseFloat(avg.toFixed(2)) };
    });

    const n = nilaiSemester.length;
    const sumX = nilaiSemester.reduce((sum, d) => sum + d.semester, 0);
    const sumY = nilaiSemester.reduce((sum, d) => sum + d.nilai, 0);
    const sumXY = nilaiSemester.reduce((sum, d) => sum + d.semester * d.nilai, 0);
    const sumX2 = nilaiSemester.reduce((sum, d) => sum + d.semester * d.semester, 0);

    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const a = (sumY - b * sumX) / n;

    const hasil = [];
    for (let i = 1; i <= 8; i++) {
        const existing = nilaiSemester.find(d => d.semester === i);
        const prediksi = parseFloat((a + b * i).toFixed(2));
        hasil.push({
        semester: i,
        nilai: existing?.nilai ?? null,
        prediksi,
        });
    }

    return {
        data: hasil,
        persamaan: `y = ${a.toFixed(2)} + ${b.toFixed(2)}x`,
    };
}

// Nilai rata-rata tugas, uts, uas per semester
export async function getTugasUTSUASData(id_mahasiswa: string) {
    const data = await getListNilaiTertinggi(id_mahasiswa);
    const semesterMap: Record<
        number,
        { tugas: number[]; uts: number[]; uas: number[] }
    > = {};

    data.forEach((item) => {
        if (!semesterMap[item.semester]) {
        semesterMap[item.semester] = { tugas: [], uts: [], uas: [] };
        }

        semesterMap[item.semester].tugas.push(item.nilaiTugas ?? 0);
        semesterMap[item.semester].uts.push(item.nilaiUTS ?? 0);
        semesterMap[item.semester].uas.push(item.nilaiUAS ?? 0);
    });

    const result = Object.entries(semesterMap).map(
        ([semesterStr, nilai]) => {
        const semester = parseInt(semesterStr);
        const avg = (arr: number[]) =>
            arr.length > 0
            ? arr.reduce((a, b) => a + b, 0) / arr.length
            : 0;

        return {
            semester,
            tugas: parseFloat(avg(nilai.tugas).toFixed(2)),
            uts: parseFloat(avg(nilai.uts).toFixed(2)),
            uas: parseFloat(avg(nilai.uas).toFixed(2)),
        };
        }
    );

    return result;
}
