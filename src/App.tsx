import React, { createRef, useEffect, useState } from 'react';
import './App.css';
import { ReactComponent as ClipBoardIcon } from './assets/clipboard-copy-icon.svg';
import { createHmac, Encoding } from './utils';

const encodingOptions: { label: string; type: Encoding }[] = [
    { label: 'Hex', type: 'hex' },
    { label: 'Base 64', type: 'base64' },
    { label: 'Base 64 URL', type: 'base64url' },
];

function App() {
    const [accessTokenSecret, setAccessTokenSecret] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [encoding, setEncoding] = useState<Encoding>('hex');

    const ref = createRef<HTMLFormElement>();

    useEffect(() => {
        createHmacFromData();
    }, [encoding]);

    const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey == false) {
            onSubmit(e);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createHmacFromData();
    };

    const createHmacFromData = async () => {
        if (accessTokenSecret && payload) {
            const _signature = await createHmac(accessTokenSecret, payload, encoding);
            setSignature(_signature);
        }
    };

    const copyToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text).catch((error) => console.error(error));
    };

    return (
        <div className="App">
            <h1 className="title">SHA-256 HMAC</h1>
            <form ref={ref} onSubmit={onSubmit}>
                <div className="form">
                    <input
                        type="text"
                        placeholder="key"
                        value={accessTokenSecret}
                        onChange={(event) => setAccessTokenSecret(event.target.value)}
                    />
                    <textarea
                        rows={10}
                        placeholder="payload"
                        value={payload}
                        onChange={(event) => setPayload(event.target.value)}
                        onKeyDown={onEnterPress}
                    />
                </div>
                <button type="submit" onClick={() => createHmacFromData()}>
                    Sign SHA-256 HMAC
                </button>
            </form>
            <div className="signature" onClick={() => copyToClipBoard(signature)} aria-hidden="true">
                <code>{signature}</code>
                {signature && (
                    <span>
                        <ClipBoardIcon />
                    </span>
                )}
            </div>
            <div>
                {encodingOptions.map((e) => (
                    <React.Fragment key={e.type}>
                        <input
                            type="radio"
                            name="encoding"
                            checked={encoding === e.type}
                            id={e.type}
                            value={e.type}
                            onChange={(e) => setEncoding(e.target.value as Encoding)}
                        />
                        <label htmlFor={e.type}>{e.label}</label>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default App;
