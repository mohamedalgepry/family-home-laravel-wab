import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SearchBar from '../../../Components/UI/SearchBar'
import UnitCard from '../../../Components/UI/UnitCard'
import Pagination from '../../../Components/UI/Pagination'
import SeoHead from '../../../Components/UI/SeoHead'

export default function UnitsDeals({ units, filters, areas, unitTypes, features, finishingTypes }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isLoading = !units
    const hasUnits = units?.data?.length > 0

    function handleSearch(params) {
        router.get(`/${locale}/units/deals`, params, { preserveState: true })
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={`${trans('deals_page_title')} - ${trans('site_title')}`}
                description={trans('deals_description')}
                canonical={typeof window !== 'undefined' ? window.location.href : ''}
            />
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Premium Header Area */}
                <div className="bg-gradient-to-b from-surface-hover to-surface pt-8 pb-10 px-4">
                    <div className="max-w-container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-secondary-950 tracking-tight mb-2">
                                    {trans('deals_page_title', {}, 'common')}
                                </h1>
                                <p className="text-sm font-medium text-secondary-500">
                                    {hasUnits ? (
                                        locale === 'ar' ? `تم العثور على ${units.meta?.total || units.total || units.data?.length} صفقة` : `Found ${units.meta?.total || units.total || units.data?.length} deals`
                                    ) : (
                                        locale === 'ar' ? 'تصفح أحدث وأفضل العروض والصفقات العقارية' : 'Discover the latest and best real estate deals'
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="w-full relative z-30">
                            <SearchBar areas={areas} unitTypes={unitTypes} features={features} finishingTypes={finishingTypes} filters={filters} onSearch={handleSearch} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                    {/* Deals Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <UnitCard key={i} loading={true} />
                            ))}
                        </div>
                    ) : hasUnits ? (
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {units.data.map(unit => (
                                    <UnitCard key={unit.id} unit={unit} />
                                ))}
                            </div>
                            <Pagination meta={units.meta || units} links={units.links} />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[2rem] border border-secondary-100 shadow-sm max-w-2xl mx-auto w-full">
                            <div className="w-16 h-16 bg-surface-hover text-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            <p className="text-secondary-900 font-bold text-lg mb-2">{trans('deals_page_empty', {}, 'common')}</p>
                            <p className="text-secondary-500 text-sm">{trans('try_different_filters')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
