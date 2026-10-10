/**
 * Normalize a phone number for WhatsApp's international wa.me format.
 * Egyptian local mobile numbers such as 01012345678 become 201012345678.
 *
 * @param {string|null|undefined} value
 * @returns {string}
 */
function normalizeWhatsAppNumber(value) {
    if (!value) {
        return ''
    }

    const raw = String(value).trim()
    let digits = raw.replace(/\D/g, '')

    if (!digits) {
        return ''
    }

    // Egypt: +20 10xxxxxxxx -> 2010xxxxxxxx
    if (digits.startsWith('20') && digits.length === 12) {
        return digits
    }

    // Egypt local mobile: 01xxxxxxxxx -> 201xxxxxxxxx
    if (digits.length === 11 && digits.startsWith('01')) {
        return `20${digits}`
    }

    // Egypt local number entered without the leading zero: 1xxxxxxxxx -> 201xxxxxxxxx
    if (digits.length === 10 && digits.startsWith('1')) {
        return `20${digits}`
    }

    return digits
}

/**
 * Resolves contact information (WhatsApp and Phone) for an agent/user,
 * falling back to site settings if the agent did not provide contact numbers.
 *
 * @param {Object|null} agent - The user/agent object (e.g., unit.user, project.user, or agent)
 * @param {Object|null} settings - The global site settings (page.props.settings)
 * @returns {{ whatsapp: string, phone: string, rawWhatsapp: string, rawPhone: string }}
 */
export function getAgentContacts(agent, settings = {}) {
    const agentPhone = agent?.phone || agent?.profile?.phone || null
    const agentWhatsapp = agent?.whatsapp || agent?.profile?.whatsapp || agentPhone

    const siteWhatsapp = settings?.company_whatsapp || settings?.whatsapp_number || settings?.phone || null
    const sitePhone = settings?.phone || settings?.company_phone || settings?.company_whatsapp || null

    const finalWhatsapp = (agentWhatsapp || siteWhatsapp || '').toString()
    const finalPhone = (agentPhone || sitePhone || finalWhatsapp || '').toString()

    return {
        whatsapp: normalizeWhatsAppNumber(finalWhatsapp),
        rawWhatsapp: finalWhatsapp,
        phone: finalPhone.replace(/[^0-9+]/g, ''),
        rawPhone: finalPhone,
    }
}
