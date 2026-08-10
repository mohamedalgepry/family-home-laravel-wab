const fs = require('fs');

const path = 'resources/js/Pages/Admin/Areas/AreaForm.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    ["isRtl ? 'المعلومات الأساسية' : 'Basic Info'", "trans('basic_information')"],
    ["isRtl ? 'الـ Hero والصور' : 'Hero & Images'", "trans('hero_and_images')"],
    ["isRtl ? 'المحتوى والمميزات' : 'Content & Features'", "trans('content_and_features')"],
    ["isRtl ? 'الأماكن القريبة' : 'Nearby Places'", "trans('nearby_places')"],
    ["isRtl ? 'الموقع والخريطة' : 'Location & Map'", "trans('location_and_map')"],
    ["isRtl ? 'الأسئلة الشائعة' : 'FAQ'", "trans('faq')"],
    ["isRtl ? 'السيو (SEO)' : 'SEO'", "trans('seo')"],
    ["isRtl ? 'المعلومات الأساسية' : 'Basic Information'", "trans('basic_information')"],
    ["isRtl ? 'وصف قصير (عربي)' : 'Short Description (AR)'", "trans('short_description_ar')"],
    ["isRtl ? 'وصف قصير (إنجليزي)' : 'Short Description (EN)'", "trans('short_description_en')"],
    ["isRtl ? 'المنطقة الرئيسية' : 'Parent Area'", "trans('parent_area')"],
    ["isRtl ? 'بدون (منطقة رئيسية)' : 'None (Root Area)'", "trans('none_root_area')"],
    ["isRtl ? 'قسم الـ Hero' : 'Hero Section'", "trans('hero_section')"],
    ["isRtl ? 'صورة الـ Hero الرئيسية' : 'Hero Cover Image'", "trans('hero_cover_image')"],
    ["isRtl ? 'عنوان الـ Hero (عربي)' : 'Hero Title (AR)'", "trans('hero_title_ar')"],
    ["isRtl ? 'عنوان الـ Hero (إنجليزي)' : 'Hero Title (EN)'", "trans('hero_title_en')"],
    ["isRtl ? 'وصف الـ Hero (عربي)' : 'Hero Description (AR)'", "trans('hero_description_ar')"],
    ["isRtl ? 'وصف الـ Hero (إنجليزي)' : 'Hero Description (EN)'", "trans('hero_description_en')"],
    ["isRtl ? 'عن المنطقة' : 'About Area'", "trans('about_area')"],
    ["isRtl ? 'نص عن المنطقة (عربي)' : 'About Area Text (AR)'", "trans('about_area_text_ar')"],
    ["isRtl ? 'نص عن المنطقة (إنجليزي)' : 'About Area Text (EN)'", "trans('about_area_text_en')"],
    ["isRtl ? 'مميزات المنطقة' : 'Area Features'", "trans('area_features')"],
    ["isRtl ? 'إضافة ميزة' : 'Add Feature'", "trans('add_feature')"],
    ["isRtl ? 'لا توجد مميزات مضافة.' : 'No features added.'", "trans('no_features_added')"],
    ["isRtl ? 'الأماكن القريبة والمهمة' : 'Nearby Places'", "trans('nearby_and_important_places')"],
    ["isRtl ? 'إضافة مكان' : 'Add Place'", "trans('add_place')"],
    ["isRtl ? 'لا توجد أماكن.' : 'No places.'", "trans('no_places')"],
    ["isRtl ? 'العنوان (عربي)' : 'Address (AR)'", "trans('address_ar')"],
    ["isRtl ? 'العنوان (إنجليزي)' : 'Address (EN)'", "trans('address_en')"],
    ["isRtl ? 'رابط خرائط جوجل (Iframe Src)' : 'Google Maps URL (Iframe Src)'", "trans('google_maps_url')"],
    ["isRtl ? 'إضافة سؤال' : 'Add Question'", "trans('add_question')"],
    ["isRtl ? 'لا توجد أسئلة.' : 'No FAQs.'", "trans('no_faqs')"],
    ["isRtl ? 'يمكنك لصق رابط الـ src من Google Maps Embed.' : 'You can paste the src URL from Google Maps Embed.'", "trans('map_url_help')"]
];

replacements.forEach(([search, replace]) => {
    content = content.split(search).join(replace);
});

fs.writeFileSync(path, content);
console.log('Done');
