import { usePage, useForm, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow, Select } from '../../../Components/UI'

export default function AdminUnitsIndex({ units, areas, unitTypes, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const role = auth?.user?.role

    const [search, setSearch] = useState(filters?.search || '')
    const [areaFilter, setAreaFilter] = useState(filters?.area_id || '')
    const [typeFilter, setTypeFilter] = useState(filters?.type_id || '')

    const [showAdjustPointsModal, setShowAdjustPointsModal] = useState(false)
    const [unitToAdjust, setUnitToAdjust] = useState(null)
    const { data: pointsData, setData: setPointsData, post: postPoints, processing: pointsProcessing, reset: resetPoints, errors: pointsErrors } = useForm({
        points: '',
    })

    function openAdjustPoints(unit) {
        setUnitToAdjust(unit)
        setPointsData('points', unit.priority_points)
        setShowAdjustPointsModal(true)
    }

    function handleAdjustPoints(e) {
        e.preventDefault()
        postPoints(`/admin/units/${unitToAdjust.id}/adjust-points`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAdjustPointsModal(false)
                setUnitToAdjust(null)
                resetPoints()
            },
        })
    }

    function applyFilters() {
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        if (typeFilter) params.type_id = typeFilter
        router.get('/admin/units', params, { preserveState: true })
    }

    function togglePin(unit) {
        router.post(`/admin/units/${unit.id}/pin`, {}, { preserveScroll: true })
    }

    function toggleDeal(unit) {
        router.post(`/admin/units/${unit.id}/deal`, {}, { preserveScroll: true })
    }

    function toggleActive(unit) {
        router.post(`/admin/units/${unit.id}/active`, {}, { preserveScroll: true })
    }

    function deleteUnit(unit) {
        if (confirm(trans('confirm_delete'))) {
            router.delete(`/admin/units/${unit.id}`, { preserveScroll: true })
        }
    }

    const loading = !units
    const hasUnits = units?.data?.length > 0
    const colCount = role === 'agent' ? 9 : 10

    return (
        <AdminSidebar>
            <Head title={trans('page_title') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_units')}</h1>
                    <Link href="/admin/units/create" className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                        {trans('add_unit', {}, 'units')}
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label htmlFor="search-input" className="block text-xs font-medium text-secondary-950 mb-1">{trans('search')}</label>
                        <input
                            id="search-input"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={trans('search')}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="area-filter" className="block text-xs font-medium text-secondary-950 mb-1">{trans('area')}</label>
                        <Select id="area-filter" value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none">
                            <option value="">{trans('area')}</option>
                            {areas?.map(a => <option key={a.id} value={a.id}>{locale === 'ar' ? a.name_ar : a.name_en}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="type-filter" className="block text-xs font-medium text-secondary-950 mb-1">{trans('type')}</label>
                        <Select id="type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none">
                            <option value="">{trans('type')}</option>
                            {unitTypes?.map(t => <option key={t.id} value={t.id}>{locale === 'ar' ? t.name_ar : t.name_en}</option>)}
                        </Select>
                    </div>
                    <button onClick={applyFilters} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none">
                        {trans('search')}
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('name')}</th>
                                <th className="px-4 py-3 font-medium">{trans('type', {}, 'units')}</th>
                                <th className="px-4 py-3 font-medium">{trans('area')}</th>
                                <th className="px-4 py-3 font-medium">{trans('price', {}, 'units')}</th>
                                <th className="px-4 py-3 font-medium">{trans('transaction', {}, 'units')}</th>
                                <th className="px-4 py-3 font-medium">{trans('priority_points')}</th>
                                <th className="px-4 py-3 font-medium">{trans('pinned')}</th>
                                <th className="px-4 py-3 font-medium">{trans('is_deal')}</th>
                                {role !== 'agent' && <th className="px-4 py-3 font-medium">{trans('active')}</th>}
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
                            ) : hasUnits ? units.data.map(unit => (
                                <tr key={unit.id} className="border-t border-secondary-100 hover:bg-surface/50">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/units/${unit.id}/edit`} className="text-primary-900 hover:text-primary-950 font-medium">
                                            {unit.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">{(locale === 'ar' ? unit.type?.name_ar : unit.type?.name_en) || unit.type?.name_ar || unit.type?.name_en || ''}</td>
                                    <td className="px-4 py-3">{(locale === 'ar' ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name_ar || unit.area?.name_en || ''}</td>
                                    <td className="px-4 py-3">{Number(unit.price).toLocaleString()}</td>
                                    <td className="px-4 py-3">{trans(unit.transaction === 'rent' ? 'rent' : 'sale', {}, 'units')}</td>
                                    <td className="px-4 py-3">{unit.priority_points}</td>
                                    <td className="px-4 py-3">
                                        {role !== 'agent' ? (
                                            <button onClick={() => togglePin(unit)} className={`px-2 py-0.5 text-xs rounded-full focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none ${unit.is_pinned ? 'bg-primary-900 text-white' : 'bg-secondary-100 text-secondary-600'}`}>
                                                {unit.is_pinned ? trans('pinned') : trans('not_pinned')}
                                            </button>
                                        ) : (
                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full cursor-default ${unit.is_pinned ? 'bg-primary-900 text-white' : 'bg-secondary-100 text-secondary-600'}`}>
                                                {unit.is_pinned ? trans('pinned') : trans('not_pinned')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {role !== 'agent' ? (
                                            <button onClick={() => toggleDeal(unit)} className={`px-2 py-0.5 text-xs rounded-full focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none ${unit.is_deal ? 'bg-green-500 text-white' : 'bg-secondary-100 text-secondary-600'}`}>
                                                {unit.is_deal ? trans('yes') : trans('no')}
                                            </button>
                                        ) : (
                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full cursor-default ${unit.is_deal ? 'bg-green-500 text-white' : 'bg-secondary-100 text-secondary-600'}`}>
                                                {unit.is_deal ? trans('yes') : trans('no')}
                                            </span>
                                        )}
                                    </td>
                                    {role !== 'agent' && (
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleActive(unit)} className={`px-2 py-0.5 text-xs rounded-full focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none ${unit.is_active ? 'bg-green-500 text-white' : 'bg-error/10 text-error'}`}>
                                                {unit.is_active ? trans('active') : trans('inactive')}
                                            </button>
                                        </td>
                                    )}
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {role !== 'agent' && (
                                                <button onClick={() => openAdjustPoints(unit)} className="text-xs text-secondary-600 hover:text-secondary-900 focus-visible:ring-2 focus-visible:ring-secondary-600 focus-visible:outline-none rounded">
                                                    {trans('adjust_points')}
                                                </button>
                                            )}
                                            {(role !== 'agent' || unit.user_id === auth?.user?.id) && (
                                                <Link href={`/admin/units/${unit.id}/edit`} className="text-xs text-primary-900 hover:text-primary-950 focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded">
                                                    {trans('edit')}
                                                </Link>
                                            )}
                                            {role !== 'agent' && (
                                                <button onClick={() => deleteUnit(unit)} className="text-xs text-error hover:text-red-700 focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none rounded">
                                                    {trans('delete')}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={colCount} className="px-4 py-12 text-center text-muted">{trans('no_data')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Adjust Points Modal */}
                {showAdjustPointsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdjustPointsModal(false)}>
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-secondary-950">{trans('adjust_points')}</h3>
                                <button onClick={() => setShowAdjustPointsModal(false)} className="text-muted hover:text-secondary-950 text-xl leading-none">&times;</button>
                            </div>
                            <form onSubmit={handleAdjustPoints} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('priority_points')} *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={pointsData.points}
                                        onChange={e => setPointsData('points', e.target.value)}
                                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
                                        required
                                    />
                                    {pointsErrors.points && <p className="text-xs text-error mt-1">{pointsErrors.points}</p>}
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowAdjustPointsModal(false)} className="px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                                        {trans('cancel')}
                                    </button>
                                    <button type="submit" disabled={pointsProcessing} className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                                        {pointsProcessing ? trans('loading') : trans('save')}
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
