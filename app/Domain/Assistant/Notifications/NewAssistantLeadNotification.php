<?php

namespace App\Domain\Assistant\Notifications;

use App\Domain\Assistant\Models\AssistantLead;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewAssistantLeadNotification extends Notification
{
    use Queueable;

    public function __construct(
        public readonly AssistantLead $lead,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $phone = (string) ($this->lead->phone ?? '');
        $context = (string) ($this->lead->context ?: 'محادثة عبر المساعد الذكي حسام');
        $clientName = (string) ($this->lead->name ?: 'عميل المساعد الذكي');

        return [
            'type' => 'new_assistant_lead',
            'title' => 'عميل جديد من المساعد الذكي',
            'title_en' => 'New Lead from AI Assistant',
            'lead_id' => $this->lead->id,
            'client_name' => $clientName,
            'client_phone' => $phone,
            'context' => $context,
            'lead_score' => $this->lead->lead_score ?? 0,
            'lead_status' => $this->lead->lead_status ?? 'normal',
            'message' => "عميل جديد ({$phone}) تواصل عبر المساعد الذكي حسام: {$context}",
            'action_url' => '/admin/assistant-leads',
        ];
    }
}
