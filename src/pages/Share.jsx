import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { encryptMessage, decodePublicKey } from '../utils/crypto';
import toast from 'react-hot-toast';

export default function Share() {
  const { publicKey } = useParams();
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decodedPublicKey, setDecodedPublicKey] = useState('');

  useEffect(() => {
    if (publicKey) {
      try {
        const decodedKey = decodePublicKey(publicKey);
        setDecodedPublicKey(decodedKey);
      } catch (error) {
        console.error('解码公钥失败:', error);
        toast.error('无效的公钥格式，请检查链接是否完整');
        setDecodedPublicKey('');
      }
    }
  }, [publicKey]);

  const handleEncrypt = () => {
    try {
      const encrypted = encryptMessage(decodedPublicKey, message);
      setEncryptedMessage(encrypted);
      toast.success('消息加密成功！');
    } catch (error) {
      toast.error('加密失败。请检查公钥格式。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
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
              readOnly
              value={decodedPublicKey}
              className="w-full h-32 p-4 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm"
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
  );
}