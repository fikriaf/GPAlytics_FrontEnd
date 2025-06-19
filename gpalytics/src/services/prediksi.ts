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
