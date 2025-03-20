/**
 * 使用SHA-256加密字符串
 * @param str 要加密的字符串
 * @returns 加密后的字符串
 */
export const sha256 = async (str: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};