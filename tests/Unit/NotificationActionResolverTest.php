<?php

use App\Domain\Users\Services\NotificationActionResolver;

function resolver(): NotificationActionResolver
{
    return new NotificationActionResolver;
}

function keys(array $result): array
{
    return array_column($result['actions'], 'key');
}

it('keeps unit approval available while the unit is still inactive', function () {
    $result = resolver()->resolve([
        'type' => 'unit_pending_approval',
        'unit_id' => 8,
        'unit_exists' => true,
        'unit_is_active' => false,
        'unit_slug' => 'unit-8',
        'can_approve_unit' => true,
        'can_edit_unit' => true,
    ]);

    expect(keys($result))->toBe(['approve_unit', 'edit_unit'])
        ->and($result['primary_url'])->toBe('/admin/notifications');
});

it('drops unit approval after the unit is already published', function () {
    $result = resolver()->resolve([
        'type' => 'unit_pending_approval',
        'unit_id' => 8,
        'unit_exists' => true,
        'unit_is_active' => true,
        'unit_slug' => 'unit-8',
        'can_approve_unit' => true,
        'can_edit_unit' => true,
    ]);

    expect(keys($result))->toBe(['edit_unit', 'view_unit'])
        ->and($result['primary_url'])->toBe('/admin/units/8/edit');
});

it('offers extend and delete for an expiry warning without treating read state as resolved', function () {
    $result = resolver()->resolve([
        'type' => 'unit_expiry_warning',
        'unit_id' => 4,
        'unit_exists' => true,
        'unit_is_active' => false,
        'project_id' => 9,
        'project_exists' => true,
        'project_is_active' => true,
        'can_extend_unit' => true,
        'can_delete_unit' => true,
        'can_edit_unit' => true,
        'can_edit_project' => true,
    ]);

    expect(keys($result))->toBe(['extend_unit', 'delete_unit', 'edit_unit'])
        ->and($result['primary_url'])->toBe('/admin/notifications');
});

it('does not link a permanently deleted unit to an edit page', function () {
    $result = resolver()->resolve([
        'type' => 'unit_permanently_deleted',
        'unit_id' => 4,
        'unit_exists' => false,
        'can_edit_unit' => false,
    ]);

    expect($result['actions'])->toBe([])
        ->and($result['primary_url'])->toBe('/admin/notifications');
});

it('opens client messages even when the inquiry is attached to a unit', function () {
    $result = resolver()->resolve([
        'type' => 'new_message',
        'message_id' => 3,
        'unit_id' => 4,
        'unit_exists' => true,
        'unit_is_active' => true,
        'unit_slug' => 'unit-4',
        'can_edit_unit' => true,
    ]);

    expect(keys($result))->toBe(['messages', 'edit_unit', 'view_unit'])
        ->and($result['primary_url'])->toBe('/admin/messages');
});

it('sends an already published new project to its edit page instead of a fake approve action', function () {
    $result = resolver()->resolve([
        'type' => 'new_project_created',
        'project_id' => 2,
        'project_exists' => true,
        'project_is_active' => true,
        'project_slug' => 'project-2',
        'can_approve_project' => true,
        'can_edit_project' => true,
    ]);

    expect(keys($result))->toBe(['edit_project', 'view_project'])
        ->and($result['primary_url'])->toBe('/admin/projects/2/edit');
});

it('approves a project that is still waiting for publication', function () {
    $result = resolver()->resolve([
        'type' => 'project_pending_approval',
        'project_id' => 2,
        'project_exists' => true,
        'project_is_active' => false,
        'can_approve_project' => true,
        'can_edit_project' => true,
    ]);

    expect(keys($result))->toBe(['approve_project', 'edit_project'])
        ->and($result['primary_url'])->toBe('/admin/notifications');
});

it('opens assistant leads and ignores external action urls', function () {
    $result = resolver()->resolve([
        'type' => 'new_assistant_lead',
        'lead_id' => 11,
        'action_url' => 'https://evil.example/admin/assistant-leads',
    ]);

    expect(keys($result))->toBe(['lead'])
        ->and($result['actions'][0]['url'])->toBe('/admin/assistant-leads')
        ->and($result['primary_url'])->toBe('/admin/assistant-leads');
});
