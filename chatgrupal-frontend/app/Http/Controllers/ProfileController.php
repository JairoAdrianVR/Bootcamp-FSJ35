<?php

namespace App\Http\Controllers;

use App\Services\ChatgrupalApi;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(ChatgrupalApi $api)
    {
        $profile = $api->currentProfile();
        $user = $api->user();

        return view('profile.show', compact('profile', 'user'));
    }

    public function update(Request $request, ChatgrupalApi $api)
    {
        $request->validate([
            'phone' => ['nullable', 'string', 'max:50'],
            'department' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $api->updateProfile($request->only(['phone', 'department', 'position', 'bio', 'status']));

        return redirect()->route('profile.show');
    }
}
