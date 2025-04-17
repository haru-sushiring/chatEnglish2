<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vocabulary;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class VocabularyController extends Controller
{
    /**
     * Display the vocabulary input form.
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request)
    {
        // 特定ユーザーの単語一覧を返す
        $vocabularies = Vocabulary::where('user_id', $request->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($vocabularies, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'word' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id'
        ]);

        // DeepSeek APIから意味を取得 (簡易実装)
        $meaning = $this->getMeaningFromDeepSeek($request->word);

        $vocabulary = Vocabulary::create([
            'word' => $request->word,
            'meaning' => $meaning,
            'user_id' => $request->user_id,
            'notification_date' => now()->addWeek(),
            'test_notification_date' => now()->addMinute() // テスト用に1分後に通知
        ]);

        $this->pushLineMessage("【新しい単語】{$vocabulary->word}\n{$vocabulary->meaning}", $request->user_id);

        return response()->json($vocabulary, 200);
    }

    private function getMeaningFromDeepSeek(string $word): string
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('DEEPSEEK_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.deepseek.com/v1/chat/completions', [
                'model' => 'deepseek-chat',
                'messages' => [
                    [
                        'role' => 'user',
                        // 'content' => "Explain the meaning of the English word '{$word}' in Japanese"
                        'content' => "英単語'{$word}'の意味を日本語で説明してほしい。回答形式は下記の通りでお願い。意味：例文：解説：一言："
                    ]
                ],
                'max_tokens' => 1000
            ]);

            if ($response->successful()) {
                return $response->json()['choices'][0]['message']['content'];
            }

            return "Failed to get meaning for {$word}";
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }

    protected function pushLineMessage(string $message, int $user_id): void
    {
        $accessToken = env('LINE_CHANNEL_ACCESS_TOKEN');
        $toUserId = User::where('id', $user_id)->value('line_id');

        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://api.line.me/v2/bot/message/push', [
            'headers' => [
                'Authorization' => "Bearer {$accessToken}",
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'to' => $toUserId,
                'messages' => [[
                    'type' => 'text',
                    'text' => $message
                ]]
            ],
        ]);

        if ($response->getStatusCode() !== 200) {
            \Log::error('LINE Push failed', ['response' => $response->getBody()->getContents()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {}

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
