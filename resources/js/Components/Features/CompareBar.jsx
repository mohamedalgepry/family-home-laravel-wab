import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react';
import { useCompare } from '../../Hooks/useCompare';
import { useTrans } from '../../Utils/trans';

export default function CompareBar() {
    const { locale } = usePage().props;
    const trans = useTrans(locale);
    const isRtl = locale === 'ar';
    const { compareList: unitList, clearCompare: clearUnits } = useCompare('unit');
    const { compareList: projectList, clearCompare: clearProjects } = useCompare('project');

    const unitCount = unitList.length
    const projectCount = projectList.length
    const total = unitCount + projectCount

    if (total === 0) return null

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="fixed bottom-0 inset-x-0 z-50 p-3 pointer-events-none flex justify-center">
            <div className="bg-secondary-950 text-white rounded-2xl shadow-2xl pointer-events-auto px-4 py-3 flex items-center gap-4 sm:gap-6 max-w-2xl w-full border border-secondary-800 animate-fade-in">
                {/* Status */}
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5 rtl:space-x-reverse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-7 h-7 rounded-full border-2 border-secondary-950 flex items-center justify-center text-[10px] font-bold transition-colors ${i <= total ? 'bg-primary-900 text-white' : 'bg-secondary-800 text-secondary-500'}`}>
                                {i <= total ? i : '+'}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm leading-tight">
                        <span className="font-bold">{total}</span>
                        <span className="text-secondary-400 text-xs ms-1.5">
                            {unitCount > 0 && `${unitCount} ${trans('units')}`}
                            {unitCount > 0 && projectCount > 0 && ' + '}
                            {projectCount > 0 && `${projectCount} ${trans('projects')}`}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ms-auto">
                    <button
                        onClick={() => { clearUnits(); clearProjects() }}
                        className="p-1.5 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800"
                        title={trans('clear')}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <Link
                        href={localizedPath(unitCount > 0 ? `/compare?type=unit&ids=${unitList.join(',')}` : `/compare?type=project&ids=${projectList.join(',')}`, locale)}
                        className="px-3.5 py-1.5 bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
                    >
                        {trans('compare')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
