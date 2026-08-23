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
            />
            <Header />

            <main id="main-content" tabIndex="-1" className="flex-1 max-w-4xl mx-auto px-4 py-12 sm:py-20 w-full focus:outline-none">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-black text-secondary-950 tracking-tight">{trans('about')}</h1>
                    <div className="w-20 h-1.5 bg-primary-900 rounded-full mx-auto mt-6"></div>
                </div>

                {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        {images.map((img, i) => (
                            <div key={i} className="rounded-3xl overflow-hidden border border-secondary-100 shadow-sm relative group">
                                <img src={`/storage/${img}`} alt={trans('about_image')} width={800} height={400} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-[2rem] shadow-sm border border-secondary-100 p-8 sm:p-12">
                    {content ? (
                        <div className="prose prose-base sm:prose-lg max-w-none text-secondary-800 leading-loose prose-headings:font-black prose-headings:text-secondary-950 prose-a:text-primary-900 prose-a:font-bold prose-img:rounded-3xl" dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-secondary-500 text-sm font-medium">{trans('no_data')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
