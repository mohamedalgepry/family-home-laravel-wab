import { Head, Link, createInertiaApp, router, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image$1 from "@tiptap/extension-image";
import axios from "axios";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { renderToString } from "react-dom/server";
import createServer from "@inertiajs/react/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/Utils/trans.js
var translations = {
	ar: {
		app_name: "فاميلي هوم",
		home: "الرئيسية",
		projects: "المشاريع",
		units: "الوحدات",
		deals: "الصفقات",
		articles: "المقالات والأخبار",
		about: "عنا",
		contact: "تواصل معنا",
		login: "تسجيل الدخول",
		logout: "تسجيل خروج",
		profile: "الملف الشخصي",
		dashboard: "لوحة التحكم",
		search: "بحث",
		no_results: "لا توجد نتائج",
		try_different_filters: "حاول تعديل الفلاتر",
		loading: "جارٍ التحميل...",
		save: "حفظ",
		cancel: "إلغاء",
		delete: "حذف",
		edit: "تعديل",
		create: "إضافة",
		update: "تحديث",
		confirm: "تأكيد",
		yes: "نعم",
		no: "لا",
		back: "رجوع",
		next: "التالي",
		previous: "السابق",
		all_rights_reserved: "جميع الحقوق محفوظة",
		language: "اللغة",
		arabic: "العربية",
		english: "الإنجليزية",
		read_more: "اقرأ المزيد",
		show_more: "عرض المزيد",
		show_less: "عرض أقل",
		views: "مشاهدة",
		share: "مشاركة",
		no_data: "لا توجد بيانات",
		confirm_delete: "هل أنت متأكد من الحذف؟",
		featured: "مميز",
		deals_page_title: "صفقات Family Home",
		deals_page_empty: "لا توجد صفقات حاليًا",
		hero_title: "ابحث عن منزل أحلامك",
		hero_subtitle: "آلاف العقارات في جميع أنحاء المملكة",
		popular_searches: "عمليات البحث الشائعة",
		featured_units: "وحدات مميزة",
		unit_whatsapp_inquiry: "مرحباً فاميلي هوم، أود الاستفسار عن العقار: :name",
		browse: "تصفح",
		detailed_comparison: "مقارنة تفصيلية",
		compare_properties: "قارن بين العقارات",
		compare_options_subtitle: "قارن بين الخيارات واختر الأفضل",
		zoom: "تكبير",
		unit_message_sent_success: "تم إرسال رسالتك بنجاح، وسيتواصل معك المستشار العقاري قريباً.",
		contact_message_sent_success: "تم إرسال رسالتك بنجاح، وسنتواصل معك في أقرب وقت.",
		featured_units_subtitle: "أفضل الفرص الاستثمارية والسكنية المختارة خصيصاً لك",
		latest_units_subtitle: "أحدث العقارات المضافة حديثاً في مصر",
		view_all: "عرض الكل",
		currency_egp: "ج.م",
		unit_sqm: "م²",
		years: "سنوات",
		compared: "تمت الإضافة",
		contact_via_whatsapp: "تواصل عبر الواتساب",
		inquire: "استفسار",
		call_us: "اتصل بنا",
		whatsapp_chat: "محادثة واتساب",
		send_email: "إرسال بريد إلكتروني",
		latest_units: "أحدث الوحدات",
		quick_links: "روابط سريعة",
		contact_info: "معلومات التواصل",
		follow_us: "تابعنا",
		no_transactions: "لا توجد معاملات",
		site_title: "Family Home",
		compare: "مقارنة",
		feature: "ميزة",
		items: "عناصر",
		images: "الصور",
		price: "السعر",
		area_sqm: "المساحة (م²)",
		rooms: "الغرف",
		transaction: "نوع المعاملة",
		sale: "بيع",
		rent: "إيجار",
		description: "الوصف",
		my_profile: "ملفي الشخصي",
		units_count: "عدد الوحدات",
		location: "الموقع",
		name: "الاسم",
		email: "البريد الإلكتروني",
		password: "كلمة المرور",
		type: "النوع",
		area: "المنطقة",
		phone: "رقم الهاتف",
		whatsapp: "رقم الواتساب",
		facebook: "رابط فيسبوك",
		avatar: "الصورة الشخصية",
		upload_avatar: "رفع صورة",
		remove_avatar: "حذف الصورة",
		role: "الدور",
		all_roles: "جميع الأدوار",
		admin: "مدير النظام",
		manager: "مدير",
		agent: "وكيل",
		status: "الحالة",
		active: "نشط",
		inactive: "غير نشط",
		actions: "الإجراءات",
		deactivate: "تعطيل",
		activate: "تفعيل",
		transfer_projects: "نقل المشاريع",
		select_manager: "اختر المدير",
		select_agents: "اختر الوكلاء",
		no_agents_available: "لا يوجد وكلاء متاحين",
		transfer_from: "من",
		transfer_to: "إلى",
		assign_agents: "تعيين وكلاء",
		assign: "تعيين",
		current_images: "الصور الحالية",
		upload_new_images: "رفع صور جديدة",
		primary_image: "الصورة الرئيسية",
		primary_badge: "رئيسية",
		secondary_images: "الصور الفرعية",
		add_more_images: "إضافة صور",
		set_as_primary: "تعيين كرئيسية",
		remove_image: "حذف الصورة",
		max_images: "الحد الأقصى 20 صورة",
		video_url_help: "رابط يوتيوب أو فيميو",
		add: "إضافة",
		seo: "تحسين محركات البحث (SEO)",
		meta_description: "وصف الميتا",
		alt_text: "النص البديل",
		keywords: "الكلمات المفتاحية",
		latitude: "خط العرض",
		longitude: "خط الطول",
		location_address: "العنوان",
		pinned: "مثبت",
		not_pinned: "غير مثبت",
		is_deal: "صفقة",
		all: "الكل",
		page_title: "الوحدات العقارية",
		units_in_project: "الوحدات في هذا المشروع",
		contact_agent: "تواصل مع الوسيط",
		similar_units: "وحدات مشابهة",
		your_name: "اسمك",
		your_phone: "رقم هاتفك",
		your_email: "بريدك الإلكتروني",
		your_message: "رسالتك",
		send_message: "إرسال رسالة",
		blog: "المقالات والأخبار",
		all_categories: "جميع التصنيفات",
		published: "منشور",
		draft: "مسودة",
		unpublish: "إلغاء النشر",
		publish: "نشر",
		title: "العنوان",
		content: "المحتوى",
		excerpt: "المقدمة",
		category: "التصنيف",
		add_images: "إضافة صور",
		seo_section_title: "تحسين محركات البحث",
		content_ar: "المحتوى (عربي)",
		content_en: "المحتوى (إنجليزي)",
		lang_en: "EN",
		lang_ar: "ع",
		toggle_menu: "فتح القائمة",
		close: "إغلاق",
		watch_video: "مشاهدة الفيديو",
		transfer: "نقل",
		all_managers: "جميع المدراء",
		monthly_reset_confirm_title: "تأكيد إعادة التعيين الشهري",
		monthly_reset_confirm_text: "سيتم إعادة تعيين جميع أرصدة المدراء إلى رصيدهم الشهري الأولي. لا يمكن التراجع عن هذا الإجراء.",
		search_projects: "ابحث عن مشروع",
		clear_filters: "مسح الفلاتر",
		projects_page_title: "المشاريع العقارية",
		no_projects: "لا توجد مشاريع",
		max_video_size: "الحد الأقصى لحجم الفيديو (ميغابايت)",
		address: "العنوان",
		social_facebook: "فيسبوك",
		social_instagram: "إنستغرام",
		social_twitter: "تويتر",
		social_linkedin: "لينكد إن",
		social_facebook_label: "فيسبوك",
		social_instagram_label: "إنستغرام",
		social_twitter_label: "تويتر",
		social_linkedin_label: "لينكد إن",
		about_gallery_image: "صورة من معرضنا",
		article_image: "صورة المقال",
		project_image: "صورة المشروع",
		about_image: "صورة عنا",
		about_image_preview: "معاينة صورة عنا",
		previous_page: "الصفحة السابقة",
		next_page: "التالية",
		transaction_type: "نوع المعاملة",
		allocate: "تخصيص",
		daily_deduction: "الخصم اليومي",
		daily_deduction_value: "قيمة الخصم اليومي",
		monthly_reset_day: "يوم إعادة التعيين",
		monthly_reset: "إعادة التعيين الشهرية",
		automatic: "تلقائي",
		settings_points: "إعدادات النقاط",
		settings_auto_delete: "الحذف التلقائي",
		auto_delete_days: "مدة الحذف التلقائي (أيام)",
		settings_video_limit: "الحد الأقصى لحجم الفيديو",
		settings_contact: "بيانات التواصل",
		settings_social: "روابط السوشيال ميديا",
		settings_logo: "شعار الموقع",
		admin_adjust: "تعديل أدمن",
		transaction_date: "تاريخ المعاملة",
		performed_by: "تم بواسطة",
		target_unit: "الوحدة المستهدفة",
		balance_after: "الرصيد بعد",
		notes: "ملاحظات",
		reset: "إعادة تعيين",
		date_from: "من تاريخ",
		date_to: "إلى تاريخ",
		current_balance: "الرصيد الحالي",
		initial_balance: "الرصيد الأولي",
		last_update: "آخر تحديث",
		managers_balances: "أرصدة المدراء",
		points_ledger: "سجل النقاط",
		allocate_points: "تخصيص نقاط",
		available_balance: "الرصيد المتاح",
		points: "النقاط",
		priority_points: "نقاط الأولوية",
		settings: "الإعدادات",
		disabled: "معطل",
		day: "يوم",
		auto: "تلقائي",
		showing: "عرض",
		of: "من",
		nav_group_main: "الرئيسية",
		nav_group_listings: "العقارات والمحتوى",
		nav_group_taxonomies: "التصنيفات والمعايير",
		nav_group_users: "المستخدمين والعمليات",
		nav_group_system: "النظام والإعدادات",
		sidebar_units: "الوحدات",
		sidebar_projects: "المشاريع",
		sidebar_points: "النقاط",
		sidebar_users: "المستخدمين",
		sidebar_messages: "الرسائل",
		message_details: "تفاصيل الرسالة",
		client_name: "اسم العميل",
		client_phone: "رقم الهاتف",
		client_email: "البريد الإلكتروني",
		deleting: "جارٍ الحذف...",
		disable_sound: "تعطيل الصوت",
		enable_sound: "تفعيل الصوت",
		login_button: "تسجيل الدخول",
		back_to_login: "العودة إلى تسجيل الدخول",
		email_placeholder: "بريدك الإلكتروني",
		clear: "مسح",
		price_per_sqm: "سعر المتر",
		finishing: "التشطيب",
		comparison_description: "قارن بين الوحدات والمشاريع العقارية بسهولة",
		deals_description: "أفضل الصفقات العقارية المميزة",
		projects_description: "تصفح أحدث المشاريع العقارية",
		articles_description: "آخر المقارلات والأخبار العقارية",
		contact_description: "تواصل معنا",
		home_description: "Family Home — منصة العقارات الرائدة",
		unit_type: "نوع الوحدة",
		no_agent: "بدون وسيط",
		sidebar_notifications: "الإشعارات",
		sidebar_articles: "المقارلات والاخبار",
		sidebar_settings: "الإعدادات",
		sidebar_about: "صفحة عنا",
		sidebar_activity_log: "سجل النشاطات",
		sidebar_categories: "تصنيفات المقارلات والاخبار",
		article_categories: "تصنيفات المقارلات والاخبار",
		created_at: "تاريخ الإنشاء",
		sidebar_dashboard: "لوحة التحكم",
		add_unit: "إضافة وحدة",
		basic_info: "معلومات أساسية",
		media: "الوسائط",
		video: "الفيديو",
		bathrooms: "الحمامات",
		floor: "الطابق",
		project: "المشروع",
		add_project: "إضافة مشروع",
		edit_project: "تعديل المشروع",
		edit_unit: "تعديل الوحدة",
		no_managers: "لا يوجد مدراء",
		brand_name: "فاميلي هوم",
		brand_tagline: "منصة التسويق العقاري الأولى",
		name_ar: "الاسم (عربي)",
		name_en: "الاسم (إنجليزي)",
		sidebar_areas: "المناطق",
		sidebar_unit_types: "أنواع الوحدات",
		sort_order: "الترتيب",
		list: "قائمة نقطية",
		ordered_list: "قائمة رقمية",
		title_ar: "العنوان (عربي)",
		title_en: "العنوان (إنجليزي)",
		excerpt_ar: "المقدمة (عربي)",
		excerpt_en: "المقدمة (إنجليزي)",
		position_inside: "داخل النص",
		position_header: "في الترويسة",
		size_small: "صغير",
		size_medium: "متوسط",
		size_large: "كبير",
		size: "الحجم",
		cover_image: "صورة الغلاف",
		upload: "رفع صورة",
		keywords_hint: "اضغط Enter لإضافة الكلمة المفتاحية",
		payment_method: "طريقة الدفع",
		cash: "نقداً",
		installment: "تقسيط",
		both: "نقداً أو تقسيط",
		down_payment: "المقدم",
		installment_years: "سنوات التقسيط",
		finishing_type: "نوع التشطيب",
		features: "المميزات",
		nav_group_main: "الرئيسية",
		nav_group_listings: "العقارات والمحتوى",
		nav_group_taxonomies: "التصنيفات والمعايير",
		nav_group_users: "المستخدمين والعمليات",
		nav_group_system: "النظام والإعدادات",
		sidebar_dashboard: "لوحة التحكم",
		sidebar_projects: "المشاريع",
		sidebar_units: "الوحدات",
		sidebar_articles: "المقالات والأخبار",
		sidebar_areas: "المناطق",
		sidebar_unit_types: "أنواع الوحدات",
		sidebar_features: "المميزات",
		sidebar_finishing_types: "أنواع التشطيب",
		sidebar_categories: "تصنيفات المقالات والأخبار",
		sidebar_messages: "الرسائل",
		sidebar_notifications: "الإشعارات",
		sidebar_users: "المستخدمين",
		sidebar_points: "النقاط",
		sidebar_settings: "الإعدادات",
		sidebar_seo_pages: "SEO الصفحات",
		sidebar_about: "صفحة عنا",
		sidebar_activity_log: "سجل النشاطات",
		payment_details: "تفاصيل الدفع",
		created: "تم الإنشاء",
		updated: "تم التحديث",
		deleted: "تم الحذف",
		activity_log: "سجل النشاطات",
		event: "الحدث",
		date: "التاريخ",
		user: "المستخدم",
		model: "النموذج",
		remove: "إزالة",
		add_new: "إضافة جديد",
		slug: "الرابط الدائم",
		stats_total_projects: "إجمالي المشاريع",
		stats_total_units: "إجمالي الوحدات",
		stats_total_users: "إجمالي المستخدمين",
		stats_total_messages: "إجمالي الرسائل",
		dashboard_title: "الرئيسية",
		visits_chart: "رسم بياني للزيارات",
		top_projects: "أبرز المشاريع",
		icon: "الأيقونة",
		ledger: "السجل",
		ar: "عربي",
		en: "إنجليزي",
		assign_agents_to_manager: "تعيين وكلاء للمدير",
		admin_panel: "لوحة التحكم",
		add_user: "إضافة مستخدم",
		delete_user: "حذف المستخدم",
		confirm_delete_user: "هل أنت متأكد من رغبتك في حذف المستخدم :name؟",
		user_has_relations_warning: "هذا المستخدم يمتلك بيانات مرتبطة بحسابه:",
		transfer_data_to: "نقل البيانات إلى:",
		force_delete_all: "حذف نهائي (سيمسح جميع البيانات المرتبطة)",
		delete_confirm: "تأكيد الحذف",
		user_deleted: "تم حذف المستخدم بنجاح",
		user_created: "تم إنشاء المستخدم بنجاح",
		agents: "الوكلاء (الموظفين)",
		adjust_points: "تعديل النقاط",
		run_daily_deduct: "تشغيل الخصم اليومي",
		daily_deduct_success: "تم تنفيذ الخصم اليومي بنجاح",
		password_confirmation: "تأكيد كلمة المرور",
		role_admin: "مدير النظام",
		role_manager: "مدير",
		role_agent: "وكيل / موظف مبيعات",
		status_pending: "لم يُرد بعد",
		status_replied: "تم الرد",
		mark_as_replied: "تمييز كـ \"تم الرد\"",
		filter_by_agent: "تصفية حسب الوسيط",
		client_info: "بيانات العميل",
		message_content: "محتوى الرسالة",
		sent_at: "تاريخ الإرسال",
		replied_at: "تاريخ الرد",
		no_messages: "لا توجد رسائل",
		all_agents: "جميع الوسطاء",
		unit: "الوحدة",
		change_password: "تغيير كلمة السر",
		password_changed: "تم تغيير كلمة السر بنجاح",
		new_password: "كلمة السر الجديدة",
		confirm_password: "تأكيد كلمة المرور",
		change_password_hint: "اترك حقول كلمة السر فارغة إذا كنت لا ترغب في تغيير كلمة السر الحالية",
		facebook_link: "رابط حساب الفيسبوك",
		sidebar_seo_pages: "SEO الصفحات",
		seo_pages_title: "إدارة SEO الصفحات الثابتة",
		seo_pages_desc: "التحكم في الكلمات المفتاحية والعناوين والأوصاف لمحركات البحث",
		seo_page_settings: "إعدادات الصفحة",
		seo_page_home: "الرئيسية (Home)",
		seo_page_units_index: "الوحدات (Units)",
		seo_page_projects_index: "المشاريع (Projects)",
		seo_page_deals: "الصفقات المميزة (Deals)",
		seo_page_articles_index: "المقالات والأخبار (Articles & News)",
		seo_page_about: "عن الشركة (About)",
		seo_page_contact: "التواصل (Contact)",
		seo_page_comparison: "المقارنة (Comparison)",
		meta_title_ar: "العنوان (عربي)",
		meta_title_en: "العنوان (English)",
		meta_description_ar: "الوصف (عربي)",
		meta_description_en: "الوصف (English)",
		keywords_ar: "الكلمات المفتاحية (عربي)",
		keywords_en: "الكلمات المفتاحية (English)",
		add_keyword: "إضافة",
		today: "اليوم",
		yesterday: "أمس",
		this_week: "هذا الأسبوع",
		earlier: "سابقاً",
		notifications_subtitle: "آخر التحديثات والإشعارات الهامة",
		mark_all_read: "تحديد الكل كمقروء",
		confirm_clear_all: "تأكيد حذف الكل",
		clear_all: "حذف الكل",
		unread: "غير مقروءة",
		expiry: "انتهاء الصلاحية",
		no_unread_notifications: "لا توجد إشعارات غير مقروءة",
		no_expiry_notifications: "لا توجد إشعارات انتهاء صلاحية",
		no_notifications_yet: "صندوق الإشعارات فارغ",
		notifications_empty_hint: "عند اقتراب صلاحية وحدة أو مشروع، أو عند استلام رسالة جديدة، ستظهر الإشعارات هنا.",
		new_badge: "جديد",
		days_remaining: "متبقي :count أيام",
		mark_read: "تحديد كمقروء",
		extend: "تمديد",
		delete_notification: "حذف الإشعار",
		expires_label: "تاريخ الانتهاء:",
		by_label: "بواسطة:"
	},
	en: {
		app_name: "Family Home",
		home: "Home",
		projects: "Projects",
		units: "Units",
		deals: "Deals",
		articles: "Articles & News",
		about: "About",
		contact: "Contact Us",
		login: "Login",
		logout: "Logout",
		profile: "Profile",
		dashboard: "Dashboard",
		search: "Search",
		no_results: "No results found",
		try_different_filters: "Try different filters",
		loading: "Loading...",
		save: "Save",
		cancel: "Cancel",
		delete: "Delete",
		edit: "Edit",
		create: "Create",
		update: "Update",
		confirm: "Confirm",
		yes: "Yes",
		no: "No",
		back: "Back",
		next: "Next",
		previous: "Previous",
		all_rights_reserved: "All Rights Reserved",
		language: "Language",
		arabic: "Arabic",
		english: "English",
		read_more: "Read More",
		show_more: "Show More",
		show_less: "Show Less",
		views: "Views",
		share: "Share",
		no_data: "No data available",
		confirm_delete: "Are you sure you want to delete?",
		featured: "Featured",
		deals_page_title: "Family Home Deals",
		deals_page_empty: "No deals available at the moment",
		hero_title: "Find Your Dream Home",
		hero_subtitle: "Thousands of properties across the kingdom",
		popular_searches: "Popular Searches",
		featured_units: "Featured Units",
		unit_whatsapp_inquiry: "Hello Family Home, I would like to inquire about: :name",
		browse: "Browse",
		detailed_comparison: "Detailed comparison",
		compare_properties: "Compare Properties",
		compare_options_subtitle: "Compare options and pick the best",
		zoom: "Zoom",
		unit_message_sent_success: "Your message has been sent successfully! The agent will contact you soon.",
		contact_message_sent_success: "Your message has been sent successfully!",
		featured_units_subtitle: "Handpicked investment and residential opportunities",
		latest_units_subtitle: "Recently added real estate properties",
		view_all: "View All",
		currency_egp: "EGP",
		unit_sqm: "m²",
		years: "yrs",
		compared: "Compared",
		contact_via_whatsapp: "Contact via WhatsApp",
		inquire: "Inquire",
		call_us: "Call us",
		whatsapp_chat: "WhatsApp Chat",
		send_email: "Send email",
		latest_units: "Latest Units",
		quick_links: "Quick Links",
		contact_info: "Contact Info",
		follow_us: "Follow Us",
		no_transactions: "No transactions found",
		site_title: "Family Home",
		compare: "Compare",
		feature: "Feature",
		items: "Items",
		images: "Images",
		price: "Price",
		area_sqm: "Area (sqm)",
		rooms: "Rooms",
		transaction: "Transaction Type",
		sale: "Sale",
		rent: "Rent",
		description: "Description",
		my_profile: "My Profile",
		units_count: "Number of Units",
		location: "Location",
		name: "Name",
		email: "Email",
		password: "Password",
		type: "Type",
		area: "Area",
		phone: "Phone Number",
		whatsapp: "WhatsApp Number",
		facebook: "Facebook Link",
		avatar: "Avatar",
		upload_avatar: "Upload Image",
		remove_avatar: "Remove Image",
		role: "Role",
		all_roles: "All Roles",
		admin: "Admin",
		manager: "Manager",
		agent: "Agent",
		status: "Status",
		active: "Active",
		inactive: "Inactive",
		actions: "Actions",
		deactivate: "Deactivate",
		activate: "Activate",
		transfer_projects: "Transfer Projects",
		select_manager: "Select Manager",
		select_agents: "Select Agents",
		no_agents_available: "No agents available",
		transfer_from: "From",
		transfer_to: "To",
		assign_agents: "Assign Agents",
		assign: "Assign",
		current_images: "Current Images",
		upload_new_images: "Upload New Images",
		primary_image: "Primary Image",
		primary_badge: "Primary",
		secondary_images: "Secondary Images",
		add_more_images: "Add Images",
		set_as_primary: "Set as Primary",
		remove_image: "Remove Image",
		max_images: "Max 20 images",
		video_url_help: "YouTube or Vimeo URL",
		add: "Add",
		seo: "SEO",
		meta_description: "Meta Description",
		alt_text: "Alt Text",
		keywords: "Keywords",
		latitude: "Latitude",
		longitude: "Longitude",
		location_address: "Address",
		pinned: "Pinned",
		not_pinned: "Not Pinned",
		is_deal: "Deal",
		all: "All",
		page_title: "Real Estate Units",
		units_in_project: "Units in This Project",
		contact_agent: "Contact Agent",
		similar_units: "Similar Units",
		your_name: "Your Name",
		your_phone: "Your Phone",
		your_email: "Your Email",
		your_message: "Your Message",
		send_message: "Send Message",
		blog: "Blog",
		all_categories: "All Categories",
		published: "Published",
		draft: "Draft",
		unpublish: "Unpublish",
		publish: "Publish",
		title: "Title",
		content: "Content",
		excerpt: "Excerpt",
		category: "Category",
		add_images: "Add Images",
		alt_text: "Alt Text",
		seo_section_title: "SEO",
		content_ar: "Content (Arabic)",
		content_en: "Content (English)",
		lang_en: "EN",
		lang_ar: "AR",
		toggle_menu: "Toggle menu",
		close: "Close",
		watch_video: "Watch Video",
		transfer: "Transfer",
		all_managers: "All Managers",
		monthly_reset_confirm_title: "Confirm Monthly Reset",
		monthly_reset_confirm_text: "This will reset all managers points balances to their initial monthly balance. This action cannot be undone.",
		search_projects: "Search projects",
		clear_filters: "Clear Filters",
		projects_page_title: "Real Estate Projects",
		no_projects: "No projects available",
		max_video_size: "Max Video Size (MB)",
		address: "Address",
		social_facebook: "Facebook",
		social_instagram: "Instagram",
		social_twitter: "Twitter",
		social_linkedin: "LinkedIn",
		social_facebook_label: "Facebook",
		social_instagram_label: "Instagram",
		social_twitter_label: "Twitter",
		social_linkedin_label: "LinkedIn",
		about_gallery_image: "Gallery image",
		article_image: "Article image",
		project_image: "Project image",
		about_image: "About image",
		about_image_preview: "About image preview",
		previous_page: "Previous page",
		next_page: "Next page",
		transaction_type: "Transaction Type",
		allocate: "Allocate",
		daily_deduction: "Daily Deduction",
		daily_deduction_value: "Daily Deduction Value",
		monthly_reset_day: "Reset Day",
		monthly_reset: "Monthly Reset",
		automatic: "Automatic",
		settings_points: "Points Settings",
		settings_auto_delete: "Auto Delete",
		auto_delete_days: "Auto Delete Duration (Days)",
		settings_video_limit: "Max Video Size",
		settings_contact: "Contact Info",
		settings_social: "Social Media Links",
		settings_logo: "Site Logo",
		admin_adjust: "Admin Adjustment",
		transaction_date: "Transaction Date",
		performed_by: "Performed By",
		target_unit: "Target Unit",
		balance_after: "Balance After",
		notes: "Notes",
		reset: "Reset",
		date_from: "Date From",
		date_to: "Date To",
		current_balance: "Current Balance",
		initial_balance: "Initial Balance",
		last_update: "Last Update",
		managers_balances: "Manager Balances",
		points_ledger: "Points Ledger",
		allocate_points: "Allocate Points",
		available_balance: "Available Balance",
		points: "Points",
		priority_points: "Priority Points",
		settings: "Settings",
		disabled: "Disabled",
		day: "Day",
		auto: "Auto",
		showing: "Showing",
		of: "of",
		nav_group_main: "Main",
		nav_group_listings: "Listings & Content",
		nav_group_taxonomies: "Taxonomies & Attributes",
		nav_group_users: "Users & Operations",
		nav_group_system: "System & Settings",
		sidebar_units: "Units",
		sidebar_projects: "Projects",
		sidebar_points: "Points",
		sidebar_users: "Users",
		sidebar_messages: "Messages",
		message_details: "Message Details",
		client_name: "Client Name",
		client_phone: "Phone Number",
		client_email: "Email Address",
		deleting: "Deleting...",
		disable_sound: "Disable Sound",
		enable_sound: "Enable Sound",
		login_button: "Sign In",
		back_to_login: "Back to Login",
		email_placeholder: "Your Email",
		clear: "Clear",
		price_per_sqm: "Price per Sqm",
		finishing: "Finishing",
		comparison_description: "Compare properties and projects side by side",
		deals_description: "Best featured real estate deals",
		projects_description: "Browse the latest real estate projects",
		articles_description: "Latest real estate articles and news",
		contact_description: "Contact Us",
		home_description: "Family Home — Leading Real Estate Platform",
		unit_type: "Unit Type",
		no_agent: "No Agent",
		sidebar_notifications: "Notifications",
		sidebar_articles: "Articles",
		sidebar_settings: "Settings",
		sidebar_about: "About Page",
		sidebar_activity_log: "Activity Log",
		sidebar_categories: "Article Categories",
		article_categories: "Article Categories",
		created_at: "Created At",
		sidebar_dashboard: "Dashboard",
		add_unit: "Add Unit",
		basic_info: "Basic Info",
		media: "Media",
		seo: "SEO",
		video: "Video",
		bathrooms: "Bathrooms",
		floor: "Floor",
		project: "Project",
		add_project: "Add Project",
		edit_project: "Edit Project",
		edit_unit: "Edit Unit",
		no_managers: "No managers found",
		brand_name: "Family Home",
		brand_tagline: "The Premier Real Estate Platform",
		name_ar: "Name (Arabic)",
		name_en: "Name (English)",
		sidebar_areas: "Areas",
		sidebar_unit_types: "Unit Types",
		sort_order: "Sort Order",
		list: "Bulleted List",
		ordered_list: "Numbered List",
		title_ar: "Title (Arabic)",
		title_en: "Title (English)",
		excerpt_ar: "Excerpt (Arabic)",
		excerpt_en: "Excerpt (English)",
		position_inside: "Inside Text",
		position_header: "Header",
		size_small: "Small",
		size_medium: "Medium",
		size_large: "Large",
		size: "Size",
		cover_image: "Cover Image",
		upload: "Upload Image",
		keywords_hint: "Press Enter to add keyword",
		payment_method: "Payment Method",
		cash: "Cash",
		installment: "Installment",
		both: "Cash & Installment",
		down_payment: "Down Payment",
		installment_years: "Installment Years",
		finishing_type: "Finishing Type",
		features: "Features",
		nav_group_main: "MAIN",
		nav_group_listings: "LISTINGS & CONTENT",
		nav_group_taxonomies: "TAXONOMIES & ATTRIBUTES",
		nav_group_users: "USERS & OPERATIONS",
		nav_group_system: "SYSTEM & SETTINGS",
		sidebar_dashboard: "Dashboard",
		sidebar_projects: "Projects",
		sidebar_units: "Units",
		sidebar_articles: "Articles & News",
		sidebar_areas: "Areas",
		sidebar_unit_types: "Unit Types",
		sidebar_features: "Features",
		sidebar_finishing_types: "Finishing Types",
		sidebar_categories: "Articles & News Categories",
		sidebar_messages: "Messages",
		sidebar_notifications: "Notifications",
		sidebar_users: "Users",
		sidebar_points: "Points",
		sidebar_settings: "Settings",
		sidebar_seo_pages: "SEO Pages",
		sidebar_about: "About Page",
		sidebar_activity_log: "Activity Log",
		payment_details: "Payment Details",
		created: "Created",
		updated: "Updated",
		deleted: "Deleted",
		activity_log: "Activity Log",
		event: "Event",
		date: "Date",
		user: "User",
		model: "Model",
		remove: "Remove",
		add_new: "Add New",
		slug: "Slug",
		stats_total_projects: "Total Projects",
		stats_total_units: "Total Units",
		stats_total_users: "Total Users",
		stats_total_messages: "Total Messages",
		dashboard_title: "Dashboard",
		visits_chart: "Visits Chart",
		top_projects: "Top Projects",
		icon: "Icon",
		ledger: "Ledger",
		ar: "Arabic",
		en: "English",
		assign_agents_to_manager: "Assign Agents to Manager",
		admin_panel: "Admin Panel",
		add_user: "Add User",
		delete_user: "Delete User",
		confirm_delete_user: "Are you sure you want to delete user :name?",
		user_has_relations_warning: "This user has associated data:",
		transfer_data_to: "Transfer data to:",
		force_delete_all: "Force delete (will remove all associated data)",
		delete_confirm: "Confirm Delete",
		user_deleted: "User deleted successfully",
		user_created: "User created successfully",
		agents: "Agents",
		adjust_points: "Adjust Points",
		run_daily_deduct: "Run Daily Deduction",
		daily_deduct_success: "Daily deduction executed successfully",
		password_confirmation: "Confirm Password",
		role_admin: "Admin System Manager",
		role_manager: "Manager",
		role_agent: "Agent / Sales Rep",
		status_pending: "Pending",
		status_replied: "Replied",
		mark_as_replied: "Mark as Replied",
		filter_by_agent: "Filter by Agent",
		client_info: "Client Info",
		message_content: "Message Content",
		sent_at: "Sent At",
		replied_at: "Replied At",
		no_messages: "No messages",
		all_agents: "All Agents",
		unit: "Unit",
		change_password: "Change Password",
		password_changed: "Password updated successfully",
		new_password: "New Password",
		confirm_password: "Confirm Password",
		change_password_hint: "Leave password fields blank if you do not wish to change your current password",
		facebook_link: "Facebook Account Link",
		sidebar_seo_pages: "SEO Pages",
		seo_pages_title: "Static Pages SEO Management",
		seo_pages_desc: "Control page meta titles, descriptions, and keywords for search engines",
		seo_page_settings: "Page Settings",
		seo_page_home: "Home Page",
		seo_page_units_index: "Units Page",
		seo_page_projects_index: "Projects Page",
		seo_page_deals: "Deals Page",
		seo_page_articles_index: "Articles & News Page",
		seo_page_about: "About Page",
		seo_page_contact: "Contact Page",
		seo_page_comparison: "Comparison Page",
		meta_title_ar: "Title (Arabic)",
		meta_title_en: "Title (English)",
		meta_description_ar: "Description (Arabic)",
		meta_description_en: "Description (English)",
		keywords_ar: "Keywords (Arabic)",
		keywords_en: "Keywords (English)",
		add_keyword: "Add",
		today: "Today",
		yesterday: "Yesterday",
		this_week: "This Week",
		earlier: "Earlier",
		notifications_subtitle: "Latest updates and important alerts",
		mark_all_read: "Mark all read",
		confirm_clear_all: "Confirm Clear",
		clear_all: "Clear all",
		unread: "Unread",
		expiry: "Expiry",
		no_unread_notifications: "No unread notifications",
		no_expiry_notifications: "No expiry notifications",
		no_notifications_yet: "No notifications yet",
		notifications_empty_hint: "When a unit or project is about to expire or a new message arrives, notifications will appear here.",
		new_badge: "NEW",
		days_remaining: ":countd",
		mark_read: "Mark read",
		extend: "Extend",
		delete_notification: "Delete notification",
		expires_label: "Expires:",
		by_label: "By:"
	}
};
function useTrans(locale) {
	const lang = translations[locale] || translations.en;
	return (key, replacements = {}) => {
		let text = lang[key];
		if (!text) {
			const cleanKey = key.includes(".") ? key.split(".").pop() : key;
			text = lang[cleanKey] || cleanKey.replace(/[_-]/g, " ");
		}
		for (const [k, v] of Object.entries(replacements)) text = text.replace(`:${k}`, v);
		return text;
	};
}
//#endregion
//#region resources/js/Components/Layout/AdminSidebar.jsx
var NAV_GROUPS = [
	{
		key: "nav_group_main",
		items: [{
			key: "sidebar_dashboard",
			href: "/admin",
			icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		}]
	},
	{
		key: "nav_group_listings",
		items: [
			{
				key: "sidebar_units",
				href: "/admin/units",
				icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
			},
			{
				key: "sidebar_projects",
				href: "/admin/projects",
				icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
			},
			{
				key: "sidebar_articles",
				href: "/admin/articles",
				scope: "admin",
				icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
			}
		]
	},
	{
		key: "nav_group_taxonomies",
		items: [
			{
				key: "sidebar_areas",
				href: "/admin/areas",
				scope: "admin",
				icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
			},
			{
				key: "sidebar_unit_types",
				href: "/admin/unit-types",
				scope: "admin",
				icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
			},
			{
				key: "sidebar_features",
				href: "/admin/features",
				scope: "admin",
				icon: "M5 13l4 4L19 7"
			},
			{
				key: "sidebar_finishing_types",
				href: "/admin/finishing-types",
				scope: "admin",
				icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
			},
			{
				key: "sidebar_categories",
				href: "/admin/categories",
				scope: "admin",
				icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
			}
		]
	},
	{
		key: "nav_group_users",
		items: [
			{
				key: "sidebar_messages",
				href: "/admin/messages",
				icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
			},
			{
				key: "sidebar_notifications",
				href: "/admin/notifications",
				icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
			},
			{
				key: "sidebar_users",
				href: "/admin/users",
				scope: "admin",
				icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
			},
			{
				key: "sidebar_points",
				href: "/admin/points",
				scope: "manager",
				icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			}
		]
	},
	{
		key: "nav_group_system",
		items: [
			{
				key: "sidebar_settings",
				href: "/admin/settings",
				scope: "admin",
				icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			},
			{
				key: "sidebar_seo_pages",
				href: "/admin/seo-pages",
				scope: "admin",
				icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
			},
			{
				key: "sidebar_about",
				href: "/admin/about",
				scope: "admin",
				icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			}
		]
	}
];
function playNotificationSound() {
	try {
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const now = ctx.currentTime;
		const gain = ctx.createGain();
		gain.connect(ctx.destination);
		gain.gain.setValueAtTime(.15, now);
		gain.gain.exponentialRampToValueAtTime(.01, now + .4);
		const osc1 = ctx.createOscillator();
		osc1.type = "sine";
		osc1.frequency.setValueAtTime(800, now);
		osc1.connect(gain);
		osc1.start(now);
		osc1.stop(now + .15);
		const osc2 = ctx.createOscillator();
		osc2.type = "sine";
		osc2.frequency.setValueAtTime(1e3, now + .15);
		osc2.connect(gain);
		osc2.start(now + .15);
		osc2.stop(now + .4);
	} catch {}
}
function AdminSidebar({ children }) {
	const { url, locale, auth, unread_notifications_count: initialCount, settings, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const role = auth?.user?.role;
	const [mobileOpen, setMobileOpen] = useState(false);
	const [avatarFailed, setAvatarFailed] = useState(false);
	const [liveNotifCount, setLiveNotifCount] = useState(initialCount || 0);
	const [liveMsgCount, setLiveMsgCount] = useState(0);
	const [showFlash, setShowFlash] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(() => {
		return localStorage.getItem("notification_sound") !== "off";
	});
	const [notifOpen, setNotifOpen] = useState(false);
	const [recentNotifs, setRecentNotifs] = useState([]);
	const [loadingNotifs, setLoadingNotifs] = useState(false);
	const notifRef = useRef(null);
	const prevNotifRef = useRef(initialCount || 0);
	const prevMsgRef = useRef(0);
	const soundReadyRef = useRef(false);
	const soundRef = useRef(soundEnabled);
	useEffect(() => {
		function handleClickOutside(e) {
			if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	async function openNotifDropdown() {
		if (notifOpen) {
			setNotifOpen(false);
			return;
		}
		setNotifOpen(true);
		setLoadingNotifs(true);
		try {
			const res = await fetch("/admin/notifications/recent", {
				credentials: "same-origin",
				headers: {
					Accept: "application/json",
					"X-Requested-With": "XMLHttpRequest"
				}
			});
			if (!res.ok) throw new Error("Unable to load notifications");
			const data = await res.json();
			setRecentNotifs(data.notifications || []);
		} catch {}
		setLoadingNotifs(false);
	}
	function markNotifRead(id) {
		router.post(`/admin/notifications/${id}/read`, {}, {
			preserveScroll: true,
			onSuccess: () => {
				setRecentNotifs((prev) => prev.map((n) => n.id === id ? {
					...n,
					read_at: (/* @__PURE__ */ new Date()).toISOString()
				} : n));
				setLiveNotifCount((prev) => Math.max(0, prev - 1));
			}
		});
	}
	function markAllNotifsRead() {
		router.post("/admin/notifications/read-all", {}, {
			preserveScroll: true,
			onSuccess: () => {
				setRecentNotifs((prev) => prev.map((n) => ({
					...n,
					read_at: (/* @__PURE__ */ new Date()).toISOString()
				})));
				setLiveNotifCount(0);
			}
		});
	}
	function clearAllNotifs() {
		if (!window.confirm(isRtl ? "هل أنت متأكد من حذف جميع الإشعارات؟" : "Are you sure you want to delete all notifications?")) return;
		router.delete("/admin/notifications/all/clear", {
			preserveScroll: true,
			onSuccess: () => {
				setRecentNotifs([]);
				setLiveNotifCount(0);
			}
		});
	}
	useEffect(() => {
		setLiveNotifCount(initialCount || 0);
		prevNotifRef.current = initialCount || 0;
	}, [initialCount]);
	async function pollCounts() {
		try {
			const [notifRes, msgRes] = await Promise.all([fetch("/admin/notifications/unread-count", {
				credentials: "same-origin",
				headers: {
					Accept: "application/json",
					"X-Requested-With": "XMLHttpRequest"
				}
			}), fetch("/admin/messages/unread-count", {
				credentials: "same-origin",
				headers: {
					Accept: "application/json",
					"X-Requested-With": "XMLHttpRequest"
				}
			})]);
			if (!notifRes.ok || !msgRes.ok) throw new Error("Unable to refresh counts");
			const notifData = await notifRes.json();
			const msgData = await msgRes.json();
			return {
				notif: notifData.count,
				msg: msgData.count
			};
		} catch {
			return null;
		}
	}
	function handleNewNotif(count) {
		if (!soundReadyRef.current) return;
		if (count > prevNotifRef.current) {
			if (soundRef.current) playNotificationSound();
			const el = document.createElement("div");
			el.className = "fixed top-4 end-4 z-50 bg-amber-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-bold animate-fade-in";
			el.textContent = isRtl ? `🔔 لديك ${count} إشعار جديد` : `🔔 You have ${count} new notifications`;
			document.body.appendChild(el);
			setTimeout(() => {
				el.remove();
			}, 4e3);
		}
		prevNotifRef.current = count;
		setLiveNotifCount(count);
	}
	function handleNewMsg(count) {
		if (!soundReadyRef.current) return;
		if (count > prevMsgRef.current) {
			if (soundRef.current) playNotificationSound();
			const el = document.createElement("div");
			el.className = "fixed top-4 end-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-bold animate-fade-in";
			el.textContent = isRtl ? `💬 لديك ${count} رسالة جديدة` : `💬 You have ${count} new messages`;
			document.body.appendChild(el);
			setTimeout(() => {
				el.remove();
			}, 4e3);
		}
		prevMsgRef.current = count;
		setLiveMsgCount(count);
	}
	useEffect(() => {
		if (!auth?.user) return;
		const tick = async () => {
			const result = await pollCounts();
			if (!result) return;
			handleNewNotif(result.notif);
			handleNewMsg(result.msg);
			soundReadyRef.current = true;
		};
		tick();
		const interval = setInterval(tick, 3e4);
		window.addEventListener("focus", tick);
		return () => {
			clearInterval(interval);
			window.removeEventListener("focus", tick);
		};
	}, [auth?.user]);
	useEffect(() => {
		soundRef.current = soundEnabled;
	}, [soundEnabled]);
	function toggleSound() {
		const next = !soundEnabled;
		setSoundEnabled(next);
		localStorage.setItem("notification_sound", next ? "on" : "off");
	}
	const isActive = (href) => {
		if (!url) return false;
		if (href === "/admin") return url === "/admin" || url === "/admin/";
		return url.startsWith(href);
	};
	const filterItems = (items) => items.filter((item) => {
		if (!item.scope) return true;
		if (item.scope === "admin") return role === "admin";
		if (item.scope === "manager") return role === "admin" || role === "manager";
		return true;
	});
	const renderNavContent = () => /* @__PURE__ */ jsx("div", {
		className: "flex-1 overflow-y-auto py-3 px-2 space-y-5",
		children: NAV_GROUPS.map((group) => {
			const visibleItems = filterItems(group.items);
			if (visibleItems.length === 0) return null;
			return /* @__PURE__ */ jsxs("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ jsx("div", {
					className: "px-3 pb-1 text-[11px] font-bold tracking-wider text-secondary-500 uppercase",
					children: trans(group.key)
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-0.5",
					children: visibleItems.map((item) => {
						const active = isActive(item.href);
						return /* @__PURE__ */ jsxs(Link, {
							href: item.href,
							onClick: () => setMobileOpen(false),
							className: `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 ${active ? "bg-primary-900/20 text-white font-semibold border-s-4 border-primary-900 ps-3.5" : "text-secondary-300 hover:bg-secondary-900 hover:text-white ps-4"}`,
							children: [
								/* @__PURE__ */ jsx("svg", {
									className: `w-5 h-5 shrink-0 ${active ? "text-primary-500" : "text-secondary-400"}`,
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 1.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: item.icon
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "flex-1 truncate",
									children: trans(item.key)
								}),
								item.key === "sidebar_notifications" && liveNotifCount > 0 && /* @__PURE__ */ jsx("span", {
									className: "bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center leading-tight animate-pulse",
									children: liveNotifCount > 99 ? "99+" : liveNotifCount
								}),
								item.key === "sidebar_messages" && liveMsgCount > 0 && /* @__PURE__ */ jsx("span", {
									className: "bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[18px] text-center leading-tight",
									children: liveMsgCount > 99 ? "99+" : liveMsgCount
								})
							]
						}, item.key);
					})
				})]
			}, group.key);
		})
	});
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex",
		children: [
			/* @__PURE__ */ jsxs("aside", {
				className: "w-64 bg-secondary-950 text-white shrink-0 hidden md:flex flex-col border-e border-secondary-800/60",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "p-4 border-b border-secondary-800/80 flex items-center justify-between",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/admin",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("img", {
								src: settings?.site_logo ? settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/storage") ? settings.site_logo : `/storage/${settings.site_logo}` : "/icon.png",
								alt: trans("app_name"),
								className: "h-8 w-auto object-contain",
								onError: (e) => {
									e.currentTarget.src = "/icon.png";
								}
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-base font-bold text-primary-900 block leading-tight",
								children: trans("app_name")
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-secondary-400 block leading-tight",
								children: trans("admin_panel")
							})] })]
						})
					}),
					renderNavContent(),
					/* @__PURE__ */ jsx("div", {
						className: "p-3 border-t border-secondary-800/80 bg-secondary-950/50",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "flex items-center gap-2 px-3 py-2 text-xs text-secondary-400 hover:text-white hover:bg-secondary-900 rounded-lg transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: "←" }), /* @__PURE__ */ jsx("span", { children: trans("home") })]
						})
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 md:hidden flex",
				children: [/* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 bg-black/60 backdrop-blur-sm",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ jsxs("aside", {
					className: "relative w-64 bg-secondary-950 text-white flex flex-col z-10 shadow-2xl h-full",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 border-b border-secondary-800 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/admin",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("img", {
									src: "/icon.png",
									alt: trans("app_name"),
									className: "h-7 w-auto"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm font-bold text-primary-900",
									children: trans("app_name")
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setMobileOpen(false),
								className: "text-secondary-400 hover:text-white p-1",
								children: "×"
							})]
						}),
						renderNavContent(),
						/* @__PURE__ */ jsx("div", {
							className: "p-3 border-t border-secondary-800",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "block px-3 py-2 text-xs text-secondary-400 hover:text-white rounded-lg",
								children: ["← ", trans("home")]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col min-h-screen min-w-0",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "bg-white border-b border-secondary-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setMobileOpen(true),
								className: "md:hidden text-secondary-700 hover:text-primary-900 p-1.5 rounded-lg border border-secondary-200",
								"aria-label": "Toggle menu",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M4 6h16M4 12h16M4 18h16"
									})
								})
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-semibold text-secondary-950",
								children: trans("admin_panel")
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx(Link, {
								href: `/locale/${isRtl ? "en" : "ar"}`,
								method: "get",
								as: "button",
								className: "text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none",
								children: isRtl ? trans("lang_en") : trans("lang_ar")
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 border-s border-secondary-200 ps-4 rtl:border-s-0 rtl:border-r rtl:pr-4 rtl:ps-0",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: toggleSound,
										className: "w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-secondary-100 hover:text-secondary-950 transition-colors",
										title: soundEnabled ? trans("disable_sound") : trans("enable_sound"),
										children: soundEnabled ? /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4",
											fill: "none",
											viewBox: "0 0 24 24",
											stroke: "currentColor",
											strokeWidth: 2,
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												d: "M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.5H4a1 1 0 00-1 1v5a1 1 0 001 1h2.5l4 4V4.5l-4 4z"
											})
										}) : /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4",
											fill: "none",
											viewBox: "0 0 24 24",
											stroke: "currentColor",
											strokeWidth: 2,
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												d: "M5.5 8.5H4a1 1 0 00-1 1v5a1 1 0 001 1h1.5l4 4V4.5l-4 4zM16.5 9.5l5 5M21.5 9.5l-5 5"
											})
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										ref: notifRef,
										className: "relative",
										children: [/* @__PURE__ */ jsxs("button", {
											onClick: openNotifDropdown,
											className: "relative w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-secondary-100 hover:text-secondary-950 transition-colors",
											title: trans("sidebar_notifications"),
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: 2,
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
												})
											}), liveNotifCount > 0 && /* @__PURE__ */ jsx("span", {
												className: "absolute -top-0.5 -end-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none",
												children: liveNotifCount > 99 ? "99+" : liveNotifCount
											})]
										}), notifOpen && /* @__PURE__ */ jsxs("div", {
											className: `absolute ${isRtl ? "left-0" : "right-0"} top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-secondary-200 z-50 overflow-hidden animate-fade-in`,
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "p-3 border-b border-secondary-100 flex items-center justify-between",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-sm font-bold text-secondary-950",
															children: trans("sidebar_notifications")
														}), liveNotifCount > 0 && /* @__PURE__ */ jsxs("span", {
															className: "text-[11px] text-amber-600 font-semibold",
															children: [
																liveNotifCount,
																" ",
																isRtl ? "جديد" : "new"
															]
														})]
													}), recentNotifs.length > 0 && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2",
														children: [liveNotifCount > 0 && /* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: markAllNotifsRead,
															className: "text-[11px] text-primary-600 hover:text-primary-800 font-semibold transition-colors",
															title: isRtl ? "قراءة الكل" : "Mark all read",
															children: isRtl ? "قراءة الكل" : "Mark read"
														}), /* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: clearAllNotifs,
															className: "text-[11px] text-red-600 hover:text-red-800 font-semibold transition-colors",
															title: isRtl ? "حذف الكل" : "Clear all",
															children: isRtl ? "حذف الكل" : "Clear all"
														})]
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "max-h-80 overflow-y-auto",
													children: loadingNotifs ? /* @__PURE__ */ jsx("div", {
														className: "p-6 text-center text-sm text-muted",
														children: isRtl ? "جاري التحميل..." : "Loading..."
													}) : recentNotifs.length === 0 ? /* @__PURE__ */ jsx("div", {
														className: "p-6 text-center text-sm text-muted",
														children: isRtl ? "لا توجد إشعارات" : "No notifications"
													}) : recentNotifs.map((n) => {
														const isUnread = !n.read_at;
														const type = n.type || "";
														let iconColor = "bg-secondary-100 text-secondary-600";
														if (type.includes("expiry") || type.includes("expired") || type === "unit_pending_approval") iconColor = "bg-amber-100 text-amber-700";
														else if (type === "new_project_created" || type === "unit_approved") iconColor = "bg-emerald-100 text-emerald-700";
														else if (type === "new_message") iconColor = "bg-blue-100 text-blue-700";
														return /* @__PURE__ */ jsxs("button", {
															onClick: () => {
																if (isUnread) markNotifRead(n.id);
															},
															className: `w-full text-start p-3 border-b border-secondary-100 last:border-b-0 hover:bg-surface/50 transition-colors flex gap-3 ${isUnread ? "bg-primary-50/20" : ""}`,
															children: [
																/* @__PURE__ */ jsx("div", {
																	className: `w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${iconColor}`,
																	children: /* @__PURE__ */ jsx("svg", {
																		className: "w-4 h-4",
																		fill: "none",
																		viewBox: "0 0 24 24",
																		stroke: "currentColor",
																		strokeWidth: 1.5,
																		children: /* @__PURE__ */ jsx("path", {
																			strokeLinecap: "round",
																			strokeLinejoin: "round",
																			d: type.includes("expiry") || type.includes("expired") || type === "unit_pending_approval" ? "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" : type === "new_project_created" || type === "unit_approved" ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : type === "new_message" ? "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" : "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
																		})
																	})
																}),
																/* @__PURE__ */ jsxs("div", {
																	className: "min-w-0 flex-1",
																	children: [/* @__PURE__ */ jsx("p", {
																		className: `text-xs leading-relaxed ${isUnread ? "font-semibold text-secondary-950" : "text-secondary-700"}`,
																		children: n.title || n.message
																	}), /* @__PURE__ */ jsx("span", {
																		className: "text-[10px] text-muted mt-0.5 block",
																		children: n.created_at_human
																	})]
																}),
																isUnread && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-primary-900 shrink-0 mt-1.5" })
															]
														}, n.id);
													})
												}),
												/* @__PURE__ */ jsx(Link, {
													href: "/admin/notifications",
													onClick: () => setNotifOpen(false),
													className: "block p-3 text-center text-xs font-semibold text-primary-900 hover:bg-surface border-t border-secondary-100 transition-colors",
													children: isRtl ? "عرض الكل" : "View all"
												})
											]
										})]
									}),
									/* @__PURE__ */ jsx(Link, {
										href: "/admin/profile",
										className: "flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded-full",
										title: trans("my_profile", {}, "admin"),
										children: /* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center font-bold text-sm border border-primary-100 group-hover:bg-primary-900 group-hover:text-white transition-colors overflow-hidden relative",
											children: auth?.user?.avatar && !avatarFailed ? /* @__PURE__ */ jsx("img", {
												src: auth.user.avatar.startsWith("http") || auth.user.avatar.startsWith("/storage") ? auth.user.avatar : `/storage/${auth.user.avatar}`,
												alt: auth?.user?.name || "",
												className: "w-full h-full object-cover",
												onError: () => setAvatarFailed(true)
											}) : auth?.user?.name?.charAt(0)?.toUpperCase()
										})
									}),
									/* @__PURE__ */ jsx(Link, {
										href: "/logout",
										method: "post",
										as: "button",
										className: "w-8 h-8 rounded-full flex items-center justify-center text-secondary-500 hover:bg-red-50 hover:text-error transition-colors focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none",
										title: trans("logout"),
										"aria-label": "Logout",
										children: /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											"aria-hidden": "true",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 2,
												d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											})
										})
									})
								]
							})]
						})]
					}),
					flash?.error && showFlash && /* @__PURE__ */ jsxs("div", {
						className: "mx-4 md:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", { children: flash.error }), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowFlash(false),
							className: "text-red-400 hover:text-red-600 me-2",
							children: "×"
						})]
					}),
					flash?.success && showFlash && /* @__PURE__ */ jsxs("div", {
						className: "mx-4 md:mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", { children: flash.success }), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowFlash(false),
							className: "text-green-400 hover:text-green-600 me-2",
							children: "×"
						})]
					}),
					/* @__PURE__ */ jsx("main", {
						className: "flex-1",
						children
					})
				]
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Admin/About/Edit.jsx
var Edit_exports$1 = /* @__PURE__ */ __exportAll({ default: () => AdminAboutEdit });
var CustomImage = Image$1.extend({ addAttributes() {
	return {
		...this.parent?.(),
		width: {
			default: null,
			renderHTML: (attributes) => {
				if (!attributes.width) return {};
				return { style: `width: ${/^[0-9]+$/.test(attributes.width) ? attributes.width + "px" : attributes.width}` };
			}
		},
		float: {
			default: "none",
			renderHTML: (attributes) => {
				if (attributes.float === "left") return { class: "float-left me-4 mb-4" };
				if (attributes.float === "right") return { class: "float-right ms-4 mb-4" };
				return {};
			}
		}
	};
} });
function MenuBar$1({ editor, trans, isRtl }) {
	if (!editor) return null;
	const handleImageUpload = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = async () => {
			const file = input.files[0];
			if (file) {
				const formData = new FormData();
				formData.append("image", file);
				try {
					const res = await axios.post("/admin/media/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
					editor.chain().focus().setImage({
						src: res.data.url,
						alt: trans("about")
					}).run();
				} catch (e) {
					alert(isRtl ? "فشل رفع الصورة داخل المحرر" : "Image upload failed");
				}
			}
		};
		input.click();
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-surface/50",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleBold().run(),
				className: `px-2.5 py-1 text-xs font-bold rounded ${editor.isActive("bold") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "B"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleItalic().run(),
				className: `px-2.5 py-1 text-xs italic rounded ${editor.isActive("italic") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "I"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleUnderline().run(),
				className: `px-2.5 py-1 text-xs underline rounded ${editor.isActive("underline") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "U"
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleBulletList().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("bulletList") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: trans("list") || "• قائمة"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleOrderedList().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("orderedList") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: trans("ordered_list") || "1. قائمة"
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("left").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "left" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "يسار"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("center").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "center" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "وسط"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("right").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "right" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "يمين"
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				className: `px-2 py-1 text-xs font-bold rounded ${editor.isActive("heading", { level: 2 }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "H2"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				className: `px-2 py-1 text-xs font-bold rounded ${editor.isActive("heading", { level: 3 }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "H3"
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: handleImageUpload,
				className: "px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 flex items-center gap-1",
				title: "إدراج صورة داخل النص",
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-4 h-4 text-primary-900",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 1.5,
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					})
				}), /* @__PURE__ */ jsx("span", { children: "صورة داخل النص" })]
			}),
			editor.isActive("image") && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						const width = prompt(trans("size") + " (مثال: 50%, 300px):", editor.getAttributes("image").width || "");
						if (width !== null) editor.chain().focus().updateAttributes("image", { width }).run();
					},
					className: "px-2 py-1 text-xs rounded bg-white text-secondary-700 hover:bg-secondary-100 font-medium",
					children: trans("size")
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().updateAttributes("image", { float: "none" }).run(),
					className: `px-2 py-1 text-xs rounded ${!editor.getAttributes("image").float || editor.getAttributes("image").float === "none" ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
					title: "No Float",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M4 6h16M4 12h16M4 18h16"
						})
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().updateAttributes("image", { float: "left" }).run(),
					className: `px-2 py-1 text-xs rounded ${editor.getAttributes("image").float === "left" ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
					title: "Float Left",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M4 6h8M4 12h8M4 18h16"
						})
					})
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => editor.chain().focus().updateAttributes("image", { float: "right" }).run(),
					className: `px-2 py-1 text-xs rounded ${editor.getAttributes("image").float === "right" ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
					title: "Float Right",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M12 6h8M12 12h8M4 18h16"
						})
					})
				})
			] })
		]
	});
}
function AdminAboutEdit({ about }) {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const fileInputRef = useRef(null);
	const [activeTab, setActiveTab] = useState("ar");
	const [newFiles, setNewFiles] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
	const { data, setData, post, processing, errors } = useForm({
		content_ar: about?.content_ar || "",
		content_en: about?.content_en || "",
		images: [],
		deleted_images: []
	});
	const editorAr = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({ types: [
				"heading",
				"paragraph",
				"image"
			] }),
			CustomImage.configure({
				inline: true,
				HTMLAttributes: { class: "img-fluid inline-block max-w-full h-auto mx-1" }
			})
		],
		content: about?.content_ar || "",
		editorProps: { attributes: {
			class: "prose prose-sm max-w-none focus:outline-none min-h-[350px] px-4 py-3 bg-white",
			dir: "rtl"
		} },
		onUpdate: ({ editor }) => {
			setData("content_ar", editor.getHTML());
		}
	});
	const editorEn = useEditor({
		extensions: [
			StarterKit,
			TextAlign.configure({ types: [
				"heading",
				"paragraph",
				"image"
			] }),
			CustomImage.configure({
				inline: true,
				HTMLAttributes: { class: "img-fluid inline-block max-w-full h-auto mx-1" }
			})
		],
		content: about?.content_en || "",
		editorProps: { attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[350px] px-4 py-3 bg-white" } },
		onUpdate: ({ editor }) => {
			setData("content_en", editor.getHTML());
		}
	});
	useEffect(() => {
		if (editorAr && about?.content_ar !== void 0) {
			if (editorAr.getHTML() !== about.content_ar) editorAr.commands.setContent(about.content_ar || "");
		}
		if (editorEn && about?.content_en !== void 0) {
			if (editorEn.getHTML() !== about.content_en) editorEn.commands.setContent(about.content_en || "");
		}
	}, [about]);
	function handleFileChange(e) {
		const selected = Array.from(e.target.files || []);
		if (selected.length === 0) return;
		const updatedNewFiles = [...newFiles, ...selected];
		setNewFiles(updatedNewFiles);
		setData("images", updatedNewFiles);
	}
	function removeNewFile(index) {
		const updated = newFiles.filter((_, i) => i !== index);
		setNewFiles(updated);
		setData("images", updated);
	}
	function toggleDeleteExisting(path) {
		if (data.deleted_images.includes(path)) setData("deleted_images", data.deleted_images.filter((p) => p !== path));
		else setData("deleted_images", [...data.deleted_images, path]);
	}
	function handleSubmit(e) {
		e.preventDefault();
		const finalContentAr = editorAr ? editorAr.getHTML() : data.content_ar;
		const finalContentEn = editorEn ? editorEn.getHTML() : data.content_en;
		post("/admin/about", {
			preserveScroll: true,
			data: {
				...data,
				content_ar: finalContentAr,
				content_en: finalContentEn
			},
			onSuccess: () => {
				setNewFiles([]);
				setData((prev) => ({
					...prev,
					images: [],
					deleted_images: []
				}));
				if (fileInputRef.current) fileInputRef.current.value = "";
				setSuccessMessage(isRtl ? "تم حفظ التعديلات بنجاح" : "Saved successfully");
				setTimeout(() => setSuccessMessage(""), 4e3);
			}
		});
	}
	const existingImages = about?.images || [];
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_about") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-6",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_about")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted mt-1",
					children: isRtl ? "إدارة محتوى صفحة من نحن والصور التوضيحية الخاصة بها" : "Manage About Us content and gallery images"
				})] })
			}),
			(successMessage || flash?.success) && /* @__PURE__ */ jsxs("div", {
				className: "mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", { children: successMessage || flash?.success }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setSuccessMessage(""),
					className: "text-green-600 hover:text-green-950",
					children: "×"
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "max-w-5xl space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl shadow-card overflow-hidden border border-secondary-100",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex border-b border-secondary-200 bg-surface/40",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveTab("ar"),
								className: `px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "ar" ? "border-primary-900 text-primary-900 bg-white" : "border-transparent text-secondary-600 hover:text-secondary-950"}`,
								children: trans("content_ar")
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveTab("en"),
								className: `px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === "en" ? "border-primary-900 text-primary-900 bg-white" : "border-transparent text-secondary-600 hover:text-secondary-950"}`,
								children: trans("content_en")
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6",
							children: [activeTab === "ar" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950",
										children: trans("content_ar")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "border border-secondary-200 rounded-lg overflow-hidden",
										dir: "rtl",
										children: [/* @__PURE__ */ jsx(MenuBar$1, {
											editor: editorAr,
											trans,
											isRtl
										}), /* @__PURE__ */ jsx(EditorContent, { editor: editorAr })]
									}),
									errors.content_ar && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-error mt-1",
										children: errors.content_ar
									})
								]
							}), activeTab === "en" && /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950",
										children: trans("content_en")
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "border border-secondary-200 rounded-lg overflow-hidden",
										dir: "ltr",
										children: [/* @__PURE__ */ jsx(MenuBar$1, {
											editor: editorEn,
											trans,
											isRtl
										}), /* @__PURE__ */ jsx(EditorContent, { editor: editorEn })]
									}),
									errors.content_en && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-error mt-1",
										children: errors.content_en
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl shadow-card p-6 border border-secondary-100 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-semibold text-secondary-950",
								children: trans("images")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted mt-0.5",
								children: isRtl ? "عرض وإدارة صور معرض صفحة من نحن" : "Manage gallery images for the about page"
							})] }),
							existingImages.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xs font-bold text-secondary-700 uppercase tracking-wider mb-3",
								children: isRtl ? `الصور الحالية (${existingImages.length})` : `Current Images (${existingImages.length})`
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
								children: existingImages.map((path, idx) => {
									const isDeleted = data.deleted_images.includes(path);
									return /* @__PURE__ */ jsxs("div", {
										className: `relative group rounded-xl overflow-hidden border transition-all duration-200 ${isDeleted ? "border-red-300 bg-red-50/50 opacity-60" : "border-secondary-200 bg-surface hover:shadow-md"}`,
										children: [/* @__PURE__ */ jsx("img", {
											src: `/storage/${path}`,
											alt: trans("about_image"),
											className: "w-full h-36 object-cover"
										}), isDeleted ? /* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 bg-red-950/60 flex flex-col items-center justify-center p-2 text-center gap-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full",
												children: isRtl ? "سيتم الحذف عند الحفظ" : "Will be deleted"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => toggleDeleteExisting(path),
												className: "px-2.5 py-1 text-xs bg-white text-secondary-900 rounded-lg font-medium hover:bg-secondary-100 transition-colors shadow-sm",
												children: isRtl ? "إلغاء الحذف" : "Undo Delete"
											})]
										}) : /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
											children: /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => toggleDeleteExisting(path),
												className: "px-3 py-1.5 text-xs bg-error text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors flex items-center gap-1",
												children: [/* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													})
												}), /* @__PURE__ */ jsx("span", { children: trans("delete") })]
											})
										})]
									}, idx);
								})
							})] }),
							newFiles.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-xs font-bold text-primary-900 uppercase tracking-wider mb-3",
								children: isRtl ? `صور جديدة مُختارة (${newFiles.length})` : `Selected New Images (${newFiles.length})`
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
								children: newFiles.map((file, idx) => /* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-xl overflow-hidden border border-primary-200 bg-primary-50/20 shadow-xs",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: URL.createObjectURL(file),
											alt: "New preview",
											className: "w-full h-36 object-cover"
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeNewFile(idx),
											className: "absolute top-2 end-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm shadow hover:bg-red-700 transition-colors",
											title: trans("delete"),
											children: "×"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "p-1.5 bg-white/90 backdrop-blur-xs text-[10px] text-secondary-700 truncate font-mono",
											children: file.name
										})
									]
								}, idx))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-2",
									children: trans("add_images")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-900 transition-colors bg-surface/30",
									children: [
										/* @__PURE__ */ jsx("svg", {
											className: "w-10 h-10 text-secondary-400 mx-auto mb-2",
											fill: "none",
											viewBox: "0 0 24 24",
											stroke: "currentColor",
											strokeWidth: 1.5,
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												d: "M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
											})
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-secondary-700 mb-3 font-medium",
											children: isRtl ? "اضغط لاختيار صور من جهازك (يمكن اختيار أكثر من صورة)" : "Click to select images from your device"
										}),
										/* @__PURE__ */ jsx("input", {
											ref: fileInputRef,
											type: "file",
											multiple: true,
											accept: "image/*",
											onChange: handleFileChange,
											className: "hidden",
											id: "about-images-file-input"
										}),
										/* @__PURE__ */ jsx("label", {
											htmlFor: "about-images-file-input",
											className: "inline-flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 text-secondary-800 rounded-lg text-xs font-semibold hover:bg-secondary-50 cursor-pointer shadow-xs transition-colors",
											children: /* @__PURE__ */ jsx("span", { children: trans("upload") || "رفع الصور" })
										})
									]
								}),
								errors.images && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.images
								})
							] })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-end gap-3 pt-2",
						children: /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: processing,
							className: "px-8 py-3 bg-primary-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-950 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2",
							children: [processing && /* @__PURE__ */ jsxs("svg", {
								className: "animate-spin w-4 h-4 text-white",
								fill: "none",
								viewBox: "0 0 24 24",
								children: [/* @__PURE__ */ jsx("circle", {
									className: "opacity-25",
									cx: "12",
									cy: "12",
									r: "10",
									stroke: "currentColor",
									strokeWidth: "4"
								}), /* @__PURE__ */ jsx("path", {
									className: "opacity-75",
									fill: "currentColor",
									d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								})]
							}), /* @__PURE__ */ jsx("span", { children: processing ? trans("loading") : trans("save") })]
						})
					})
				]
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Areas/Index.jsx
var Index_exports$16 = /* @__PURE__ */ __exportAll({ default: () => AdminAreasIndex });
function AdminAreasIndex({ areas }) {
	const { locale, flash, errors } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [editing, setEditing] = useState(null);
	const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
		name_ar: "",
		name_en: "",
		is_active: true,
		sort_order: 0
	});
	function startCreate() {
		setEditing("new");
		reset();
	}
	function startEdit(area) {
		setEditing(area.id);
		setData({
			name_ar: area.name_ar,
			name_en: area.name_en,
			is_active: area.is_active,
			sort_order: area.sort_order
		});
	}
	function cancelEdit() {
		setEditing(null);
		reset();
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (editing === "new") post("/admin/areas", {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
		else put(`/admin/areas/${editing}`, {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
	}
	function handleDelete(area) {
		if (confirm(trans("confirm_delete"))) destroy(`/admin/areas/${area.id}`, { preserveScroll: true });
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_areas") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_areas")
				}), editing !== "new" && /* @__PURE__ */ jsx("button", {
					onClick: startCreate,
					className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950",
					children: trans("add")
				})]
			}),
			flash?.success && /* @__PURE__ */ jsx("div", {
				className: "mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm",
				children: flash.success
			}),
			(editing === "new" || typeof editing === "number") && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-white rounded-xl shadow-card p-6 mb-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 mb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("name_ar")
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name_ar,
							onChange: (e) => setData("name_ar", e.target.value),
							required: true,
							dir: "rtl",
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("name_en")
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name_en,
							onChange: (e) => setData("name_en", e.target.value),
							required: true,
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 mb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("sort_order")
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: "0",
							value: data.sort_order,
							onChange: (e) => setData("sort_order", parseInt(e.target.value) || 0),
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-end pb-2",
							children: /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: data.is_active,
									onChange: (e) => setData("is_active", e.target.checked),
									className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm font-medium text-secondary-950",
									children: data.is_active ? trans("active") : trans("inactive")
								})]
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
							children: processing ? trans("loading") : trans("save")
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: cancelEdit,
							className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200",
							children: trans("cancel")
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-left",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_ar")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_en")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("status")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("sort_order")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("actions")
							})
						]
					}) }), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-secondary-100",
						children: [areas?.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 5,
							className: "px-4 py-8 text-center text-muted",
							children: trans("no_data")
						}) }), areas?.map((area) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-surface/50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: area.name_ar
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: area.name_en
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${area.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`,
										children: area.is_active ? trans("active") : trans("inactive")
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-700",
									children: area.sort_order
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => startEdit(area),
											className: "text-xs text-primary-900 hover:text-primary-950 font-medium",
											children: trans("edit")
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleDelete(area),
											className: "text-xs text-red-600 hover:text-red-700 font-medium",
											children: trans("delete")
										})]
									})
								})
							]
						}, area.id))]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Components/UI/InputField.jsx
function InputField({ id, name, label, type = "text", value, onChange, placeholder, required = false, autoComplete, dir }) {
	const { errors } = usePage().props;
	const error = errors[name];
	const inputDir = dir || (type === "email" || type === "password" ? "ltr" : void 0);
	const inputId = id || name;
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-4",
		children: [
			label && /* @__PURE__ */ jsxs("label", {
				htmlFor: inputId,
				className: "block text-sm font-medium text-secondary-950 mb-1",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "text-primary-900 me-1",
					children: "*"
				})]
			}),
			/* @__PURE__ */ jsx("input", {
				id: inputId,
				name,
				type,
				value,
				onChange,
				placeholder,
				autoComplete,
				dir: inputDir,
				className: `w-full px-4 py-2.5 border rounded-lg text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${error ? "border-error bg-error/5" : "border-secondary-200 bg-white hover:border-secondary-300"}`
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-error rtl:text-right",
				children: error
			})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/Button.jsx
function Button({ children, type = "submit", variant = "primary", disabled = false, className = "", onClick }) {
	return /* @__PURE__ */ jsx("button", {
		type,
		disabled,
		onClick,
		className: `w-full inline-flex justify-center items-center px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${{
			primary: "bg-primary-900 text-white hover:bg-primary-950 hover:shadow-md focus:ring-primary-900",
			secondary: "bg-surface text-secondary-950 hover:bg-secondary-200 hover:shadow-sm focus:ring-secondary-300",
			ghost: "bg-transparent text-secondary-700 hover:bg-surface hover:text-secondary-950 focus:ring-secondary-200"
		}[variant]} ${className}`,
		children
	});
}
//#endregion
//#region resources/js/Components/UI/SkeletonRow.jsx
function SkeletonRow({ cols }) {
	return /* @__PURE__ */ jsx("tr", {
		className: "border-t border-secondary-100",
		children: Array.from({ length: cols }).map((_, i) => /* @__PURE__ */ jsx("td", {
			className: "px-4 py-3",
			children: /* @__PURE__ */ jsx("div", {
				className: "h-4 bg-secondary-200 rounded animate-pulse",
				style: { width: `${60 + Math.random() * 30}%` }
			})
		}, i))
	});
}
//#endregion
//#region resources/js/Components/UI/Select.jsx
function Select({ value, onChange, children, className = "", disabled = false, required = false, id, name, defaultValue, "aria-label": ariaLabel }) {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const wrapperRef = useRef(null);
	const triggerRef = useRef(null);
	const searchInputRef = useRef(null);
	const generatedId = useId();
	const listboxId = `select-listbox-${id || name || generatedId}`;
	const currentValue = value !== void 0 ? value : defaultValue;
	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
				setFocusedIndex(-1);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	useEffect(() => {
		if (isOpen && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 50);
	}, [isOpen]);
	const options = [];
	React.Children.forEach(children, (child) => {
		if (!child) return;
		if (Array.isArray(child)) child.forEach((c) => {
			if (c && c.props) options.push({
				value: c.props.value,
				label: c.props.children
			});
		});
		else if (child.type === "option" || child.props?.value !== void 0) options.push({
			value: child.props.value,
			label: child.props.children
		});
	});
	const filteredOptions = options.filter((opt) => {
		if (!search) return true;
		return (typeof opt.label === "string" ? opt.label : String(opt.label || "")).toLowerCase().includes(search.toLowerCase());
	});
	const selectedOption = options.find((opt) => String(opt.value) === String(currentValue)) || options[0];
	const showSearch = options.length > 10;
	const handleSelect = (val) => {
		if (onChange) onChange({
			target: {
				value: val,
				name
			},
			preventDefault: () => {},
			stopPropagation: () => {}
		});
		setIsOpen(false);
		setSearch("");
		setFocusedIndex(-1);
		triggerRef.current?.focus();
	};
	const handleKeyDown = (e) => {
		if (disabled) return;
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					setFocusedIndex(0);
				} else setFocusedIndex((prev) => prev < filteredOptions.length - 1 ? prev + 1 : 0);
				break;
			case "ArrowUp":
				e.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					setFocusedIndex(filteredOptions.length - 1);
				} else setFocusedIndex((prev) => prev > 0 ? prev - 1 : filteredOptions.length - 1);
				break;
			case "Enter":
			case " ":
				if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
					e.preventDefault();
					handleSelect(filteredOptions[focusedIndex].value);
				} else if (!isOpen) {
					e.preventDefault();
					setIsOpen(true);
				}
				break;
			case "Escape":
				if (isOpen) {
					e.preventDefault();
					setIsOpen(false);
					setFocusedIndex(-1);
					triggerRef.current?.focus();
				}
				break;
			case "Tab":
				if (isOpen) {
					setIsOpen(false);
					setFocusedIndex(-1);
				}
				break;
			default: break;
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: wrapperRef,
		className: `relative w-full ${isOpen ? "z-[100]" : "z-10"} ${className}`,
		onKeyDown: handleKeyDown,
		children: [
			/* @__PURE__ */ jsxs("select", {
				id: id ? `${id}-native` : name ? `${name}-native` : void 0,
				className: "absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10",
				value: currentValue,
				name,
				disabled,
				required,
				onChange: () => {},
				tabIndex: -1,
				"aria-hidden": "true",
				children: [/* @__PURE__ */ jsx("option", { value: "" }), options.map((o) => /* @__PURE__ */ jsx("option", {
					value: o.value,
					children: o.label
				}, o.value))]
			}),
			/* @__PURE__ */ jsxs("button", {
				id: id || name,
				ref: triggerRef,
				type: "button",
				disabled,
				onClick: () => setIsOpen(!isOpen),
				"aria-haspopup": "listbox",
				"aria-expanded": isOpen,
				"aria-controls": listboxId,
				"aria-label": ariaLabel || (typeof selectedOption?.label === "string" ? selectedOption.label : "Select option"),
				className: `w-full h-full min-h-[40px] px-3 py-1.5 bg-surface border border-transparent rounded-xl text-sm transition-all duration-200 outline-none flex items-center justify-between focus:ring-2 focus:ring-primary-500 focus:border-primary-900 focus:bg-white hover:bg-secondary-200 disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? "bg-white border-primary-900 ring-2 ring-primary-500" : ""}`,
				style: { textAlign: "start" },
				children: [/* @__PURE__ */ jsx("span", {
					className: `truncate text-[14px] ${!selectedOption?.value && selectedOption?.value !== 0 ? "text-secondary-500" : "text-secondary-900 font-medium"}`,
					children: selectedOption ? selectedOption.label : "Select..."
				}), /* @__PURE__ */ jsx("svg", {
					className: `w-4 h-4 text-secondary-500 transition-transform duration-200 shrink-0 ms-3 ${isOpen ? "rotate-180 text-primary-900" : ""}`,
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M19 9l-7 7-7-7"
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `absolute z-[100] top-full left-0 right-0 w-full mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-secondary-200 flex flex-col origin-top transition-all duration-200 ease-out min-w-[160px] ${isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`,
				style: { maxHeight: "300px" },
				children: [showSearch && /* @__PURE__ */ jsx("div", {
					className: "p-3 border-b border-secondary-100 shrink-0 bg-white rounded-t-2xl",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none rtl:right-3 rtl:left-auto",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							})
						}), /* @__PURE__ */ jsx("input", {
							ref: searchInputRef,
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search...",
							"aria-label": "Filter options",
							className: "w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 bg-secondary-50 border border-transparent rounded-xl text-sm text-secondary-900 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-900 transition-all outline-none",
							onClick: (e) => e.stopPropagation()
						})]
					})
				}), /* @__PURE__ */ jsx("div", {
					id: listboxId,
					role: "listbox",
					tabIndex: -1,
					"aria-label": ariaLabel || "Options",
					className: "overflow-y-auto p-2 custom-scrollbar",
					children: filteredOptions.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "px-4 py-6 text-sm text-secondary-500 text-center font-medium",
						role: "option",
						"aria-selected": "false",
						children: "No results found"
					}) : filteredOptions.map((opt, idx) => {
						const isSelected = String(opt.value) === String(currentValue);
						return /* @__PURE__ */ jsxs("button", {
							type: "button",
							role: "option",
							"aria-selected": isSelected,
							onClick: (e) => {
								e.preventDefault();
								handleSelect(opt.value);
							},
							className: `w-full text-start px-4 py-3 rounded-xl text-[15px] transition-colors duration-150 flex items-center justify-between mb-1 last:mb-0 outline-none focus:ring-2 focus:ring-primary-500 ${isSelected ? "bg-primary-900/10 text-primary-900 font-semibold" : idx === focusedIndex ? "bg-secondary-100 text-secondary-900 font-medium" : "text-secondary-800 hover:bg-secondary-50"}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: opt.label
							}), isSelected && /* @__PURE__ */ jsx("svg", {
								className: "w-5 h-5 text-primary-900 shrink-0 ms-3",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 2.5,
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M5 13l4 4L19 7"
								})
							})]
						}, opt.value);
					})
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Articles/Form.jsx
var Form_exports$2 = /* @__PURE__ */ __exportAll({ default: () => AdminArticlesForm });
function MenuBar({ editor, trans }) {
	if (!editor) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap gap-1 p-2 border-b border-secondary-200 bg-surface/50",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleBold().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("bold") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: /* @__PURE__ */ jsx("strong", { children: "B" })
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleItalic().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("italic") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: /* @__PURE__ */ jsx("em", { children: "I" })
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleUnderline().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("underline") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: /* @__PURE__ */ jsx("u", { children: "U" })
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleBulletList().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("bulletList") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: trans("list")
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleOrderedList().run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("orderedList") ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: trans("ordered_list")
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("left").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "left" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "L"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("center").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "center" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "C"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().setTextAlign("right").run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive({ textAlign: "right" }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "R"
			}),
			/* @__PURE__ */ jsx("span", { className: "w-px bg-secondary-200 mx-1" }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("heading", { level: 2 }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "H2"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
				className: `px-2 py-1 text-xs rounded ${editor.isActive("heading", { level: 3 }) ? "bg-primary-900 text-white" : "bg-white text-secondary-700 hover:bg-secondary-100"}`,
				children: "H3"
			})
		]
	});
}
function AdminArticlesForm({ article, categories }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isEditing = !!article;
	const [contentTab, setContentTab] = useState(locale === "ar" ? "ar" : "en");
	const { data, setData, post, put, processing, errors, transform } = useForm({
		category_id: article?.category_id || "",
		title_ar: article?.title_ar || "",
		title_en: article?.title_en || article?.title || "",
		content_ar: article?.content_ar || "",
		content_en: article?.content_en || article?.content || "",
		excerpt_ar: article?.excerpt_ar || "",
		excerpt_en: article?.excerpt_en || article?.excerpt || "",
		alt_text: article?.alt_text || "",
		keywords: article?.keywords || [],
		meta_description: article?.meta_description || "",
		is_published: article?.is_published || false,
		cover_image: null,
		images: [],
		new_image_alts: {},
		new_image_positions: {},
		deleted_image_ids: [],
		image_updates: {}
	});
	const existingImages = isEditing ? (article.images || []).filter((img) => img.position !== "header" && !data.deleted_image_ids.includes(img.id)) : [];
	const middleImages = [...existingImages.map((img) => ({
		type: "existing",
		id: img.id,
		position: data.image_updates[img.id]?.position ?? (img.position || "middle")
	})), ...data.images.map((file, i) => ({
		type: "new",
		index: i,
		position: (data.new_image_positions || {})[i] || "middle"
	}))].filter((img) => img.position === "middle");
	const getShortcodeIndex = (imgType, identifier) => {
		return middleImages.findIndex((m) => imgType === "existing" ? m.id === identifier : m.index === identifier) + 1;
	};
	const editorAr = useEditor({
		extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] })],
		content: article?.content_ar || "",
		editorProps: { attributes: {
			class: "prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3",
			dir: "rtl"
		} },
		onUpdate: ({ editor }) => setData("content_ar", editor.getHTML())
	});
	const editorEn = useEditor({
		extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] })],
		content: article?.content_en || "",
		editorProps: { attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[500px] px-4 py-3" } },
		onUpdate: ({ editor }) => setData("content_en", editor.getHTML())
	});
	const [keywordInput, setKeywordInput] = useState("");
	function parseKeywords(text) {
		if (!text) return [];
		return text.split(/[,،;.\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
	}
	function addKeyword() {
		if (!keywordInput) return;
		const parsed = parseKeywords(keywordInput);
		if (parsed.length > 0) {
			const existing = new Set(data.keywords || []);
			const toAdd = parsed.filter((k) => !existing.has(k));
			if (toAdd.length > 0) setData("keywords", [...data.keywords || [], ...toAdd]);
		}
		setKeywordInput("");
	}
	function removeKeyword(kw) {
		setData("keywords", (data.keywords || []).filter((k) => k !== kw));
	}
	function clearKeywords() {
		setData("keywords", []);
	}
	function handleImageDelete(imageId) {
		setData("deleted_image_ids", [...data.deleted_image_ids, imageId]);
	}
	function handleImageUpdate(imageId, field, value) {
		setData(`image_updates.${imageId}.${field}`, value);
	}
	function handleSubmit(e) {
		e.preventDefault();
		let currentKeywords = data.keywords || [];
		if (keywordInput.trim()) {
			const parsed = parseKeywords(keywordInput);
			if (parsed.length > 0) {
				const existing = new Set(currentKeywords);
				const toAdd = parsed.filter((k) => !existing.has(k));
				currentKeywords = [...currentKeywords, ...toAdd];
			}
		}
		const payload = {
			...data,
			keywords: currentKeywords
		};
		if (isEditing) {
			transform(() => ({
				...payload,
				_method: "put"
			}));
			post(`/admin/articles/${article.id}`, { preserveScroll: true });
		} else {
			transform(() => payload);
			post("/admin/articles", { preserveScroll: true });
		}
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("create") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mb-6",
			children: [/* @__PURE__ */ jsxs("h1", {
				className: "text-2xl font-bold text-secondary-950",
				children: [
					isEditing ? trans("edit") : trans("create"),
					" ",
					trans("sidebar_articles")
				]
			}), /* @__PURE__ */ jsxs("a", {
				href: "/admin/articles",
				className: "text-sm text-muted hover:text-secondary-950 transition-colors",
				children: ["← ", trans("back")]
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "max-w-6xl space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [trans("title_ar"), " *"]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.title_ar,
									onChange: (e) => setData("title_ar", e.target.value),
									dir: "rtl",
									required: true,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								errors.title_ar && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.title_ar
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("title_en")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.title_en,
									onChange: (e) => setData("title_en", e.target.value),
									required: true,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								errors.title_en && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.title_en
								})
							] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [trans("category"), " *"]
							}),
							/* @__PURE__ */ jsxs(Select, {
								value: data.category_id,
								onChange: (e) => setData("category_id", e.target.value),
								required: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "—"
								}), categories?.map((c) => /* @__PURE__ */ jsx("option", {
									value: c.id,
									children: isRtl ? c.name_ar : c.name_en
								}, c.id))]
							}),
							errors.category_id && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.category_id
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setContentTab("ar"),
									className: `px-3 py-1 text-xs rounded ${contentTab === "ar" ? "bg-primary-900 text-white" : "bg-surface text-secondary-700"}`,
									children: trans("lang_ar")
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setContentTab("en"),
									className: `px-3 py-1 text-xs rounded ${contentTab === "en" ? "bg-primary-900 text-white" : "bg-surface text-secondary-700"}`,
									children: trans("lang_en")
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [contentTab === "ar" ? trans("content_ar") : trans("content_en"), " *"]
							}),
							contentTab === "ar" && /* @__PURE__ */ jsxs("div", {
								className: "border border-secondary-200 rounded-lg overflow-hidden",
								dir: "rtl",
								children: [/* @__PURE__ */ jsx(MenuBar, {
									editor: editorAr,
									trans,
									articleTitle: data.title_ar
								}), /* @__PURE__ */ jsx(EditorContent, { editor: editorAr })]
							}),
							contentTab === "en" && /* @__PURE__ */ jsxs("div", {
								className: "border border-secondary-200 rounded-lg overflow-hidden",
								children: [/* @__PURE__ */ jsx(MenuBar, {
									editor: editorEn,
									trans,
									articleTitle: data.title_en
								}), /* @__PURE__ */ jsx(EditorContent, { editor: editorEn })]
							}),
							errors.content_ar && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.content_ar
							}),
							errors.content_en && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.content_en
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("excerpt_ar")
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.excerpt_ar,
									onChange: (e) => setData("excerpt_ar", e.target.value),
									rows: 3,
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								errors.excerpt_ar && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.excerpt_ar
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("excerpt_en")
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.excerpt_en,
									onChange: (e) => setData("excerpt_en", e.target.value),
									rows: 3,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								errors.excerpt_en && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.excerpt_en
								})
							] })]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("cover_image") || "Cover Image"
						}),
						data.cover_image ? /* @__PURE__ */ jsxs("div", {
							className: "relative group border border-secondary-200 rounded-lg overflow-hidden w-64 mb-4",
							children: [/* @__PURE__ */ jsx("img", {
								src: URL.createObjectURL(data.cover_image),
								alt: data.title_ar || data.title_en || "Cover preview",
								className: "w-full h-32 object-cover"
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
								children: /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setData("cover_image", null),
									className: "px-2 py-1 text-xs bg-error text-white rounded",
									children: trans("remove")
								})
							})]
						}) : isEditing && article?.images?.find((img) => img.position === "header" && !data.deleted_image_ids.includes(img.id)) && /* @__PURE__ */ jsxs("div", {
							className: "relative group border border-secondary-200 rounded-lg overflow-hidden w-64 mb-4",
							children: [/* @__PURE__ */ jsx("img", {
								src: article.images.find((img) => img.position === "header").url,
								alt: article.title || "Cover",
								className: "w-full h-32 object-cover"
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
								children: /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleImageDelete(article.images.find((img) => img.position === "header").id),
									className: "px-2 py-1 text-xs bg-error text-white rounded",
									children: trans("delete")
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("upload") || "Upload"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: "image/*",
								onChange: (e) => setData("cover_image", e.target.files[0]),
								className: "w-full text-sm file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-900 hover:file:bg-primary-100"
							}),
							errors.cover_image && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.cover_image
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("images") || "Images"
						}),
						existingImages.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4",
							children: existingImages.map((img) => /* @__PURE__ */ jsxs("div", {
								className: "border border-secondary-200 rounded-lg p-2 flex flex-col gap-2 relative",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "relative group rounded overflow-hidden",
										children: [/* @__PURE__ */ jsx("img", {
											src: img.url,
											alt: img.alt_text,
											className: "w-full h-32 object-cover"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleImageDelete(img.id),
												className: "px-2 py-1 text-xs bg-error text-white rounded",
												children: trans("delete")
											})
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: trans("alt_text"),
										value: data.image_updates[img.id]?.alt_text ?? (img.alt_text || ""),
										onChange: (e) => handleImageUpdate(img.id, "alt_text", e.target.value),
										className: "w-full px-2 py-1 border border-secondary-200 rounded text-xs"
									}),
									/* @__PURE__ */ jsxs("select", {
										value: data.image_updates[img.id]?.position ?? (img.position || "middle"),
										onChange: (e) => handleImageUpdate(img.id, "position", e.target.value),
										className: "w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "top",
												children: "أول المقال"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "middle",
												children: "وسط المقال"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "bottom",
												children: "آخر المقال"
											})
										]
									}),
									(data.image_updates[img.id]?.position ?? (img.position || "middle")) === "middle" && /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-secondary-600 bg-secondary-100 p-1 rounded text-center",
										dir: "rtl",
										children: ["كود الإضافة: ", /* @__PURE__ */ jsxs("code", {
											className: "font-bold text-primary-900 bg-white px-1 rounded inline-block",
											dir: "ltr",
											children: [
												"[صورة:",
												getShortcodeIndex("existing", img.id),
												"]"
											]
										})]
									})
								]
							}, img.id))
						}),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("upload_new_images") || "Upload Images"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								multiple: true,
								accept: "image/*",
								onChange: (e) => setData("images", [...data.images, ...Array.from(e.target.files)]),
								className: "w-full text-sm file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-900 hover:file:bg-primary-100"
							}),
							data.images.length > 0 && /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4",
								children: data.images.map((file, fileIndex) => /* @__PURE__ */ jsxs("div", {
									className: "border border-secondary-200 rounded-lg p-2 flex flex-col gap-2 relative",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "relative group rounded overflow-hidden",
											children: [/* @__PURE__ */ jsx("img", {
												src: URL.createObjectURL(file),
												alt: "Preview",
												className: "w-full h-32 object-cover"
											}), /* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
												children: /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => {
														const newImages = [...data.images];
														newImages.splice(fileIndex, 1);
														setData("images", newImages);
													},
													className: "px-2 py-1 text-xs bg-error text-white rounded",
													children: trans("delete")
												})
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: trans("alt_text"),
											onChange: (e) => {
												const alts = data.new_image_alts || {};
												setData("new_image_alts", {
													...alts,
													[fileIndex]: e.target.value
												});
											},
											className: "w-full px-2 py-1 border border-secondary-200 rounded text-xs"
										}),
										/* @__PURE__ */ jsxs("select", {
											onChange: (e) => {
												const pos = data.new_image_positions || {};
												setData("new_image_positions", {
													...pos,
													[fileIndex]: e.target.value
												});
											},
											value: (data.new_image_positions || {})[fileIndex] || "middle",
											className: "w-full px-2 py-1 border border-secondary-200 rounded text-xs bg-white",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "top",
													children: "أول المقال"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "middle",
													children: "وسط المقال"
												}),
												/* @__PURE__ */ jsx("option", {
													value: "bottom",
													children: "آخر المقال"
												})
											]
										}),
										((data.new_image_positions || {})[fileIndex] || "middle") === "middle" && /* @__PURE__ */ jsxs("p", {
											className: "text-xs text-secondary-600 bg-secondary-100 p-1 rounded text-center",
											dir: "rtl",
											children: ["كود الإضافة: ", /* @__PURE__ */ jsxs("code", {
												className: "font-bold text-primary-900 bg-white px-1 rounded inline-block",
												dir: "ltr",
												children: [
													"[صورة:",
													getShortcodeIndex("new", fileIndex),
													"]"
												]
											})]
										})
									]
								}, fileIndex))
							}),
							errors.images && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.images
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 space-y-4",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("seo")
						}),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("meta_description")
							}),
							/* @__PURE__ */ jsx("textarea", {
								value: data.meta_description,
								onChange: (e) => setData("meta_description", e.target.value),
								rows: 2,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							}),
							errors.meta_description && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.meta_description
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-semibold text-secondary-950",
									children: [trans("keywords"), /* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted font-normal ms-1",
										children: [
											"(",
											(data.keywords || []).length,
											")"
										]
									})]
								}), (data.keywords || []).length > 0 && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: clearKeywords,
									className: "text-xs text-red-600 hover:text-red-700 font-medium transition-colors",
									children: isRtl ? "تفريغ الكل" : "Clear All"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("textarea", {
									value: keywordInput,
									onChange: (e) => setKeywordInput(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											addKeyword();
										}
									},
									rows: 2,
									dir: isRtl ? "rtl" : "ltr",
									placeholder: isRtl ? "الصق النص أو الكلمات مفصولة بفاصلة (، أو .) أو سطر جديد..." : "Paste text or keywords separated by commas or newlines...",
									className: "flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: addKeyword,
									className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0",
									children: trans("add")
								})]
							}),
							(data.keywords || []).length > 0 && /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface",
								children: data.keywords.map((kw) => /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors",
									children: [kw, /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => removeKeyword(kw),
										className: "text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none",
										children: "×"
									})]
								}, kw))
							}),
							errors.keywords && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.keywords
							})
						] })
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-xl shadow-card p-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							id: "is_published",
							checked: data.is_published,
							onChange: (e) => setData("is_published", e.target.checked),
							className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
						}), /* @__PURE__ */ jsx("label", {
							htmlFor: "is_published",
							className: "text-sm font-medium text-secondary-950",
							children: trans("publish")
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-3",
					children: [/* @__PURE__ */ jsx("a", {
						href: "/admin/articles",
						className: "px-6 py-2.5 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
						children: trans("cancel")
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "px-6 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
						children: processing ? trans("loading") : isEditing ? trans("update") : trans("save")
					})]
				})
			]
		})]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Articles/Index.jsx
var Index_exports$15 = /* @__PURE__ */ __exportAll({ default: () => AdminArticlesIndex });
function AdminArticlesIndex({ articles, categories, filters }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [search, setSearch] = useState(filters?.search || "");
	const [categoryFilter, setCategoryFilter] = useState(filters?.category_id || "");
	function applyFilters() {
		router.get("/admin/articles", {
			search,
			category_id: categoryFilter
		}, {
			preserveState: true,
			preserveScroll: true
		});
	}
	function togglePublish(articleId) {
		router.post(`/admin/articles/${articleId}/publish`, {}, { preserveScroll: true });
	}
	function confirmDelete(articleId) {
		if (window.confirm(trans("confirm_delete"))) router.delete(`/admin/articles/${articleId}`, { preserveScroll: true });
	}
	const data = articles?.data || articles || [];
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("blog") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_articles")
				}), /* @__PURE__ */ jsx("a", {
					href: "/admin/articles/create",
					className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors",
					children: trans("add_new")
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-950 mb-1",
						children: trans("search")
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: trans("search"),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-950 mb-1",
						children: trans("category")
					}), /* @__PURE__ */ jsxs(Select, {
						value: categoryFilter,
						onChange: (e) => setCategoryFilter(e.target.value),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: trans("all_categories")
						}), categories?.map((c) => /* @__PURE__ */ jsx("option", {
							value: c.id,
							children: isRtl ? c.name_ar : c.name_en
						}, c.id))]
					})] }),
					/* @__PURE__ */ jsx("button", {
						onClick: applyFilters,
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium",
						children: trans("search")
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-start rtl:text-right",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("title")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("category")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("status")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("views")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("created_at")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("actions")
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: data.length > 0 ? data.map((a) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 font-medium text-secondary-950 max-w-xs truncate",
								children: a.title
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-muted",
								children: a.category ? isRtl ? a.category.name_ar : a.category.name_en : "—"
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: `inline-block px-2 py-0.5 text-xs rounded-full font-medium ${a.is_published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
									children: a.is_published ? trans("published") : trans("draft")
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-muted",
								children: a.views_count || 0
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-xs text-muted whitespace-nowrap",
								children: a.created_at
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 items-center",
									children: [
										/* @__PURE__ */ jsx("a", {
											href: `/admin/articles/${a.id}/edit`,
											className: "text-xs px-2 py-1 rounded bg-surface text-secondary-700 hover:bg-secondary-200 transition-colors",
											children: trans("edit")
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => togglePublish(a.id),
											className: `text-xs px-2 py-1 rounded transition-colors ${a.is_published ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`,
											children: a.is_published ? trans("unpublish") : trans("publish")
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => confirmDelete(a.id),
											className: "text-xs px-2 py-1 rounded bg-error/10 text-error hover:bg-error/20 transition-colors",
											children: trans("delete")
										})
									]
								})
							})
						]
					}, a.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 6,
						className: "px-4 py-12 text-center text-muted",
						children: trans("no_data")
					}) }) })]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Categories/Index.jsx
var Index_exports$14 = /* @__PURE__ */ __exportAll({ default: () => AdminCategoriesIndex });
function AdminCategoriesIndex({ categories }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [editingId, setEditingId] = useState(null);
	const { data, setData, post, put, processing, errors, reset } = useForm({
		name_ar: "",
		name_en: ""
	});
	function startEdit(category) {
		setEditingId(category.id);
		setData({
			name_ar: category.name_ar,
			name_en: category.name_en
		});
	}
	function cancelEdit() {
		setEditingId(null);
		reset();
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (editingId) put(`/admin/categories/${editingId}`, {
			preserveScroll: true,
			onSuccess: () => cancelEdit()
		});
		else post("/admin/categories", {
			preserveScroll: true,
			onSuccess: () => reset()
		});
	}
	function confirmDelete(categoryId) {
		if (window.confirm(trans("confirm_delete"))) router.delete(`/admin/categories/${categoryId}`, { preserveScroll: true });
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_categories") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-between mb-6",
			children: /* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold text-secondary-950",
				children: trans("sidebar_categories")
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card p-6 h-fit",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-semibold text-secondary-950 mb-4",
					children: editingId ? trans("edit") : trans("create")
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [trans("name_ar"), " *"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.name_ar,
								onChange: (e) => setData("name_ar", e.target.value),
								required: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							}),
							errors.name_ar && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.name_ar
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [trans("name_en"), " *"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.name_en,
								onChange: (e) => setData("name_en", e.target.value),
								required: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							}),
							errors.name_en && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.name_en
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
								children: processing ? trans("loading") : editingId ? trans("update") : trans("save")
							}), editingId && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: cancelEdit,
								className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
								children: trans("cancel")
							})]
						})
					]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "lg:col-span-2 bg-white rounded-xl shadow-card overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-start rtl:text-right",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: "#"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_ar")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_en")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("slug")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("actions")
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: categories.length > 0 ? categories.map((c) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-muted text-xs",
								children: c.id
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 font-medium text-secondary-950",
								children: c.name_ar
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-secondary-700",
								children: c.name_en
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-xs text-muted",
								children: c.slug
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 items-center",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => startEdit(c),
										className: "text-xs px-2 py-1 rounded bg-surface text-secondary-700 hover:bg-secondary-200 transition-colors",
										children: trans("edit")
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => confirmDelete(c.id),
										className: "text-xs px-2 py-1 rounded bg-error/10 text-error hover:bg-error/20 transition-colors",
										children: trans("delete")
									})]
								})
							})
						]
					}, c.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						className: "px-4 py-12 text-center text-muted",
						children: trans("no_data")
					}) }) })]
				})
			})]
		})]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Dashboard.jsx
var Dashboard_exports = /* @__PURE__ */ __exportAll({ default: () => Dashboard });
function StatCard({ title, value, subtext, icon, color = "primary", badge }) {
	const colorClasses = {
		primary: "bg-primary-50 text-primary-900 border-primary-100",
		blue: "bg-blue-50 text-blue-700 border-blue-100",
		emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
		amber: "bg-amber-50 text-amber-700 border-amber-100"
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl p-5 border border-secondary-100 shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden flex flex-col justify-between",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between mb-3",
			children: [/* @__PURE__ */ jsx("div", {
				className: `w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses[color] || colorClasses.primary}`,
				children: /* @__PURE__ */ jsx("svg", {
					className: "w-6 h-6",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 1.75,
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: icon
					})
				})
			}), badge && /* @__PURE__ */ jsx("span", {
				className: "px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse",
				children: badge
			})]
		}), /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-3xl font-black text-secondary-950 tracking-tight",
				children: value ?? 0
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-sm font-semibold text-secondary-700 mt-1",
				children: title
			}),
			subtext && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted mt-1 font-medium",
				children: subtext
			})
		] })]
	});
}
function CustomTooltip({ active, payload, label, locale, isRtl }) {
	if (!active || !payload || !payload.length) return null;
	const date = new Date(label);
	const formattedDate = isNaN(date.getTime()) ? label : date.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	const count = payload[0].value;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "bg-secondary-950 text-white p-3.5 rounded-2xl shadow-2xl border border-secondary-800 backdrop-blur-md",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[11px] text-secondary-400 font-semibold mb-1",
			children: formattedDate
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-primary-500" }), /* @__PURE__ */ jsxs("span", {
				className: "text-sm font-bold text-white",
				children: [
					count,
					" ",
					isRtl ? "زيارة" : "visits"
				]
			})]
		})]
	});
}
function Dashboard({ stats, topProjects = [], topUnits = [], recentUnits = [], recentMessages = [], visitsChart = [] }) {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const pendingMessagesCount = stats?.pending_messages || 0;
	const [rangeDays, setRangeDays] = useState(30);
	const [showAllTopProjects, setShowAllTopProjects] = useState(false);
	const [showAllTopUnits, setShowAllTopUnits] = useState(false);
	const filteredChartData = useMemo(() => {
		if (!visitsChart || visitsChart.length === 0) return [];
		return visitsChart.slice(-rangeDays);
	}, [visitsChart, rangeDays]);
	const displayedProjects = useMemo(() => {
		if (!topProjects) return [];
		return showAllTopProjects ? topProjects : topProjects.slice(0, 5);
	}, [topProjects, showAllTopProjects]);
	const displayedUnits = useMemo(() => {
		if (!topUnits) return [];
		return showAllTopUnits ? topUnits : topUnits.slice(0, 5);
	}, [topUnits, showAllTopUnits]);
	const chartSummary = useMemo(() => {
		if (!filteredChartData || filteredChartData.length === 0) return {
			total: 0,
			avg: 0,
			max: {
				count: 0,
				date: ""
			}
		};
		const total = filteredChartData.reduce((acc, curr) => acc + (curr.count || 0), 0);
		return {
			total,
			avg: (total / filteredChartData.length).toFixed(1),
			max: filteredChartData.reduce((maxObj, curr) => curr.count > maxObj.count ? curr : maxObj, {
				count: 0,
				date: ""
			})
		};
	}, [filteredChartData]);
	function formatXAxisTick(dateStr) {
		if (!dateStr) return "";
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;
		return date.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
			day: "numeric",
			month: "short"
		});
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("dashboard_title") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("dashboard_title")
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						title: isRtl ? "إجمالي الوحدات" : "Total Units",
						value: stats?.total_units,
						subtext: isRtl ? `بيع: ${stats?.sale_units || 0} | إيجار: ${stats?.rent_units || 0}` : `Sale: ${stats?.sale_units || 0} | Rent: ${stats?.rent_units || 0}`,
						color: "primary",
						icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						title: isRtl ? "المشاريع العقارية" : "Total Projects",
						value: stats?.total_projects,
						subtext: isRtl ? "كمبوندات ومشاريع مميزة" : "Compounds & Major Projects",
						color: "blue",
						icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						title: isRtl ? "إجمالي المشاهدات" : "Total Views",
						value: stats?.total_views,
						subtext: isRtl ? "إجمالي زيارات الوحدات والمشاريع" : "Combined views across listings",
						color: "emerald",
						icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						title: isRtl ? "استفسارات العملاء" : "Customer Messages",
						value: stats?.total_messages,
						subtext: isRtl ? `معلق: ${pendingMessagesCount}` : `Pending: ${pendingMessagesCount}`,
						color: "amber",
						badge: pendingMessagesCount > 0 ? isRtl ? `${pendingMessagesCount} معلق` : `${pendingMessagesCount} pending` : null,
						icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl border border-secondary-100 shadow-card p-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-secondary-950",
							children: isRtl ? "إحصائيات حركة الزيارات" : "Website Traffic Analytics"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted mt-0.5",
							children: isRtl ? `معدل الزيارات في آخر ${rangeDays} يوماً` : `Traffic pattern over last ${rangeDays} days`
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1 bg-surface p-1 rounded-xl border border-secondary-200/60 shrink-0",
							children: [
								{
									days: 7,
									label: isRtl ? "7 أيام" : "7 Days"
								},
								{
									days: 14,
									label: isRtl ? "14 يوم" : "14 Days"
								},
								{
									days: 30,
									label: isRtl ? "30 يوم" : "30 Days"
								}
							].map((item) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setRangeDays(item.days),
								className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${rangeDays === item.days ? "bg-primary-900 text-white shadow-sm" : "text-secondary-600 hover:text-secondary-950 hover:bg-white/60"}`,
								children: item.label
							}, item.days))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-3 gap-3 mb-6 p-3 bg-surface/60 rounded-xl border border-secondary-100 text-center",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted font-medium",
								children: isRtl ? "إجمالي زيارات الفترة" : "Period Total"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm font-black text-secondary-950 mt-0.5",
								children: chartSummary.total
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "border-x border-secondary-200/60",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted font-medium",
									children: isRtl ? "المتوسط اليومي" : "Daily Avg"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm font-black text-primary-900 mt-0.5",
									children: chartSummary.avg
								})]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted font-medium",
								children: isRtl ? "أعلى زيارة يومية" : "Peak Day"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm font-black text-emerald-600 mt-0.5",
								children: chartSummary.max.count
							})] })
						]
					}),
					filteredChartData?.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, {
						width: "100%",
						height: 280,
						children: /* @__PURE__ */ jsxs(AreaChart, {
							data: filteredChartData,
							margin: {
								top: 10,
								right: 10,
								left: -20,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
									id: "colorVisits",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ jsx("stop", {
										offset: "5%",
										stopColor: "#CC0000",
										stopOpacity: .3
									}), /* @__PURE__ */ jsx("stop", {
										offset: "95%",
										stopColor: "#CC0000",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ jsx(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "#F1F5F9",
									vertical: false
								}),
								/* @__PURE__ */ jsx(XAxis, {
									dataKey: "date",
									tick: {
										fontSize: 11,
										fill: "#64748B"
									},
									tickFormatter: formatXAxisTick,
									interval: rangeDays === 30 ? 4 : rangeDays === 14 ? 1 : 0
								}),
								/* @__PURE__ */ jsx(YAxis, {
									allowDecimals: false,
									tick: {
										fontSize: 11,
										fill: "#64748B"
									}
								}),
								/* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(CustomTooltip, {
									locale,
									isRtl
								}) }),
								/* @__PURE__ */ jsx(Area, {
									type: "monotone",
									dataKey: "count",
									stroke: "#CC0000",
									strokeWidth: 3,
									fillOpacity: 1,
									fill: "url(#colorVisits)",
									activeDot: {
										r: 6,
										fill: "#CC0000",
										stroke: "#FFF",
										strokeWidth: 3
									}
								})
							]
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted text-center py-16",
						children: trans("no_data")
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-secondary-100 shadow-card p-6 flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-base font-bold text-secondary-950 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-600" }), isRtl ? "أعلى المشاريع زيارة" : "Top Viewed Projects"]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/projects",
							className: "text-xs text-primary-900 font-bold hover:underline",
							children: isRtl ? "عرض الكل" : "View All"
						})]
					}), displayedProjects?.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: displayedProjects.map((project, i) => {
							const projName = isRtl ? project.name_ar || project.name : project.name_en || project.name;
							return /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: `w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary-600"}`,
										children: ["#", i + 1]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-secondary-950 truncate",
											children: projName
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[11px] text-muted truncate",
											children: project.area?.name_ar || project.area?.name_en || "—"
										})]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-xs font-bold text-primary-900 bg-primary-50 px-2 py-1 rounded-lg shrink-0",
										children: [
											project.views_count,
											" ",
											isRtl ? "زيارة" : "views"
										]
									})
								]
							}, project.id);
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted text-center py-12",
						children: trans("no_data")
					})] }), topProjects?.length > 5 && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowAllTopProjects(!showAllTopProjects),
						className: "w-full mt-5 py-2.5 bg-surface hover:bg-secondary-100 text-secondary-800 text-xs font-bold rounded-xl border border-secondary-200/80 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]",
						children: [/* @__PURE__ */ jsx("span", { children: showAllTopProjects ? isRtl ? "عرض أقل" : "Show Less" : isRtl ? `عرض باقي أعلى ${topProjects.length} مشاريع` : `Show All Top ${topProjects.length} Projects` }), /* @__PURE__ */ jsx("svg", {
							className: `w-4 h-4 transition-transform duration-200 ${showAllTopProjects ? "rotate-180" : ""}`,
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M19.5 8.25l-7.5 7.5-7.5-7.5"
							})
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-secondary-100 shadow-card p-6 flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-base font-bold text-secondary-950 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-600" }), isRtl ? "أعلى الوحدات زيارة" : "Top Viewed Units"]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/units",
							className: "text-xs text-primary-900 font-bold hover:underline",
							children: isRtl ? "عرض الكل" : "View All"
						})]
					}), displayedUnits?.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: displayedUnits.map((unit, i) => {
							const unitName = isRtl ? unit.name_ar || unit.name_en : unit.name_en || unit.name_ar;
							return /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: `w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${i === 0 ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary-600"}`,
										children: ["#", i + 1]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx(Link, {
											href: `/admin/units/${unit.id}/edit`,
											className: "text-xs font-bold text-secondary-950 truncate hover:text-primary-900 block",
											children: unitName
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-muted truncate",
											children: [
												unit.area?.name_ar || unit.area?.name_en || "",
												" • ",
												unit.price ? Number(unit.price).toLocaleString() + " EGP" : ""
											]
										})]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1",
										children: [/* @__PURE__ */ jsx("span", { children: unit.views_count || 0 }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-emerald-600 font-normal",
											children: isRtl ? "زيارة" : "views"
										})]
									})
								]
							}, unit.id);
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted text-center py-12",
						children: trans("no_data")
					})] }), topUnits?.length > 5 && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowAllTopUnits(!showAllTopUnits),
						className: "w-full mt-5 py-2.5 bg-surface hover:bg-secondary-100 text-secondary-800 text-xs font-bold rounded-xl border border-secondary-200/80 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]",
						children: [/* @__PURE__ */ jsx("span", { children: showAllTopUnits ? isRtl ? "عرض أقل" : "Show Less" : isRtl ? `عرض باقي أعلى ${topUnits.length} وحدات` : `Show All Top ${topUnits.length} Units` }), /* @__PURE__ */ jsx("svg", {
							className: `w-4 h-4 transition-transform duration-200 ${showAllTopUnits ? "rotate-180" : ""}`,
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M19.5 8.25l-7.5 7.5-7.5-7.5"
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-secondary-100 shadow-card p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-secondary-950",
							children: isRtl ? "أحدث العقارات المضافة" : "Recently Added Units"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/units",
							className: "text-xs text-primary-900 font-bold hover:underline",
							children: isRtl ? "إدارة العقارات" : "Manage Units"
						})]
					}), recentUnits?.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-secondary-100",
						children: recentUnits.map((unit) => {
							const unitName = isRtl ? unit.name_ar || unit.name_en : unit.name_en || unit.name_ar;
							const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null);
							return /* @__PURE__ */ jsxs("div", {
								className: "py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [thumb ? /* @__PURE__ */ jsx("img", {
										src: thumb,
										alt: "",
										className: "w-12 h-12 rounded-xl object-cover shrink-0 border border-secondary-200"
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-12 h-12 rounded-xl bg-surface border border-secondary-200 shrink-0 flex items-center justify-center text-secondary-400",
										children: /* @__PURE__ */ jsx("svg", {
											className: "w-6 h-6",
											fill: "none",
											viewBox: "0 0 24 24",
											stroke: "currentColor",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 1.5,
												d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
											})
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-secondary-950 truncate",
											children: unitName
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-[11px] text-muted mt-0.5",
											children: [
												unit.price ? Number(unit.price).toLocaleString() + " EGP" : "—",
												" • ",
												unit.area?.name_ar || unit.area?.name_en || ""
											]
										})]
									})]
								}), /* @__PURE__ */ jsx(Link, {
									href: `/admin/units/${unit.id}/edit`,
									className: "px-3 py-1.5 text-xs font-semibold bg-surface hover:bg-secondary-200 text-secondary-800 rounded-lg transition-colors shrink-0",
									children: isRtl ? "تعديل" : "Edit"
								})]
							}, unit.id);
						})
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted text-center py-8",
						children: trans("no_data")
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl border border-secondary-100 shadow-card p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-secondary-950",
							children: isRtl ? "أحدث الرسائل والاستفسارات" : "Recent Inquiries"
						}), /* @__PURE__ */ jsx(Link, {
							href: "/admin/messages",
							className: "text-xs text-primary-900 font-bold hover:underline",
							children: isRtl ? "عرض الرسائل" : "View Messages"
						})]
					}), recentMessages?.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-secondary-100",
						children: recentMessages.map((msg) => /* @__PURE__ */ jsxs("div", {
							className: "py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs font-bold text-secondary-950 truncate",
											children: msg.client_name
										}), /* @__PURE__ */ jsx("span", {
											className: `px-2 py-0.5 rounded text-[10px] font-bold ${msg.status === "replied" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
											children: msg.status === "replied" ? isRtl ? "تم الرد" : "Replied" : isRtl ? "معلق" : "Pending"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-secondary-600 mt-1 truncate",
										children: msg.content || msg.client_phone
									}),
									msg.unit && /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-primary-900 font-medium mt-0.5 truncate",
										children: ["📌 ", isRtl ? msg.unit.name_ar : msg.unit.name_en]
									})
								]
							}), /* @__PURE__ */ jsx("a", {
								href: `https://wa.me/${msg.client_phone?.replace(/[^0-9]/g, "")}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1",
								children: "WhatsApp"
							})]
						}, msg.id))
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted text-center py-8",
						children: trans("no_data")
					})]
				})]
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Features/Index.jsx
var Index_exports$13 = /* @__PURE__ */ __exportAll({ default: () => AdminFeaturesIndex });
function AdminFeaturesIndex({ features }) {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [editing, setEditing] = useState(null);
	const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
		name_ar: "",
		name_en: "",
		icon: ""
	});
	function startCreate() {
		setEditing("new");
		reset();
	}
	function startEdit(feature) {
		setEditing(feature.id);
		setData({
			name_ar: feature.name_ar,
			name_en: feature.name_en,
			icon: feature.icon || ""
		});
	}
	function cancelEdit() {
		setEditing(null);
		reset();
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (editing === "new") post("/admin/features", {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
		else put(`/admin/features/${editing}`, {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
	}
	function handleDelete(feature) {
		if (confirm(trans("confirm_delete") || "Are you sure you want to delete this item?")) destroy(`/admin/features/${feature.id}`, { preserveScroll: true });
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_features") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_features") || "Features"
				}), editing !== "new" && /* @__PURE__ */ jsx("button", {
					onClick: startCreate,
					className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950",
					children: trans("add") || "Add"
				})]
			}),
			flash?.success && /* @__PURE__ */ jsx("div", {
				className: "mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm",
				children: flash.success
			}),
			(editing === "new" || typeof editing === "number") && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-white rounded-xl shadow-card p-6 mb-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("name_ar") || "Name (AR)"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: data.name_ar,
						onChange: (e) => setData("name_ar", e.target.value),
						required: true,
						dir: "rtl",
						className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("name_en") || "Name (EN)"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: data.name_en,
						onChange: (e) => setData("name_en", e.target.value),
						required: true,
						dir: "ltr",
						className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
						children: processing ? trans("loading") || "Loading..." : trans("save") || "Save"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: cancelEdit,
						className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200",
						children: trans("cancel") || "Cancel"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-left",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("name_ar") || "Name (AR)"
							}),
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("name_en") || "Name (EN)"
							}),
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("actions") || "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-secondary-100",
						children: [(!features || features.length === 0) && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 3,
							className: "px-4 py-8 text-center text-muted",
							children: trans("no_data") || "No data available"
						}) }), features?.map((feature) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-surface/50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: feature.name_ar
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: feature.name_en
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => startEdit(feature),
											className: "text-xs text-primary-900 hover:text-primary-950 font-medium",
											children: trans("edit") || "Edit"
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleDelete(feature),
											className: "text-xs text-red-600 hover:text-red-700 font-medium",
											children: trans("delete") || "Delete"
										})]
									})
								})
							]
						}, feature.id))]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/FinishingTypes/Index.jsx
var Index_exports$12 = /* @__PURE__ */ __exportAll({ default: () => AdminFinishingTypesIndex });
function AdminFinishingTypesIndex({ finishingTypes }) {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [editing, setEditing] = useState(null);
	const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
		name_ar: "",
		name_en: ""
	});
	function startCreate() {
		setEditing("new");
		reset();
	}
	function startEdit(finishingType) {
		setEditing(finishingType.id);
		setData({
			name_ar: finishingType.name_ar,
			name_en: finishingType.name_en
		});
	}
	function cancelEdit() {
		setEditing(null);
		reset();
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (editing === "new") post("/admin/finishing-types", {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
		else put(`/admin/finishing-types/${editing}`, {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
	}
	function handleDelete(finishingType) {
		if (confirm(trans("confirm_delete") || "Are you sure you want to delete this item?")) destroy(`/admin/finishing-types/${finishingType.id}`, { preserveScroll: true });
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_finishing_types") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_finishing_types") || "Finishing Types"
				}), editing !== "new" && /* @__PURE__ */ jsx("button", {
					onClick: startCreate,
					className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950",
					children: trans("add") || "Add"
				})]
			}),
			flash?.success && /* @__PURE__ */ jsx("div", {
				className: "mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm",
				children: flash.success
			}),
			(editing === "new" || typeof editing === "number") && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-white rounded-xl shadow-card p-6 mb-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-4 mb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("name_ar") || "Name (AR)"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: data.name_ar,
						onChange: (e) => setData("name_ar", e.target.value),
						required: true,
						dir: "rtl",
						className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("name_en") || "Name (EN)"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: data.name_en,
						onChange: (e) => setData("name_en", e.target.value),
						required: true,
						dir: "ltr",
						className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
						children: processing ? trans("loading") || "Loading..." : trans("save") || "Save"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: cancelEdit,
						className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200",
						children: trans("cancel") || "Cancel"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-left",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("name_ar") || "Name (AR)"
							}),
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("name_en") || "Name (EN)"
							}),
							/* @__PURE__ */ jsx("th", {
								className: `px-4 py-3 font-medium ${isRtl ? "text-right" : "text-left"}`,
								children: trans("actions") || "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-secondary-100",
						children: [(!finishingTypes || finishingTypes.length === 0) && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 3,
							className: "px-4 py-8 text-center text-muted",
							children: trans("no_data") || "No data available"
						}) }), finishingTypes?.map((type) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-surface/50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: type.name_ar
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: type.name_en
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => startEdit(type),
											className: "text-xs text-primary-900 hover:text-primary-950 font-medium",
											children: trans("edit") || "Edit"
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleDelete(type),
											className: "text-xs text-red-600 hover:text-red-700 font-medium",
											children: trans("delete") || "Delete"
										})]
									})
								})
							]
						}, type.id))]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Messages/Index.jsx
var Index_exports$11 = /* @__PURE__ */ __exportAll({ default: () => AdminMessagesIndex });
function AdminMessagesIndex({ messages, agents, filters }) {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isAdmin = auth?.user?.role === "admin";
	const [statusFilter, setStatusFilter] = useState(filters?.status || "");
	const [agentFilter, setAgentFilter] = useState(filters?.agent_id || "");
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [deleting, setDeleting] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			router.reload({
				only: ["messages"],
				preserveScroll: true
			});
		}, 3e4);
		return () => clearInterval(interval);
	}, []);
	function applyFilters() {
		router.get("/admin/messages", {
			status: statusFilter,
			agent_id: agentFilter
		}, {
			preserveState: true,
			preserveScroll: true
		});
	}
	function markReplied(messageId) {
		router.post(`/admin/messages/${messageId}/replied`, {}, {
			preserveScroll: true,
			only: ["messages"]
		});
	}
	function deleteMessage(messageId) {
		if (!confirm(trans("messages.confirm_delete"))) return;
		setSelectedMessage(null);
		router.delete(`/admin/messages/${messageId}`, {
			preserveScroll: true,
			only: ["messages"]
		});
	}
	const data = messages?.data || messages || [];
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [
		/* @__PURE__ */ jsx(Head, { title: trans("sidebar_messages") + " — " + trans("app_name") }),
		/* @__PURE__ */ jsxs("div", {
			dir: isRtl ? "rtl" : "ltr",
			className: "p-6",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950 mb-6",
					children: trans("sidebar_messages")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-secondary-950 mb-1",
							children: trans("messages.status")
						}), /* @__PURE__ */ jsxs(Select, {
							value: statusFilter,
							onChange: (e) => setStatusFilter(e.target.value),
							className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: trans("messages.all")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "pending",
									children: trans("messages.status_pending")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "replied",
									children: trans("messages.status_replied")
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-secondary-950 mb-1",
							children: trans("messages.filter_by_agent")
						}), /* @__PURE__ */ jsxs(Select, {
							value: agentFilter,
							onChange: (e) => setAgentFilter(e.target.value),
							className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: trans("messages.all_agents")
							}), agents?.map((a) => /* @__PURE__ */ jsx("option", {
								value: a.id,
								children: a.name
							}, a.id))]
						})] }),
						/* @__PURE__ */ jsx("button", {
							onClick: applyFilters,
							className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium",
							children: trans("search")
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-xl shadow-card overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-surface text-secondary-700 text-start rtl:text-right",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.unit")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.client_info")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.message_content")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.status")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.sent_at")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("messages.replied_at")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("actions")
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: data.length > 0 ? data.map((m) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors cursor-pointer",
							onClick: () => setSelectedMessage(m),
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: "text-secondary-950 font-medium",
										children: m.unit?.name || "—"
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "text-sm",
										children: [
											/* @__PURE__ */ jsx("p", {
												className: "font-medium text-secondary-950",
												children: m.client_name
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted",
												children: m.client_phone
											}),
											m.client_email && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted",
												children: m.client_email
											})
										]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 max-w-xs",
									children: /* @__PURE__ */ jsx("p", {
										className: "text-secondary-700 truncate",
										children: m.content
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-block px-2 py-0.5 text-xs rounded-full font-medium ${m.status === "replied" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`,
										children: m.status === "replied" ? trans("messages.status_replied") : trans("messages.status_pending")
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-muted whitespace-nowrap",
									children: m.created_at
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-muted whitespace-nowrap",
									children: m.replied_at || "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("div", {
										className: "flex gap-1",
										children: m.status === "pending" && /* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.stopPropagation();
												markReplied(m.id);
											},
											className: "text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors",
											children: trans("messages.mark_as_replied")
										})
									})
								})
							]
						}, m.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "px-4 py-12 text-center text-muted",
							children: trans("messages.no_messages")
						}) }) })]
					})
				})
			]
		}),
		selectedMessage && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
			onClick: () => setSelectedMessage(null),
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold text-secondary-950",
							children: trans("messages.message_details")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setSelectedMessage(null),
							className: "text-muted hover:text-secondary-950 text-xl leading-none",
							children: "×"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-3 text-sm",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.client_name")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-950 font-medium",
								children: selectedMessage.client_name
							})] }),
							selectedMessage.client_phone && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.client_phone")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-950 font-medium",
								children: selectedMessage.client_phone
							})] }),
							selectedMessage.client_email && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.client_email")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-950 font-medium",
								children: selectedMessage.client_email
							})] }),
							selectedMessage.unit && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.unit")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-950 font-medium",
								children: selectedMessage.unit.name
							})] }),
							selectedMessage.agent && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.agent")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-950 font-medium",
								children: selectedMessage.agent.name
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-muted text-xs block",
								children: trans("messages.message_content")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-700 bg-surface rounded-lg p-3 mt-1 whitespace-pre-wrap",
								children: selectedMessage.content
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-4 text-xs text-muted",
								children: [/* @__PURE__ */ jsxs("span", { children: [
									trans("messages.sent_at"),
									": ",
									selectedMessage.created_at
								] }), selectedMessage.replied_at && /* @__PURE__ */ jsxs("span", { children: [
									trans("messages.replied_at"),
									": ",
									selectedMessage.replied_at
								] })]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 mt-6 pt-4 border-t border-secondary-100",
						children: [
							selectedMessage.status === "pending" && /* @__PURE__ */ jsx("button", {
								onClick: () => {
									markReplied(selectedMessage.id);
									setSelectedMessage(null);
								},
								className: "px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors",
								children: trans("messages.mark_as_replied")
							}),
							isAdmin && /* @__PURE__ */ jsx("button", {
								onClick: () => deleteMessage(selectedMessage.id),
								disabled: deleting,
								className: "px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50",
								children: deleting ? trans("deleting") : trans("delete")
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => setSelectedMessage(null),
								className: "px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
								children: trans("close")
							})
						]
					})
				]
			})
		})
	] });
}
//#endregion
//#region resources/js/Utils/route.js
function localizedPath(path, locale) {
	if (!path) return "/";
	if (path.startsWith("http") || path.startsWith("//") || path.startsWith("/admin") || path.startsWith("/logout")) return path;
	const [pathPart, ...queryParts] = path.split("?");
	const queryString = queryParts.length > 0 ? "?" + queryParts.join("?") : "";
	let normalizedPath = pathPart;
	if (normalizedPath.startsWith("/ar/") || normalizedPath === "/ar") normalizedPath = normalizedPath.substring(3);
	else if (normalizedPath.startsWith("/en/") || normalizedPath === "/en") normalizedPath = normalizedPath.substring(3);
	if (!normalizedPath.startsWith("/")) normalizedPath = "/" + normalizedPath;
	if (normalizedPath === "/") return `/${locale}${queryString}`;
	return `/${locale}${normalizedPath}${queryString}`;
}
//#endregion
//#region resources/js/Pages/Admin/Notifications/Index.jsx
var Index_exports$10 = /* @__PURE__ */ __exportAll({ default: () => NotificationsIndex });
var TYPE_META = {
	unit_expiry_warning: {
		icon: "clock",
		gradient: "from-amber-500 to-orange-500",
		bg: "bg-amber-50",
		border: "border-amber-200",
		text: "text-amber-800",
		label: {
			ar: "تنبيه انتهاء وحدة",
			en: "Unit Expiry Warning"
		}
	},
	unit_expired: {
		icon: "exclamation",
		gradient: "from-red-500 to-rose-500",
		bg: "bg-red-50",
		border: "border-red-200",
		text: "text-red-800",
		label: {
			ar: "وحدة منتهية",
			en: "Unit Expired"
		}
	},
	project_expiry_warning: {
		icon: "clock",
		gradient: "from-amber-500 to-orange-500",
		bg: "bg-amber-50",
		border: "border-amber-200",
		text: "text-amber-800",
		label: {
			ar: "تنبيه انتهاء مشروع",
			en: "Project Expiry Warning"
		}
	},
	new_project_created: {
		icon: "plus",
		gradient: "from-emerald-500 to-green-500",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		text: "text-emerald-800",
		label: {
			ar: "مشروع جديد",
			en: "New Project"
		}
	},
	new_message: {
		icon: "message",
		gradient: "from-blue-500 to-indigo-500",
		bg: "bg-blue-50",
		border: "border-blue-200",
		text: "text-blue-800",
		label: {
			ar: "رسالة جديدة",
			en: "New Message"
		}
	},
	unit_pending_approval: {
		icon: "clock",
		gradient: "from-amber-500 to-orange-500",
		bg: "bg-amber-50",
		border: "border-amber-200",
		text: "text-amber-800",
		label: {
			ar: "وحدة بانتظار الموافقة",
			en: "Unit Pending Approval"
		}
	},
	unit_approved: {
		icon: "check",
		gradient: "from-emerald-500 to-green-500",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		text: "text-emerald-800",
		label: {
			ar: "تم الموافقة على الوحدة",
			en: "Unit Approved"
		}
	}
};
var TYPE_DEFAULT = {
	icon: "bell",
	gradient: "from-secondary-400 to-secondary-500",
	bg: "bg-secondary-100",
	border: "border-secondary-200",
	text: "text-secondary-800",
	label: {
		ar: "إشعار",
		en: "Notification"
	}
};
var ICON_PATHS = {
	clock: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
	exclamation: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
	plus: "M12 4.5v15m7.5-7.5h-15",
	message: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
	bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
	check: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
};
function TypeIcon({ type, className = "w-5 h-5" }) {
	return /* @__PURE__ */ jsx("svg", {
		className,
		fill: "none",
		viewBox: "0 0 24 24",
		stroke: "currentColor",
		strokeWidth: 1.5,
		children: /* @__PURE__ */ jsx("path", {
			strokeLinecap: "round",
			strokeLinejoin: "round",
			d: ICON_PATHS[(TYPE_META[type] || TYPE_DEFAULT).icon]
		})
	});
}
function groupByDate(items, isRtl, trans) {
	const now = /* @__PURE__ */ new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = /* @__PURE__ */ new Date(today.getTime() - 864e5);
	const weekAgo = /* @__PURE__ */ new Date(today.getTime() - 6 * 864e5);
	const groups = {
		today: [],
		yesterday: [],
		week: [],
		earlier: []
	};
	items.forEach((item) => {
		const d = new Date(item.created_at);
		const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		if (date.getTime() === today.getTime()) groups.today.push(item);
		else if (date.getTime() === yesterday.getTime()) groups.yesterday.push(item);
		else if (date >= weekAgo) groups.week.push(item);
		else groups.earlier.push(item);
	});
	const labels = {
		today: trans("today"),
		yesterday: trans("yesterday"),
		week: trans("this_week"),
		earlier: trans("earlier")
	};
	return Object.entries(groups).filter(([, v]) => v.length > 0).map(([key, items]) => ({
		label: labels[key],
		items
	}));
}
function NotificationsIndex({ notifications, unreadCount }) {
	const { locale, auth, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isAdmin = auth?.user?.role === "admin";
	const isManager = auth?.user?.role === "manager";
	const [activeTab, setActiveTab] = useState("all");
	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [confirmClearAll, setConfirmClearAll] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			router.reload({
				only: ["notifications", "unreadCount"],
				preserveScroll: true
			});
		}, 3e4);
		return () => clearInterval(interval);
	}, []);
	const items = notifications?.data || [];
	const filteredItems = items.filter((item) => {
		if (activeTab === "unread") return !item.read_at;
		if (activeTab === "expiry") return item.type === "unit_expiry_warning" || item.type === "unit_expired" || item.type === "project_expiry_warning";
		return true;
	});
	const grouped = useMemo(() => groupByDate(filteredItems, isRtl, trans), [
		filteredItems,
		isRtl,
		trans
	]);
	function handleMarkAllRead() {
		router.post("/admin/notifications/read-all", {}, { preserveScroll: true });
	}
	function handleMarkRead(id) {
		router.post(`/admin/notifications/${id}/read`, {}, { preserveScroll: true });
	}
	function handleDeleteOne(id) {
		router.delete(`/admin/notifications/${id}`, {}, { preserveScroll: true });
	}
	function handleDeleteAll() {
		router.delete("/admin/notifications/all/clear", {}, { preserveScroll: true });
		setConfirmClearAll(false);
	}
	function handleExtendProject(projectId) {
		router.post(`/admin/projects/${projectId}/extend`, {}, { preserveScroll: true });
	}
	function handleExtendUnit(unitId) {
		router.post(`/admin/units/${unitId}/extend-expiry`, {}, { preserveScroll: true });
	}
	function handleApproveProject(projectId) {
		router.post(`/admin/projects/${projectId}/approve`, {}, { preserveScroll: true });
	}
	function handleApproveUnit(unitId) {
		router.post(`/admin/units/${unitId}/approve`, {}, { preserveScroll: true });
	}
	function handleDeleteUnit(unitId) {
		router.delete(`/admin/units/${unitId}/force`, {}, { preserveScroll: true });
		setConfirmDeleteId(null);
	}
	function getMeta(type) {
		return TYPE_META[type] || TYPE_DEFAULT;
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: (trans("sidebar_notifications") || "الإشعارات") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-4 md:p-6 max-w-5xl mx-auto space-y-5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-xl bg-primary-900/10 text-primary-900 flex items-center justify-center",
						children: /* @__PURE__ */ jsx("svg", {
							className: "w-5 h-5",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.5,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							})
						})
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
						className: "text-xl font-bold text-secondary-950",
						children: trans("sidebar_notifications") || (isRtl ? "الإشعارات" : "Notifications")
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-secondary-500",
						children: trans("notifications_subtitle")
					})] })]
				}) }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [unreadCount > 0 && /* @__PURE__ */ jsxs("button", {
						onClick: handleMarkAllRead,
						className: "px-3.5 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-sm font-medium rounded-xl transition-colors flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M5 13l4 4L19 7"
							})
						}), trans("mark_all_read")]
					}), items.length > 0 && (confirmClearAll ? /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: handleDeleteAll,
							className: "px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors",
							children: trans("confirm_clear_all")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setConfirmClearAll(false),
							className: "px-3 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-sm rounded-xl transition-colors",
							children: trans("cancel")
						})]
					}) : /* @__PURE__ */ jsxs("button", {
						onClick: () => setConfirmClearAll(true),
						className: "px-3.5 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-colors flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							})
						}), trans("clear_all")]
					}))]
				})]
			}),
			flash?.success && /* @__PURE__ */ jsxs("div", {
				className: "p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in shadow-xs",
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-5 h-5 text-emerald-600 shrink-0",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					})
				}), flash.success]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl shadow-card border border-secondary-100 p-1.5 flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab("all"),
						className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === "all" ? "bg-primary-900 text-white shadow-sm" : "text-secondary-600 hover:bg-secondary-100"}`,
						children: [trans("all"), /* @__PURE__ */ jsx("span", {
							className: `text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === "all" ? "bg-white/20 text-white" : "bg-secondary-200 text-secondary-600"}`,
							children: items.length
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab("unread"),
						className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === "unread" ? "bg-primary-900 text-white shadow-sm" : "text-secondary-600 hover:bg-secondary-100"}`,
						children: [trans("unread"), unreadCount > 0 && /* @__PURE__ */ jsx("span", {
							className: `text-[11px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === "unread" ? "bg-white/20" : unreadCount > 0 ? "bg-amber-100 text-amber-700" : "bg-secondary-200 text-secondary-600"}`,
							children: unreadCount
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setActiveTab("expiry"),
						className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === "expiry" ? "bg-amber-600 text-white shadow-sm" : "text-secondary-600 hover:bg-secondary-100"}`,
						children: trans("expiry")
					})
				]
			}),
			filteredItems.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl p-12 md:p-16 text-center border border-secondary-100 shadow-card",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-5",
						children: /* @__PURE__ */ jsx("svg", {
							className: "w-10 h-10 text-secondary-400",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							})
						})
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-secondary-900 mb-1.5",
						children: activeTab === "unread" ? trans("no_unread_notifications") : activeTab === "expiry" ? trans("no_expiry_notifications") : trans("no_notifications_yet")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-secondary-500 max-w-sm mx-auto",
						children: trans("notifications_empty_hint")
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-8",
				children: grouped.map((group) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-3",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold text-secondary-500 tracking-wider uppercase",
							children: group.label
						}),
						/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-secondary-200" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-secondary-400 font-medium",
							children: group.items.length
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: group.items.map((item) => {
						const meta = getMeta(item.type);
						const isUnread = !item.read_at;
						const isUnitExpiry = item.type === "unit_expiry_warning";
						const isUnitExpired = item.type === "unit_expired";
						const isProjectExpiry = item.type === "project_expiry_warning";
						const isNewMessage = item.type === "new_message";
						const isNewProject = item.type === "new_project_created";
						const isUnitPendingApproval = item.type === "unit_pending_approval";
						return /* @__PURE__ */ jsxs("div", {
							className: `relative bg-white rounded-2xl shadow-card border transition-all duration-200 hover:shadow-md ${isUnread ? "border-primary-900/30 bg-gradient-to-r from-primary-50/40 to-transparent" : "border-secondary-100 hover:border-secondary-300"}`,
							children: [isUnread && /* @__PURE__ */ jsx("div", { className: "absolute start-0 top-3 bottom-3 w-1 bg-primary-900 rounded-full" }), /* @__PURE__ */ jsx("div", {
								className: `p-4 md:p-5 ${isUnread ? "ps-5 md:ps-6" : ""}`,
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3.5",
									children: [/* @__PURE__ */ jsx("div", {
										className: `w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br ${meta.gradient} text-white shadow-sm`,
										children: /* @__PURE__ */ jsx(TypeIcon, {
											type: item.type,
											className: "w-5 h-5"
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-start justify-between gap-2 mb-1",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center flex-wrap gap-2",
													children: [
														/* @__PURE__ */ jsx("h3", {
															className: `text-sm ${isUnread ? "font-bold text-secondary-950" : "font-semibold text-secondary-800"}`,
															children: isRtl ? item.title || meta.label.ar : item.title_en || meta.label.en
														}),
														isUnread && /* @__PURE__ */ jsx("span", {
															className: "bg-primary-900/10 text-primary-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
															children: trans("new_badge")
														}),
														isUnread && item.days_remaining && /* @__PURE__ */ jsxs("span", {
															className: "bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1",
															children: [/* @__PURE__ */ jsx("svg", {
																className: "w-3 h-3",
																fill: "none",
																viewBox: "0 0 24 24",
																stroke: "currentColor",
																strokeWidth: 2,
																children: /* @__PURE__ */ jsx("path", {
																	strokeLinecap: "round",
																	strokeLinejoin: "round",
																	d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
																})
															}), trans("days_remaining", { count: item.days_remaining })]
														})
													]
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] text-secondary-400 whitespace-nowrap shrink-0",
													children: item.created_at_human
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-secondary-600 leading-relaxed mb-3",
												children: item.message
											}),
											(item.unit_name || item.project_name || isNewMessage) && /* @__PURE__ */ jsxs("div", {
												className: `${meta.bg} border ${meta.border} rounded-xl p-3 mb-3 text-xs space-y-1.5`,
												children: [
													item.unit_name && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-secondary-500 shrink-0",
															children: trans("unit") + ":"
														}), /* @__PURE__ */ jsx("span", {
															className: `font-semibold ${meta.text} text-end`,
															children: item.unit_name
														})]
													}),
													item.project_name && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-secondary-500 shrink-0",
															children: trans("project") + ":"
														}), /* @__PURE__ */ jsx("span", {
															className: `font-semibold ${meta.text} text-end`,
															children: item.project_name
														})]
													}),
													item.expires_at && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-secondary-500 shrink-0",
															children: trans("expires_label")
														}), /* @__PURE__ */ jsx("span", {
															className: "font-semibold text-amber-700",
															children: new Date(item.expires_at).toLocaleDateString(isRtl ? "ar-SA" : "en-US")
														})]
													}),
													item.creator_name && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-secondary-500 shrink-0",
															children: trans("by_label")
														}), /* @__PURE__ */ jsx("span", {
															className: "font-semibold text-primary-900 text-end",
															children: item.creator_name
														})]
													}),
													item.area_name && /* @__PURE__ */ jsxs("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ jsx("span", {
															className: "text-secondary-500 shrink-0",
															children: trans("area") + ":"
														}), /* @__PURE__ */ jsx("span", {
															className: `font-semibold ${meta.text} text-end`,
															children: item.area_name
														})]
													}),
													isNewMessage && /* @__PURE__ */ jsxs(Fragment, { children: [
														item.client_name && /* @__PURE__ */ jsxs("div", {
															className: "flex items-center justify-between gap-2",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-secondary-500 shrink-0",
																children: trans("client_name") + ":"
															}), /* @__PURE__ */ jsx("span", {
																className: "font-semibold text-blue-700 text-end",
																children: item.client_name
															})]
														}),
														item.client_phone && /* @__PURE__ */ jsxs("div", {
															className: "flex items-center justify-between gap-2",
															children: [/* @__PURE__ */ jsx("span", {
																className: "text-secondary-500 shrink-0",
																children: trans("phone") + ":"
															}), /* @__PURE__ */ jsx("a", {
																href: `tel:${item.client_phone}`,
																className: "font-semibold text-primary-900 hover:underline text-end",
																dir: "ltr",
																children: item.client_phone
															})]
														}),
														item.content && /* @__PURE__ */ jsx("p", {
															className: `${meta.text} mt-1 leading-relaxed line-clamp-2`,
															children: item.content
														})
													] })
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center flex-wrap gap-1.5",
												children: [
													isUnread && /* @__PURE__ */ jsx("button", {
														onClick: () => handleMarkRead(item.id),
														className: "px-3 py-1.5 bg-primary-900/10 hover:bg-primary-900/20 text-primary-900 text-xs font-semibold rounded-lg transition-colors",
														children: trans("mark_read")
													}),
													isUnread && isNewProject && item.project_id && isAdmin && /* @__PURE__ */ jsx("button", {
														onClick: () => handleApproveProject(item.project_id),
														className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors",
														children: isRtl ? "موافقة ونشر" : "Approve & publish"
													}),
													isUnread && isUnitPendingApproval && item.unit_id && (isAdmin || isManager) && /* @__PURE__ */ jsx("button", {
														onClick: () => handleApproveUnit(item.unit_id),
														className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors",
														children: isRtl ? "موافقة ونشر" : "Approve & publish"
													}),
													isUnread && isUnitExpiry && item.unit_id && isAdmin && /* @__PURE__ */ jsxs("button", {
														onClick: () => handleExtendUnit(item.unit_id),
														className: "px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
															})
														}), trans("extend")]
													}),
													isUnread && isProjectExpiry && item.project_id && isAdmin && /* @__PURE__ */ jsxs("button", {
														onClick: () => handleExtendProject(item.project_id),
														className: "px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
															})
														}), trans("extend")]
													}),
													(isUnitExpiry || isUnitExpired) && item.unit_id && isAdmin && (confirmDeleteId === item.id ? /* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("button", {
															onClick: () => handleDeleteUnit(item.unit_id),
															className: "px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors",
															children: trans("confirm")
														}), /* @__PURE__ */ jsx("button", {
															onClick: () => setConfirmDeleteId(null),
															className: "px-3 py-1.5 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 text-xs rounded-lg transition-colors",
															children: trans("cancel")
														})]
													}) : /* @__PURE__ */ jsxs("button", {
														onClick: () => setConfirmDeleteId(item.id),
														className: "px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															})
														}), trans("delete")]
													})),
													item.unit_slug && /* @__PURE__ */ jsxs(Link, {
														href: localizedPath(`/units/${item.unit_slug}`, locale),
														target: "_blank",
														className: "px-3 py-1.5 text-secondary-500 hover:bg-secondary-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
															})
														}), trans("view")]
													}),
													item.project_slug && /* @__PURE__ */ jsxs(Link, {
														href: localizedPath(`/projects/${item.project_slug}`, locale),
														target: "_blank",
														className: "px-3 py-1.5 text-secondary-500 hover:bg-secondary-100 text-xs font-medium rounded-lg transition-colors flex items-center gap-1",
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
															})
														}), trans("view")]
													}),
													/* @__PURE__ */ jsx("button", {
														onClick: () => handleDeleteOne(item.id),
														className: "px-3 py-1.5 text-secondary-400 hover:text-red-600 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors",
														title: trans("delete_notification"),
														children: /* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M6 18L18 6M6 6l12 12"
															})
														})
													})
												]
											})
										]
									})]
								})
							})]
						}, item.id);
					})
				})] }, group.label))
			}),
			notifications?.last_page > 1 && /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center gap-2 pt-2",
				children: Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => /* @__PURE__ */ jsx(Link, {
					href: notifications.path + "?page=" + page,
					className: `w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${page === notifications.current_page ? "bg-primary-900 text-white shadow-sm" : "bg-white text-secondary-600 border border-secondary-200 hover:border-primary-900/30 hover:text-primary-900"}`,
					children: page
				}, page))
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Points/Index.jsx
var Index_exports$9 = /* @__PURE__ */ __exportAll({ default: () => PointsIndex });
function PointsIndex({ managers, ledger, units, filters, pointsSettings }) {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const user = auth?.user;
	const isAdmin = user?.role === "admin";
	const isManager = user?.role === "manager";
	const loading = !managers || !ledger;
	const [showAllocateModal, setShowAllocateModal] = useState(false);
	const [showResetConfirm, setShowResetConfirm] = useState(false);
	const [localFilters, setLocalFilters] = useState(filters || {
		manager_id: "",
		type: "",
		date_from: "",
		date_to: "",
		search: ""
	});
	const [formErrors, setFormErrors] = useState({});
	useEffect(() => {
		if (filters) setLocalFilters(filters);
	}, [filters]);
	const { data, setData, post, processing } = useForm({
		unit_id: "",
		points: "",
		notes: ""
	});
	function updateFilter(key, value) {
		setLocalFilters((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function applyFilters() {
		router.get("/admin/points", localFilters, {
			preserveState: true,
			preserveScroll: true
		});
	}
	function resetFilters() {
		setLocalFilters({
			manager_id: "",
			type: "",
			date_from: "",
			date_to: "",
			search: ""
		});
		router.get("/admin/points");
	}
	function validateAllocate() {
		const errors = {};
		if (!data.unit_id) errors.unit_id = trans("field_required", {}, "points");
		if (!data.points || isNaN(data.points) || Number(data.points) <= 0) errors.points = trans("points_must_be_positive", {}, "points");
		if (data.points && Number(data.points) > (user?.points_balance || 0)) errors.points = trans("points_exceed_balance", {}, "points");
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	}
	function handleAllocate(e) {
		e.preventDefault();
		if (!validateAllocate()) return;
		post("/admin/points/allocate", {
			preserveScroll: true,
			onSuccess: () => {
				setShowAllocateModal(false);
				setData({
					unit_id: "",
					points: "",
					notes: ""
				});
				setFormErrors({});
			}
		});
	}
	function handleResetConfirm() {
		router.post("/admin/points/reset", {}, {
			preserveScroll: true,
			onSuccess: () => setShowResetConfirm(false)
		});
	}
	function handleDailyDeduct() {
		router.post("/admin/points/daily-deduct", {}, { preserveScroll: true });
	}
	const typeOptions = [
		{
			value: "",
			label: trans("transaction_type")
		},
		{
			value: "allocate",
			label: trans("allocate")
		},
		{
			value: "daily_deduct",
			label: trans("daily_deduction")
		},
		{
			value: "monthly_reset",
			label: trans("monthly_reset")
		},
		{
			value: "admin_adjust",
			label: trans("admin_adjust")
		}
	];
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("points") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_points")
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [isManager && /* @__PURE__ */ jsx("button", {
						onClick: () => setShowAllocateModal(true),
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors",
						children: trans("allocate_points")
					}), isAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: handleDailyDeduct,
						className: "px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors",
						children: trans("run_daily_deduct", {}, "points")
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setShowResetConfirm(true),
						className: "px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors",
						children: trans("monthly_reset")
					})] })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card overflow-x-auto mb-6",
				children: [/* @__PURE__ */ jsx("div", {
					className: "px-4 py-3 border-b border-secondary-100",
					children: /* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold text-secondary-950",
						children: trans("managers_balances", {}, "points")
					})
				}), /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-start rtl:text-right",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("current_balance", {}, "points")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("initial_balance", {}, "points")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("units_count", {}, "projects")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("last_update", {}, "points")
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: loading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsx(SkeletonRow, { cols: 5 }, i)) : managers?.length > 0 ? managers.map((mgr) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 font-medium text-secondary-950",
								children: mgr.name
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: `font-medium ${(mgr.points_balance ?? 0) > 0 ? "text-green-600" : "text-secondary-700"}`,
									children: mgr.points_balance ?? 0
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-secondary-700",
								children: mgr.initial_monthly_balance ?? 0
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: mgr.units_count ?? 0
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-muted text-xs",
								children: mgr.updated_at ? new Date(mgr.updated_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								}) : "—"
							})
						]
					}, mgr.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 5,
						className: "px-4 py-12 text-center text-muted",
						children: trans("no_managers")
					}) }) })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card overflow-x-auto",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "px-4 py-3 border-b border-secondary-100",
						children: /* @__PURE__ */ jsx("h2", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("points_ledger", {}, "points")
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-b border-secondary-100 flex flex-wrap gap-3 items-end",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("transaction_type")
							}), /* @__PURE__ */ jsx(Select, {
								value: localFilters.type,
								onChange: (e) => updateFilter("type", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								children: typeOptions.map((opt) => /* @__PURE__ */ jsx("option", {
									value: opt.value,
									children: opt.label
								}, opt.value))
							})] }),
							managers?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("manager")
							}), /* @__PURE__ */ jsxs(Select, {
								value: localFilters.manager_id,
								onChange: (e) => updateFilter("manager_id", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: trans("all_managers")
								}), managers.map((mgr) => /* @__PURE__ */ jsx("option", {
									value: mgr.id,
									children: mgr.name
								}, mgr.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("date_from")
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: localFilters.date_from,
								onChange: (e) => updateFilter("date_from", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("date_to")
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: localFilters.date_to,
								onChange: (e) => updateFilter("date_to", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("search")
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: localFilters.search || "",
								onChange: (e) => updateFilter("search", e.target.value),
								placeholder: trans("search"),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: applyFilters,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors",
									children: trans("search")
								}), /* @__PURE__ */ jsx("button", {
									onClick: resetFilters,
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
									children: trans("reset")
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-surface text-secondary-700 text-start rtl:text-right",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("transaction_date")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("transaction_type")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("manager")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("target_unit")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("points")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("balance_after")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3 font-medium",
									children: trans("notes")
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: loading ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(SkeletonRow, { cols: 7 }, i)) : ledger?.data?.length > 0 ? ledger.data.map((tx) => /* @__PURE__ */ jsxs("tr", {
							className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 whitespace-nowrap text-xs",
									children: tx.created_at ? new Date(tx.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
										year: "numeric",
										month: "short",
										day: "numeric"
									}) : "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: `font-medium ${tx.type === "allocate" || tx.type === "admin_adjust" ? "text-green-600" : tx.type === "daily_deduct" ? "text-amber-600" : "text-secondary-950"}`,
										children: trans(tx.type) || tx.type
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: tx.manager?.name ?? tx.performed_by ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: tx.unit?.name ?? "—"
								}),
								/* @__PURE__ */ jsxs("td", {
									className: `px-4 py-3 font-medium ${(tx.points ?? 0) >= 0 ? "text-green-600" : "text-red-500"}`,
									children: [tx.points >= 0 ? "+" : "", tx.points]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: tx.balance_after ?? "—"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-muted max-w-40 truncate",
									title: tx.notes,
									children: tx.notes ?? "—"
								})
							]
						}, tx.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "px-4 py-12 text-center text-muted",
							children: trans("no_transactions")
						}) }) })]
					}),
					ledger?.meta && ledger.meta.last_page > 1 && /* @__PURE__ */ jsxs("div", {
						className: "px-4 py-3 border-t border-secondary-100 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-muted",
							children: [
								trans("showing"),
								" ",
								ledger.meta.from ?? 0,
								"–",
								ledger.meta.to ?? 0,
								" ",
								trans("of"),
								" ",
								ledger.meta.total
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-1",
							children: [ledger.links?.prev && /* @__PURE__ */ jsx("button", {
								onClick: () => router.get(ledger.links.prev, {}, {
									preserveState: true,
									preserveScroll: true
								}),
								className: "px-3 py-1 bg-surface text-secondary-700 rounded text-xs hover:bg-secondary-200",
								children: trans("previous")
							}), ledger.links?.next && /* @__PURE__ */ jsx("button", {
								onClick: () => router.get(ledger.links.next, {}, {
									preserveState: true,
									preserveScroll: true
								}),
								className: "px-3 py-1 bg-surface text-secondary-700 rounded text-xs hover:bg-secondary-200",
								children: trans("next")
							})]
						})]
					})
				]
			}),
			showAllocateModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowAllocateModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("allocate_points")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowAllocateModal(false),
							className: "text-muted hover:text-secondary-950 text-xl leading-none",
							children: "×"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleAllocate,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [trans("target_unit"), " *"]
								}),
								/* @__PURE__ */ jsxs(Select, {
									value: data.unit_id,
									onChange: (e) => setData("unit_id", e.target.value),
									className: `w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${formErrors.unit_id ? "border-red-500" : "border-secondary-200"}`,
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "—"
									}), units?.map((u) => /* @__PURE__ */ jsx("option", {
										value: u.id,
										children: u.name
									}, u.id))]
								}),
								formErrors.unit_id && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-red-500 mt-1",
									children: formErrors.unit_id
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [trans("points"), " *"]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "number",
									min: "1",
									max: user?.points_balance ?? 0,
									value: data.points,
									onChange: (e) => setData("points", e.target.value),
									className: `w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 ${formErrors.points ? "border-red-500" : "border-secondary-200"}`
								}),
								formErrors.points && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-red-500 mt-1",
									children: formErrors.points
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted mt-1",
									children: [
										trans("available_balance"),
										": ",
										user?.points_balance ?? 0
									]
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("notes")
							}), /* @__PURE__ */ jsx("textarea", {
								value: data.notes,
								onChange: (e) => setData("notes", e.target.value),
								rows: 3,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 justify-end pt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowAllocateModal(false),
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
									children: trans("cancel")
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
									children: processing ? trans("loading") : trans("allocate")
								})]
							})
						]
					})]
				})
			}),
			showResetConfirm && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowResetConfirm(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-secondary-950 mb-2",
							children: trans("monthly_reset_confirm_title")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-secondary-700 mb-6",
							children: trans("monthly_reset_confirm_text")
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 justify-end",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setShowResetConfirm(false),
								className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
								children: trans("cancel")
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleResetConfirm,
								className: "px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors",
								children: trans("confirm")
							})]
						})
					]
				})
			}),
			pointsSettings && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 p-4 bg-white rounded-xl shadow-card text-xs text-muted",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "font-medium text-secondary-700",
						children: [trans("settings"), ":"]
					}),
					" ",
					pointsSettings.daily_deduction_enabled ? `${trans("daily_deduction")}: ${pointsSettings.daily_deduction_value} pts` : `${trans("daily_deduction")}: ${trans("disabled")}`,
					" | ",
					trans("monthly_reset"),
					": ",
					trans("day"),
					" ",
					pointsSettings.monthly_reset_day,
					pointsSettings.monthly_reset_auto ? ` (${trans("auto")})` : ""
				]
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Points/Ledger.jsx
var Ledger_exports = /* @__PURE__ */ __exportAll({ default: () => PointsLedger });
var FILTER_MAP = {
	type: "",
	manager_id: "",
	date_from: "",
	date_to: ""
};
function PointsLedger({ transactions, managers, filters = FILTER_MAP }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [localFilters, setLocalFilters] = useState(filters);
	function applyFilters() {
		router.get("/admin/points/ledger", localFilters, {
			preserveState: true,
			preserveScroll: true
		});
	}
	function resetFilters() {
		setLocalFilters(FILTER_MAP);
		router.get("/admin/points/ledger");
	}
	function updateFilter(key, value) {
		setLocalFilters((prev) => ({
			...prev,
			[key]: value
		}));
	}
	const typeOptions = [
		{
			value: "",
			label: trans("transaction_type")
		},
		{
			value: "allocate",
			label: trans("allocate")
		},
		{
			value: "daily_deduct",
			label: trans("daily_deduction")
		},
		{
			value: "monthly_reset",
			label: trans("monthly_reset")
		},
		{
			value: "admin_adjust",
			label: trans("admin_adjust")
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "p-6",
		dir: isRtl ? "rtl" : "ltr",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold text-secondary-950 mb-6",
				children: trans("ledger")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-4 items-end",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("transaction_type")
					}), /* @__PURE__ */ jsx(Select, {
						value: localFilters.type,
						onChange: (e) => updateFilter("type", e.target.value),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
						children: typeOptions.map((opt) => /* @__PURE__ */ jsx("option", {
							value: opt.value,
							children: opt.label
						}, opt.value))
					})] }),
					managers && managers.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("performed_by")
					}), /* @__PURE__ */ jsxs(Select, {
						value: localFilters.manager_id,
						onChange: (e) => updateFilter("manager_id", e.target.value),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: trans("performed_by")
						}), managers.map((mgr) => /* @__PURE__ */ jsx("option", {
							value: mgr.id,
							children: mgr.name
						}, mgr.id))]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-sm font-medium text-secondary-950 mb-1",
						children: trans("transaction_date")
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2 items-center",
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: localFilters.date_from,
								onChange: (e) => updateFilter("date_from", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-muted",
								children: "—"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "date",
								value: localFilters.date_to,
								onChange: (e) => updateFilter("date_to", e.target.value),
								className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: applyFilters,
							className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors",
							children: trans("search")
						}), /* @__PURE__ */ jsx("button", {
							onClick: resetFilters,
							className: "px-4 py-2 bg-surface text-secondary-950 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
							children: trans("reset")
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-950 text-start",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("transaction_date")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("transaction_type")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("performed_by")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("target_unit")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("points")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("balance_after")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("notes")
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: transactions?.data?.length > 0 ? transactions.data.map((tx) => /* @__PURE__ */ jsxs("tr", {
						className: "border-t border-secondary-100 hover:bg-surface/50 transition-colors",
						children: [
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 whitespace-nowrap",
								children: new Date(tx.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ jsx("span", {
									className: tx.type === "admin_adjust" || tx.type === "allocate" ? "text-green-600" : "text-secondary-950",
									children: trans(tx.type)
								})
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: tx.performer?.name ?? tx.performed_by
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: tx.unit?.name ?? "—"
							}),
							/* @__PURE__ */ jsxs("td", {
								className: `px-4 py-3 font-medium ${tx.points >= 0 ? "text-green-600" : "text-red-500"}`,
								children: [tx.points >= 0 ? "+" : "", tx.points]
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3",
								children: tx.balance_after
							}),
							/* @__PURE__ */ jsx("td", {
								className: "px-4 py-3 text-muted max-w-xs truncate",
								children: tx.notes ?? "—"
							})
						]
					}, tx.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
						colSpan: 7,
						className: "px-4 py-12 text-center text-muted",
						children: trans("no_transactions")
					}) }) })]
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Profile/Edit.jsx
var Edit_exports = /* @__PURE__ */ __exportAll({ default: () => Edit });
function Edit({ user }) {
	const { auth, locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const fileInput = useRef(null);
	const currentUser = user || auth?.user || {};
	const [preview, setPreview] = useState(currentUser.avatar ? currentUser.avatar.startsWith("http") || currentUser.avatar.startsWith("/storage") ? currentUser.avatar : `/storage/${currentUser.avatar}` : null);
	const { data, setData, post, processing, errors } = useForm({
		name: currentUser.name || "",
		email: currentUser.email || "",
		phone: currentUser.phone || "",
		whatsapp: currentUser.whatsapp || "",
		facebook: currentUser.facebook || "",
		linkedin: currentUser.linkedin || "",
		password: "",
		password_confirmation: "",
		avatar: null
	});
	function handleImageChange(e) {
		const file = e.target.files[0];
		if (file) {
			setData("avatar", file);
			setPreview(URL.createObjectURL(file));
		}
	}
	function handleSubmit(e) {
		e.preventDefault();
		post("/admin/profile", {
			preserveScroll: true,
			onSuccess: () => {
				setData("password", "");
				setData("password_confirmation", "");
			}
		});
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, {
		title: trans("my_profile", {}, "admin"),
		children: [/* @__PURE__ */ jsx(Head, { title: trans("my_profile") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
			dir: isRtl ? "rtl" : "ltr",
			className: "max-w-2xl mx-auto bg-white rounded-xl shadow-card p-6",
			children: [flash?.success && /* @__PURE__ */ jsx("div", {
				className: "mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium",
				children: flash.success
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center sm:flex-row sm:items-start gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative group cursor-pointer",
							onClick: () => fileInput.current?.click(),
							children: [
								preview ? /* @__PURE__ */ jsx("img", {
									src: preview,
									alt: data.name,
									className: "w-24 h-24 rounded-full object-cover shadow-sm border-2 border-primary-100"
								}) : /* @__PURE__ */ jsx("div", {
									className: "w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 text-3xl font-bold border-2 border-primary-100",
									children: data.name.charAt(0).toUpperCase()
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
									children: /* @__PURE__ */ jsxs("svg", {
										className: "w-6 h-6 text-white",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										children: [/* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 2,
											d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
										}), /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 2,
											d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z"
										})]
									})
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									ref: fileInput,
									className: "hidden",
									accept: "image/*",
									onChange: handleImageChange
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 text-center sm:text-start pt-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-bold text-secondary-950",
									children: data.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted",
									children: trans(currentUser.role || "user")
								}),
								errors.avatar && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.avatar
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("hr", { className: "border-secondary-100" }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("name", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.name,
								onChange: (e) => setData("name", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								required: true
							}),
							errors.name && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.name
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("email", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "email",
								value: data.email,
								onChange: (e) => setData("email", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								required: true,
								dir: "ltr"
							}),
							errors.email && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.email
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("phone", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "tel",
								value: data.phone,
								onChange: (e) => setData("phone", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								dir: "ltr"
							}),
							errors.phone && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.phone
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("whatsapp", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.whatsapp,
								onChange: (e) => setData("whatsapp", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								placeholder: "+2010...",
								dir: "ltr"
							}),
							errors.whatsapp && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.whatsapp
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("facebook_link", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "url",
								value: data.facebook,
								onChange: (e) => setData("facebook", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								placeholder: "https://facebook.com/...",
								dir: "ltr"
							}),
							errors.facebook && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.facebook
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("social_linkedin", {}, "admin")
							}),
							/* @__PURE__ */ jsx("input", {
								type: "url",
								value: data.linkedin,
								onChange: (e) => setData("linkedin", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								placeholder: "https://linkedin.com/in/...",
								dir: "ltr"
							}),
							errors.linkedin && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.linkedin
							})
						] })]
					}),
					/* @__PURE__ */ jsx("hr", { className: "border-secondary-100" }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("h4", {
							className: "text-sm font-bold text-secondary-950 mb-1",
							children: trans("change_password", {}, "users")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted mb-3",
							children: isRtl ? "اترك حقول كلمة السر فارغة إذا كنت لا ترغب في تغيير كلمة السر الحالية" : "Leave password fields blank if you do not wish to change your current password"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-medium text-secondary-950 mb-1",
									children: trans("new_password", {}, "users")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: data.password,
									onChange: (e) => setData("password", e.target.value),
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
									placeholder: "••••••••"
								}),
								errors.password && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: errors.password
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-secondary-950 mb-1",
								children: trans("confirm_password", {}, "users")
							}), /* @__PURE__ */ jsx("input", {
								type: "password",
								value: data.password_confirmation,
								onChange: (e) => setData("password_confirmation", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								placeholder: "••••••••"
							})] })]
						})
					] }),
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-end pt-4",
						children: /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-6 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
							children: processing ? trans("loading", {}, "common") : trans("save", {}, "common")
						})
					})
				]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Projects/Form.jsx
var Form_exports$1 = /* @__PURE__ */ __exportAll({ default: () => AdminProjectForm });
var STEPS$1 = [
	{
		key: "basic",
		title_key: "basic_info"
	},
	{
		key: "media",
		title_key: "media"
	},
	{
		key: "seo",
		title_key: "seo"
	},
	{
		key: "location",
		title_key: "location"
	}
];
function AdminProjectForm({ project, areas, features, finishingTypes, managers }) {
	const { locale, errors, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isEdit = !!project;
	const isAdmin = auth?.user?.role === "admin";
	const [step, setStep] = useState(0);
	const [dirty, setDirty] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState("");
	const [primaryImageFile, setPrimaryImageFile] = useState(null);
	const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
	const primaryInputRef = useRef(null);
	const [newImagePreviews, setNewImagePreviews] = useState([]);
	const previewUrlsRef = useRef([]);
	const imagesInputRef = useRef(null);
	const [existingImages, setExistingImages] = useState(() => {
		if (!isEdit || !project?.images) return [];
		return [...project.images].sort((a, b) => a.sort_order - b.sort_order);
	});
	const { data, setData, post, processing, transform } = useForm({
		user_id: project?.user_id || "",
		manager_id: project?.user_id || "",
		name_ar: project?.name_ar || "",
		name_en: project?.name_en || project?.name || "",
		description_ar: project?.description_ar || "",
		description_en: project?.description_en || project?.description || "",
		area_id: project?.area_id || "",
		video_url: project?.video_url || "",
		keywords_ar: project?.keywords_ar || [],
		keywords_en: project?.keywords_en || [],
		meta_description_ar: project?.meta_description_ar || "",
		meta_description_en: project?.meta_description_en || "",
		map_embed_url: project?.map_embed_url || "",
		location_address_ar: project?.location_address_ar || "",
		location_address_en: project?.location_address_en || "",
		images: [],
		deleted_image_ids: [],
		image_order: [],
		payment_method: project?.payment_method || "",
		down_payment: project?.down_payment || "",
		installment_years: project?.installment_years || "",
		finishing_type_id: project?.finishing_type_id || "",
		features: project?.features?.map((f) => f.id) || []
	});
	const [keywordInputAr, setKeywordInputAr] = useState("");
	const [keywordInputEn, setKeywordInputEn] = useState("");
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (dirty) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [dirty]);
	useEffect(() => () => {
		previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
	}, []);
	useEffect(() => {
		if (existingImages.length > 0) setData("image_order", existingImages.map((img) => img.id));
	}, []);
	function handleChange(key, value) {
		setData(key, value);
		setDirty(true);
	}
	function compressImage(file, maxWidth = 1600, quality = .78) {
		return new Promise((resolve) => {
			if (!file || !file.type.startsWith("image/") || file.type.includes("svg")) {
				resolve(file);
				return;
			}
			const img = new Image();
			const url = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(url);
				let width = img.width;
				let height = img.height;
				if (width <= maxWidth && file.size < 400 * 1024) {
					resolve(file);
					return;
				}
				if (width > maxWidth) {
					height = Math.round(height * maxWidth / width);
					width = maxWidth;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				canvas.getContext("2d").drawImage(img, 0, 0, width, height);
				canvas.toBlob((blob) => {
					if (!blob || blob.size >= file.size) resolve(file);
					else resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
						type: "image/jpeg",
						lastModified: Date.now()
					}));
				}, "image/jpeg", quality);
			};
			img.onerror = () => resolve(file);
			img.src = url;
		});
	}
	async function handlePrimaryImageChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		setUploadStatus(locale === "ar" ? "جاري ضغط الصورة الرئيسية..." : "Compressing primary image...");
		const compressed = await compressImage(file);
		setUploadStatus("");
		setPrimaryImageFile(compressed);
		if (primaryImagePreview) URL.revokeObjectURL(primaryImagePreview);
		setPrimaryImagePreview(URL.createObjectURL(compressed));
		setDirty(true);
		handleChange("images", [compressed, ...newImagePreviews.map((p) => p.file)]);
	}
	function removePrimaryImage() {
		if (primaryImagePreview) URL.revokeObjectURL(primaryImagePreview);
		setPrimaryImageFile(null);
		setPrimaryImagePreview(null);
		if (primaryInputRef.current) primaryInputRef.current.value = "";
		handleChange("images", newImagePreviews.map((p) => p.file));
	}
	async function handleNewImages(event) {
		const rawFiles = Array.from(event.target.files || []);
		if (rawFiles.length === 0) return;
		setUploadStatus(locale === "ar" ? `جاري ضغط ${rawFiles.length} صورة بالتوازي...` : `Compressing ${rawFiles.length} image(s) in parallel...`);
		const files = await Promise.all(rawFiles.map((f) => compressImage(f)));
		previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
		const previews = files.map((file) => ({
			file,
			url: URL.createObjectURL(file)
		}));
		previewUrlsRef.current = previews.map((preview) => preview.url);
		setUploadStatus("");
		setNewImagePreviews(previews);
		handleChange("images", primaryImageFile ? [primaryImageFile, ...files] : files);
	}
	function removeNewImage(index) {
		const removed = newImagePreviews[index];
		if (removed) URL.revokeObjectURL(removed.url);
		const previews = newImagePreviews.filter((_, currentIndex) => currentIndex !== index);
		previewUrlsRef.current = previews.map((preview) => preview.url);
		setNewImagePreviews(previews);
		const secondaryFiles = previews.map((preview) => preview.file);
		handleChange("images", primaryImageFile ? [primaryImageFile, ...secondaryFiles] : secondaryFiles);
		if (imagesInputRef.current) imagesInputRef.current.value = "";
	}
	function parseKeywords(text) {
		if (!text) return [];
		return text.split(/[,،;.\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
	}
	function addKeywordAr() {
		if (!keywordInputAr) return;
		const parsed = parseKeywords(keywordInputAr);
		if (parsed.length > 0) {
			const existing = new Set(data.keywords_ar);
			const toAdd = parsed.filter((k) => !existing.has(k));
			if (toAdd.length > 0) {
				setData("keywords_ar", [...data.keywords_ar, ...toAdd]);
				setDirty(true);
			}
		}
		setKeywordInputAr("");
	}
	function removeKeywordAr(kw) {
		setData("keywords_ar", data.keywords_ar.filter((k) => k !== kw));
		setDirty(true);
	}
	function clearKeywordsAr() {
		setData("keywords_ar", []);
		setDirty(true);
	}
	function addKeywordEn() {
		if (!keywordInputEn) return;
		const parsed = parseKeywords(keywordInputEn);
		if (parsed.length > 0) {
			const existing = new Set(data.keywords_en);
			const toAdd = parsed.filter((k) => !existing.has(k));
			if (toAdd.length > 0) {
				setData("keywords_en", [...data.keywords_en, ...toAdd]);
				setDirty(true);
			}
		}
		setKeywordInputEn("");
	}
	function removeKeywordEn(kw) {
		setData("keywords_en", data.keywords_en.filter((k) => k !== kw));
		setDirty(true);
	}
	function clearKeywordsEn() {
		setData("keywords_en", []);
		setDirty(true);
	}
	function handleDeleteImage(imageId) {
		setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
		setData("deleted_image_ids", [...data.deleted_image_ids, imageId]);
		setData("image_order", data.image_order.filter((id) => id !== imageId));
		setDirty(true);
	}
	function setExistingAsPrimary(imageId) {
		const idx = existingImages.findIndex((img) => img.id === imageId);
		if (idx <= 0) return;
		const newOrder = [...existingImages];
		const [selected] = newOrder.splice(idx, 1);
		newOrder.unshift(selected);
		setExistingImages(newOrder);
		setData("image_order", newOrder.map((img) => img.id));
		setDirty(true);
	}
	function handleMoveImage(imageId, direction) {
		const idx = existingImages.findIndex((img) => img.id === imageId);
		if (idx === -1) return;
		const newOrder = [...existingImages];
		if (direction === "up" && idx > 0) [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
		else if (direction === "down" && idx < newOrder.length - 1) [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
		else return;
		setExistingImages(newOrder);
		setData("image_order", newOrder.map((img) => img.id));
		setDirty(true);
	}
	function toggleFeature(id) {
		if (data.features.includes(id)) setData("features", data.features.filter((f) => f !== id));
		else setData("features", [...data.features, id]);
		setDirty(true);
	}
	const [isSubmitting, setIsSubmitting] = useState(false);
	function handleSubmit() {
		if (processing || isSubmitting) return;
		setIsSubmitting(true);
		setDirty(false);
		setUploadProgress(0);
		if (data.images && data.images.length > 0) {
			const totalMB = (data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1);
			setUploadStatus(locale === "ar" ? `جاري رفع ${data.images.length} صورة (${totalMB} MB)...` : `Uploading ${data.images.length} image(s) (${totalMB} MB)...`);
		} else setUploadStatus(locale === "ar" ? "جاري حفظ البيانات..." : "Saving...");
		const url = isEdit ? `/admin/projects/${project.id}` : "/admin/projects";
		const payload = { ...data };
		if (isEdit) payload._method = "PUT";
		router.post(url, payload, {
			forceFormData: true,
			preserveScroll: true,
			onProgress: (progress) => {
				if (progress?.percentage !== void 0) {
					const pct = Math.round(progress.percentage);
					setUploadProgress(pct);
					if (pct >= 100) setUploadStatus(locale === "ar" ? "تم الرفع بنجاح، جاري الحفظ والتوجيه..." : "Uploaded, saving...");
				}
			},
			onFinish: () => {
				setIsSubmitting(false);
				setUploadProgress(0);
			},
			onError: (errs) => {
				setIsSubmitting(false);
				setUploadProgress(0);
				setUploadStatus(locale === "ar" ? "عفواً، تعذر الحفظ. يرجى مراجعة الأخطاء في أعلى الصفحة." : "Error saving data. Please check errors above.");
				if (errs && (errs.name_ar || errs.name_en || errs.area_id)) setStep(0);
			}
		});
	}
	function canNext() {
		if (step === 0) return data.name_ar || data.name_en;
		return true;
	}
	const hasErrors = errors && Object.keys(errors).length > 0;
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("add_project") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-3xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 mb-6",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/admin/projects",
					className: "text-sm text-muted hover:text-primary-900",
					children: ["← ", trans("sidebar_projects")]
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: isEdit ? trans("edit_project", {}, "projects") : trans("add_project", {}, "projects")
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 mb-8",
				children: STEPS$1.map((s, i) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-1",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => i <= step ? setStep(i) : null,
							className: `w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${i === step ? "bg-primary-900 text-white" : i < step ? "bg-green-500 text-white" : "bg-surface text-secondary-400"}`,
							children: i + 1
						}),
						/* @__PURE__ */ jsx("span", {
							className: `text-xs hidden sm:inline ${i === step ? "text-secondary-950 font-medium" : "text-muted"}`,
							children: trans(s.title_key) || s.key
						}),
						i < STEPS$1.length - 1 && /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-secondary-200" })
					]
				}, s.key))
			}),
			hasErrors && /* @__PURE__ */ jsxs("div", {
				className: "mb-6 p-4 bg-red-50 border-s-4 border-red-500 text-red-800 rounded-xl text-sm space-y-1.5 shadow-sm",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "font-bold flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-5 h-5 text-red-600 shrink-0",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						})
					}), locale === "ar" ? "تعذر حفظ البيانات بسبب الأخطاء التالية:" : "Could not save data due to errors:"]
				}), /* @__PURE__ */ jsx("ul", {
					className: "list-disc list-inside text-xs text-red-700 space-y-1 mt-1 font-medium",
					children: Object.entries(errors).map(([key, msg]) => /* @__PURE__ */ jsx("li", { children: msg }, key))
				})]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => e.preventDefault(),
				className: "bg-white rounded-xl shadow-card p-6",
				children: [
					step === 0 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [trans("name_ar"), " *"]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.name_ar,
									onChange: (e) => handleChange("name_ar", e.target.value),
									dir: "rtl",
									required: true,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("name_en")
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.name_en,
									onChange: (e) => handleChange("name_en", e.target.value),
									required: true,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("content_ar")
								}), /* @__PURE__ */ jsx("textarea", {
									value: data.description_ar,
									onChange: (e) => handleChange("description_ar", e.target.value),
									rows: 4,
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("content_en")
								}), /* @__PURE__ */ jsx("textarea", {
									value: data.description_en,
									onChange: (e) => handleChange("description_en", e.target.value),
									rows: 4,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("area")
							}), /* @__PURE__ */ jsxs(Select, {
								value: data.area_id,
								onChange: (e) => handleChange("area_id", e.target.value),
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "—"
								}), areas?.map((a) => /* @__PURE__ */ jsx("option", {
									value: a.id,
									children: locale === "ar" ? a.name_ar : a.name_en
								}, a.id))]
							})] }),
							isAdmin && managers?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-semibold text-secondary-950 mb-1",
								children: locale === "ar" ? "الوسيط المختص / صاحب المشروع" : "Assigned Agent / Manager"
							}), /* @__PURE__ */ jsxs(Select, {
								value: data.user_id || data.manager_id || "",
								onChange: (e) => {
									handleChange("user_id", e.target.value);
									handleChange("manager_id", e.target.value);
								},
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: locale === "ar" ? "اختر الوسيط المختص..." : "Select Agent..."
								}), managers?.map((m) => /* @__PURE__ */ jsxs("option", {
									value: m.id,
									children: [
										m.name,
										" (",
										m.role === "admin" ? locale === "ar" ? "أدمن" : "Admin" : m.role === "manager" ? locale === "ar" ? "مدير" : "Manager" : locale === "ar" ? "وسيط" : "Agent",
										")"
									]
								}, m.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-secondary-100",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("payment_method") || "Payment Method"
									}), /* @__PURE__ */ jsxs(Select, {
										value: data.payment_method,
										onChange: (e) => handleChange("payment_method", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "",
												children: "—"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "cash",
												children: trans("cash") || "Cash"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "installment",
												children: trans("installment") || "Installment"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "both",
												children: trans("both") || "Cash & Installment"
											})
										]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("finishing_type") || "Finishing Type"
									}), /* @__PURE__ */ jsxs(Select, {
										value: data.finishing_type_id,
										onChange: (e) => handleChange("finishing_type_id", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "—"
										}), finishingTypes?.map((f) => /* @__PURE__ */ jsx("option", {
											value: f.id,
											children: locale === "ar" ? f.name_ar : f.name_en
										}, f.id))]
									})] }),
									["installment", "both"].includes(data.payment_method) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("down_payment") || "Down Payment"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.down_payment,
										onChange: (e) => handleChange("down_payment", e.target.value),
										placeholder: locale === "ar" ? "مثال: 10% أو 500,000" : "e.g. 10% or 500,000",
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("installment_years") || "Installment Years"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.installment_years,
										onChange: (e) => handleChange("installment_years", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] })] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-3",
									children: trans("features") || "Features"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
									children: features?.map((feature) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											id: `project-feature-${feature.id}`,
											checked: data.features.includes(feature.id),
											onChange: () => toggleFeature(feature.id),
											className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
										}), /* @__PURE__ */ jsx("label", {
											htmlFor: `project-feature-${feature.id}`,
											className: "text-sm text-secondary-700 cursor-pointer select-none",
											children: locale === "ar" ? feature.name_ar : feature.name_en
										})]
									}, feature.id))
								})]
							})
						]
					}),
					step === 1 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-semibold text-secondary-950 mb-2",
								children: locale === "ar" ? "الصورة الرئيسية للمشروع *" : "Primary Project Image *"
							}), /* @__PURE__ */ jsxs("div", {
								className: "border-2 border-dashed border-secondary-200 rounded-xl overflow-hidden bg-surface transition-all hover:border-primary-900/40",
								children: [primaryImagePreview || existingImages.length > 0 && !primaryImageFile ? /* @__PURE__ */ jsxs("div", {
									className: "relative group",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: primaryImagePreview || existingImages[0]?.url,
											alt: "",
											className: "w-full h-56 object-cover"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "absolute top-3 start-3 bg-primary-900 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-3.5 h-3.5 fill-amber-400",
												viewBox: "0 0 20 20",
												children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
											}), locale === "ar" ? "الصورة الرئيسية" : "Primary Image"]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => primaryInputRef.current?.click(),
												className: "px-4 py-2 bg-white text-secondary-950 rounded-lg text-xs font-semibold hover:bg-secondary-100 shadow-md transition-colors",
												children: locale === "ar" ? "تغيير الصورة الرئيسية" : "Change Primary Image"
											}), primaryImagePreview && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: removePrimaryImage,
												className: "px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shadow-md transition-colors",
												children: locale === "ar" ? "إلغاء" : "Cancel"
											})]
										})
									]
								}) : /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => primaryInputRef.current?.click(),
									className: "w-full h-44 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary-900 transition-colors focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:outline-none rounded-xl",
									children: [
										/* @__PURE__ */ jsx("svg", {
											className: "w-9 h-9 text-secondary-400",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											"aria-hidden": "true",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 1.5,
												d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium",
											children: locale === "ar" ? "اضغط لرفع الصورة الرئيسية للمشروع" : "Upload Primary Project Image"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted",
											children: locale === "ar" ? "اختر صورة بارزة بدقة عالية" : "Choose a clear cover image"
										})
									]
								}), /* @__PURE__ */ jsx("input", {
									ref: primaryInputRef,
									type: "file",
									accept: "image/*",
									onChange: handlePrimaryImageChange,
									className: "hidden"
								})]
							})] }),
							isEdit && existingImages.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-semibold text-secondary-950 mb-2",
								children: locale === "ar" ? "معرض صور المشروع الحالية" : "Current Project Gallery"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
								children: existingImages.map((img, idx) => /* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-xl overflow-hidden border-2 border-secondary-100 bg-surface",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: img.url,
											alt: "",
											className: "w-full h-28 object-cover"
										}),
										idx === 0 && !primaryImageFile && /* @__PURE__ */ jsx("span", {
											className: "absolute top-1.5 start-1.5 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm",
											children: locale === "ar" ? "رئيسية" : "Primary"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1.5",
											children: [idx !== 0 && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setExistingAsPrimary(img.id),
												className: "w-full py-1.5 bg-primary-900 text-white rounded-lg text-xs font-medium hover:bg-primary-800 transition-colors",
												children: locale === "ar" ? "تعيين كصورة رئيسية" : "Set as Primary"
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex gap-1 w-full justify-center",
												children: [
													idx > 0 && /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => handleMoveImage(img.id, "up"),
														className: "px-2 py-1 bg-white/90 text-secondary-950 rounded text-xs font-bold hover:bg-white",
														title: locale === "ar" ? "تقديم" : "Move Up",
														children: "→"
													}),
													idx < existingImages.length - 1 && /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => handleMoveImage(img.id, "down"),
														className: "px-2 py-1 bg-white/90 text-secondary-950 rounded text-xs font-bold hover:bg-white",
														title: locale === "ar" ? "تأخير" : "Move Down",
														children: "←"
													}),
													/* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => handleDeleteImage(img.id),
														className: "px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors",
														title: locale === "ar" ? "حذف" : "Delete",
														children: "×"
													})
												]
											})]
										})
									]
								}, img.id))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-secondary-950 mb-2",
									children: locale === "ar" ? "صور إضافية للمشروع (المعرض)" : "Additional Gallery Images"
								}),
								newImagePreviews.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3",
									children: newImagePreviews.map((preview, index) => /* @__PURE__ */ jsxs("div", {
										className: "relative group rounded-xl overflow-hidden border-2 border-primary-900/20 bg-surface",
										children: [/* @__PURE__ */ jsx("img", {
											src: preview.url,
											alt: preview.file.name,
											className: "w-full h-28 object-cover"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => removeNewImage(index),
												className: "p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none",
												"aria-label": "Remove image",
												children: /* @__PURE__ */ jsx("svg", {
													className: "w-4 h-4",
													fill: "none",
													stroke: "currentColor",
													viewBox: "0 0 24 24",
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														strokeWidth: 2,
														d: "M6 18L18 6M6 6l12 12"
													})
												})
											})
										})]
									}, preview.url))
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => imagesInputRef.current?.click(),
									className: "w-full py-3 border-2 border-dashed border-secondary-200 rounded-xl text-sm text-muted hover:text-primary-900 hover:border-primary-900/40 transition-colors flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("svg", {
										className: "w-5 h-5 text-secondary-400",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 1.5,
											d: "M12 4.5v15m7.5-7.5h-15"
										})
									}), /* @__PURE__ */ jsx("span", { children: locale === "ar" ? "+ إضافة المزيد من الصور للمعرض" : "+ Add More Gallery Images" })]
								}),
								/* @__PURE__ */ jsx("input", {
									ref: imagesInputRef,
									type: "file",
									multiple: true,
									accept: "image/*",
									onChange: handleNewImages,
									className: "hidden"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-secondary-950 mb-1",
									children: trans("video")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: data.video_url,
									onChange: (e) => handleChange("video_url", e.target.value),
									placeholder: "https://youtube.com/...",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted mt-1",
									children: trans("video_url_help")
								})
							] })
						]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-semibold text-secondary-950",
										children: [
											trans("keywords"),
											" (",
											trans("ar"),
											")",
											/* @__PURE__ */ jsxs("span", {
												className: "text-xs text-muted font-normal ms-1",
												children: [
													"(",
													data.keywords_ar.length,
													")"
												]
											})
										]
									}), data.keywords_ar.length > 0 && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: clearKeywordsAr,
										className: "text-xs text-red-600 hover:text-red-700 font-medium transition-colors",
										children: locale === "ar" ? "تفريغ الكل" : "Clear All"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 mb-2",
									children: [/* @__PURE__ */ jsx("textarea", {
										value: keywordInputAr,
										onChange: (e) => setKeywordInputAr(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												addKeywordAr();
											}
										},
										rows: 2,
										dir: "rtl",
										placeholder: locale === "ar" ? "الصق النص أو الكلمات مفصولة بفاصلة (، أو .) أو سطر جديد..." : "Paste text or keywords separated by commas or newlines...",
										className: "flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: addKeywordAr,
										className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0",
										children: trans("add")
									})]
								}),
								data.keywords_ar.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface",
									children: data.keywords_ar.map((kw) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors",
										children: [kw, /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeKeywordAr(kw),
											className: "text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none",
											children: "×"
										})]
									}, kw))
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-semibold text-secondary-950",
										children: [
											trans("keywords"),
											" (",
											trans("en"),
											")",
											/* @__PURE__ */ jsxs("span", {
												className: "text-xs text-muted font-normal ms-1",
												children: [
													"(",
													data.keywords_en.length,
													")"
												]
											})
										]
									}), data.keywords_en.length > 0 && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: clearKeywordsEn,
										className: "text-xs text-red-600 hover:text-red-700 font-medium transition-colors",
										children: locale === "ar" ? "تفريغ الكل" : "Clear All"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 mb-2",
									children: [/* @__PURE__ */ jsx("textarea", {
										value: keywordInputEn,
										onChange: (e) => setKeywordInputEn(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												addKeywordEn();
											}
										},
										rows: 2,
										dir: "ltr",
										placeholder: "Paste English keywords separated by commas or newlines...",
										className: "flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: addKeywordEn,
										className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0",
										children: trans("add")
									})]
								}),
								data.keywords_en.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface",
									children: data.keywords_en.map((kw) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors",
										children: [kw, /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeKeywordEn(kw),
											className: "text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none",
											children: "×"
										})]
									}, kw))
								})
							] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [
									trans("meta_description"),
									" (",
									trans("ar"),
									")"
								]
							}), /* @__PURE__ */ jsx("textarea", {
								value: data.meta_description_ar,
								onChange: (e) => handleChange("meta_description_ar", e.target.value),
								rows: 3,
								maxLength: 500,
								dir: "rtl",
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [
									trans("meta_description"),
									" (",
									trans("en"),
									")"
								]
							}), /* @__PURE__ */ jsx("textarea", {
								value: data.meta_description_en,
								onChange: (e) => handleChange("meta_description_en", e.target.value),
								rows: 3,
								maxLength: 500,
								dir: "ltr",
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
							})] })]
						})]
					}),
					step === 3 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("location_address"),
										" (",
										trans("ar"),
										")"
									]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.location_address_ar,
									onChange: (e) => handleChange("location_address_ar", e.target.value),
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("location_address"),
										" (",
										trans("en"),
										")"
									]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.location_address_en,
									onChange: (e) => handleChange("location_address_en", e.target.value),
									dir: "ltr",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("map_embed_url", {}, "units")
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.map_embed_url,
									onChange: (e) => handleChange("map_embed_url", e.target.value),
									rows: 4,
									dir: "ltr",
									placeholder: "<iframe src=\"...\"></iframe>",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 font-mono text-xs"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted mt-1",
									children: trans("map_embed_url_help", {}, "units")
								})
							] }),
							data.map_embed_url && /* @__PURE__ */ jsx("iframe", {
								src: (() => {
									const m = data.map_embed_url.match(/src\s*=\s*"([^"]+)"/i) || data.map_embed_url.match(/src\s*=\s*'([^']+)'/i);
									return m ? m[1] : data.map_embed_url;
								})(),
								className: "w-full aspect-video rounded-lg",
								allowFullScreen: true,
								loading: "lazy",
								title: "Google Maps"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 pt-6 border-t border-secondary-100 space-y-3",
						children: [
							isSubmitting && /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs text-secondary-600",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium",
										children: uploadStatus
									}), uploadProgress > 0 && /* @__PURE__ */ jsxs("span", {
										className: "font-bold text-primary-900",
										children: [uploadProgress, "%"]
									})]
								}), uploadProgress > 0 ? /* @__PURE__ */ jsx("div", {
									className: "w-full bg-secondary-100 rounded-full h-2 overflow-hidden",
									children: /* @__PURE__ */ jsx("div", {
										className: "bg-primary-900 h-2 rounded-full transition-all duration-300",
										style: { width: `${uploadProgress}%` }
									})
								}) : /* @__PURE__ */ jsx("div", {
									className: "w-full bg-secondary-100 rounded-full h-2 overflow-hidden",
									children: /* @__PURE__ */ jsx("div", { className: "bg-primary-900 h-2 rounded-full animate-pulse w-1/3" })
								})]
							}),
							!isSubmitting && newImagePreviews.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-secondary-500 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-3.5 h-3.5 text-green-500",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									})
								}), /* @__PURE__ */ jsx("span", { children: locale === "ar" ? `${newImagePreviews.length} صورة جديدة جاهزة — ${(data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)} MB` : `${newImagePreviews.length} new image(s) ready — ${(data.images.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1)} MB` })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setStep(Math.max(0, step - 1)),
									disabled: step === 0 || isSubmitting,
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 disabled:opacity-50",
									children: trans("back")
								}), step < STEPS$1.length - 1 ? /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => canNext() && setStep(step + 1),
									disabled: !canNext(),
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
									children: trans("next")
								}) : /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleSubmit,
									disabled: processing || isSubmitting,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
									children: [isSubmitting && /* @__PURE__ */ jsxs("svg", {
										className: "animate-spin h-4 w-4 text-white",
										fill: "none",
										viewBox: "0 0 24 24",
										children: [/* @__PURE__ */ jsx("circle", {
											className: "opacity-25",
											cx: "12",
											cy: "12",
											r: "10",
											stroke: "currentColor",
											strokeWidth: "4"
										}), /* @__PURE__ */ jsx("path", {
											className: "opacity-75",
											fill: "currentColor",
											d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										})]
									}), isSubmitting ? uploadStatus || trans("loading") : isEdit ? trans("update") : trans("save")]
								})]
							})
						]
					})
				]
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Projects/Index.jsx
var Index_exports$8 = /* @__PURE__ */ __exportAll({ default: () => AdminProjectsIndex });
function AdminProjectsIndex({ projects, areas, filters }) {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isAdminOrManager = auth?.user?.role === "admin" || auth?.user?.role === "manager";
	const [search, setSearch] = useState(filters?.search || "");
	const [areaFilter, setAreaFilter] = useState(filters?.area_id || "");
	function applyFilters() {
		const params = {};
		if (search) params.search = search;
		if (areaFilter) params.area_id = areaFilter;
		router.get("/admin/projects", params, { preserveState: true });
	}
	function resetFilters() {
		setSearch("");
		setAreaFilter("");
		router.get("/admin/projects", {}, { preserveState: true });
	}
	function deleteProject(project) {
		if (confirm(trans("confirm_delete"))) router.delete(`/admin/projects/${project.id}`, { preserveScroll: true });
	}
	const loading = !projects;
	const hasProjects = projects?.data?.length > 0;
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_projects") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-secondary-200/70 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-black text-secondary-950",
					children: trans("sidebar_projects")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted mt-0.5",
					children: isRtl ? "إدارة وتحديث الكمبوندات والمشاريع العقارية على الموقع" : "Manage and update real estate compounds and major projects"
				})] }), isAdminOrManager && /* @__PURE__ */ jsxs(Link, {
					href: "/admin/projects/create",
					className: "px-4 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 2.5,
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M12 4.5v15m7.5-7.5h-15"
						})
					}), /* @__PURE__ */ jsx("span", { children: trans("add_project", {}, "projects") })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-2xl border border-secondary-200/70 shadow-sm p-4 sm:p-5",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						applyFilters();
					},
					className: "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "search-input",
								className: "block text-xs font-bold text-secondary-700 mb-1",
								children: trans("search")
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("input", {
									id: "search-input",
									type: "text",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: isRtl ? "اسم المشروع، التفاصيل..." : "Project title, search...",
									className: "w-full ps-9 pe-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
								}), /* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4 text-secondary-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
									})
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "area-filter",
							className: "block text-xs font-bold text-secondary-700 mb-1",
							children: trans("area")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "area-filter",
							value: areaFilter,
							onChange: (e) => setAreaFilter(e.target.value),
							className: "w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: isRtl ? "كل المناطق" : "All Areas"
							}), areas?.map((a) => /* @__PURE__ */ jsx("option", {
								value: a.id,
								children: locale === "ar" ? a.name_ar : a.name_en
							}, a.id))]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "flex-1 py-2 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-3.5 h-3.5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
									})
								}), /* @__PURE__ */ jsx("span", { children: trans("search") })]
							}), (search || areaFilter) && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: resetFilters,
								className: "px-3 py-2 bg-surface hover:bg-secondary-200 text-secondary-700 rounded-xl text-xs font-bold transition-all border border-secondary-200",
								title: isRtl ? "إعادة ضبط" : "Reset",
								children: "✕"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-2xl border border-secondary-200/70 shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-xs text-start rtl:text-right border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-slate-50/80 border-b border-secondary-200/80 text-secondary-600 font-bold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3.5 text-start",
									children: trans("name")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-start",
									children: trans("area")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("units_count")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: isRtl ? "الزيارات" : "Views"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("active")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3.5 text-center",
									children: trans("actions")
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-secondary-100 font-medium",
							children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(SkeletonRow, { cols: 6 }, i)) : hasProjects ? projects.data.map((project) => {
								const thumb = project.images?.[0]?.url || (project.images?.[0]?.path ? `/storage/${project.images[0].path}` : null);
								const projectName = (locale === "ar" ? project.name_ar : project.name_en) || project.name_ar || project.name_en || project.name;
								const projectAreaName = project.area ? (locale === "ar" ? project.area.name_ar : project.area.name_en) || project.area.name_ar || project.area.name_en : "—";
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3 min-w-[200px]",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [thumb ? /* @__PURE__ */ jsx("img", {
													src: thumb,
													alt: "",
													className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-secondary-200 shadow-xs"
												}) : /* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 rounded-xl bg-surface border border-secondary-200 shrink-0 flex items-center justify-center text-secondary-400",
													children: /* @__PURE__ */ jsx("svg", {
														className: "w-5 h-5",
														fill: "none",
														viewBox: "0 0 24 24",
														stroke: "currentColor",
														children: /* @__PURE__ */ jsx("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															strokeWidth: 1.5,
															d: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
														})
													})
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [isAdminOrManager ? /* @__PURE__ */ jsx(Link, {
														href: `/admin/projects/${project.id}/edit`,
														className: "text-secondary-950 hover:text-primary-900 font-bold block truncate max-w-[220px]",
														children: projectName
													}) : /* @__PURE__ */ jsx("span", {
														className: "text-secondary-950 font-bold block truncate max-w-[220px]",
														children: projectName
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-[11px] text-muted block truncate",
														children: ["#", project.id]
													})]
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-secondary-700 whitespace-nowrap",
											children: projectAreaName
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("span", {
												className: "px-2.5 py-1 bg-surface text-secondary-900 rounded-lg border border-secondary-200 text-xs font-bold",
												children: [
													project.units_count ?? 0,
													" ",
													isRtl ? "وحدة" : "units"
												]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-lg text-xs font-bold text-secondary-800 border border-secondary-200",
												children: [/* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5 text-primary-900",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													})
												}), project.views_count || 0]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsx("span", {
												className: `px-2.5 py-1 text-xs rounded-full font-bold ${project.is_active ? "bg-emerald-600 text-white shadow-xs" : "bg-red-50 text-red-600 border border-red-200"}`,
												children: project.is_active ? isRtl ? "مفعل" : "Active" : isRtl ? "معطل" : "Inactive"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3 whitespace-nowrap",
											children: isAdminOrManager ? /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-center gap-1.5",
												children: [/* @__PURE__ */ jsxs(Link, {
													href: `/admin/projects/${project.id}/edit`,
													className: "px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/70 flex items-center gap-1 active:scale-95",
													title: trans("edit"),
													children: [/* @__PURE__ */ jsx("svg", {
														className: "w-3.5 h-3.5",
														fill: "none",
														viewBox: "0 0 24 24",
														stroke: "currentColor",
														strokeWidth: 2,
														children: /* @__PURE__ */ jsx("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
														})
													}), /* @__PURE__ */ jsx("span", { children: trans("edit") })]
												}), /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => deleteProject(project),
													className: "px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/70 flex items-center gap-1 active:scale-95",
													title: trans("delete"),
													children: [/* @__PURE__ */ jsx("svg", {
														className: "w-3.5 h-3.5",
														fill: "none",
														viewBox: "0 0 24 24",
														stroke: "currentColor",
														strokeWidth: 2,
														children: /* @__PURE__ */ jsx("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
														})
													}), /* @__PURE__ */ jsx("span", { children: trans("delete") })]
												})]
											}) : /* @__PURE__ */ jsx("span", {
												className: "text-xs text-muted font-normal",
												children: "—"
											})
										})
									]
								}, project.id);
							}) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 6,
								className: "px-4 py-12 text-center text-muted",
								children: trans("no_data")
							}) })
						})]
					})
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/SeoPages/Index.jsx
var Index_exports$7 = /* @__PURE__ */ __exportAll({ default: () => SeoPagesIndex });
function SeoPagesIndex({ pages }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [activeKey, setActiveKey] = useState(pages?.[0]?.page_key || "home");
	const [keywordInputAr, setKeywordInputAr] = useState("");
	const [keywordInputEn, setKeywordInputEn] = useState("");
	const activePage = pages?.find((p) => p.page_key === activeKey) || pages?.[0];
	const { data, setData, put, processing, errors } = useForm({
		meta_title_ar: activePage?.meta_title_ar || "",
		meta_title_en: activePage?.meta_title_en || "",
		meta_description_ar: activePage?.meta_description_ar || "",
		meta_description_en: activePage?.meta_description_en || "",
		meta_keywords_ar: activePage?.meta_keywords_ar || [],
		meta_keywords_en: activePage?.meta_keywords_en || []
	});
	const handleSelectPage = (key) => {
		setActiveKey(key);
		const target = pages?.find((p) => p.page_key === key);
		if (target) setData({
			meta_title_ar: target.meta_title_ar || "",
			meta_title_en: target.meta_title_en || "",
			meta_description_ar: target.meta_description_ar || "",
			meta_description_en: target.meta_description_en || "",
			meta_keywords_ar: target.meta_keywords_ar || [],
			meta_keywords_en: target.meta_keywords_en || []
		});
	};
	const addKeywordAr = () => {
		const kw = keywordInputAr.trim();
		if (kw && !data.meta_keywords_ar.includes(kw)) setData("meta_keywords_ar", [...data.meta_keywords_ar, kw]);
		setKeywordInputAr("");
	};
	const removeKeywordAr = (kw) => {
		setData("meta_keywords_ar", data.meta_keywords_ar.filter((k) => k !== kw));
	};
	const addKeywordEn = () => {
		const kw = keywordInputEn.trim();
		if (kw && !data.meta_keywords_en.includes(kw)) setData("meta_keywords_en", [...data.meta_keywords_en, kw]);
		setKeywordInputEn("");
	};
	const removeKeywordEn = (kw) => {
		setData("meta_keywords_en", data.meta_keywords_en.filter((k) => k !== kw));
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!activePage) return;
		put(route("admin.seo-pages.update", activePage.id));
	};
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("seo_pages_title") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "space-y-6 p-6 max-w-5xl mx-auto",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold text-secondary-950",
			children: trans("seo_pages_title")
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted",
			children: trans("seo_pages_desc")
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 md:grid-cols-4 gap-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: pages?.map((p) => {
					const label = trans(`seo_page_${p.page_key}`) || p.page_key;
					return /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleSelectPage(p.page_key),
						className: `w-full text-start px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeKey === p.page_key ? "bg-primary-900 text-white shadow-md" : "bg-white text-secondary-800 hover:bg-surface border border-secondary-100"}`,
						children: label
					}, p.page_key);
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "md:col-span-3 bg-white p-6 rounded-2xl shadow-card border border-secondary-100/50",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("h2", {
							className: "text-lg font-bold text-secondary-950 border-b pb-3",
							children: [
								trans("seo_page_settings"),
								": ",
								/* @__PURE__ */ jsx("span", {
									className: "text-primary-900",
									children: trans(`seo_page_${activeKey}`) || activeKey
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("meta_title_ar")
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.meta_title_ar,
								onChange: (e) => setData("meta_title_ar", e.target.value),
								className: "w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("meta_title_en")
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.meta_title_en,
								onChange: (e) => setData("meta_title_en", e.target.value),
								className: "w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("meta_description_ar")
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 3,
								value: data.meta_description_ar,
								onChange: (e) => setData("meta_description_ar", e.target.value),
								className: "w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("meta_description_en")
							}), /* @__PURE__ */ jsx("textarea", {
								rows: 3,
								value: data.meta_description_en,
								onChange: (e) => setData("meta_description_en", e.target.value),
								className: "w-full text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("keywords_ar")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									value: keywordInputAr,
									onChange: (e) => setKeywordInputAr(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addKeywordAr();
										}
									},
									placeholder: "مثال: عقارات، القاهرة",
									className: "flex-1 text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: addKeywordAr,
									className: "px-4 py-2.5 bg-secondary-900 text-white text-xs font-semibold rounded-xl hover:bg-secondary-950 transition-colors",
									children: trans("add_keyword")
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-2",
								children: data.meta_keywords_ar?.map((kw, i) => /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-secondary-200 rounded-full text-xs font-medium text-secondary-800",
									children: [kw, /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => removeKeywordAr(kw),
										className: "text-secondary-400 hover:text-danger-600 font-bold",
										children: "×"
									})]
								}, i))
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-semibold text-secondary-800 mb-1",
								children: trans("keywords_en")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									value: keywordInputEn,
									onChange: (e) => setKeywordInputEn(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addKeywordEn();
										}
									},
									placeholder: "Example: real estate, cairo",
									className: "flex-1 text-sm rounded-xl border border-secondary-200 p-2.5 focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: addKeywordEn,
									className: "px-4 py-2.5 bg-secondary-900 text-white text-xs font-semibold rounded-xl hover:bg-secondary-950 transition-colors",
									children: trans("add_keyword")
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-2",
								children: data.meta_keywords_en?.map((kw, i) => /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 bg-surface border border-secondary-200 rounded-full text-xs font-medium text-secondary-800",
									children: [kw, /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => removeKeywordEn(kw),
										className: "text-secondary-400 hover:text-danger-600 font-bold",
										children: "×"
									})]
								}, i))
							})
						] }),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-6 py-2.5 bg-primary-900 text-white rounded-xl font-medium text-sm hover:bg-primary-950 transition-colors shadow-md disabled:opacity-50",
							children: trans("save_changes")
						})
					]
				})
			})]
		})]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Settings/Index.jsx
var Index_exports$6 = /* @__PURE__ */ __exportAll({ default: () => AdminSettingsIndex });
function AdminSettingsIndex({ settings }) {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [logoPreview, setLogoPreview] = useState(null);
	const [logoFile, setLogoFile] = useState(null);
	const [heroImagePreview, setHeroImagePreview] = useState(null);
	const [heroImageFile, setHeroImageFile] = useState(null);
	const [toast, setToast] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	useEffect(() => {
		if (flash?.success) {
			setToast({
				type: "success",
				message: flash.success
			});
			const t = setTimeout(() => setToast(null), 4e3);
			return () => clearTimeout(t);
		}
		if (flash?.error) {
			setToast({
				type: "error",
				message: flash.error
			});
			const t = setTimeout(() => setToast(null), 5e3);
			return () => clearTimeout(t);
		}
	}, [flash?.success, flash?.error]);
	const { data, setData, processing, errors } = useForm({
		daily_deduction_enabled: settings?.daily_deduction_enabled === "true" || settings?.daily_deduction_enabled === true,
		daily_deduction_value: settings?.daily_deduction_value || "10",
		monthly_reset_day: settings?.monthly_reset_day || "1",
		monthly_reset_auto: settings?.monthly_reset_auto === "true" || settings?.monthly_reset_auto === true,
		auto_delete_days: settings?.auto_delete_days || "30",
		site_logo: null,
		hero_title_ar: settings?.hero_title_ar || "ابحث عن منزل أحلامك",
		hero_title_en: settings?.hero_title_en || "Search for your dream home",
		hero_subtitle_ar: settings?.hero_subtitle_ar || "آلاف العقارات في جميع أنحاء المملكة",
		hero_subtitle_en: settings?.hero_subtitle_en || "Thousands of properties across the kingdom",
		hero_image: null,
		company_phone: settings?.company_phone || "",
		company_whatsapp: settings?.company_whatsapp || "",
		company_email: settings?.company_email || "",
		company_address: settings?.company_address || "",
		social_facebook: settings?.social_facebook || "",
		social_instagram: settings?.social_instagram || "",
		social_twitter: settings?.social_twitter || "",
		social_linkedin: settings?.social_linkedin || ""
	});
	function handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append("daily_deduction_enabled", data.daily_deduction_enabled ? "1" : "0");
		formData.append("daily_deduction_value", data.daily_deduction_value || "10");
		formData.append("monthly_reset_day", data.monthly_reset_day || "1");
		formData.append("monthly_reset_auto", data.monthly_reset_auto ? "1" : "0");
		formData.append("auto_delete_days", data.auto_delete_days || "30");
		formData.append("hero_title_ar", data.hero_title_ar || "");
		formData.append("hero_title_en", data.hero_title_en || "");
		formData.append("hero_subtitle_ar", data.hero_subtitle_ar || "");
		formData.append("hero_subtitle_en", data.hero_subtitle_en || "");
		formData.append("company_phone", data.company_phone || "");
		formData.append("company_whatsapp", data.company_whatsapp || "");
		formData.append("company_email", data.company_email || "");
		formData.append("company_address", data.company_address || "");
		formData.append("social_facebook", data.social_facebook || "");
		formData.append("social_instagram", data.social_instagram || "");
		formData.append("social_twitter", data.social_twitter || "");
		formData.append("social_linkedin", data.social_linkedin || "");
		if (data.site_logo instanceof File) formData.append("site_logo", data.site_logo);
		if (data.hero_image instanceof File) formData.append("hero_image", data.hero_image);
		router.post("/admin/settings", formData, {
			preserveScroll: true,
			onStart: () => setIsSubmitting(true),
			onFinish: () => setIsSubmitting(false),
			onError: (errs) => {
				const firstErr = Object.values(errs)[0];
				if (firstErr) setToast({
					type: "error",
					message: firstErr
				});
			}
		});
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [
		/* @__PURE__ */ jsx(Head, { title: trans("settings") + " — " + trans("app_name") }),
		toast && /* @__PURE__ */ jsxs("div", {
			className: `fixed top-6 ${isRtl ? "left-6" : "right-6"} z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 animate-fade-in ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`,
			children: [
				toast.type === "success" ? /* @__PURE__ */ jsx("svg", {
					className: "w-5 h-5 shrink-0",
					fill: "none",
					stroke: "currentColor",
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
						d: "M5 13l4 4L19 7"
					})
				}) : /* @__PURE__ */ jsx("svg", {
					className: "w-5 h-5 shrink-0",
					fill: "none",
					stroke: "currentColor",
					viewBox: "0 0 24 24",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						strokeWidth: 2,
						d: "M6 18L18 6M6 6l12 12"
					})
				}),
				/* @__PURE__ */ jsx("span", { children: toast.message }),
				/* @__PURE__ */ jsx("button", {
					onClick: () => setToast(null),
					className: "ms-2 opacity-70 hover:opacity-100 transition-opacity",
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M6 18L18 6M6 6l12 12"
						})
					})
				})
			]
		}),
		/* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			dir: isRtl ? "rtl" : "ltr",
			className: "flex flex-col min-h-[calc(100vh-65px)] bg-surface pb-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_settings")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-secondary-500 mt-1",
					children: locale === "ar" ? "إدارة إعدادات النظام والهوية البصرية" : "Manage system settings and brand identity"
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "submit",
					disabled: isSubmitting || processing,
					className: "px-6 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2",
					children: [isSubmitting || processing ? /* @__PURE__ */ jsxs("svg", {
						className: "animate-spin h-4 w-4 text-white",
						xmlns: "http://www.w3.org/2000/svg",
						fill: "none",
						viewBox: "0 0 24 24",
						children: [/* @__PURE__ */ jsx("circle", {
							className: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							strokeWidth: "4"
						}), /* @__PURE__ */ jsx("path", {
							className: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						})]
					}) : /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M5 13l4 4L19 7"
						})
					}), trans("save")]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-7xl mx-auto w-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "xl:col-span-7 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-8 hover:shadow-md transition-shadow",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-semibold text-secondary-950 mb-1",
								children: trans("settings_logo")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-secondary-500 mb-6",
								children: locale === "ar" ? "سيتم تغيير اللوجو في جميع أنحاء الموقع" : "The logo will be updated across the entire site"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row items-start sm:items-center gap-6",
								children: [/* @__PURE__ */ jsx("div", {
									className: "shrink-0 relative group",
									children: /* @__PURE__ */ jsxs("div", {
										className: "w-32 h-32 rounded-xl bg-secondary-50 border-2 border-dashed border-secondary-200 flex items-center justify-center p-4 overflow-hidden relative transition-colors group-hover:border-primary-900/30",
										children: [logoPreview || settings?.site_logo ? /* @__PURE__ */ jsx("img", {
											src: logoPreview || (settings?.site_logo?.startsWith("http") || settings?.site_logo?.startsWith("/storage") ? settings.site_logo : `/storage/${settings.site_logo}`),
											alt: "Logo",
											className: "w-full h-full object-contain",
											onError: (e) => {
												e.currentTarget.src = "/icon.png";
											}
										}) : /* @__PURE__ */ jsx("svg", {
											className: "w-8 h-8 text-secondary-300",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 1.5,
												d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											})
										}), /* @__PURE__ */ jsxs("label", {
											className: "absolute inset-0 bg-secondary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-white text-xs font-medium bg-secondary-800/80 px-3 py-1.5 rounded-full shadow-lg",
												children: locale === "ar" ? "تغيير الصورة" : "Change Image"
											}), /* @__PURE__ */ jsx("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => {
													const file = e.target.files[0] || null;
													setData("site_logo", file);
													setLogoPreview(file ? URL.createObjectURL(file) : null);
												}
											})]
										})]
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("h3", {
											className: "text-sm font-medium text-secondary-950",
											children: locale === "ar" ? "رفع اللوجو الجديد" : "Upload new logo"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-secondary-500 mt-1 mb-4 leading-relaxed",
											children: locale === "ar" ? "الحد الأقصى للملف هو 2 ميجابايت. يُفضل استخدام صيغة PNG بخلفية شفافة أو SVG للحصول على أفضل جودة." : "Maximum file size is 2MB. PNG with transparent background or SVG is recommended for best quality."
										}),
										errors.site_logo && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-error mt-1 p-2 bg-error/10 rounded border border-error/20",
											children: errors.site_logo
										}),
										logoPreview && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-3.5 h-3.5",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													strokeWidth: 2,
													d: "M5 13l4 4L19 7"
												})
											}), locale === "ar" ? "تم اختيار صورة جديدة (لم تُحفظ)" : "New image selected (unsaved)"]
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-6 border-b border-secondary-100 bg-secondary-50/50",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-lg font-semibold text-secondary-950",
								children: locale === "ar" ? "غلاف الصفحة الرئيسية" : "Homepage Hero Section"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-secondary-500 mt-1",
								children: locale === "ar" ? "يظهر للزوار في أول الصفحة" : "Visible to visitors at the top of the page"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 space-y-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-3",
									children: locale === "ar" ? "صورة الغلاف (الخلفية)" : "Hero Background Image"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-xl overflow-hidden border border-secondary-200 bg-secondary-50 aspect-[21/9] flex items-center justify-center",
									children: [heroImagePreview || settings?.hero_image ? /* @__PURE__ */ jsx("img", {
										src: heroImagePreview || `/storage/${settings.hero_image}`,
										alt: "Hero",
										className: "w-full h-full object-cover"
									}) : /* @__PURE__ */ jsxs("div", {
										className: "text-center p-6",
										children: [/* @__PURE__ */ jsx("svg", {
											className: "w-10 h-10 text-secondary-300 mx-auto mb-2",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 1.5,
												d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											})
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-secondary-500",
											children: locale === "ar" ? "لا توجد صورة" : "No image"
										})]
									}), /* @__PURE__ */ jsxs("label", {
										className: "absolute inset-0 bg-secondary-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-white text-sm font-medium bg-secondary-800/80 px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "none",
												stroke: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													strokeWidth: 2,
													d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
												})
											}), locale === "ar" ? "رفع صورة جديدة" : "Upload new image"]
										}), /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											onChange: (e) => {
												const file = e.target.files[0] || null;
												setData("hero_image", file);
												setHeroImagePreview(file ? URL.createObjectURL(file) : null);
											}
										})]
									})]
								}),
								errors.hero_image && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-2",
									children: errors.hero_image
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ jsx("h3", {
											className: "text-sm font-bold text-secondary-950 uppercase tracking-wide border-b border-secondary-100 pb-2",
											children: locale === "ar" ? "النصوص العربية" : "Arabic Texts"
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-medium text-secondary-600 mb-1",
											children: locale === "ar" ? "العنوان الرئيسي" : "Main Title"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.hero_title_ar,
											onChange: (e) => setData("hero_title_ar", e.target.value),
											dir: "rtl",
											className: "w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-medium text-secondary-600 mb-1",
											children: locale === "ar" ? "الوصف الفرعي" : "Subtitle"
										}), /* @__PURE__ */ jsx("textarea", {
											value: data.hero_subtitle_ar,
											onChange: (e) => setData("hero_subtitle_ar", e.target.value),
											dir: "rtl",
											rows: 2,
											className: "w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
										})] })
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-4",
									children: [
										/* @__PURE__ */ jsx("h3", {
											className: "text-sm font-bold text-secondary-950 uppercase tracking-wide border-b border-secondary-100 pb-2",
											children: locale === "ar" ? "النصوص الإنجليزية" : "English Texts"
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-medium text-secondary-600 mb-1",
											children: locale === "ar" ? "العنوان الرئيسي" : "Main Title"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.hero_title_en,
											onChange: (e) => setData("hero_title_en", e.target.value),
											dir: "ltr",
											className: "w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-medium text-secondary-600 mb-1",
											children: locale === "ar" ? "الوصف الفرعي" : "Subtitle"
										}), /* @__PURE__ */ jsx("textarea", {
											value: data.hero_subtitle_en,
											onChange: (e) => setData("hero_subtitle_en", e.target.value),
											dir: "ltr",
											rows: 2,
											className: "w-full px-4 py-2.5 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-secondary-950 focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
										})] })
									]
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "xl:col-span-5 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-5 border-b border-secondary-100 bg-secondary-50/50 flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "p-2 bg-white rounded-lg shadow-sm border border-secondary-100 text-primary-900",
									children: /* @__PURE__ */ jsx("svg", {
										className: "w-5 h-5",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 1.5,
											d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										})
									})
								}), /* @__PURE__ */ jsxs("h2", {
									className: "text-lg font-semibold text-secondary-950",
									children: [
										trans("settings_points"),
										" & ",
										trans("settings_auto_delete")
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-6 space-y-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-xl border border-secondary-200 bg-secondary-50/50",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-3 cursor-pointer",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "relative flex items-center justify-center",
												children: [/* @__PURE__ */ jsx("input", {
													type: "checkbox",
													checked: data.daily_deduction_enabled,
													onChange: (e) => setData("daily_deduction_enabled", e.target.checked),
													className: "peer sr-only"
												}), /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-secondary-300 rounded-full peer-checked:bg-primary-900 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:rtl:-left-1 after:rtl:right-1 after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" })]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-medium text-secondary-950",
												children: trans("daily_deduction")
											})]
										}), data.daily_deduction_enabled && /* @__PURE__ */ jsxs("div", {
											className: "mt-4 pt-4 border-t border-secondary-200",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-medium text-secondary-600 mb-1",
												children: trans("daily_deduction_value")
											}), /* @__PURE__ */ jsxs("div", {
												className: "relative",
												children: [/* @__PURE__ */ jsx("input", {
													type: "number",
													value: data.daily_deduction_value,
													onChange: (e) => setData("daily_deduction_value", e.target.value),
													className: "w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
												}), /* @__PURE__ */ jsx("span", {
													className: "absolute inset-y-0 end-0 flex items-center pe-4 text-xs font-medium text-secondary-400 pointer-events-none",
													children: "Points"
												})]
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-xl border border-secondary-200 bg-secondary-50/50",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-3 cursor-pointer mb-4",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "relative flex items-center justify-center",
												children: [/* @__PURE__ */ jsx("input", {
													type: "checkbox",
													checked: data.monthly_reset_auto,
													onChange: (e) => setData("monthly_reset_auto", e.target.checked),
													className: "peer sr-only"
												}), /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-secondary-300 rounded-full peer-checked:bg-primary-900 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:rtl:-left-1 after:rtl:right-1 after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" })]
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-sm font-medium text-secondary-950",
												children: [
													trans("automatic"),
													" ",
													trans("monthly_reset")
												]
											})]
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-medium text-secondary-600 mb-1",
											children: trans("monthly_reset_day")
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											min: "1",
											max: "28",
											value: data.monthly_reset_day,
											onChange: (e) => setData("monthly_reset_day", e.target.value),
											className: "w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-secondary-600 mb-1",
										children: trans("auto_delete_days")
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "1",
										value: data.auto_delete_days,
										onChange: (e) => setData("auto_delete_days", e.target.value),
										className: "w-full px-4 py-2 bg-white border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-lg font-semibold text-secondary-950 mb-5 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5 text-primary-900",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									})
								}), trans("settings_contact")]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-secondary-600 mb-1",
										children: trans("phone")
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										dir: "ltr",
										value: data.company_phone,
										onChange: (e) => setData("company_phone", e.target.value),
										className: "w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-secondary-600 mb-1",
										children: trans("whatsapp")
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										dir: "ltr",
										placeholder: "+2010...",
										value: data.company_whatsapp,
										onChange: (e) => setData("company_whatsapp", e.target.value),
										className: "w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-secondary-600 mb-1",
										children: trans("email")
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										dir: "ltr",
										value: data.company_email,
										onChange: (e) => setData("company_email", e.target.value),
										className: "w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-medium text-secondary-600 mb-1",
										children: trans("address")
									}), /* @__PURE__ */ jsx("textarea", {
										value: data.company_address,
										onChange: (e) => setData("company_address", e.target.value),
										rows: 2,
										className: "w-full px-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 transition-colors"
									})] })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow",
							children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-lg font-semibold text-secondary-950 mb-5 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5 text-primary-900",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
									})
								}), trans("settings_social")]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900",
										children: [/* @__PURE__ */ jsx("span", {
											className: "bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0",
											children: /* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
											})
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											dir: "ltr",
											placeholder: "https://facebook.com/...",
											value: data.social_facebook,
											onChange: (e) => setData("social_facebook", e.target.value),
											className: "w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900",
										children: [/* @__PURE__ */ jsx("span", {
											className: "bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0",
											children: /* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" })
											})
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											dir: "ltr",
											placeholder: "https://instagram.com/...",
											value: data.social_instagram,
											onChange: (e) => setData("social_instagram", e.target.value),
											className: "w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900",
										children: [/* @__PURE__ */ jsx("span", {
											className: "bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0",
											children: /* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
											})
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											dir: "ltr",
											placeholder: "https://x.com/...",
											value: data.social_twitter,
											onChange: (e) => setData("social_twitter", e.target.value),
											className: "w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex rounded-lg overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-900/20 focus-within:border-primary-900",
										children: [/* @__PURE__ */ jsx("span", {
											className: "bg-secondary-100 px-3 py-2 text-sm text-secondary-600 flex items-center justify-center border-e border-secondary-200 w-12 shrink-0",
											children: /* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "currentColor",
												viewBox: "0 0 24 24",
												children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" })
											})
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											dir: "ltr",
											placeholder: "https://linkedin.com/in/...",
											value: data.social_linkedin,
											onChange: (e) => setData("social_linkedin", e.target.value),
											className: "w-full px-3 py-2 border-0 text-sm focus:ring-0 bg-secondary-50 focus:bg-white"
										})]
									})
								]
							})]
						})
					]
				})]
			})]
		})
	] });
}
//#endregion
//#region resources/js/Pages/Admin/UnitTypes/Index.jsx
var Index_exports$5 = /* @__PURE__ */ __exportAll({ default: () => AdminUnitTypesIndex });
function AdminUnitTypesIndex({ unitTypes }) {
	const { locale, flash, errors } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [editing, setEditing] = useState(null);
	const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
		name_ar: "",
		name_en: "",
		is_active: true,
		sort_order: 0
	});
	function startCreate() {
		setEditing("new");
		reset();
	}
	function startEdit(type) {
		setEditing(type.id);
		setData({
			name_ar: type.name_ar,
			name_en: type.name_en,
			is_active: type.is_active,
			sort_order: type.sort_order
		});
	}
	function cancelEdit() {
		setEditing(null);
		reset();
	}
	function handleSubmit(e) {
		e.preventDefault();
		if (editing === "new") post("/admin/unit-types", {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
		else put(`/admin/unit-types/${editing}`, {
			preserveScroll: true,
			onSuccess: () => {
				setEditing(null);
				reset();
			}
		});
	}
	function handleDelete(type) {
		if (confirm(trans("confirm_delete"))) destroy(`/admin/unit-types/${type.id}`, { preserveScroll: true });
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_unit_types") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_unit_types")
				}), editing !== "new" && /* @__PURE__ */ jsx("button", {
					onClick: startCreate,
					className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950",
					children: trans("add")
				})]
			}),
			flash?.success && /* @__PURE__ */ jsx("div", {
				className: "mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm",
				children: flash.success
			}),
			(editing === "new" || typeof editing === "number") && /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-white rounded-xl shadow-card p-6 mb-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 mb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("name_ar")
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name_ar,
							onChange: (e) => setData("name_ar", e.target.value),
							required: true,
							dir: "rtl",
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("name_en")
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name_en,
							onChange: (e) => setData("name_en", e.target.value),
							required: true,
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 mb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: trans("sort_order")
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: "0",
							value: data.sort_order,
							onChange: (e) => setData("sort_order", parseInt(e.target.value) || 0),
							className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-end pb-2",
							children: /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: data.is_active,
									onChange: (e) => setData("is_active", e.target.checked),
									className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-sm font-medium text-secondary-950",
									children: data.is_active ? trans("active") : trans("inactive")
								})]
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
							children: processing ? trans("loading") : trans("save")
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: cancelEdit,
							className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200",
							children: trans("cancel")
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-card overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						className: "bg-surface text-secondary-700 text-left",
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_ar")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("name_en")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("status")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("sort_order")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 font-medium",
								children: trans("actions")
							})
						]
					}) }), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-secondary-100",
						children: [unitTypes?.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 5,
							className: "px-4 py-8 text-center text-muted",
							children: trans("no_data")
						}) }), unitTypes?.map((type) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-surface/50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: type.name_ar
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-950",
									children: type.name_en
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsx("span", {
										className: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${type.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`,
										children: type.is_active ? trans("active") : trans("inactive")
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-secondary-700",
									children: type.sort_order
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											onClick: () => startEdit(type),
											className: "text-xs text-primary-900 hover:text-primary-950 font-medium",
											children: trans("edit")
										}), /* @__PURE__ */ jsx("button", {
											onClick: () => handleDelete(type),
											className: "text-xs text-red-600 hover:text-red-700 font-medium",
											children: trans("delete")
										})]
									})
								})
							]
						}, type.id))]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Units/Form.jsx
var Form_exports = /* @__PURE__ */ __exportAll({ default: () => AdminUnitForm });
var STEPS = [
	{
		key: "basic",
		title_key: "basic_info"
	},
	{
		key: "media",
		title_key: "media"
	},
	{
		key: "seo",
		title_key: "seo"
	},
	{
		key: "location",
		title_key: "location"
	}
];
function AdminUnitForm({ unit, areas, unitTypes, projects, features, finishingTypes, managers = [] }) {
	const { locale, errors, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isEdit = !!unit;
	const isAdmin = auth?.user?.role === "admin";
	const [step, setStep] = useState(0);
	const [dirty, setDirty] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState("");
	const [primaryFile, setPrimaryFile] = useState(null);
	const [primaryPreview, setPrimaryPreview] = useState(null);
	const [newFiles, setNewFiles] = useState([]);
	const [newPreviews, setNewPreviews] = useState([]);
	const primaryRef = useRef();
	const moreRef = useRef();
	const MAX_SIZE = 10 * 1024 * 1024;
	const MAX_TOTAL = 40 * 1024 * 1024;
	const existingImages = unit?.images ?? [];
	const { data, setData, post, processing } = useForm({
		user_id: unit?.user_id || "",
		name_ar: unit?.name_ar || "",
		name_en: unit?.name_en || unit?.name || "",
		description_ar: unit?.description_ar || "",
		description_en: unit?.description_en || "",
		type_id: unit?.type_id || "",
		area_id: unit?.area_id || "",
		project_id: unit?.project_id || "",
		transaction: unit?.transaction || "sale",
		price: unit?.price || "",
		area_sqm: unit?.area_sqm || "",
		rooms: unit?.rooms || "",
		bathrooms: unit?.bathrooms || "",
		floor: unit?.floor ?? "",
		video_url: unit?.video_url || "",
		keywords_ar: unit?.keywords_ar || [],
		keywords_en: unit?.keywords_en || [],
		meta_description_ar: unit?.meta_description_ar || "",
		meta_description_en: unit?.meta_description_en || "",
		map_embed_url: unit?.map_embed_url || "",
		location_address_ar: unit?.location_address_ar || "",
		location_address_en: unit?.location_address_en || "",
		images: [],
		primary_image_index: 0,
		payment_method: unit?.payment_method || "",
		down_payment: unit?.down_payment || "",
		installment_years: unit?.installment_years || "",
		finishing_type_id: unit?.finishing_type_id || "",
		features: unit?.features?.map((f) => f.id) || []
	});
	const [keywordInputAr, setKeywordInputAr] = useState("");
	const [keywordInputEn, setKeywordInputEn] = useState("");
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (dirty) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [dirty]);
	function handleChange(key, value) {
		setData(key, value);
		setDirty(true);
		if (key === "project_id" && value) fetchProjectAutofill(value);
	}
	async function fetchProjectAutofill(projectId) {
		try {
			const response = await fetch(`/admin/projects/${projectId}/autofill`);
			if (response.ok) {
				const projectData = await response.json();
				setData((prev) => ({
					...prev,
					project_id: projectId,
					features: projectData.features || prev.features,
					finishing_type_id: projectData.finishing_type_id || prev.finishing_type_id,
					payment_method: projectData.payment_method || prev.payment_method,
					down_payment: projectData.down_payment || prev.down_payment,
					installment_years: projectData.installment_years || prev.installment_years
				}));
				setDirty(true);
			}
		} catch (error) {
			console.error("Failed to fetch project auto-fill data", error);
		}
	}
	function toggleFeature(id) {
		if (data.features.includes(id)) setData("features", data.features.filter((f) => f !== id));
		else setData("features", [...data.features, id]);
		setDirty(true);
	}
	function parseKeywords(text) {
		if (!text) return [];
		return text.split(/[,،;.\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
	}
	function addKeywordAr() {
		if (!keywordInputAr) return;
		const parsed = parseKeywords(keywordInputAr);
		if (parsed.length > 0) {
			const existing = new Set(data.keywords_ar);
			const toAdd = parsed.filter((k) => !existing.has(k));
			if (toAdd.length > 0) {
				setData("keywords_ar", [...data.keywords_ar, ...toAdd]);
				setDirty(true);
			}
		}
		setKeywordInputAr("");
	}
	function removeKeywordAr(kw) {
		setData("keywords_ar", data.keywords_ar.filter((k) => k !== kw));
		setDirty(true);
	}
	function clearKeywordsAr() {
		setData("keywords_ar", []);
		setDirty(true);
	}
	function addKeywordEn() {
		if (!keywordInputEn) return;
		const parsed = parseKeywords(keywordInputEn);
		if (parsed.length > 0) {
			const existing = new Set(data.keywords_en);
			const toAdd = parsed.filter((k) => !existing.has(k));
			if (toAdd.length > 0) {
				setData("keywords_en", [...data.keywords_en, ...toAdd]);
				setDirty(true);
			}
		}
		setKeywordInputEn("");
	}
	function removeKeywordEn(kw) {
		setData("keywords_en", data.keywords_en.filter((k) => k !== kw));
		setDirty(true);
	}
	function clearKeywordsEn() {
		setData("keywords_en", []);
		setDirty(true);
	}
	function compressImage(file, maxWidth = 1920, quality = .82) {
		return new Promise((resolve) => {
			if (!file || !file.type.startsWith("image/") || file.type.includes("svg")) {
				resolve(file);
				return;
			}
			const img = new Image();
			const url = URL.createObjectURL(file);
			img.onload = () => {
				URL.revokeObjectURL(url);
				let width = img.width;
				let height = img.height;
				if (width <= maxWidth && file.size < 800 * 1024) {
					resolve(file);
					return;
				}
				if (width > maxWidth) {
					height = Math.round(height * maxWidth / width);
					width = maxWidth;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				canvas.getContext("2d").drawImage(img, 0, 0, width, height);
				canvas.toBlob((blob) => {
					if (!blob || blob.size >= file.size) resolve(file);
					else resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
						type: "image/jpeg",
						lastModified: Date.now()
					}));
				}, "image/jpeg", quality);
			};
			img.onerror = () => resolve(file);
			img.src = url;
		});
	}
	async function handlePrimaryChange(e) {
		const rawFile = e.target.files[0];
		if (!rawFile) return;
		if (rawFile.size > MAX_SIZE) {
			alert(locale === "ar" ? "حجم الصورة كبير جداً. الحد 10 ميجابايت." : "Image too large. Max 10MB.");
			return;
		}
		setUploadStatus(locale === "ar" ? "جاري ضغط الصورة..." : "Compressing...");
		const file = await compressImage(rawFile);
		setPrimaryFile(file);
		setPrimaryPreview(URL.createObjectURL(file));
		setUploadStatus("");
		setDirty(true);
	}
	async function handleMoreImages(e) {
		const filtered = Array.from(e.target.files || []).filter((f) => {
			if (f.size > MAX_SIZE) {
				alert(locale === "ar" ? `${f.name}: حجم كبير جداً.` : `${f.name}: Too large.`);
				return false;
			}
			return true;
		});
		if (filtered.length === 0) return;
		setUploadStatus(locale === "ar" ? `جاري ضغط ${filtered.length} صورة بالتوازي...` : `Compressing ${filtered.length} image(s) in parallel...`);
		const compressed = await Promise.all(filtered.map((f) => compressImage(f)));
		let total = newFiles.reduce((s, f) => s + f.size, 0);
		const valid = [];
		for (const f of compressed) {
			total += f.size;
			if (total > MAX_TOTAL) {
				alert(locale === "ar" ? "تجاوز الحد الإجمالي 40 ميجابايت." : "Total exceeds 40MB limit.");
				break;
			}
			valid.push(f);
		}
		setUploadStatus("");
		setNewFiles((prev) => [...prev, ...valid]);
		setNewPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
		setDirty(true);
	}
	function removeNewImage(idx) {
		setNewFiles((prev) => prev.filter((_, i) => i !== idx));
		setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
	}
	function deleteExistingImage(img) {
		if (!unit?.id) return;
		if (!confirm(locale === "ar" ? "هل تريد حذف هذه الصورة؟" : "Delete this image?")) return;
		router.delete(`/admin/units/${unit.id}/images/${img.id}`, { preserveScroll: true });
	}
	function setExistingAsPrimary(img) {
		if (!unit?.id) return;
		router.post(`/admin/units/${unit.id}/images/${img.id}/primary`, {}, { preserveScroll: true });
	}
	const [isSubmitting, setIsSubmitting] = useState(false);
	function handleSubmit() {
		if (processing || isSubmitting) return;
		setIsSubmitting(true);
		setDirty(false);
		setUploadProgress(0);
		const allImages = primaryFile ? [primaryFile, ...newFiles] : newFiles;
		const hasImages = allImages.length > 0;
		const payload = {
			name_ar: data.name_ar ?? "",
			name_en: data.name_en ?? "",
			description_ar: data.description_ar ?? "",
			description_en: data.description_en ?? "",
			type_id: data.type_id ?? "",
			area_id: data.area_id ?? "",
			project_id: data.project_id ?? "",
			transaction: data.transaction ?? "sale",
			price: data.price ?? "",
			area_sqm: data.area_sqm ?? "",
			rooms: data.rooms ?? "",
			bathrooms: data.bathrooms ?? "",
			floor: data.floor ?? "",
			video_url: data.video_url ?? "",
			meta_description: data.meta_description ?? "",
			map_embed_url: data.map_embed_url ?? "",
			location_address_ar: data.location_address_ar ?? "",
			location_address_en: data.location_address_en ?? "",
			primary_image_index: "0",
			keywords_ar: data.keywords_ar,
			keywords_en: data.keywords_en,
			payment_method: data.payment_method,
			down_payment: data.down_payment,
			installment_years: data.installment_years,
			finishing_type_id: data.finishing_type_id,
			features: data.features,
			images: allImages
		};
		if (isEdit) payload._method = "PUT";
		if (hasImages) {
			const totalMB = (allImages.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(1);
			setUploadStatus(locale === "ar" ? `جاري رفع ${allImages.length} صورة (${totalMB} MB)...` : `Uploading ${allImages.length} image(s) (${totalMB} MB)...`);
		} else setUploadStatus(locale === "ar" ? "جاري حفظ البيانات..." : "Saving...");
		const url = isEdit ? `/admin/units/${unit.id}` : "/admin/units";
		router.post(url, payload, {
			forceFormData: true,
			preserveScroll: true,
			onProgress: (progress) => {
				if (progress?.percentage !== void 0) {
					const pct = Math.round(progress.percentage);
					setUploadProgress(pct);
					if (pct >= 100) setUploadStatus(locale === "ar" ? "تم الرفع، جاري المعالجة..." : "Uploaded, processing...");
				}
			},
			onFinish: () => {
				setIsSubmitting(false);
				setUploadProgress(0);
			},
			onError: (errs) => {
				setIsSubmitting(false);
				setUploadProgress(0);
				setUploadStatus(locale === "ar" ? "عفواً، تعذر الحفظ. يرجى مراجعة الأخطاء في أعلى الصفحة." : "Error saving data. Please check errors above.");
				if (errs && (errs.name_ar || errs.name_en || errs.type_id || errs.area_id || errs.price)) setStep(0);
			}
		});
	}
	function canNext() {
		if (step === 0) return (data.name_ar || data.name_en) && data.type_id && data.area_id && data.price;
		return true;
	}
	const primaryImage = existingImages.find((img) => img.is_primary) || existingImages[0] || null;
	const hasErrors = errors && Object.keys(errors).length > 0;
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("add_unit") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6 max-w-3xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 mb-6",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/admin/units",
					className: "text-sm text-muted hover:text-primary-900",
					children: ["← ", trans("sidebar_units")]
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: isEdit ? trans("edit_unit", {}, "units") : trans("add_unit", {}, "units")
				})]
			}),
			hasErrors && /* @__PURE__ */ jsxs("div", {
				className: "mb-6 p-4 bg-red-50 border-s-4 border-red-500 text-red-800 rounded-xl text-sm space-y-1.5 shadow-sm",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "font-bold flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-5 h-5 text-red-600 shrink-0",
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						})
					}), locale === "ar" ? "تعذر حفظ البيانات بسبب الأخطاء التالية:" : "Could not save data due to errors:"]
				}), /* @__PURE__ */ jsx("ul", {
					className: "list-disc list-inside text-xs text-red-700 space-y-1 mt-1 font-medium",
					children: Object.entries(errors).map(([key, msg]) => /* @__PURE__ */ jsx("li", { children: msg }, key))
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 mb-8",
				children: STEPS.map((s, i) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-1",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => i <= step ? setStep(i) : null,
							className: `w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${i === step ? "bg-primary-900 text-white" : i < step ? "bg-green-500 text-white" : "bg-surface text-secondary-400"}`,
							children: i + 1
						}),
						/* @__PURE__ */ jsx("span", {
							className: `text-xs hidden sm:inline ${i === step ? "text-secondary-950 font-medium" : "text-muted"}`,
							children: trans(s.title_key) || s.key
						}),
						i < STEPS.length - 1 && /* @__PURE__ */ jsx("div", { className: "flex-1 h-px bg-secondary-200" })
					]
				}, s.key))
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => e.preventDefault(),
				className: "bg-white rounded-xl shadow-card p-6",
				children: [
					step === 0 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: [trans("name_ar"), " *"]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.name_ar,
										onChange: (e) => handleChange("name_ar", e.target.value),
										dir: "rtl",
										required: true,
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									}),
									errors.name_ar && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.name_ar
									})
								] }), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: [trans("name_en"), " *"]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.name_en,
										onChange: (e) => handleChange("name_en", e.target.value),
										dir: "ltr",
										required: true,
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									}),
									errors.name_en && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.name_en
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("description_ar", {}, "units")
								}), /* @__PURE__ */ jsx("textarea", {
									value: data.description_ar,
									onChange: (e) => handleChange("description_ar", e.target.value),
									rows: 4,
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("description_en", {}, "units")
								}), /* @__PURE__ */ jsx("textarea", {
									value: data.description_en,
									onChange: (e) => handleChange("description_en", e.target.value),
									rows: 4,
									dir: "ltr",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: [trans("type", {}, "units"), " *"]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.type_id,
										onChange: (e) => handleChange("type_id", e.target.value),
										required: true,
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "—"
										}), unitTypes?.map((t) => /* @__PURE__ */ jsx("option", {
											value: t.id,
											children: locale === "ar" ? t.name_ar : t.name_en
										}, t.id))]
									}),
									errors.type_id && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.type_id
									})
								] }), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: [trans("area"), " *"]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.area_id,
										onChange: (e) => handleChange("area_id", e.target.value),
										required: true,
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "—"
										}), areas?.map((a) => /* @__PURE__ */ jsx("option", {
											value: a.id,
											children: locale === "ar" ? a.name_ar : a.name_en
										}, a.id))]
									}),
									errors.area_id && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.area_id
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("transaction", {}, "units")
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.transaction,
										onChange: (e) => handleChange("transaction", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "sale",
											children: trans("sale", {}, "units")
										}), /* @__PURE__ */ jsx("option", {
											value: "rent",
											children: trans("rent", {}, "units")
										})]
									}),
									errors.transaction && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.transaction
									})
								] }), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: [trans("price", {}, "units"), " *"]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.price,
										onChange: (e) => handleChange("price", e.target.value),
										required: true,
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									}),
									errors.price && /* @__PURE__ */ jsx("p", {
										className: "text-xs text-red-500 mt-1",
										children: errors.price
									})
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("area_sqm", {}, "units")
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.area_sqm,
										onChange: (e) => handleChange("area_sqm", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("rooms", {}, "units")
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.rooms,
										onChange: (e) => handleChange("rooms", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("bathrooms", {}, "units")
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.bathrooms,
										onChange: (e) => handleChange("bathrooms", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white"
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("project")
								}), /* @__PURE__ */ jsxs(Select, {
									value: data.project_id,
									onChange: (e) => handleChange("project_id", e.target.value),
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "—"
									}), projects?.map((p) => /* @__PURE__ */ jsx("option", {
										value: p.id,
										children: locale === "ar" ? p.name_ar : p.name_en
									}, p.id))]
								})] }), isAdmin && managers?.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-secondary-950 mb-1",
									children: locale === "ar" ? "الوسيط المختص للوحدة" : "Assigned Agent / Manager"
								}), /* @__PURE__ */ jsxs(Select, {
									value: data.user_id || "",
									onChange: (e) => handleChange("user_id", e.target.value),
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: locale === "ar" ? "اختر الوسيط المختص..." : "Select Agent..."
									}), managers?.map((m) => /* @__PURE__ */ jsxs("option", {
										value: m.id,
										children: [
											m.name,
											" (",
											m.role === "admin" ? locale === "ar" ? "أدمن" : "Admin" : m.role === "manager" ? locale === "ar" ? "مدير" : "Manager" : locale === "ar" ? "وسيط" : "Agent",
											")"
										]
									}, m.id))]
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-secondary-100",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("payment_method") || "Payment Method"
									}), /* @__PURE__ */ jsxs(Select, {
										value: data.payment_method,
										onChange: (e) => handleChange("payment_method", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "",
												children: "—"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "cash",
												children: trans("cash") || "Cash"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "installment",
												children: trans("installment") || "Installment"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "both",
												children: trans("both") || "Cash & Installment"
											})
										]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("finishing_type") || "Finishing Type"
									}), /* @__PURE__ */ jsxs(Select, {
										value: data.finishing_type_id,
										onChange: (e) => handleChange("finishing_type_id", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "—"
										}), finishingTypes?.map((f) => /* @__PURE__ */ jsx("option", {
											value: f.id,
											children: locale === "ar" ? f.name_ar : f.name_en
										}, f.id))]
									})] }),
									["installment", "both"].includes(data.payment_method) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("down_payment") || "Down Payment"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.down_payment,
										onChange: (e) => handleChange("down_payment", e.target.value),
										placeholder: locale === "ar" ? "مثال: 10% أو 500,000" : "e.g. 10% or 500,000",
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("installment_years") || "Installment Years"
									}), /* @__PURE__ */ jsx("input", {
										type: "number",
										min: "0",
										value: data.installment_years,
										onChange: (e) => handleChange("installment_years", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] })] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-3",
									children: trans("features") || "Features"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
									children: features?.map((feature) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											id: `unit-feature-${feature.id}`,
											checked: data.features.includes(feature.id),
											onChange: () => toggleFeature(feature.id),
											className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
										}), /* @__PURE__ */ jsx("label", {
											htmlFor: `unit-feature-${feature.id}`,
											className: "text-sm text-secondary-700 cursor-pointer select-none",
											children: locale === "ar" ? feature.name_ar : feature.name_en
										})]
									}, feature.id))
								})]
							})
						]
					}),
					step === 1 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-semibold text-secondary-950 mb-2",
								children: trans("primary_image", {}, "units")
							}), /* @__PURE__ */ jsxs("div", {
								className: "border-2 border-dashed border-secondary-200 rounded-xl overflow-hidden bg-surface",
								children: [primaryPreview || primaryImage ? /* @__PURE__ */ jsxs("div", {
									className: "relative group",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: primaryPreview || primaryImage.url,
											alt: "",
											className: "w-full h-52 object-cover"
										}),
										!primaryPreview && primaryImage?.is_primary && /* @__PURE__ */ jsx("span", {
											className: "absolute top-2 start-2 bg-primary-900 text-white text-xs px-2 py-0.5 rounded-full font-medium",
											children: trans("primary_badge", {}, "units")
										}),
										primaryPreview && /* @__PURE__ */ jsx("span", {
											className: "absolute top-2 start-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium",
											children: locale === "ar" ? "جديدة" : "New"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => primaryRef.current?.click(),
												className: "px-3 py-1.5 bg-white text-secondary-950 rounded-lg text-xs font-medium hover:bg-secondary-100",
												children: locale === "ar" ? "تغيير الصورة الرئيسية" : "Change Primary"
											})
										})
									]
								}) : /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => primaryRef.current?.click(),
									className: "w-full h-40 flex flex-col items-center justify-center gap-2 text-muted hover:text-primary-900 transition-colors",
									children: [
										/* @__PURE__ */ jsx("svg", {
											className: "w-10 h-10",
											fill: "none",
											stroke: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												strokeWidth: 1.5,
												d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
											})
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium",
											children: trans("primary_image", {}, "units")
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs",
											children: locale === "ar" ? "انقر لاختيار صورة" : "Click to select"
										})
									]
								}), /* @__PURE__ */ jsx("input", {
									ref: primaryRef,
									type: "file",
									accept: "image/*",
									onChange: handlePrimaryChange,
									className: "hidden"
								})]
							})] }),
							existingImages.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-semibold text-secondary-950 mb-2",
								children: locale === "ar" ? "الصور الحالية" : "Current Images"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-3 sm:grid-cols-4 gap-3",
								children: existingImages.map((img) => /* @__PURE__ */ jsxs("div", {
									className: "relative group rounded-xl overflow-hidden border-2 border-secondary-100 bg-surface",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: img.url,
											alt: "",
											className: "w-full h-24 object-cover"
										}),
										img.is_primary && /* @__PURE__ */ jsx("span", {
											className: "absolute top-1 start-1 bg-primary-900 text-white text-xs px-1.5 py-0.5 rounded-full font-medium leading-none",
											children: trans("primary_badge", {}, "units")
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2",
											children: [!img.is_primary && /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setExistingAsPrimary(img),
												className: "w-full py-1 bg-primary-900 text-white rounded text-xs font-medium",
												children: trans("set_as_primary", {}, "units")
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => deleteExistingImage(img),
												className: "w-full py-1 bg-red-600 text-white rounded text-xs font-medium",
												children: trans("remove_image", {}, "units")
											})]
										})
									]
								}, img.id))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-semibold text-secondary-950 mb-2",
									children: trans("secondary_images", {}, "units")
								}),
								newPreviews.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3",
									children: newPreviews.map((src, i) => /* @__PURE__ */ jsxs("div", {
										className: "relative group rounded-xl overflow-hidden border-2 border-primary-900/20 bg-surface",
										children: [/* @__PURE__ */ jsx("img", {
											src,
											alt: "",
											className: "w-full h-24 object-cover"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => removeNewImage(i),
												className: "p-1.5 bg-red-600 text-white rounded-full",
												children: /* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5",
													fill: "none",
													stroke: "currentColor",
													viewBox: "0 0 24 24",
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														strokeWidth: 2,
														d: "M6 18L18 6M6 6l12 12"
													})
												})
											})
										})]
									}, i))
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => moreRef.current?.click(),
									className: "w-full py-3 border-2 border-dashed border-secondary-200 rounded-xl text-sm text-muted hover:text-primary-900 hover:border-primary-900/40 transition-colors flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("svg", {
										className: "w-5 h-5",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 1.5,
											d: "M12 4.5v15m7.5-7.5h-15"
										})
									}), trans("add_more_images", {}, "units")]
								}),
								/* @__PURE__ */ jsx("input", {
									ref: moreRef,
									type: "file",
									multiple: true,
									accept: "image/*",
									onChange: handleMoreImages,
									className: "hidden"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted mt-1",
									children: trans("max_images", {}, "units")
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: trans("video", {}, "units")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: data.video_url,
									onChange: (e) => handleChange("video_url", e.target.value),
									placeholder: "https://youtube.com/...",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted mt-1",
									children: trans("video_url_help", {}, "units")
								})
							] })
						]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-semibold text-secondary-950",
										children: [
											trans("keywords_label", {}, "units"),
											" (",
											trans("ar"),
											")",
											/* @__PURE__ */ jsxs("span", {
												className: "text-xs text-muted font-normal ms-1",
												children: [
													"(",
													data.keywords_ar.length,
													")"
												]
											})
										]
									}), data.keywords_ar.length > 0 && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: clearKeywordsAr,
										className: "text-xs text-red-600 hover:text-red-700 font-medium transition-colors",
										children: locale === "ar" ? "تفريغ الكل" : "Clear All"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 mb-2",
									children: [/* @__PURE__ */ jsx("textarea", {
										value: keywordInputAr,
										onChange: (e) => setKeywordInputAr(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												addKeywordAr();
											}
										},
										rows: 2,
										dir: "rtl",
										placeholder: locale === "ar" ? "الصق النص أو الكلمات مفصولة بفاصلة (، أو .) أو سطر جديد..." : "Paste text or keywords separated by commas or newlines...",
										className: "flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: addKeywordAr,
										className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0",
										children: trans("add")
									})]
								}),
								data.keywords_ar.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface",
									children: data.keywords_ar.map((kw) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors",
										children: [kw, /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeKeywordAr(kw),
											className: "text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none",
											children: "×"
										})]
									}, kw))
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-sm font-semibold text-secondary-950",
										children: [
											trans("keywords_label", {}, "units"),
											" (",
											trans("en"),
											")",
											/* @__PURE__ */ jsxs("span", {
												className: "text-xs text-muted font-normal ms-1",
												children: [
													"(",
													data.keywords_en.length,
													")"
												]
											})
										]
									}), data.keywords_en.length > 0 && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: clearKeywordsEn,
										className: "text-xs text-red-600 hover:text-red-700 font-medium transition-colors",
										children: locale === "ar" ? "تفريغ الكل" : "Clear All"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2 mb-2",
									children: [/* @__PURE__ */ jsx("textarea", {
										value: keywordInputEn,
										onChange: (e) => setKeywordInputEn(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												addKeywordEn();
											}
										},
										rows: 2,
										dir: "ltr",
										placeholder: "Paste English keywords separated by commas or newlines...",
										className: "flex-1 px-3 py-2 border border-secondary-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 resize-y"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: addKeywordEn,
										className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors self-end h-10 shrink-0",
										children: trans("add")
									})]
								}),
								data.keywords_en.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 border border-secondary-200 rounded-xl bg-surface",
									children: data.keywords_en.map((kw) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-medium text-secondary-800 rounded-lg border border-secondary-200 shadow-2xs group hover:border-red-300 transition-colors",
										children: [kw, /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeKeywordEn(kw),
											className: "text-secondary-400 group-hover:text-red-600 text-sm font-bold leading-none",
											children: "×"
										})]
									}, kw))
								})
							] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("meta_description"),
										" (",
										trans("ar"),
										")"
									]
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.meta_description_ar,
									onChange: (e) => handleChange("meta_description_ar", e.target.value),
									rows: 3,
									maxLength: 500,
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted mt-1 text-end",
									children: [data.meta_description_ar.length, "/500"]
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("meta_description"),
										" (",
										trans("en"),
										")"
									]
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.meta_description_en,
									onChange: (e) => handleChange("meta_description_en", e.target.value),
									rows: 3,
									maxLength: 500,
									dir: "ltr",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted mt-1 text-end",
									children: [data.meta_description_en.length, "/500"]
								})
							] })]
						})]
					}),
					step === 3 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("location_address"),
										" (",
										trans("ar"),
										")"
									]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.location_address_ar,
									onChange: (e) => handleChange("location_address_ar", e.target.value),
									onKeyDown: (e) => e.key === "Enter" && e.preventDefault(),
									dir: "rtl",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-secondary-950 mb-1",
									children: [
										trans("location_address"),
										" (",
										trans("en"),
										")"
									]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.location_address_en,
									onChange: (e) => handleChange("location_address_en", e.target.value),
									onKeyDown: (e) => e.key === "Enter" && e.preventDefault(),
									dir: "ltr",
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("map_embed_url", {}, "units")
							}), /* @__PURE__ */ jsx("textarea", {
								value: data.map_embed_url,
								onChange: (e) => handleChange("map_embed_url", e.target.value),
								rows: 4,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								placeholder: "<iframe src=\"https://www.google.com/maps/embed?pb=...\" ></iframe>",
								dir: "ltr"
							})] }),
							data.map_embed_url && /* @__PURE__ */ jsx("iframe", {
								src: (() => {
									const m = data.map_embed_url.match(/src\s*=\s*"([^"]+)"/i) || data.map_embed_url.match(/src\s*=\s*'([^']+)'/i);
									return m ? m[1] : data.map_embed_url;
								})(),
								className: "w-full aspect-video rounded-lg",
								allowFullScreen: true,
								loading: "lazy",
								title: "Google Maps"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 pt-6 border-t border-secondary-100 space-y-3",
						children: [
							isSubmitting && /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs text-secondary-600",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: uploadStatus
										}), uploadProgress > 0 && /* @__PURE__ */ jsxs("span", {
											className: "font-bold text-primary-900",
											children: [uploadProgress, "%"]
										})]
									}),
									uploadProgress > 0 && /* @__PURE__ */ jsx("div", {
										className: "w-full bg-secondary-100 rounded-full h-2 overflow-hidden",
										children: /* @__PURE__ */ jsx("div", {
											className: "bg-primary-900 h-2 rounded-full transition-all duration-300",
											style: { width: `${uploadProgress}%` }
										})
									}),
									uploadProgress === 0 && /* @__PURE__ */ jsx("div", {
										className: "w-full bg-secondary-100 rounded-full h-2 overflow-hidden",
										children: /* @__PURE__ */ jsx("div", { className: "bg-primary-900 h-2 rounded-full animate-pulse w-1/3" })
									})
								]
							}),
							!isSubmitting && (primaryFile || newFiles.length > 0) && /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-secondary-500 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-3.5 h-3.5 text-green-500",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									})
								}), /* @__PURE__ */ jsx("span", { children: locale === "ar" ? `${(primaryFile ? 1 : 0) + newFiles.length} صورة جاهزة للرفع — ${(primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0) > 0 ? (((primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0)) / 1048576).toFixed(1) + " MB" : ""}` : `${(primaryFile ? 1 : 0) + newFiles.length} image(s) ready — ${(((primaryFile ? primaryFile.size : 0) + newFiles.reduce((s, f) => s + f.size, 0)) / 1048576).toFixed(1)} MB` })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setStep(Math.max(0, step - 1)),
									disabled: step === 0 || isSubmitting,
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 disabled:opacity-50",
									children: trans("back")
								}), step < STEPS.length - 1 ? /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => canNext() && setStep(step + 1),
									disabled: !canNext(),
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50",
									children: trans("next")
								}) : /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleSubmit,
									disabled: processing || isSubmitting,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
									children: [isSubmitting && /* @__PURE__ */ jsxs("svg", {
										className: "animate-spin h-4 w-4 text-white",
										fill: "none",
										viewBox: "0 0 24 24",
										children: [/* @__PURE__ */ jsx("circle", {
											className: "opacity-25",
											cx: "12",
											cy: "12",
											r: "10",
											stroke: "currentColor",
											strokeWidth: "4"
										}), /* @__PURE__ */ jsx("path", {
											className: "opacity-75",
											fill: "currentColor",
											d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										})]
									}), isSubmitting ? uploadStatus || trans("loading") : isEdit ? trans("update") : trans("save")]
								})]
							})
						]
					})
				]
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Units/Index.jsx
var Index_exports$4 = /* @__PURE__ */ __exportAll({ default: () => AdminUnitsIndex });
function AdminUnitsIndex({ units, areas, unitTypes, filters }) {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const role = auth?.user?.role;
	const [search, setSearch] = useState(filters?.search || "");
	const [areaFilter, setAreaFilter] = useState(filters?.area_id || "");
	const [typeFilter, setTypeFilter] = useState(filters?.type_id || "");
	const [showAdjustPointsModal, setShowAdjustPointsModal] = useState(false);
	const [unitToAdjust, setUnitToAdjust] = useState(null);
	const { data: pointsData, setData: setPointsData, post: postPoints, processing: pointsProcessing, reset: resetPoints, errors: pointsErrors } = useForm({ points: "" });
	function openAdjustPoints(unit) {
		setUnitToAdjust(unit);
		setPointsData("points", unit.priority_points);
		setShowAdjustPointsModal(true);
	}
	function handleAdjustPoints(e) {
		e.preventDefault();
		postPoints(`/admin/units/${unitToAdjust.id}/adjust-points`, {
			preserveScroll: true,
			onSuccess: () => {
				setShowAdjustPointsModal(false);
				setUnitToAdjust(null);
				resetPoints();
			}
		});
	}
	function applyFilters() {
		const params = {};
		if (search) params.search = search;
		if (areaFilter) params.area_id = areaFilter;
		if (typeFilter) params.type_id = typeFilter;
		router.get("/admin/units", params, { preserveState: true });
	}
	function resetFilters() {
		setSearch("");
		setAreaFilter("");
		setTypeFilter("");
		router.get("/admin/units", {}, { preserveState: true });
	}
	function togglePin(unit) {
		router.post(`/admin/units/${unit.id}/pin`, {}, { preserveScroll: true });
	}
	function toggleDeal(unit) {
		router.post(`/admin/units/${unit.id}/deal`, {}, { preserveScroll: true });
	}
	function toggleActive(unit) {
		router.post(`/admin/units/${unit.id}/active`, {}, { preserveScroll: true });
	}
	function deleteUnit(unit) {
		if (confirm(trans("confirm_delete"))) router.delete(`/admin/units/${unit.id}`, { preserveScroll: true });
	}
	const loading = !units;
	const hasUnits = units?.data?.length > 0;
	const colCount = role === "agent" ? 10 : 11;
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_units") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-secondary-200/70 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-black text-secondary-950",
					children: trans("sidebar_units")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted mt-0.5",
					children: isRtl ? "إدارة وتحديث العقارات والوحدات المتاحة على الموقع" : "Manage and update real estate listings"
				})] }), /* @__PURE__ */ jsxs(Link, {
					href: "/admin/units/create",
					className: "px-4 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0",
					children: [/* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 2.5,
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M12 4.5v15m7.5-7.5h-15"
						})
					}), /* @__PURE__ */ jsx("span", { children: trans("add_unit", {}, "units") })]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-2xl border border-secondary-200/70 shadow-sm p-4 sm:p-5",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						applyFilters();
					},
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "search-input",
							className: "block text-xs font-bold text-secondary-700 mb-1",
							children: trans("search")
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("input", {
								id: "search-input",
								type: "text",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: isRtl ? "اسم العقار، العريضة..." : "Unit title, search...",
								className: "w-full ps-9 pe-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none"
							}), /* @__PURE__ */ jsx("svg", {
								className: "w-4 h-4 text-secondary-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 2,
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								})
							})]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "area-filter",
							className: "block text-xs font-bold text-secondary-700 mb-1",
							children: trans("area")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "area-filter",
							value: areaFilter,
							onChange: (e) => setAreaFilter(e.target.value),
							className: "w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: isRtl ? "كل المناطق" : "All Areas"
							}), areas?.map((a) => /* @__PURE__ */ jsx("option", {
								value: a.id,
								children: locale === "ar" ? a.name_ar : a.name_en
							}, a.id))]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "type-filter",
							className: "block text-xs font-bold text-secondary-700 mb-1",
							children: trans("type")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "type-filter",
							value: typeFilter,
							onChange: (e) => setTypeFilter(e.target.value),
							className: "w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-xs font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: isRtl ? "كل الأنواع" : "All Types"
							}), unitTypes?.map((t) => /* @__PURE__ */ jsx("option", {
								value: t.id,
								children: locale === "ar" ? t.name_ar : t.name_en
							}, t.id))]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "flex-1 py-2 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-3.5 h-3.5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
									})
								}), /* @__PURE__ */ jsx("span", { children: trans("search") })]
							}), (search || areaFilter || typeFilter) && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: resetFilters,
								className: "px-3 py-2 bg-surface hover:bg-secondary-200 text-secondary-700 rounded-xl text-xs font-bold transition-all border border-secondary-200",
								title: isRtl ? "إعادة ضبط" : "Reset",
								children: "✕"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-2xl border border-secondary-200/70 shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-xs text-start rtl:text-right border-collapse",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-slate-50/80 border-b border-secondary-200/80 text-secondary-600 font-bold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3.5 text-start",
									children: trans("name")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-start",
									children: trans("type", {}, "units")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-start",
									children: trans("area")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-start",
									children: trans("price", {}, "units")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("transaction", {}, "units")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: isRtl ? "الزيارات" : "Views"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("priority_points")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("pinned")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("is_deal")
								}),
								role !== "agent" && /* @__PURE__ */ jsx("th", {
									className: "px-3 py-3.5 text-center",
									children: trans("active")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-3.5 text-center",
									children: trans("actions")
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-secondary-100 font-medium",
							children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(SkeletonRow, { cols: colCount }, i)) : hasUnits ? units.data.map((unit) => {
								const thumb = unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null);
								const unitTypeName = (locale === "ar" ? unit.type?.name_ar : unit.type?.name_en) || unit.type?.name_ar || unit.type?.name_en || "—";
								const unitAreaName = (locale === "ar" ? unit.area?.name_ar : unit.area?.name_en) || unit.area?.name_ar || unit.area?.name_en || "—";
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/70 transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3 min-w-[180px]",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [thumb ? /* @__PURE__ */ jsx("img", {
													src: thumb,
													alt: "",
													className: "w-10 h-10 rounded-xl object-cover shrink-0 border border-secondary-200 shadow-xs"
												}) : /* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 rounded-xl bg-surface border border-secondary-200 shrink-0 flex items-center justify-center text-secondary-400",
													children: /* @__PURE__ */ jsx("svg", {
														className: "w-5 h-5",
														fill: "none",
														viewBox: "0 0 24 24",
														stroke: "currentColor",
														children: /* @__PURE__ */ jsx("path", {
															strokeLinecap: "round",
															strokeLinejoin: "round",
															strokeWidth: 1.5,
															d: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21"
														})
													})
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx(Link, {
														href: `/admin/units/${unit.id}/edit`,
														className: "text-secondary-950 hover:text-primary-900 font-bold block truncate max-w-[200px]",
														children: unit.name
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-[11px] text-muted block truncate",
														children: ["#", unit.id]
													})]
												})]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-secondary-700 whitespace-nowrap",
											children: unitTypeName
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-secondary-700 whitespace-nowrap",
											children: unitAreaName
										}),
										/* @__PURE__ */ jsxs("td", {
											className: "px-3 py-3 whitespace-nowrap",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-extrabold text-secondary-950",
												children: Number(unit.price).toLocaleString()
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-muted ms-1 font-normal",
												children: isRtl ? "ج.م" : "EGP"
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsx("span", {
												className: `px-2.5 py-1 rounded-lg text-[11px] font-bold ${unit.transaction === "rent" ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-blue-50 text-blue-700 border border-blue-100"}`,
												children: trans(unit.transaction === "rent" ? "rent" : "sale", {}, "units")
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 px-2.5 py-1 bg-surface rounded-lg text-xs font-bold text-secondary-800 border border-secondary-200",
												children: [/* @__PURE__ */ jsx("svg", {
													className: "w-3.5 h-3.5 text-primary-900",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													})
												}), unit.views_count || 0]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center font-bold text-secondary-900 whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("span", {
												className: "px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200/70 text-xs",
												children: ["⭐ ", unit.priority_points]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: role !== "agent" ? /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => togglePin(unit),
												className: `px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_pinned ? "bg-primary-900 text-white shadow-xs" : "bg-surface text-secondary-600 border border-secondary-200 hover:bg-secondary-100"}`,
												children: unit.is_pinned ? isRtl ? "📌 مثبت" : "Pinned" : isRtl ? "غير مثبت" : "Unpinned"
											}) : /* @__PURE__ */ jsx("span", {
												className: `inline-block px-2.5 py-1 text-xs rounded-full font-bold ${unit.is_pinned ? "bg-primary-900 text-white" : "bg-surface text-secondary-600 border border-secondary-200"}`,
												children: unit.is_pinned ? isRtl ? "📌 مثبت" : "Pinned" : isRtl ? "غير مثبت" : "Unpinned"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: role !== "agent" ? /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => toggleDeal(unit),
												className: `px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_deal ? "bg-amber-500 text-white shadow-xs" : "bg-surface text-secondary-600 border border-secondary-200 hover:bg-secondary-100"}`,
												children: unit.is_deal ? isRtl ? "🔥 صفقة" : "Deal" : isRtl ? "عادي" : "Normal"
											}) : /* @__PURE__ */ jsx("span", {
												className: `inline-block px-2.5 py-1 text-xs rounded-full font-bold ${unit.is_deal ? "bg-amber-500 text-white" : "bg-surface text-secondary-600 border border-secondary-200"}`,
												children: unit.is_deal ? isRtl ? "🔥 صفقة" : "Deal" : isRtl ? "عادي" : "Normal"
											})
										}),
										role !== "agent" && /* @__PURE__ */ jsx("td", {
											className: "px-3 py-3 text-center whitespace-nowrap",
											children: /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => toggleActive(unit),
												className: `px-2.5 py-1 text-xs rounded-full font-bold transition-all active:scale-95 ${unit.is_active ? "bg-emerald-600 text-white shadow-xs" : "bg-red-50 text-red-600 border border-red-200"}`,
												children: unit.is_active ? isRtl ? "مفعل" : "Active" : isRtl ? "معطل" : "Inactive"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-3 whitespace-nowrap",
											children: /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-center gap-1.5",
												children: [
													(role !== "agent" || unit.user_id === auth?.user?.id) && /* @__PURE__ */ jsxs(Link, {
														href: `/admin/units/${unit.id}/edit`,
														className: "px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200/70 flex items-center gap-1 active:scale-95",
														title: trans("edit"),
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
															})
														}), /* @__PURE__ */ jsx("span", { children: trans("edit") })]
													}),
													role !== "agent" && /* @__PURE__ */ jsxs("button", {
														type: "button",
														onClick: () => openAdjustPoints(unit),
														className: "px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all border border-amber-200/70 flex items-center gap-1 active:scale-95",
														title: trans("adjust_points"),
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.486-.411.87-.833.618L12 17.771l-4.665 2.716c-.422.246-.949-.132-.833-.618l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
															})
														}), /* @__PURE__ */ jsx("span", { children: isRtl ? "النقاط" : "Points" })]
													}),
													role !== "agent" && /* @__PURE__ */ jsxs("button", {
														type: "button",
														onClick: () => deleteUnit(unit),
														className: "px-2.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200/70 flex items-center gap-1 active:scale-95",
														title: trans("delete"),
														children: [/* @__PURE__ */ jsx("svg", {
															className: "w-3.5 h-3.5",
															fill: "none",
															viewBox: "0 0 24 24",
															stroke: "currentColor",
															strokeWidth: 2,
															children: /* @__PURE__ */ jsx("path", {
																strokeLinecap: "round",
																strokeLinejoin: "round",
																d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															})
														}), /* @__PURE__ */ jsx("span", { children: trans("delete") })]
													})
												]
											})
										})
									]
								}, unit.id);
							}) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: colCount,
								className: "px-4 py-12 text-center text-muted",
								children: trans("no_data")
							}) })
						})]
					})
				})
			}),
			showAdjustPointsModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4",
				onClick: () => setShowAdjustPointsModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-secondary-200",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-secondary-950",
							children: trans("adjust_points")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowAdjustPointsModal(false),
							className: "text-secondary-400 hover:text-secondary-950 text-xl font-bold leading-none",
							children: "×"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleAdjustPoints,
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-xs font-bold text-secondary-950 mb-1",
								children: [trans("priority_points"), " *"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "number",
								min: "0",
								value: pointsData.points,
								onChange: (e) => setPointsData("points", e.target.value),
								className: "w-full px-3 py-2 bg-surface border border-secondary-200 rounded-xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary-900/20 focus-visible:border-primary-900 focus-visible:outline-none",
								required: true
							}),
							pointsErrors.points && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: pointsErrors.points
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-2 justify-end pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowAdjustPointsModal(false),
								className: "px-4 py-2 bg-surface text-secondary-700 rounded-xl text-xs font-bold hover:bg-secondary-200 transition-colors",
								children: trans("cancel")
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: pointsProcessing,
								className: "px-4 py-2 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-950 transition-colors disabled:opacity-50 shadow-xs",
								children: pointsProcessing ? trans("loading") : trans("save")
							})]
						})]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Users/Create.jsx
var Create_exports = /* @__PURE__ */ __exportAll({ default: () => AdminUsersCreate });
function AdminUsersCreate({ managers }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { data, setData, post, processing, errors } = useForm({
		name: "",
		email: "",
		password: "",
		password_confirmation: "",
		role: "agent",
		manager_id: ""
	});
	function handleSubmit(e) {
		e.preventDefault();
		post("/admin/users");
	}
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("users.add_user") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mb-6",
			children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold text-secondary-950",
				children: trans("users.add_user")
			}) }), /* @__PURE__ */ jsx(Link, {
				href: "/admin/users",
				className: "px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-surface",
				children: trans("back")
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "max-w-3xl bg-white rounded-xl shadow-card p-6 border border-secondary-100",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: [trans("users.name"), " *"]
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.name,
							onChange: (e) => setData("name", e.target.value),
							className: "w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white",
							required: true
						}),
						errors.name && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-error mt-1",
							children: errors.name
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: [trans("users.email"), " *"]
						}),
						/* @__PURE__ */ jsx("input", {
							type: "email",
							value: data.email,
							onChange: (e) => setData("email", e.target.value),
							className: "w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white",
							required: true
						}),
						errors.email && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-error mt-1",
							children: errors.email
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [trans("password"), " *"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "password",
								value: data.password,
								onChange: (e) => setData("password", e.target.value),
								className: "w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white",
								required: true
							}),
							errors.password && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-error mt-1",
								children: errors.password
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: [trans("password_confirmation"), " *"]
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							value: data.password_confirmation,
							onChange: (e) => setData("password_confirmation", e.target.value),
							className: "w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900 bg-white",
							required: true
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: [trans("users.role"), " *"]
						}),
						/* @__PURE__ */ jsxs(Select, {
							value: data.role,
							onChange: (e) => setData("role", e.target.value),
							className: "w-full px-4 py-2 border border-secondary-200 rounded-lg bg-white",
							required: true,
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "admin",
									children: trans("users.role_admin") || "مدير عام"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "manager",
									children: trans("users.role_manager") || "مدير"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "agent",
									children: trans("users.role_agent") || "موظف"
								})
							]
						}),
						errors.role && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-error mt-1",
							children: errors.role
						})
					] }),
					data.role === "agent" && /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block text-sm font-medium text-secondary-950 mb-1",
							children: [trans("users.manager"), " *"]
						}),
						/* @__PURE__ */ jsxs(Select, {
							value: data.manager_id,
							onChange: (e) => setData("manager_id", e.target.value),
							className: "w-full px-4 py-2 border border-secondary-200 rounded-lg bg-white",
							required: data.role === "agent",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: trans("users.select_manager") || "اختر المدير..."
							}), managers?.map((m) => /* @__PURE__ */ jsx("option", {
								value: m.id,
								children: m.name
							}, m.id))]
						}),
						errors.manager_id && /* @__PURE__ */ jsx("p", {
							className: "text-xs text-error mt-1",
							children: errors.manager_id
						})
					] }),
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-end pt-4",
						children: /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: processing,
							className: "px-8 py-3 bg-primary-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-950 transition-all shadow-md flex items-center gap-2 disabled:opacity-50",
							children: [processing && /* @__PURE__ */ jsxs("svg", {
								className: "animate-spin w-4 h-4 text-white",
								fill: "none",
								viewBox: "0 0 24 24",
								children: [/* @__PURE__ */ jsx("circle", {
									className: "opacity-25",
									cx: "12",
									cy: "12",
									r: "10",
									stroke: "currentColor",
									strokeWidth: "4"
								}), /* @__PURE__ */ jsx("path", {
									className: "opacity-75",
									fill: "currentColor",
									d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								})]
							}), /* @__PURE__ */ jsx("span", { children: processing ? trans("loading") : trans("save") })]
						})
					})
				]
			})
		})]
	})] });
}
//#endregion
//#region resources/js/Pages/Admin/Users/Index.jsx
var Index_exports$3 = /* @__PURE__ */ __exportAll({ default: () => AdminUsersIndex });
function AdminUsersIndex({ users, managers, filters }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [search, setSearch] = useState(filters?.search || "");
	const [roleFilter, setRoleFilter] = useState(filters?.role || "");
	const [showTransferModal, setShowTransferModal] = useState(false);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);
	const [userToPassword, setUserToPassword] = useState(null);
	const [userRelations, setUserRelations] = useState(null);
	const { data: passwordData, setData: setPasswordData, post: passwordPost, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
		password: "",
		password_confirmation: ""
	});
	function openChangePassword(user) {
		setUserToPassword(user);
		resetPassword();
		setShowPasswordModal(true);
	}
	function handleChangePassword(e) {
		e.preventDefault();
		passwordPost(`/admin/users/${userToPassword.id}/change-password`, {
			preserveScroll: true,
			onSuccess: () => {
				setShowPasswordModal(false);
				setUserToPassword(null);
				resetPassword();
			}
		});
	}
	useEffect(() => {
		if (filters) {
			setSearch(filters.search || "");
			setRoleFilter(filters.role || "");
		}
	}, [filters]);
	const { data: transferData, setData: setTransferData, post: transferPost, processing: transferProcessing } = useForm({
		from_user_id: "",
		to_user_id: ""
	});
	const { data: assignData, setData: setAssignData, post: assignPost, processing: assignProcessing } = useForm({
		manager_id: "",
		agent_ids: []
	});
	const { data: deleteData, setData: setDeleteData, delete: destroyUser, processing: deleteProcessing, reset: resetDelete } = useForm({ transfer_to_id: "" });
	const allAgents = users?.filter((u) => u.role === "agent") || [];
	const [selectedAgents, setSelectedAgents] = useState([]);
	async function openDelete(user) {
		setUserToDelete(user);
		setUserRelations(null);
		setDeleteData("transfer_to_id", "");
		setShowDeleteModal(true);
		try {
			const data = await (await fetch(`/admin/users/${user.id}/check-relations`)).json();
			setUserRelations(data);
		} catch (error) {
			console.error(error);
		}
	}
	function handleDelete(e) {
		e.preventDefault();
		destroyUser(`/admin/users/${userToDelete.id}`, {
			preserveScroll: true,
			onSuccess: () => {
				setShowDeleteModal(false);
				setUserToDelete(null);
				resetDelete();
			}
		});
	}
	useEffect(() => {
		if (assignData.manager_id) {
			const assignedIds = (users || []).filter((u) => u.role === "agent" && u.manager_id === Number(assignData.manager_id)).map((u) => u.id);
			setSelectedAgents(assignedIds);
			setAssignData("agent_ids", assignedIds);
		} else {
			setSelectedAgents([]);
			setAssignData("agent_ids", []);
		}
	}, [assignData.manager_id, users]);
	function applyFilters() {
		router.get("/admin/users", {
			search,
			role: roleFilter
		}, {
			preserveState: true,
			preserveScroll: true
		});
	}
	function toggleActive(user) {
		router.post(`/admin/users/${user.id}/toggle-active`, {}, { preserveScroll: true });
	}
	function openTransfer(user) {
		setTransferData("from_user_id", user.id);
		setShowTransferModal(true);
	}
	function handleTransfer(e) {
		e.preventDefault();
		transferPost("/admin/users/transfer-projects", {
			preserveScroll: true,
			onSuccess: () => {
				setShowTransferModal(false);
				setTransferData({
					from_user_id: "",
					to_user_id: ""
				});
			}
		});
	}
	function handleAssign(e) {
		e.preventDefault();
		assignPost("/admin/users/assign-agents", {
			preserveScroll: true,
			onSuccess: () => {
				setShowAssignModal(false);
				setAssignData({
					manager_id: "",
					agent_ids: []
				});
				setSelectedAgents([]);
			}
		});
	}
	function toggleAgentSelection(agentId) {
		setSelectedAgents((prev) => prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]);
		setAssignData("agent_ids", assignData.agent_ids.includes(agentId) ? assignData.agent_ids.filter((id) => id !== agentId) : [...assignData.agent_ids, agentId]);
	}
	const loading = !users;
	const filteredUsers = (users || []).filter((u) => {
		if (roleFilter && u.role !== roleFilter) return false;
		if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});
	const roleBadgeClass = (role) => {
		switch (role) {
			case "admin": return "bg-purple-100 text-purple-700";
			case "manager": return "bg-blue-100 text-blue-700";
			case "agent": return "bg-green-100 text-green-700";
			default: return "bg-secondary-100 text-secondary-700";
		}
	};
	return /* @__PURE__ */ jsxs(AdminSidebar, { children: [/* @__PURE__ */ jsx(Head, { title: trans("sidebar_users") + " — " + trans("app_name") }), /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "p-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-secondary-950",
					children: trans("sidebar_users")
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/admin/users/create",
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors",
						children: trans("add_user")
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setShowAssignModal(true),
						className: "px-4 py-2 bg-white text-secondary-700 border border-secondary-200 rounded-lg text-sm font-medium hover:bg-surface transition-colors",
						children: trans("assign_agents")
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-950 mb-1",
						children: trans("search")
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: trans("search"),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-950 mb-1",
						children: trans("role")
					}), /* @__PURE__ */ jsxs(Select, {
						value: roleFilter,
						onChange: (e) => setRoleFilter(e.target.value),
						className: "px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "",
								children: trans("all_roles")
							}),
							/* @__PURE__ */ jsx("option", {
								value: "admin",
								children: trans("admin")
							}),
							/* @__PURE__ */ jsx("option", {
								value: "manager",
								children: trans("manager")
							}),
							/* @__PURE__ */ jsx("option", {
								value: "agent",
								children: trans("agent")
							})
						]
					})] }),
					/* @__PURE__ */ jsx("button", {
						onClick: applyFilters,
						className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium",
						children: trans("search")
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm text-start",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-secondary-50/80 border-b border-secondary-200/80 text-secondary-600 text-xs font-semibold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("name")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("email")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("role")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("phone")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("manager")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("status")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-5 py-3.5 text-start",
									children: trans("actions")
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-secondary-100",
							children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(SkeletonRow, { cols: 7 }, i)) : filteredUsers.length > 0 ? filteredUsers.map((u) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-primary-50/30 transition-colors",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [u.avatar ? /* @__PURE__ */ jsx("img", {
												src: `/storage/${u.avatar}`,
												alt: u.name,
												className: "w-8 h-8 rounded-full object-cover border border-secondary-200 shadow-2xs"
											}) : /* @__PURE__ */ jsx("div", {
												className: "w-8 h-8 rounded-full bg-primary-100 text-primary-900 font-bold text-xs flex items-center justify-center border border-primary-200",
												children: u.name.charAt(0).toUpperCase()
											}), /* @__PURE__ */ jsx("span", {
												className: "font-semibold text-secondary-950",
												children: u.name
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5 text-secondary-600 font-mono text-xs",
										children: u.email
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ jsx("span", {
											className: `inline-flex items-center px-2.5 py-0.5 text-xs rounded-full font-medium ${roleBadgeClass(u.role)}`,
											children: trans(u.role)
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5 text-secondary-700 font-mono text-xs",
										dir: "ltr",
										children: u.phone || "—"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5 text-secondary-600 text-xs",
										children: u.manager?.name || "—"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ jsxs("span", {
											className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full font-medium ${u.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`,
											children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-green-600" : "bg-red-600"}` }), u.is_active ? trans("active") : trans("inactive")]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap gap-1.5 items-center",
											children: [
												/* @__PURE__ */ jsx("button", {
													onClick: () => toggleActive(u),
													className: `text-xs px-2.5 py-1 rounded-md font-medium border transition-colors ${u.is_active ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"}`,
													children: u.is_active ? trans("deactivate") : trans("activate")
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => openChangePassword(u),
													className: "text-xs px-2.5 py-1 rounded-md font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors",
													children: trans("change_password")
												}),
												u.role !== "admin" && /* @__PURE__ */ jsx("button", {
													onClick: () => openTransfer(u),
													className: "text-xs px-2.5 py-1 rounded-md font-medium bg-secondary-100 text-secondary-700 border border-secondary-200 hover:bg-secondary-200 transition-colors",
													children: trans("transfer_projects")
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => openDelete(u),
													className: "text-xs px-2.5 py-1 rounded-md font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors",
													children: trans("delete")
												})
											]
										})
									})
								]
							}, u.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 7,
								className: "px-4 py-12 text-center text-muted",
								children: trans("no_data")
							}) })
						})]
					})
				})
			}),
			showTransferModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowTransferModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("transfer_projects")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowTransferModal(false),
							className: "text-muted hover:text-secondary-950 text-xl leading-none",
							children: "×"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleTransfer,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("transfer_from")
							}), /* @__PURE__ */ jsxs(Select, {
								value: transferData.from_user_id,
								onChange: (e) => setTransferData("from_user_id", e.target.value),
								disabled: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-surface",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "—"
								}), users?.map((u) => /* @__PURE__ */ jsxs("option", {
									value: u.id,
									children: [
										u.name,
										" (",
										trans(u.role),
										")"
									]
								}, u.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: trans("transfer_to")
							}), /* @__PURE__ */ jsxs(Select, {
								value: transferData.to_user_id,
								onChange: (e) => setTransferData("to_user_id", e.target.value),
								required: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "—"
								}), users?.filter((u) => u.id !== Number(transferData.from_user_id) && u.role !== "admin").map((u) => /* @__PURE__ */ jsxs("option", {
									value: u.id,
									children: [
										u.name,
										" (",
										trans(u.role),
										")"
									]
								}, u.id))]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 justify-end pt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowTransferModal(false),
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
									children: trans("cancel")
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: transferProcessing || !transferData.to_user_id,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
									children: transferProcessing ? trans("loading") : trans("transfer")
								})]
							})
						]
					})]
				})
			}),
			showAssignModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowAssignModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-secondary-950",
							children: trans("assign_agents_to_manager")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowAssignModal(false),
							className: "text-muted hover:text-secondary-950 text-xl leading-none",
							children: "×"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleAssign,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								className: "block text-sm font-medium text-secondary-950 mb-1",
								children: [trans("select_manager"), " *"]
							}), /* @__PURE__ */ jsxs(Select, {
								value: assignData.manager_id,
								onChange: (e) => setAssignData("manager_id", e.target.value),
								required: true,
								className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "—"
								}), managers?.map((m) => /* @__PURE__ */ jsx("option", {
									value: m.id,
									children: m.name
								}, m.id))]
							})] }),
							assignData.manager_id && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-secondary-950 mb-2",
								children: trans("select_agents")
							}), /* @__PURE__ */ jsx("div", {
								className: "max-h-48 overflow-y-auto border border-secondary-200 rounded-lg divide-y divide-secondary-100",
								children: allAgents.length > 0 ? allAgents.map((agent) => /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-3 px-3 py-2 hover:bg-surface/50 cursor-pointer",
									children: [
										/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: selectedAgents.includes(agent.id),
											onChange: () => toggleAgentSelection(agent.id),
											className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm",
											children: agent.name
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-muted",
											children: agent.email
										})
									]
								}, agent.id)) : /* @__PURE__ */ jsx("p", {
									className: "px-3 py-4 text-sm text-muted text-center",
									children: trans("no_agents_available")
								})
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 justify-end pt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowAssignModal(false),
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
									children: trans("cancel")
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: assignProcessing || !assignData.manager_id || selectedAgents.length === 0,
									className: "px-4 py-2 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
									children: assignProcessing ? trans("loading") : trans("assign")
								})]
							})
						]
					})]
				})
			}),
			showDeleteModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowDeleteModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-error",
							children: trans("delete_user")
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowDeleteModal(false),
							className: "text-muted hover:text-secondary-950 text-xl leading-none",
							children: "×"
						})]
					}), !userRelations ? /* @__PURE__ */ jsx("div", {
						className: "py-8 flex justify-center",
						children: /* @__PURE__ */ jsxs("svg", {
							className: "animate-spin w-8 h-8 text-primary-900",
							fill: "none",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							})]
						})
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleDelete,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-secondary-700",
								children: trans("confirm_delete_user", { name: userToDelete?.name })
							}),
							userRelations.has_relations && /* @__PURE__ */ jsxs("div", {
								className: "bg-amber-50 text-amber-800 p-4 rounded-lg text-sm mb-4",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "font-semibold mb-2",
										children: trans("user_has_relations_warning")
									}),
									/* @__PURE__ */ jsxs("ul", {
										className: "list-disc list-inside space-y-1 mb-4",
										children: [
											userRelations.projects_count > 0 && /* @__PURE__ */ jsxs("li", { children: [
												userRelations.projects_count,
												" ",
												trans("projects")
											] }),
											userRelations.units_count > 0 && /* @__PURE__ */ jsxs("li", { children: [
												userRelations.units_count,
												" ",
												trans("units")
											] }),
											userRelations.agents_count > 0 && /* @__PURE__ */ jsxs("li", { children: [
												userRelations.agents_count,
												" ",
												trans("agents")
											] })
										]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-amber-900 mb-1",
										children: trans("transfer_data_to")
									}), /* @__PURE__ */ jsxs(Select, {
										value: deleteData.transfer_to_id,
										onChange: (e) => setDeleteData("transfer_to_id", e.target.value),
										className: "w-full px-3 py-2 border border-amber-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: trans("force_delete_all")
										}), users?.filter((u) => u.id !== userToDelete?.id && u.role !== "admin").map((u) => /* @__PURE__ */ jsxs("option", {
											value: u.id,
											children: [
												u.name,
												" (",
												trans(u.role),
												")"
											]
										}, u.id))]
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 justify-end pt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowDeleteModal(false),
									className: "px-4 py-2 bg-surface text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors",
									children: trans("cancel")
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: deleteProcessing,
									className: "px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50",
									children: deleteProcessing ? trans("loading") : trans("delete_confirm")
								})]
							})
						]
					})]
				})
			}),
			showPasswordModal && userToPassword && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
				onClick: () => setShowPasswordModal(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-card p-6 max-w-md w-full mx-4",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-lg font-bold text-secondary-950 mb-4",
						children: [
							trans("change_password"),
							" — ",
							userToPassword.name
						]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleChangePassword,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-medium text-secondary-950 mb-1",
									children: trans("new_password")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: passwordData.password,
									onChange: (e) => setPasswordData("password", e.target.value),
									required: true,
									minLength: 8,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								passwordErrors.password && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: passwordErrors.password
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-medium text-secondary-950 mb-1",
									children: trans("confirm_password")
								}),
								/* @__PURE__ */ jsx("input", {
									type: "password",
									value: passwordData.password_confirmation,
									onChange: (e) => setPasswordData("password_confirmation", e.target.value),
									required: true,
									minLength: 8,
									className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
								}),
								passwordErrors.password_confirmation && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-error mt-1",
									children: passwordErrors.password_confirmation
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-end gap-3 pt-2",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowPasswordModal(false),
									className: "px-4 py-2 text-sm font-medium text-secondary-700 bg-surface rounded-lg hover:bg-secondary-200 transition-colors",
									children: trans("cancel")
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: passwordProcessing,
									className: "px-4 py-2 text-sm font-medium text-white bg-primary-900 rounded-lg hover:bg-primary-950 transition-colors disabled:opacity-50",
									children: passwordProcessing ? trans("loading") : trans("change_password")
								})]
							})
						]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Components/OptimizedImage.jsx
function OptimizedImage({ src, alt = "", width, height, className = "", lazy = true, fallbackSrc = "/images/fallback.jpg", role, srcSet, sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px", ...props }) {
	const [imgSrc, setImgSrc] = useState(src);
	const [hasError, setHasError] = useState(false);
	const handleError = () => {
		if (!hasError) {
			setHasError(true);
			setImgSrc(fallbackSrc);
		}
	};
	const finalAlt = alt !== void 0 ? alt : "";
	const computedSrcSet = srcSet;
	return /* @__PURE__ */ jsx("img", {
		src: imgSrc,
		srcSet: computedSrcSet,
		sizes: computedSrcSet ? sizes : void 0,
		alt: finalAlt,
		width,
		height,
		loading: lazy ? "lazy" : "eager",
		decoding: "async",
		className,
		onError: handleError,
		role,
		...props
	});
}
//#endregion
//#region resources/js/Components/Layout/Header.jsx
var NAV_ITEMS = [
	{
		key: "home",
		href: "/"
	},
	{
		key: "projects",
		href: "/projects"
	},
	{
		key: "units",
		href: "/units"
	},
	{
		key: "deals",
		href: "/units/deals"
	},
	{
		key: "compare",
		href: "/compare"
	},
	{
		key: "articles",
		href: "/articles"
	},
	{
		key: "about",
		href: "/about"
	},
	{
		key: "contact",
		href: "/contact"
	}
];
function Header({ compareCount = 0 }) {
	const { url, props } = usePage();
	const { locale, settings } = props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [menuOpen, setMenuOpen] = useState(false);
	const logoSrc = settings?.site_logo ? settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/storage") ? settings.site_logo : `/storage/${settings.site_logo}` : "/icon.png";
	const logoAlt = `${trans("app_name")} - ${isRtl ? "موقع عقارات عائلية" : "Family Real Estate"}`;
	const isActive = (href) => {
		if (!url) return false;
		const locHref = localizedPath(href, locale);
		if (locHref === `/${locale}`) return url === `/${locale}` || url === `/${locale}/` || url === "/";
		if (href === "/units" && url.startsWith(localizedPath("/units/deals", locale))) return false;
		return url.startsWith(locHref);
	};
	return /* @__PURE__ */ jsxs("header", {
		dir: isRtl ? "rtl" : "ltr",
		className: "sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sticky transition-all duration-300",
		role: "banner",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "max-w-container mx-auto px-4 flex items-center justify-between h-16",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					href: localizedPath("/", locale),
					className: "flex items-center gap-2 shrink-0 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md",
					children: [/* @__PURE__ */ jsx(OptimizedImage, {
						src: logoSrc,
						alt: logoAlt,
						width: 32,
						height: 32,
						lazy: false,
						fallbackSrc: "/icon.png",
						className: "h-8 w-auto object-contain"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xl font-bold text-primary-900 tracking-tight group-hover:text-primary-700 transition-colors",
						children: trans("app_name")
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden md:flex items-center gap-6",
					"aria-label": isRtl ? "التنقل الرئيسي" : "Main Navigation",
					children: NAV_ITEMS.map((item) => {
						const active = isActive(item.href);
						return /* @__PURE__ */ jsxs(Link, {
							href: localizedPath(item.href, locale),
							className: `text-sm transition-colors py-1 border-b-2 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded ${active ? "text-primary-900 border-primary-900 font-semibold" : "text-secondary-800 border-transparent hover:text-primary-900 hover:border-primary-900/50"}`,
							children: [trans(item.key), item.key === "compare" && compareCount > 0 && /* @__PURE__ */ jsx("span", {
								className: "bg-primary-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center mb-0.5",
								"aria-label": `${compareCount} ${isRtl ? "عناصر للمقارنة" : "items to compare"}`,
								children: compareCount
							})]
						}, item.key);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						href: `/locale/${isRtl ? "en" : "ar"}`,
						method: "get",
						as: "button",
						className: "text-xs font-medium text-secondary-700 hover:text-primary-900 border border-secondary-200 rounded-lg px-2.5 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500",
						"aria-label": isRtl ? "تغيير اللغة إلى الإنجليزية" : "Switch language to Arabic",
						children: isRtl ? trans("lang_en") : trans("lang_ar")
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setMenuOpen((prev) => !prev),
						className: "md:hidden text-secondary-700 hover:text-primary-900 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
						"aria-label": trans("toggle_menu"),
						"aria-expanded": menuOpen,
						"aria-controls": "mobile-navigation",
						children: /* @__PURE__ */ jsx("svg", {
							className: "w-6 h-6",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.5,
							"aria-hidden": "true",
							children: menuOpen ? /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M6 18L18 6M6 6l12 12"
							}) : /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							})
						})
					})]
				})
			]
		}), menuOpen && /* @__PURE__ */ jsx("nav", {
			id: "mobile-navigation",
			className: "md:hidden bg-white border-t border-secondary-100 px-4 py-4 flex flex-col gap-3",
			"aria-label": isRtl ? "تنقل الهاتف" : "Mobile Navigation",
			children: NAV_ITEMS.map((item) => {
				const active = isActive(item.href);
				return /* @__PURE__ */ jsxs(Link, {
					href: localizedPath(item.href, locale),
					className: `block py-2 px-3 text-base rounded-lg transition-colors flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 ${active ? "text-primary-900 bg-primary-50 font-medium" : "text-secondary-800 hover:text-primary-900 hover:bg-secondary-50"}`,
					onClick: () => setMenuOpen(false),
					children: [trans(item.key), item.key === "compare" && compareCount > 0 && /* @__PURE__ */ jsx("span", {
						className: "bg-primary-900 text-white text-xs font-bold rounded-full px-2 py-0.5",
						children: compareCount
					})]
				}, item.key);
			})
		})]
	});
}
//#endregion
//#region resources/js/Hooks/useCompare.js
var COMPARE_KEY_PREFIX = "family_home_compare_list_";
var MAX_COMPARE_ITEMS = 4;
function getCompareKey(type = "unit") {
	return `${COMPARE_KEY_PREFIX}${type}`;
}
function getStoredCompareList(type = "unit") {
	if (typeof window === "undefined") return [];
	try {
		const key = getCompareKey(type);
		let stored = localStorage.getItem(key);
		if (!stored && type === "unit") {
			const legacy = localStorage.getItem("family_home_compare_list");
			if (legacy) {
				localStorage.setItem(key, legacy);
				localStorage.removeItem("family_home_compare_list");
				stored = legacy;
			}
		}
		return stored ? JSON.parse(stored) : [];
	} catch (e) {
		console.error("Failed to parse compare list", e);
		return [];
	}
}
function useCompare(type = "unit") {
	const [compareList, setCompareList] = useState(() => getStoredCompareList(type));
	useEffect(() => {
		setCompareList(getStoredCompareList(type));
		const handleSync = (e) => {
			if (!e.detail || e.detail.type === type) setCompareList(getStoredCompareList(type));
		};
		window.addEventListener("compareListUpdated", handleSync);
		const handleStorage = (e) => {
			if (e.key === getCompareKey(type)) setCompareList(getStoredCompareList(type));
		};
		window.addEventListener("storage", handleStorage);
		return () => {
			window.removeEventListener("compareListUpdated", handleSync);
			window.removeEventListener("storage", handleStorage);
		};
	}, [type]);
	const toggleCompare = (id) => {
		const currentList = getStoredCompareList(type);
		let newList;
		if (currentList.includes(id)) newList = currentList.filter((item) => item !== id);
		else {
			if (currentList.length >= MAX_COMPARE_ITEMS) return false;
			newList = [...currentList, id];
		}
		localStorage.setItem(getCompareKey(type), JSON.stringify(newList));
		window.dispatchEvent(new CustomEvent("compareListUpdated", { detail: { type } }));
		return true;
	};
	const clearCompare = () => {
		localStorage.removeItem(getCompareKey(type));
		window.dispatchEvent(new CustomEvent("compareListUpdated", { detail: { type } }));
	};
	return {
		compareList,
		toggleCompare,
		clearCompare,
		maxItems: MAX_COMPARE_ITEMS
	};
}
//#endregion
//#region resources/js/Components/Features/CompareBar.jsx
function CompareBar() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { compareList: unitList, clearCompare: clearUnits } = useCompare("unit");
	const { compareList: projectList, clearCompare: clearProjects } = useCompare("project");
	const unitCount = unitList.length;
	const projectCount = projectList.length;
	const total = unitCount + projectCount;
	if (total === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "fixed bottom-0 inset-x-0 z-50 p-3 pointer-events-none flex justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-secondary-950 text-white rounded-2xl shadow-2xl pointer-events-auto px-4 py-3 flex items-center gap-4 sm:gap-6 max-w-2xl w-full border border-secondary-800 animate-fade-in",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex -space-x-1.5 rtl:space-x-reverse",
					children: [
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ jsx("div", {
						className: `w-7 h-7 rounded-full border-2 border-secondary-950 flex items-center justify-center text-[10px] font-bold transition-colors ${i <= total ? "bg-primary-900 text-white" : "bg-secondary-800 text-secondary-500"}`,
						children: i <= total ? i : "+"
					}, i))
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-sm leading-tight",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold",
						children: total
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-secondary-400 text-xs ms-1.5",
						children: [
							unitCount > 0 && `${unitCount} ${trans("units")}`,
							unitCount > 0 && projectCount > 0 && " + ",
							projectCount > 0 && `${projectCount} ${trans("projects")}`
						]
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 ms-auto",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => {
						clearUnits();
						clearProjects();
					},
					className: "p-1.5 text-secondary-400 hover:text-white transition-colors rounded-lg hover:bg-secondary-800",
					title: trans("clear"),
					children: /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 2,
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M6 18L18 6M6 6l12 12"
						})
					})
				}), /* @__PURE__ */ jsx(Link, {
					href: localizedPath(unitCount > 0 ? `/compare?type=unit&ids=${unitList.join(",")}` : `/compare?type=project&ids=${projectList.join(",")}`, locale),
					className: "px-3.5 py-1.5 bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap",
					children: trans("compare")
				})]
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/Layout/Footer.jsx
var QUICK_LINKS = [
	{
		key: "home",
		href: "/"
	},
	{
		key: "projects",
		href: "/projects"
	},
	{
		key: "units",
		href: "/units"
	},
	{
		key: "deals",
		href: "/units/deals"
	},
	{
		key: "articles",
		href: "/articles"
	},
	{
		key: "about",
		href: "/about"
	},
	{
		key: "contact",
		href: "/contact"
	}
];
var SOCIAL_ICONS = {
	social_facebook: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }),
	social_instagram: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" }),
	social_twitter: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }),
	social_linkedin: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" })
};
function Footer() {
	const { locale, settings } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const socialLinks = [
		{
			key: "social_facebook",
			url: settings?.social_facebook,
			label: trans("social_facebook")
		},
		{
			key: "social_instagram",
			url: settings?.social_instagram,
			label: trans("social_instagram")
		},
		{
			key: "social_twitter",
			url: settings?.social_twitter,
			label: trans("social_twitter")
		},
		{
			key: "social_linkedin",
			url: settings?.social_linkedin,
			label: trans("social_linkedin")
		}
	].filter((s) => s.url);
	return /* @__PURE__ */ jsxs("footer", {
		dir: isRtl ? "rtl" : "ltr",
		className: "bg-secondary-950 text-white",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "max-w-container mx-auto px-4 py-12",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-8",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-secondary-300 uppercase tracking-wider mb-4",
							children: trans("quick_links")
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2.5",
							children: QUICK_LINKS.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								href: localizedPath(item.href, locale),
								className: "text-sm text-secondary-400 hover:text-white transition-colors",
								children: trans(item.key)
							}) }, item.key))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-secondary-300 uppercase tracking-wider mb-4",
							children: trans("contact_info")
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-2.5 text-sm text-secondary-400",
							children: [
								settings?.company_phone && /* @__PURE__ */ jsxs("a", {
									href: `tel:${settings.company_phone.replace(/\s+/g, "")}`,
									className: "flex items-center gap-2 hover:text-white transition-colors w-fit",
									title: trans("call_us"),
									children: [/* @__PURE__ */ jsx("svg", {
										className: "w-4 h-4 shrink-0 text-primary-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 1.5,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
										})
									}), /* @__PURE__ */ jsx("span", {
										dir: "ltr",
										children: settings.company_phone
									})]
								}),
								settings?.company_whatsapp && /* @__PURE__ */ jsxs("a", {
									href: `https://wa.me/${settings.company_whatsapp.replace(/[^0-9]/g, "")}`,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 hover:text-green-400 transition-colors w-fit",
									title: trans("whatsapp_chat"),
									children: [/* @__PURE__ */ jsx("svg", {
										className: "w-4 h-4 shrink-0 text-green-500 fill-current",
										viewBox: "0 0 24 24",
										children: /* @__PURE__ */ jsx("path", { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" })
									}), /* @__PURE__ */ jsx("span", {
										dir: "ltr",
										children: settings.company_whatsapp
									})]
								}),
								settings?.company_email && /* @__PURE__ */ jsxs("a", {
									href: `mailto:${settings.company_email}`,
									className: "flex items-center gap-2 hover:text-white transition-colors w-fit",
									title: trans("send_email"),
									children: [/* @__PURE__ */ jsx("svg", {
										className: "w-4 h-4 shrink-0 text-primary-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 1.5,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										})
									}), /* @__PURE__ */ jsx("span", {
										dir: "ltr",
										children: settings.company_email
									})]
								}),
								settings?.company_address && /* @__PURE__ */ jsxs("p", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ jsxs("svg", {
										className: "w-4 h-4 shrink-0 mt-0.5 text-primary-400",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 1.5,
										children: [/* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
										}), /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
										})]
									}), /* @__PURE__ */ jsx("span", { children: settings.company_address })]
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-secondary-300 uppercase tracking-wider mb-4",
							children: trans("follow_us")
						}), /* @__PURE__ */ jsx("div", {
							className: "flex gap-3",
							children: socialLinks.map((social) => /* @__PURE__ */ jsx("a", {
								href: social.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "w-9 h-9 rounded-full bg-secondary-800 hover:bg-primary-900 flex items-center justify-center transition-colors",
								"aria-label": social.label,
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-4.5 h-4.5 text-white fill-current",
									viewBox: "0 0 24 24",
									children: SOCIAL_ICONS[social.key]
								})
							}, social.key))
						})] })
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-t border-secondary-800 py-4",
				children: /* @__PURE__ */ jsxs("p", {
					className: "text-center text-xs text-secondary-500",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" ",
						trans("app_name"),
						". ",
						trans("all_rights_reserved")
					]
				})
			}),
			/* @__PURE__ */ jsx(CompareBar, {})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/SeoHead.jsx
function SeoHead({ title, description, keywords, ogImage, ogType = "website", canonical, pageKey, jsonLd, hreflang }) {
	const { locale, seo_pages, appUrl } = usePage().props;
	const { url } = usePage();
	const siteName = useTrans(locale)("site_title");
	const isRtl = locale === "ar";
	const cleanPath = url.split("?")[0];
	const pathWithoutLocale = cleanPath.replace(/^\/(ar|en)(\/|$)/, "/");
	const baseUrl = appUrl || (typeof window !== "undefined" ? window.location.origin : "");
	const activeKey = pageKey || {
		"/": "home",
		"/about": "about",
		"/contact": "contact",
		"/units": "units_index",
		"/projects": "projects_index",
		"/deals": "deals",
		"/articles": "articles_index",
		"/comparison": "comparison"
	}[pathWithoutLocale] || null;
	const pageSeo = activeKey && seo_pages?.[activeKey] ? seo_pages[activeKey] : null;
	const finalTitle = pageSeo ? isRtl ? pageSeo.meta_title_ar || title : pageSeo.meta_title_en || title : title;
	const finalDescription = pageSeo ? isRtl ? pageSeo.meta_description_ar || description : pageSeo.meta_description_en || description : description;
	const finalKeywords = pageSeo ? isRtl ? Array.isArray(pageSeo.meta_keywords_ar) && pageSeo.meta_keywords_ar.length > 0 ? pageSeo.meta_keywords_ar.join(", ") : keywords : Array.isArray(pageSeo.meta_keywords_en) && pageSeo.meta_keywords_en.length > 0 ? pageSeo.meta_keywords_en.join(", ") : keywords : keywords;
	const finalCanonical = (canonical || (baseUrl ? `${baseUrl}${cleanPath}` : cleanPath)).split("?")[0];
	const urlAr = hreflang?.ar || baseUrl + (pathWithoutLocale === "/" ? "/ar" : `/ar${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
	const urlEn = hreflang?.en || baseUrl + (pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`);
	return /* @__PURE__ */ jsxs(Head, { children: [
		finalTitle && /* @__PURE__ */ jsx("title", { children: finalTitle }),
		finalDescription && /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: finalDescription
		}),
		finalKeywords && /* @__PURE__ */ jsx("meta", {
			name: "keywords",
			content: finalKeywords
		}),
		finalTitle && /* @__PURE__ */ jsx("meta", {
			property: "og:title",
			content: finalTitle
		}),
		finalDescription && /* @__PURE__ */ jsx("meta", {
			property: "og:description",
			content: finalDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:type",
			content: ogType
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:site_name",
			content: siteName
		}),
		ogImage && /* @__PURE__ */ jsx("meta", {
			property: "og:image",
			content: ogImage
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:url",
			content: finalCanonical
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:card",
			content: "summary_large_image"
		}),
		finalTitle && /* @__PURE__ */ jsx("meta", {
			name: "twitter:title",
			content: finalTitle
		}),
		finalDescription && /* @__PURE__ */ jsx("meta", {
			name: "twitter:description",
			content: finalDescription
		}),
		ogImage && /* @__PURE__ */ jsx("meta", {
			name: "twitter:image",
			content: ogImage
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "canonical",
			href: finalCanonical
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "alternate",
			hreflang: "ar",
			href: urlAr
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "alternate",
			hreflang: "en",
			href: urlEn
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "alternate",
			hreflang: "x-default",
			href: urlAr
		}),
		jsonLd && /* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			children: JSON.stringify(jsonLd)
		})
	] });
}
//#endregion
//#region resources/js/Pages/Public/About.jsx
var About_exports = /* @__PURE__ */ __exportAll({ default: () => About });
function About({ page }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const content = locale === "ar" ? page?.content_ar : page?.content_en;
	const images = page?.images ?? [];
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("about")} - ${trans("site_title")}`,
				description: trans("about_description"),
				ogImage: page?.images?.[0],
				canonical: usePage().url
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-3xl mx-auto px-4 py-12 w-full",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold text-secondary-950 mb-8",
						children: trans("about")
					}),
					images.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8",
						children: images.map((img, i) => /* @__PURE__ */ jsx("img", {
							src: `/storage/${img}`,
							alt: trans("about_image"),
							className: "w-full h-48 object-cover rounded-xl",
							loading: "lazy"
						}, i))
					}),
					content ? /* @__PURE__ */ jsx("div", {
						className: "prose prose-sm sm:prose-base max-w-none text-secondary-800 leading-relaxed",
						dangerouslySetInnerHTML: { __html: content }
					}) : /* @__PURE__ */ jsx("p", {
						className: "text-muted text-sm",
						children: trans("no_data")
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/UnitCard.jsx
var PLACEHOLDER$5 = "/images/fallback.jpg";
function SkeletonCard$2() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100/50",
		children: [/* @__PURE__ */ jsx("div", { className: "skeleton h-64 w-full" }), /* @__PURE__ */ jsxs("div", {
			className: "p-5 space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", { className: "skeleton h-5 w-3/4 rounded" }),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-1/2 rounded" }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex gap-3",
					children: [
						/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-16 rounded" }),
						/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-16 rounded" }),
						/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-16 rounded" })
					]
				}),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-10 w-full rounded-xl mt-4" })
			]
		})]
	});
}
function UnitCard({ unit, loading = false }) {
	const { locale, settings } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { compareList, toggleCompare, maxItems } = useCompare("unit");
	if (loading) return /* @__PURE__ */ jsx(SkeletonCard$2, {});
	const mainImage = unit?.images?.find((img) => img.is_main || img.is_primary) || unit?.images?.[0];
	const thumbnail = mainImage?.thumb_url || mainImage?.url || (mainImage?.path ? mainImage.path.startsWith("http") || mainImage.path.startsWith("/") ? mainImage.path : `/storage/${mainImage.path}` : PLACEHOLDER$5);
	const isFeatured = (unit?.priority_points ?? 0) > 0;
	const isCompared = compareList.includes(unit?.id);
	const uploaderWhatsapp = unit?.project?.user?.profile?.whatsapp || unit?.project?.user?.whatsapp || unit?.user?.profile?.whatsapp || unit?.user?.whatsapp;
	const defaultWhatsapp = settings?.company_whatsapp || settings?.whatsapp_number || settings?.phone || "201000000000";
	const whatsappPhone = uploaderWhatsapp || defaultWhatsapp;
	const whatsappMsg = encodeURIComponent(trans("unit_whatsapp_inquiry", { name: unit?.name || "" }));
	const whatsappLink = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}?text=${whatsappMsg}`;
	const areaName = unit.area?.name || (isRtl ? "مصر" : "Egypt");
	const imageAlt = unit.alt_text || `${unit.name || (isRtl ? "عقار" : "Property")} ${isRtl ? "في" : "in"} ${areaName} - ${trans("app_name")}`;
	return /* @__PURE__ */ jsxs("article", {
		dir: isRtl ? "rtl" : "ltr",
		className: "bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-secondary-100/70 hover:-translate-y-1.5 flex flex-col justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
			href: localizedPath(`/units/${unit.slug}`, locale),
			className: "block relative overflow-hidden aspect-[4/3] focus:outline-none focus:ring-2 focus:ring-primary-500",
			children: [
				/* @__PURE__ */ jsx(OptimizedImage, {
					src: thumbnail,
					alt: imageAlt,
					width: 400,
					height: 300,
					lazy: true,
					fallbackSrc: PLACEHOLDER$5,
					className: "w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
				}),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-secondary-950/60 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" }),
				/* @__PURE__ */ jsxs("div", {
					className: "absolute top-3 start-3 flex flex-wrap gap-1.5 z-10",
					children: [isFeatured && /* @__PURE__ */ jsxs("span", {
						className: "bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-3 h-3 fill-current text-white",
							viewBox: "0 0 20 20",
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
						}), trans("featured")]
					}), /* @__PURE__ */ jsx("span", {
						className: "bg-secondary-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm",
						children: trans(unit.transaction === "rent" ? "rent" : "sale")
					})]
				}),
				unit.area?.name && /* @__PURE__ */ jsxs("span", {
					className: "absolute bottom-3 start-3 text-white text-xs font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md flex items-center gap-1",
					children: [/* @__PURE__ */ jsxs("svg", {
						className: "w-3.5 h-3.5 text-primary-400",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 2,
						"aria-hidden": "true",
						children: [/* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
						}), /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
						})]
					}), unit.area.name]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsx(Link, {
					href: localizedPath(`/units/${unit.slug}`, locale),
					className: "focus:outline-none focus:ring-2 focus:ring-primary-500 rounded",
					children: /* @__PURE__ */ jsx("h2", {
						className: "text-base font-bold text-secondary-950 truncate mb-1.5 group-hover:text-primary-900 transition-colors",
						children: unit.name
					})
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-xs font-medium text-secondary-500 mb-3 flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("span", { children: unit.type?.name || unit.type_name || "" }), unit.finishing_type && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "text-secondary-300",
						"aria-hidden": "true",
						children: "•"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-secondary-600",
						children: unit.finishing_type.name || unit.finishing_type
					})] })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-2xl font-black text-primary-900 tracking-tight",
						children: Number(unit.price).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded ms-2",
						children: trans("currency_egp")
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-2 text-xs font-medium text-secondary-600 bg-surface/70 p-2.5 rounded-xl border border-secondary-100",
					children: [unit.area_sqm && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 text-primary-700 shrink-0",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.75,
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
							})
						}), /* @__PURE__ */ jsxs("span", { children: [
							unit.area_sqm,
							" ",
							trans("unit_sqm")
						] })]
					}), unit.rooms && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 text-primary-700 shrink-0",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1.75,
							"aria-hidden": "true",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							})
						}), /* @__PURE__ */ jsxs("span", { children: [
							unit.rooms,
							" ",
							trans("rooms")
						] })]
					})]
				})
			]
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-secondary-100/60 mt-2",
			children: [/* @__PURE__ */ jsxs("button", {
				onClick: (e) => {
					e.preventDefault();
					if (!isCompared && compareList.length >= maxItems) {
						alert(locale === "ar" ? `لا يمكنك مقارنة أكثر من ${maxItems} وحدات` : `You cannot compare more than ${maxItems} units`);
						return;
					}
					toggleCompare(unit.id);
				},
				"aria-label": `${trans("compare")} ${unit.name}`,
				"aria-pressed": isCompared,
				className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${isCompared ? "text-primary-900 bg-primary-50 border border-primary-200" : "text-secondary-600 bg-secondary-50 hover:bg-secondary-100 hover:text-secondary-900"}`,
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-3.5 h-3.5",
					fill: "none",
					viewBox: "0 0 24 24",
					stroke: "currentColor",
					strokeWidth: 2,
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", {
						strokeLinecap: "round",
						strokeLinejoin: "round",
						d: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
					})
				}), isCompared ? trans("compared") : trans("compare")]
			}), /* @__PURE__ */ jsxs("a", {
				href: whatsappLink,
				target: "_blank",
				rel: "noopener noreferrer",
				onClick: (e) => e.stopPropagation(),
				"aria-label": `${trans("inquire")} ${unit.name} ${trans("contact_via_whatsapp")}`,
				className: "flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
				title: trans("contact_via_whatsapp"),
				children: [/* @__PURE__ */ jsx("svg", {
					className: "w-4 h-4 fill-current",
					viewBox: "0 0 24 24",
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx("path", { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" })
				}), trans("inquire")]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/UI/Pagination.jsx
function Pagination({ meta, links: routeLinks }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	if (!meta || meta.last_page <= 1) return null;
	const { current_page, last_page, per_page, total } = meta;
	const preserveState = {
		preserveState: true,
		preserveScroll: true
	};
	const range = 2;
	const pages = [];
	const start = Math.max(1, current_page - range);
	const end = Math.min(last_page, current_page + range);
	for (let i = start; i <= end; i++) pages.push(i);
	function buildUrl(page) {
		const params = new URLSearchParams(window.location.search);
		params.set("page", page);
		return window.location.pathname + "?" + params.toString();
	}
	return /* @__PURE__ */ jsxs("nav", {
		dir: isRtl ? "rtl" : "ltr",
		className: "flex items-center justify-center gap-1 mt-8",
		"aria-label": isRtl ? "صفحات النتائج" : "Pagination",
		children: [
			current_page > 1 ? /* @__PURE__ */ jsx(Link, {
				href: buildUrl(current_page - 1),
				className: "px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors",
				...preserveState,
				children: trans("previous")
			}) : /* @__PURE__ */ jsx("span", {
				className: "px-3 py-2 text-sm text-secondary-300 cursor-not-allowed",
				children: trans("previous")
			}),
			start > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
				href: buildUrl(1),
				className: "px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors",
				...preserveState,
				children: "1"
			}), start > 2 && /* @__PURE__ */ jsx("span", {
				className: "px-2 text-secondary-400 text-sm",
				children: "..."
			})] }),
			pages.map((page) => /* @__PURE__ */ jsx(Link, {
				href: buildUrl(page),
				className: `px-3 py-2 text-sm rounded-lg transition-colors ${page === current_page ? "bg-primary-900 text-white" : "text-secondary-700 hover:bg-surface"}`,
				...preserveState,
				children: page
			}, page)),
			end < last_page && /* @__PURE__ */ jsxs(Fragment, { children: [end < last_page - 1 && /* @__PURE__ */ jsx("span", {
				className: "px-2 text-secondary-400 text-sm",
				children: "..."
			}), /* @__PURE__ */ jsx(Link, {
				href: buildUrl(last_page),
				className: "px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors",
				...preserveState,
				children: last_page
			})] }),
			current_page < last_page ? /* @__PURE__ */ jsx(Link, {
				href: buildUrl(current_page + 1),
				className: "px-3 py-2 text-sm text-secondary-700 hover:bg-surface rounded-lg transition-colors",
				...preserveState,
				children: trans("next")
			}) : /* @__PURE__ */ jsx("span", {
				className: "px-3 py-2 text-sm text-secondary-300 cursor-not-allowed",
				children: trans("next")
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Agents/Show.jsx
var Show_exports$3 = /* @__PURE__ */ __exportAll({ default: () => Show });
function Show({ agent, units, locale }) {
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const avatarSrc = agent.avatar ? agent.avatar.startsWith("http") || agent.avatar.startsWith("/storage") ? agent.avatar : `/storage/${agent.avatar}` : null;
	const channels = [
		{
			key: "phone",
			url: agent.phone ? `tel:${agent.phone}` : null,
			label: agent.phone
		},
		{
			key: "whatsapp",
			url: agent.whatsapp ? `https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, "")}` : null,
			label: agent.whatsapp
		},
		{
			key: "facebook",
			url: agent.facebook || null,
			label: trans("facebook", {}, "admin")
		},
		{
			key: "linkedin",
			url: agent.linkedin || null,
			label: trans("social_linkedin", {}, "admin")
		}
	].filter((c) => c.url);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background flex flex-col font-sans text-secondary-900 selection:bg-primary-200 selection:text-primary-900",
		children: [
			/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: `${agent.name} - ${trans("app_name")}` }) }),
			/* @__PURE__ */ jsx(Header, { locale }),
			/* @__PURE__ */ jsxs("div", {
				dir: isRtl ? "rtl" : "ltr",
				className: "container py-8 sm:py-12",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl shadow-sm border border-secondary-100 p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-8",
						children: [/* @__PURE__ */ jsx("div", {
							className: "shrink-0",
							children: avatarSrc ? /* @__PURE__ */ jsx("img", {
								src: avatarSrc,
								alt: agent.name,
								className: "w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-md border-4 border-white"
							}) : /* @__PURE__ */ jsx("div", {
								className: "w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 font-bold text-4xl sm:text-5xl border-4 border-white shadow-md",
								children: agent.name?.charAt(0)?.toUpperCase() || "?"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 text-center sm:text-start space-y-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl font-bold text-secondary-950",
								children: agent.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-secondary-600 mt-1",
								children: trans(agent.role)
							})] }), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2",
								children: channels.map((ch) => /* @__PURE__ */ jsxs("a", {
									href: ch.url,
									target: ch.key !== "phone" ? "_blank" : void 0,
									rel: ch.key !== "phone" ? "noopener noreferrer" : void 0,
									className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${ch.key === "whatsapp" ? "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20" : ch.key === "facebook" ? "bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20" : ch.key === "linkedin" ? "bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20" : "bg-primary-50 text-primary-900 hover:bg-primary-100"}`,
									children: [
										ch.key === "phone" && /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4 shrink-0",
											fill: "none",
											viewBox: "0 0 24 24",
											stroke: "currentColor",
											strokeWidth: 2,
											children: /* @__PURE__ */ jsx("path", {
												strokeLinecap: "round",
												strokeLinejoin: "round",
												d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											})
										}),
										ch.key === "whatsapp" && /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4 shrink-0",
											fill: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
										}),
										ch.key === "facebook" && /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4 shrink-0",
											fill: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" })
										}),
										ch.key === "linkedin" && /* @__PURE__ */ jsx("svg", {
											className: "w-4 h-4 shrink-0",
											fill: "currentColor",
											viewBox: "0 0 24 24",
											children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" })
										}),
										/* @__PURE__ */ jsx("span", {
											dir: "ltr",
											children: ch.label
										})
									]
								}, ch.key))
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mb-6 flex items-center justify-between",
						children: /* @__PURE__ */ jsxs("h2", {
							className: "text-xl sm:text-2xl font-bold text-secondary-950",
							children: [
								trans("agent_units", {}, "units") || trans("units_count", {}, "units"),
								" (",
								units.total,
								")"
							]
						})
					}),
					units.data.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
						children: units.data.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
					}), units.last_page > 1 && /* @__PURE__ */ jsx("div", {
						className: "mt-10 flex justify-center",
						children: /* @__PURE__ */ jsx(Pagination, { links: units.links })
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "text-center py-20 bg-white rounded-2xl border border-secondary-100",
						children: [
							/* @__PURE__ */ jsx("svg", {
								className: "w-16 h-16 mx-auto text-secondary-300 mb-4",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 1.5,
									d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-semibold text-secondary-950 mb-2",
								children: trans("no_units", {}, "units")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-secondary-600",
								children: trans("agent_no_units", {}, "units") || trans("no_units", {}, "units")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, { locale })
		]
	});
}
//#endregion
//#region resources/js/Components/UI/ArticleCard.jsx
var PLACEHOLDER$4 = "/images/fallback.jpg";
function SkeletonCard$1() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl border border-secondary-200/60 shadow-xs overflow-hidden h-full flex flex-col animate-pulse",
		children: [/* @__PURE__ */ jsx("div", { className: "skeleton h-48 w-full bg-secondary-100" }), /* @__PURE__ */ jsxs("div", {
			className: "p-5 flex-1 flex flex-col space-y-3",
			children: [
				/* @__PURE__ */ jsx("div", { className: "skeleton h-3 w-20 rounded-full bg-secondary-100" }),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-5 w-5/6 rounded bg-secondary-100" }),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-full rounded bg-secondary-100" }),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-2/3 rounded bg-secondary-100" })
			]
		})]
	});
}
function ArticleCard({ article, loading = false }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	if (loading) return /* @__PURE__ */ jsx(SkeletonCard$1, {});
	const headerImg = article?.images?.find((img) => img.position === "header") || article?.images?.[0];
	const thumbnail = headerImg?.thumb_url || headerImg?.url || (headerImg?.path ? headerImg.path.startsWith("http") || headerImg.path.startsWith("/") ? headerImg.path : `/storage/${headerImg.path}` : PLACEHOLDER$4);
	const imageAlt = article.alt_text || `${article.title} - ${trans("app_name")}`;
	const categoryName = article.category ? isRtl ? article.category.name_ar : article.category.name_en : null;
	const formattedDate = article.published_at ? new Date(article.published_at).toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	}) : "";
	return /* @__PURE__ */ jsxs(Link, {
		href: localizedPath(`/articles/${article.slug}`, locale),
		className: "group bg-white rounded-2xl border border-secondary-200/80 shadow-xs hover:shadow-md hover:border-primary-900/40 transition-all duration-300 flex flex-col h-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative h-48 w-full overflow-hidden bg-secondary-100",
			children: [/* @__PURE__ */ jsx(OptimizedImage, {
				src: thumbnail,
				alt: imageAlt,
				width: 400,
				height: 300,
				lazy: true,
				fallbackSrc: PLACEHOLDER$4,
				className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
			}), categoryName && /* @__PURE__ */ jsx("span", {
				className: "absolute top-3 start-3 px-2.5 py-1 text-xs font-semibold text-secondary-900 bg-white/90 backdrop-blur-sm rounded-lg shadow-xs border border-white/60",
				children: categoryName
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "p-5 flex-1 flex flex-col justify-between",
			children: /* @__PURE__ */ jsxs("div", { children: [
				formattedDate && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-secondary-500 mb-2",
					children: formattedDate
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-secondary-950 group-hover:text-primary-900 transition-colors line-clamp-2 leading-snug mb-2",
					children: article.title
				}),
				article.excerpt && /* @__PURE__ */ jsx("p", {
					className: "text-xs sm:text-sm text-secondary-600 line-clamp-2 leading-relaxed",
					children: article.excerpt
				})
			] })
		})]
	});
}
//#endregion
//#region resources/js/Pages/Public/Articles/Index.jsx
var Index_exports$2 = /* @__PURE__ */ __exportAll({ default: () => ArticlesIndex });
function ArticlesIndex({ articles, categories, currentCategory }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isLoading = !articles;
	const hasArticles = articles?.data?.length > 0;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${currentCategory ? (isRtl ? currentCategory.name_ar : currentCategory.name_en) + " - " : ""}${trans("articles")} - ${trans("site_title")}`,
				description: trans("articles_description"),
				canonical: window.location.href
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 sm:py-10 w-full",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-6",
						children: /* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-3xl font-bold text-secondary-950",
							children: currentCategory ? isRtl ? currentCategory.name_ar : currentCategory.name_en : trans("articles")
						})
					}),
					categories?.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "mb-8 overflow-x-auto pb-2 scrollbar-none",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 min-w-max",
							children: [/* @__PURE__ */ jsx(Link, {
								href: localizedPath("/articles", locale),
								className: `px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${!currentCategory ? "bg-primary-900 text-white" : "bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900/40"}`,
								children: trans("all")
							}), categories.map((cat) => {
								const isActive = currentCategory?.id === cat.id;
								return /* @__PURE__ */ jsx(Link, {
									href: localizedPath(`/articles?category=${cat.slug}`, locale),
									className: `px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${isActive ? "bg-primary-900 text-white" : "bg-white text-secondary-700 border border-secondary-200 hover:border-primary-900/40"}`,
									children: isRtl ? cat.name_ar : cat.name_en
								}, cat.id);
							})]
						})
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(ArticleCard, { loading: true }, i))
					}) : hasArticles ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: articles.data.map((article) => /* @__PURE__ */ jsx(ArticleCard, { article }, article.id))
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-10 flex justify-center",
						children: /* @__PURE__ */ jsx(Pagination, {
							meta: articles,
							links: articles.links
						})
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "text-center py-16 bg-white rounded-2xl border border-secondary-200/60 p-6 max-w-md mx-auto",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-secondary-600 text-sm mb-4",
							children: trans("no_results")
						}), /* @__PURE__ */ jsx(Link, {
							href: localizedPath("/articles", locale),
							className: "inline-flex items-center px-4 py-2 bg-primary-900 text-white rounded-xl text-sm font-medium hover:bg-primary-950 transition-colors",
							children: isRtl ? "عرض كل المقالات" : "View All Articles"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Articles/Show.jsx
var Show_exports$2 = /* @__PURE__ */ __exportAll({ default: () => ArticleShow });
function ArticleShow({ article, relatedArticles }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const headerImage = article?.images?.find((img) => img.position === "header") || article?.images?.[0];
	const topImages = article?.images?.filter((img) => img.position === "top") || [];
	const middleImages = article?.images?.filter((img) => img.position === "middle") || [];
	const bottomImages = article?.images?.filter((img) => img.position === "bottom") || [];
	const headerImgUrl = headerImage?.url || (headerImage?.path ? headerImage.path.startsWith("http") || headerImage.path.startsWith("/") ? headerImage.path : `/storage/${headerImage.path}` : null);
	const categoryName = article?.category ? isRtl ? article.category.name_ar : article.category.name_en : null;
	const formattedDate = article?.published_at ? new Date(article.published_at).toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "";
	const jsonLd = useMemo(() => {
		if (!article) return null;
		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: article.title,
			description: article.excerpt || article.meta_description,
			image: headerImgUrl,
			datePublished: article.published_at,
			dateModified: article.updated_at,
			author: {
				"@type": "Organization",
				name: "Family Home"
			}
		};
	}, [article, headerImgUrl]);
	if (!article) return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 flex items-center justify-center py-16",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-secondary-600 text-sm mb-4",
					children: trans("no_results")
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
	let parsedContent = article.content || "";
	middleImages.forEach((img, index) => {
		const shortcodeEn = `[image:${index + 1}]`;
		const shortcodeAr = `[صورة:${index + 1}]`;
		const imageHtml = `<img src="${img.url || (img.path.startsWith("http") || img.path.startsWith("/") ? img.path : `/storage/${img.path}`)}" alt="${(img.alt_text || article.title || "").replace(/"/g, "&quot;")}" class="w-full h-auto rounded-2xl my-6 border border-secondary-200/60 object-cover" loading="lazy" />`;
		parsedContent = parsedContent.replaceAll(shortcodeEn, imageHtml);
		parsedContent = parsedContent.replaceAll(shortcodeAr, imageHtml);
	});
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${article?.title || ""} - ${trans("site_title")}`,
				description: article?.meta_description || article?.excerpt || "",
				keywords: article?.keywords || "",
				ogImage: headerImgUrl,
				ogType: "article",
				canonical: window.location.href
			}),
			jsonLd && /* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 sm:py-10 w-full",
				children: [/* @__PURE__ */ jsxs("article", {
					className: "max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: localizedPath("/articles", locale),
							className: "text-xs sm:text-sm font-medium text-secondary-600 hover:text-primary-900 transition-colors mb-6 inline-block",
							children: ["← ", trans("articles")]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs text-secondary-500 mb-3",
							children: [
								categoryName && /* @__PURE__ */ jsx("span", {
									className: "font-semibold text-primary-900 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100",
									children: categoryName
								}),
								categoryName && formattedDate && /* @__PURE__ */ jsx("span", { children: "•" }),
								formattedDate && /* @__PURE__ */ jsx("span", { children: formattedDate })
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-950 leading-snug mb-6",
							children: article.title
						}),
						topImages.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8",
							children: topImages.map((img) => /* @__PURE__ */ jsx("img", {
								src: img.path.startsWith("http") || img.path.startsWith("/") ? img.path : `/storage/${img.path}`,
								alt: img.alt_text || article.title,
								className: "w-full h-56 rounded-2xl object-cover border border-secondary-200/60",
								loading: "lazy"
							}, img.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "prose prose-base sm:prose-lg max-w-none text-secondary-800 leading-relaxed\n                            prose-headings:font-bold prose-headings:text-secondary-950 prose-headings:mt-8 prose-headings:mb-3\n                            prose-p:text-secondary-800 prose-p:leading-relaxed prose-p:mb-5\n                            prose-img:rounded-2xl prose-img:my-6 prose-img:w-full prose-img:object-cover\n                            prose-blockquote:border-s-4 prose-blockquote:border-primary-900 prose-blockquote:bg-secondary-50 prose-blockquote:p-4 prose-blockquote:rounded-e-xl prose-blockquote:text-secondary-900 prose-blockquote:not-italic\n                            prose-a:text-primary-900 prose-a:underline hover:prose-a:text-primary-950",
							dangerouslySetInnerHTML: { __html: parsedContent }
						}),
						bottomImages.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8",
							children: bottomImages.map((img) => /* @__PURE__ */ jsx("img", {
								src: img.path.startsWith("http") || img.path.startsWith("/") ? img.path : `/storage/${img.path}`,
								alt: img.alt_text || article.title,
								className: "w-full h-56 rounded-2xl object-cover border border-secondary-200/60",
								loading: "lazy"
							}, img.id))
						})
					]
				}), relatedArticles?.length > 0 && /* @__PURE__ */ jsxs("section", {
					className: "max-w-5xl mx-auto mt-16 pt-10 border-t border-secondary-200/80",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-secondary-950 mb-6",
						children: trans("read_more") || (isRtl ? "مقالات ذات صلة" : "Related Articles")
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: relatedArticles.slice(0, 3).map((related) => /* @__PURE__ */ jsx(ArticleCard, { article: related }, related.id))
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/Features/CompareSearch.jsx
function CompareSearch({ type, currentIds }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { toggleCompare, maxItems } = useCompare(type);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const wrapperRef = useRef(null);
	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}
		const timer = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await axios.get(localizedPath(`/compare/search?type=${type}&q=${encodeURIComponent(query)}`, locale));
				setResults(res.data || []);
				setIsOpen(true);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [query, type]);
	function handleAdd(item) {
		if (currentIds.includes(item.id)) return;
		if (currentIds.length >= maxItems) {
			setErrorMsg(locale === "ar" ? `لا يمكنك مقارنة أكثر من ${maxItems} عناصر` : `You cannot compare more than ${maxItems} items`);
			setTimeout(() => setErrorMsg(""), 3e3);
			return;
		}
		toggleCompare(item.id);
		setQuery("");
		setIsOpen(false);
	}
	return /* @__PURE__ */ jsxs("div", {
		ref: wrapperRef,
		className: "relative max-w-sm w-full",
		children: [
			errorMsg && /* @__PURE__ */ jsx("div", {
				className: "absolute -top-14 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm text-center shadow-lg animate-fade-in",
				children: errorMsg
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("input", {
					type: "text",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: trans("search") + "...",
					className: "w-full px-4 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
				}), loading && /* @__PURE__ */ jsx("div", {
					className: "absolute top-1/2 -translate-y-1/2 end-3",
					children: /* @__PURE__ */ jsxs("svg", {
						className: "animate-spin h-4 w-4 text-primary-900",
						viewBox: "0 0 24 24",
						children: [/* @__PURE__ */ jsx("circle", {
							className: "opacity-25",
							cx: "12",
							cy: "12",
							r: "10",
							stroke: "currentColor",
							strokeWidth: "4",
							fill: "none"
						}), /* @__PURE__ */ jsx("path", {
							className: "opacity-75",
							fill: "currentColor",
							d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						})]
					})
				})]
			}),
			isOpen && results.length > 0 && /* @__PURE__ */ jsx("ul", {
				className: "absolute z-50 w-full mt-1 bg-white border border-secondary-100 rounded-lg shadow-dropdown max-h-60 overflow-y-auto",
				children: results.map((item) => {
					const isAdded = currentIds.includes(item.id);
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
						onClick: () => handleAdd(item),
						disabled: isAdded,
						className: `w-full text-start px-4 py-2.5 text-sm transition-colors border-b border-secondary-100 last:border-b-0 ${isAdded ? "bg-secondary-50 text-secondary-400 cursor-not-allowed" : "hover:bg-secondary-50 text-secondary-800"}`,
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-semibold",
							children: item.name
						}), type === "unit" && (item.price || item.area_sqm || item.rooms) && /* @__PURE__ */ jsxs("span", {
							className: "block text-[11px] text-secondary-400 mt-0.5",
							children: [
								item.price && /* @__PURE__ */ jsxs("span", { children: [Number(item.price).toLocaleString(), " • "] }),
								item.area_sqm && /* @__PURE__ */ jsxs("span", { children: [item.area_sqm, " m² • "] }),
								item.rooms && /* @__PURE__ */ jsxs("span", { children: [
									item.rooms,
									" ",
									isRtl ? "غرف" : "rooms"
								] })
							]
						})]
					}) }, item.id);
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Comparison.jsx
var Comparison_exports = /* @__PURE__ */ __exportAll({ default: () => Comparison });
var PLACEHOLDER$3 = "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"%3E%3Crect fill=\"%23F0F0F0\" width=\"400\" height=\"300\"/%3E%3C/svg%3E";
function getItemImage(item) {
	const img = item.images?.[0];
	return img?.url || (img?.path ? img.path.startsWith("http") || img.path.startsWith("/storage") ? img.path : `/storage/${img.path}` : PLACEHOLDER$3);
}
function calcScore(item, best) {
	if (!best) return null;
	const price = Number(item.price);
	const area = Number(item.area_sqm);
	const rooms = Number(item.rooms);
	let score = 0;
	if (best.bestPrice && price) score += (1 - (price - best.bestPrice) / ((best.worstPrice || best.bestPrice) - best.bestPrice || 1)) * 40;
	else score += 20;
	if (best.bestArea && area) score += area / (best.bestArea || 1) * 30;
	else score += 15;
	if (best.bestRooms && rooms) score += rooms / (best.bestRooms || 1) * 30;
	else score += 15;
	return Math.round(Math.min(score, 100));
}
function getBestValues(items) {
	const prices = items.map((i) => Number(i.price)).filter((v) => !isNaN(v));
	const areas = items.map((i) => Number(i.area_sqm)).filter((v) => !isNaN(v));
	const rooms = items.map((i) => Number(i.rooms)).filter((v) => !isNaN(v));
	return {
		bestPrice: prices.length ? Math.min(...prices) : null,
		worstPrice: prices.length ? Math.max(...prices) : null,
		bestArea: areas.length ? Math.max(...areas) : null,
		bestRooms: rooms.length ? Math.max(...rooms) : null
	};
}
function ScoreBadge({ score }) {
	return /* @__PURE__ */ jsx("div", {
		className: `w-9 h-9 rounded-xl ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-secondary-400"} text-white flex items-center justify-center text-sm font-bold shadow-sm`,
		children: score
	});
}
function DetailRow({ label, value, isBest }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between py-1.5 px-3 rounded-lg text-xs odd:bg-secondary-50/50",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-secondary-500",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: `font-semibold text-end ${isBest ? "text-emerald-600" : "text-secondary-800"}`,
			children: value ?? "—"
		})]
	});
}
function FeatureBadge({ name }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-800 text-[10px] font-medium rounded-md border border-primary-100",
		children: [/* @__PURE__ */ jsx("svg", {
			className: "w-2.5 h-2.5 text-primary-600",
			fill: "none",
			viewBox: "0 0 24 24",
			stroke: "currentColor",
			strokeWidth: 2.5,
			children: /* @__PURE__ */ jsx("path", {
				strokeLinecap: "round",
				strokeLinejoin: "round",
				d: "M5 13l4 4L19 7"
			})
		}), name]
	});
}
function ComparisonSection({ type, title, items, maxItems, isRtl, locale, trans }) {
	const { compareList } = useCompare(type);
	const { toggleCompare } = useCompare(type);
	const hasItems = items?.length > 0;
	const best = hasItems ? getBestValues(items) : null;
	function handleRemove(id) {
		toggleCompare(id);
		const newIds = items.map((i) => i.id).filter((i) => i !== id);
		router.get(localizedPath(`/compare?type=${type}&ids=${newIds.join(",")}`, locale), {}, { preserveState: true });
	}
	if (!hasItems) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mb-10",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-bold text-secondary-950",
						children: title
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs text-secondary-500 bg-secondary-100 px-2.5 py-1 rounded-full font-medium",
						children: [
							items.length,
							" / ",
							maxItems
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: localizedPath(type === "unit" ? "/units" : "/projects", locale),
						className: "px-3 py-1.5 text-xs font-semibold text-primary-900 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-3.5 h-3.5",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M12 4.5v15m7.5-7.5h-15"
							})
						}), trans("browse")]
					}), /* @__PURE__ */ jsx(CompareSearch, {
						type,
						currentIds: items.map((i) => i.id)
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: `grid gap-4 ${items.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`,
				children: items.map((item) => {
					const price = Number(item.price);
					const area = Number(item.area_sqm);
					const ppsqm = price && area ? Math.round(price / area) : null;
					const score = type === "unit" ? calcScore(item, best) : null;
					const features = item.features || [];
					return /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow group",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative h-40 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: getItemImage(item),
									alt: item.name,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								}),
								score && /* @__PURE__ */ jsx("div", {
									className: "absolute top-2 end-2",
									children: /* @__PURE__ */ jsx(ScoreBadge, { score })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => handleRemove(item.id),
									className: "absolute top-2 start-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary-400 hover:text-red-600 hover:bg-white transition-colors shadow-xs",
									title: trans("remove_from_compare"),
									children: /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M6 18L18 6M6 6l12 12"
										})
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ jsx(Link, {
									href: localizedPath(type === "unit" ? `/units/${item.slug}` : `/projects/${item.slug}`, locale),
									children: /* @__PURE__ */ jsx("h3", {
										className: "text-sm font-bold text-secondary-950 truncate hover:text-primary-900 transition-colors mb-3",
										children: item.name
									})
								}),
								type === "unit" && /* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("price"),
											value: price.toLocaleString(),
											isBest: price === best?.bestPrice && price > 0
										}),
										ppsqm && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("price_per_sqm") || "Price/m²",
											value: ppsqm.toLocaleString()
										}),
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("area_sqm"),
											value: area ? `${area} m²` : "—",
											isBest: area === best?.bestArea
										}),
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("rooms"),
											value: item.rooms,
											isBest: Number(item.rooms) === best?.bestRooms
										}),
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("bathrooms") || "Bathrooms",
											value: item.bathrooms
										}),
										item.floor !== null && item.floor !== void 0 && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("floor") || "Floor",
											value: item.floor
										}),
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("transaction"),
											value: trans(item.transaction === "rent" ? "rent" : "sale")
										}),
										item.type?.name && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("unit_type") || "Type",
											value: item.type.name
										}),
										item.area?.name && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("area"),
											value: item.area.name
										}),
										item.finishing_type?.name && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("finishing") || "Finishing",
											value: item.finishing_type.name
										}),
										item.payment_method && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("payment_method") || "Payment",
											value: item.payment_method
										}),
										item.down_payment && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("down_payment") || "Down",
											value: item.down_payment
										}),
										item.installment_years && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("installment_years") || "Installment",
											value: `${item.installment_years} ${trans("years")}`
										})
									]
								}),
								type === "project" && /* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [
										item.area?.name && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("area"),
											value: item.area.name
										}),
										item.location_address && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("location"),
											value: item.location_address
										}),
										item.finishing_type?.name && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("finishing") || "Finishing",
											value: item.finishing_type.name
										}),
										item.payment_method && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("payment_method") || "Payment",
											value: item.payment_method
										}),
										item.down_payment && /* @__PURE__ */ jsx(DetailRow, {
											label: trans("down_payment") || "Down",
											value: item.down_payment
										}),
										/* @__PURE__ */ jsx(DetailRow, {
											label: trans("units_count"),
											value: item.units_count ?? item.units?.length ?? 0
										})
									]
								}),
								features.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "mt-3 pt-3 border-t border-secondary-100",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-secondary-400 font-medium mb-1.5",
										children: trans("features")
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap gap-1",
										children: [features.slice(0, 5).map((f) => /* @__PURE__ */ jsx(FeatureBadge, { name: f.name }, f.id)), features.length > 5 && /* @__PURE__ */ jsxs("span", {
											className: "text-[10px] text-secondary-400 px-1 py-1",
											children: ["+", features.length - 5]
										})]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "mt-3 pt-3 border-t border-secondary-100 flex gap-2",
									children: /* @__PURE__ */ jsx(Link, {
										href: localizedPath(type === "unit" ? `/units/${item.slug}` : `/projects/${item.slug}`, locale),
										className: "flex-1 block text-center py-2 bg-primary-900/5 hover:bg-primary-900 text-primary-900 hover:text-white text-xs font-semibold rounded-xl transition-colors",
										children: trans("show_more")
									})
								})
							]
						})]
					}, item.id);
				})
			}),
			items.length >= 2 && type === "unit" && /* @__PURE__ */ jsxs("div", {
				className: "mt-6 bg-white rounded-2xl shadow-card border border-secondary-100 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "p-4 border-b border-secondary-100 bg-surface/50",
					children: /* @__PURE__ */ jsxs("h3", {
						className: "text-sm font-bold text-secondary-950 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("svg", {
							className: "w-4 h-4 text-primary-900",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 2,
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
							})
						}), trans("detailed_comparison")]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							className: "bg-surface",
							children: [/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-start text-secondary-500 font-medium w-36 text-xs",
								children: trans("feature")
							}), items.map((item) => /* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-center text-xs font-bold text-secondary-950",
								children: item.name
							}, item.id))]
						}) }), /* @__PURE__ */ jsxs("tbody", { children: [
							[
								{
									key: "price",
									label: trans("price"),
									fmt: (v) => Number(v).toLocaleString(),
									bestOf: "min"
								},
								{
									key: "area_sqm",
									label: trans("area_sqm"),
									fmt: (v) => v ? `${v} m²` : "—",
									bestOf: "max"
								},
								{
									key: "rooms",
									label: trans("rooms"),
									fmt: (v) => v || "—",
									bestOf: "max"
								},
								{
									key: "bathrooms",
									label: trans("bathrooms") || "Bathrooms",
									fmt: (v) => v || "—",
									bestOf: "max"
								},
								{
									key: "floor",
									label: trans("floor") || "Floor",
									fmt: (v) => v ?? "—",
									bestOf: null
								},
								{
									key: null,
									label: trans("price_per_sqm") || "Price/m²",
									fmt: (_, item) => {
										const p = Number(item.price);
										const a = Number(item.area_sqm);
										return p && a ? Math.round(p / a).toLocaleString() : "—";
									},
									bestOf: "min"
								}
							].map((row) => /* @__PURE__ */ jsxs("tr", {
								className: "border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-secondary-500",
									children: row.label
								}), items.map((item) => {
									let val = row.fmt(row.key ? item[row.key] : null, item);
									let isBest = false;
									if (row.bestOf && item[row.key]) {
										const vals = items.map((i) => Number(i[row.key])).filter((v) => !isNaN(v));
										if (vals.length) {
											const bestVal = row.bestOf === "min" ? Math.min(...vals) : Math.max(...vals);
											isBest = Number(item[row.key]) === bestVal;
										}
									}
									return /* @__PURE__ */ jsx("td", {
										className: `px-4 py-3 text-center text-xs font-medium ${isBest ? "text-emerald-600 bg-emerald-50/50" : "text-secondary-800"}`,
										children: val
									}, item.id);
								})]
							}, row.key || "ppsqm")),
							/* @__PURE__ */ jsxs("tr", {
								className: "border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-secondary-500",
									children: trans("finishing") || "Finishing"
								}), items.map((item) => /* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-center text-xs text-secondary-800",
									children: item.finishing_type?.name || "—"
								}, item.id))]
							}),
							/* @__PURE__ */ jsxs("tr", {
								className: "border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-secondary-500",
									children: trans("payment_method") || "Payment"
								}), items.map((item) => /* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-center text-xs text-secondary-800",
									children: item.payment_method || "—"
								}, item.id))]
							}),
							items[0]?.description && /* @__PURE__ */ jsxs("tr", {
								className: "border-t border-secondary-100",
								children: [/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-xs text-secondary-500",
									children: trans("description")
								}), items.map((item) => /* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-center text-xs text-secondary-600 max-w-48",
									children: /* @__PURE__ */ jsx("p", {
										className: "line-clamp-3 leading-relaxed",
										children: item.description || "—"
									})
								}, item.id))]
							})
						] })]
					})
				})]
			})
		]
	});
}
function Comparison({ items, type, max_items }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const units = type === "unit" ? items || [] : [];
	const projects = type === "project" ? items || [] : [];
	const { compareList: unitList } = useCompare("unit");
	const { compareList: projectList } = useCompare("project");
	const hasAny = units.length > 0 || projects.length > 0;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("compare")} - ${trans("site_title")}`,
				description: trans("comparison_description"),
				canonical: window.location.href
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-6 w-full",
				children: !hasAny ? /* @__PURE__ */ jsxs("div", {
					className: "text-center py-20 max-w-md mx-auto",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-5",
							children: /* @__PURE__ */ jsx("svg", {
								className: "w-10 h-10 text-secondary-400",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 1,
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
								})
							})
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-secondary-950 mb-2",
							children: trans("compare_properties")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-secondary-500 mb-6 leading-relaxed",
							children: isRtl ? "أضف وحدات أو مشاريع إلى المقارنة لترى الفروقات بينها وتختار الأنسب لك." : "Add units or projects to compare and find the best option for you."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-3",
							children: [/* @__PURE__ */ jsx(Link, {
								href: localizedPath("/units", locale),
								className: "px-5 py-2.5 bg-primary-900 text-white text-sm font-semibold rounded-xl hover:bg-primary-950 transition-colors",
								children: trans("units")
							}), /* @__PURE__ */ jsx(Link, {
								href: localizedPath("/projects", locale),
								className: "px-5 py-2.5 bg-secondary-100 text-secondary-700 text-sm font-semibold rounded-xl hover:bg-secondary-200 transition-colors",
								children: trans("projects")
							})]
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-xl bg-primary-900/10 text-primary-900 flex items-center justify-center",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-5 h-5",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 1.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
									})
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "text-xl font-bold text-secondary-950",
								children: trans("compare")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-secondary-500",
								children: trans("compare_options_subtitle")
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 bg-secondary-100 rounded-xl p-1",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: localizedPath(`/compare?type=unit&ids=${unitList.join(",")}`, locale),
								className: `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${type === "unit" ? "bg-white text-primary-900 shadow-xs" : "text-secondary-600 hover:text-secondary-900"}`,
								children: [trans("units"), unitList.length > 0 && /* @__PURE__ */ jsxs("span", {
									className: "ms-1.5 text-[10px] opacity-60",
									children: [
										"(",
										unitList.length,
										")"
									]
								})]
							}), /* @__PURE__ */ jsxs(Link, {
								href: localizedPath(`/compare?type=project&ids=${projectList.join(",")}`, locale),
								className: `px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${type === "project" ? "bg-white text-primary-900 shadow-xs" : "text-secondary-600 hover:text-secondary-900"}`,
								children: [trans("projects"), projectList.length > 0 && /* @__PURE__ */ jsxs("span", {
									className: "ms-1.5 text-[10px] opacity-60",
									children: [
										"(",
										projectList.length,
										")"
									]
								})]
							})]
						})]
					}),
					units.length > 0 && /* @__PURE__ */ jsx(ComparisonSection, {
						type: "unit",
						title: trans("units"),
						items: units,
						maxItems: max_items,
						isRtl,
						locale,
						trans
					}),
					projects.length > 0 && /* @__PURE__ */ jsx(ComparisonSection, {
						type: "project",
						title: trans("projects"),
						items: projects,
						maxItems: max_items,
						isRtl,
						locale,
						trans
					})
				] })
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Contact.jsx
var Contact_exports = /* @__PURE__ */ __exportAll({ default: () => Contact });
function Contact() {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [sentSuccess, setSentSuccess] = useState(false);
	const { data, setData, post, processing, errors } = useForm({
		client_name: "",
		client_phone: "",
		client_email: "",
		content: ""
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	function handleSubmit(e) {
		e.preventDefault();
		if (processing || isSubmitting) return;
		setIsSubmitting(true);
		const submitUrl = window.location.pathname.startsWith("/en") ? "/en/contact" : window.location.pathname.startsWith("/ar") ? "/ar/contact" : "/contact";
		post(submitUrl, {
			preserveScroll: true,
			onSuccess: () => {
				setData({
					client_name: "",
					client_phone: "",
					client_email: "",
					content: ""
				});
				setSentSuccess(true);
				setTimeout(() => setSentSuccess(false), 5e3);
			},
			onFinish: () => setIsSubmitting(false),
			onError: () => setIsSubmitting(false)
		});
	}
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("contact")} - ${trans("site_title")}`,
				description: trans("contact_description"),
				canonical: window.location.href
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-2xl mx-auto px-4 py-12 w-full",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold text-secondary-950 mb-2",
						children: trans("contact")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted mb-8",
						children: trans("contact_info")
					}),
					(sentSuccess || flash?.success) && /* @__PURE__ */ jsx("div", {
						className: "mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium",
						children: flash?.success || trans("contact_message_sent_success")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "bg-white rounded-xl shadow-card p-6 sm:p-8",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							noValidate: true,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "mb-4",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-medium text-secondary-950 mb-1",
											children: trans("your_name", {}, "messages")
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.client_name,
											onChange: (e) => setData("client_name", e.target.value),
											required: true,
											className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
										}),
										errors.client_name && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-error mt-1",
											children: errors.client_name
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("your_phone", {}, "messages")
									}), /* @__PURE__ */ jsx("input", {
										type: "tel",
										value: data.client_phone,
										onChange: (e) => setData("client_phone", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-secondary-950 mb-1",
										children: trans("your_email", {}, "messages")
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										value: data.client_email,
										onChange: (e) => setData("client_email", e.target.value),
										className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
									})] })]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mb-6",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-medium text-secondary-950 mb-1",
											children: trans("your_message", {}, "messages")
										}),
										/* @__PURE__ */ jsx("textarea", {
											value: data.content,
											onChange: (e) => setData("content", e.target.value),
											required: true,
											rows: 5,
											className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
										}),
										errors.content && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-error mt-1",
											children: errors.content
										})
									]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "submit",
									disabled: processing || isSubmitting,
									className: "w-full px-4 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
									children: [(processing || isSubmitting) && /* @__PURE__ */ jsxs("svg", {
										className: "animate-spin h-4 w-4 text-white inline-block",
										fill: "none",
										viewBox: "0 0 24 24",
										children: [/* @__PURE__ */ jsx("circle", {
											className: "opacity-25",
											cx: "12",
											cy: "12",
											r: "10",
											stroke: "currentColor",
											strokeWidth: "4"
										}), /* @__PURE__ */ jsx("path", {
											className: "opacity-75",
											fill: "currentColor",
											d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										})]
									}), processing || isSubmitting ? trans("loading") : trans("send_message", {}, "messages")]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/SearchBar.jsx
function SearchBar({ areas = [], unitTypes = [], features = [], finishingTypes = [], filters = {}, onSearch }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [local, setLocal] = useState({
		area_id: filters.area_id || "",
		type_id: filters.type_id || "",
		transaction: filters.transaction || "",
		price_min: filters.price_min || "",
		price_max: filters.price_max || "",
		size_min: filters.size_min || "",
		size_max: filters.size_max || "",
		search: filters.search || "",
		payment_method: filters.payment_method || "",
		finishing_type_id: filters.finishing_type_id || "",
		features: filters.features || []
	});
	const [isSearching, setIsSearching] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	function update(key, value) {
		setLocal((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function handleSubmit(e) {
		e.preventDefault();
		setIsSearching(true);
		const params = {};
		for (const [k, v] of Object.entries(local)) if (k === "features" && Array.isArray(v) && v.length > 0) params[k] = v;
		else if (v !== "" && v !== null && v !== void 0 && k !== "features") params[k] = v;
		if (onSearch) {
			onSearch(params);
			setTimeout(() => setIsSearching(false), 300);
		} else router.get(`/${locale}/units`, params, {
			preserveState: true,
			onFinish: () => setIsSearching(false)
		});
	}
	function handleReset() {
		setLocal({
			area_id: "",
			type_id: "",
			transaction: "",
			price_min: "",
			price_max: "",
			size_min: "",
			size_max: "",
			search: "",
			payment_method: "",
			finishing_type_id: "",
			features: []
		});
		if (onSearch) onSearch({});
		else router.get(`/${locale}/units`, {}, { preserveState: true });
	}
	function toggleFeature(id) {
		if (id == null) return;
		const idStr = String(id);
		setLocal((prev) => {
			const currentFeatures = Array.isArray(prev.features) ? prev.features : [];
			if (currentFeatures.some((f) => f?.toString() === idStr)) return {
				...prev,
				features: currentFeatures.filter((f) => f?.toString() !== idStr)
			};
			else return {
				...prev,
				features: [...currentFeatures, idStr]
			};
		});
	}
	return /* @__PURE__ */ jsx("div", {
		className: "w-full max-w-5xl mx-auto relative z-[60]",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			dir: isRtl ? "rtl" : "ltr",
			className: "bg-white rounded-3xl md:rounded-[2rem] shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-text group rounded-2xl md:rounded-s-3xl md:rounded-e-none",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "search-input",
							className: "block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
							children: trans("search")
						}), /* @__PURE__ */ jsx("input", {
							id: "search-input",
							type: "text",
							value: local.search,
							onChange: (e) => update("search", e.target.value),
							placeholder: locale === "ar" ? "ابحث بالاسم..." : "Search by name...",
							className: "w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "transaction-filter",
							className: "block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
							children: trans("transaction")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "transaction-filter",
							value: local.transaction,
							onChange: (e) => update("transaction", e.target.value),
							className: "w-full text-secondary-800 outline-none cursor-pointer",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: locale === "ar" ? "الكل" : "All"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "sale",
									children: trans("sale")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "rent",
									children: trans("rent")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "new_project",
									children: locale === "ar" ? "مشروع جديد" : "New Project"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "commercial",
									children: locale === "ar" ? "تجاري" : "Commercial"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "residential",
									children: locale === "ar" ? "سكني" : "Residential"
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "area-filter",
							className: "block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
							children: trans("area")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "area-filter",
							value: local.area_id,
							onChange: (e) => update("area_id", e.target.value),
							className: "w-full text-secondary-800 outline-none cursor-pointer",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: locale === "ar" ? "كل المناطق" : "All Areas"
							}), areas.map((area) => /* @__PURE__ */ jsx("option", {
								value: area.id,
								children: locale === "ar" ? area.name_ar : area.name_en
							}, area.id))]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 w-full px-5 py-3 hover:bg-surface/60 transition-colors cursor-pointer group rounded-2xl md:rounded-none",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "type-filter",
							className: "block text-[10px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
							children: trans("type")
						}), /* @__PURE__ */ jsxs(Select, {
							id: "type-filter",
							value: local.type_id,
							onChange: (e) => update("type_id", e.target.value),
							className: "w-full text-secondary-800 outline-none cursor-pointer",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: locale === "ar" ? "كل الأنواع" : "All Types"
							}), unitTypes.map((ut) => /* @__PURE__ */ jsx("option", {
								value: ut.id,
								children: locale === "ar" ? ut.name_ar : ut.name_en
							}, ut.id))]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "w-full md:w-auto p-2 flex items-center justify-between md:justify-center gap-3 md:gap-2 shrink-0 md:ps-4",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShowAdvanced(!showAdvanced),
							className: `p-3 rounded-full text-secondary-600 hover:text-primary-900 hover:bg-surface/80 transition-colors ${showAdvanced ? "bg-surface text-primary-900" : ""}`,
							"aria-label": locale === "ar" ? "تصفية متقدمة" : "Advanced Filters",
							children: /* @__PURE__ */ jsx("svg", {
								className: `w-5 h-5 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`,
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 2,
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
								})
							})
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isSearching,
							className: "w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center hover:bg-primary-950 active:scale-95 transition-all duration-200 disabled:opacity-80",
							"aria-label": trans("search"),
							children: isSearching ? /* @__PURE__ */ jsxs("svg", {
								className: "animate-spin w-5 h-5",
								xmlns: "http://www.w3.org/2000/svg",
								fill: "none",
								viewBox: "0 0 24 24",
								children: [/* @__PURE__ */ jsx("circle", {
									className: "opacity-25",
									cx: "12",
									cy: "12",
									r: "10",
									stroke: "currentColor",
									strokeWidth: "4"
								}), /* @__PURE__ */ jsx("path", {
									className: "opacity-75",
									fill: "currentColor",
									d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								})]
							}) : /* @__PURE__ */ jsx("svg", {
								className: "w-5 h-5",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 2.5,
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								})
							})
						})]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: `transition-all duration-300 ease-in-out origin-top rounded-b-3xl md:rounded-b-[2rem] ${showAdvanced ? "overflow-visible" : "overflow-hidden"}`,
				style: {
					maxHeight: showAdvanced ? "1500px" : "0px",
					opacity: showAdvanced ? 1 : 0
				},
				children: /* @__PURE__ */ jsxs("div", {
					className: "px-4 py-4 bg-surface/30 border-t border-secondary-100 flex flex-col gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-4 w-full",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "price-min-input",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: locale === "ar" ? "الحد الأدنى للسعر" : "Minimum Price"
								}), /* @__PURE__ */ jsx("input", {
									id: "price-min-input",
									type: "number",
									min: "0",
									value: local.price_min,
									onChange: (e) => update("price_min", e.target.value),
									placeholder: "0",
									className: "w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "price-max-input",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: locale === "ar" ? "الحد الأقصى للسعر" : "Maximum Price"
								}), /* @__PURE__ */ jsx("input", {
									id: "price-max-input",
									type: "number",
									min: "0",
									value: local.price_max,
									onChange: (e) => update("price_max", e.target.value),
									placeholder: locale === "ar" ? "لا يوجد حد" : "No limit",
									className: "w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-4 w-full",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "size-min-input",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: locale === "ar" ? "الحد الأدنى للمساحة" : "Minimum Size"
								}), /* @__PURE__ */ jsx("input", {
									id: "size-min-input",
									type: "number",
									min: "0",
									value: local.size_min,
									onChange: (e) => update("size_min", e.target.value),
									placeholder: "0",
									className: "w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "size-max-input",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: locale === "ar" ? "الحد الأقصى للمساحة" : "Maximum Size"
								}), /* @__PURE__ */ jsx("input", {
									id: "size-max-input",
									type: "number",
									min: "0",
									value: local.size_max,
									onChange: (e) => update("size_max", e.target.value),
									placeholder: locale === "ar" ? "لا يوجد حد" : "No limit",
									className: "w-full px-3 py-0 h-10 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all duration-200 outline-none"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-4 w-full",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "payment-method-filter",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: trans("payment_method") || "Payment Method"
								}), /* @__PURE__ */ jsxs(Select, {
									id: "payment-method-filter",
									value: local.payment_method,
									onChange: (e) => update("payment_method", e.target.value),
									className: "w-full",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: trans("all") || "All"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "cash",
											children: trans("cash") || "Cash"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "installment",
											children: trans("installment") || "Installment"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "both",
											children: trans("both") || "Cash & Installment"
										})
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 w-full",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "finishing-type-filter",
									className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1",
									children: trans("finishing_type") || "Finishing Type"
								}), /* @__PURE__ */ jsxs(Select, {
									id: "finishing-type-filter",
									value: local.finishing_type_id,
									onChange: (e) => update("finishing_type_id", e.target.value),
									className: "w-full",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: trans("all") || "All"
									}), finishingTypes?.map((f) => /* @__PURE__ */ jsx("option", {
										value: f.id,
										children: locale === "ar" ? f.name_ar : f.name_en
									}, f.id))]
								})]
							})]
						}),
						features?.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "w-full pt-3 border-t border-secondary-100/50",
							children: [/* @__PURE__ */ jsx("label", {
								className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2",
								children: trans("features") || "Features"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2",
								children: features.map((feature) => {
									const isChecked = Array.isArray(local.features) ? local.features.includes(String(feature.id)) || local.features.includes(feature.id) : false;
									return /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 group",
										children: [/* @__PURE__ */ jsx("input", {
											type: "checkbox",
											id: `feature-${feature.id}`,
											checked: isChecked,
											onChange: () => toggleFeature(feature.id),
											className: "w-5 h-5 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
										}), /* @__PURE__ */ jsx("label", {
											htmlFor: `feature-${feature.id}`,
											className: "text-xs text-secondary-700 group-hover:text-primary-900 transition-colors cursor-pointer select-none",
											children: locale === "ar" ? feature.name_ar : feature.name_en
										})]
									}, feature.id);
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "w-full flex justify-end pt-3 border-t border-secondary-100/50",
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleReset,
								className: "w-full sm:w-auto px-6 h-10 text-secondary-700 bg-transparent hover:bg-secondary-200/50 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M6 18L18 6M6 6l12 12"
									})
								}), locale === "ar" ? "مسح الفلاتر" : "Clear Filters"]
							})
						})
					]
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/Pages/Public/Home.jsx
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => Home });
var HERO_BG = "/images/hero.webp";
var HERO_BG_MOBILE = "/images/hero-mobile.webp";
function Home({ featuredUnits, latestUnits, popularSearches, areas, unitTypes, features, finishingTypes }) {
	const { locale, settings } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const heroTitle = isRtl ? settings?.hero_title_ar || trans("hero_title") : settings?.hero_title_en || trans("hero_title");
	const heroSubtitle = isRtl ? settings?.hero_subtitle_ar || trans("hero_subtitle") : settings?.hero_subtitle_en || trans("hero_subtitle");
	const heroImage = settings?.hero_image ? `/storage/${settings.hero_image}` : HERO_BG;
	const heroImageMobile = settings?.hero_image ? `/storage/${settings.hero_image}` : HERO_BG_MOBILE;
	const isLoading = !featuredUnits && !latestUnits;
	const hasFeatured = featuredUnits?.data?.length > 0;
	const hasLatest = latestUnits?.data?.length > 0;
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: trans("site_title"),
				description: trans("home_description"),
				ogImage: featuredUnits?.data?.[0]?.images?.[0]?.url || (featuredUnits?.data?.[0]?.images?.[0]?.path ? `/storage/${featuredUnits.data[0].images[0].path}` : null),
				canonical: typeof window !== "undefined" ? window.location.href : null
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ jsxs("section", {
						className: "relative bg-secondary-950 flex flex-col justify-center min-h-[80vh]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "absolute inset-0 z-0 overflow-hidden",
							children: [/* @__PURE__ */ jsx("img", {
								src: heroImage,
								srcSet: `${heroImageMobile} 640w, ${heroImage} 1400w`,
								sizes: "100vw",
								alt: "",
								className: "w-full h-full object-cover scale-105",
								fetchPriority: "high",
								loading: "eager",
								decoding: "sync"
							}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/85 to-black/60" })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative z-20 max-w-container mx-auto px-4 py-20 sm:py-28 text-center w-full",
							children: [
								/* @__PURE__ */ jsx("h1", {
									className: "text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md",
									children: heroTitle
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-base sm:text-lg lg:text-xl text-secondary-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed",
									children: heroSubtitle
								}),
								/* @__PURE__ */ jsx(SearchBar, {
									areas,
									unitTypes,
									features,
									finishingTypes
								})
							]
						})]
					}),
					popularSearches?.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "max-w-container mx-auto px-4 py-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ jsx("svg", {
								className: "w-4 h-4 text-primary-900",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								strokeWidth: 2,
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								})
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold text-secondary-950 uppercase tracking-wider",
								children: trans("popular_searches")
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2",
							children: popularSearches.map((ps) => /* @__PURE__ */ jsx(Link, {
								href: localizedPath(`/units?search=${encodeURIComponent(ps.keyword)}`, locale),
								className: "px-3.5 py-1.5 bg-white text-xs font-semibold text-secondary-700 rounded-full border border-secondary-200 hover:border-primary-900 hover:text-primary-900 hover:shadow-sm transition-all",
								children: ps.keyword
							}, ps.keyword))
						})]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "max-w-container mx-auto px-4 py-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-black text-secondary-950 tracking-tight",
								children: trans("featured_units")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-secondary-500 mt-1",
								children: trans("featured_units_subtitle")
							})] }), /* @__PURE__ */ jsxs(Link, {
								href: localizedPath("/units", locale),
								className: "text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1",
								children: [trans("show_more"), /* @__PURE__ */ jsx("svg", {
									className: "w-3.5 h-3.5 rtl:rotate-180",
									fill: "none",
									viewBox: "0 0 24 24",
									stroke: "currentColor",
									strokeWidth: 2.5,
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										d: "M8.25 4.5l7.5 7.5-7.5 7.5"
									})
								})]
							})]
						}), isLoading ? /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
							children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(UnitCard, { loading: true }, i))
						}) : hasFeatured ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
							children: featuredUnits.data.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
						}), /* @__PURE__ */ jsx(Pagination, {
							meta: featuredUnits,
							links: featuredUnits.links
						})] }) : /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted text-center py-12",
							children: trans("no_results")
						})]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "bg-surface py-12 border-t border-secondary-100",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-container mx-auto px-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "text-2xl font-black text-secondary-950 tracking-tight",
									children: trans("latest_units")
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-secondary-500 mt-1",
									children: trans("latest_units_subtitle")
								})] }), /* @__PURE__ */ jsxs(Link, {
									href: localizedPath("/units", locale),
									className: "text-xs font-bold text-primary-900 hover:text-primary-700 flex items-center gap-1",
									children: [trans("show_more"), /* @__PURE__ */ jsx("svg", {
										className: "w-3.5 h-3.5 rtl:rotate-180",
										fill: "none",
										viewBox: "0 0 24 24",
										stroke: "currentColor",
										strokeWidth: 2.5,
										children: /* @__PURE__ */ jsx("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											d: "M8.25 4.5l7.5 7.5-7.5 7.5"
										})
									})]
								})]
							}), isLoading ? /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
								children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsx(UnitCard, { loading: true }, i))
							}) : hasLatest ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
								children: latestUnits.data.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
							}), /* @__PURE__ */ jsx(Pagination, {
								meta: latestUnits,
								links: latestUnits.links
							})] }) : /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted text-center py-12",
								children: trans("no_results")
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/ProjectCard.jsx
var PLACEHOLDER$2 = "/images/fallback.jpg";
function SkeletonCard() {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl shadow-card overflow-hidden border border-secondary-100 animate-pulse",
		children: [/* @__PURE__ */ jsx("div", { className: "skeleton h-52 w-full bg-secondary-100" }), /* @__PURE__ */ jsxs("div", {
			className: "p-5 space-y-3",
			children: [
				/* @__PURE__ */ jsx("div", { className: "skeleton h-5 w-3/4 rounded-md bg-secondary-100" }),
				/* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-1/2 rounded bg-secondary-100" }),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-3 border-t border-secondary-100 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("div", { className: "skeleton h-7 w-20 rounded-lg bg-secondary-100" }), /* @__PURE__ */ jsx("div", { className: "skeleton h-7 w-24 rounded-lg bg-secondary-100" })]
				})
			]
		})]
	});
}
function ProjectCard({ project, loading = false }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const { compareList, toggleCompare } = useCompare("project");
	if (loading) return /* @__PURE__ */ jsx(SkeletonCard, {});
	const mainImage = project?.images?.find((img) => img.is_main || img.is_primary) || project?.images?.[0];
	const thumbnail = mainImage?.thumb_url || mainImage?.url || (mainImage?.path ? mainImage.path.startsWith("http") || mainImage.path.startsWith("/") ? mainImage.path : `/storage/${mainImage.path}` : PLACEHOLDER$2);
	const isCompared = compareList.includes(project?.id);
	const areaName = project.area?.name || project.area_name || (isRtl ? "مصر" : "Egypt");
	const imageAlt = project.alt_text || `${project.name || (isRtl ? "مشروع عقاري" : "Project")} ${isRtl ? "في" : "in"} ${areaName} - ${trans("app_name")}`;
	const unitsCount = project.units_count ?? project.units?.length ?? 0;
	return /* @__PURE__ */ jsxs("article", {
		dir: isRtl ? "rtl" : "ltr",
		className: "bg-white rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 overflow-hidden group border border-secondary-100/80 flex flex-col h-full",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative overflow-hidden aspect-[4/3] bg-secondary-100",
			children: [/* @__PURE__ */ jsx(Link, {
				href: localizedPath(`/projects/${project.slug}`, locale),
				className: "block w-full h-full focus:outline-none focus:ring-2 focus:ring-primary-500",
				children: /* @__PURE__ */ jsx(OptimizedImage, {
					src: thumbnail,
					alt: imageAlt,
					width: 480,
					height: 360,
					lazy: true,
					fallbackSrc: PLACEHOLDER$2,
					className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10",
				children: [/* @__PURE__ */ jsx("span", {
					className: "bg-white/95 text-secondary-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/40",
					children: areaName
				}), project.payment_method && /* @__PURE__ */ jsx("span", {
					className: "bg-secondary-900/90 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md",
					children: project.payment_method === "cash" ? isRtl ? "كاش" : "Cash" : project.payment_method === "installment" ? isRtl ? "تقسيط" : "Installment" : isRtl ? "كاش وتقسيط" : "Cash & Installment"
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5 flex flex-col flex-1 justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx(Link, {
					href: localizedPath(`/projects/${project.slug}`, locale),
					className: "block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded",
					children: /* @__PURE__ */ jsx("h2", {
						className: "text-base font-bold text-secondary-950 group-hover:text-primary-900 transition-colors line-clamp-1 mb-1.5",
						children: project.name
					})
				}),
				project.description && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-secondary-500 line-clamp-2 leading-relaxed mb-3",
					children: project.description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-wrap text-xs",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "bg-primary-50 text-primary-900 px-2.5 py-1 rounded-md font-semibold",
						children: [
							unitsCount,
							" ",
							trans("units_count") || (isRtl ? "وحدة متاحة" : "Units")
						]
					}), project.installment_years > 0 && /* @__PURE__ */ jsx("span", {
						className: "bg-secondary-50 text-secondary-700 px-2.5 py-1 rounded-md font-medium",
						children: isRtl ? `تقسيط حتى ${project.installment_years} سنوات` : `Up to ${project.installment_years} yrs installment`
					})]
				})
			] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pt-3 border-t border-secondary-100 mt-auto",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: (e) => {
						e.preventDefault();
						toggleCompare(project.id);
					},
					className: `text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${isCompared ? "bg-primary-900 text-white border-primary-900 shadow-sm" : "bg-white text-secondary-600 border-secondary-200 hover:border-primary-900 hover:text-primary-900"}`,
					"aria-label": `${trans("compare")} ${project.name}`,
					"aria-pressed": isCompared,
					children: isCompared ? isRtl ? "تمت الإضافة للمقارنة" : "Added to Compare" : trans("compare")
				}), /* @__PURE__ */ jsx(Link, {
					href: localizedPath(`/projects/${project.slug}`, locale),
					className: "text-xs font-semibold text-primary-900 hover:text-primary-950 hover:underline transition-all",
					children: trans("show_more") || (isRtl ? "التفاصيل ←" : "Details →")
				})]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Public/Projects/Index.jsx
var Index_exports$1 = /* @__PURE__ */ __exportAll({ default: () => ProjectsIndex });
function ProjectsIndex({ projects, filters, areas, features, finishingTypes }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isLoading = !projects;
	const hasProjects = projects?.data?.length > 0;
	const [search, setSearch] = useState(filters.search || "");
	const [areaId, setAreaId] = useState(filters.area_id || "");
	const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || "");
	const [finishingTypeId, setFinishingTypeId] = useState(filters.finishing_type_id || "");
	const [selectedFeatures, setSelectedFeatures] = useState(filters.features || []);
	const [showAdvanced, setShowAdvanced] = useState(false);
	function handleSearch() {
		const params = {};
		if (search) params.search = search;
		if (areaId) params.area_id = areaId;
		if (paymentMethod) params.payment_method = paymentMethod;
		if (finishingTypeId) params.finishing_type_id = finishingTypeId;
		if (selectedFeatures.length > 0) params.features = selectedFeatures;
		router.get(`/${locale}/projects`, params, { preserveState: true });
	}
	function handleReset() {
		setSearch("");
		setAreaId("");
		setPaymentMethod("");
		setFinishingTypeId("");
		setSelectedFeatures([]);
		router.get(`/${locale}/projects`, {}, { preserveState: true });
	}
	function toggleFeature(id) {
		if (id == null) return;
		const idStr = String(id);
		if (selectedFeatures.includes(idStr) || selectedFeatures.includes(id)) setSelectedFeatures(selectedFeatures.filter((f) => f?.toString() !== idStr));
		else setSelectedFeatures([...selectedFeatures, id]);
	}
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col font-sans",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("projects_page_title") || (isRtl ? "المشاريع العقارية" : "Real Estate Projects")} - ${trans("site_title")}`,
				description: trans("projects_description"),
				canonical: window.location.href
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 md:py-12 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-8 text-center max-w-3xl mx-auto",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "inline-block bg-primary-50 text-primary-900 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide",
								children: isRtl ? "المشاريع العقارية" : "Real Estate Projects"
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-3xl md:text-4xl font-extrabold text-secondary-950 tracking-tight leading-tight mb-3",
								children: trans("projects_page_title") || (isRtl ? "أبرز المشاريع والمجمعات السكنية" : "Featured Projects")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm md:text-base text-secondary-600 leading-relaxed",
								children: isRtl ? "تصفح أفضل المشاريع الفاخرة المتاحة للبيع والتقسيط في أرقى المناطق والمدن" : "Browse premium real estate developments and residential compounds across top locations"
							})
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: (e) => {
							e.preventDefault();
							handleSearch();
						},
						className: "bg-white rounded-2xl md:rounded-full shadow-lg border border-secondary-100 hover:shadow-xl transition-shadow duration-300 w-full mb-10 relative z-20",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row items-center md:divide-x divide-y md:divide-y-0 rtl:divide-x-reverse divide-secondary-100 p-2 md:p-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1 w-full px-5 py-3 hover:bg-surface/50 transition-colors group rounded-xl md:rounded-s-full md:rounded-e-none",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
										children: trans("search")
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: search,
										onChange: (e) => setSearch(e.target.value),
										placeholder: trans("search_projects") || (isRtl ? "ابحث باسم المشروع..." : "Search by project name..."),
										className: "w-full bg-transparent border-none text-sm focus:ring-0 text-secondary-800 placeholder-secondary-400 outline-none p-0"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1 w-full px-5 py-3 hover:bg-surface/50 transition-colors cursor-pointer group rounded-xl md:rounded-none",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-1 group-hover:text-primary-900 transition-colors",
										children: trans("area")
									}), /* @__PURE__ */ jsxs(Select, {
										value: areaId,
										onChange: (e) => setAreaId(e.target.value),
										className: "w-full text-secondary-800 outline-none cursor-pointer border-none p-0 focus:ring-0 bg-transparent text-sm font-medium",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: isRtl ? "جميع المناطق" : "All Areas"
										}), areas?.map((area) => /* @__PURE__ */ jsx("option", {
											value: area.id,
											children: locale === "ar" ? area.name_ar : area.name_en
										}, area.id))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "w-full md:w-auto p-2 flex items-center justify-between md:justify-center gap-2 shrink-0 md:ps-4",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setShowAdvanced(!showAdvanced),
											className: `px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${showAdvanced ? "bg-primary-50 text-primary-900 border border-primary-200" : "bg-surface text-secondary-700 hover:bg-secondary-100"}`,
											children: isRtl ? "تصفية إضافية" : "More Filters"
										}),
										(search || areaId || paymentMethod || finishingTypeId || selectedFeatures.length > 0) && /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleReset,
											className: "px-3 py-2.5 rounded-full text-xs font-medium text-secondary-500 hover:text-secondary-900 transition-colors",
											children: trans("clear_filters") || (isRtl ? "إعادة ضبط" : "Reset")
										}),
										/* @__PURE__ */ jsx("button", {
											type: "submit",
											className: "px-6 py-2.5 bg-primary-900 text-white font-semibold text-xs rounded-full hover:bg-primary-950 active:scale-95 transition-all duration-200 shadow-sm",
											children: trans("search") || (isRtl ? "بحث" : "Search")
										})
									]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "transition-all duration-300 ease-in-out origin-top overflow-hidden rounded-b-2xl md:rounded-b-[1.5rem]",
							style: {
								maxHeight: showAdvanced ? "800px" : "0px",
								opacity: showAdvanced ? 1 : 0
							},
							children: /* @__PURE__ */ jsxs("div", {
								className: "px-6 py-6 bg-surface/40 border-t border-secondary-100 flex flex-col gap-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row gap-6 w-full",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex-1 w-full",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2",
											children: trans("payment_method") || (isRtl ? "طريقة الدفع" : "Payment Method")
										}), /* @__PURE__ */ jsxs(Select, {
											value: paymentMethod,
											onChange: (e) => setPaymentMethod(e.target.value),
											className: "w-full px-4 py-2 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none",
											children: [
												/* @__PURE__ */ jsx("option", {
													value: "",
													children: trans("all") || (isRtl ? "الكل" : "All")
												}),
												/* @__PURE__ */ jsx("option", {
													value: "cash",
													children: trans("cash") || (isRtl ? "كاش" : "Cash")
												}),
												/* @__PURE__ */ jsx("option", {
													value: "installment",
													children: trans("installment") || (isRtl ? "تقسيط" : "Installment")
												}),
												/* @__PURE__ */ jsx("option", {
													value: "both",
													children: trans("both") || (isRtl ? "كاش وتقسيط" : "Cash & Installment")
												})
											]
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 w-full",
										children: [/* @__PURE__ */ jsx("label", {
											className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-2",
											children: trans("finishing_type") || (isRtl ? "نوع التشطيب" : "Finishing Type")
										}), /* @__PURE__ */ jsxs(Select, {
											value: finishingTypeId,
											onChange: (e) => setFinishingTypeId(e.target.value),
											className: "w-full px-4 py-2 border border-secondary-200 bg-white rounded-xl text-sm focus:ring-2 focus:ring-primary-900 transition-all outline-none",
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: trans("all") || (isRtl ? "الكل" : "All")
											}), finishingTypes?.map((f) => /* @__PURE__ */ jsx("option", {
												value: f.id,
												children: locale === "ar" ? f.name_ar : f.name_en
											}, f.id))]
										})]
									})]
								}), features?.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "w-full pt-4 border-t border-secondary-200/60",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-[11px] font-bold text-secondary-950 uppercase tracking-wider mb-3",
										children: trans("features") || (isRtl ? "المميزات والخدمات" : "Features")
									}), /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3",
										children: features.map((feature) => /* @__PURE__ */ jsxs("label", {
											className: "flex items-center gap-2 cursor-pointer group",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: selectedFeatures.includes(String(feature.id)) || selectedFeatures.includes(feature.id),
												onChange: () => toggleFeature(feature.id),
												className: "w-4 h-4 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-sm text-secondary-700 group-hover:text-primary-900 transition-colors",
												children: locale === "ar" ? feature.name_ar : feature.name_en
											})]
										}, feature.id))
									})]
								})]
							})
						})]
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(ProjectCard, { loading: true }, i))
					}) : hasProjects ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10",
						children: projects.data.map((project) => /* @__PURE__ */ jsx(ProjectCard, { project }, project.id))
					}), /* @__PURE__ */ jsx(Pagination, {
						meta: projects,
						links: projects.links
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-secondary-100 p-12 text-center max-w-md mx-auto my-8",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-secondary-900 mb-2",
								children: isRtl ? "لم يتم العثور على مشاريع مطابقة" : "No Projects Found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-secondary-500 mb-6 leading-relaxed",
								children: isRtl ? "جرب البحث بكلمات مختلفة أو قم بإزالة بعض الفلاتر" : "Try adjusting your search criteria or resetting filters"
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleReset,
								className: "px-5 py-2.5 bg-secondary-900 text-white rounded-xl text-xs font-semibold hover:bg-secondary-950 transition-colors",
								children: isRtl ? "عرض كل المشاريع" : "Show All Projects"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/Features/AgentCard.jsx
function AgentCard({ agent }) {
	const { locale, settings } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	if (!agent) return null;
	const defaultWhatsapp = settings?.company_whatsapp || settings?.whatsapp_number || settings?.phone;
	const targetWhatsapp = agent.whatsapp || defaultWhatsapp;
	const avatarSrc = agent.avatar ? agent.avatar.startsWith("http") || agent.avatar.startsWith("/storage") ? agent.avatar : `/storage/${agent.avatar}` : null;
	const agentAlt = isRtl ? `الوكيل العقاري ${agent.name}` : `Real Estate Agent ${agent.name}`;
	const channels = [
		{
			key: "phone",
			url: agent.phone ? `tel:${agent.phone}` : null,
			label: agent.phone
		},
		{
			key: "whatsapp",
			url: targetWhatsapp ? `https://wa.me/${targetWhatsapp.replace(/[^0-9]/g, "")}` : null,
			label: targetWhatsapp
		},
		{
			key: "facebook",
			url: agent.facebook || null,
			label: trans("facebook")
		},
		{
			key: "linkedin",
			url: agent.linkedin || null,
			label: trans("social_linkedin", {}, "admin")
		}
	].filter((c) => c.url);
	return /* @__PURE__ */ jsxs("article", {
		dir: isRtl ? "rtl" : "ltr",
		className: "bg-white rounded-xl shadow-card p-6 border border-secondary-100 hover:shadow-lg transition-shadow",
		children: [/* @__PURE__ */ jsxs(Link, {
			href: localizedPath(`/agents/${agent.id}`, locale),
			className: "flex items-center gap-4 mb-4 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg",
			children: [avatarSrc ? /* @__PURE__ */ jsx(OptimizedImage, {
				src: avatarSrc,
				alt: agentAlt,
				width: 56,
				height: 56,
				lazy: true,
				className: "w-14 h-14 rounded-full object-cover border border-secondary-200"
			}) : /* @__PURE__ */ jsx("div", {
				className: "w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-lg border border-primary-200",
				"aria-label": agentAlt,
				children: agent.name?.charAt(0)?.toUpperCase() || "?"
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-sm font-semibold text-secondary-950",
				children: agent.name
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-muted",
				children: trans("agent", {}, "units")
			})] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-2",
			children: channels.map((ch) => /* @__PURE__ */ jsxs("a", {
				href: ch.url,
				target: ch.key === "facebook" ? "_blank" : void 0,
				rel: ch.key === "facebook" ? "noopener noreferrer" : void 0,
				className: "flex items-center gap-2 text-sm text-secondary-700 hover:text-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1",
				"aria-label": `${ch.label} (${agent.name})`,
				children: [
					ch.key === "phone" && /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4 shrink-0 text-primary-600",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 1.5,
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
						})
					}),
					ch.key === "whatsapp" && /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4 shrink-0 text-emerald-600",
						fill: "currentColor",
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
					}),
					ch.key === "facebook" && /* @__PURE__ */ jsx("svg", {
						className: "w-4 h-4 shrink-0 text-blue-600",
						fill: "currentColor",
						viewBox: "0 0 24 24",
						"aria-hidden": "true",
						children: /* @__PURE__ */ jsx("path", { d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" })
					}),
					/* @__PURE__ */ jsx("span", { children: ch.label })
				]
			}, ch.key))
		})]
	});
}
//#endregion
//#region resources/js/Utils/youtube.js
function getYouTubeEmbedUrl(url) {
	if (!url) return null;
	for (const pattern of [
		/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
		/youtu\.be\/([a-zA-Z0-9_-]+)/,
		/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
		/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/
	]) {
		const match = url.match(pattern);
		if (match) return `https://www.youtube.com/embed/${match[1]}`;
	}
	return null;
}
//#endregion
//#region resources/js/Pages/Public/Projects/Show.jsx
var Show_exports$1 = /* @__PURE__ */ __exportAll({ default: () => ProjectShow });
function extractEmbedSrc$1(value) {
	if (!value) return "";
	const match = value.match(/src\s*=\s*"([^"]+)"/i) || value.match(/src\s*=\s*'([^']+)'/i);
	return match ? match[1] : value;
}
var PLACEHOLDER$1 = "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 600\"%3E%3Crect fill=\"%23F0F0F0\" width=\"800\" height=\"600\"/%3E%3C/svg%3E";
function ProjectShow({ project }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [lightboxIndex, setLightboxIndex] = useState(null);
	const [activeImageIndex, setActiveImageIndex] = useState(null);
	const images = project?.images ?? [];
	const units = project?.units ?? [];
	const mainImage = images.find((img) => img.is_main || img.is_primary) || images[0];
	const mainImageIndex = Math.max(images.indexOf(mainImage), 0);
	const selectedImageIndex = activeImageIndex ?? mainImageIndex;
	const selectedImage = images[selectedImageIndex] || mainImage;
	const thumbnail = selectedImage?.url || (selectedImage?.path ? selectedImage.path.startsWith("http") || selectedImage.path.startsWith("/") ? selectedImage.path : `/storage/${selectedImage.path}` : PLACEHOLDER$1);
	const jsonLd = useMemo(() => {
		if (!project) return null;
		return {
			"@context": "https://schema.org",
			"@type": "RealEstateListing",
			name: project.name,
			description: project.description,
			url: window.location.href,
			image: mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : null),
			numberOfUnits: project.units?.length || 0,
			...project.location_address ? { address: {
				"@type": "PostalAddress",
				addressLocality: project.location_address
			} } : {}
		};
	}, [project, mainImage]);
	if (!project) return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 flex items-center justify-center",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-muted text-sm",
					children: trans("no_projects") || trans("no_results")
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${project?.name || ""} - ${trans("site_title")}`,
				description: project?.meta_description || project?.description || "",
				keywords: project?.keywords || "",
				ogImage: mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : null),
				ogType: "website",
				canonical: window.location.href
			}),
			jsonLd && /* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 w-full space-y-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-2 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-xl shadow-card overflow-hidden relative group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative overflow-hidden",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: thumbnail,
											alt: project.alt_text || project.name,
											className: "w-full h-64 sm:h-80 lg:h-96 object-cover"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setLightboxIndex(selectedImageIndex),
											className: "absolute top-4 end-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium hover:scale-105 z-10",
											title: trans("zoom") || "تكبير الصورة",
											"aria-label": "Zoom image",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: 2,
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
												})
											}), /* @__PURE__ */ jsx("span", { children: trans("zoom") })]
										}),
										images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													setActiveImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
												},
												className: "absolute start-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10",
												"aria-label": "Previous image",
												children: /* @__PURE__ */ jsx("svg", {
													className: `w-5 h-5 ${isRtl ? "rotate-180" : ""}`,
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2.5,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M15.75 19.5L8.25 12l7.5-7.5"
													})
												})
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													setActiveImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
												},
												className: "absolute end-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10",
												"aria-label": "Next image",
												children: /* @__PURE__ */ jsx("svg", {
													className: `w-5 h-5 ${isRtl ? "rotate-180" : ""}`,
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2.5,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M8.25 4.5l7.5 7.5-7.5 7.5"
													})
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute bottom-4 start-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium z-10",
												children: [
													selectedImageIndex + 1,
													" / ",
													images.length
												]
											})
										] })
									]
								}), images.length > 1 && /* @__PURE__ */ jsx("div", {
									className: "flex gap-2 p-3 overflow-x-auto bg-slate-50 border-t border-secondary-100",
									children: images.map((img, i) => /* @__PURE__ */ jsx("img", {
										src: img.thumb_url || img.url || (img.path?.startsWith("http") || img.path?.startsWith("/") ? img.path : `/storage/${img.path}`),
										alt: img.alt_text || "",
										className: `w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${i === selectedImageIndex ? "border-primary-900 ring-2 ring-primary-900/30 scale-105" : "border-transparent opacity-70 hover:opacity-100 hover:border-secondary-300"}`,
										onClick: () => setActiveImageIndex(i)
									}, i))
								})]
							}),
							project.video_url && (() => {
								const embedUrl = getYouTubeEmbedUrl(project.video_url);
								return /* @__PURE__ */ jsx("div", {
									className: "bg-white rounded-xl shadow-card overflow-hidden aspect-video",
									children: embedUrl ? /* @__PURE__ */ jsx("iframe", {
										src: embedUrl,
										title: project.name,
										className: "w-full h-full",
										allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
										allowFullScreen: true
									}) : /* @__PURE__ */ jsx("a", {
										href: project.video_url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex items-center justify-center h-full text-primary-900",
										children: trans("watch_video")
									})
								});
							})(),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-xl shadow-card p-6",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-2xl font-bold text-secondary-950 mb-2",
										children: project.name
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-sm text-muted mb-4",
										children: [project.area?.name || "", units.length > 0 && /* @__PURE__ */ jsxs("span", { children: [
											" · ",
											units.length,
											" ",
											trans("units_count") || trans("plural")
										] })]
									}),
									project.description && /* @__PURE__ */ jsxs("div", {
										className: "mb-6",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-2",
											children: trans("description", {}, "projects")
										}), /* @__PURE__ */ jsx("p", {
											className: "text-sm text-secondary-800 leading-relaxed whitespace-pre-line",
											children: project.description
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap gap-2 mb-6",
										children: [project.payment_method && /* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200",
											children: trans(project.payment_method)
										}), project.finishingType && /* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200",
											children: locale === "ar" ? project.finishingType.name_ar : project.finishingType.name_en
										})]
									}),
									["installment", "both"].includes(project.payment_method) && (project.down_payment || project.installment_years) && /* @__PURE__ */ jsxs("div", {
										className: "mb-6 bg-surface p-4 rounded-xl border border-secondary-100",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-3",
											children: trans("payment_details") || "Payment Details"
										}), /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-2 gap-4",
											children: [project.down_payment && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted mb-1",
												children: trans("down_payment") || "Down Payment"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-secondary-950",
												children: !isNaN(project.down_payment) && !isNaN(parseFloat(project.down_payment)) ? Number(project.down_payment).toLocaleString(locale === "ar" ? "ar-SA" : "en-US") : project.down_payment
											})] }), project.installment_years && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted mb-1",
												children: trans("installment_years") || "Installment Years"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-secondary-950",
												children: project.installment_years
											})] })]
										})]
									}),
									project.features?.length > 0 && /* @__PURE__ */ jsxs("div", {
										className: "mb-6",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-3",
											children: trans("features") || "Features"
										}), /* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
											children: project.features.map((feature) => /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("svg", {
													className: "w-5 h-5 text-primary-900 shrink-0",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M5 13l4 4L19 7"
													})
												}), /* @__PURE__ */ jsx("span", {
													className: "text-sm text-secondary-800",
													children: locale === "ar" ? feature.name_ar : feature.name_en
												})]
											}, feature.id))
										})]
									}),
									project.map_embed_url && /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-2",
											children: trans("location", {}, "projects")
										}),
										project.location_address && /* @__PURE__ */ jsx("p", {
											className: "text-sm text-muted mb-2",
											children: project.location_address
										}),
										/* @__PURE__ */ jsx("iframe", {
											src: extractEmbedSrc$1(project.map_embed_url),
											className: "w-full aspect-video rounded-lg",
											allowFullScreen: true,
											loading: "lazy",
											referrerPolicy: "no-referrer-when-downgrade",
											title: "Google Maps"
										})
									] })
								]
							})
						]
					}), /* @__PURE__ */ jsx("div", { children: project.user && /* @__PURE__ */ jsx(AgentCard, { agent: {
						id: project.user.id,
						name: project.user.name,
						avatar: project.user.profile?.avatar,
						phone: project.user.profile?.phone,
						whatsapp: project.user.profile?.whatsapp,
						facebook: project.user.profile?.facebook
					} }) })]
				}), units.length > 0 && /* @__PURE__ */ jsxs("section", {
					className: "bg-white rounded-xl shadow-card p-6 sm:p-8 border-t-4 border-primary-900 mt-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-8",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-bold text-secondary-950",
							children: trans("units_in_project", {}, "projects")
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted mt-1",
							children: project.name
						})] }), /* @__PURE__ */ jsxs("span", {
							className: "px-4 py-1.5 bg-primary-50 text-primary-900 text-sm font-semibold rounded-full border border-primary-100",
							children: [
								units.length,
								" ",
								trans("units_count")
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
						children: units.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
					})]
				})]
			}),
			lightboxIndex !== null && images.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center",
				onClick: () => setLightboxIndex(null),
				children: [
					/* @__PURE__ */ jsx("button", {
						onClick: () => setLightboxIndex(null),
						className: "absolute top-4 end-4 text-white text-2xl",
						"aria-label": trans("close"),
						children: "✕"
					}),
					/* @__PURE__ */ jsx("img", {
						src: images[lightboxIndex]?.url || (images[lightboxIndex]?.path?.startsWith("http") || images[lightboxIndex]?.path?.startsWith("/") ? images[lightboxIndex]?.path : `/storage/${images[lightboxIndex]?.path}`),
						alt: "",
						className: "max-w-[90vw] max-h-[90vh] object-contain",
						onClick: (e) => e.stopPropagation()
					}),
					images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: (e) => {
							e.stopPropagation();
							setLightboxIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
						},
						className: `absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`,
						"aria-label": trans("previous"),
						children: /* @__PURE__ */ jsx("svg", {
							className: `w-6 h-6 ${isRtl ? "rotate-180" : ""}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M15 19l-7-7 7-7"
							})
						})
					}), /* @__PURE__ */ jsx("button", {
						onClick: (e) => {
							e.stopPropagation();
							setLightboxIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
						},
						className: `absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-4" : "right-4"} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`,
						"aria-label": trans("next"),
						children: /* @__PURE__ */ jsx("svg", {
							className: `w-6 h-6 ${isRtl ? "rotate-180" : ""}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M9 5l7 7-7 7"
							})
						})
					})] }),
					images.length > 1 && /* @__PURE__ */ jsx("div", {
						className: "absolute bottom-4 flex gap-2",
						children: images.map((_, i) => /* @__PURE__ */ jsx("button", {
							onClick: (e) => {
								e.stopPropagation();
								setLightboxIndex(i);
							},
							className: `w-3 h-3 rounded-full ${i === lightboxIndex ? "bg-white" : "bg-white/40"}`
						}, i))
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Units/Deals.jsx
var Deals_exports = /* @__PURE__ */ __exportAll({ default: () => UnitsDeals });
function UnitsDeals({ units, filters, areas, unitTypes, features, finishingTypes }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isLoading = !units;
	const hasUnits = units?.data?.length > 0;
	function handleSearch(params) {
		router.get(`/${locale}/units/deals`, params, { preserveState: true });
	}
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("deals_page_title")} - ${trans("site_title")}`,
				description: trans("deals_description"),
				canonical: typeof window !== "undefined" ? window.location.href : ""
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 w-full",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-secondary-950 mb-6",
						children: trans("deals_page_title", {}, "common")
					}),
					/* @__PURE__ */ jsx("section", {
						className: "mb-8",
						children: /* @__PURE__ */ jsx(SearchBar, {
							areas,
							unitTypes,
							features,
							finishingTypes,
							filters,
							onSearch: handleSearch
						})
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
						children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(UnitCard, { loading: true }, i))
					}) : hasUnits ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
						children: units.data.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
					}), /* @__PURE__ */ jsx(Pagination, {
						meta: units,
						links: units.links
					})] }) : /* @__PURE__ */ jsx("div", {
						className: "text-center py-16",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-muted text-sm",
							children: trans("deals_page_empty", {}, "common")
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Units/Index.jsx
var Index_exports = /* @__PURE__ */ __exportAll({ default: () => UnitsIndex });
function UnitsIndex({ units, filters, areas, unitTypes, features, finishingTypes }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const isLoading = !units;
	const hasUnits = units?.data?.length > 0;
	function handleSearch(params) {
		router.get(`/${locale}/units`, params, { preserveState: true });
	}
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${trans("page_title")} - ${trans("site_title")}`,
				description: trans("page_description"),
				canonical: window.location.href
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 w-full",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold text-secondary-950 mb-6",
						children: trans("page_title", {}, "units")
					}),
					/* @__PURE__ */ jsx("section", {
						className: "mb-8",
						children: /* @__PURE__ */ jsx(SearchBar, {
							areas,
							unitTypes,
							features,
							finishingTypes,
							filters,
							onSearch: handleSearch
						})
					}),
					isLoading ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
						children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(UnitCard, { loading: true }, i))
					}) : hasUnits ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
						children: units.data.map((unit) => /* @__PURE__ */ jsx(UnitCard, { unit }, unit.id))
					}), /* @__PURE__ */ jsx(Pagination, {
						meta: units,
						links: units.links
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "text-center py-16",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-muted text-sm mb-2",
							children: trans("no_results")
						}), /* @__PURE__ */ jsx("p", {
							className: "text-muted text-xs",
							children: trans("try_different_filters")
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Pages/Public/Units/Show.jsx
var Show_exports = /* @__PURE__ */ __exportAll({ default: () => UnitShow });
var PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 600\"%3E%3Crect fill=\"%23F0F0F0\" width=\"800\" height=\"600\"/%3E%3C/svg%3E";
function extractEmbedSrc(value) {
	if (!value) return "";
	const match = value.match(/src\s*=\s*"([^"]+)"/i) || value.match(/src\s*=\s*'([^']+)'/i);
	return match ? match[1] : value;
}
function UnitShow({ unit, similarUnits }) {
	const { locale, flash } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const [lightboxIndex, setLightboxIndex] = useState(null);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const [sentSuccess, setSentSuccess] = useState(false);
	const jsonLd = useMemo(() => {
		if (!unit) return null;
		return {
			"@context": "https://schema.org",
			"@type": "RealEstateListing",
			name: unit.name,
			description: unit.description,
			url: window.location.href,
			image: unit.images?.[0]?.url || (unit.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null),
			offers: {
				"@type": "Offer",
				price: unit.price,
				priceCurrency: "EGP",
				availability: "https://schema.org/InStock"
			},
			...unit.area_sqm ? { floorSize: {
				"@type": "QuantitativeValue",
				value: unit.area_sqm,
				unitCode: "MTK"
			} } : {},
			numberOfRooms: unit.rooms,
			numberOfBathroomsTotal: unit.bathrooms,
			floorLevel: unit.floor,
			...unit.location_address ? { address: {
				"@type": "PostalAddress",
				addressLocality: unit.location_address
			} } : {}
		};
	}, [unit]);
	const { data, setData, post, processing, errors } = useForm({
		client_name: "",
		client_phone: "",
		client_email: "",
		content: ""
	});
	const images = unit?.images ?? [];
	const selectedImage = images[activeImageIndex] || images[0];
	const thumbnail = selectedImage?.url || (selectedImage?.path ? selectedImage.path.startsWith("http") || selectedImage.path.startsWith("/") ? selectedImage.path : `/storage/${selectedImage.path}` : PLACEHOLDER);
	function handleSubmit(e) {
		e.preventDefault();
		const submitUrl = window.location.pathname.startsWith("/en") ? `/en/units/${unit.slug}/contact` : `/units/${unit.slug}/contact`;
		post(submitUrl, {
			preserveScroll: true,
			onSuccess: () => {
				setData({
					client_name: "",
					client_phone: "",
					client_email: "",
					content: ""
				});
				setSentSuccess(true);
				setTimeout(() => setSentSuccess(false), 7e3);
			}
		});
	}
	const embedUrl = getYouTubeEmbedUrl(unit?.video_url);
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-surface flex flex-col",
		children: [
			/* @__PURE__ */ jsx(SeoHead, {
				title: `${unit?.name || ""} - ${trans("site_title")}`,
				description: unit?.meta_description || unit?.description || "",
				keywords: unit?.keywords || "",
				ogImage: unit?.images?.[0]?.path ? `/storage/${unit.images[0].path}` : null,
				ogType: "website",
				canonical: window.location.href
			}),
			jsonLd && /* @__PURE__ */ jsx("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-container mx-auto px-4 py-8 w-full",
				children: [!unit ? /* @__PURE__ */ jsx("div", {
					className: "text-center py-16",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-muted text-sm",
						children: trans("no_results")
					})
				}) : /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-2 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-xl shadow-card overflow-hidden relative group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative overflow-hidden",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: thumbnail,
											alt: unit.alt_text || unit.name,
											className: "w-full h-64 sm:h-80 lg:h-96 object-cover"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setLightboxIndex(activeImageIndex),
											className: "absolute top-4 end-4 bg-black/60 hover:bg-black/85 text-white p-2.5 rounded-xl shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-medium hover:scale-105 z-10",
											title: trans("zoom") || "تكبير الصورة",
											"aria-label": "Zoom image",
											children: [/* @__PURE__ */ jsx("svg", {
												className: "w-4 h-4",
												fill: "none",
												viewBox: "0 0 24 24",
												stroke: "currentColor",
												strokeWidth: 2,
												children: /* @__PURE__ */ jsx("path", {
													strokeLinecap: "round",
													strokeLinejoin: "round",
													d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
												})
											}), /* @__PURE__ */ jsx("span", { children: trans("zoom") })]
										}),
										images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													setActiveImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
												},
												className: "absolute start-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10",
												"aria-label": "Previous image",
												children: /* @__PURE__ */ jsx("svg", {
													className: `w-5 h-5 ${isRtl ? "rotate-180" : ""}`,
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2.5,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M15.75 19.5L8.25 12l7.5-7.5"
													})
												})
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: (e) => {
													e.stopPropagation();
													setActiveImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
												},
												className: "absolute end-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 z-10",
												"aria-label": "Next image",
												children: /* @__PURE__ */ jsx("svg", {
													className: `w-5 h-5 ${isRtl ? "rotate-180" : ""}`,
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2.5,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M8.25 4.5l7.5 7.5-7.5 7.5"
													})
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute bottom-4 start-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium z-10",
												children: [
													activeImageIndex + 1,
													" / ",
													images.length
												]
											})
										] })
									]
								}), images.length > 1 && /* @__PURE__ */ jsx("div", {
									className: "flex gap-2 p-3 overflow-x-auto bg-slate-50 border-t border-secondary-100",
									children: images.map((img, i) => /* @__PURE__ */ jsx("img", {
										src: img.thumb_url || img.url || (img.path?.startsWith("http") || img.path?.startsWith("/") ? img.path : `/storage/${img.path}`),
										alt: img.alt_text || "",
										className: `w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${i === activeImageIndex ? "border-primary-900 ring-2 ring-primary-900/30 scale-105" : "border-transparent opacity-70 hover:opacity-100 hover:border-secondary-300"}`,
										onClick: () => setActiveImageIndex(i)
									}, i))
								})]
							}),
							unit.video_url && /* @__PURE__ */ jsx("div", {
								className: "bg-white rounded-xl shadow-card overflow-hidden aspect-video",
								children: embedUrl ? /* @__PURE__ */ jsx("iframe", {
									src: embedUrl,
									title: unit.name,
									className: "w-full h-full",
									allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
									allowFullScreen: true
								}) : unit.video_path ? /* @__PURE__ */ jsx("video", {
									controls: true,
									className: "w-full h-full",
									children: /* @__PURE__ */ jsx("source", { src: unit.video_path })
								}) : /* @__PURE__ */ jsx("a", {
									href: unit.video_url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center justify-center h-full text-primary-900",
									children: trans("watch_video")
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-xl shadow-card p-6",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-2xl font-bold text-secondary-950 mb-2",
										children: unit.name
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-sm text-muted mb-4",
										children: [(locale === "ar" ? unit.area?.name_ar : unit.area?.name_en) || "", unit.type ? ` · ${locale === "ar" ? unit.type.name_ar : unit.type.name_en}` : ""]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-3xl font-bold text-primary-900 mb-6",
										children: [Number(unit.price).toLocaleString(locale === "ar" ? "ar-SA" : "en-US"), /* @__PURE__ */ jsx("span", {
											className: "text-base text-muted font-normal me-2",
											children: trans(unit.transaction === "rent" ? "rent" : "sale", {}, "units")
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap gap-2 mb-6",
										children: [unit.payment_method && /* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200",
											children: trans(unit.payment_method)
										}), unit.finishingType && /* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 bg-surface rounded-full text-sm font-medium text-secondary-800 border border-secondary-200",
											children: locale === "ar" ? unit.finishingType.name_ar : unit.finishingType.name_en
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6",
										children: [
											unit.area_sqm && /* @__PURE__ */ jsxs("div", {
												className: "text-center p-3 bg-surface rounded-lg",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-lg font-bold text-secondary-950",
													children: unit.area_sqm
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted",
													children: trans("area_sqm", {}, "units")
												})]
											}),
											unit.rooms && /* @__PURE__ */ jsxs("div", {
												className: "text-center p-3 bg-surface rounded-lg",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-lg font-bold text-secondary-950",
													children: unit.rooms
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted",
													children: trans("rooms", {}, "units")
												})]
											}),
											unit.bathrooms && /* @__PURE__ */ jsxs("div", {
												className: "text-center p-3 bg-surface rounded-lg",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-lg font-bold text-secondary-950",
													children: unit.bathrooms
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted",
													children: trans("bathrooms", {}, "units")
												})]
											}),
											unit.floor !== null && unit.floor !== void 0 && /* @__PURE__ */ jsxs("div", {
												className: "text-center p-3 bg-surface rounded-lg",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-lg font-bold text-secondary-950",
													children: unit.floor
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs text-muted",
													children: trans("floor", {}, "units")
												})]
											})
										]
									}),
									(() => {
										const desc = locale === "ar" ? unit.description_ar || unit.description : unit.description_en || unit.description;
										return desc ? /* @__PURE__ */ jsxs("div", {
											className: "mb-6",
											children: [/* @__PURE__ */ jsx("h2", {
												className: "text-lg font-semibold text-secondary-950 mb-2",
												children: trans("description", {}, "units")
											}), /* @__PURE__ */ jsx("p", {
												className: "text-sm text-secondary-800 leading-relaxed whitespace-pre-line",
												children: desc
											})]
										}) : null;
									})(),
									["installment", "both"].includes(unit.payment_method) && (unit.down_payment || unit.installment_years) && /* @__PURE__ */ jsxs("div", {
										className: "mb-6 bg-surface p-4 rounded-xl border border-secondary-100",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-3",
											children: trans("payment_details") || "Payment Details"
										}), /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-2 gap-4",
											children: [unit.down_payment && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted mb-1",
												children: trans("down_payment") || "Down Payment"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-secondary-950",
												children: !isNaN(unit.down_payment) && !isNaN(parseFloat(unit.down_payment)) ? Number(unit.down_payment).toLocaleString(locale === "ar" ? "ar-SA" : "en-US") : unit.down_payment
											})] }), unit.installment_years && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-muted mb-1",
												children: trans("installment_years") || "Installment Years"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-sm font-bold text-secondary-950",
												children: unit.installment_years
											})] })]
										})]
									}),
									unit.features?.length > 0 && /* @__PURE__ */ jsxs("div", {
										className: "mb-6",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-3",
											children: trans("features") || "Features"
										}), /* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
											children: unit.features.map((feature) => /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("svg", {
													className: "w-5 h-5 text-primary-900 shrink-0",
													fill: "none",
													viewBox: "0 0 24 24",
													stroke: "currentColor",
													strokeWidth: 2,
													children: /* @__PURE__ */ jsx("path", {
														strokeLinecap: "round",
														strokeLinejoin: "round",
														d: "M5 13l4 4L19 7"
													})
												}), /* @__PURE__ */ jsx("span", {
													className: "text-sm text-secondary-800",
													children: locale === "ar" ? feature.name_ar : feature.name_en
												})]
											}, feature.id))
										})]
									}),
									unit.map_embed_url && /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("h2", {
											className: "text-lg font-semibold text-secondary-950 mb-2",
											children: trans("location", {}, "units")
										}),
										unit.location_address && /* @__PURE__ */ jsx("p", {
											className: "text-sm text-muted mb-2",
											children: unit.location_address
										}),
										/* @__PURE__ */ jsx("iframe", {
											src: extractEmbedSrc(unit.map_embed_url),
											className: "w-full aspect-video rounded-lg",
											allowFullScreen: true,
											loading: "lazy",
											referrerPolicy: "no-referrer-when-downgrade",
											title: "Google Maps"
										})
									] })
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [unit.user && /* @__PURE__ */ jsx(AgentCard, { agent: {
							id: unit.user.id,
							name: unit.user.name,
							avatar: unit.user.profile?.avatar,
							phone: unit.user.profile?.phone,
							whatsapp: unit.user.profile?.whatsapp,
							facebook: unit.user.profile?.facebook
						} }), /* @__PURE__ */ jsxs("div", {
							className: "bg-white rounded-xl shadow-card p-6",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-semibold text-secondary-950 mb-4",
									children: trans("contact_agent", {}, "units")
								}),
								(sentSuccess || flash?.success) && /* @__PURE__ */ jsx("div", {
									className: "mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium transition-all",
									children: flash?.success || trans("unit_message_sent_success")
								}),
								/* @__PURE__ */ jsxs("form", {
									onSubmit: handleSubmit,
									noValidate: true,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-medium text-secondary-950 mb-1",
													children: trans("your_name", {}, "messages")
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: data.client_name,
													onChange: (e) => setData("client_name", e.target.value),
													required: true,
													className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
												}),
												errors.client_name && /* @__PURE__ */ jsx("p", {
													className: "text-xs text-error mt-1",
													children: errors.client_name
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-medium text-secondary-950 mb-1",
												children: trans("your_phone", {}, "messages")
											}), /* @__PURE__ */ jsx("input", {
												type: "tel",
												value: data.client_phone,
												onChange: (e) => setData("client_phone", e.target.value),
												className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-3",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-medium text-secondary-950 mb-1",
												children: trans("your_email", {}, "messages")
											}), /* @__PURE__ */ jsx("input", {
												type: "email",
												value: data.client_email,
												onChange: (e) => setData("client_email", e.target.value),
												className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mb-4",
											children: [
												/* @__PURE__ */ jsx("label", {
													className: "block text-xs font-medium text-secondary-950 mb-1",
													children: trans("your_message", {}, "messages")
												}),
												/* @__PURE__ */ jsx("textarea", {
													value: data.content,
													onChange: (e) => setData("content", e.target.value),
													required: true,
													rows: 4,
													className: "w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
												}),
												errors.content && /* @__PURE__ */ jsx("p", {
													className: "text-xs text-error mt-1",
													children: errors.content
												})
											]
										}),
										/* @__PURE__ */ jsx("button", {
											type: "submit",
											disabled: processing,
											className: "w-full px-4 py-2.5 bg-primary-900 text-white rounded-lg text-sm font-medium hover:bg-primary-950 transition-colors disabled:opacity-50",
											children: processing ? trans("loading", {}, "common") : trans("send_message", {}, "messages")
										})
									]
								})
							]
						})]
					})]
				}), similarUnits?.length > 0 && /* @__PURE__ */ jsxs("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-secondary-950 mb-6",
						children: trans("similar_units", {}, "units")
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: similarUnits.map((u) => /* @__PURE__ */ jsx(UnitCard, { unit: u }, u.id))
					})]
				})]
			}),
			lightboxIndex !== null && images.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 bg-black/80 flex items-center justify-center",
				onClick: () => setLightboxIndex(null),
				children: [
					/* @__PURE__ */ jsx("button", {
						onClick: () => setLightboxIndex(null),
						className: "absolute top-4 end-4 text-white text-2xl",
						"aria-label": trans("close"),
						children: "✕"
					}),
					/* @__PURE__ */ jsx("img", {
						src: images[lightboxIndex]?.url || (images[lightboxIndex]?.path?.startsWith("http") || images[lightboxIndex]?.path?.startsWith("/") ? images[lightboxIndex]?.path : `/storage/${images[lightboxIndex]?.path}`),
						alt: "",
						className: "max-w-[90vw] max-h-[90vh] object-contain",
						onClick: (e) => e.stopPropagation()
					}),
					images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
						onClick: (e) => {
							e.stopPropagation();
							setLightboxIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
						},
						className: `absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`,
						"aria-label": trans("previous"),
						children: /* @__PURE__ */ jsx("svg", {
							className: `w-6 h-6 ${isRtl ? "rotate-180" : ""}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M15 19l-7-7 7-7"
							})
						})
					}), /* @__PURE__ */ jsx("button", {
						onClick: (e) => {
							e.stopPropagation();
							setLightboxIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
						},
						className: `absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-4" : "right-4"} w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors`,
						"aria-label": trans("next"),
						children: /* @__PURE__ */ jsx("svg", {
							className: `w-6 h-6 ${isRtl ? "rotate-180" : ""}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M9 5l7 7-7 7"
							})
						})
					})] }),
					images.length > 1 && /* @__PURE__ */ jsx("div", {
						className: "absolute bottom-4 flex gap-2",
						children: images.map((_, i) => /* @__PURE__ */ jsx("button", {
							onClick: (e) => {
								e.stopPropagation();
								setLightboxIndex(i);
							},
							className: `w-3 h-3 rounded-full ${i === lightboxIndex ? "bg-white" : "bg-white/40"}`
						}, i))
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
//#region resources/js/Components/Layout/AuthLayout.jsx
function AuthLayout({ children, title, subtitle }) {
	const { locale, settings } = usePage().props;
	const trans = useTrans(locale);
	const isRtl = locale === "ar";
	const logoUrl = settings?.site_logo ? settings.site_logo.startsWith("http") || settings.site_logo.startsWith("/storage") ? settings.site_logo : `/storage/${settings.site_logo}` : "/icon.png";
	return /* @__PURE__ */ jsxs("div", {
		dir: isRtl ? "rtl" : "ltr",
		className: "min-h-screen bg-slate-50 text-secondary-950 flex flex-col justify-between relative font-sans selection:bg-primary-900 selection:text-white",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "relative z-10 w-full max-w-5xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "flex items-center gap-3 group transition-transform duration-200 hover:opacity-90",
					children: [/* @__PURE__ */ jsx("img", {
						src: logoUrl,
						alt: trans("brand_name"),
						className: "h-9 w-auto object-contain",
						onError: (e) => {
							e.currentTarget.src = "/icon.png";
						}
					}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", {
						className: "text-lg font-extrabold text-primary-900 block leading-tight",
						children: trans("app_name") || "فاميلي هوم"
					}) })]
				}), /* @__PURE__ */ jsxs(Link, {
					href: "/",
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-secondary-600 hover:text-primary-900 bg-white shadow-xs hover:shadow border border-secondary-200 px-3.5 py-2 rounded-lg transition-all",
					children: [/* @__PURE__ */ jsx("svg", {
						className: `w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`,
						fill: "none",
						stroke: "currentColor",
						viewBox: "0 0 24 24",
						children: /* @__PURE__ */ jsx("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M10 19l-7-7m0 0l7-7m-7 7h18"
						})
					}), /* @__PURE__ */ jsx("span", { children: isRtl ? "الرئيسية" : "Home" })]
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				className: "relative z-10 flex-1 flex items-start justify-center px-4 pt-4 sm:pt-8 pb-10",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-full max-w-md",
					children: /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl border border-secondary-200/90 shadow-lg shadow-secondary-950/5 p-6 sm:p-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-center mb-6",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-50 border border-secondary-100 mb-3 p-2",
									children: /* @__PURE__ */ jsx("img", {
										src: logoUrl,
										alt: trans("brand_name"),
										className: "w-full h-full object-contain",
										onError: (e) => {
											e.currentTarget.src = "/icon.png";
										}
									})
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-xl font-bold text-secondary-950",
									children: title || (isRtl ? "تسجيل الدخول" : "Sign In")
								}),
								subtitle && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-secondary-500 mt-1 max-w-xs mx-auto",
									children: subtitle
								})
							]
						}), children]
					})
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "relative z-10 text-center py-4 text-xs text-secondary-400 border-t border-secondary-200/50 bg-white/40",
				children: /* @__PURE__ */ jsxs("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					trans("app_name") || "فاميلي هوم",
					". ",
					isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."
				] })
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Shared/ForgotPassword.jsx
var ForgotPassword_exports = /* @__PURE__ */ __exportAll({ default: () => ForgotPassword });
function ForgotPassword() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const { data, setData, post, processing, errors } = useForm({ email: "" });
	function handleSubmit(e) {
		e.preventDefault();
		post("/forgot-password");
	}
	return /* @__PURE__ */ jsxs(AuthLayout, {
		title: trans("reset_password_title"),
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted mb-6 text-center",
				children: trans("forgot_password")
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				noValidate: true,
				children: [/* @__PURE__ */ jsx(InputField, {
					name: "email",
					label: trans("email"),
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					placeholder: trans("email_placeholder"),
					required: true,
					autoComplete: "email"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: processing,
					children: processing ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4",
								fill: "none"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), trans("send_reset_link")]
					}) : trans("send_reset_link")
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-6 text-center",
				children: /* @__PURE__ */ jsx("a", {
					href: localizedPath("/login", locale),
					className: "text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline",
					children: trans("back_to_login")
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Shared/Login.jsx
var Login_exports = /* @__PURE__ */ __exportAll({ default: () => Login });
function Login() {
	const { locale } = usePage().props;
	useTrans(locale);
	const isRtl = locale === "ar";
	const [showPassword, setShowPassword] = useState(false);
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	function handleSubmit(e) {
		e.preventDefault();
		post("/login");
	}
	return /* @__PURE__ */ jsx(AuthLayout, {
		title: isRtl ? "تسجيل الدخول" : "Sign In",
		subtitle: isRtl ? "أدخل معلومات حسابك للمتابعة" : "Enter your account credentials to continue",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-800 mb-1",
						children: isRtl ? "البريد الإلكتروني" : "Email Address"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-secondary-400",
							children: /* @__PURE__ */ jsx("svg", {
								className: "w-4 h-4",
								fill: "none",
								stroke: "currentColor",
								viewBox: "0 0 24 24",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 1.5,
									d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
								})
							})
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							name: "email",
							required: true,
							autoComplete: "email",
							value: data.email,
							onChange: (e) => setData("email", e.target.value),
							placeholder: isRtl ? "name@example.com" : "name@example.com",
							className: `w-full ps-9 pe-3 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${errors.email ? "border-red-500 focus:ring-red-500/20" : "border-secondary-200 focus:border-primary-900 focus:ring-primary-900/10"} rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4`
						})]
					}),
					errors.email && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-red-600 font-medium",
						children: errors.email
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-secondary-800 mb-1",
						children: isRtl ? "كلمة المرور" : "Password"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-secondary-400",
								children: /* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
									})
								})
							}),
							/* @__PURE__ */ jsx("input", {
								type: showPassword ? "text" : "password",
								name: "password",
								required: true,
								autoComplete: "current-password",
								value: data.password,
								onChange: (e) => setData("password", e.target.value),
								placeholder: "••••••••",
								className: `w-full ps-9 pe-10 py-2.5 bg-slate-50 text-secondary-950 placeholder-secondary-400 border ${errors.password ? "border-red-500 focus:ring-red-500/20" : "border-secondary-200 focus:border-primary-900 focus:ring-primary-900/10"} rounded-xl text-sm transition-all focus:bg-white focus:outline-none focus:ring-4`
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								className: "absolute inset-y-0 end-0 pe-3 flex items-center text-secondary-400 hover:text-secondary-700 transition-colors",
								"aria-label": showPassword ? isRtl ? "إخفاء كلمة المرور" : "Hide password" : isRtl ? "إظهار كلمة المرور" : "Show password",
								children: showPassword ? /* @__PURE__ */ jsx("svg", {
									className: "w-4 h-4",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
									})
								}) : /* @__PURE__ */ jsxs("svg", {
									className: "w-4 h-4",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: [/* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M2.036 12c1.349-3.938 5.143-7 9.964-7s8.615 3.062 9.964 7c-1.349 3.938-5.143 7-9.964 7s-8.615-3.062-9.964-7z"
									}), /* @__PURE__ */ jsx("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 1.5,
										d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									})]
								})
							})
						]
					}),
					errors.password && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-red-600 font-medium",
						children: errors.password
					})
				] }),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-between text-xs pt-0.5",
					children: /* @__PURE__ */ jsxs("label", {
						className: "flex items-center gap-2 text-secondary-700 cursor-pointer select-none",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							name: "remember",
							checked: data.remember,
							onChange: (e) => setData("remember", e.target.checked),
							className: "w-4 h-4 rounded border-secondary-300 text-primary-900 focus:ring-primary-900/20 cursor-pointer"
						}), /* @__PURE__ */ jsx("span", { children: isRtl ? "تذكرني" : "Remember me" })]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-2",
					children: /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: processing,
						className: "w-full py-3 px-4 bg-primary-900 hover:bg-primary-950 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2",
						children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4 text-white",
							fill: "none",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), /* @__PURE__ */ jsx("span", { children: isRtl ? "جارٍ الدخول..." : "Signing in..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: isRtl ? "تسجيل الدخول" : "Sign In" }), /* @__PURE__ */ jsx("svg", {
							className: `w-4 h-4 ${isRtl ? "rotate-180" : ""}`,
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ jsx("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M14 5l7 7m0 0l-7 7m7-7H3"
							})
						})] })
					})
				})
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Shared/Profile.jsx
var Profile_exports = /* @__PURE__ */ __exportAll({ default: () => Profile });
function Profile() {
	const { locale, auth } = usePage().props;
	const trans = useTrans(locale);
	const user = auth.user;
	const profileForm = useForm({
		name: user?.name || "",
		phone: user?.phone || "",
		whatsapp: user?.whatsapp || "",
		facebook: user?.facebook || ""
	});
	const passwordForm = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	function handleProfileSubmit(e) {
		e.preventDefault();
		profileForm.put("/profile");
	}
	function handlePasswordSubmit(e) {
		e.preventDefault();
		passwordForm.put("/password");
	}
	function handleAvatarChange(e) {
		const file = e.target.files?.[0];
		if (file) {
			const form = new FormData();
			form.append("avatar", file);
			router.post("/profile/avatar", form, {
				forceFormData: true,
				preserveScroll: true
			});
		}
	}
	return /* @__PURE__ */ jsx(AuthLayout, {
		title: trans("profile_title"),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ jsxs("section", { children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold text-secondary-950 mb-4",
						children: trans("profile_info")
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-20 h-20 rounded-full bg-surface overflow-hidden flex-shrink-0 border-2 border-secondary-200",
							children: user?.avatar ? /* @__PURE__ */ jsx("img", {
								src: user.avatar,
								alt: user.name,
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ jsx("div", {
								className: "w-full h-full flex items-center justify-center text-2xl font-bold text-secondary-400 bg-surface",
								children: user?.name?.charAt(0) || "?"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-secondary-950",
								children: user?.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted",
								children: user?.email
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "inline-block mt-2 text-xs text-primary-900 hover:text-primary-950 cursor-pointer underline-offset-2 hover:underline",
								children: [trans("upload_avatar"), /* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: handleAvatarChange
								})]
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleProfileSubmit,
						noValidate: true,
						children: [
							/* @__PURE__ */ jsx(InputField, {
								name: "name",
								label: trans("name"),
								value: profileForm.data.name,
								onChange: (e) => profileForm.setData("name", e.target.value),
								required: true
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "phone",
								label: trans("phone"),
								type: "tel",
								value: profileForm.data.phone,
								onChange: (e) => profileForm.setData("phone", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "whatsapp",
								label: trans("whatsapp"),
								type: "tel",
								value: profileForm.data.whatsapp,
								onChange: (e) => profileForm.setData("whatsapp", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(InputField, {
								name: "facebook",
								label: trans("facebook"),
								type: "url",
								value: profileForm.data.facebook,
								onChange: (e) => profileForm.setData("facebook", e.target.value),
								dir: "ltr"
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: profileForm.processing,
								className: "mt-2",
								children: profileForm.processing ? trans("loading") : trans("save")
							})
						]
					})
				] }),
				/* @__PURE__ */ jsx("hr", { className: "border-secondary-200" }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-semibold text-secondary-950 mb-4",
					children: trans("change_password")
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handlePasswordSubmit,
					noValidate: true,
					children: [
						/* @__PURE__ */ jsx(InputField, {
							name: "current_password",
							label: trans("current_password"),
							type: "password",
							value: passwordForm.data.current_password,
							onChange: (e) => passwordForm.setData("current_password", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "current-password"
						}),
						/* @__PURE__ */ jsx(InputField, {
							name: "password",
							label: trans("new_password"),
							type: "password",
							value: passwordForm.data.password,
							onChange: (e) => passwordForm.setData("password", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx(InputField, {
							name: "password_confirmation",
							label: trans("confirm_password"),
							type: "password",
							value: passwordForm.data.password_confirmation,
							onChange: (e) => passwordForm.setData("password_confirmation", e.target.value),
							placeholder: "••••••••",
							required: true,
							autoComplete: "new-password"
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: passwordForm.processing,
							className: "mt-2",
							children: passwordForm.processing ? trans("loading") : trans("change_password")
						})
					]
				})] })
			]
		})
	});
}
//#endregion
//#region resources/js/Pages/Shared/ResetPassword.jsx
var ResetPassword_exports = /* @__PURE__ */ __exportAll({ default: () => ResetPassword });
function ResetPassword() {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	const { data, setData, post, processing, errors } = useForm({
		token: "",
		email: "",
		password: "",
		password_confirmation: ""
	});
	function handleSubmit(e) {
		e.preventDefault();
		post("/reset-password");
	}
	return /* @__PURE__ */ jsxs(AuthLayout, {
		title: trans("reset_password_title"),
		children: [/* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			children: [
				/* @__PURE__ */ jsx("input", {
					type: "hidden",
					name: "token",
					value: data.token
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "email",
					label: trans("email"),
					type: "email",
					value: data.email,
					onChange: (e) => setData("email", e.target.value),
					placeholder: trans("email_placeholder"),
					required: true,
					autoComplete: "email"
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "password",
					label: trans("new_password"),
					type: "password",
					value: data.password,
					onChange: (e) => setData("password", e.target.value),
					placeholder: "••••••••",
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted mb-4 -mt-2",
					children: trans("password_requirements")
				}),
				/* @__PURE__ */ jsx(InputField, {
					name: "password_confirmation",
					label: trans("confirm_password"),
					type: "password",
					value: data.password_confirmation,
					onChange: (e) => setData("password_confirmation", e.target.value),
					placeholder: "••••••••",
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: processing,
					children: processing ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ jsxs("svg", {
							className: "animate-spin h-4 w-4",
							viewBox: "0 0 24 24",
							children: [/* @__PURE__ */ jsx("circle", {
								className: "opacity-25",
								cx: "12",
								cy: "12",
								r: "10",
								stroke: "currentColor",
								strokeWidth: "4",
								fill: "none"
							}), /* @__PURE__ */ jsx("path", {
								className: "opacity-75",
								fill: "currentColor",
								d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							})]
						}), trans("reset_button")]
					}) : trans("reset_button")
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ jsx("a", {
				href: localizedPath("/login", locale),
				className: "text-sm text-primary-900 hover:text-primary-950 underline-offset-2 hover:underline",
				children: trans("back_to_login")
			})
		})]
	});
}
//#endregion
//#region resources/js/Pages/Shared/Welcome.jsx
var Welcome_exports = /* @__PURE__ */ __exportAll({ default: () => Welcome });
function Welcome({ auth, laravelVersion, phpVersion }) {
	const { locale } = usePage().props;
	const trans = useTrans(locale);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: `${trans("app_name")} - ${trans("brand_tagline")}` }), /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-[#F5F5F5]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "text-center p-8",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-bold text-[#1A1A1A]",
					children: trans("app_name")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-[#6B6B6B] mt-2",
					children: trans("brand_tagline")
				}),
				auth.user && /* @__PURE__ */ jsxs("p", {
					className: "text-[#CC0000] mt-4 font-semibold",
					children: [
						trans("login_title"),
						" ",
						auth.user.name
					]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-sm text-[#6B6B6B] mt-8",
					children: [
						"Laravel ",
						laravelVersion,
						" / PHP ",
						phpVersion
					]
				})
			]
		})
	})] });
}
//#endregion
//#region resources/js/ssr.jsx
createServer((page) => createInertiaApp({
	page,
	render: renderToString,
	resolve: (name) => {
		return (/* @__PURE__ */ Object.assign({
			"./Pages/Admin/About/Edit.jsx": Edit_exports$1,
			"./Pages/Admin/Areas/Index.jsx": Index_exports$16,
			"./Pages/Admin/Articles/Form.jsx": Form_exports$2,
			"./Pages/Admin/Articles/Index.jsx": Index_exports$15,
			"./Pages/Admin/Categories/Index.jsx": Index_exports$14,
			"./Pages/Admin/Dashboard.jsx": Dashboard_exports,
			"./Pages/Admin/Features/Index.jsx": Index_exports$13,
			"./Pages/Admin/FinishingTypes/Index.jsx": Index_exports$12,
			"./Pages/Admin/Messages/Index.jsx": Index_exports$11,
			"./Pages/Admin/Notifications/Index.jsx": Index_exports$10,
			"./Pages/Admin/Points/Index.jsx": Index_exports$9,
			"./Pages/Admin/Points/Ledger.jsx": Ledger_exports,
			"./Pages/Admin/Profile/Edit.jsx": Edit_exports,
			"./Pages/Admin/Projects/Form.jsx": Form_exports$1,
			"./Pages/Admin/Projects/Index.jsx": Index_exports$8,
			"./Pages/Admin/SeoPages/Index.jsx": Index_exports$7,
			"./Pages/Admin/Settings/Index.jsx": Index_exports$6,
			"./Pages/Admin/UnitTypes/Index.jsx": Index_exports$5,
			"./Pages/Admin/Units/Form.jsx": Form_exports,
			"./Pages/Admin/Units/Index.jsx": Index_exports$4,
			"./Pages/Admin/Users/Create.jsx": Create_exports,
			"./Pages/Admin/Users/Index.jsx": Index_exports$3,
			"./Pages/Public/About.jsx": About_exports,
			"./Pages/Public/Agents/Show.jsx": Show_exports$3,
			"./Pages/Public/Articles/Index.jsx": Index_exports$2,
			"./Pages/Public/Articles/Show.jsx": Show_exports$2,
			"./Pages/Public/Comparison.jsx": Comparison_exports,
			"./Pages/Public/Contact.jsx": Contact_exports,
			"./Pages/Public/Home.jsx": Home_exports,
			"./Pages/Public/Projects/Index.jsx": Index_exports$1,
			"./Pages/Public/Projects/Show.jsx": Show_exports$1,
			"./Pages/Public/Units/Deals.jsx": Deals_exports,
			"./Pages/Public/Units/Index.jsx": Index_exports,
			"./Pages/Public/Units/Show.jsx": Show_exports,
			"./Pages/Shared/ForgotPassword.jsx": ForgotPassword_exports,
			"./Pages/Shared/Login.jsx": Login_exports,
			"./Pages/Shared/Profile.jsx": Profile_exports,
			"./Pages/Shared/ResetPassword.jsx": ResetPassword_exports,
			"./Pages/Shared/Welcome.jsx": Welcome_exports
		}))[`./Pages/${name}.jsx`];
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
}));
//#endregion
export {};
