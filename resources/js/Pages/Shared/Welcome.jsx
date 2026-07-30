import { Head, usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    return (
        <>
            <Head title={`${trans('app_name')} - ${trans('brand_tagline')}`} />
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-bold text-[#1A1A1A]">{trans('app_name')}</h1>
                    <p className="text-[#6B6B6B] mt-2">{trans('brand_tagline')}</p>
                    {auth.user && (
                        <p className="text-[#CC0000] mt-4 font-semibold">
                            {trans('login_title')} {auth.user.name}
                        </p>
                    )}
                    <p className="text-sm text-[#6B6B6B] mt-8">
                        Laravel {laravelVersion} / PHP {phpVersion}
                    </p>
                </div>
            </div>
        </>
    )
}
