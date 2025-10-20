import React, { useState } from 'react';

interface CodeBlockProps {
  fileName: string;
  language: string;
  code: string;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const CodeBlock: React.FC<CodeBlockProps> = ({ fileName, language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50 border-b border-gray-700">
        <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-300">{fileName}</span>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
          disabled={copied}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto text-gray-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
