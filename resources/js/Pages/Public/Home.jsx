import { localizedPath } from '../../Utils/route'
import { usePage, Link } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'
import Header from '../../Components/Layout/Header'
import Footer from '../../Components/Layout/Footer'
import SearchBar from '../../Components/UI/SearchBar'
import UnitCard from '../../Components/UI/UnitCard'
import Pagination from '../../Components/UI/Pagination'
import SeoHead from '../../Components/UI/SeoHead'

const HERO_BG = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600&q=80'

export default function Home({ featuredUnits, latestUnits, popularSearches, areas, unitTypes, features, finishingTypes }) {
    const { locale, settings } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const heroTitle = isRtl ? (settings?.hero_title_ar || trans('hero_title')) : (settings?.hero_title_en || trans('hero_title'))
    const heroSubtitle = isRtl ? (settings?.hero_subtitle_ar || trans('hero_subtitle')) : (settings?.hero_subtitle_en || trans('hero_subtitle'))
    const heroImage = settings?.hero_image ? `/storage/${settings.hero_image}` : HERO_BG

    const isLoading = !featuredUnits && !latestUnits
    const hasFeatured = featuredUnits?.data?.length > 0
    const hasLatest = latestUnits?.data?.length > 0

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={trans('site_title')}
                description={trans('home_description')}
                ogImage={featuredUnits?.data?.[0]?.images?.[0]?.url || (featuredUnits?.data?.[0]?.images?.[0]?.path ? `/storage/${featuredUnits.data[0].images[0].path}` : null)}
                canonical={window.location.href}
            />
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-secondary-950 flex flex-col justify-center min-h-[75vh]">
                    <div className="absolute inset-0 overflow-hidden">
                        <img src={heroImage} alt="" className="w-full h-full object-cover" fetchPriority="high" />
                        <div className="absolute inset-0 bg-secondary-950/60"></div>
                    </div>
                    <div className="relative z-20 max-w-container mx-auto px-4 py-24 sm:py-32 text-center w-full">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                            {heroTitle}
                        </h1>
                        <p className="text-lg sm:text-xl text-secondary-200 mb-10 max-w-2xl mx-auto font-medium">
                            {heroSubtitle}
                        </p>
                        <div className="max-w-4xl mx-auto">
                            <SearchBar areas={areas} unitTypes={unitTypes} features={features} finishingTypes={finishingTypes} />
                        </div>
                    </div>
                </section>

                {/* Popular Searches */}
                {popularSearches?.length > 0 && (
                    <section className="max-w-container mx-auto px-4 py-8">
                        <h2 className="text-sm font-semibold text-secondary-950 mb-3">{trans('popular_searches')}</h2>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map(ps => (
                                <Link
                                    key={ps.keyword}
                                    href={localizedPath(`/units?search=${encodeURIComponent(ps.keyword)}`, locale)}
                                    className="px-3 py-1.5 bg-white text-sm text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 transition-colors"
                                >
                                    {ps.keyword}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Units */}
                <section className="max-w-container mx-auto px-4 pb-8">
                    <h2 className="text-xl font-bold text-secondary-950 mb-6">{trans('featured_units')}</h2>
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <UnitCard key={i} loading={true} />
                            ))}
                        </div>
                    ) : hasFeatured ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {featuredUnits.data.map(unit => (
                                    <UnitCard key={unit.id} unit={unit} />
                                ))}
                            </div>
                            <Pagination meta={featuredUnits} links={featuredUnits.links} />
                        </>
                    ) : (
                        <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                    )}
                </section>

                {/* Latest Units */}
                <section className="bg-white py-8">
                    <div className="max-w-container mx-auto px-4">
                        <h2 className="text-xl font-bold text-secondary-950 mb-6">{trans('latest_units')}</h2>
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <UnitCard key={i} loading={true} />
                                ))}
                            </div>
                        ) : hasLatest ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {latestUnits.data.map(unit => (
                                        <UnitCard key={unit.id} unit={unit} />
                                    ))}
                                </div>
                                <Pagination meta={latestUnits} links={latestUnits.links} />
                            </>
                        ) : (
                            <p className="text-sm text-muted text-center py-12">{trans('no_results')}</p>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
