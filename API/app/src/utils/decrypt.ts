import NodeRSA from 'node-rsa';
import fs from 'fs';
import path from 'path';

// Load the private key
const privateKeyPath = path.join(__dirname, '../../private_key.pem');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const key = new NodeRSA(privateKey);

export const decryptApiKey = (encryptedApiKey: string): string => {
  const decrypted = key.decrypt(Buffer.from(encryptedApiKey, 'base64'), 'utf8');
  return decrypted;
};