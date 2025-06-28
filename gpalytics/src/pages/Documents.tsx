import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiArrowLeft } from "react-icons/fi";

const HOST = "https://gpalyticsbackend-production.up.railway.app";

const endpointGroups = [
  {
    title: "Mahasiswa",
    endpoints: [
        { name: "Ambil Semua Mahasiswa", method: "GET", path: "/api/mahasiswa" },
        { name: "Ambil Mahasiswa Berdasarkan Email", method: "GET", path: "/api/mahasiswa/:email" },
        { name: "Tambah Mahasiswa", method: "POST", path: "/api/mahasiswa" },
        { name: "Update Mahasiswa", method: "PUT", path: "/api/mahasiswa/:email" },
        { name: "Hapus Mahasiswa", method: "DELETE", path: "/api/mahasiswa/:email" }
      ]
  },
  {
    title: "Mata Kuliah",
    endpoints: [
      { name: "Ambil Semua Mata Kuliah", method: "GET", path: "/api/mata-kuliah" },
      { name: "Ambil Mata Kuliah Berdasarkan Kode", method: "GET", path: "/api/mata-kuliah/:code_mk" },
      { name: "Tambah Mata Kuliah", method: "POST", path: "/api/mata-kuliah" },
      { name: "Perbarui Data Mata Kuliah", method: "PUT", path: "/api/mata-kuliah/:code_mk" },
      { name: "Hapus Mata Kuliah", method: "DELETE", path: "/api/mata-kuliah/:code_mk" }
    ]
  },
  {
    title: "Nilai",
    endpoints: [
      { name: "Ambil Semua Nilai Mahasiswa", method: "GET", path: "/api/nilai/all" },
      { name: "Tambah Nilai", method: "POST", path: "/api/nilai" },
      { name: "Edit Nilai", method: "PUT", path: "/api/nilai" },
      { name: "Hapus Nilai", method: "DELETE", path: "/api/nilai" }
    ]
  },
  {
    title: "Rekomendasi",
    endpoints: [
      { name: "Ambil Semua Rekomendasi", method: "GET", path: "/api/rekomendasi" },
      { name: "Tambah Rekomendasi", method: "POST", path: "/api/rekomendasi" },
      { name: "Ambil Rekomendasi Berdasarkan ID", method: "GET", path: "/api/rekomendasi/:id" },
      { name: "Edit Rekomendasi", method: "PUT", path: "/api/rekomendasi/:id" }
    ]
  },
  {
    title: "Analisis",
    endpoints: [
      { name: "Ambil Semua Analisis", method: "GET", path: "/api/analisis" },
      { name: "Tambah Analisis", method: "POST", path: "/api/analisis" },
      { name: "Ambil Analisis Berdasarkan ID", method: "GET", path: "/api/analisis/:id" },
      { name: "Edit Analisis", method: "PUT", path: "/api/analisis/:id" }
    ]
  },
  {
    title: "IP/IPK",
    endpoints: [
      { name: "Ambil Data IPK Mahasiswa", method: "GET", path: "/api/ip/ipk" },
      { name: "Ambil Data IPS Mahasiswa", method: "GET", path: "/api/ip/ips" }
    ]
  },
];

