export interface Endpoint {
    name: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    body?: Record<string, string | string[] | Record<string, string>>;
    params?: string[];
    query?: string[];
}

export const endpointGroups: {
    title: string;
    endpoints: Endpoint[];
}[] = [
    {
        title: "Mahasiswa",
        endpoints: [
        { name: "Ambil Semua Mahasiswa", method: "GET", path: "/api/mahasiswa" },
        { name: "Ambil Mahasiswa Berdasarkan Email", method: "GET", path: "/api/mahasiswa/:email", params: ["email"] },
        { name: "Tambah Mahasiswa", method: "POST", path: "/api/mahasiswa", body: { email: "string", nama: "string", angkatan: "number" } },
        { name: "Update Mahasiswa", method: "PUT", path: "/api/mahasiswa/:email", params: ["email"], body: {
            nama: "String",
            nim: "String",
            prodi: "String",
            angkatan: "Number",
            gender: "String",
            umur: "String",
            photo: "String",
            password: "String"
        } },
        { name: "Hapus Mahasiswa", method: "DELETE", path: "/api/mahasiswa/:email", params: ["email"] }
        ]
    },
    {
        title: "Mata Kuliah",
        endpoints: [
        { name: "Ambil Semua Mata Kuliah", method: "GET", path: "/api/mata-kuliah" },
        { name: "Ambil Mata Kuliah Berdasarkan Kode", method: "GET", path: "/api/mata-kuliah/:code_mk", params: ["code_mk"] },
        { name: "Tambah Mata Kuliah", method: "POST", path: "/api/mata-kuliah", body: { code_mk: "string", nama_mk: "string", sks: "number" } },
        { name: "Perbarui Data Mata Kuliah", method: "PUT", path: "/api/mata-kuliah/:code_mk", params: ["code_mk"], body: { nama_mk: "string", sks: "number" } },
        { name: "Hapus Mata Kuliah", method: "DELETE", path: "/api/mata-kuliah/:code_mk", params: ["code_mk"] }
        ]
    },
    {
        title: "Nilai",
        endpoints: [
        { name: "Ambil Semua Nilai Mahasiswa", method: "GET", path: "/api/nilai/all?id_mahasiswa=" },
        { name: "Tambah Nilai", method: "POST", path: "/api/nilai", body: { id_mahasiswa: "string", id_mk: "string", tipe_nilai: "string", nilai: "number", semester: "number" } },
        { name: "Edit Nilai", method: "PUT", path: "/api/nilai", body: { id_nilai: "string", nilai: "number" } },
        { name: "Hapus Nilai", method: "DELETE", path: "/api/nilai", body: { id_nilai: "string" } }
        ]
    },
    {
        title: "Rekomendasi",
        endpoints: [
        { name: "Ambil Semua Rekomendasi", method: "GET", path: "/api/rekomendasi" },
        { name: "Tambah Rekomendasi", method: "POST", path: "/api/rekomendasi", body: { id_mahasiswa: "string", rekomendasi: "string" } },
        { name: "Ambil Rekomendasi Berdasarkan ID", method: "GET", path: "/api/rekomendasi/:id", params: ["id"] },
        { name: "Edit Rekomendasi", method: "PUT", path: "/api/rekomendasi/:id", params: ["id"], body: { rekomendasi: ["string"] } }
        ]
    },
    {
        title: "Analisis",
        endpoints: [
        { name: "Ambil Semua Analisis", method: "GET", path: "/api/analisis" },
        { name: "Tambah Analisis", method: "POST", path: "/api/analisis", body: { id_mahasiswa: "string", data: { kesimpulan: "string" } } },
        { name: "Ambil Analisis Berdasarkan ID", method: "GET", path: "/api/analisis/:id", params: ["id"] },
        { name: "Edit Analisis", method: "PUT", path: "/api/analisis/:id", params: ["id"], body: { data: { kesimpulan: "string" } } }
        ]
    },
    {
        title: "IP/IPK",
        endpoints: [
        { name: "Ambil Data IPK Mahasiswa", method: "GET", path: "/api/ip/ipk?id_mahasiswa=&semester=" },
        { name: "Ambil Data IPS Mahasiswa", method: "GET", path: "/api/ip/ips?id_mahasiswa=" }
        ]
    }
];

