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