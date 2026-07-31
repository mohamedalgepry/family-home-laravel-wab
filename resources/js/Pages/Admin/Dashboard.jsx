import { usePage, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AdminSidebar from '../../Components/Layout/AdminSidebar'

function StatCard({ title, value, subtext, icon, color = 'primary', badge }) {
    const colorClasses = {
        primary: 'bg-primary-50 text-primary-900 border-primary-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
    }

    return (
        <div className="bg-white rounded-2xl p-5 border border-secondary-100 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses[color] || colorClasses.primary}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                </div>
                {badge && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                        {badge}
                    </span>
                )}
            </div>
            <div>
                <p className="text-3xl font-black text-secondary-950 tracking-tight">{value ?? 0}</p>
                <h3 className="text-sm font-semibold text-secondary-700 mt-1">{title}</h3>
                {subtext && <p className="text-xs text-muted mt-1 font-medium">{subtext}</p>}
            </div>
        </div>
    )
}

function CustomTooltip({ active, payload, label, locale, isRtl }) {
    if (!active || !payload || !payload.length) return null

    const date = new Date(label)
    const formattedDate = isNaN(date.getTime())
        ? label
        : date.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })

    const count = payload[0].value

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-secondary-950 text-white p-3.5 rounded-2xl shadow-2xl border border-secondary-800 backdrop-blur-md">
            <p className="text-[11px] text-secondary-400 font-semibold mb-1">{formattedDate}</p>
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span>
                <span className="text-sm font-bold text-white">
                    {count} {isRtl ? 'زيارة' : 'visits'}
                </span>
            </div>
        </div>
    )
}

