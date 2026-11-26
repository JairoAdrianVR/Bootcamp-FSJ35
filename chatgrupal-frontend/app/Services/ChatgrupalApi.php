<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class ChatgrupalApi
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = rtrim(config('chatgrupal.url'), '/');
    }

    public function token(): ?string
    {
        return Session::get('chatgrupal_token');
    }

    public function setToken(?string $token): void
    {
        if ($token) {
            Session::put('chatgrupal_token', $token);
        } else {
            Session::forget('chatgrupal_token');
        }
    }

    public function user(): ?array
    {
        return Session::get('chatgrupal_user');
    }

    public function setUser(?array $user): void
    {
        if ($user) {
            Session::put('chatgrupal_user', $user);
        } else {
            Session::forget('chatgrupal_user');
        }
    }

    protected function client(): PendingRequest
    {
        $request = Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->asJson();

        if ($token = $this->token()) {
            $request = $request->withToken($token);
        }

        return $request;
    }

    public function login(string $email, string $password): array
    {
        $response = $this->client()->post('/login', [
            'email' => $email,
            'password' => $password,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException($response->json('message') ?? 'Credenciales incorrectas.');
        }

        return $response->json();
    }

    public function logout(): void
    {
        try {
            $this->client()->post('/logout');
        } catch (\Throwable $e) {
            // ignore
        }

        $this->setToken(null);
        $this->setUser(null);
    }

    public function me(): ?array
    {
        $response = $this->client()->get('/user');

        if (! $response->successful()) {
            return null;
        }

        return $response->json();
    }

    // Chats
    public function chats(array $filters = []): array
    {
        $response = $this->client()->get('/chats', $filters);

        return $response->successful() ? ($response->json() ?? []) : [];
    }

    public function chat(int $id): ?array
    {
        $response = $this->client()->get("/chats/{$id}");

        return $response->successful() ? $response->json() : null;
    }

    public function createChat(array $data): ?array
    {
        $response = $this->client()->post('/chats', $data);

        return $response->successful() ? $response->json() : null;
    }

    public function updateChat(int $id, array $data): ?array
    {
        $response = $this->client()->put("/chats/{$id}", $data);

        return $response->successful() ? $response->json() : null;
    }

    public function deleteChat(int $id): bool
    {
        $response = $this->client()->delete("/chats/{$id}");

        return $response->successful();
    }

    // Messages
    public function messages(?int $chatId = null, array $filters = []): array
    {
        if ($chatId) {
            $response = $this->client()->get("/chats/{$chatId}/messages", $filters);
        } else {
            $response = $this->client()->get('/messages', $filters);
        }

        return $response->successful() ? ($response->json() ?? []) : [];
    }

    public function sendMessage(int $chatId, string $body, ?int $userId = null): ?array
    {
        $payload = ['body' => $body];
        if ($userId) {
            $payload['user_id'] = $userId;
        }

        $response = $this->client()->post("/chats/{$chatId}/messages", $payload);

        return $response->successful() ? $response->json() : null;
    }

    public function deleteMessage(int $id): bool
    {
        $response = $this->client()->delete("/messages/{$id}");

        return $response->successful();
    }

    // Profiles
    public function profiles(array $filters = []): array
    {
        $response = $this->client()->get('/profiles', $filters);

        return $response->successful() ? ($response->json() ?? []) : [];
    }

    public function currentProfile(): ?array
    {
        $response = $this->client()->get('/profile');

        return $response->successful() ? $response->json() : null;
    }

    public function updateProfile(array $data): ?array
    {
        $response = $this->client()->put('/profile', $data);

        return $response->successful() ? $response->json() : null;
    }
}
