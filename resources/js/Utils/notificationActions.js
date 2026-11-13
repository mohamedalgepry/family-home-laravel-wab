const UNIT_SCOPED = new Set([
    'unit_expiry_warning',
    'unit_expired',
    'unit_pending_approval',
    'unit_approved',
    'unit_extended',
    'unit_permanently_deleted',
    'new_message',
])

const POST_ACTIONS = new Set(['approve_unit', 'approve_project', 'extend_unit', 'extend_project', 'delete_unit'])

function action(key, method, url, external = false) {
    return { key, method, url, external }
}

/**
 * Used when a cached payload has no server-built `actions`.
 * Keep this aligned with NotificationActionResolver.
 */
export function fallbackNotificationActions(item, { isAdmin = false } = {}) {
    const type = item?.type || ''
    const deleted = type === 'unit_permanently_deleted' || type === 'project_permanently_deleted'
    const unitExists = Boolean(item?.unit_id) && item?.unit_exists !== false && !deleted
    const projectExists = Boolean(item?.project_id) && item?.project_exists !== false && type !== 'project_permanently_deleted'
    const unitActive = item?.unit_is_active === true || item?.unit_is_active === 1
    const projectActive = item?.project_is_active === true || item?.project_is_active === 1
    const unitScoped = UNIT_SCOPED.has(type)
    const actions = []

    if (type === 'unit_pending_approval' && unitExists && !unitActive && isAdmin) {
        actions.push(action('approve_unit', 'post', `/admin/units/${item.unit_id}/approve`))
    }

    const projectNeedsApproval = type === 'project_pending_approval'
        || (type === 'new_project_created' && item?.project_is_active === false)

    if (projectNeedsApproval && projectExists && !projectActive && isAdmin) {
        actions.push(action('approve_project', 'post', `/admin/projects/${item.project_id}/approve`))
    }

    const isExtended = item?.is_extended === true

    if ((type === 'unit_expiry_warning' || type === 'unit_expired') && unitExists && !isExtended && isAdmin) {
        actions.push(action('extend_unit', 'modal', null))
        actions.push(action('delete_unit', 'delete', `/admin/units/${item.unit_id}/force`))
    }

    if (type === 'project_expiry_warning' && projectExists && !isExtended && isAdmin) {
        actions.push(action('extend_project', 'post', `/admin/projects/${item.project_id}/extend`))
    }

    if (type === 'new_message') {
        actions.push(action('messages', 'get', '/admin/messages'))
    }

    if (isAdmin && (type === 'new_assistant_lead' || (item?.lead_id && type !== 'new_message'))) {
        actions.push(action('lead', 'get', item?.action_url || '/admin/assistant-leads'))
    }

    if (unitExists && isAdmin) {
        actions.push(action('edit_unit', 'get', `/admin/units/${item.unit_id}/edit`))
    }

    if (projectExists && !unitScoped && !deleted && isAdmin) {
        actions.push(action('edit_project', 'get', `/admin/projects/${item.project_id}/edit`))
    }

    if (unitExists && item?.unit_slug && unitActive) {
        actions.push(action('view_unit', 'get', `/units/${item.unit_slug}`, true))
    }

    if (projectExists && item?.project_slug && projectActive && !unitScoped) {
        actions.push(action('view_project', 'get', `/projects/${item.project_slug}`, true))
    }

    return actions
}

export function notificationActions(item, roles) {
    return Array.isArray(item?.actions) ? item.actions : fallbackNotificationActions(item, roles)
}

export function notificationPrimaryUrl(item, roles = {}) {
    if (typeof item?.primary_url === 'string' && item.primary_url.startsWith('/')) {
        return item.primary_url
    }

    const actions = Array.isArray(item?.actions) ? item.actions : fallbackNotificationActions(item, roles)
    const byKey = Object.fromEntries(actions.map((entry) => [entry.key, entry]))

    if (byKey.messages) return '/admin/messages'
    if (byKey.lead?.url) return byKey.lead.url
    if ([...POST_ACTIONS].some((key) => byKey[key])) return '/admin/notifications'
    if (byKey.edit_unit?.url) return byKey.edit_unit.url
    if (byKey.edit_project?.url) return byKey.edit_project.url

    return '/admin/notifications'
}
