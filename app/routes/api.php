<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\VocabularyController;
use App\Http\Controllers\LineWebhookController;

Route::get('/vocabulary', [VocabularyController::class, 'index']);
Route::post('/vocabulary', [VocabularyController::class, 'store']);
Route::post('/line/webhook', [LineWebhookController::class, 'handleWebhook']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
