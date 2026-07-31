import { usePage, useForm, Head } from '@inertiajs/react'
import { useTrans } from '../../../Utils/trans'
import { useState, useRef, useEffect } from 'react'
import AdminSidebar from '../../../Components/Layout/AdminSidebar'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import axios from 'axios'

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: attributes => {
                    if (!attributes.width) return {}
                    const width = /^[0-9]+$/.test(attributes.width) ? attributes.width + 'px' : attributes.width
                    return { style: `width: ${width}` }
                }
            },
            float: {
                default: 'none',
                renderHTML: attributes => {
                    if (attributes.float === 'left') {
                        return { class: 'float-left me-4 mb-4' }
                    }
                    if (attributes.float === 'right') {
                        return { class: 'float-right ms-4 mb-4' }
                    }
                    return {}
                }
            }
        }
    }
})

function MenuBar({ editor, trans, isRtl }) {
    if (!editor) return null

    const handleImageUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async () => {
            const file = input.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('image', file)
                try {
                    const res = await axios.post('/admin/media/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    editor.chain().focus().setImage({ src: res.data.url, alt: trans('about') }).run()
                } catch (e) {
                    alert(isRtl ? 'فشل رفع الصورة داخل المحرر' : 'Image upload failed')
                }
            }
        }
        input.click()
    }

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-surface/50">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2.5 py-1 text-xs font-bold rounded ${editor.isActive('bold') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                B
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2.5 py-1 text-xs italic rounded ${editor.isActive('italic') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                I
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2.5 py-1 text-xs underline rounded ${editor.isActive('underline') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                U
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('bulletList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('list') || '• قائمة'}
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`px-2 py-1 text-xs rounded ${editor.isActive('orderedList') ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                {trans('ordered_list') || '1. قائمة'}
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                يسار
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                وسط
            </button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                يمين
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 text-xs font-bold rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                H2
            </button>
            <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`px-2 py-1 text-xs font-bold rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`}>
                H3
            </button>
            <span className="w-px bg-secondary-200 mx-1" />
            <button type="button" onClick={handleImageUpload} className="px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 flex items-center gap-1" title="إدراج صورة داخل النص">
                <svg className="w-4 h-4 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span>صورة داخل النص</span>
            </button>
            {editor.isActive('image') && (
                <>
                    <span className="w-px bg-secondary-200 mx-1" />
                    <button type="button" onClick={() => {
                        const width = prompt(trans('size') + ' (مثال: 50%, 300px):', editor.getAttributes('image').width || '')
                        if (width !== null) editor.chain().focus().updateAttributes('image', { width }).run()
                    }} className="px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 font-medium">
                        {trans('size')}
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { float: 'none' }).run()} className={`px-2 py-1 text-xs rounded ${!editor.getAttributes('image').float || editor.getAttributes('image').float === 'none' ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`} title="No Float">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { float: 'left' }).run()} className={`px-2 py-1 text-xs rounded ${editor.getAttributes('image').float === 'left' ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`} title="Float Left">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h8M4 12h8M4 18h16" /></svg>
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().updateAttributes('image', { float: 'right' }).run()} className={`px-2 py-1 text-xs rounded ${editor.getAttributes('image').float === 'right' ? 'bg-primary-900 text-white' : 'bg-white text-secondary-700 hover:bg-secondary-100'}`} title="Float Right">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h8M12 12h8M4 18h16" /></svg>
                    </button>
                </>
            )}
        </div>
    )
}

export default function AdminAboutEdit({ about }) {
    const { locale, flash } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'
    const fileInputRef = useRef(null)

    const [activeTab, setActiveTab] = useState('ar')
    const [newFiles, setNewFiles] = useState([])
    const [successMessage, setSuccessMessage] = useState('')

    const { data, setData, post, processing, errors } = useForm({
        content_ar: about?.content_ar || '',
        content_en: about?.content_en || '',
        images: [],
        deleted_images: [],
    })

    const editorAr = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
            CustomImage.configure({ inline: true, HTMLAttributes: { class: 'img-fluid inline-block max-w-full h-auto mx-1' } }),
        ],
        content: about?.content_ar || '',
        editorProps: {
            attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[350px] px-4 py-3 bg-white', dir: 'rtl' },
        },
        onUpdate: ({ editor }) => {
            setData('content_ar', editor.getHTML())
        },
    })

    const editorEn = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
            CustomImage.configure({ inline: true, HTMLAttributes: { class: 'img-fluid inline-block max-w-full h-auto mx-1' } }),
        ],
        content: about?.content_en || '',
        editorProps: {
            attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[350px] px-4 py-3 bg-white' },
        },
        onUpdate: ({ editor }) => {
            setData('content_en', editor.getHTML())
        },
    })

    useEffect(() => {
        if (editorAr && about?.content_ar !== undefined) {
            if (editorAr.getHTML() !== about.content_ar) {
                editorAr.commands.setContent(about.content_ar || '')
            }
        }
        if (editorEn && about?.content_en !== undefined) {
            if (editorEn.getHTML() !== about.content_en) {
                editorEn.commands.setContent(about.content_en || '')
            }
        }
    }, [about])

    function handleFileChange(e) {
        const selected = Array.from(e.target.files || [])
        if (selected.length === 0) return
        const updatedNewFiles = [...newFiles, ...selected]
        setNewFiles(updatedNewFiles)
        setData('images', updatedNewFiles)
    }

    function removeNewFile(index) {
        const updated = newFiles.filter((_, i) => i !== index)
        setNewFiles(updated)
        setData('images', updated)
    }

    function toggleDeleteExisting(path) {
        if (data.deleted_images.includes(path)) {
            setData('deleted_images', data.deleted_images.filter(p => p !== path))
        } else {
            setData('deleted_images', [...data.deleted_images, path])
        }
    }

    function handleSubmit(e) {
        e.preventDefault()

        const finalContentAr = editorAr ? editorAr.getHTML() : data.content_ar
        const finalContentEn = editorEn ? editorEn.getHTML() : data.content_en

        post('/admin/about', {
            preserveScroll: true,
            data: {
                ...data,
                content_ar: finalContentAr,
                content_en: finalContentEn,
            },
            onSuccess: () => {
                setNewFiles([])
                setData(prev => ({
                    ...prev,
                    images: [],
                    deleted_images: [],
                }))
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                }
                setSuccessMessage(isRtl ? 'تم حفظ التعديلات بنجاح' : 'Saved successfully')
                setTimeout(() => setSuccessMessage(''), 4000)
            }
        })
    }

    const existingImages = about?.images || []

    return (
        <AdminSidebar>
            <Head title={trans('sidebar_about') + ' — ' + trans('app_name')} />
            <div dir={isRtl ? 'rtl' : 'ltr'} className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-950">{trans('sidebar_about')}</h1>
                        <p className="text-xs text-muted mt-1">{isRtl ? 'إدارة محتوى صفحة من نحن والصور التوضيحية الخاصة بها' : 'Manage About Us content and gallery images'}</p>
                    </div>
                </div>

                {(successMessage || flash?.success) && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center justify-between">
                        <span>{successMessage || flash?.success}</span>
                        <button type="button" onClick={() => setSuccessMessage('')} className="text-green-600 hover:text-green-950">&times;</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
                    {/* Content Section */}
                    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-secondary-100">
                        <div className="flex border-b border-secondary-200 bg-surface/40">
                            <button
                                type="button"
                                onClick={() => setActiveTab('ar')}
                                className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'ar' ? 'border-primary-900 text-primary-900 bg-white' : 'border-transparent text-secondary-600 hover:text-secondary-950'}`}
                            >
                                {trans('content_ar')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('en')}
                                className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'en' ? 'border-primary-900 text-primary-900 bg-white' : 'border-transparent text-secondary-600 hover:text-secondary-950'}`}
                            >
                                {trans('content_en')}
                            </button>
                        </div>
                        <div className="p-6">
                            {activeTab === 'ar' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-secondary-950">{trans('content_ar')}</label>
                                    <div className="border border-secondary-200 rounded-lg overflow-hidden" dir="rtl">
                                        <MenuBar editor={editorAr} trans={trans} isRtl={isRtl} />
                                        <EditorContent editor={editorAr} />
                                    </div>
                                    {errors.content_ar && <p className="text-xs text-error mt-1">{errors.content_ar}</p>}
                                </div>
                            )}
                            {activeTab === 'en' && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-secondary-950">{trans('content_en')}</label>
                                    <div className="border border-secondary-200 rounded-lg overflow-hidden" dir="ltr">
                                        <MenuBar editor={editorEn} trans={trans} isRtl={isRtl} />
                                        <EditorContent editor={editorEn} />
                                    </div>
                                    {errors.content_en && <p className="text-xs text-error mt-1">{errors.content_en}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Images Gallery Management */}
                    <div className="bg-white rounded-xl shadow-card p-6 border border-secondary-100 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-secondary-950">{trans('images')}</h2>
                            <p className="text-xs text-muted mt-0.5">{isRtl ? 'عرض وإدارة صور معرض صفحة من نحن' : 'Manage gallery images for the about page'}</p>
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-secondary-700 uppercase tracking-wider mb-3">
                                    {isRtl ? `الصور الحالية (${existingImages.length})` : `Current Images (${existingImages.length})`}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {existingImages.map((path, idx) => {
                                        const isDeleted = data.deleted_images.includes(path)
                                        return (
                                            <div
                                                key={idx}
                                                className={`relative group rounded-xl overflow-hidden border transition-all duration-200 ${
                                                    isDeleted ? 'border-red-300 bg-red-50/50 opacity-60' : 'border-secondary-200 bg-surface hover:shadow-md'
                                                }`}
                                            >
                                                <img src={`/storage/${path}`} alt={trans('about_image')} className="w-full h-36 object-cover" />
                                                
                                                {isDeleted ? (
                                                    <div className="absolute inset-0 bg-red-950/60 flex flex-col items-center justify-center p-2 text-center gap-2">
                                                        <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
                                                            {isRtl ? 'سيتم الحذف عند الحفظ' : 'Will be deleted'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDeleteExisting(path)}
                                                            className="px-2.5 py-1 text-xs bg-white text-secondary-900 rounded-lg font-medium hover:bg-secondary-100 transition-colors shadow-sm"
                                                        >
                                                            {isRtl ? 'إلغاء الحذف' : 'Undo Delete'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDeleteExisting(path)}
                                                            className="px-3 py-1.5 text-xs bg-error text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>{trans('delete')}</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* New Upload Previews */}
                        {newFiles.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-primary-900 uppercase tracking-wider mb-3">
                                    {isRtl ? `صور جديدة مُختارة (${newFiles.length})` : `Selected New Images (${newFiles.length})`}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {newFiles.map((file, idx) => (
                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-primary-200 bg-primary-50/20 shadow-xs">
                                            <img src={URL.createObjectURL(file)} alt="New preview" className="w-full h-36 object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewFile(idx)}
                                                className="absolute top-2 end-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow hover:bg-red-700 transition-colors"
                                                title={trans('delete')}
                                            >
                                                &times;
                                            </button>
                                            <div className="p-1.5 bg-white/90 backdrop-blur-xs text-[10px] text-secondary-700 truncate font-mono">
                                                {file.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Input Area */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-950 mb-2">{trans('add_images')}</label>
                            <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-900 transition-colors bg-surface/30">
                                <svg className="w-10 h-10 text-secondary-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                                <p className="text-xs text-secondary-700 mb-3 font-medium">
                                    {isRtl ? 'اضغط لاختيار صور من جهازك (يمكن اختيار أكثر من صورة)' : 'Click to select images from your device'}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="about-images-file-input"
                                />
                                <label
                                    htmlFor="about-images-file-input"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 text-secondary-800 rounded-lg text-xs font-semibold hover:bg-secondary-50 cursor-pointer shadow-xs transition-colors"
                                >
                                    <span>{trans('upload') || 'رفع الصور'}</span>
                                </label>
                            </div>
                            {errors.images && <p className="text-xs text-error mt-1">{errors.images}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-primary-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-950 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{processing ? trans('loading') : trans('save')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminSidebar>
    )
}

