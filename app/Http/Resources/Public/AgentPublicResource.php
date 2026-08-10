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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'profile' => $this->whenLoaded('profile', function () {
                return [
                    'avatar' => $this->profile->avatar,
                    'phone' => $this->profile->phone,
                    'whatsapp' => $this->profile->whatsapp,
                    'facebook' => $this->profile->facebook,
                ];
            }),
        ];
    }
}
