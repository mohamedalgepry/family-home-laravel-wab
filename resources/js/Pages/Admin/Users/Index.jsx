import { usePage, useForm, router, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow, Select } from '../../../Components/UI'

export default function AdminUsersIndex({ users, managers, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const currentUserId = auth?.user?.id

    const [search, setSearch] = useState(filters?.search || '')
    const [roleFilter, setRoleFilter] = useState(filters?.role || '')
    const [statusFilter, setStatusFilter] = useState('')
    const [openDropdownId, setOpenDropdownId] = useState(null)

    // Modals state
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showRoleModal, setShowRoleModal] = useState(false)
    const [showPasswordText, setShowPasswordText] = useState(false)

    const [userToDelete, setUserToDelete] = useState(null)
    const [userToPassword, setUserToPassword] = useState(null)
    const [userToRole, setUserToRole] = useState(null)
    const [userRelations, setUserRelations] = useState(null)
    const [togglingId, setTogglingId] = useState(null)

    // Forms
    const { data: passwordData, setData: setPasswordData, post: passwordPost, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        password: '',
        password_confirmation: '',
    })

    const { data: roleData, setData: setRoleData, post: rolePost, processing: roleProcessing, errors: roleErrors, reset: resetRole } = useForm({
        role: '',
        manager_id: '',
    })

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

    const allAgents = useMemo(() => users?.filter(u => u.role === 'agent') || [], [users])
    const [selectedAgents, setSelectedAgents] = useState([])

    // Summary statistics
    const stats = useMemo(() => {
        const list = users || []
        const total = list.length
        const active = list.filter(u => u.is_active).length
        const managersCount = list.filter(u => u.role === 'manager').length
        const agentsCount = list.filter(u => u.role === 'agent').length
        return {
            total,
            active,
            inactive: total - active,
            managers: managersCount,
            agents: agentsCount,
        }
    }, [users])

    // Close dropdowns on outside click or escape
    useEffect(() => {
        function handleClickOutside(e) {
            if (!e.target.closest('.user-action-dropdown-container')) {
                setOpenDropdownId(null)
            }
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setOpenDropdownId(null)
                setShowRoleModal(false)
                setShowPasswordModal(false)
                setShowTransferModal(false)
                setShowAssignModal(false)
                setShowDeleteModal(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('click', handleClickOutside)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    useEffect(() => {
        if (filters) {
            setSearch(filters.search || '')
            setRoleFilter(filters.role || '')
        }
    }, [filters])

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

    function resetFilters() {
        setSearch('')
        setRoleFilter('')
        setStatusFilter('')
        router.get('/admin/users', {}, { preserveState: true, preserveScroll: true })
    }

    function toggleActive(user) {
        if (user.id === currentUserId) return
        setTogglingId(user.id)
        router.post(`/admin/users/${user.id}/toggle-active`, {}, {
            preserveScroll: true,
            onFinish: () => setTogglingId(null),
        })
    }

    function openChangePassword(user) {
        setUserToPassword(user)
        resetPassword()
        setShowPasswordText(false)
        setShowPasswordModal(true)
        setOpenDropdownId(null)
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

    function openChangeRole(user) {
        if (user.id === currentUserId) return
        setUserToRole(user)
        setRoleData({
            role: user.role,
            manager_id: user.manager_id || '',
        })
        setShowRoleModal(true)
        setOpenDropdownId(null)
    }

    function handleChangeRole(e) {
        e.preventDefault()
        if (!userToRole || roleData.role === userToRole.role) {
            setShowRoleModal(false)
            return
        }

        rolePost(`/admin/users/${userToRole.id}/change-role`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRoleModal(false)
                setUserToRole(null)
                resetRole()
            },
        })
    }

    function openTransfer(user) {
        setTransferData('from_user_id', user.id)
        setShowTransferModal(true)
        setOpenDropdownId(null)
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

    async function openDelete(user) {
        if (user.id === currentUserId) return
        setUserToDelete(user)
        setUserRelations(null)
        setDeleteData('transfer_to_id', '')
        setShowDeleteModal(true)
        setOpenDropdownId(null)

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

    const loading = !users
    const filteredUsers = useMemo(() => {
        return (users || []).filter(u => {
            if (roleFilter && u.role !== roleFilter) return false
            if (statusFilter === 'active' && !u.is_active) return false
            if (statusFilter === 'inactive' && u.is_active) return false
            if (search) {
                const s = search.toLowerCase().trim()
                const nameMatch = u.name?.toLowerCase().includes(s)
                const emailMatch = u.email?.toLowerCase().includes(s)
                const phone = u.phone || u.profile?.phone || ''
                const phoneMatch = phone.toLowerCase().includes(s)
                if (!nameMatch && !emailMatch && !phoneMatch) return false
            }
            return true
        })
    }, [users, roleFilter, statusFilter, search])

    const roleBadgeConfig = role => {
        switch (role) {
            case 'admin':
                return {
                    label: trans('admin'),
                    classes: 'bg-purple-50 text-purple-700 border-purple-200/90',
                    dot: 'bg-purple-500',
                }
            case 'manager':
                return {
                    label: trans('manager'),
                    classes: 'bg-blue-50 text-blue-700 border-blue-200/90',
                    dot: 'bg-blue-500',
                }
            case 'agent':
                return {
                    label: trans('agent'),
                    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
                    dot: 'bg-emerald-500',
                }
            default:
                return {
                    label: trans(role) || role,
                    classes: 'bg-secondary-50 text-secondary-700 border-secondary-200/90',
                    dot: 'bg-secondary-400',
                }
        }
    }

    const hasActiveFilters = Boolean(search || roleFilter || statusFilter)

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_users') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* 1. Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-secondary-200/60">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-primary-900 text-white flex items-center justify-center shadow-xs">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-secondary-950 tracking-tight">
                                    {trans('sidebar_users')}
                                </h1>
                                <p className="text-xs text-secondary-500 font-medium mt-0.5">
                                    {isRtl ? 'إدارة المستخدمين والأدوار والوكلاء التابعين للمدراء' : 'Manage users, roles, and agent assignments'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                        <Link
                            href="/admin/users/create"
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>{trans('add_user')}</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setShowAssignModal(true)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-secondary-800 border border-secondary-200/90 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition-all shadow-2xs active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            <span>{trans('assign_agents')}</span>
                        </button>
                    </div>
                </div>

                {/* 2. KPI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Total Users */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wider">{trans('total_users')}</p>
                            <p className="text-2xl sm:text-3xl font-black text-secondary-950 mt-1">{stats.total}</p>
                            <p className="text-[11px] text-secondary-400 font-medium mt-0.5">{isRtl ? 'جميع الحسابات' : 'All accounts'}</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-900 border border-primary-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wider">{trans('active_users')}</p>
                            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.active}</p>
                            <p className="text-[11px] text-secondary-400 font-medium mt-0.5">{stats.inactive} {trans('inactive')}</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Managers */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wider">{trans('manager')}</p>
                            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats.managers}</p>
                            <p className="text-[11px] text-secondary-400 font-medium mt-0.5">{isRtl ? 'مدراء فرق' : 'Team leads'}</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                    </div>

                    {/* Agents */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-secondary-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-secondary-500 uppercase tracking-wider">{trans('agent')}</p>
                            <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">{stats.agents}</p>
                            <p className="text-[11px] text-secondary-400 font-medium mt-0.5">{isRtl ? 'مسؤولو مبيعات' : 'Sales reps'}</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 3. Filters & Search Bar */}
                <div className="bg-white rounded-2xl border border-secondary-200/80 shadow-xs p-4">
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            applyFilters()
                        }}
                        className="flex flex-col md:flex-row gap-3 items-stretch md:items-center"
                    >
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-secondary-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={isRtl ? 'ابحث بالاسم، البريد الإلكتروني، أو الهاتف...' : 'Search by name, email, or phone...'}
                                className="w-full ps-10 pe-9 py-2.5 bg-slate-50/70 border border-secondary-200 rounded-xl text-xs sm:text-sm text-secondary-900 placeholder:text-secondary-400 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-all font-medium"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute inset-y-0 end-0 pe-3 flex items-center text-secondary-400 hover:text-secondary-700"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Role Filter */}
                        <div className="w-full md:w-48">
                            <Select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                                className="w-full py-2.5 px-3 bg-slate-50/70 border border-secondary-200 rounded-xl text-xs sm:text-sm text-secondary-900 font-medium focus:bg-white"
                            >
                                <option value="">{trans('all_roles')}</option>
                                <option value="admin">{trans('admin')}</option>
                                <option value="manager">{trans('manager')}</option>
                                <option value="agent">{trans('agent')}</option>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full md:w-36">
                            <Select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="w-full py-2.5 px-3 bg-slate-50/70 border border-secondary-200 rounded-xl text-xs sm:text-sm text-secondary-900 font-medium focus:bg-white"
                            >
                                <option value="">{isRtl ? 'كل الحالات' : 'All Status'}</option>
                                <option value="active">{trans('active')}</option>
                                <option value="inactive">{trans('inactive')}</option>
                            </Select>
                        </div>

                        {/* Search & Reset Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="flex-1 md:flex-none px-4 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-[0.98]"
                            >
                                {trans('search')}
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    title={trans('reset_filters')}
                                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-secondary-700 border border-secondary-200 rounded-xl text-xs font-bold transition-all shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Active results indicator */}
                    <div className="flex items-center justify-between text-xs text-secondary-500 pt-3 mt-3 border-t border-secondary-100">
                        <span>
                            {isRtl
                                ? `تم العثور على ${filteredUsers.length} مستخدم`
                                : `Found ${filteredUsers.length} user(s)`}
                        </span>
                        {hasActiveFilters && (
                            <span className="text-[11px] text-primary-900 font-semibold">
                                {isRtl ? 'تصفية نشطة' : 'Active filters'}
                            </span>
                        )}
                    </div>
                </div>

                {/* 4. Desktop Table View (Hidden on mobile) */}
                <div className="hidden md:block bg-white rounded-2xl border border-secondary-200/80 shadow-xs overflow-visible">
                    <div className="overflow-x-auto overflow-y-visible">
                        <table className="w-full text-xs text-start rtl:text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-secondary-200/90 text-secondary-600 font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="px-5 py-4 text-start">{trans('user')}</th>
                                    <th className="px-4 py-4 text-start">{trans('role')}</th>
                                    <th className="px-4 py-4 text-start">{trans('phone')}</th>
                                    <th className="px-4 py-4 text-start">{trans('manager')}</th>
                                    <th className="px-4 py-4 text-center">{trans('status')}</th>
                                    <th className="px-5 py-4 text-center min-w-[200px]">{trans('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 font-medium">
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
                                ) : filteredUsers.length > 0 ? filteredUsers.map(u => {
                                    const roleConf = roleBadgeConfig(u.role)
                                    const avatar = u.avatar || u.profile?.avatar
                                    const phone = u.phone || u.profile?.phone
                                    const isSelf = u.id === currentUserId
                                    const isDropdownOpen = openDropdownId === u.id

                                    return (
                                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                                            {/* User info: Avatar + Name + Email */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {avatar ? (
                                                        <img
                                                            src={`/storage/${avatar}`}
                                                            alt={u.name}
                                                            className="w-10 h-10 rounded-xl object-cover border border-secondary-200 shadow-2xs shrink-0"
                                                        />
                                                    ) : (
                                                        <div className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center border shrink-0 ${
                                                            u.role === 'admin'
                                                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                                : u.role === 'manager'
                                                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-secondary-950 text-xs block truncate max-w-[200px]">
                                                                {u.name}
                                                            </span>
                                                            {isSelf && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-primary-100 text-primary-900 border border-primary-200">
                                                                    {isRtl ? 'أنت' : 'You'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-secondary-500 font-mono block truncate max-w-[220px]">
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-bold border ${roleConf.classes}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${roleConf.dot}`} />
                                                    {roleConf.label}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {phone ? (
                                                    <a
                                                        href={`tel:${phone}`}
                                                        className="text-secondary-700 hover:text-primary-900 font-mono text-xs flex items-center gap-1.5 transition-colors"
                                                        dir="ltr"
                                                    >
                                                        <svg className="w-3.5 h-3.5 text-secondary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                        </svg>
                                                        <span>{phone}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-secondary-400 text-xs">—</span>
                                                )}
                                            </td>

                                            {/* Manager */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {u.manager?.name ? (
                                                    <span className="inline-flex items-center gap-1 text-secondary-800 text-xs font-medium">
                                                        <svg className="w-3.5 h-3.5 text-secondary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                        </svg>
                                                        <span>{u.manager.name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-secondary-400 text-xs">{trans('manager_not_assigned')}</span>
                                                )}
                                            </td>

                                            {/* Status: Interactive Toggle Badge */}
                                            <td className="px-4 py-3.5 whitespace-nowrap text-center">
                                                <button
                                                    type="button"
                                                    disabled={isSelf || togglingId === u.id}
                                                    onClick={() => toggleActive(u)}
                                                    title={
                                                        isSelf
                                                            ? trans('cannot_deactivate_own_account')
                                                            : u.is_active
                                                            ? trans('deactivate')
                                                            : trans('activate')
                                                    }
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-bold border transition-all ${
                                                        u.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                                                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'
                                                    } ${isSelf ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-600' : 'bg-red-600'} ${togglingId === u.id ? 'animate-ping' : ''}`} />
                                                    <span>{u.is_active ? trans('active') : trans('inactive')}</span>
                                                </button>
                                            </td>

                                            {/* Action Buttons: Unified, Never-wrapping Action Toolbar */}
                                            <td className="px-5 py-3.5 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {/* Quick Action: Change Password */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openChangePassword(u)}
                                                        title={trans('change_password')}
                                                        className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200 active:scale-95 shadow-2xs"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                        </svg>
                                                    </button>

                                                    {/* Quick Action: Change Role */}
                                                    <button
                                                        type="button"
                                                        disabled={isSelf}
                                                        onClick={() => openChangeRole(u)}
                                                        title={isSelf ? trans('cannot_change_own_role') : trans('change_role')}
                                                        className="p-1.5 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all border border-purple-200 active:scale-95 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                        </svg>
                                                    </button>

                                                    {/* Quick Action: Transfer Projects (Non-admin only) */}
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openTransfer(u)}
                                                            title={trans('transfer_projects')}
                                                            className="p-1.5 text-secondary-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all border border-secondary-200 active:scale-95 shadow-2xs"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    {/* Quick Action: Delete User */}
                                                    <button
                                                        type="button"
                                                        disabled={isSelf}
                                                        onClick={() => openDelete(u)}
                                                        title={isSelf ? '' : trans('delete')}
                                                        className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 active:scale-95 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>

                                                    {/* More Actions Dropdown Menu */}
                                                    <div className="relative user-action-dropdown-container">
                                                        <button
                                                            type="button"
                                                            onClick={e => {
                                                                e.stopPropagation()
                                                                setOpenDropdownId(isDropdownOpen ? null : u.id)
                                                            }}
                                                            title={trans('more_actions')}
                                                            className={`p-1.5 rounded-lg border transition-all active:scale-95 shadow-2xs ${
                                                                isDropdownOpen
                                                                    ? 'bg-secondary-900 text-white border-secondary-900'
                                                                    : 'bg-white text-secondary-600 hover:bg-slate-100 border-secondary-200'
                                                            }`}
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                                            </svg>
                                                        </button>

                                                        {/* Floating Dropdown */}
                                                        {isDropdownOpen && (
                                                            <div
                                                                dir={isRtl ? 'rtl' : 'ltr'}
                                                                className="absolute end-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-secondary-200 py-1.5 z-50 text-start animate-in fade-in zoom-in-95 duration-150"
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openChangePassword(u)}
                                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-secondary-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                                                                >
                                                                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                                    </svg>
                                                                    <span>{trans('change_password')}</span>
                                                                </button>

                                                                {!isSelf && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openChangeRole(u)}
                                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-secondary-700 hover:bg-purple-50 hover:text-purple-700 font-medium transition-colors"
                                                                    >
                                                                        <svg className="w-4 h-4 text-purple-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                                        </svg>
                                                                        <span>{trans('change_role')}</span>
                                                                    </button>
                                                                )}

                                                                {u.role !== 'admin' && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openTransfer(u)}
                                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-secondary-700 hover:bg-slate-50 hover:text-secondary-950 font-medium transition-colors"
                                                                    >
                                                                        <svg className="w-4 h-4 text-secondary-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                                                        </svg>
                                                                        <span>{trans('transfer_projects')}</span>
                                                                    </button>
                                                                )}

                                                                {!isSelf && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            toggleActive(u)
                                                                            setOpenDropdownId(null)
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-secondary-700 hover:bg-slate-50 font-medium transition-colors"
                                                                    >
                                                                        <svg className="w-4 h-4 text-secondary-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                                                                        </svg>
                                                                        <span>{u.is_active ? trans('deactivate') : trans('activate')}</span>
                                                                    </button>
                                                                )}

                                                                {!isSelf && (
                                                                    <>
                                                                        <div className="my-1 border-t border-secondary-100" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openDelete(u)}
                                                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
                                                                        >
                                                                            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                            </svg>
                                                                            <span>{trans('delete')}</span>
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-secondary-400">
                                                <svg className="w-12 h-12 mb-3 text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <p className="text-sm font-bold text-secondary-700">{trans('no_data')}</p>
                                                <p className="text-xs text-secondary-500 mt-0.5">{trans('no_matching_users')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. Mobile Responsive Card View (Visible ONLY on mobile) */}
                <div className="md:hidden space-y-3.5">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-secondary-200/80 animate-pulse h-36" />
                        ))
                    ) : filteredUsers.length > 0 ? filteredUsers.map(u => {
                        const roleConf = roleBadgeConfig(u.role)
                        const avatar = u.avatar || u.profile?.avatar
                        const phone = u.phone || u.profile?.phone
                        const isSelf = u.id === currentUserId

                        return (
                            <div
                                key={u.id}
                                className="bg-white p-4 rounded-2xl border border-secondary-200/90 shadow-xs space-y-3.5 transition-all"
                            >
                                {/* Card Header: Avatar + Name + Status Toggle */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {avatar ? (
                                            <img
                                                src={`/storage/${avatar}`}
                                                alt={u.name}
                                                className="w-11 h-11 rounded-xl object-cover border border-secondary-200 shadow-2xs shrink-0"
                                            />
                                        ) : (
                                            <div className={`w-11 h-11 rounded-xl font-black text-sm flex items-center justify-center border shrink-0 ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                                                    : u.role === 'manager'
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {u.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-bold text-secondary-950 text-sm truncate">
                                                    {u.name}
                                                </h3>
                                                {isSelf && (
                                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-primary-100 text-primary-900 border border-primary-200 shrink-0">
                                                        {isRtl ? 'أنت' : 'You'}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-secondary-500 font-mono truncate mt-0.5">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Toggle on Mobile */}
                                    <button
                                        type="button"
                                        disabled={isSelf || togglingId === u.id}
                                        onClick={() => toggleActive(u)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full font-bold border shrink-0 transition-all ${
                                            u.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                        } ${isSelf ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-600' : 'bg-red-600'} ${togglingId === u.id ? 'animate-ping' : ''}`} />
                                        <span>{u.is_active ? trans('active') : trans('inactive')}</span>
                                    </button>
                                </div>

                                {/* Metadata Grid: Role, Phone, Manager */}
                                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-xl border border-secondary-100 text-xs">
                                    <div>
                                        <span className="text-[10px] text-secondary-400 block font-medium mb-1">
                                            {trans('role')}
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${roleConf.classes}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${roleConf.dot}`} />
                                            {roleConf.label}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] text-secondary-400 block font-medium mb-1">
                                            {trans('manager')}
                                        </span>
                                        <span className="text-secondary-800 font-medium text-xs block truncate">
                                            {u.manager?.name || '—'}
                                        </span>
                                    </div>

                                    {phone && (
                                        <div className="col-span-2 pt-1 border-t border-secondary-200/60">
                                            <span className="text-[10px] text-secondary-400 block font-medium mb-0.5">
                                                {trans('phone')}
                                            </span>
                                            <a
                                                href={`tel:${phone}`}
                                                className="text-primary-900 font-mono text-xs flex items-center gap-1.5 font-bold"
                                                dir="ltr"
                                            >
                                                <svg className="w-3.5 h-3.5 text-secondary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                </svg>
                                                <span>{phone}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Touch-Friendly Mobile Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => openChangePassword(u)}
                                        className="py-2.5 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                        </svg>
                                        <span>{trans('change_password')}</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isSelf}
                                        onClick={() => openChangeRole(u)}
                                        className="py-2.5 px-3 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                        <span>{trans('change_role')}</span>
                                    </button>

                                    {u.role !== 'admin' && (
                                        <button
                                            type="button"
                                            onClick={() => openTransfer(u)}
                                            className="py-2 px-3 bg-slate-50 text-secondary-700 hover:bg-slate-100 border border-secondary-200/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                                        >
                                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                            </svg>
                                            <span>{trans('transfer_projects')}</span>
                                        </button>
                                    )}

                                    {!isSelf && (
                                        <button
                                            type="button"
                                            onClick={() => openDelete(u)}
                                            className={`py-2 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/90 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                                                u.role === 'admin' ? 'col-span-2' : ''
                                            }`}
                                        >
                                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span>{trans('delete')}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="bg-white p-8 rounded-2xl border border-secondary-200/80 text-center text-secondary-500 text-xs">
                            <p className="font-bold text-secondary-700 text-sm">{trans('no_data')}</p>
                            <p className="mt-1">{trans('no_matching_users')}</p>
                        </div>
                    )}
                </div>

                {/* ================= MODALS ================= */}

                {/* Change Role Modal */}
                {showRoleModal && userToRole && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 backdrop-blur-xs p-4" onClick={() => setShowRoleModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-secondary-100 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-secondary-950">{trans('change_role')}</h3>
                                        <p className="text-xs text-secondary-500">{userToRole.name}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowRoleModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-secondary-700 hover:bg-slate-100 transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleChangeRole} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('new_role')} *
                                    </label>
                                    <Select
                                        value={roleData.role}
                                        onChange={e => setRoleData('role', e.target.value)}
                                        className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-medium"
                                    >
                                        <option value="admin">{trans('admin')}</option>
                                        <option value="manager">{trans('manager')}</option>
                                        <option value="agent">{trans('agent')}</option>
                                    </Select>
                                    {roleErrors.role && <p className="text-xs text-red-600 mt-1">{roleErrors.role}</p>}
                                </div>

                                {roleData.role === 'agent' && (
                                    <div>
                                        <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                            {trans('select_manager')} *
                                        </label>
                                        <Select
                                            value={roleData.manager_id}
                                            onChange={e => setRoleData('manager_id', e.target.value)}
                                            required
                                            className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-medium"
                                        >
                                            <option value="">— {trans('select_manager')} —</option>
                                            {managers?.map(m => (
                                                <option key={m.id} value={m.id}>{m.name}</option>
                                            ))}
                                        </Select>
                                        {roleErrors.manager_id && <p className="text-xs text-red-600 mt-1">{roleErrors.manager_id}</p>}
                                    </div>
                                )}

                                <div className="bg-amber-50 text-amber-900 p-3.5 rounded-xl text-xs border border-amber-200/80 flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <span>{trans('role_change_warning')}</span>
                                </div>

                                <div className="flex gap-2.5 justify-end pt-3 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowRoleModal(false)}
                                        className="px-4 py-2.5 bg-slate-100 text-secondary-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        {trans('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={roleProcessing || roleData.role === userToRole.role || (roleData.role === 'agent' && !roleData.manager_id)}
                                        className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {roleProcessing ? trans('loading') : trans('change_role')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showPasswordModal && userToPassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 backdrop-blur-xs p-4" onClick={() => setShowPasswordModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-secondary-100 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-secondary-950">{trans('change_password')}</h3>
                                        <p className="text-xs text-secondary-500">{userToPassword.name}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-secondary-700 hover:bg-slate-100 transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('new_password')} *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswordText ? 'text' : 'password'}
                                            value={passwordData.password}
                                            onChange={e => setPasswordData('password', e.target.value)}
                                            required
                                            minLength={8}
                                            className="w-full px-3.5 py-2.5 pe-10 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordText(!showPasswordText)}
                                            className="absolute inset-y-0 end-0 pe-3 flex items-center text-secondary-400 hover:text-secondary-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                                                {showPasswordText ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                    {passwordErrors.password && <p className="text-xs text-red-600 mt-1">{passwordErrors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('confirm_password')} *
                                    </label>
                                    <input
                                        type={showPasswordText ? 'text' : 'password'}
                                        value={passwordData.password_confirmation}
                                        onChange={e => setPasswordData('password_confirmation', e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-mono"
                                    />
                                    {passwordErrors.password_confirmation && <p className="text-xs text-red-600 mt-1">{passwordErrors.password_confirmation}</p>}
                                </div>

                                <p className="text-[11px] text-secondary-500">
                                    {trans('password_requirements')}
                                </p>

                                <div className="flex gap-2.5 justify-end pt-3 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="px-4 py-2.5 bg-slate-100 text-secondary-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        {trans('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={passwordProcessing || !passwordData.password || passwordData.password !== passwordData.password_confirmation}
                                        className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {passwordProcessing ? trans('loading') : trans('change_password')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Transfer Projects Modal */}
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 backdrop-blur-xs p-4" onClick={() => setShowTransferModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-secondary-100 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-secondary-700 border border-secondary-200 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-secondary-950">{trans('transfer_projects')}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowTransferModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-secondary-700 hover:bg-slate-100 transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleTransfer} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('transfer_from')}
                                    </label>
                                    <Select
                                        value={transferData.from_user_id}
                                        disabled
                                        className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-slate-50 text-secondary-700"
                                    >
                                        {users?.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('transfer_to')} *
                                    </label>
                                    <Select
                                        value={transferData.to_user_id}
                                        onChange={e => setTransferData('to_user_id', e.target.value)}
                                        required
                                        className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-medium"
                                    >
                                        <option value="">— {trans('transfer_to')} —</option>
                                        {users?.filter(u => u.id !== Number(transferData.from_user_id) && u.role !== 'admin').map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="flex gap-2.5 justify-end pt-3 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowTransferModal(false)}
                                        className="px-4 py-2.5 bg-slate-100 text-secondary-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        {trans('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={transferProcessing || !transferData.to_user_id}
                                        className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {transferProcessing ? trans('loading') : trans('transfer')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign Agents to Manager Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 backdrop-blur-xs p-4" onClick={() => setShowAssignModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-secondary-100 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-900 border border-primary-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-secondary-950">{trans('assign_agents_to_manager')}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-secondary-700 hover:bg-slate-100 transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider mb-1.5">
                                        {trans('select_manager')} *
                                    </label>
                                    <Select
                                        value={assignData.manager_id}
                                        onChange={e => setAssignData('manager_id', e.target.value)}
                                        required
                                        className="w-full px-3.5 py-2.5 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-medium"
                                    >
                                        <option value="">— {trans('select_manager')} —</option>
                                        {managers?.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </Select>
                                </div>

                                {assignData.manager_id && (
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-secondary-800 uppercase tracking-wider">
                                                {trans('select_agents')}
                                            </label>
                                            <span className="text-[11px] font-bold text-primary-900">
                                                {selectedAgents.length} {isRtl ? 'وكيل محدد' : 'selected'}
                                            </span>
                                        </div>
                                        <div className="max-h-56 overflow-y-auto border border-secondary-200 rounded-xl divide-y divide-secondary-100 p-1">
                                            {allAgents.length > 0 ? allAgents.map(agent => (
                                                <label
                                                    key={agent.id}
                                                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedAgents.includes(agent.id)}
                                                        onChange={() => toggleAgentSelection(agent.id)}
                                                        className="w-4 h-4 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-xs font-bold text-secondary-900 block truncate">{agent.name}</span>
                                                        <span className="text-[11px] text-secondary-500 font-mono block truncate">{agent.email}</span>
                                                    </div>
                                                </label>
                                            )) : (
                                                <p className="px-3 py-6 text-xs text-secondary-400 text-center">
                                                    {trans('no_agents_available')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2.5 justify-end pt-3 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAssignModal(false)}
                                        className="px-4 py-2.5 bg-slate-100 text-secondary-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        {trans('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={assignProcessing || !assignData.manager_id || selectedAgents.length === 0}
                                        className="px-5 py-2.5 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs"
                                    >
                                        {assignProcessing ? trans('loading') : trans('assign')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete User Modal */}
                {showDeleteModal && userToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/60 backdrop-blur-xs p-4" onClick={() => setShowDeleteModal(false)}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-secondary-100 animate-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-secondary-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-red-600">{trans('delete_user')}</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-400 hover:text-secondary-700 hover:bg-slate-100 transition-colors"
                                >
                                    &times;
                                </button>
                            </div>

                            {!userRelations ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-2">
                                    <svg className="animate-spin w-8 h-8 text-primary-900" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span className="text-xs text-secondary-500 font-medium">{trans('loading')}...</span>
                                </div>
                            ) : (
                                <form onSubmit={handleDelete} className="space-y-4">
                                    <p className="text-xs sm:text-sm text-secondary-700 font-medium">
                                        {trans('confirm_delete_user', { name: userToDelete?.name })}
                                    </p>

                                    {userRelations.has_relations && (
                                        <div className="bg-amber-50 text-amber-900 p-4 rounded-xl text-xs border border-amber-200/90 space-y-3">
                                            <p className="font-bold flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                </svg>
                                                <span>{trans('user_has_relations_warning')}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {userRelations.projects_count > 0 && (
                                                    <span className="px-2 py-1 bg-white/80 rounded-md font-mono font-bold border border-amber-200">
                                                        {userRelations.projects_count} {trans('projects')}
                                                    </span>
                                                )}
                                                {userRelations.units_count > 0 && (
                                                    <span className="px-2 py-1 bg-white/80 rounded-md font-mono font-bold border border-amber-200">
                                                        {userRelations.units_count} {trans('units')}
                                                    </span>
                                                )}
                                                {userRelations.agents_count > 0 && (
                                                    <span className="px-2 py-1 bg-white/80 rounded-md font-mono font-bold border border-amber-200">
                                                        {userRelations.agents_count} {trans('agents')}
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-amber-950 mb-1">
                                                    {trans('transfer_data_to')}
                                                </label>
                                                <Select
                                                    value={deleteData.transfer_to_id}
                                                    onChange={e => setDeleteData('transfer_to_id', e.target.value)}
                                                    className="w-full px-3 py-2 border border-amber-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-amber-500/20 font-medium"
                                                >
                                                    <option value="">{trans('force_delete_all')}</option>
                                                    {users?.filter(u => u.id !== userToDelete?.id && u.role !== 'admin').map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({trans(u.role)})</option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2.5 justify-end pt-3 border-t border-secondary-100">
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(false)}
                                            className="px-4 py-2.5 bg-slate-100 text-secondary-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                                        >
                                            {trans('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={deleteProcessing}
                                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-xs"
                                        >
                                            {deleteProcessing ? trans('loading') : trans('delete_confirm')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}
