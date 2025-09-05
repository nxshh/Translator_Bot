// src/components/Chatbot.jsx
import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [text, setText] = useState("");
  const [inputLang, setInputLang] = useState("en");
  const [outputLang, setOutputLang] = useState("fr");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "kn", name: "Kannada" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
  ];

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/translate", {
        text,
        input_lang: inputLang,
        output_lang: outputLang,
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">🌐 Translator Chatbot</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        className="w-full p-2 border rounded mb-3"
      />

      <div className="flex gap-4 mb-3">
        <select
          value={inputLang}
          onChange={(e) => setInputLang(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <select
          value={outputLang}
          onChange={(e) => setOutputLang(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      {response && (
        <div className="mt-4 p-3 bg-white border rounded">
          {response.error ? (
            <p className="text-red-500">{response.error}</p>
          ) : (
            <>
              <p><strong>Input:</strong> {response.input.input_text} ({response.input.input_lang})</p>
              <p><strong>Output:</strong> {response.output.output_text} ({response.output.output_lang})</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
