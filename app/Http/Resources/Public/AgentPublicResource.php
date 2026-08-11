<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgentPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'role' => $this->role,
            'avatar' => null,
            'phone' => null,
            'whatsapp' => null,
            'facebook' => null,
            'linkedin' => null,
        ];

        if ($this->relationLoaded('profile') && $this->profile) {
            $data['avatar'] = $this->profile->avatar;
            $data['phone'] = $this->profile->phone;
            $data['whatsapp'] = $this->profile->whatsapp;
            $data['facebook'] = $this->profile->facebook;
            $data['linkedin'] = $this->profile->linkedin;
        }

        return $data;
    }
}
