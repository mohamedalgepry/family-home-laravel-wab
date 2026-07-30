import { usePage, useForm, router, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow , Select} from '../../../Components/UI'

export default function AdminUsersIndex({ users, managers, filters }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [search, setSearch] = useState(filters?.search || '')
    const [roleFilter, setRoleFilter] = useState(filters?.role || '')
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [userToPassword, setUserToPassword] = useState(null)
    const [userRelations, setUserRelations] = useState(null)

    const { data: passwordData, setData: setPasswordData, post: passwordPost, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        password: '',
        password_confirmation: '',
    })

    function openChangePassword(user) {
        setUserToPassword(user)
        resetPassword()
        setShowPasswordModal(true)
    }

    function handleChangePassword(e) {
        e.preventDefault()
        passwordPost(`/admin/users/${userToPassword.id}/change-password`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPasswordModal(false)
                setUserToPassword(null)
                resetPassword()
            },
        })
    }

    useEffect(() => {
        if (filters) {
            setSearch(filters.search || '')
            setRoleFilter(filters.role || '')
        }
    }, [filters])

    const { data: transferData, setData: setTransferData, post: transferPost, processing: transferProcessing } = useForm({
        from_user_id: '',
        to_user_id: '',
    })

    const { data: assignData, setData: setAssignData, post: assignPost, processing: assignProcessing } = useForm({
        manager_id: '',
        agent_ids: [],
    })

    const { data: deleteData, setData: setDeleteData, delete: destroyUser, processing: deleteProcessing, reset: resetDelete } = useForm({
        transfer_to_id: '',
    })

    const allAgents = users?.filter(u => u.role === 'agent') || []
    const [selectedAgents, setSelectedAgents] = useState([])

    async function openDelete(user) {
        setUserToDelete(user)
        setUserRelations(null)
        setDeleteData('transfer_to_id', '')
        setShowDeleteModal(true)
        
        try {
            const response = await fetch(`/admin/users/${user.id}/check-relations`)
            const data = await response.json()
            setUserRelations(data)
        } catch (error) {
            console.error(error)
        }
    }

    function handleDelete(e) {
        e.preventDefault()
        destroyUser(`/admin/users/${userToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false)
                setUserToDelete(null)
                resetDelete()
            },
        })
    }

    useEffect(() => {
        if (assignData.manager_id) {
            const assignedIds = (users || [])
                .filter(u => u.role === 'agent' && u.manager_id === Number(assignData.manager_id))
                .map(u => u.id)
            setSelectedAgents(assignedIds)
            setAssignData('agent_ids', assignedIds)
        } else {
            setSelectedAgents([])
            setAssignData('agent_ids', [])
        }
    }, [assignData.manager_id, users])

    function applyFilters() {
        router.get('/admin/users', { search, role: roleFilter }, { preserveState: true, preserveScroll: true })
    }

    function toggleActive(user) {
        router.post(`/admin/users/${user.id}/toggle-active`, {}, { preserveScroll: true })
    }

    function openTransfer(user) {
        setTransferData('from_user_id', user.id)
        setShowTransferModal(true)
    }

    function handleTransfer(e) {
        e.preventDefault()
        transferPost('/admin/users/transfer-projects', {
            preserveScroll: true,
            onSuccess: () => {
                setShowTransferModal(false)
                setTransferData({ from_user_id: '', to_user_id: '' })
            },
        })
    }

    function handleAssign(e) {
        e.preventDefault()
        assignPost('/admin/users/assign-agents', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAssignModal(false)
                setAssignData({ manager_id: '', agent_ids: [] })
                setSelectedAgents([])
            },
        })
    }

    function toggleAgentSelection(agentId) {
        setSelectedAgents(prev =>
            prev.includes(agentId)
                ? prev.filter(id => id !== agentId)
                : [...prev, agentId]
        )
        setAssignData('agent_ids',
            assignData.agent_ids.includes(agentId)
                ? assignData.agent_ids.filter(id => id !== agentId)
                : [...assignData.agent_ids, agentId]
        )
    }

    const loading = !users
    const filteredUsers = (users || []).filter(u => {
        if (roleFilter && u.role !== roleFilter) return false
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const roleBadgeClass = role => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700'
            case 'manager': return 'bg-blue-100 text-blue-700'
            case 'agent': return 'bg-green-100 text-green-700'
            default: return 'bg-secondary-100 text-secondary-700'
        }
    }

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_users') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_users')}</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/users/create" className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                            {trans('add_user')}
                        </Link>
                        <button onClick={() => setShowAssignModal(true)} className="px-4 py-2 bg-white text-secondary-700 border border-secondary-200 rounded-lg text-sm font-medium hover:bg-surface transition-colors">
                            {trans('assign_agents')}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('search')}</label>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={trans('search')} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('role')}</label>
                        <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white">
                            <option value="">{trans('all_roles')}</option>
                            <option value="admin">{trans('admin')}</option>
                            <option value="manager">{trans('manager')}</option>
                            <option value="agent">{trans('agent')}</option>
                        </Select>
                    </div>
                    <button onClick={applyFilters} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium">{trans('search')}</button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-start">
                            <thead>
                                <tr className="bg-secondary-50/80 border-b border-secondary-200/80 text-secondary-600 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-5 py-3.5 text-start">{trans('name')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('email')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('role')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('phone')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('manager')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('status')}</th>
                                    <th className="px-5 py-3.5 text-start">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
                                ) : filteredUsers.length > 0 ? filteredUsers.map(u => (
                                    <tr key={u.id} className="hover:bg-primary-50/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                {u.avatar ? (
                                                    <img src={`/storage/${u.avatar}`} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-secondary-200 shadow-2xs" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-900 font-bold text-xs flex items-center justify-center border border-primary-200">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-semibold text-secondary-950">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-secondary-600 font-mono text-xs">{u.email}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs rounded-full font-medium ${roleBadgeClass(u.role)}`}>
                                                {trans(u.role)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-secondary-700 font-mono text-xs" dir="ltr">{u.phone || '—'}</td>
                                        <td className="px-5 py-3.5 text-secondary-600 text-xs">{u.manager?.name || '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full font-medium ${u.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {u.is_active ? trans('active') : trans('inactive')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-wrap gap-1.5 items-center">
                                                <button onClick={() => toggleActive(u)} className={`text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${u.is_active ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'}`}>
                                                    {u.is_active ? trans('deactivate') : trans('activate')}
                                                </button>
                                                <button onClick={() => openChangePassword(u)} className="text-xs px-2.5 py-1 rounded-md font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                                                    {trans('change_password')}
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => openTransfer(u)} className="text-xs px-2.5 py-1 rounded-md font-medium bg-secondary-100 text-secondary-700 border border-secondary-200 hover:bg-secondary-200 transition-colors">
                                                        {trans('transfer_projects')}
                                                    </button>
                                                )}
                                                <button onClick={() => openDelete(u)} className="text-xs px-2.5 py-1 rounded-md font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                                                    {trans('delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted">
                                        {trans('no_data')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

                {/* Transfer Projects Modal */}
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowTransferModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary-950">{trans('transfer_projects')}</h3>
                                <button onClick={() => setShowTransferModal(false)} className="text-muted hover:text-secondary-950 text-xl leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleTransfer} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('transfer_from')}</label>
                                    <Select value={transferData.from_user_id} onChange={e => setTransferData('from_user_id', e.target.value)} disabled className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-surface">
                                        <option value="">—</option>
                                        {users?.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('transfer_to')}</label>
                                    <Select value={transferData.to_user_id} onChange={e => setTransferData('to_user_id', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900">
                                        <option value="">—</option>
                                        {users?.filter(u => u.id !== Number(transferData.from_user_id) && u.role !== 'admin').map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={transferProcessing || !transferData.to_user_id} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                                        {transferProcessing ? trans('loading') : trans('transfer')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign Agents to Manager Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAssignModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary-950">{trans('assign_agents_to_manager')}</h3>
                                <button onClick={() => setShowAssignModal(false)} className="text-muted hover:text-secondary-950 text-xl leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('select_manager')} *</label>
                                    <Select value={assignData.manager_id} onChange={e => setAssignData('manager_id', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900">
                                        <option value="">—</option>
                                        {managers?.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                {assignData.manager_id && (
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-950 mb-2">{trans('select_agents')}</label>
                                        <div className="max-h-48 overflow-y-auto border border-secondary-200 rounded-lg divide-y divide-secondary-100">
                                            {allAgents.length > 0 ? allAgents.map(agent => (
                                                <label key={agent.id} className="flex items-center gap-3 px-3 py-2 hover:bg-surface/50 cursor-pointer">
                                                    <input type="checkbox" checked={selectedAgents.includes(agent.id)} onChange={() => toggleAgentSelection(agent.id)} className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer" />
                                                    <span className="text-sm">{agent.name}</span>
                                                    <span className="text-xs text-muted">{agent.email}</span>
                                                </label>
                                            )) : (
                                                <p className="px-3 py-4 text-sm text-muted text-center">
                                                    {trans('no_agents_available')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={assignProcessing || !assignData.manager_id || selectedAgents.length === 0} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                                        {assignProcessing ? trans('loading') : trans('assign')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete User Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDeleteModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-error">{trans('delete_user')}</h3>
                                <button onClick={() => setShowDeleteModal(false)} className="text-muted hover:text-secondary-950 text-xl leading-none">&times;</button>
                            </div>
                            
                            {!userRelations ? (
                                <div className="py-8 flex justify-center">
                                    <svg className="animate-spin w-8 h-8 text-primary-900" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : (
                                <form onSubmit={handleDelete} className="space-y-4">
                                    <p className="text-sm text-secondary-700">
                                        {trans('confirm_delete_user', { name: userToDelete?.name })}
                                    </p>
                                    
                                    {userRelations.has_relations && (
                                        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm mb-4">
                                            <p className="font-semibold mb-2">{trans('user_has_relations_warning')}</p>
                                            <ul className="list-disc list-inside space-y-1 mb-4">
                                                {userRelations.projects_count > 0 && <li>{userRelations.projects_count} {trans('projects')}</li>}
                                                {userRelations.units_count > 0 && <li>{userRelations.units_count} {trans('units')}</li>}
                                                {userRelations.agents_count > 0 && <li>{userRelations.agents_count} {trans('agents')}</li>}
                                            </ul>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-amber-900 mb-1">{trans('transfer_data_to')}</label>
                                                <Select value={deleteData.transfer_to_id} onChange={e => setDeleteData('transfer_to_id', e.target.value)} className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                                                    <option value="">{trans('force_delete_all')}</option>
                                                    {users?.filter(u => u.id !== userToDelete?.id && u.role !== 'admin').map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end pt-2">
                                        <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                            {trans('cancel')}
                                        </button>
                                        <button type="submit" disabled={deleteProcessing} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50">
                                            {deleteProcessing ? trans('loading') : trans('delete_confirm')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showPasswordModal && userToPassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPasswordModal(false)}>
                        <div className="bg-white rounded-xl shadow-card p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-secondary-950 mb-4">
                                {trans('change_password')} — {userToPassword.name}
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('new_password')}</label>
                                    <input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={e => setPasswordData('password', e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    />
                                    {passwordErrors.password && <p className="text-xs text-error mt-1">{passwordErrors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('confirm_password')}</label>
                                    <input
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                    />
                                    {passwordErrors.password_confirmation && <p className="text-xs text-error mt-1">{passwordErrors.password_confirmation}</p>}
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 bg-surface rounded-lg hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={passwordProcessing} className="px-4 py-2 text-sm font-medium text-white bg-primary-900 rounded-lg hover:bg-primary-950 transition-colors disabled:opacity-50">
                                        {passwordProcessing ? trans('loading') : trans('change_password')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
