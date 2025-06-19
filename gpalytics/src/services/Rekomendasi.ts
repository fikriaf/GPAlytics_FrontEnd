// // ============================
// // services/Rekomendasi.ts
// // ============================
// import { Mahasiswa } from "../models/Mahasiswa";
// import { Kurikulum } from "../models/Kurikulum";
// import { IPK } from "./IPK";
// import { Analisis } from "./Analisis";

// export class Rekomendasi {
//   static buat(mahasiswa: Mahasiswa, targetIPK: number) {
//     const mataKuliahDiambil = mahasiswa.mataKuliah.map(mk => mk.nama);
//     const nilaiMap = new Map<string, number>();

//     mahasiswa.mataKuliah.forEach(mk => {
//       const rata = mk.dataNilai.reduce((a, n) => a + n.nilai, 0) / mk.dataNilai.length;
//       nilaiMap.set(mk.nama, rata);
//     });

//     const kelemahan = [...nilaiMap.entries()].filter(([, v]) => v < 75).map(([n]) => n);

//     const saran = Kurikulum.filter(mk => {
//       const belumDiambil = !mataKuliahDiambil.includes(mk.nama);
//       const prasyaratOk = mk.prasyarat.every(pr => nilaiMap.has(pr) && nilaiMap.get(pr)! >= 75);
//       return belumDiambil && prasyaratOk;
//     }).map(mk => ({ nama: mk.nama, sks: mk.sks, targetNilai: 85 }));

//     return {
//       targetIPK,
//       kelemahanAkademik: kelemahan,
//       saranMataKuliah: saran,
//     };
//   }
// }
