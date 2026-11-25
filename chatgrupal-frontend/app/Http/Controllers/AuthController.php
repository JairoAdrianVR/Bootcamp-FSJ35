<?php

namespace App\Http\Controllers;

use App\Services\ChatgrupalApi;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request, ChatgrupalApi $api)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        try {
            $data = $api->login($request->email, $request->password);
        } catch (\Throwable $e) {
            return back()->withErrors(['email' => $e->getMessage()])->withInput();
        }

        $api->setToken($data['token'] ?? null);
        $api->setUser($data['user'] ?? null);

        return redirect()->route('dashboard');
    }

    public function logout(ChatgrupalApi $api)
    {
        $api->logout();

        return redirect()->route('login');
    }
}
