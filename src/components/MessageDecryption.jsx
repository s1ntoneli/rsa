import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { decryptMessage } from '../utils/crypto';

export function MessageDecryption({ keyPair }) {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');

  const handleDecrypt = () => {
    if (!encryptedMessage.trim()) {
      toast.error('请输入需要解密的消息');
      return;
    }

    try {
      const decrypted = decryptMessage(keyPair.privateKey, encryptedMessage);
      setDecryptedMessage(decrypted);
      toast.success('消息解密成功！');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">解密消息</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            加密的消息：
          </label>
          <textarea
            value={encryptedMessage}
            onChange={(e) => setEncryptedMessage(e.target.value)}
            className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="粘贴需要解密的消息..."
          />
        </div>
        <button
          onClick={handleDecrypt}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
          <span>解密</span>
        </button>
        {decryptedMessage && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">解密结果：</p>
            <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm">
              {decryptedMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}