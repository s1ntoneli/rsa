import React from 'react';
import toast from 'react-hot-toast';
import { generateKeyPair } from '../utils/crypto';

export function KeyManagement({ keyPair, setKeyPair }) {
  const handleGenerateKeys = async () => {
    try {
      const newKeyPair = await generateKeyPair();
      setKeyPair(newKeyPair);
      localStorage.setItem('privateKey', newKeyPair.privateKey);
      localStorage.setItem('publicKey', newKeyPair.publicKey);
      toast.success('新的密钥对生成成功！');
    } catch (error) {
      toast.error('生成密钥对失败');
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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900">密钥管理</h2>
      </div>
      {!keyPair ? (
        <button
          onClick={handleGenerateKeys}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>生成新的密钥对</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">您的公钥：</p>
            <textarea
              readOnly
              value={keyPair.publicKey}
              className="w-full h-32 p-3 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadPrivateKey}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>下载私钥</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getShareableLink());
                toast.success('分享链接已复制到剪贴板！');
              }}
              className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>复制分享链接</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}