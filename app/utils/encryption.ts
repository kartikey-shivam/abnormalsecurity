const getEncryptionKey = (): Uint8Array => {
  // Generate a fixed 256-bit (32-byte) key
  const key = new Uint8Array(32);
  // Fill with a consistent value for testing (in production, use a secure key)
  for (let i = 0; i < 32; i++) {
    key[i] = i;
  }
  return key;
};

export const encryptFile = async (
  file: File
): Promise<{ encryptedData: Blob; iv: Uint8Array }> => {
  const key = await crypto.subtle.importKey(
    "raw",
    getEncryptionKey(),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileData = await file.arrayBuffer();

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    fileData
  );

  return {
    encryptedData: new Blob([encryptedData]),
    iv,
  };
};

export const decryptFile = async (
  encryptedData: ArrayBuffer,
  iv: Uint8Array
): Promise<ArrayBuffer> => {
  const key = await crypto.subtle.importKey(
    "raw",
    getEncryptionKey(),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encryptedData
  );

  return decryptedData;
};
