import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import Header from '../../Components/Layout/Header'
import Footer from '../../Components/Layout/Footer'
import SeoHead from '../../Components/UI/SeoHead'

export default function About({ page }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const content = locale === 'ar' ? page?.content_ar : page?.content_en
    const images = page?.images ?? []

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('about')} - ${trans('site_title')}`}
                description={trans('about_description')}
                ogImage={page?.images?.[0]}
                canonical={usePage().url}
            />
            <Header />

            <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
                <h1 className="text-3xl font-bold text-secondary-950 mb-8">{trans('about')}</h1>

                {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {images.map((img, i) => (
                            <img key={i} src={`/storage/${img}`} alt={trans('about_image')} width={800} height={400} className="w-full h-48 object-cover rounded-xl" loading="lazy" />
                        ))}
                    </div>
                )}

                {content ? (
                    <div className="prose prose-sm sm:prose-base max-w-none text-secondary-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    <p className="text-muted text-sm">{trans('no_data')}</p>
                )}
            </main>

            <Footer />
        </div>
    )
}
