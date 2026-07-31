import { Select } from '../../../Components/UI'
import { usePage, useForm, router, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useCallback, useState } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'

function MenuBar({ editor, trans }) {
    if (!editor) return null

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-surface/50">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('bold') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <strong>B</strong>
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('italic') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <em>I</em>
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('underline') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                <u>U</u>
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('bulletList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('list')}
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('orderedList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('ordered_list')}
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                L
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                C
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                R
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
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
        keywords: article?.keywords || [],
        meta_description: article?.meta_description || '',
        is_published: article?.is_published || false,
        cover_image: null,
        images: [],
        new_image_alts: {},
        new_image_positions: {},
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
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
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
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: article?.content_en || '',
        editorProps: {
            attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3' },
        },
        onUpdate: ({ editor }) => setData('content_en', editor.getHTML()),
    })

    const handleKeywordInput = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const value = e.target.value.trim()
            if (value && !data.keywords.includes(value)) {
                setData('keywords', [...data.keywords, value])
            }
            e.target.value = ''
        }
    }, [data.keywords, setData])

    function removeKeyword(keyword) {
        setData('keywords', data.keywords.filter(k => k !== keyword))
    }

    function handleImageDelete(imageId) {
        setData('deleted_image_ids', [...data.deleted_image_ids, imageId])
    }

    function handleImageUpdate(imageId, field, value) {
        setData(`image_updates.${imageId}.${field}`, value)
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (isEditing) {
            transform((data) => ({ ...data, _method: 'put' }))
            post(`/admin/articles/${article.id}`, {
                preserveScroll: true,
            })
        } else {
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
                                <input type="text" value={data.title_ar} onChange={e => setData('title_ar', e.target.value)} dir="rtl" required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                                {errors.title_ar && <p className="text-xs text-error mt-1">{errors.title_ar}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('title_en')}</label>
                                <input type="text" value={data.title_en} onChange={e => setData('title_en', e.target.value)} required className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
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
                                    <MenuBar editor={editorAr} trans={trans} articleTitle={data.title_ar} />
                                    <EditorContent editor={editorAr} />
                                </div>
                            )}
                            {contentTab === 'en' && (
                                <div className="border border-secondary-200 rounded-lg overflow-hidden">
                                    <MenuBar editor={editorEn} trans={trans} articleTitle={data.title_en} />
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
                                        <select value={data.image_updates[img.id]?.position ?? (img.position || 'middle')} onChange={e => handleImageUpdate(img.id, 'position', e.target.value)} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white">
                                            <option value="top">أول المقال</option>
                                            <option value="middle">وسط المقال</option>
                                            <option value="bottom">آخر المقال</option>
                                        </select>
                                        {((data.image_updates[img.id]?.position ?? (img.position || 'middle')) === 'middle') && (
                                            <p className="text-xs text-secondary-600 bg-secondary-100 p-1 rounded text-center" dir="rtl">
                                                كود الإضافة: <code className="font-bold text-primary-900 bg-white px-1 rounded inline-block" dir="ltr">[صورة:{getShortcodeIndex('existing', img.id)}]</code>
                                            </p>
                                        )}
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
                                            <select onChange={e => {
                                                const pos = data.new_image_positions || {}
                                                setData('new_image_positions', { ...pos, [fileIndex]: e.target.value })
                                            }} value={(data.new_image_positions || {})[fileIndex] || 'middle'} className="w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white">
                                                <option value="top">أول المقال</option>
                                                <option value="middle">وسط المقال</option>
                                                <option value="bottom">آخر المقال</option>
                                            </select>
                                            {((data.new_image_positions || {})[fileIndex] || 'middle') === 'middle' && (
                                                <p className="text-xs text-secondary-600 bg-secondary-100 p-1 rounded text-center" dir="rtl">
                                                    كود الإضافة: <code className="font-bold text-primary-900 bg-white px-1 rounded inline-block" dir="ltr">[صورة:{getShortcodeIndex('new', fileIndex)}]</code>
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {errors.images && <p className="text-xs text-error mt-1">{errors.images}</p>}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-secondary-950">{trans('seo')}</h2>

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('meta_description')}</label>
                            <textarea value={data.meta_description} onChange={e => setData('meta_description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            {errors.meta_description && <p className="text-xs text-error mt-1">{errors.meta_description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-1">{trans('keywords')}</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(data.keywords || []).map(kw => (
                                    <span key={kw} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-900 text-xs rounded-full">
                                        {kw}
                                        <button type="button" onClick={() => removeKeyword(kw)} className="text-primary-900/60 hover:text-primary-900">&times;</button>
                                    </span>
                                ))}
                            </div>
                            <input type="text" placeholder={trans('keywords_hint')} onKeyDown={handleKeywordInput} className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900" />
                            {errors.keywords && <p className="text-xs text-error mt-1">{errors.keywords}</p>}
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
