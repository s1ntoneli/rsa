import forge from 'node-forge';

export function generateKeyPair() {
  return new Promise((resolve) => {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    
    resolve({ publicKey, privateKey });
  });
}

export function encryptMessage(publicKeyPem, message) {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(message, 'RSA-OAEP');
  return forge.util.encode64(encrypted);
}

export function decryptMessage(privateKeyPem, encryptedMessage) {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decoded = forge.util.decode64(encryptedMessage);
    const decrypted = privateKey.decrypt(decoded, 'RSA-OAEP');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed. Please check your private key.');
  }
}

export function encodePublicKey(publicKey) {
  try {
    // 移除 PEM 头尾和空格
    const cleanKey = publicKey
      .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, '')
      .replace(/[\n\r\s]/g, '');
    
    // 使用 encodeURIComponent 处理特殊字符
    return encodeURIComponent(cleanKey);
  } catch (error) {
    console.error('编码公钥时出错:', error);
    throw new Error('公钥编码失败');
  }
}

export function decodePublicKey(encodedKey) {
  try {
    // 解码 URL 编码的字符串
    const decoded = decodeURIComponent(encodedKey);
    
    // 重新格式化为 PEM 格式
    return `-----BEGIN PUBLIC KEY-----\n${decoded}\n-----END PUBLIC KEY-----`;
  } catch (error) {
    console.error('解码公钥时出错:', error);
    throw new Error('公钥解码失败');
  }
}