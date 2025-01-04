// Uses Web Crypto API available in Cloudflare Workers
export async function hashPassword(password: string) {
  // Convert password to array buffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Hash password with salt using SHA-256
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array([...salt, ...data])
  );

  // Convert hash to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  // Return salt and hash
  return {
    salt: btoa(String.fromCharCode(...salt)),
    hash: hashBase64,
  };
}

export async function verifyPassword(
  password: string,
  storedSalt: string,
  storedHash: string
) {
  // Decode stored salt from base64
  const salt = Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0));

  // Hash password with stored salt
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array([...salt, ...data])
  );

  // Convert to base64 and compare
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64 === storedHash;
}
