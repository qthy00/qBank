import { Base64 } from 'js-base64';

export { textToBase64, base64ToText, isValidBase64, removePotentialDataAndMimePrefix };

function textToBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  const encoded = Base64.encode(str);
  return makeUrlSafe ? makeUriSafe(encoded) : encoded;
}

function base64ToText(str: string,
                      encoding: 'UTF-8' | 'UTF-16' | 'ISO-8859-1' = 'UTF-8',
                      { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  if (!isValidBase64(str, { makeUrlSafe })) {
    throw new Error('无效的Base64字符串');
  }

  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    const buffer = Base64.toUint8Array(cleanStr)
    switch (encoding) {
      case 'UTF-8':
        return new TextDecoder('utf-8').decode(buffer)
      case 'UTF-16':
        return new TextDecoder('utf-16').decode(buffer)
      case 'ISO-8859-1': {
        const uint8Array = new Uint8Array(buffer)
        let text = ''
        for (let i = 0; i < uint8Array.length; i++) {
          text += String.fromCharCode(uint8Array[i])
        }
        return text
      }
      default:
        throw new Error('不支持的编码格式')
    }
  }
  catch (error) {
    throw new Error('解码失败: ' + (error instanceof Error ? error.message : '未知错误'))
  }
}

function removePotentialDataAndMimePrefix(str: string) {
  return str.replace(/^data:.*?;base64,/, '');
}

function isValidBase64(str: string, { makeUrlSafe = false }: { makeUrlSafe?: boolean } = {}) {
  let cleanStr = removePotentialDataAndMimePrefix(str);
  if (makeUrlSafe) {
    cleanStr = unURI(cleanStr);
  }

  try {
    const reEncodedBase64 = Base64.fromUint8Array(Base64.toUint8Array(cleanStr));
    console.log('reEncodedBase64', reEncodedBase64);
    if (makeUrlSafe) {
      return removePotentialPadding(reEncodedBase64) === cleanStr;
    }
    return reEncodedBase64 === cleanStr.replace(/\s/g, '');
  }
  catch {
    return false;
  }
}

function makeUriSafe(encoded: string) {
  return encoded.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unURI(encoded: string): string {
  return encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/[^A-Za-z0-9+/]/g, '');
}

function removePotentialPadding(str: string) {
  return str.replace(/=/g, '');
}
