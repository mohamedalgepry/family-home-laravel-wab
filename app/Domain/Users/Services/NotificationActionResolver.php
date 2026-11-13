<?php

namespace App\Domain\Users\Services;

/**
 * يقرر أزرار إشعار لوحة الإدارة حسب نوعه وحالة الكيان الحالية.
 * القراءة لا تعني أن الإجراء اتنفذ.
 */
class NotificationActionResolver
{
    /**
     * @param  array<string, mixed>  $context
     * @return array{actions: list<array<string, mixed>>, primary_url: string}
     */
    public function resolve(array $context): array
    {
        $type = (string) ($context['type'] ?? '');
        $unitId = $context['unit_id'] ?? null;
        $projectId = $context['project_id'] ?? null;
        $unitExists = ! empty($context['unit_exists']) && $unitId;
        $projectExists = ! empty($context['project_exists']) && $projectId;
        $unitActive = (bool) ($context['unit_is_active'] ?? false);
        $projectActive = (bool) ($context['project_is_active'] ?? false);
        $deleted = in_array($type, ['unit_permanently_deleted', 'project_permanently_deleted'], true);
        $unitScoped = in_array($type, [
            'unit_expiry_warning',
            'unit_expired',
            'unit_pending_approval',
            'unit_approved',
            'unit_extended',
            'unit_permanently_deleted',
            'new_message',
        ], true);

        $actions = [];

        if ($type === 'unit_pending_approval' && $unitExists && ! $unitActive && ! empty($context['can_approve_unit'])) {
            $actions[] = $this->action('approve_unit', 'post', '/admin/units/'.$unitId.'/approve');
        }

        $projectNeedsApproval = $type === 'project_pending_approval'
            || ($type === 'new_project_created' && array_key_exists('project_is_active', $context) && $context['project_is_active'] === false);

        if ($projectNeedsApproval && $projectExists && ! $projectActive && ! empty($context['can_approve_project'])) {
            $actions[] = $this->action('approve_project', 'post', '/admin/projects/'.$projectId.'/approve');
        }

        $isExtended = ! empty($context['is_extended']);

        if (in_array($type, ['unit_expiry_warning', 'unit_expired'], true) && $unitExists && ! $isExtended && ! empty($context['can_extend_unit'])) {
            $actions[] = $this->action('extend_unit', 'modal', null);
        }

        if ($type === 'project_expiry_warning' && $projectExists && ! $isExtended && ! empty($context['can_extend_project'])) {
            $actions[] = $this->action('extend_project', 'post', '/admin/projects/'.$projectId.'/extend');
        }

        if (in_array($type, ['unit_expiry_warning', 'unit_expired'], true) && $unitExists && ! empty($context['can_delete_unit'])) {
            $actions[] = $this->action('delete_unit', 'delete', '/admin/units/'.$unitId.'/force');
        }

        if ($type === 'new_message') {
            $actions[] = $this->action('messages', 'get', '/admin/messages');
        }

        if (($type === 'new_assistant_lead' || (! empty($context['lead_id']) && $type !== 'new_message'))
            && ! empty($context['can_view_lead'])) {
            $leadUrl = $this->safeAdminPath($context['action_url'] ?? null) ?? '/admin/assistant-leads';
            $actions[] = $this->action('lead', 'get', $leadUrl);
        }

        if ($unitExists && ! $deleted && ! empty($context['can_edit_unit'])) {
            $actions[] = $this->action('edit_unit', 'get', '/admin/units/'.$unitId.'/edit');
        }

        if ($projectExists && ! $unitScoped && ! $deleted && ! empty($context['can_edit_project'])) {
            $actions[] = $this->action('edit_project', 'get', '/admin/projects/'.$projectId.'/edit');
        }

        $unitSlug = $this->safeSlug($context['unit_slug'] ?? null);
        if ($unitExists && $unitActive && $unitSlug) {
            $actions[] = $this->action('view_unit', 'get', '/units/'.$unitSlug, true);
        }

        $projectSlug = $this->safeSlug($context['project_slug'] ?? null);
        if ($projectExists && $projectActive && $projectSlug && ! $unitScoped && ! $deleted) {
            $actions[] = $this->action('view_project', 'get', '/projects/'.$projectSlug, true);
        }

        return [
            'actions' => $actions,
            'primary_url' => $this->primaryUrl($actions, $context),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $actions
     * @param  array<string, mixed>  $context
     */
    private function primaryUrl(array $actions, array $context): string
    {
        $byKey = [];
        foreach ($actions as $action) {
            $byKey[$action['key']] = $action;
        }

        if (isset($byKey['messages'])) {
            return '/admin/messages';
        }

        if (isset($byKey['lead'])) {
            return (string) $byKey['lead']['url'];
        }

        if (($context['type'] ?? '') === 'new_assistant_lead' || ! empty($context['lead_id'])) {
            return ! empty($context['can_view_lead'])
                ? ($this->safeAdminPath($context['action_url'] ?? null) ?? '/admin/assistant-leads')
                : '/admin/notifications';
        }

        foreach (['approve_unit', 'approve_project', 'extend_unit', 'extend_project', 'delete_unit'] as $key) {
            if (isset($byKey[$key])) {
                return '/admin/notifications';
            }
        }

        foreach (['edit_unit', 'edit_project'] as $key) {
            if (isset($byKey[$key]['url'])) {
                return (string) $byKey[$key]['url'];
            }
        }

        return $this->safeAdminPath($context['action_url'] ?? null) ?? '/admin/notifications';
    }

    /**
     * @return array{key: string, method: string, url: string|null, external: bool}
     */
    private function action(string $key, string $method, ?string $url, bool $external = false): array
    {
        return [
            'key' => $key,
            'method' => $method,
            'url' => $url,
            'external' => $external,
        ];
    }

    private function safeAdminPath(mixed $url): ?string
    {
        if (! is_string($url) || ! str_starts_with($url, '/admin/') || str_contains($url, '://') || str_contains($url, '\\')) {
            return null;
        }

        return $url;
    }

    private function safeSlug(mixed $slug): ?string
    {
        if (! is_string($slug) || $slug === '' || str_contains($slug, '/') || str_contains($slug, '..') || str_contains($slug, '\\')) {
            return null;
        }

        return $slug;
    }
}
