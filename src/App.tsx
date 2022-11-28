import { useState } from 'react';
import './App.css';
import { ReactComponent as ClipBoardIcon } from './assets/clipboard-copy-icon.svg';
import { createHmac } from './utils';

function App() {
    const [accessTokenSecret, setAccessTokenSecret] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');

    const copyToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text).catch((error) => console.error(error));
    };

    return (
        <div className="App">
            <div className="form">
                <input
                    type="text"
                    placeholder="access_token_secret"
                    value={accessTokenSecret}
                    onChange={(event) => setAccessTokenSecret(event.target.value)}
                />
                <textarea
                    rows={10}
                    placeholder="payload"
                    value={payload}
                    onChange={(event) => setPayload(event.target.value)}
                />
                <div className="syntax-highlighter"></div>
            </div>
            <button onClick={async () => setSignature(await createHmac(accessTokenSecret, payload))}>
                Sign SHA-256 HMAC
            </button>
            <div className="signature" onClick={() => copyToClipBoard(signature)} aria-hidden="true">
                <code>{signature}</code>
                {signature && (
                    <span>
                        <ClipBoardIcon />
                    </span>
                )}
            </div>
        </div>
    );
}

export default App;
