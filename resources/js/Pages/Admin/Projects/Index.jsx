import { usePage, Link, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { SkeletonRow , Select} from '../../../Components/UI'

export default function AdminProjectsIndex({ projects, areas, filters }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isAdminOrManager = auth?.user?.role === 'admin' || auth?.user?.role === 'manager'

    const [search, setSearch] = useState(filters?.search || '')
    const [areaFilter, setAreaFilter] = useState(filters?.area_id || '')

    function applyFilters() {
        const params = {}
        if (search) params.search = search
        if (areaFilter) params.area_id = areaFilter
        router.get('/admin/projects', params, { preserveState: true })
    }

    function deleteProject(project) {
        if (confirm(trans('confirm_delete'))) {
            router.delete(`/admin/projects/${project.id}`, { preserveScroll: true })
        }
    }

    const loading = !projects
    const hasProjects = projects?.data?.length > 0

    return (
        <AdminSidebar>
            <Head title={trans('projects_page_title') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_projects')}</h1>
                    {isAdminOrManager && (
                        <Link href="/admin/projects/create" className="px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors">
                            {trans('add_project', {}, 'projects')}
                        </Link>
                    )}
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
                                <th className="px-4 py-3 font-medium">{trans('area')}</th>
                                <th className="px-4 py-3 font-medium">{trans('units_count')}</th>
                                <th className="px-4 py-3 font-medium">{trans('active')}</th>
                                <th className="px-4 py-3 font-medium">{trans('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
                            ) : hasProjects ? projects.data.map(project => (
                                <tr key={project.id} className="border-t border-secondary-100 hover:bg-surface/50">
                                    <td className="px-4 py-3">
                                        {isAdminOrManager ? (
                                            <Link href={`/admin/projects/${project.id}/edit`} className="text-primary-900 hover:text-primary-950 font-medium">
                                                {project.name}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-secondary-900">{project.name}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{project.area ? (locale === 'ar' ? project.area.name_ar : project.area.name_en) : ''}</td>
                                    <td className="px-4 py-3">{project.units_count}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${project.is_active ? 'bg-green-500 text-white' : 'bg-error/10 text-error'}`}>
                                            {project.is_active ? trans('active') : trans('inactive')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {isAdminOrManager && (
                                            <div className="flex gap-2">
                                                <Link href={`/admin/projects/${project.id}/edit`} className="text-xs text-primary-900 hover:text-primary-950 focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded">
                                                    {trans('edit')}
                                                </Link>
                                                <button onClick={() => deleteProject(project)} className="text-xs text-error hover:text-red-700 focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none rounded">
                                                    {trans('delete')}
                                                </button>
                                            </div>
                                        )}
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
            </div>
        </AdminSidebar>
    )
}
