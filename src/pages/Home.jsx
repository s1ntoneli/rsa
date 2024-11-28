import React, { useState, useEffect } from 'react';
import { generateKeyPair, decryptMessage } from '../utils/crypto';
import toast from 'react-hot-toast';

export default function Home() {
  const [keyPair, setKeyPair] = useState(null);
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  useEffect(() => {
    const savedPrivateKey = localStorage.getItem('privateKey');
    const savedPublicKey = localStorage.getItem('publicKey');
    if (savedPrivateKey && savedPublicKey) {
      setKeyPair({ privateKey: savedPrivateKey, publicKey: savedPublicKey });
    }
  }, []);

  const handleGenerateKeys = async () => {
    try {
      const newKeyPair = await generateKeyPair();
      setKeyPair(newKeyPair);
      localStorage.setItem('privateKey', newKeyPair.privateKey);
      localStorage.setItem('publicKey', newKeyPair.publicKey);
      toast.success('New key pair generated successfully!');
    } catch (error) {
      toast.error('Failed to generate key pair');
    }
  };

  const handleDecrypt = () => {
    try {
      const decrypted = decryptMessage(keyPair.privateKey, encryptedMessage);
      setDecryptedMessage(decrypted);
      toast.success('Message decrypted successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadPrivateKey = () => {
    const blob = new Blob([keyPair.privateKey], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'private-key.pem';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getShareableLink = () => {
    const encodedKey = encodeURIComponent(keyPair.publicKey);
    return `${window.location.origin}/share/${encodedKey}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Asymmetric Encryption Tool</h1>
          <p className="text-lg text-gray-600">Secure message encryption using RSA public-key cryptography</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Key Management</h2>
          {!keyPair ? (
            <button
              onClick={handleGenerateKeys}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Generate New Key Pair
            </button>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Public Key:</label>
                <textarea
                  readOnly
                  value={keyPair.publicKey}
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadPrivateKey}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Download Private Key
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getShareableLink());
                    toast.success('Share link copied to clipboard!');
                  }}
                  className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Copy Share Link
                </button>
              </div>
            </div>
          )}
        </div>

        {keyPair && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Decrypt Message</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encrypted Message:
                </label>
                <textarea
                  value={encryptedMessage}
                  onChange={(e) => setEncryptedMessage(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg font-mono text-sm"
                  placeholder="Paste the encrypted message here..."
                />
              </div>
              <button
                onClick={handleDecrypt}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Decrypt
              </button>
              {decryptedMessage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Decrypted Message:</label>
                  <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm">
                    {decryptedMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}