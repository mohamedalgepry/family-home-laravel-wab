import { usePage, Head, Link } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import AreaForm from './AreaForm'

export default function AdminAreasEdit({ area, parents }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    return (
        <AdminSidebar>
            <Head title={trans('edit_area') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                
                <div className="mb-8">
                    <Link href="/admin/areas" className="text-secondary-500 hover:text-[#CC0000] text-sm font-bold flex items-center gap-2 mb-4 w-fit transition-colors">
                        <svg className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {trans('back_to_areas')}
                    </Link>
                    <h1 className="text-3xl font-black text-secondary-950 mb-1">
                        {trans('edit_area')}: {isRtl ? area.name_ar : area.name_en}
                    </h1>
                </div>

                <AreaForm area={area} parents={parents} mode="edit" />
            </div>
        </AdminSidebar>
    )
}