const Documents: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [lang, setLang] = useState<"curl" | "python" | "js">("curl");

  const generateCode = (method: string, path: string, name: string) => {
  const fullPath = `${HOST}${path.replace(/:[^/]+/g, "value")}`;

  // Daftar body per endpoint name
  const bodies: Record<string, string> = {
    "Tambah Mahasiswa": `{ "email": "example@mail.com", "nama": "Budi", "angkatan": 2022 }`,
    "Update Mahasiswa": `{ "nama": "Nama Baru", "angkatan": 2021 }`,
    "Tambah Mata Kuliah": `{ "code_mk": "IF101", "nama_mk": "Algoritma", "sks": 3 }`,
    "Tambah Nilai": `{ "id_mahasiswa": "value", "id_mk": "value", "tipe_nilai": "uts", "nilai": 85, "semester": 2 }`,
    "Hapus Nilai": `{ "id_nilai": "value" }`,
    "Edit Nilai": `{ "id_nilai": "value", "nilai": 95 }`,
    "Tambah Analisis": `{ "id_mahasiswa": "value", "data": { "kesimpulan": "Bagus" } }`,
    "Tambah Rekomendasi": `{ "id_mahasiswa": "value", "rekomendasi": ["Sistem Basis Data", "Statistika"] }`,
    // default
    "default": `{ "id_mahasiswa": "value" }`
  };

  const body = bodies[name] ?? bodies["default"];

  switch (lang) {
    case "python":
      return `import requests\n\nresponse = requests.${method.toLowerCase()}("${fullPath}"${
        method !== "GET" ? `,\njson=${body}\n` : ""
      })\nprint(response.json())`;

    case "curl":
      return `curl -X ${method} "${fullPath}" \\\n  -H "Content-Type: application/json"${
        method !== "GET" ? ` \\\n  -d '${body}'` : ""
      }`;

    case "js":
      return `fetch("${fullPath}", {\n  method: "${method}",\n  headers: { "Content-Type": "application/json" }${
        method !== "GET" ? `,\n  body: JSON.stringify(${body})` : ""
      }\n}).then(res => res.json()).then(console.log);`;
  }
};

  return (
  <div className="container-fluid vh-100 overflow-auto bg-white py-4">
    <div>
      <Link to={'/'} className="btn btn-primary rounded button-scale"><FiArrowLeft size={20} /></Link>
    </div>
    <div className="container h-100 d-flex flex-column">
      <h3 className="text-center fw-semibold mb-4">API Documentation</h3>

      {/* Kategori sebagai tombol */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        {endpointGroups.map((group, index) => (
          <button
            key={index}
            className={`btn button-scale btn-outline-primary px-4 py-2 fw-semibold rounded-3 shadow-sm ${
              selectedGroup === index ? "active border-2 border-primary bg-primary text-white" : ""
            }`}
            style={{ minWidth: "160px" }}
            onClick={() => {
              setSelectedGroup(index);
              setSelectedEndpoint(0);
            }}
          >
            {group.title}
          </button>
        ))}
      </div>


      {/* Menu daftar endpoint */}
      <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
        {endpointGroups[selectedGroup].endpoints.map((ep, idx) => (
          <button
            key={idx}
            className={`btn btn-sm button-scale btn-outline-secondary rounded-pill ${
              selectedEndpoint === idx ? "btn-secondary text-white" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedEndpoint(idx)}
          >
            {ep.name || ep.method + " " + ep.path}
          </button>
        ))}
      </div>

      {/* Endpoint detail tampil penuh */}
      <div className="flex-grow-1">
        <div className="card shadow shadow-bottom border-0">
          <div className="card-body">
            <h3 className="mb-3 fw-bold">
              <span
                className={`badge text-white px-2 py-1 rounded`}
                style={{
                  backgroundColor: {
                    GET: "black",
                    POST: "#198754",
                    PUT: "#fd7e14",
                    DELETE: "#dc3545",
                  }[
                    endpointGroups[selectedGroup].endpoints[selectedEndpoint].method
                  ] || "#6c757d"
                }}
              >
                {endpointGroups[selectedGroup].endpoints[selectedEndpoint].method}
              </span>

              <code className="ms-2 text-primary">
                {endpointGroups[selectedGroup].endpoints[selectedEndpoint].path}
              </code>
            </h3>

            {/* Pilihan bahasa */}
            <div className="d-flex gap-2 mb-3">
              {["python", "js", "curl"].map((l) => (
                <button
                  key={l}
                  className={`btn btn-sm button-scale ${
                    lang === l ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setLang(l as "curl" | "python" | "js")}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tampilkan kode */}
            <SyntaxHighlighter
              language={lang}
              style={oneDark}
              customStyle={{ margin: 0, backgroundColor: 'dark' }}
              showLineNumbers
            >
              {generateCode(
                endpointGroups[selectedGroup].endpoints[selectedEndpoint].method,
                endpointGroups[selectedGroup].endpoints[selectedEndpoint].path,
                endpointGroups[selectedGroup].endpoints[selectedEndpoint].name
              )}
            </SyntaxHighlighter>

            {/* Navigasi endpoint */}
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setSelectedEndpoint((prev) =>
                    prev > 0
                      ? prev - 1
                      : endpointGroups[selectedGroup].endpoints.length - 1
                  )
                }
              >
                Sebelumnya
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  setSelectedEndpoint((prev) =>
                    prev < endpointGroups[selectedGroup].endpoints.length - 1
                      ? prev + 1
                      : 0
                  )
                }
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
);


};

export default Documents;
