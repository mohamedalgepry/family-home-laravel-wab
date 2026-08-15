import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import { useCompare } from '../../Hooks/useCompare'
import OptimizedImage from '../OptimizedImage'
import { getStorageUrl, PLACEHOLDER } from '../../Utils/image'

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

export default function ProjectCard({ project, loading = false }) {
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
    const thumbnail = getStorageUrl(mainImage?.thumb_url || mainImage?.url || mainImage?.path, PLACEHOLDER)
    const isCompared = compareList.includes(project?.id)

    const areaName = project.area?.name || project.area_name || (isRtl ? 'مصر' : 'Egypt')
    const imageAlt = project.alt_text || `${project.name || (isRtl ? 'مشروع عقاري' : 'Project')} ${isRtl ? 'في' : 'in'} ${areaName} - ${trans('app_name')}`
    const unitsCount = project.units_count ?? project.units?.length ?? 0

    return (
        <article 
            dir={isRtl ? 'rtl' : 'ltr'} 
            className="bg-white rounded-2xl shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group border border-secondary-100/80 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/3] bg-secondary-100">
                <Link 
                    href={localizedPath(`/projects/${project.slug || project.id}`, locale)} 
                    className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                    <OptimizedImage
                        src={thumbnail}
                        alt={imageAlt}
                        width={480}
                        height={360}
                        lazy={true}
                        fallbackSrc={PLACEHOLDER}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                </Link>

                {/* Top Badge Overlay */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="bg-white/95 text-secondary-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/40">
                        {areaName}
                    </span>

                    {project.payment_method && (
                        <span className="bg-secondary-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md">
                            {project.payment_method === 'cash' 
                                ? (isRtl ? 'كاش' : 'Cash') 
                                : project.payment_method === 'installment' 
                                ? (isRtl ? 'تقسيط' : 'Installment') 
                                : (isRtl ? 'كاش وتقسيط' : 'Cash & Installment')}
                        </span>
                    )}
                </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                    <Link 
                        href={localizedPath(`/projects/${project.slug || project.id}`, locale)} 
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                        <h2 className="text-base font-bold text-secondary-950 group-hover:text-primary-900 transition-colors line-clamp-1 mb-1.5">
                            {project.name}
                        </h2>
                    </Link>

                    {project.description && (
                        <p className="text-xs text-secondary-500 line-clamp-2 leading-relaxed mb-3 font-medium">
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
                        className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all duration-200 font-semibold ${
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
                        href={localizedPath(`/projects/${project.slug || project.id}`, locale)}
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
