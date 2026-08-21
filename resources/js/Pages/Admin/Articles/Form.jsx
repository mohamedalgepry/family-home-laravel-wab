import { Select } from '../../../Components/UI'
import { usePage, useForm, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useCallback, useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from '../../../Utils/tiptapFontSize'
import axios from 'axios'

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

function MenuBar({ editor, trans, isRtl = false }) {
    if (!editor) return null

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt(trans('enter_url') || 'أدخل الرابط (URL):', previousUrl || 'https://')

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run()
    }, [editor, trans])

    const addImageByUrl = useCallback(() => {
        const url = window.prompt(trans('enter_image_url') || 'أدخل رابط الصورة (URL):', 'https://')
        if (url && url.trim()) {
            editor.chain().focus().setImage({ src: url.trim() }).run()
        }
    }, [editor, trans])

    const handleImageUpload = useCallback((e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        axios.post('/admin/media/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            if (res.data?.url) {
                editor.chain().focus().setImage({ src: res.data.url }).run()
            }
        }).catch(err => {
            alert(err.response?.data?.message || 'فشل رفع الصورة')
        }).finally(() => {
            e.target.value = ''
        })
    }, [editor])

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-surface/50 items-center">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('bold') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <strong>B</strong>
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('italic') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <em>I</em>
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('underline') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <u>U</u>
            </button>
            <button type="button" onClick={setLink} className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${editor.isActive('link') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`} title={trans('link') || 'إدراج / تعديل رابط'}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                <span>{trans('link') || 'رابط'}</span>
            </button>
            {editor.isActive('link') && (
                <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className="px-2 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100" title="إزالة الرابط">
                    ✕
                </button>
            )}
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <label className="px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 cursor-pointer flex items-center gap-1" title={trans('upload_image') || 'رفع صورة وإدراجها'}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{trans('image') || 'صورة'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            <button type="button" onClick={addImageByUrl} className="px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 flex items-center gap-1" title={trans('insert_image_url') || 'إدراج صورة برابط'}>
                <span>🔗 {trans('image_url') || 'رابط صورة'}</span>
            </button>
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('bulletList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('list')}
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('orderedList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('ordered_list')}
            </button>
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                L
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                C
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                R
            </button>
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <div className="flex items-center gap-1.5 px-1 py-0.5 rounded bg-white border border-secondary-200" title={trans('text_color') || 'لون الخط'}>
                <label className="text-[11px] text-secondary-600 font-medium cursor-pointer flex items-center gap-1">
                    <span>{trans('text_color') || 'اللون'}:</span>
                    <input
                        type="color"
                        onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                </label>
                <div className="flex items-center gap-0.5">
                    {['#111827', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => editor.chain().focus().setColor(c).run()}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 transition-transform hover:scale-125"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    {editor.getAttributes('textStyle').color && (
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().unsetColor().run()}
                            className="text-[10px] text-secondary-400 hover:text-red-600 px-1"
                            title="إعادة ضبط اللون"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <div className="flex items-center gap-1.5 px-1 py-0.5 rounded bg-white border border-secondary-200" title={trans('font_size') || 'حجم الخط'}>
                <label className="text-[11px] text-secondary-600 font-medium">
                    {trans('font_size') || 'الحجم'}:
                </label>
                <select
                    value={editor.getAttributes('textStyle').fontSize || ''}
                    onChange={(e) => {
                        const size = e.target.value
                        if (size) {
                            editor.chain().focus().setFontSize(size).run()
                        } else {
                            editor.chain().focus().unsetFontSize().run()
                        }
                    }}
                    className="text-[11px] border-0 bg-transparent text-secondary-700 cursor-pointer focus:outline-none focus:ring-0 py-0.5"
                >
                    <option value="">{isRtl ? 'افتراضي' : 'Default'}</option>
                    {FONT_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <span className="w-px bg-secondary-200 mx-1 h-4" />
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                H2
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                H3
            </button>
        </div>
    )
}

export default function AdminArticlesForm({ article, categories }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const isEditing = !!article
    const [contentTab, setContentTab] = useState(locale === 'ar' ? 'ar' : 'en')

    const { data, setData, post, put, processing, errors, transform } = useForm({
        category_id: article?.category_id || '',
        title_ar: article?.title_ar || '',
        title_en: article?.title_en || article?.title || '',
        content_ar: article?.content_ar || '',
        content_en: article?.content_en || article?.content || '',
        excerpt_ar: article?.excerpt_ar || '',
        excerpt_en: article?.excerpt_en || article?.excerpt || '',
        alt_text: article?.alt_text || '',
        alt_text_ar: article?.alt_text_ar || article?.alt_text || '',
        alt_text_en: article?.alt_text_en || '',
        keywords_ar: article?.keywords_ar || (Array.isArray(article?.keywords) ? article.keywords : []),
        keywords_en: article?.keywords_en || [],
        meta_description_ar: article?.meta_description_ar || article?.meta_description || '',
        meta_description_en: article?.meta_description_en || '',
        is_published: article?.is_published || false,
        cover_image: null,
        images: [],
        new_image_alts: {},
        new_image_positions: {},
        new_image_links: {},
        deleted_image_ids: [],
        image_updates: {},
    })

    const existingImages = isEditing ? (article.images || []).filter(img => img.position !== 'header' && !data.deleted_image_ids.includes(img.id)) : []
    const allImagesCombined = [
        ...existingImages.map(img => ({ type: 'existing', id: img.id, position: data.image_updates[img.id]?.position ?? (img.position || 'middle') })),
        ...data.images.map((file, i) => ({ type: 'new', index: i, position: (data.new_image_positions || {})[i] || 'middle' }))
    ];
    const middleImages = allImagesCombined.filter(img => img.position === 'middle');
    
    const getShortcodeIndex = (imgType, identifier) => {
        return middleImages.findIndex(m => (imgType === 'existing' ? m.id === identifier : m.index === identifier)) + 1;
    }

    const editorAr = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
            ImageExtension.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'w-full h-auto rounded-2xl my-6 border border-secondary-200/60 object-cover shadow-sm',
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            FontSize,
        ],
        content: article?.content_ar || '',
        editorProps: {
            attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3', dir: 'rtl' },
        },
        onUpdate: ({ editor }) => setData('content_ar', editor.getHTML()),
    })

    const editorEn = useEditor({
        extensions: [
            StarterKit,
            Underline,
            LinkExtension.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
            ImageExtension.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'w-full h-auto rounded-2xl my-6 border border-secondary-200/60 object-cover shadow-sm',
                },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TextStyle,
            Color,
            FontSize,
        ],
        content: article?.content_en || '',
        editorProps: {
            attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3' },
        },
        onUpdate: ({ editor }) => setData('content_en', editor.getHTML()),
    })

    const [keywordInputAr, setKeywordInputAr] = useState('')
    const [kwWarningAr, setKwWarningAr] = useState(false)
    const [keywordInputEn, setKeywordInputEn] = useState('')
    const [kwWarningEn, setKwWarningEn] = useState(false)
    const [copiedCode, setCopiedCode] = useState(null)
    const MAX_KEYWORDS = 25

    function copyShortcode(code) {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(code)
            setCopiedCode(code)
            setTimeout(() => setCopiedCode(null), 2000)
        }
    }

    function insertShortcodeToEditor(code) {
        if (editorAr && !editorAr.isDestroyed) {
            editorAr.chain().focus().insertContent(` ${code} `).run()
        } else if (editorEn && !editorEn.isDestroyed) {
            editorEn.chain().focus().insertContent(` ${code} `).run()
        }
    }

    function parseKeywords(text) {
        if (!text) return []
        return text
            .split(/[,،;.\n]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
    }

    function addKeywordAr() {
        if (!keywordInputAr) return
        const parsed = parseKeywords(keywordInputAr)
        if (parsed.length > 0) {
            const existing = new Set(data.keywords_ar || [])
            const toAdd = parsed.filter(k => !existing.has(k))
            const available = MAX_KEYWORDS - (data.keywords_ar || []).length
            if (available <= 0) {
                setKwWarningAr(true)
                setKeywordInputAr('')
                return
            }
            const limited = toAdd.slice(0, available)
            setKwWarningAr(toAdd.length > available)
            if (limited.length > 0) {
                setData('keywords_ar', [...(data.keywords_ar || []), ...limited])
            }
        }
        setKeywordInputAr('')
    }

    function removeKeywordAr(kw) {
        setData('keywords_ar', (data.keywords_ar || []).filter(k => k !== kw))
        setKwWarningAr(false)
    }

    function clearKeywordsAr() {
        setData('keywords_ar', [])
        setKwWarningAr(false)
    }

    function addKeywordEn() {
        if (!keywordInputEn) return
        const parsed = parseKeywords(keywordInputEn)
        if (parsed.length > 0) {
            const existing = new Set(data.keywords_en || [])
            const toAdd = parsed.filter(k => !existing.has(k))
            const available = MAX_KEYWORDS - (data.keywords_en || []).length
            if (available <= 0) {
                setKwWarningEn(true)
                setKeywordInputEn('')
                return
            }
            const limited = toAdd.slice(0, available)
            setKwWarningEn(toAdd.length > available)
            if (limited.length > 0) {
                setData('keywords_en', [...(data.keywords_en || []), ...limited])
            }
        }
        setKeywordInputEn('')
    }

    function removeKeywordEn(kw) {
        setData('keywords_en', (data.keywords_en || []).filter(k => k !== kw))
        setKwWarningEn(false)
    }

    function clearKeywordsEn() {
        setData('keywords_en', [])
        setKwWarningEn(false)
    }

    function handleImageDelete(imageId) {
        setData('deleted_image_ids', [...data.deleted_image_ids, imageId])
    }

    function handleImageUpdate(imageId, field, value) {
        setData(`image_updates.${imageId}.${field}`, value)
    }

    function handleSubmit(e) {
        e.preventDefault()

        let currentKeywordsAr = data.keywords_ar || []
        if (keywordInputAr.trim()) {
            const parsed = parseKeywords(keywordInputAr)
            if (parsed.length > 0) {
                const existing = new Set(currentKeywordsAr)
                const toAdd = parsed.filter(k => !existing.has(k))
                currentKeywordsAr = [...currentKeywordsAr, ...toAdd]
            }
        }

        let currentKeywordsEn = data.keywords_en || []
        if (keywordInputEn.trim()) {
            const parsed = parseKeywords(keywordInputEn)
            if (parsed.length > 0) {
                const existing = new Set(currentKeywordsEn)
                const toAdd = parsed.filter(k => !existing.has(k))
                currentKeywordsEn = [...currentKeywordsEn, ...toAdd]
            }
        }

        const payload = {
            ...data,
            keywords_ar: currentKeywordsAr,
            keywords_en: currentKeywordsEn,
            keywords: currentKeywordsAr.length > 0 ? currentKeywordsAr : currentKeywordsEn,
            meta_description: data.meta_description_ar || data.meta_description_en || '',
        }

        if (isEditing) {
            transform(() => ({ ...payload, _method: 'put' }))
            post(`/admin/articles/${article.id}`, {
                preserveScroll: true,
            })
        } else {
            transform(() => payload)
            post('/admin/articles', {
                preserveScroll: true,
            })
        }
    }

    return (
        <AdminSidebar>
            <Head title={trans('create') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-secondary-950">
                        {isEditing ? trans('edit') : trans('create')} {trans('sidebar_articles')}
                    </h1>
                    <a href="/admin/articles" className="text-sm text-muted hover:text-secondary-950 transition-colors">
                        &larr; {trans('back')}
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">
                    <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('title_ar')} *</label>
                                <input type="text" maxLength={100} value={data.title_ar} onChange={e => setData('title_ar', e.target.value)} dir="rtl" required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.title_ar && <p className="text-xs text-error mt-1">{errors.title_ar}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('title_en')}</label>
                                <input type="text" maxLength={100} value={data.title_en} onChange={e => setData('title_en', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.title_en && <p className="text-xs text-error mt-1">{errors.title_en}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('category')} *</label>
                            <Select value={data.category_id} onChange={e => setData('category_id', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900">
                                <option value="">—</option>
                                {categories?.map(c => (
                                    <option key={c.id} value={c.id}>{isRtl ? c.name_ar : c.name_en}</option>
                                ))}
                            </Select>
                            {errors.category_id && <p className="text-xs text-error mt-1">{errors.category_id}</p>}
                        </div>

                        <div>
                            <div className="flex gap-2 mb-2">
                                <button type="button" onClick={() => setContentTab('ar')} className={`px-3 py-1 text-xs rounded ${contentTab === 'ar' ? 'bg-primary-900 text-white' : 'bg-surface text-secondary-700'}`}>
                                    {trans('lang_ar')}
                                </button>
                                <button type="button" onClick={() => setContentTab('en')} className={`px-3 py-1 text-xs rounded ${contentTab === 'en' ? 'bg-primary-900 text-white' : 'bg-surface text-secondary-700'}`}>
                                    {trans('lang_en')}
                                </button>
                            </div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{contentTab === 'ar' ? trans('content_ar') : trans('content_en')} *</label>
                            
                            {contentTab === 'ar' && (
                                <div className="border border-secondary-200 rounded-lg overflow-hidden" dir="rtl">
                                    <MenuBar editor={editorAr} trans={trans} isRtl={isRtl} />
                                    <EditorContent editor={editorAr} />
                                </div>
                            )}
                            {contentTab === 'en' && (
                                <div className="border border-secondary-200 rounded-lg overflow-hidden">
                                    <MenuBar editor={editorEn} trans={trans} isRtl={isRtl} />
                                    <EditorContent editor={editorEn} />
                                </div>
                            )}
                            {errors.content_ar && <p className="text-xs text-error mt-1">{errors.content_ar}</p>}
                            {errors.content_en && <p className="text-xs text-error mt-1">{errors.content_en}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('excerpt_ar')}</label>
                                <textarea value={data.excerpt_ar} onChange={e => setData('excerpt_ar', e.target.value)} rows={3} dir="rtl" className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.excerpt_ar && <p className="text-xs text-error mt-1">{errors.excerpt_ar}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('excerpt_en')}</label>
                                <textarea value={data.excerpt_en} onChange={e => setData('excerpt_en', e.target.value)} rows={3} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.excerpt_en && <p className="text-xs text-error mt-1">{errors.excerpt_en}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('cover_image') || 'Cover Image'}</h2>
                        
                        {data.cover_image ? (
                            <div className="relative group border border-secondary-200 rounded-lg overflow-hidden w-64 mb-4">
                                <img src={URL.createObjectURL(data.cover_image)} alt={data.title_ar || data.title_en || 'Cover preview'} className="w-full h-32 object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => setData('cover_image', null)} className="px-2 py-1 text-xs bg-error text-white rounded">
                                        {trans('remove')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            isEditing && article?.images?.find(img => img.position === 'header' && !data.deleted_image_ids.includes(img.id)) && (
                                <div className="relative group border border-secondary-200 rounded-lg overflow-hidden w-64 mb-4">
                                    <img src={article.images.find(img => img.position === 'header').url} alt={article.title || 'Cover'} className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button type="button" onClick={() => handleImageDelete(article.images.find(img => img.position === 'header').id)} className="px-2 py-1 text-xs bg-error text-white rounded">
                                            {trans('delete')}
                                        </button>
                                    </div>
                                </div>
                            )
                        )}

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('upload') || 'Upload'}</label>
                            <input type="file" accept="image/*" onChange={e => setData('cover_image', e.target.files[0])} className="w-full text-sm file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-900 hover:file:bg-primary-100" />
                            {errors.cover_image && <p className="text-xs text-error mt-1">{errors.cover_image}</p>}
                        </div>
                    </div>

                    {/* Additional Images */}
                    <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('images') || 'Images'}</h2>
                        
                        {existingImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="border border-secondary-200 rounded-lg p-2 flex flex-col gap-2 relative">
                                        <div className="relative group rounded overflow-hidden">
                                            <img src={img.url} alt={img.alt_text} className="w-full h-32 object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={() => handleImageDelete(img.id)} className="px-2 py-1 text-xs bg-error text-white rounded">
                                                    {trans('delete')}
                                                </button>
                                            </div>
                                        </div>
                                        <input type="text" placeholder={trans('alt_text')} value={data.image_updates[img.id]?.alt_text ?? (img.alt_text || '')} onChange={e => handleImageUpdate(img.id, 'alt_text', e.target.value)} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs" />
                                        <input type="url" placeholder={isRtl ? 'رابط الصورة (اختياري: https://...)' : 'Image Link URL (Optional)'} value={data.image_updates[img.id]?.link_url ?? (img.link_url || '')} onChange={e => handleImageUpdate(img.id, 'link_url', e.target.value)} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs" />
                                        <select value={data.image_updates[img.id]?.position ?? (img.position || 'middle')} onChange={e => handleImageUpdate(img.id, 'position', e.target.value)} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white">
                                            <option value="top">أول المقال</option>
                                            <option value="middle">وسط المقال</option>
                                            <option value="bottom">آخر المقال</option>
                                        </select>
                                        {((data.image_updates[img.id]?.position ?? (img.position || 'middle')) === 'middle') && (() => {
                                            const codeStr = `[صورة:${getShortcodeIndex('existing', img.id)}]`;
                                            return (
                                                <div className="flex items-center justify-between gap-1 bg-secondary-50 p-1.5 rounded-lg border border-secondary-200" dir="rtl">
                                                    <div className="text-[11px] text-secondary-700 font-semibold flex items-center gap-1">
                                                        <span>الكود:</span>
                                                        <span className="font-mono font-bold text-primary-900 bg-white px-1.5 py-0.5 rounded border border-secondary-200" dir="ltr">{codeStr}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => copyShortcode(codeStr)}
                                                            className="px-2 py-0.5 text-[11px] font-semibold bg-white border border-secondary-200 hover:bg-primary-50 text-secondary-800 hover:text-primary-900 rounded transition-colors"
                                                            title="نسخ الكود كنص نقي"
                                                        >
                                                            {copiedCode === codeStr ? '✓ تم' : 'نسخ'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => insertShortcodeToEditor(codeStr)}
                                                            className="px-2 py-0.5 text-[11px] font-semibold bg-primary-900 hover:bg-primary-950 text-white rounded transition-colors"
                                                            title="إدراج الكود في مكان المؤشر داخل محرر المقال"
                                                        >
                                                            إدراج
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('upload_new_images') || 'Upload Images'}</label>
                            <input type="file" multiple accept="image/*" onChange={e => setData('images', [...data.images, ...Array.from(e.target.files)])} className="w-full text-sm file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-900 hover:file:bg-primary-100" />
                            
                            {data.images.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {data.images.map((file, fileIndex) => (
                                        <div key={fileIndex} className="border border-secondary-200 rounded-lg p-2 flex flex-col gap-2 relative">
                                            <div className="relative group rounded overflow-hidden">
                                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-32 object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => {
                                                        const newImages = [...data.images]
                                                        newImages.splice(fileIndex, 1)
                                                        setData('images', newImages)
                                                    }} className="px-2 py-1 text-xs bg-error text-white rounded">
                                                        {trans('delete')}
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="text" placeholder={trans('alt_text')} onChange={e => {
                                                const alts = data.new_image_alts || {}
                                                setData('new_image_alts', { ...alts, [fileIndex]: e.target.value })
                                            }} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs" />
                                            <input type="url" placeholder={isRtl ? 'رابط الصورة (اختياري: https://...)' : 'Image Link URL (Optional)'} onChange={e => {
                                                const links = data.new_image_links || {}
                                                setData('new_image_links', { ...links, [fileIndex]: e.target.value })
                                            }} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs" />
                                            <select onChange={e => {
                                                const pos = data.new_image_positions || {}
                                                setData('new_image_positions', { ...pos, [fileIndex]: e.target.value })
                                            }} value={(data.new_image_positions || {})[fileIndex] || 'middle'} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white">
                                                <option value="top">أول المقال</option>
                                                <option value="middle">وسط المقال</option>
                                                <option value="bottom">آخر المقال</option>
                                            </select>
                                            {((data.new_image_positions || {})[fileIndex] || 'middle') === 'middle' && (() => {
                                                const codeStr = `[صورة:${getShortcodeIndex('new', fileIndex)}]`;
                                                return (
                                                    <div className="flex items-center justify-between gap-1 bg-secondary-50 p-1.5 rounded-lg border border-secondary-200" dir="rtl">
                                                        <div className="text-[11px] text-secondary-700 font-semibold flex items-center gap-1">
                                                            <span>الكود:</span>
                                                            <span className="font-mono font-bold text-primary-900 bg-white px-1.5 py-0.5 rounded border border-secondary-200" dir="ltr">{codeStr}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => copyShortcode(codeStr)}
                                                                className="px-2 py-0.5 text-[11px] font-semibold bg-white border border-secondary-200 hover:bg-primary-50 text-secondary-800 hover:text-primary-900 rounded transition-colors"
                                                                title="نسخ الكود كنص نقي"
                                                            >
                                                                {copiedCode === codeStr ? '✓ تم' : 'نسخ'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => insertShortcodeToEditor(codeStr)}
                                                                className="px-2 py-0.5 text-[11px] font-semibold bg-primary-900 hover:bg-primary-950 text-white rounded transition-colors"
                                                                title="إدراج الكود في مكان المؤشر داخل محرر المقال"
                                                            >
                                                                إدراج
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {errors.images && <p className="text-xs text-error mt-1">{errors.images}</p>}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('seo')}</h2>

                        {/* Meta Descriptions (Arabic & English) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">
                                    {trans('meta_description')} ({trans('lang_ar') || 'العربية'})
                                </label>
                                <textarea
                                    value={data.meta_description_ar}
                                    onChange={e => setData('meta_description_ar', e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    dir="rtl"
                                    placeholder={isRtl ? 'وصف الميتا لمحركات البحث باللغة العربية (حتى 500 حرف)...' : 'Arabic meta description for search engines...'}
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                />
                                {errors.meta_description_ar && <p className="text-xs text-error mt-1">{errors.meta_description_ar}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">
                                    {trans('meta_description')} ({trans('lang_en') || 'English'})
                                </label>
                                <textarea
                                    value={data.meta_description_en}
                                    onChange={e => setData('meta_description_en', e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    dir="ltr"
                                    placeholder="English meta description for search engines (up to 500 characters)..."
                                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                                />
                                {errors.meta_description_en && <p className="text-xs text-error mt-1">{errors.meta_description_en}</p>}
                            </div>
                        </div>

                        {/* Keywords (Arabic & English) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-secondary-100">
                            {/* Arabic Keywords */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-secondary-950">
                                        {trans('keywords')} ({trans('lang_ar') || 'العربية'})
                                        <span className={`text-xs font-normal ms-1 ${(data.keywords_ar || []).length >= MAX_KEYWORDS ? 'text-red-500' : 'text-muted'}`}>
                                            ({(data.keywords_ar || []).length} / {MAX_KEYWORDS})
                                        </span>
                                    </label>
                                    {(data.keywords_ar || []).length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearKeywordsAr}
                                            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            {isRtl ? 'تفريغ الكل' : 'Clear All'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2 mb-2">
                                    <textarea
                                        value={keywordInputAr}
                                        onChange={e => { setKeywordInputAr(e.target.value); setKwWarningAr(false) }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                addKeywordAr()
                                            }
                                        }}
                                        rows={2}
                                        dir="rtl"
                                        disabled={(data.keywords_ar || []).length >= MAX_KEYWORDS}
                                        placeholder={(data.keywords_ar || []).length >= MAX_KEYWORDS
                                            ? (isRtl ? 'وصلت للحد الأقصى 25 كلمة' : 'Max 25 keywords reached')
                                            : (isRtl ? 'الصق الكلمات العربية مفصولة بفاصلة (، أو .) أو سطر جديد...' : 'Paste Arabic keywords separated by commas or newlines...')}
                                        className="flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={addKeywordAr}
                                        disabled={(data.keywords_ar || []).length >= MAX_KEYWORDS}
                                        className="px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {trans('add')}
                                    </button>
                                </div>

                                {kwWarningAr && (
                                    <p className="text-xs text-red-500 mb-2">
                                        {isRtl ? 'وصلت للحد الأقصى ٢٥ كلمة مفتاحية' : 'Max 25 keywords reached'}
                                    </p>
                                )}

                                {(data.keywords_ar || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface">
                                        {data.keywords_ar.map(kw => (
                                            <span key={kw} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors">
                                                {kw}
                                                <button type="button" onClick={() => removeKeywordAr(kw)} className="text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {errors.keywords_ar && <p className="text-xs text-error mt-1">{errors.keywords_ar}</p>}
                            </div>

                            {/* English Keywords */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-semibold text-secondary-950">
                                        {trans('keywords')} ({trans('lang_en') || 'English'})
                                        <span className={`text-xs font-normal ms-1 ${(data.keywords_en || []).length >= MAX_KEYWORDS ? 'text-red-500' : 'text-muted'}`}>
                                            ({(data.keywords_en || []).length} / {MAX_KEYWORDS})
                                        </span>
                                    </label>
                                    {(data.keywords_en || []).length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearKeywordsEn}
                                            className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            {isRtl ? 'تفريغ الكل' : 'Clear All'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2 mb-2">
                                    <textarea
                                        value={keywordInputEn}
                                        onChange={e => { setKeywordInputEn(e.target.value); setKwWarningEn(false) }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                addKeywordEn()
                                            }
                                        }}
                                        rows={2}
                                        dir="ltr"
                                        disabled={(data.keywords_en || []).length >= MAX_KEYWORDS}
                                        placeholder={(data.keywords_en || []).length >= MAX_KEYWORDS
                                            ? 'Max 25 keywords reached'
                                            : 'Paste English keywords separated by commas or newlines...'}
                                        className="flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={addKeywordEn}
                                        disabled={(data.keywords_en || []).length >= MAX_KEYWORDS}
                                        className="px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {trans('add')}
                                    </button>
                                </div>

                                {kwWarningEn && (
                                    <p className="text-xs text-red-500 mb-2">
                                        Max 25 keywords reached
                                    </p>
                                )}

                                {(data.keywords_en || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface">
                                        {data.keywords_en.map(kw => (
                                            <span key={kw} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors">
                                                {kw}
                                                <button type="button" onClick={() => removeKeywordEn(kw)} className="text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none">&times;</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {errors.keywords_en && <p className="text-xs text-error mt-1">{errors.keywords_en}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Publish Toggle */}
                    <div className="bg-white rounded-xl shadow-card p-6">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="is_published" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} className="w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer" />
                            <label htmlFor="is_published" className="text-sm font-medium text-secondary-950">
                                {trans('publish')}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <a href="/admin/articles" className="px-6 py-2.5 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors">
                            {trans('cancel')}
                        </a>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50">
                            {processing ? trans('loading') : (isEditing ? trans('update') : trans('save'))}
                        </button>
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}
