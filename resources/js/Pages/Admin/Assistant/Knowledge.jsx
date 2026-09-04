import { usePage, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'

export default function AssistantKnowledgeIndex({ items = [], stats = {}, filters = {} }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    const [search, setSearch] = useState(filters.search || '')
    const [selectedLocale, setSelectedLocale] = useState(filters.locale || '')
    const [selectedType, setSelectedType] = useState(filters.type || 'all')

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        question: '',
        reply: '',
        locale: 'ar',
        keywords: '',
        quick_replies: '',
        is_active: true,
        is_hot_lead: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleSearch(e) {
        e.preventDefault()
        router.get('/admin/assistant-knowledge', {
            search,
            locale: selectedLocale || undefined,
            type: selectedType !== 'all' ? selectedType : undefined,
        }, { preserveState: true, preserveScroll: true })
    }

    function openAddModal() {
        setEditingItem(null)
        setFormData({
            question: '',
            reply: '',
            locale: 'ar',
            keywords: '',
            quick_replies: '',
            is_active: true,
            is_hot_lead: false,
        })
        setIsModalOpen(true)
    }

    function openEditModal(item) {
        setEditingItem(item)
        setFormData({
            question: item.question,
            reply: item.reply,
            locale: item.locale || 'ar',
            keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : (item.keywords || ''),
            quick_replies: Array.isArray(item.quick_replies) ? item.quick_replies.join(', ') : (item.quick_replies || ''),
            is_active: item.is_active !== false,
            is_hot_lead: item.is_hot_lead || false,
        })
        setIsModalOpen(true)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setIsSubmitting(true)

        if (editingItem) {
            router.put(`/admin/assistant-knowledge/${editingItem.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setIsSubmitting(false)
                },
                onError: () => setIsSubmitting(false),
            })
        } else {
            router.post('/admin/assistant-knowledge', formData, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setIsSubmitting(false)
                },
                onError: () => setIsSubmitting(false),
            })
        }
    }

    function toggleActive(id) {
        router.post(`/admin/assistant-knowledge/${id}/toggle`, {}, { preserveScroll: true })
    }

    function deleteItem(id) {
        if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا الرد من بنك المعرفة؟' : 'Are you sure you want to delete this response?')) return
        router.delete(`/admin/assistant-knowledge/${id}`, { preserveScroll: true })
    }

    function clearCache() {
        router.post('/admin/assistant-knowledge/clear-cache', {}, { preserveScroll: true })
    }

    return (
        <AdminSidebar>
            <Head title={isRtl ? 'إدارة بنك معرفة المساعد الذكي — فاميلي هوم' : 'AI Knowledge Base — Family Home'} />

            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-950 flex items-center gap-2">
                            <span>🧠</span>
                            <span>{isRtl ? 'بنك معرفة المساعد الذكي (حسام)' : 'Hossam AI Knowledge Base'}</span>
                        </h1>
                        <p className="text-sm text-secondary-600 mt-1">
                            {isRtl
                                ? 'إدارة الأسئلة الشائعة والردود الجاهزة والردود المتعلمة ذاتياً للرد الفوري (< 5ms) بدون استهلاك API.'
                                : 'Manage canned FAQs, custom Q&As, and self-learned responses for sub-5ms instant replies.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={clearCache}
                            className="px-3 py-2 text-xs font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors shadow-xs"
                            title={isRtl ? 'تحديث كاش المعرفة فوراً' : 'Refresh Cache'}
                        >
                            🔄 {isRtl ? 'تحديث الكاش' : 'Refresh Cache'}
                        </button>
                        <button
                            type="button"
                            onClick={openAddModal}
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
                        >
                            <span>+</span>
                            <span>{isRtl ? 'إضافة رد جاهز جديد' : 'Add New Q&A'}</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-xs border border-secondary-100">
                        <p className="text-xs font-medium text-secondary-500">{isRtl ? 'إجمالي بنك المعرفة' : 'Total Q&As'}</p>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.total_items || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-xs border border-secondary-100">
                        <p className="text-xs font-medium text-primary-600">{isRtl ? 'ردود معتمدة يدوياً' : 'Custom Verified'}</p>
                        <p className="text-2xl font-bold text-primary-700 mt-1">{stats.custom_count || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-xs border border-secondary-100">
                        <p className="text-xs font-medium text-emerald-600">{isRtl ? 'تعلم ذاتي ذكي' : 'Self-Learned'}</p>
                        <p className="text-2xl font-bold text-emerald-700 mt-1">{stats.learned_count || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-xs border border-secondary-100">
                        <p className="text-xs font-medium text-amber-600">{isRtl ? 'إجمالي الردود الفورية' : 'Instant Hits'}</p>
                        <p className="text-2xl font-bold text-amber-700 mt-1">{stats.total_hits || 0}</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-xs border border-secondary-100 mb-6 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[240px]">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder={isRtl ? 'ابحث في الأسئلة أو الأجوبة أو الكلمات المفتاحية...' : 'Search questions, answers, or keywords...'}
                            className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                    </div>

                    <select
                        value={selectedLocale}
                        onChange={e => setSelectedLocale(e.target.value)}
                        className="px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        <option value="">{isRtl ? 'كل اللغات' : 'All Languages'}</option>
                        <option value="ar">العربية (Arabic)</option>
                        <option value="en">English</option>
                    </select>

                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value)}
                        className="px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                        <option value="all">{isRtl ? 'كل الأنواع' : 'All Types'}</option>
                        <option value="custom">{isRtl ? 'المعتمد يدوياً فقط' : 'Custom Only'}</option>
                        <option value="learned">{isRtl ? 'المتعلم ذاتياً فقط' : 'Learned Only'}</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-secondary-900 hover:bg-secondary-800 rounded-lg transition-colors"
                    >
                        {isRtl ? 'تصفية' : 'Filter'}
                    </button>
                </form>

                {/* Knowledge Table */}
                <div className="bg-white rounded-xl shadow-xs border border-secondary-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface text-secondary-700 text-start rtl:text-right border-b border-secondary-100">
                                    <th className="px-4 py-3 font-semibold">{isRtl ? 'السؤال' : 'Question'}</th>
                                    <th className="px-4 py-3 font-semibold">{isRtl ? 'الإجابة والرد' : 'Reply'}</th>
                                    <th className="px-4 py-3 font-semibold">{isRtl ? 'النوع واللغة' : 'Type & Lang'}</th>
                                    <th className="px-4 py-3 font-semibold text-center">{isRtl ? 'المرات' : 'Hits'}</th>
                                    <th className="px-4 py-3 font-semibold text-center">{isRtl ? 'الحالة' : 'Status'}</th>
                                    <th className="px-4 py-3 font-semibold text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {items.length > 0 ? (
                                    items.map(item => (
                                        <tr key={item.id} className="hover:bg-secondary-50/50 transition-colors">
                                            <td className="px-4 py-3 max-w-xs">
                                                <p className="font-semibold text-secondary-900 line-clamp-2">{item.question}</p>
                                                {item.keywords && item.keywords.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.keywords.map((kw, i) => (
                                                            <span key={i} className="text-[10px] bg-secondary-100 text-secondary-600 px-1.5 py-0.5 rounded">
                                                                #{kw}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 max-w-md">
                                                <p className="text-secondary-700 line-clamp-2 whitespace-pre-line">{item.reply}</p>
                                                {item.quick_replies && item.quick_replies.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.quick_replies.map((qr, i) => (
                                                            <span key={i} className="text-[10px] bg-primary-50 text-primary-700 border border-primary-100 px-1.5 py-0.5 rounded">
                                                                💬 {qr}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium w-fit ${item.is_custom ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                        {item.is_custom ? (isRtl ? 'معتمد' : 'Custom') : (isRtl ? 'متعلم ذاتياً' : 'Self-Learned')}
                                                    </span>
                                                    <span className="text-xs text-secondary-500 uppercase">{item.locale || 'ar'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-secondary-700">
                                                {item.hits || 0}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleActive(item.id)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${item.is_active !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-rose-100 text-rose-700 hover:bg-rose-200'}`}
                                                >
                                                    {item.is_active !== false ? (isRtl ? 'مفعل' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        title={isRtl ? 'تعديل' : 'Edit'}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-1.5 text-secondary-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title={isRtl ? 'حذف' : 'Delete'}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-secondary-500">
                                            {isRtl ? 'لا توجد بيانات مطابقة في بنك المعرفة' : 'No knowledge items found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add / Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between pb-4 border-b border-secondary-100 mb-4">
                                <h3 className="text-lg font-bold text-secondary-900">
                                    {editingItem
                                        ? (isRtl ? 'تعديل رد في بنك المعرفة' : 'Edit Knowledge Item')
                                        : (isRtl ? 'إضافة رد جاهز جديد' : 'Add New Q&A Item')}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-secondary-400 hover:text-secondary-700 text-xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                            {isRtl ? 'اللغة' : 'Language'}
                                        </label>
                                        <select
                                            value={formData.locale}
                                            onChange={e => setFormData({ ...formData, locale: e.target.value })}
                                            className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            required
                                        >
                                            <option value="ar">العربية (Arabic)</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                            {isRtl ? 'تصنيف كعميل مهتم (Hot Lead)' : 'Mark as Hot Lead'}
                                        </label>
                                        <select
                                            value={formData.is_hot_lead ? 'yes' : 'no'}
                                            onChange={e => setFormData({ ...formData, is_hot_lead: e.target.value === 'yes' })}
                                            className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        >
                                            <option value="no">{isRtl ? 'لا (سؤال عام)' : 'No (General)'}</option>
                                            <option value="yes">{isRtl ? 'نعم (طلب شراء / معاينة / عاجل) 🔥' : 'Yes (High Intent) 🔥'}</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                        {isRtl ? 'السؤال أو عبارة العميل' : 'Question / User Query'} <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.question}
                                        onChange={e => setFormData({ ...formData, question: e.target.value })}
                                        placeholder={isRtl ? 'مثال: إيه أنظمة التقسيط عندكم؟' : 'e.g. What are your installment options?'}
                                        className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                        {isRtl ? 'الكلمات المفتاحية للمطابقة (مفصولة بفاصلة)' : 'Match Keywords (comma separated)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.keywords}
                                        onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                                        placeholder={isRtl ? 'مثال: تقسيط, قسط, سنوات السداد, مقدم' : 'e.g. installment, payment plan, down payment'}
                                        className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                        {isRtl ? 'نص الإجابة والرد الكامل (يدعم Markdown)' : 'Answer / Reply Text (Markdown supported)'} <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={formData.reply}
                                        onChange={e => setFormData({ ...formData, reply: e.target.value })}
                                        placeholder={isRtl ? 'اكتب الرد النموذجي هنا...' : 'Write the model answer here...'}
                                        className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-secondary-700 mb-1">
                                        {isRtl ? 'الأزرار التفاعلية السريعة المقترحة (مفصولة بفاصلة)' : 'Quick Reply Chips (comma separated)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.quick_replies}
                                        onChange={e => setFormData({ ...formData, quick_replies: e.target.value })}
                                        placeholder={isRtl ? 'مثال: شقق أقل من 5 مليون, شقق استلام فوري, تواصل واتساب' : 'e.g. Under 5M, Ready to move, WhatsApp'}
                                        className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-secondary-800">
                                        {isRtl ? 'تفعيل هذا الرد فوراً في الشات' : 'Activate this response immediately'}
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-secondary-600 hover:bg-secondary-50 rounded-lg"
                                    >
                                        {isRtl ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
                                    >
                                        {isSubmitting ? (isRtl ? 'جارٍ الحفظ...' : 'Saving...') : (isRtl ? 'حفظ الرد' : 'Save Response')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminSidebar>
    )
}

