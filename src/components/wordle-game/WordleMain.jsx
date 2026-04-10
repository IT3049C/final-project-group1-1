
import { useCallback, useEffect, useState } from 'react';
import { WordleBoard } from './WordleBoard';
import { getRandomWord } from './WordleGameHandler';

export function WordleMain() {
    const [targetWord, setTargetWord] = useState('');
    const [loading, setLoading] = useState(true);

    const loadTargetWord = useCallback(async () => {
        setLoading(true);
        const nextWord = await getRandomWord();
        setTargetWord(nextWord);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadTargetWord();
    }, [loadTargetWord]);

    return (
        <div className="wordle-main">

            {loading ? (
                <p className="wordle-status" aria-live="polite">
                    Loading word...
                </p>
            ) : (
                <WordleBoard targetWord={targetWord} onRestart={loadTargetWord} />
            )}
        </div>
    );
}

