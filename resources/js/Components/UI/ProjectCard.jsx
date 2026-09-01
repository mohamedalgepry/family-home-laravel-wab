import { memo } from 'react'
import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useCompare } from '../../Hooks/useCompare'
import OptimizedImage from '../OptimizedImage'
import { getStorageUrl, getThumbUrl, PLACEHOLDER } from '../../Utils/image'

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100 animate-pulse">
            <div className="skeleton h-52 w-full bg-secondary-100" />
            <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-md bg-secondary-100" />
                <div className="skeleton h-4 w-1/2 rounded bg-secondary-100" />
                <div className="pt-3 border-t border-secondary-100 flex items-center justify-between">
                    <div className="skeleton h-7 w-20 rounded-lg bg-secondary-100" />
                    <div className="skeleton h-7 w-24 rounded-lg bg-secondary-100" />
                </div>
            </div>
        </div>
    )
}

function ProjectCard({ project, loading = false, priority = false }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const { compareList, toggleCompare } = useCompare('project')

    if (loading) {
        return <SkeletonCard />
    }

    if (!project) {
        return null;
    }

    const mainImage = project?.images?.find(img => img.is_main || img.is_primary) || project?.images?.[0]
    const thumbnail = getThumbUrl(mainImage?.thumb_url || mainImage?.url || mainImage?.path, PLACEHOLDER)
    const originalUrl = getStorageUrl(mainImage?.url || mainImage?.path, null)
    const srcSet = originalUrl && thumbnail && originalUrl !== thumbnail 
        ? `${thumbnail} 400w, ${originalUrl} 800w` 
        : undefined
    const isCompared = compareList.includes(project?.id)

    const areaName = project.area?.name || project.area_name || (isRtl ? 'مصر' : 'Egypt')
    const imageAlt = project.alt_text || `${project.name || (isRtl ? 'مشروع عقاري' : 'Project')} ${isRtl ? 'في' : 'in'} ${areaName} - ${trans('app_name')}`
    const unitsCount = project.units_count ?? project.units?.length ?? 0
    const projectSlug = isRtl && project.slug_ar ? project.slug_ar : (project.slug_en || project.slug || project.id)

    return (
        <article 
            dir={isRtl ? 'rtl' : 'ltr'} 
            className="bg-white rounded-2xl shadow-card hover:shadow-2xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 overflow-hidden group border border-secondary-100/80 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/3] bg-secondary-100">
                <Link 
                    href={localizedPath(`/projects/${projectSlug}`, locale)} 
                    className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                    <OptimizedImage
                        src={thumbnail}
                        srcSet={srcSet}
                        alt={imageAlt}
                        width={480}
                        height={360}
                        lazy={!priority}
                        fallbackSrc={PLACEHOLDER}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                </Link>

                {/* Top Badge Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="bg-white/95 text-secondary-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/40">
                        {trans('project')}
                    </span>

                    {/* Compare Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleCompare(project.id);
                        }}
                        className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                            isCompared 
                                ? 'bg-primary-900 text-white' 
                                : 'bg-white/90 text-secondary-700 hover:bg-white hover:text-primary-900'
                        }`}
                        title={isCompared ? (trans('remove_from_compare') || 'إزالة من المقارنة') : (trans('add_to_compare') || 'إضافة للمقارنة')}
                    >
                        <svg className="w-4 h-4" fill={isCompared ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 18h12l3-18H3zm5 4v10m4-10v10m4-10v10" />
                        </svg>
                    </button>
                </div>

                {/* Area Tag */}
                {project.area?.name && (
                    <span className="absolute bottom-3 start-3 text-white text-xs font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {project.area.name}
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <Link 
                        href={localizedPath(`/projects/${projectSlug}`, locale)} 
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                        <h2 className="text-base font-bold text-secondary-950 group-hover:text-primary-900 transition-colors line-clamp-1 mb-1.5">
                            {project.name}
                        </h2>
                    </Link>

                    {project.description && (
                        <p className="text-xs text-secondary-600 line-clamp-2 leading-relaxed mb-3 font-medium">
                            {project.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="bg-primary-50 text-primary-900 px-2.5 py-1 rounded-lg font-bold">
                            {unitsCount} {trans('units_count') || (isRtl ? 'وحدة متاحة' : 'Units')}
                        </span>

                        {project.installment_years > 0 && (
                            <span className="bg-secondary-100/70 text-secondary-800 px-2.5 py-1 rounded-lg font-semibold">
                                {isRtl ? `تقسيط حتى ${project.installment_years} سنوات` : `Up to ${project.installment_years} yrs installment`}
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-secondary-100/70 mt-auto">
                    <button
                        onClick={e => { e.preventDefault(); toggleCompare(project.id); }}
                        className={`text-xs px-3.5 py-1.5 rounded-xl border transition-colors duration-200 font-semibold ${
                            isCompared 
                                ? 'bg-primary-900 text-white border-primary-900 shadow-sm' 
                                : 'bg-secondary-50 text-secondary-700 border-secondary-200 hover:border-primary-900 hover:text-primary-900 hover:bg-white'
                        }`}
                        aria-label={`${trans('compare')} ${project.name}`}
                        aria-pressed={isCompared}
                    >
                        {isCompared ? (isRtl ? 'تمت الإضافة' : 'Added') : trans('compare')}
                    </button>

                    <Link
                        href={localizedPath(`/projects/${projectSlug}`, locale)}
                        className="text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1 group/link transition-colors"
                    >
                        <span>{trans('show_more') || (isRtl ? 'التفاصيل' : 'Details')}</span>
                        <svg className="w-3.5 h-3.5 rtl:rotate-180 group-hover/link:translate-x-0.5 rtl:group-hover/link:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default memo(ProjectCard)
