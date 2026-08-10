const fs = require('fs');

const path = 'resources/js/Pages/Public/Areas/Show.jsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    ["isRtl ? 'منطقة عقارية' : 'Real Estate Region'", "trans('real_estate_region')"],
    ["isRtl ? `اعثر على أفضل الخيارات العقارية السكنية والتجارية والمشاريع الاستثمارية في منطقة ${area.name_ar}.` : `Find top residential, commercial properties, and investment projects in ${area.name_en}.`", "trans('find_properties_in_area', { name: isRtl ? area.name_ar : area.name_en })"],
    ["isRtl ? `اكتشف الحياة في ${area.name_ar}` : `Discover Life in ${area.name_en}`", "trans('discover_life_in', { name: isRtl ? area.name_ar : area.name_en })"],
    ["isRtl ? `تعرف على أبرز تفاصيل منطقة ${area.name_ar} ومميزاتها.` : `Learn more about the details and features of ${area.name_en}.`", "trans('learn_more_about_area', { name: isRtl ? area.name_ar : area.name_en })"],
    ["isRtl ? 'لماذا تختار هذه المنطقة؟' : 'Why choose this area?'", "trans('why_choose_this_area')"],
    ["isRtl ? 'لا توجد مميزات مضافة حالياً.' : 'No features added currently.'", "trans('no_features_added_currently')"],
    ["isRtl ? `العقارات المتاحة في ${area.name_ar}` : `Properties in ${area.name_en}`", "trans('properties_in_area', { name: isRtl ? area.name_ar : area.name_en })"],
    ["isRtl ? 'المشاريع' : 'Projects'", "trans('projects')"],
    ["isRtl ? 'لا توجد مشاريع متاحة.' : 'No projects available.'", "trans('no_projects_available')"],
    ["isRtl ? 'الوحدات' : 'Units'", "trans('units')"],
    ["isRtl ? 'لا توجد وحدات متاحة.' : 'No units available.'", "trans('no_units_available')"],
    ["isRtl ? 'الأماكن القريبة' : 'Nearby Places'", "trans('nearby_places')"],
    ["isRtl ? 'لا توجد أماكن قريبة مضافة.' : 'No nearby places added.'", "trans('no_nearby_places')"],
    ["isRtl ? 'الموقع على الخريطة' : 'Location on Map'", "trans('location_on_map')"],
    ["isRtl ? 'الخريطة غير متوفرة' : 'Map not available'", "trans('map_not_available')"],
    ["isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'", "trans('frequently_asked_questions')"],
    ["isRtl ? `كل ما تحتاج معرفته عن ${area.name_ar}` : `Everything you need to know about ${area.name_en}`", "trans('everything_about_area', { name: isRtl ? area.name_ar : area.name_en })"],
    ["isRtl ? 'مناطق قد تهمك' : 'Areas you might like'", "trans('areas_you_might_like')"],
    ["isRtl ? 'تصفح كل المناطق' : 'Explore all areas'", "trans('explore_all_areas')"]
];

replacements.forEach(([search, replace]) => {
    content = content.split(search).join(replace);
});

fs.writeFileSync(path, content);
console.log('Done');
