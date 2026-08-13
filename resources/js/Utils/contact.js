/**
 * Resolves contact information (WhatsApp and Phone) for an agent/user,
 * falling back to site settings if the agent did not provide contact numbers.
 *
 * @param {Object|null} agent - The user/agent object (e.g., unit.user, project.user, or agent)
 * @param {Object|null} settings - The global site settings (page.props.settings)
 * @returns {{ whatsapp: string, phone: string, rawWhatsapp: string, rawPhone: string }}
 */
export function getAgentContacts(agent, settings = {}) {
    const agentWhatsapp = agent?.whatsapp || agent?.profile?.whatsapp || null
    const agentPhone = agent?.phone || agent?.profile?.phone || null

    const siteWhatsapp = settings?.company_whatsapp || settings?.whatsapp_number || settings?.phone || null
    const sitePhone = settings?.phone || settings?.company_phone || settings?.company_whatsapp || null

    const finalWhatsapp = (agentWhatsapp || siteWhatsapp || '201000000000').toString()
    const finalPhone = (agentPhone || sitePhone || finalWhatsapp || '201000000000').toString()

    return {
        whatsapp: finalWhatsapp.replace(/[^0-9]/g, ''),
        rawWhatsapp: finalWhatsapp,
        phone: finalPhone.replace(/[^0-9+]/g, ''),
        rawPhone: finalPhone,
    }
}
