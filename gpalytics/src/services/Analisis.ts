// // ============================
// // services/Analisis.ts
// // ============================
// import { MataKuliah } from "../models/MataKuliah";
// import { IPK } from "./IPK";

// export class Analisis {
//   static prediksiIPK(mkList: MataKuliah[]): number {
//     const ipkSekarang = IPK.hitung(mkList);
//     return parseFloat((ipkSekarang + 0.05).toFixed(2));
//   }

//   static trenNilai(mkList: MataKuliah[]): { semester: number; rata: number }[] {
//     const semesters: Map<number, number[]> = new Map();
//     mkList.forEach(mk => {
//       mk.dataNilai.forEach(d => {
//         if (!semesters.has(d.semester)) semesters.set(d.semester, []);
//         semesters.get(d.semester)?.push(d.nilai);
//       });
//     });

//     return [...semesters.entries()].map(([smt, nilai]) => {
//       const avg = nilai.reduce((a, n) => a + n, 0) / nilai.length;
//       return { semester: smt, rata: parseFloat(avg.toFixed(2)) };
//     });
//   }
// }
