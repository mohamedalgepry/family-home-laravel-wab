import { usePage, Head } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminSidebar from '../../Components/Layout/AdminSidebar'

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            </div>
            <div>
                <p className="text-2xl font-bold text-secondary-950">{value ?? '—'}</p>
                <p className="text-xs text-muted">{label}</p>
            </div>
        </div>
    )
}

export default function Dashboard({ stats, topProjects, visitsChart }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const role = auth?.user?.role

    const rawStatsConfig = [
        { key: 'total_projects', label: trans('stats_total_projects'), icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z' },
        { key: 'total_units', label: trans('stats_total_units'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { key: 'total_users', label: trans('stats_total_users'), icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
        { key: 'total_messages', label: trans('stats_total_messages'), icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' },
    ]

    const statsConfig = role === 'agent' ? rawStatsConfig.filter(c => c.key !== 'total_users') : rawStatsConfig

    return (
        <AdminSidebar>
            <Head title={trans('dashboard_title') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('dashboard_title')}</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsConfig.map(cfg => (
                        <StatCard key={cfg.key} label={cfg.label} value={stats?.[cfg.key]} icon={cfg.icon} />
                    ))}
                </div>

                {/* Chart + Top Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Visits Chart */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h2 className="text-sm font-semibold text-secondary-950 mb-4">{trans('visits_chart')}</h2>
                        {visitsChart?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={visitsChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#CC0000" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_data')}</p>
                        )}
                    </div>

                    {/* Top Projects */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <h2 className="text-sm font-semibold text-secondary-950 mb-4">{trans('top_projects')}</h2>
                        {topProjects?.length > 0 ? (
                            <div className="space-y-3">
                                {topProjects.map((project, i) => (
                                    <div key={project.id} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted w-5">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-secondary-950 truncate">{project.name}</p>
                                            <p className="text-xs text-muted">{project.area?.name || ''}</p>
                                        </div>
                                        <span className="text-xs font-medium text-secondary-700">{project.views_count} {trans('views')}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_data')}</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminSidebar>
    )
}
