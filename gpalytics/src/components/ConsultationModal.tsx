import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import './styles/modal.css'
import { streamVercelAI } from '../services/ai';
import { useProfile } from '../hooks/useProfile';
import { setHandleSend } from './sendHandler';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const URL = `${import.meta.env.VITE_URL_HOST}/api`;
interface Message {
  id?: number;
  sender: 'User' | 'AI';
  text: string;
}

interface Props {
  show: boolean;
  onClose: () => void;
}

const renderers = {
  code({ node, inline, className, children, ...props }: any) {
    const raw = String(children);
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1] || 'mark';
    const code = raw.replace(/\n$/, '');

    if (lang === 'mark'){
      return <p className='bg-info text-dark d-inline-block px-2 rounded' style={{fontWeight: '700'}}>{children}</p>;
    }

    return !inline ? (
      <CodeWithCopy language={lang} code={code} />
    ) : (
      <code className="bg-light text-dark px-1 rounded">{children}</code>
    );
  },
};


const CodeWithCopy = ({ language, code }: { language: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="position-relative my-3 border rounded bg-white text-dark overflow-hidden">
      <div className="d-flex justify-content-between align-items-center px-3 py-1 border-bottom bg-dark small">
        <span className="text-light">{language}</span>
        <button
          onClick={handleCopy}
          className="btn btn-sm btn-outline-secondary py-0 px-2"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, backgroundColor: 'dark' }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const ConsultationModal: React.FC<Props> = ({ show, onClose }) => {
  const { getProfile } = useProfile();

  const [visible, setVisible] = useState(show);
  useEffect(() => {
    if (show) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 0);
    }
  }, [show]);

  const [selectedLLM, setSelectedLLM] = useState('deepseek-r1-distill-llama-70b');
  const [selectedLabel, setSelectedLabel] = useState('DeepSeek-R1 70B')
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scrollTrigger]);

  const handleSend = async (text?:string) => {
    let content = text?.trim() || message.trim();

    if (!content) return;

    const userMessage: Message = { sender: 'User', text: content };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setScrollTrigger((prev) => prev + 1);
    
    const dataCollectingId = Date.now();
    let isAnalisis = false

    if (content === "Analisis data akademik saya!") {
      isAnalisis = true
      setScrollTrigger((prev) => prev + 1);
      const aiResponse: Message = { id: dataCollectingId, sender: 'AI', text: `Mengumpulkan Data...` };
      setMessages((prev) => [...prev, aiResponse]);
      const bahan = localStorage.getItem('rekomendasi')
      content = `Kamu adalah seorang data analis professional, maka analisislah data berikut ini dengan mendalam dan output berupa 'rekomendasi' saja. ${bahan}`
      setTimeout(()=>{
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === dataCollectingId
              ? { ...msg, text: '✅ Data berhasil dikumpulkan!' }
              : msg
          )
        );
      }, 1000)
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);
    } else if (content === "Buatkan Jadwal Belajar 1 Minggu") {
      setScrollTrigger((prev) => prev + 1);
      const aiResponse: Message = { id: dataCollectingId, sender: 'AI', text: `Mengumpulkan Data...` };
      setMessages((prev) => [...prev, aiResponse]);

      const rekomendasi = JSON.parse(localStorage.getItem("rekomendasi") || "{}");
      const dataNilai = rekomendasi.nilaiTertinggi || [];

      const daftarNilai = dataNilai.map((item: any, i: number) =>
        `${i + 1}. ${item.mataKuliah} (Semester ${item.semester}, SKS ${item.sks}) — ` +
        `Tugas: ${item.nilaiTugas}, UTS: ${item.nilaiUTS}, UAS: ${item.nilaiUAS}, ` +
        `Nilai Akhir: ${(+item.nilaiAkhir).toFixed(2)}`
      ).join("\n");
      content = `Buatkan jadwal belajar 1 minggu berdasarkan data berikut ini:\n\n${daftarNilai}`;

      setTimeout(()=>{
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === dataCollectingId
              ? { ...msg, text: '✅ Data berhasil dikumpulkan!' }
              : msg
          )
        );
      }, 1000)
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(2000);
    } else {
      const aiResponse: Message = { sender: 'AI', text: `` };
      setMessages((prev) => [...prev, aiResponse]);
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === dataCollectingId
          ? { ...msg, text: 'Analyzing...' }
          : msg
      )
    );
    let streamedText = '';

    const updateAIMessage = (chunk: string) => {
      streamedText += chunk;

      setMessages((prev) => {
        const newMessages = [...prev];
        const last = newMessages[newMessages.length - 1];
        if (last.sender === 'AI') {
          last.text = streamedText;
        }
        return newMessages;
      });
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setScrollTrigger((prev) => prev + 1);
    };

    await streamVercelAI(
      selectedLLM,
      content,
      updateAIMessage,
      messages.map(msg => ({
      role: msg.sender === 'User' ? 'user' : 'assistant',
      content: msg.text
    })));
    
    if (isAnalisis) setResult(streamedText);
  };
  
  useEffect(() => {
    if (!result || !getProfile) return;

    localStorage.setItem('resultRekomendasi', JSON.stringify(result));

    const syncRekomendasi = async () => {
      try {
        const response = await axios.get(`${URL}/rekomendasi/${getProfile._id}`);

        const rekomendasi = response.data;

        if (rekomendasi && rekomendasi._id) {
          await axios.put(`${URL}/rekomendasi/${rekomendasi._id}`, {
            id_mahasiswa: getProfile._id,
            rekomendasi: result
          });
        } else {
          await axios.post(`${URL}/rekomendasi`, {
            id_mahasiswa: getProfile._id,
            rekomendasi: result
          });
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          await axios.post(`${URL}/rekomendasi`, {
            id_mahasiswa: getProfile._id,
            rekomendasi: result
          });
        } else {
          console.error('Gagal sinkronisasi rekomendasi:', error);
        }
      }
    };

    syncRekomendasi();
  }, [result, getProfile]);

  useEffect(() => {
    setHandleSend(handleSend);
  }, []);

  return (
    <div className={`modal fade mt-0 ${show ? 'show d-block' : 'd-block'}`}
        tabIndex={-1}
        style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          transition: 'opacity 0.3s ease visibility 0.3s ease',
          opacity: show ? 1 : 0,
          visibility: show ? 'visible' : 'hidden',
          pointerEvents: show ? 'auto' : 'none',
          zIndex: show ? 1050 : -1,
        }}
      >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-black text-light border border-info shadow-lg">
          
          {/* Header */}
          <div className="modal-header border-info border-bottom d-flex flex-wrap justify-content-between align-items-center">
            <h5 className="modal-title text-neon mb-2 mb-md-0">💬 AI Chat Consultation</h5>

            {/* LLM Selector */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <label className="text-info mb-0 small">Model:</label>
              {[
                { value: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek-R1 70B' },
                { value: 'llama-3.3-70b-versatile', label: 'Llama-3.3 70B' },
                { value: 'qwen/qwen3-32b', label: 'Qwen-3 32B' },
                { value: 'mistral-saba-24b', label: 'Mistral 24B' },
              ].map((model) => (
                <button
                  key={model.value}
                  className={`btn button-scale-m btn-sm ${selectedLLM === model.value ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => {
                    setSelectedLLM(model.value);
                    setSelectedLabel(model.label);
                    setMessages([]);
                  }}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="modal-body custom-scroll py-0" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <div className="chat-window p-3 py-2 bg-dark border border-info" style={{ minHeight: '50vh' }}>
              {/* PROMPT AWAL */}
              {messages.length === 0 && (
                <div className="prompt-intro text-light text-center m-5">
                  <h5 className="mb-4">{selectedLabel}</h5>
                  <div className="row justify-content-center g-3">
                    {[
                      {
                        icon: '🧠',
                        text: 'Jelaskan apa itu neural network?',
                      },
                      {
                        icon: '📅',
                        text: 'Buatkan Jadwal Belajar 1 Minggu',
                      },
                      {
                        icon: '💡',
                        text: 'Analisis data akademik saya!',
                      },
                    ].map((item, i) => (
                      <div key={i} className="col-12 col-md-4">
                        <div
                          onClick={() => handleSend(item.text)}
                          className="bg-secondary btn-prompt-intro glossy-sweep text-light rounded p-3 h-100 shadow-sm"
                          style={{ cursor: 'pointer', transition: '0.3s' }}
                        >
                          <div className="fs-3 mb-2">{item.icon}</div>
                          <div className="fw-semibold">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`w-100 d-flex ${msg.sender === 'User' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`mb-2 p-2 rounded ${
                      msg.sender === 'User' ? 'bg-secondary text-light pb-0' : 'bg-black text-info border border-info w-100'
                    }`}
                    style={{ maxWidth: msg.sender === 'User' ? '50%' : '100%',
                      textAlign: 'justify' }}
                  >
                    <div className={`bg-primary d-flex justify-content-center text-light w-100 p-2 mb-3 ${msg.sender === 'User' ? 'd-none': 'd-block'}`}>{selectedLabel}</div>
                    
                    <ReactMarkdown components={renderers}>{msg.text}</ReactMarkdown>

                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="modal-footer border-info border-top d-flex flex-column gap-2">
            <textarea
              className="form-control bg-black text-light border-info"
              rows={2}
              placeholder="Tulis pertanyaanmu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="w-100 d-flex align-items-center justify-content-between">
              <button className="btn button-scale btn-outline-light" onClick={onClose}>Tutup</button>
              <div className='mx-3 text-secondary d-md-flex d-grid justify-content-center gap-2' style={{ fontSize: '0.8rem' }}>
                <span className=''>Send <strong>[ Enter ]</strong></span>
                <span className='d-md-block d-none'>|</span>
                <span className=''>Multilines <strong>[ Shift + Enter ]</strong></span>
              </div>
              <button className="btn button-scale btn-info fw-bold text-dark border-glow d-flex align-items-center"
                onClick={() => handleSend(message)}
                disabled={!message.trim()}>
                Kirim <FiSend className="ms-2" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
