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

            <main className="flex-1 max-w-container mx-auto px-4 py-8 w-full">
                <h1 className="text-2xl font-bold text-secondary-950 mb-6">{trans('deals_page_title', {}, 'common')}</h1>

                {/* Search & Filters */}
                <section className="mb-8">
                    <SearchBar areas={areas} unitTypes={unitTypes} features={features} finishingTypes={finishingTypes} filters={filters} onSearch={handleSearch} />
                </section>

                {/* Deals Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <UnitCard key={i} loading={true} />
                        ))}
                    </div>
                ) : hasUnits ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {units.data.map(unit => (
                                <UnitCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                        <Pagination meta={units} links={units.links} />
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted text-sm">{trans('deals_page_empty', {}, 'common')}</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
