import { createDecipheriv, createHash } from "node:crypto";

function getEncryptionKey() {
  const sharedKey = process.env.LOGIN_ENCRYPTION_KEY;

  if (!sharedKey) {
    throw new Error("LOGIN_ENCRYPTION_KEY is not configured");
  }

  return createHash("sha256").update(sharedKey, "utf8").digest();
}

export function decryptPassword(encryptedPassword) {
  if (typeof encryptedPassword !== "string") {
    throw new TypeError("Encrypted password must be a string");
  }

  const parts = encryptedPassword.split(":");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    throw new TypeError("Expected iv:authTag:ciphertext format");
  }

  const [ivBase64, authTagBase64, ciphertextBase64] = parts;
  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const ciphertext = Buffer.from(ciphertextBase64, "base64");

  if (iv.length !== 12 || authTag.length !== 16 || ciphertext.length === 0) {
    throw new TypeError("Invalid AES-GCM data");
  }

  const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}
