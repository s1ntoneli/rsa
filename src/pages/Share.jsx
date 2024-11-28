import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { encryptMessage } from '../utils/crypto';
import toast from 'react-hot-toast';

export default function Share() {
  const { publicKey } = useParams();
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decodedPublicKey, setDecodedPublicKey] = useState('');

  useEffect(() => {
    if (publicKey) {
      setDecodedPublicKey(decodeURIComponent(publicKey));
    }
  }, [publicKey]);

  const handleEncrypt = () => {
    try {
      const encrypted = encryptMessage(decodedPublicKey, message);
      setEncryptedMessage(encrypted);
      toast.success('Message encrypted successfully!');
    } catch (error) {
      toast.error('Encryption failed. Please check the public key format.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Encrypt Message</h1>
          <p className="text-lg text-gray-600">Send an encrypted message that only the recipient can read</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient's Public Key:
            </label>
            <textarea
              readOnly
              value={decodedPublicKey}
              className="w-full h-32 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-4 border border-gray-200 rounded-lg font-mono text-sm"
              placeholder="Type your message here..."
            />
          </div>

          <button
            onClick={handleEncrypt}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Encrypt
          </button>

          {encryptedMessage && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encrypted Message:
              </label>
              <textarea
                readOnly
                value={encryptedMessage}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(encryptedMessage);
                  toast.success('Encrypted message copied to clipboard!');
                }}
                className="mt-4 w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Copy Encrypted Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}