import React, { useState, useEffect } from 'react';
import { generateKeyPair, decryptMessage, encodePublicKey } from '../utils/crypto';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
      toast.success('密钥对生成成功！');
    } catch (error) {
      toast.error('生成密钥对失败');
    }
  };

  const handleDecrypt = () => {
    try {
      const decrypted = decryptMessage(keyPair.privateKey, encryptedMessage);
      setDecryptedMessage(decrypted);
      toast.success('消息解密成功！');
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

  const copyShareLink = () => {
    try {
      const encodedKey = encodePublicKey(keyPair.publicKey);
      const shareableLink = `${window.location.origin}/share/${encodedKey}`;
      console.log('分享链接:', shareableLink);
      navigator.clipboard.writeText(shareableLink)
        .then(() => {
          toast.success('分享链接已复制到剪贴板！');
        })
        .catch((err) => {
          console.error('复制失败:', err);
          alert(`请手动复制链接：${shareableLink}`);
        });
    } catch (error) {
      console.error('生成链接失败:', error);
      toast.error('生成分享链接失败');
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">非对称加密工具</h1>
            <p className="text-lg text-gray-600">使用 RSA 公钥加密技术进行安全消息加密</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">密钥管理</h2>
            {!keyPair ? (
              <button
                onClick={handleGenerateKeys}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                生成新密钥对
              </button>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">你的公钥：</label>
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
                    下载私钥
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    复制分享链接
                  </button>
                </div>
              </div>
            )}
          </div>

          {keyPair && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">解密消息</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    加密消息：
                  </label>
                  <textarea
                    value={encryptedMessage}
                    onChange={(e) => setEncryptedMessage(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg font-mono text-sm"
                    placeholder="在此粘贴加密消息..."
                  />
                </div>
                <button
                  onClick={handleDecrypt}
                  className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  解密
                </button>
                {decryptedMessage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">解密后的消息：</label>
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
    </div>
  );
}