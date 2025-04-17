<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LineWebhookController extends Controller
{
    /**
     * LINEからのWebhookリクエストを処理する
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleWebhook(Request $request)
    {
        Log::info('LINE Webhookリクエスト受信', [
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
        ]);

        // リクエストの署名を検証
        $signature = $request->header('X-Line-Signature');
        $body = $request->getContent();

        if (!$this->verifySignature($signature, $body)) {
            Log::error('LINE Webhookの署名検証に失敗しました', [
                'signature' => $signature,
                'body_length' => strlen($body),
                'body_sample' => substr($body, 0, 100) . '...',
            ]);
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        // Webhookイベントの処理
        $events = json_decode($body, true)['events'] ?? [];
        Log::info('LINE Webhookイベント', ['count' => count($events)]);

        foreach ($events as $event) {
            $this->handleEvent($event);
        }

        return response()->json(['message' => 'OK'], 200);
    }

    /**
     * 署名を検証する
     *
     * @param string $signature
     * @param string $body
     * @return bool
     */
    private function verifySignature($signature, $body)
    {
        if (empty($signature)) {
            Log::warning('LINE署名ヘッダーが空です');
            return false;
        }

        $channelSecret = config('services.line.channel_secret');
        if (empty($channelSecret)) {
            Log::error('LINE_CHANNEL_SECRETが設定されていません');
            return false;
        }

        $hash = hash_hmac('sha256', $body, $channelSecret, true);
        $calculatedSignature = base64_encode($hash);

        Log::info('署名検証', [
            'received' => $signature,
            'calculated' => $calculatedSignature,
            'match' => $signature === $calculatedSignature,
        ]);

        return $signature === $calculatedSignature;
    }

    /**
     * イベントを処理する
     *
     * @param array $event
     * @return void
     */
    private function handleEvent($event)
    {
        Log::info('LINEイベント受信:', ['type' => $event['type'] ?? 'unknown']);

        // イベントタイプに応じた処理
        switch ($event['type'] ?? '') {
            case 'message':
                $this->handleMessageEvent($event);
                break;
            case 'follow':
                $this->handleFollowEvent($event);
                break;
            default:
                Log::info('未処理のイベントタイプ:', ['type' => $event['type'] ?? 'unknown']);
                break;
        }
    }

    /**
     * メッセージイベントを処理する
     *
     * @param array $event
     * @return void
     */
    private function handleMessageEvent($event)
    {
        $messageType = $event['message']['type'] ?? '';
        $replyToken = $event['replyToken'] ?? '';

        if ($messageType === 'text') {
            $userMessage = $event['message']['text'] ?? '';
            Log::info('ユーザーメッセージ:', ['message' => $userMessage]);

            // ここで返信メッセージを生成して送信できます
            // $this->replyToUser($replyToken, 'メッセージを受け取りました: ' . $userMessage);
        }
    }

    /**
     * フォローイベントを処理する
     *
     * @param array $event
     * @return void
     */
    private function handleFollowEvent($event)
    {
        $userId = $event['source']['userId'] ?? '';
        Log::info('ユーザーがフォローしました:', ['userId' => $userId]);

        // フォロー時の処理を実装
    }
}
