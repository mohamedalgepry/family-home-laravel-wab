import { Select } from '../../../Components/UI'
import { usePage, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import Pagination from '../../../Components/UI/Pagination'
import { useState } from 'react'

export default function ActivityLogIndex({ activities, filters }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [eventFilter, setEventFilter] = useState(filters?.event || '')
    const [search, setSearch] = useState(filters?.search || '')

    function applyFilters() {
        const params = {}
        if (eventFilter) params.event = eventFilter
        if (search) params.search = search
        router.get('/admin/activity-log', params, { preserveState: true })
    }

    const hasActivities = activities?.data?.length > 0

    const eventLabels = {
        created: trans('created'),
        updated: trans('updated'),
        deleted: trans('deleted'),
    }

    return (
        <AdminSidebar>
            <Head title={trans('activity_log') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('activity_log')}</h1>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('event')}</label>
                        <Select
                            value={eventFilter}
                            onChange={e => setEventFilter(e.target.value)}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                        >
                            <option value="">{trans('all')}</option>
                            <option value="created">{eventLabels.created}</option>
                            <option value="updated">{eventLabels.updated}</option>
                            <option value="deleted">{eventLabels.deleted}</option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-secondary-950 mb-1">{trans('search')}</label>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={trans('search')}
                            className="px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                        />
                    </div>
                    <button
                        onClick={applyFilters}
                        className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors"
                    >
                        {trans('search')}
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-card overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-surface text-secondary-700 text-start rtl:text-right">
                                <th className="px-4 py-3 font-medium">{trans('date')}</th>
                                <th className="px-4 py-3 font-medium">{trans('user')}</th>
                                <th className="px-4 py-3 font-medium">{trans('event')}</th>
                                <th className="px-4 py-3 font-medium">{trans('model')}</th>
                                <th className="px-4 py-3 font-medium">{trans('description')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hasActivities ? activities.data.map(activity => (
                                <tr key={activity.id} className="border-t border-secondary-100 hover:bg-surface/50">
                                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                                        {new Date(activity.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">{activity.causer?.name || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            activity.event === 'created' ? 'bg-green-100 text-green-700' :
                                            activity.event === 'updated' ? 'bg-blue-100 text-blue-700' :
                                            activity.event === 'deleted' ? 'bg-red-100 text-red-700' :
                                            'bg-secondary-100 text-secondary-600'
                                        }`}>
                                            {eventLabels[activity.event] || activity.event}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted">
                                        {activity.subject_type ? activity.subject_type.replace('App\\Domain\\', '').replace('\\Models\\', ' › ') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-secondary-700 max-w-xs truncate">
                                        {activity.description}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-muted">{trans('no_data')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination meta={activities} links={activities.links} />
            </div>
        </AdminSidebar>
    )
}