export default function Dashboard({ stats, topProjects, recentUnits, recentMessages, visitsChart = [] }) {
    const { locale, auth } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const pendingMessagesCount = stats?.pending_messages || 0

    // Range selector: 7, 14, or 30 days
    const [rangeDays, setRangeDays] = useState(30)

    const filteredChartData = useMemo(() => {
        if (!visitsChart || visitsChart.length === 0) return []
        return visitsChart.slice(-rangeDays)
    }, [visitsChart, rangeDays])

    // Summary calculations
    const chartSummary = useMemo(() => {
        if (!filteredChartData || filteredChartData.length === 0) {
            return { total: 0, avg: 0, max: { count: 0, date: '' } }
        }
        const total = filteredChartData.reduce((acc, curr) => acc + (curr.count || 0), 0)
        const avg = (total / filteredChartData.length).toFixed(1)
        const max = filteredChartData.reduce((maxObj, curr) => (curr.count > maxObj.count ? curr : maxObj), { count: 0, date: '' })

        return { total, avg, max }
    }, [filteredChartData])

    function formatXAxisTick(dateStr) {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return dateStr
        return date.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })
    }

    return (
        <AdminSidebar>
            <Head title={trans('dashboard_title') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
                
                {/* Header Title */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-secondary-950">{trans('dashboard_title')}</h1>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title={isRtl ? 'إجمالي الوحدات' : 'Total Units'}
                        value={stats?.total_units}
                        subtext={isRtl ? `بيع: ${stats?.sale_units || 0} | إيجار: ${stats?.rent_units || 0}` : `Sale: ${stats?.sale_units || 0} | Rent: ${stats?.rent_units || 0}`}
                        color="primary"
                        icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />

                    <StatCard
                        title={isRtl ? 'المشاريع العقارية' : 'Total Projects'}
                        value={stats?.total_projects}
                        subtext={isRtl ? 'كمبوندات ومشاريع مميزة' : 'Compounds & Major Projects'}
                        color="blue"
                        icon="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
                    />

                    <StatCard
                        title={isRtl ? 'إجمالي المشاهدات' : 'Total Views'}
                        value={stats?.total_views}
                        subtext={isRtl ? 'إجمالي زيارات الوحدات والمشاريع' : 'Combined views across listings'}
                        color="emerald"
                        icon="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />

                    <StatCard
                        title={isRtl ? 'استفسارات العملاء' : 'Customer Messages'}
                        value={stats?.total_messages}
                        subtext={isRtl ? `معلق: ${pendingMessagesCount}` : `Pending: ${pendingMessagesCount}`}
                        color="amber"
                        badge={pendingMessagesCount > 0 ? (isRtl ? `${pendingMessagesCount} معلق` : `${pendingMessagesCount} pending`) : null}
                        icon="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                </div>

                {/* Visits Chart & Top Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-secondary-100 shadow-card p-6 flex flex-col justify-between">
                        <div>
                            {/* Chart Top Bar & Range Filters */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-base font-bold text-secondary-950">
                                        {isRtl ? 'إحصائيات حركة الزيارات' : 'Website Traffic Analytics'}
                                    </h2>
                                    <p className="text-xs text-muted mt-0.5">
                                        {isRtl ? `معدل الزيارات في آخر ${rangeDays} يوماً` : `Traffic pattern over last ${rangeDays} days`}
                                    </p>
                                </div>

                                {/* Range Buttons */}
                                <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-secondary-200/60 shrink-0">
                                    {[
                                        { days: 7, label: isRtl ? '7 أيام' : '7 Days' },
                                        { days: 14, label: isRtl ? '14 يوم' : '14 Days' },
                                        { days: 30, label: isRtl ? '30 يوم' : '30 Days' },
                                    ].map(item => (
                                        <button
                                            key={item.days}
                                            type="button"
                                            onClick={() => setRangeDays(item.days)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                rangeDays === item.days
                                                    ? 'bg-primary-900 text-white shadow-sm'
                                                    : 'text-secondary-600 hover:text-secondary-950 hover:bg-white/60'
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Chips */}
                            <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-surface/60 rounded-xl border border-secondary-100 text-center">
                                <div>
                                    <p className="text-[11px] text-muted font-medium">{isRtl ? 'إجمالي زيارات الفترة' : 'Period Total'}</p>
                                    <p className="text-sm font-black text-secondary-950 mt-0.5">{chartSummary.total}</p>
                                </div>
                                <div className="border-x border-secondary-200/60">
                                    <p className="text-[11px] text-muted font-medium">{isRtl ? 'المتوسط اليومي' : 'Daily Avg'}</p>
                                    <p className="text-sm font-black text-primary-900 mt-0.5">{chartSummary.avg}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-muted font-medium">{isRtl ? 'أعلى زيارة يومية' : 'Peak Day'}</p>
                                    <p className="text-sm font-black text-emerald-600 mt-0.5">
                                        {chartSummary.max.count}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {filteredChartData?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#CC0000" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#CC0000" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: '#64748B' }}
                                        tickFormatter={formatXAxisTick}
                                        interval={rangeDays === 30 ? 4 : (rangeDays === 14 ? 1 : 0)}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 11, fill: '#64748B' }}
                                    />
                                    <Tooltip content={<CustomTooltip locale={locale} isRtl={isRtl} />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#CC0000"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVisits)"
                                        activeDot={{ r: 6, fill: '#CC0000', stroke: '#FFF', strokeWidth: 3 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-sm text-muted text-center py-16">{trans('no_data')}</p>
                        )}
                    </div>

                    {/* Top Viewed Projects */}
                    <div className="bg-white rounded-2xl border border-secondary-100 shadow-card p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-secondary-950">
                                    {isRtl ? 'المشاريع الأكثر مشاهدة' : 'Top Projects'}
                                </h2>
                                <Link href="/admin/projects" className="text-xs text-primary-900 font-bold hover:underline">
                                    {isRtl ? 'عرض الكل' : 'View All'}
                                </Link>
                            </div>

                            {topProjects?.length > 0 ? (
                                <div className="space-y-4">
                                    {topProjects.map((project, i) => {
                                        const projName = isRtl ? (project.name_ar || project.name) : (project.name_en || project.name)
                                        return (
                                            <div key={project.id} className="flex items-center gap-3">
                                                <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-surface text-secondary-600'}`}>
                                                    #{i + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-secondary-950 truncate">{projName}</p>
                                                    <p className="text-[11px] text-muted truncate">{project.area?.name_ar || project.area?.name_en || '—'}</p>
                                                </div>
                                                <span className="text-xs font-bold text-primary-900 bg-primary-50 px-2 py-1 rounded-lg shrink-0">
                                                    {project.views_count} {isRtl ? 'زيارة' : 'views'}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted text-center py-12">{trans('no_data')}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Recent Units & Recent Inquiries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Recent Units */}
                    <div className="bg-white rounded-2xl border border-secondary-100 shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-secondary-950">
                                {isRtl ? 'أحدث العقارات المضافة' : 'Recently Added Units'}
                            </h2>
                            <Link href="/admin/units" className="text-xs text-primary-900 font-bold hover:underline">
                                {isRtl ? 'إدارة العقارات' : 'Manage Units'}
                            </Link>
                        </div>

                        {recentUnits?.length > 0 ? (
                            <div className="divide-y divide-secondary-100">
                                {recentUnits.map(unit => {
                                    const unitName = isRtl ? (unit.name_ar || unit.name_en) : (unit.name_en || unit.name_ar)
                                    const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null)
                                    return (
                                        <div key={unit.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {thumb ? (
                                                    <img src={thumb} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-secondary-200" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-surface border border-secondary-200 shrink-0 flex items-center justify-center text-secondary-400">
                                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-secondary-950 truncate">{unitName}</p>
                                                    <p className="text-[11px] text-muted mt-0.5">
                                                        {unit.price ? Number(unit.price).toLocaleString() + ' EGP' : '—'} • {unit.area?.name_ar || unit.area?.name_en || ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/admin/units/${unit.id}/edit`}
                                                className="px-3 py-1.5 text-xs font-semibold bg-surface hover:bg-secondary-200 text-secondary-800 rounded-lg transition-colors shrink-0"
                                            >
                                                {isRtl ? 'تعديل' : 'Edit'}
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-muted text-center py-8">{trans('no_data')}</p>
                        )}
                    </div>

                    {/* Recent Inquiries */}
                    <div className="bg-white rounded-2xl border border-secondary-100 shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-secondary-950">
                                {isRtl ? 'أحدث الرسائل والاستفسارات' : 'Recent Inquiries'}
                            </h2>
                            <Link href="/admin/messages" className="text-xs text-primary-900 font-bold hover:underline">
                                {isRtl ? 'عرض الرسائل' : 'View Messages'}
                            </Link>
                        </div>

                        {recentMessages?.length > 0 ? (
                            <div className="divide-y divide-secondary-100">
                                {recentMessages.map(msg => (
                                    <div key={msg.id} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-secondary-950 truncate">{msg.client_name}</p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${msg.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {msg.status === 'replied' ? (isRtl ? 'تم الرد' : 'Replied') : (isRtl ? 'معلق' : 'Pending')}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-secondary-600 mt-1 truncate">{msg.content || msg.client_phone}</p>
                                            {msg.unit && (
                                                <p className="text-[10px] text-primary-900 font-medium mt-0.5 truncate">
                                                    📌 {isRtl ? msg.unit.name_ar : msg.unit.name_en}
                                                </p>
                                            )}
                                        </div>
                                        <a
                                            href={`https://wa.me/${msg.client_phone?.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1"
                                        >
                                            WhatsApp
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted text-center py-8">{trans('no_data')}</p>
                        )}
                    </div>

                </div>

            </div>
        </AdminSidebar>
    )
}
