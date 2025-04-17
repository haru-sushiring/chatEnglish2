'use client';

import React from 'react';

export default function Home() {
    const [word, setWord] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/vocabulary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Laravel CSRFトークンが必要な場合だけ使う
            // サーバーがRenderでAPI分離されてるなら不要な可能性あり
            'X-CSRF-TOKEN': typeof document !== 'undefined'
              ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
              : ''
          },
          body: JSON.stringify({
            word,
            user_id: 1 // 仮のユーザーID
          })
        });
        
        if (response.ok) {
          alert('単語が保存されました！1週間後に通知されます。');
          setWord('');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">英単語学習アプリ</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="word" className="block mb-2">英単語</label>
                <input
                    type="text"
                    id="word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                保存
                </button>
            </form>
        </div>
    );
}