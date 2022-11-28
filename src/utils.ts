export function buf2hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export async function createHmac(secretKey: string, payload: unknown) {
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
    return buf2hex(signature);
}

function formatIfJSON(text: unknown) {
    try {
        return JSON.parse(text as string);
    } catch {
        /* empty */
    }
    return text;
}
