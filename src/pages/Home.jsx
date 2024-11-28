import React, { useState, useEffect } from 'react';
import { generateKeyPair, decryptMessage, encodePublicKey } from '../utils/crypto';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
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
  );
}