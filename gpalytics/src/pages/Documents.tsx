import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { endpointGroups } from "../components/endpointGroups";
const HOST = "https://gpalyticsbackend-production.up.railway.app";


const Documents: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [lang, setLang] = useState<"curl" | "python" | "js">("python");

  const generateCode = (method: string, path: string, endpoint: any) => {
    const fullPath = `${HOST}${path.replace(/:[^/]+/g, "value")}`;
    const body = endpoint.body ? JSON.stringify(endpoint.body, null, 2) : null;

    switch (lang) {
      case "python":
        return `import requests\n\nresponse = requests.${method.toLowerCase()}("${fullPath}"${
          body ? `,\n    json=${body}\n` : ""
        })\nprint(response.json())`;

      case "curl":
        return `curl -X ${method} "${fullPath}" \\\n  -H "Content-Type: application/json"${
          body ? ` \\\n  -d '${body}'` : ""
        }`;

      case "js":
        return `fetch("${fullPath}", {\n  method: "${method}",\n  headers: { "Content-Type": "application/json" }${
          body ? `,\n  body: JSON.stringify(${body})` : ""
        }\n}).then(res => res.json()).then(console.log);`;
    }
  };


  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      generateCode(
        endpointGroups[selectedGroup].endpoints[selectedEndpoint].method,
        endpointGroups[selectedGroup].endpoints[selectedEndpoint].path,
        endpointGroups[selectedGroup].endpoints[selectedEndpoint].name
      )
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          <div className="card-body overflow-hidden">
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
                  onClick={() => setLang(l as "python" | "js" | "curl")}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tampilkan kode */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedGroup}-${selectedEndpoint}`}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="card-body"
                >
                  <div className="position-relative my-3 border rounded bg-white text-dark overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center px-3 py-1 border-bottom bg-dark small">
                      <span className="text-light">{lang}</span>
                      <button
                        onClick={handleCopy}
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={lang === 'curl'? 'bash' : lang}
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
                    {endpointGroups[selectedGroup].endpoints[selectedEndpoint].body && (
                      <motion.div
                        key={`${selectedGroup}-${selectedEndpoint}`}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut", delay: 0.2 }}
                        className="card-body"
                      >
                      <div className="m-3">
                        <h6>Body:</h6>
                        <div className="position-relative my-3 border rounded text-dark overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center px-3 py-1 border-bottom bg-dark small">
                            <span className="text-light">json</span>
                          </div>
                          <pre className="rounded">
                            <SyntaxHighlighter
                              language="json"
                              style={oneDark}
                              customStyle={{ margin: 0, backgroundColor: 'dark' }}
                            >
                            {JSON.stringify(endpointGroups[selectedGroup].endpoints[selectedEndpoint].body, null, 2)}
                            </SyntaxHighlighter>
                          </pre>
                          </div>
                      </div>
                      </motion.div>
                    )}
                    {/* {endpointGroups[selectedGroup].endpoints[selectedEndpoint].params && (
                      <div className="m-3">
                        <h6>Params:</h6>
                        <div className="position-relative my-3 border rounded text-dark overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center px-3 py-1 border-bottom bg-dark small">
                            <span className="text-light">json</span>
                          </div>
                          <pre className="rounded">
                            <SyntaxHighlighter
                              language="json"
                              style={oneDark}
                              customStyle={{ margin: 0, backgroundColor: 'dark' }}
                            >
                            {JSON.stringify(endpointGroups[selectedGroup].endpoints[selectedEndpoint].params, null, 2)}
                            </SyntaxHighlighter>
                        </pre>
                          </div>
                      </div>
                    )} */}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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
