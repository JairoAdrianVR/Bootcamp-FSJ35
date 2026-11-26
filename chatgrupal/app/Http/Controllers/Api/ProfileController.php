<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Profile::with('user');

        if ($request->filled('department')) {
            $query->where('department', $request->string('department'));
        }

        return response()->json($query->latest()->get());
    }

    public function store(StoreProfileRequest $request): JsonResponse
    {
        $profile = Profile::create($request->validated());
        $profile->load('user');

        return response()->json($profile, 201);
    }

    public function show(Profile $profile): JsonResponse
    {
        $profile->load('user');

        return response()->json($profile);
    }

    public function update(UpdateProfileRequest $request, Profile $profile): JsonResponse
    {
        $profile->update($request->validated());
        $profile->load('user');

        return response()->json($profile);
    }

    public function destroy(Profile $profile): JsonResponse
    {
        $profile->delete();

        return response()->json(null, 204);
    }

    public function current(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            $profile = $request->user()->profile()->create([]);
        }

        $profile->load('user');

        return response()->json($profile);
    }

    public function updateCurrent(UpdateProfileRequest $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (! $profile) {
            $profile = $request->user()->profile()->create($request->validated());
        } else {
            $profile->update($request->validated());
        }

        $profile->load('user');

        return response()->json($profile);
    }
}
