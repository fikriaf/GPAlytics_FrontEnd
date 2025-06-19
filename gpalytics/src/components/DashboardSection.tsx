// // ============================
// // components/DashboardSection.tsx
// // ============================
// import React from "react";
// import { Mahasiswa } from "../models/Mahasiswa";
// import { IPK } from "../services/IPK";
// import { Analisis } from "../services/Analisis";
// import { Rekomendasi } from "../services/Rekomendasi";

// type Props = {
//   mahasiswa: Mahasiswa;
// };

// export function DashboardSection({ mahasiswa }: Props) {
//   // Hitung IPK keseluruhan
//   const ipk = IPK.hitung(mahasiswa.mataKuliah);

//   // Hitung IPS (rata-rata nilai semester terakhir)
//   const semesters = new Set<number>();
//   mahasiswa.mataKuliah.forEach(mk => {
//     mk.dataNilai.forEach(d => semesters.add(d.semester));
//   });
//   const lastSemester = Math.max(...Array.from(semesters));

//   let nilaiSemesterTerakhir: number[] = [];
//   mahasiswa.mataKuliah.forEach(mk => {
//     mk.dataNilai.forEach(d => {
//       if (d.semester === lastSemester) nilaiSemesterTerakhir.push(d.nilai);
//     });
//   });
//   const ips = nilaiSemesterTerakhir.length
//     ? parseFloat(
//         (
//           nilaiSemesterTerakhir.reduce((a, b) => a + b, 0) /
//           nilaiSemesterTerakhir.length
//         ).toFixed(2)
//       )
//     : 0;

//   // Prediksi IPK (dari Analisis)
//   const prediksiIPK = Analisis.prediksiIPK(mahasiswa.mataKuliah);

//   // Data tren IPK per semester untuk grafik
//   const trenIPK = Analisis.trenNilai(mahasiswa.mataKuliah);

//   // Rekomendasi mata kuliah (target IPK di sini contoh 3.75)
//   const rekomendasi = Rekomendasi.buat(mahasiswa, 3.75);

//   return (
//     <div>
//       <h2>Dashboard Akademik</h2>

//       <p><strong>IPK:</strong> {ipk}</p>
//       <p><strong>IPS Semester {lastSemester}:</strong> {ips}</p>
//       <p><strong>Prediksi IPK:</strong> {prediksiIPK}</p>

//       <h3>Grafik IPK per Semester</h3>
//       <ul>
//         {trenIPK.map(({ semester, rata }) => (
//           <li key={semester}>
//             Semester {semester}: {rata}
//           </li>
//         ))}
//       </ul>

//       <h3>Daftar Mata Kuliah Diambil</h3>
//       <ul>
//         {mahasiswa.mataKuliah.map((mk) => (
//           <li key={mk.id}>
//             {mk.nama} ({mk.sks} SKS)
//           </li>
//         ))}
//       </ul>

//       <h3>Rekomendasi Mata Kuliah</h3>
//       <ul>
//         {rekomendasi.saranMataKuliah.map((mk, i) => (
//           <li key={i}>
//             {mk.nama} ({mk.sks} SKS) – Target Nilai: {mk.targetNilai}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
