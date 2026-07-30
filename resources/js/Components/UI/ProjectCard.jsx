import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useCompare } from '../../Hooks/useCompare'

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23F0F0F0" width="400" height="300"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%239A9A9A" font-size="14"%3E%3C/text%3E%3C/svg%3E'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="skeleton h-40 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-8 w-full rounded-lg" />
            </div>
        </div>
    )
}

export default function ProjectCard({ project, loading = false }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const { compareList, toggleCompare } = useCompare('project')

    if (loading) {
        return <SkeletonCard />
    }

    const mainImage = project?.images?.find(img => img.is_main || img.is_primary) || project?.images?.[0]
    const thumbnail = mainImage?.thumb_url || mainImage?.url || (mainImage?.path ? (mainImage.path.startsWith('http') || mainImage.path.startsWith('/') ? mainImage.path : `/storage/${mainImage.path}`) : PLACEHOLDER)
    const isCompared = compareList.includes(project?.id)

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-dropdown transition-shadow group">
            {/* Image */}
            <Link href={localizedPath(`/projects/${project.slug}`, locale)} className="block overflow-hidden">
                <img
                    src={thumbnail}
                    alt={project.alt_text || project.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    width="400"
                    height="300"
                />
            </Link>

            {/* Details */}
            <div className="p-4">
                <Link href={localizedPath(`/projects/${project.slug}`, locale)}>
                    <h3 className="text-sm font-semibold text-secondary-950 truncate mb-1 hover:text-primary-900 transition-colors">
                        {project.name}
                    </h3>
                </Link>

                <p className="text-xs text-muted mb-3">
                    {project.area?.name || project.area_name || ''}
                </p>

                <p className="text-xs text-muted mb-3">
                    <span className="font-medium text-secondary-800">{project.units_count ?? project.units?.length ?? 0}</span>
                    {' '}{trans('units_count')}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-secondary-100">
                    <button
                        onClick={e => { e.preventDefault(); toggleCompare(project.id); }}
                        className={`flex items-center gap-1 text-xs transition-colors ${isCompared ? 'text-primary-900 font-bold' : 'text-muted hover:text-primary-900'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {trans('compare')}
                    </button>
                    <Link
                        href={localizedPath(`/projects/${project.slug}`, locale)}
                        className="text-xs text-primary-900 hover:text-primary-950 font-medium ms-auto"
                    >
                        {trans('show_more')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
