import { usePage, router } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import Header from '../../../Components/Layout/Header'
import Footer from '../../../Components/Layout/Footer'
import SearchBar from '../../../Components/UI/SearchBar'
import UnitCard from '../../../Components/UI/UnitCard'
import Pagination from '../../../Components/UI/Pagination'
import SeoHead from '../../../Components/UI/SeoHead'

const FILTER_KEYS = ['area_id', 'type_id', 'transaction', 'price_min', 'price_max', 'size_min', 'size_max', 'search', 'payment_method', 'finishing_type_id', 'features']

const SORT_OPTIONS = [
    { value: '', labelKey: 'sort_featured' },
    { value: 'newest', labelKey: 'sort_newest' },
    { value: 'price_asc', labelKey: 'sort_price_low' },
    { value: 'price_desc', labelKey: 'sort_price_high' },
    { value: 'size_desc', labelKey: 'sort_size_high' },
]

export default function UnitsIndex({ units, filters, areas, unitTypes, features, finishingTypes, seo_meta }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const isLoading = !units
    const hasUnits = units?.data?.length > 0
    // PHP serialises an empty filter list as [], and [].sort is Array.prototype.sort.
    const activeFilters = Array.isArray(filters) ? {} : (filters || {})
    const activeSort = SORT_OPTIONS.some(option => option.value === activeFilters.sort) ? activeFilters.sort : ''

    function handleSearch(params) {
        router.get(`/${locale}/units`, params, { preserveState: true })
    }

    const unitTotal = units?.meta?.total || units?.total || units?.data?.length || 0

    function handleSort(sort) {
        const params = {}
        FILTER_KEYS.forEach(key => {
            const value = activeFilters[key]
            if (value === '' || value === null || value === undefined) return
            if (Array.isArray(value) && value.length === 0) return
            params[key] = value
        })
        if (sort) params.sort = sort

        router.get(`/${locale}/units`, params, { preserveState: true, preserveScroll: true })
    }

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-surface flex flex-col">
            <SeoHead
                title={seo_meta?.title || `${trans('page_title')} - ${trans('site_title')}`}
                description={seo_meta?.description || trans('page_description')}
                canonical={seo_meta?.canonical}
                keywords={seo_meta?.keywords}
                jsonLd={seo_meta?.schema}
                robots={seo_meta?.robots}
                geoRegion={seo_meta?.geo_region}
                geoPlacename={seo_meta?.geo_placename}
            />
            <Header />

            <main id="main-content" tabIndex="-1" className="flex-1 w-full flex flex-col focus:outline-none">

                {/* Premium Header Area */}
                <div className="bg-gradient-to-b from-surface-hover to-surface pt-8 pb-10 px-4">
                    <div className="max-w-container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-secondary-950 tracking-tight mb-2">
                                    {trans('page_title', {}, 'units')}
                                </h1>
                                <p className="text-sm font-medium text-secondary-500">
                                    {hasUnits ? (
                                        locale === 'ar' ? `تم العثور على ${units.meta?.total || units.total || units.data?.length} وحدة` : `Found ${units.meta?.total || units.total || units.data?.length} units`
                                    ) : (
                                        locale === 'ar' ? 'ابحث عن وحدتك المناسبة' : 'Find your perfect unit'
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

                    {/* Units Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <UnitCard key={i} loading={true} />
                            ))}
                        </div>
                    ) : hasUnits ? (
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <p className="text-sm font-medium text-secondary-500">
                                    {locale === 'ar' ? `عرض ${unitTotal} وحدة` : `Showing ${unitTotal} units`}
                                </p>
                                <label className="flex items-center gap-2 text-sm font-semibold text-secondary-700">
                                    <span>{trans('sort_by')}</span>
                                    <select
                                        value={activeSort}
                                        onChange={event => handleSort(event.target.value)}
                                        aria-label={trans('sort_by')}
                                        className="rounded-xl border border-secondary-200 bg-white px-3 py-2 text-sm font-semibold text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                                    >
                                        {SORT_OPTIONS.map(option => (
                                            <option key={option.value || 'featured'} value={option.value}>{trans(option.labelKey)}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {units.data.map((unit, i) => (
                                    <UnitCard key={unit.id} unit={unit} priority={i === 0} />
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
                            <p className="text-secondary-900 font-bold text-lg mb-2">{trans('no_results')}</p>
                            <p className="text-secondary-500 text-sm">{trans('try_different_filters')}</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
