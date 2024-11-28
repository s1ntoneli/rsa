import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { encryptMessage, decodePublicKey } from '../utils/crypto';
import toast from 'react-hot-toast';

export default function Share() {
  const { publicKey } = useParams();
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [recipientKey, setRecipientKey] = useState('');

  useEffect(() => {
    if (publicKey) {
      try {
        const decodedKey = decodePublicKey(publicKey);
        setRecipientKey(decodedKey);
      } catch (error) {
        toast.error('无效的公钥');
      }
    }
  }, [publicKey]);

  const handleEncrypt = () => {
    if (!recipientKey.trim()) {
      toast.error('请输入接收者的公钥');
      return;
    }

    try {
      const encrypted = encryptMessage(recipientKey, message);
      setEncryptedMessage(encrypted);
      toast.success('消息加密成功！');
    } catch (error) {
      toast.error('加密失败。请检查公钥格式。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                首页
              </Link>
              <Link to="/share" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                加密消息
              </Link>
            </div>
            <a
              href="https://twitter.com/s1ntone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>推特</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">加密消息</h1>
            <p className="text-lg text-gray-600">发送一条只有接收者能读取的加密消息</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收者的公钥：
              </label>
              <textarea
                value={recipientKey}
                onChange={(e) => setRecipientKey(e.target.value)}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg font-mono text-sm"
                placeholder="在此输入或粘贴接收者的公钥..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你的消息：
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 p-4 border border-gray-200 rounded-lg font-mono text-sm"
                placeholder="在此输入你的消息..."
              />
            </div>

            <button
              onClick={handleEncrypt}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              加密
            </button>

            {encryptedMessage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  加密后的消息：
                </label>
                <textarea
                  readOnly
                  value={encryptedMessage}
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(encryptedMessage);
                    toast.success('加密消息已复制到剪贴板！');
                  }}
                  className="mt-4 w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  复制加密消息
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}