export type Encoding = 'hex' | 'base64' | 'base64url';

export function buf2hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function buf2base64(buffer: ArrayBuffer) {
    return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

export function buf2base64url(buffer: ArrayBuffer) {
    return buf2base64(buffer).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
}

export async function createHmac(secretKey: string, payload: string, encoding: Encoding) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        enc.encode(secretKey),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        enc.encode(JSON.stringify(formatIfJSON(payload)).replace(/\//g, '\\/'))
    );

    switch (encoding) {
        case 'base64':
            return buf2base64(signature);
        case 'base64url':
            return buf2base64url(signature);
        default:
            return buf2hex(signature);
    }
}

function formatIfJSON(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
