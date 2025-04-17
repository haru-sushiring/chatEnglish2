'use client';

import React, { useEffect } from 'react';
import vocabularyRepository from '@/repository/vocabulary/vocabularyRepository';

interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [word, setWord] = React.useState('');
  const [vocabulary, setVocabulary] = React.useState<Vocabulary[]>();
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await vocabularyRepository.store({
        word,
        user_id: 1, // 仮のユーザーID
      });

      if (response.status === 200) {
        alert('単語が保存されました！');
        setWord('');
        setVocabulary(prev => prev ? [response.data, ...prev] : [response.data]);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const res = await vocabularyRepository.index(1); // 仮の user_id = 1
        if (res.status === 200) {
          setVocabulary(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch vocabulary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 border-b pb-2">AI英単語学習アプリ</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded border border-gray-200 shadow-sm">
          <div>
            <label htmlFor="word" className="block mb-1 text-sm text-gray-700">英単語</label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded transition-colors flex items-center justify-center
              ${isSubmitting
                ? 'bg-blue-100 text-blue-700 opacity-50 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
            `}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-blue-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {isSubmitting ? '送信中...' : '調べる'}
          </button>
        </form>

        <div id="result" className="mt-10">
          <h2 className="text-xl font-semibold mb-4">保存された単語一覧</h2>

          {loading ? (
            <p className="text-gray-500">読み込み中...</p>
          ) : vocabulary && vocabulary.length > 0 ? (
            <div className="space-y-4">
              {vocabulary.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                  <p><span className="font-bold text-lg">{item.word}</span></p>
                  <p className="text-sm text-gray-600 mt-1" dangerouslySetInnerHTML={{ __html: item.meaning.replace(/\n/g, '<br />') }} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">表示できる単語がありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
