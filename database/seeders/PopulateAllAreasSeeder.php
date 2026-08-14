<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Listings\Models\Area;
use App\Domain\Listings\Models\AreaFeature;
use App\Domain\Listings\Models\AreaNearbyPlace;
use App\Domain\Listings\Models\AreaFaq;

class PopulateAllAreasSeeder extends Seeder
{
    public function run(): void
    {
        $areasData = [
            // 1. الشيخ زايد
            [
                'slug' => 'sheikh-zayed',
                'name_ar' => 'الشيخ زايد',
                'name_en' => 'Sheikh Zayed City',
                'sort_order' => 1,
                'latitude' => 30.0488,
                'longitude' => 30.9936,
                'address_ar' => 'مدينة الشيخ زايد، محافظة الجيزة، مصر',
                'address_en' => 'Sheikh Zayed City, Giza Governorate, Egypt',
                'short_description_ar' => 'إحدى أشهر وأرقى المدن الجديدة في الجيزة، تتميز بالهدوء، التخطيط العمراني الممتاز، وتجمع أفخم الكمبوندات والمولايات التجارية.',
                'short_description_en' => 'One of the most prestigious new cities in Giza, featuring excellent urban planning, green spaces, luxury compounds, and top commercial hubs.',
                'hero_title_ar' => 'عقارات ومشاريع الشيخ زايد الفاخرة',
                'hero_title_en' => 'Luxury Properties & Projects in Sheikh Zayed',
                'hero_description_ar' => 'تصفح أحدث الشقق والفلل والكمبوندات السكنية والتجارية في مدينة الشيخ زايد بافضل الأسعار وطرق السداد.',
                'hero_description_en' => 'Explore the finest apartments, villas, and compounds in Sheikh Zayed City with flexible payment plans.',
                'about_ar' => 'تُعد مدينة الشيخ زايد نموذجاً رائعاً للمدن الحديثة الهادئة في غرب القاهرة الكبرى. تأسست عام 1995 وتتميز بانتشار المساحات الخضراء والحدائق الواسعة التي تشغل نسبة كبيرة من مساحتها. تضم المدينة أحياء سكنية تتنوع بين المتوسطة والفاخرة، بالإضافة إلى كمبوندات عالمية المستوى مثل بيفرلي هيلز، أركان، وسوديك. تحتوي الشيخ زايد على خدمات متكاملة تشمل مستشفيات دولية مثل مستشفى دار الفؤاد ومستشفى زايد التخصصي، ومدارس وجامعات مرموقة مثل جامعة مصر للعلوم والتكنولوجيا والجامعة الكندية، بجانب مراكز تسوق شهيرة مثل مول العرب وأركان بلازا.',
                'about_en' => 'Sheikh Zayed City stands as a premier model of modern suburban living west of Greater Cairo. Established in 1995, it is renowned for its vast green spaces and peaceful environment. The city hosts high-end residential compounds such as Beverly Hills and Sodic, complemented by top-tier medical facilities like Dar Al Fouad Hospital, elite educational institutions, and luxury shopping destinations including Arkan Plaza and Mall of Arabia.',
                'meta_title_ar' => 'عقارات الشيخ زايد | شقق وفلل للبيع في الشيخ زايد',
                'meta_title_en' => 'Properties in Sheikh Zayed City | Apartments & Villas for Sale',
                'meta_description_ar' => 'استكشف أفضل الشقق والفلل والمشاريع العقارية في الشيخ زايد. قارن الأسعار وتواصل مع المستشار العقاري مباشرة.',
                'meta_description_en' => 'Discover luxury apartments, villas, and commercial spaces for sale in Sheikh Zayed City with direct agent inquiry.',
                'meta_keywords_ar' => ['الشيخ زايد', 'عقارات الشيخ زايد', 'شقق للبيع زايد', 'فلل الشيخ زايد', 'كمبوندات زايد'],
                'meta_keywords_en' => ['Sheikh Zayed', 'Sheikh Zayed Properties', 'Apartments in Zayed', 'Villas in Sheikh Zayed', 'Zayed Compounds'],
                'features' => [
                    ['title_ar' => 'مساحات خضراء واسعة', 'title_en' => 'Vast Green Landscapes', 'description_ar' => 'تغطي الحدائق والمساحات الخضراء النسبة الأكبر من مساحة المدينة.', 'description_en' => 'Parks and green landscapes cover the majority of the city footprint.', 'icon' => 'tree'],
                    ['title_ar' => 'مستشفيات ومراكز طبية عالمية', 'title_en' => 'World-class Hospitals', 'description_ar' => 'تضم مستشفيات كبرى مثل دار الفؤاد وزايد التخصصي.', 'description_en' => 'Hosts major hospitals like Dar Al Fouad and Zayed Specialized.', 'icon' => 'hospital'],
                    ['title_ar' => 'مولات ومراكز ترفيهية', 'title_en' => 'Elite Shopping Malls', 'description_ar' => 'تضم أركان بلازا ومول العرب ومول مصر بالقرب منها.', 'description_en' => 'Home to Arkan Plaza, Mall of Arabia, and nearby Mall of Egypt.', 'icon' => 'shopping-bag'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'أركان بلازا', 'name_en' => 'Arkan Plaza', 'description_ar' => 'مركز تجاري ومطاعم فاخرة', 'description_en' => 'Commercial & Dining Hub', 'distance' => '5', 'distance_unit' => 'دقائق'],
                    ['name_ar' => 'مستشفى دار الفؤاد', 'name_en' => 'Dar Al Fouad Hospital', 'description_ar' => 'مستشفى طبي متخصص', 'description_en' => 'Specialized Medical Center', 'distance' => '8', 'distance_unit' => 'دقائق'],
                    ['name_ar' => 'مول العرب', 'name_en' => 'Mall of Arabia', 'description_ar' => 'أكبر مجمع تسوق في المنطقة', 'description_en' => 'Major Shopping Mall', 'distance' => '10', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما الذي يميز مدينة الشيخ زايد عن باقي المدن؟', 'question_en' => 'What makes Sheikh Zayed City unique?', 'answer_ar' => 'تتميز بالهدوء الشديد، التخطيط المنظم، انخفاض الكثافة السكانية، وتوفر أرقى المدارس والخدمات الطبية والتجارية.', 'answer_en' => 'It offers low population density, serene environment, green parks, top international schools, and premium lifestyle hubs.'],
                    ['question_ar' => 'هل تتوفر وسائل مواصلات سهلة للشيخ زايد؟', 'question_en' => 'Is Sheikh Zayed City well-connected?', 'answer_ar' => 'نعم، ترتبط بمحور 26 يوليو والطريق الدائري الأوسطي ووصلة دهشور مما يجعل الوصول إليها سهلاً وسريعاً.', 'answer_en' => 'Yes, it is seamlessly connected via the July 26th Corridor, Middle Ring Road, and Dahshur Link.'],
                ]
            ],

            // 2. الإسكندرية
            [
                'slug' => 'alexandria',
                'name_ar' => 'الإسكندرية',
                'name_en' => 'Alexandria',
                'sort_order' => 2,
                'latitude' => 31.2001,
                'longitude' => 29.9187,
                'address_ar' => 'محافظة الإسكندرية، عروس البحر الأبيض المتوسط، مصر',
                'address_en' => 'Alexandria Governorate, Bride of the Mediterranean, Egypt',
                'short_description_ar' => 'عروس البحر الأبيض المتوسط والعاصمة الثانية لمصر، تجمع بين السحر التاريخي، الكورنيش الساحر، والشقق البحرية الفاخرة.',
                'short_description_en' => 'The Bride of the Mediterranean and Egypt second capital, blending historic charm, stunning corniche views, and waterfront luxury apartments.',
                'hero_title_ar' => 'عقارات وشقق الإسكندرية المطلة على البحر',
                'hero_title_en' => 'Properties & Sea View Apartments in Alexandria',
                'hero_description_ar' => 'استكشف أحدث الشقق والوحدات العقارية في سموحة وجليم والمنتزه وكورنيش الإسكندرية.',
                'hero_description_en' => 'Explore beachfront and residential apartments across Alexandria finest districts.',
                'about_ar' => 'مدينة الإسكندرية هي ثاني أكبر المدن المصرية والعاصمة الصيفية التاريخية لمصر. تقع على شاطئ البحر الأبيض المتوسط وتتميز بكورنيشها الشهير الذي يمتد لكيلومترات طويلة. تضم الإسكندرية أحياء سكنية عريقة مثل جليم، كفر عبده، سموحة، والمنتزه، وتتمتع بحركة استثمار عقاري نشطة على مدار العام سواء للشقق المطلة على البحر مباشرة أو الوحدات السكنية والتجارية في سموحة ومصر الجديدة بالإسكندرية.',
                'about_en' => 'Alexandria is Egypt second largest city and its historic Mediterranean capital. Known for its iconic seaside corniche stretching for miles, it boasts upscale neighborhoods like Smouha, Kafr Abdo, Gleem, and Montazah. Real estate in Alexandria offers exceptional value, combining coastal lifestyle with prime urban investments.',
                'meta_title_ar' => 'عقارات الإسكندرية | شقق للبيع على البحر في الإسكندرية',
                'meta_title_en' => 'Properties in Alexandria | Sea View Apartments for Sale',
                'meta_description_ar' => 'اعثر على أفضل الشقق والوحدات العقارية في الإسكندرية وسموحة والمنتزه وجليم بأفضل الأسعار مباشرة.',
                'meta_description_en' => 'Find sea view apartments, luxury flats, and commercial properties for sale across Alexandria key districts.',
                'meta_keywords_ar' => ['الإسكندرية', 'عقارات الإسكندرية', 'شقق للبيع بالإسكندرية', 'شقق على البحر', 'سموحة'],
                'meta_keywords_en' => ['Alexandria', 'Alexandria Real Estate', 'Sea View Apartments', 'Smouha', 'Gleem'],
                'features' => [
                    ['title_ar' => 'إطلالات مباشرة على البحر', 'title_en' => 'Direct Sea Views', 'description_ar' => 'شقق سكنية ومصيفية بأجمل إطلالة على كورنيش الإسكندرية.', 'description_en' => 'Residential and holiday flats directly overlooking the Mediterranean.'],
                    ['title_ar' => 'أحياء راقية ومراكز تجارية', 'title_en' => 'Prime Residential Districts', 'description_ar' => 'تضم أحياء سموحة، كفر عبده، وجليم مع مولات كبرى مثل سان ستيفانو.', 'description_en' => 'Includes prestigious areas like Kafr Abdo and Smouha with San Stefano Mall.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مكتبة الإسكندرية', 'name_en' => 'Bibliotheca Alexandrina', 'description_ar' => 'صرح ثقافي عالمي', 'description_en' => 'Global Cultural Center', 'distance' => '5', 'distance_unit' => 'دقائق'],
                    ['name_ar' => 'سان ستيفانو جراند بلازا', 'name_en' => 'San Stefano Grand Plaza', 'description_ar' => 'مجمع فندقي وتجاري فاخر', 'description_en' => 'Luxury Commercial & Hotel Complex', 'distance' => '10', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي أفضل المناطق للسكن والاستثمار في الإسكندرية؟', 'question_en' => 'Which areas are best for living and investment in Alexandria?', 'answer_ar' => 'تعد منطقة سموحة الخيار الأول للاستثمار والخدمات، بينما تفضل منطقة جليم وكفر عبده والمنتزه للشقق الفاخرة والإطلالات البحرية.', 'answer_en' => 'Smouha is prime for integrated services and investment, while Gleem, Kafr Abdo, and Montazah excel in luxury living and sea views.'],
                ]
            ],

            // 3. التجمع الخامس
            [
                'slug' => 'new-cairo',
                'name_ar' => 'التجمع الخامس',
                'name_en' => 'New Cairo',
                'sort_order' => 3,
                'latitude' => 30.0074,
                'longitude' => 31.4913,
                'address_ar' => 'التجمع الخامس، القاهرة الجديدة، مصر',
                'address_en' => 'Fifth Settlement, New Cairo, Egypt',
                'short_description_ar' => 'درة القاهرة الجديدة ومركز الاستثمار العقاري الأول في مصر، يضم شارع التفتيش والتسعين ومئات الكمبوندات الفاخرة.',
                'short_description_en' => 'The crown jewel of New Cairo and Egypt leading real estate investment destination, home to 90th Street and premier luxury compounds.',
                'hero_title_ar' => 'أفخم شقق وكمبوندات التجمع الخامس',
                'hero_title_en' => 'Luxury Apartments & Compounds in New Cairo',
                'hero_description_ar' => 'تصفح أحدث المشروعات والوحدات بالقاهرة الجديدة في شارع التسعين والنرجس والياسمين.',
                'hero_description_en' => 'Discover residential and commercial properties in 5th Settlement with top developers.',
                'about_ar' => 'التجمع الخامس هو التجمع السكني والتجاري الأشهر والأحدث في شرق القاهرة الكبرى. يقع بموقع استراتيجي بين طريق السويس وطريق القطامية - العين السخنة. يضم التجمع الخامس شارع التسعين الشمالي والجنوبي اللذين يمثلان الشريان التجاري والإداري الأهم في مصر.',
                'about_en' => 'The Fifth Settlement is the undisputed hub of luxury living and business in East Cairo. Situated strategically between Suez Road and Sokhna Road, it centers around North and South 90th Street.',
                'meta_title_ar' => 'عقارات التجمع الخامس | شقق وفلل للتمليك والبيع في التجمع',
                'meta_title_en' => 'Properties in New Cairo & Fifth Settlement | Apartments & Villas',
                'meta_description_ar' => 'تصفح أحدث الشقق والكمبوندات والمكاتب التجارية في التجمع الخامس بالقاهرة الجديدة بأفضل طرق السداد.',
                'meta_description_en' => 'Browse top apartments, villas, and administrative offices for sale in 5th Settlement, New Cairo.',
                'meta_keywords_ar' => ['التجمع الخامس', 'القاهرة الجديدة', 'شارع التسعين', 'شقق التجمع', 'كمبوندات التجمع'],
                'meta_keywords_en' => ['Fifth Settlement', 'New Cairo', '90th Street', 'New Cairo Properties', 'New Cairo Compounds'],
                'features' => [
                    ['title_ar' => 'شريان التسعين التجاري والإداري', 'title_en' => '90th Street Commercial Axis', 'description_ar' => 'يضم مقرات أكبر الشركات والبنوك والمولات العالمية.', 'description_en' => 'Home to headquarters of international banks, corporations, and malls.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'الجامعة الأمريكية بالقاهرة', 'name_en' => 'AUC Cairo', 'description_ar' => 'صرح تعليمي عالمي', 'description_en' => 'American University Campus', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'لماذا يُعتبر التجمع الخامس الأفضل للاستثمار العقاري؟', 'question_en' => 'Why is 5th Settlement the top choice for property investment?', 'answer_ar' => 'بسبب ارتفاع إعادة البيع، العائد الإيجاري المرتفع، وجودة الخدمات والمرافق وقربه من العاصمة الإدارية.', 'answer_en' => 'High resale capital appreciation, strong rental yields, premium infrastructure, and proximity to New Administrative Capital.'],
                ]
            ],

            // 4. حدائق الأهرام
            [
                'slug' => 'pyramids-gardens',
                'name_ar' => 'حدائق الأهرام',
                'name_en' => 'Pyramids Gardens',
                'sort_order' => 4,
                'latitude' => 29.9723,
                'longitude' => 31.1118,
                'address_ar' => 'حدائق الأهرام، أمام أهرامات الجيزة، محافظة الجيزة، مصر',
                'address_en' => 'Pyramids Gardens (Hadayek Al Ahram), Giza, Egypt',
                'short_description_ar' => 'منطقة سكنية متميزة تقع بالقرب المباشر من أهرامات الجيزة المتحف المصري الكبير، تتميز بتنوع المساحات والأسعار التنافسية.',
                'short_description_en' => 'A strategic residential neighborhood situated directly opposite the Giza Pyramids and GEM, offering diverse spaces at competitive prices.',
                'hero_title_ar' => 'عقارات وشقق حدائق الأهرام المتميزة',
                'hero_title_en' => 'Properties & Apartments in Pyramids Gardens',
                'hero_description_ar' => 'ابحث عن أفضل الشقق والوحدات السكنية والتجارية في حدائق الأهرام أمام المتحف الكبير مباشرة.',
                'hero_description_en' => 'Explore residential and commercial properties in Hadayek Al Ahram with great pricing.',
                'about_ar' => 'تقع منطقة حدائق الأهرام (الشهيرة بـ الهضبة) على طريق مصر الإسكندرية الصحراوي، مباشرة أمام منطقة أهرامات الجيزة والمتحف المصري الكبير (GEM). تُعد الخيار الأول للباحثين عن سكن متميز بأسعار مناسبة وقريب من وسط القاهرة والمحاور الرئيسية.',
                'about_en' => 'Pyramids Gardens (Hadayek Al Ahram) sits right opposite the Great Pyramids of Giza and the Grand Egyptian Museum (GEM). It offers an affordable yet highly accessible residential solution.',
                'meta_title_ar' => 'عقارات حدائق الأهرام | شقق للبيع في حدائق الأهرام',
                'meta_title_en' => 'Properties in Pyramids Gardens | Apartments for Sale in Hadayek Al Ahram',
                'meta_description_ar' => 'تصفح أفضل الشقق والوحدات السكنية والتجارية المتاحة للبيع في حدائق الأهرام بجوار المتحف الكبير.',
                'meta_description_en' => 'Find affordable and luxury apartments for sale in Pyramids Gardens near the Grand Egyptian Museum.',
                'meta_keywords_ar' => ['حدائق الأهرام', 'شقق حدائق الأهرام', 'عقارات الهضبة', 'شقق للبيع بالأهرام'],
                'meta_keywords_en' => ['Pyramids Gardens', 'Hadayek Al Ahram', 'Apartments near Pyramids', 'Giza Properties'],
                'features' => [
                    ['title_ar' => 'موقع استراتيجي بجوار المتحف الكبير', 'title_en' => 'Adjacent to Grand Egyptian Museum', 'description_ar' => 'موقع استثنائي أمام الأهرامات والمتحف الجديد.', 'description_en' => 'Prime spot facing the Giza Pyramids and Grand Museum.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'المتحف المصري الكبير', 'name_en' => 'Grand Egyptian Museum', 'description_ar' => 'أكبر متحف آثاري في العالم', 'description_en' => 'World Premier Archaeological Museum', 'distance' => '3', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تعتبر حدائق الأهرام فرصة استثمارية جيدة؟', 'question_en' => 'Is Pyramids Gardens a sound real estate investment?', 'answer_ar' => 'نعم، نظراً لافتتاح المتحف المصري الكبير والمشروعات القومية المحيطة بها مما زاد من القيمة العقارية للمنطقة.', 'answer_en' => 'Yes, fueled by the opening of the Grand Egyptian Museum and surrounding mega infrastructure upgrades.'],
                ]
            ],

            // 5. الساحل الشمالي
            [
                'slug' => 'north-coast',
                'name_ar' => 'الساحل الشمالي',
                'name_en' => 'North Coast',
                'sort_order' => 5,
                'latitude' => 30.8252,
                'longitude' => 28.9535,
                'address_ar' => 'الساحل الشمالي، طريق الإسكندرية مطروح، مصر',
                'address_en' => 'North Coast, Alexandria - Matrouh Coastal Road, Egypt',
                'short_description_ar' => 'الوجهة السياحية والاستثمارية الأولى في مصر والشرق الأوسط، تتميز بشواطئها الفيروزية الصافية والمنتجات العالمية مثل مراسي وهاسيندا.',
                'short_description_en' => 'Egypt flagship Mediterranean coastal corridor, world-famous for turquoise waters, white sand beaches, and mega resorts like Marassi & Hacienda.',
                'hero_title_ar' => 'أفخم شاليهات وفلل الساحل الشمالي',
                'hero_title_en' => 'Luxury Chalets & Villas in North Coast',
                'hero_description_ar' => 'اكتشف أرقى قرى الساحل الشمالي وشاليهاتها الشاطئية بأطول سداد وأفضل عوائد استثمارية.',
                'hero_description_en' => 'Discover premier Mediterranean coastal resorts and beachfront chalets with easy payment terms.',
                'about_ar' => 'يمتد الساحل الشمالي المصري من الكيلو 21 غرب الإسكندرية وحتى مرسى مطروح. يُقسم عادة إلى الساحل القديم والساحل الجديد (رأس الحكمة وسيدي عبد الرحمن). يضم الساحل أرقى وأفخم القرى والمنتجعات السياحية في المنطقة.',
                'about_en' => 'The Egyptian North Coast extends along the Mediterranean shoreline from Alexandria to Marsa Matruh. Divided into classic and new coastal zones, it hosts premier luxury master-planned communities.',
                'meta_title_ar' => 'عقارات الساحل الشمالي | شاليهات وفلل للبيع في الساحل',
                'meta_title_en' => 'North Coast Real Estate | Luxury Chalets & Villas for Sale',
                'meta_description_ar' => 'اكتشف أفضل شاليهات وفلل الساحل الشمالي ورأس الحكمة وسيدي عبد الرحمن بالتقسيط وأسهل أنظمة السداد.',
                'meta_description_en' => 'Explore beachfront chalets, luxury villas, and twin houses for sale across Egypt North Coast resorts.',
                'meta_keywords_ar' => ['الساحل الشمالي', 'شاليهات للبيع بالساحل', 'مراسي', 'هاسيندا', 'قرى الساحل الشمالي'],
                'meta_keywords_en' => ['North Coast', 'Sahel Chalets', 'Marassi', 'Hacienda', 'North Coast Resorts'],
                'features' => [
                    ['title_ar' => 'شواطئ فيروزية ومياه صافية', 'title_en' => 'Turquoise Waters & White Sand', 'description_ar' => 'من أجمل شواطئ البحر الأبيض المتوسط على الإطلاق.', 'description_en' => 'Among the finest natural beaches in the entire Mediterranean.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'طريق الفوكا الجديد', 'name_en' => 'New Fouka Road', 'description_ar' => 'طريق يقلص مسافة السفر من القاهرة إلى ساعتين', 'description_en' => 'Direct highway reducing Cairo travel time to 2 hours', 'distance' => '120', 'distance_unit' => 'دقيقة'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي الفترة الذهبية للاستثمار العقاري في الساحل؟', 'question_en' => 'What is the prime season for North Coast rental yield?', 'answer_ar' => 'موسم الصيف الممتد من مايو إلى أكتوبر يحقق أعلى نسبة إشغال وعائد إيجاري يومي وأسبوعي.', 'answer_en' => 'The summer season from May through October yields the highest daily and weekly holiday rental returns.'],
                ]
            ],

            // 6. الشروق
            [
                'slug' => 'el-shorouk',
                'name_ar' => 'الشروق',
                'name_en' => 'El Shorouk City',
                'sort_order' => 6,
                'latitude' => 30.1458,
                'longitude' => 31.6067,
                'address_ar' => 'مدينة الشروق، شرق القاهرة، مصر',
                'address_en' => 'El Shorouk City, East Cairo, Egypt',
                'short_description_ar' => 'مدينة سكنية هادئة في شرق القاهرة تتميز بقربها من العاصمة الإدارية وطريق الإسماعيلية والسويس وتنوعها السكني الراقي.',
                'short_description_en' => 'A serene residential city in East Cairo strategic to the New Administrative Capital, Suez Road, and Ismailia Highway.',
                'hero_title_ar' => 'عقارات ومشاريع مدينة الشروق',
                'hero_title_en' => 'Properties & Compounds in El Shorouk City',
                'hero_description_ar' => 'تصفح أحدث الشقق والفلل في مدينة الشروق بالقرب من العاصمة الإدارية بأفضل الأسعار.',
                'hero_description_en' => 'Browse residential units and villas in El Shorouk City adjacent to New Capital.',
                'about_ar' => 'تقع مدينة الشروق في الكيلو 37 على طريق القاهرة - الإسماعيلية وتعتبر من أكثر المدن الواعدة سكنياً واستثمارياً في شرق القاهرة. تمتاز بالتخطيط الهادئ وانخفاض الكثافة السكانية وتضم كليات وجامعات بارزة مثل الجامعة البريطانية BUE وجامعة الشروق.',
                'about_en' => 'El Shorouk City is strategically located at KM 37 on Cairo-Ismailia Road. Known for low density, spacious layout, and elite educational hubs like the British University in Egypt (BUE).',
                'meta_title_ar' => 'عقارات الشروق | شقق وفلل للبيع في الشروق',
                'meta_title_en' => 'Properties in El Shorouk City | Apartments & Villas for Sale',
                'meta_description_ar' => 'ابحث عن أفضل الشقق والفلل في مدينة الشروق بالقرب من الجامعة البريطانية والعاصمة الإدارية.',
                'meta_description_en' => 'Find modern apartments and luxury villas for sale in El Shorouk City with flexible payment plans.',
                'meta_keywords_ar' => ['الشروق', 'مدينة الشروق', 'عقارات الشروق', 'شقق للبيع بالشروق'],
                'meta_keywords_en' => ['El Shorouk', 'Shorouk City', 'Shorouk Properties', 'Apartments in Shorouk'],
                'features' => [
                    ['title_ar' => 'قرب ممتاز من العاصمة الإدارية', 'title_en' => 'Proximity to New Capital', 'description_ar' => 'تبعد دقائق معدودة عن العاصمة الإدارية الجديدة.', 'description_en' => 'Just minutes away from the New Administrative Capital.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'الجامعة البريطانية في مصر (BUE)', 'name_en' => 'BUE University', 'description_ar' => 'جامعة دولية كبرى', 'description_en' => 'Leading International University', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'كيف تؤثر العاصمة الإدارية على أسعار الشروق؟', 'question_en' => 'How does the New Capital impact Shorouk real estate values?', 'answer_ar' => 'أدى القرب المباشر إلى ارتفاع الطلب الاستثماري وزيادة قيمة العقارات في الشروق بشكل مستمر.', 'answer_en' => 'Direct proximity drives robust capital growth and continuous rental demand.'],
                ]
            ],

            // 7. العاصمة الإدارية
            [
                'slug' => 'new-administrative-capital',
                'name_ar' => 'العاصمة الإدارية',
                'name_en' => 'New Administrative Capital',
                'sort_order' => 7,
                'latitude' => 30.0131,
                'longitude' => 31.7454,
                'address_ar' => 'العاصمة الإدارية الجديدة، شرق القاهرة، مصر',
                'address_en' => 'New Administrative Capital, East Cairo, Egypt',
                'short_description_ar' => 'مستقبل مصر العمراني والمالي، تضم البرج الأيقوني، حي الوزارات، النهر الأخضر وأفخم الكمبوندات والمولايات التجارية والإدارية.',
                'short_description_en' => 'Egypt futuristic administrative & financial capital featuring the Iconic Tower, Green River, Ministries District, and smart compounds.',
                'hero_title_ar' => 'استثمر في عقارات العاصمة الإدارية الجديدة',
                'hero_title_en' => 'Invest in New Administrative Capital Real Estate',
                'hero_description_ar' => 'تصفح أحدث المكاتب الإدارية والشقق والعيادات والمحلات التجارية بالتقسيط حتى 10 سنوات.',
                'hero_description_en' => 'Browse premier offices, clinics, apartments, and retail spaces in New Capital.',
                'about_ar' => 'العاصمة الإدارية الجديدة هي أهم و أكبر مشروع قومي عمراني في مصر والشرق الأوسط. تقع بين طريق القاهرة - السويس وطريق القاهرة - العين السخنة. تضم الحي الحكومي وحي المال والأعمال، والبرج الأيقوني (أطول برج في إفريقيا)، والحديقة المركزية (النهر الأخضر)، وتعتمد بالكامل على أنظمة المدن الذكية المستدامة.',
                'about_en' => 'The New Administrative Capital (NAC) represents Egypt smart mega city of the future. Spanning vast lands east of Cairo, it accommodates the Government District, Central Business District (CBD) with Africa tallest Iconic Tower, and the Green River park chain.',
                'meta_title_ar' => 'عقارات العاصمة الإدارية | شقق ومكاتب ومحلات للبيع بالتقسيط',
                'meta_title_en' => 'New Administrative Capital Real Estate | Commercial & Residential',
                'meta_description_ar' => 'استثمر في العاصمة الإدارية الجديدة. شقق، فلل، مكاتب إدارية ومحلات تجارية بالتقسيط حتى 10 سنوات.',
                'meta_description_en' => 'Invest in Egypt New Capital. Browse residential compounds, offices, and commercial units with up to 10 years installments.',
                'meta_keywords_ar' => ['العاصمة الإدارية', 'البرج الأيقوني', 'شقق العاصمة الإدارية', 'مكاتب العاصمة الإدارية', 'كمبوندات العاصمة'],
                'meta_keywords_en' => ['New Administrative Capital', 'Iconic Tower', 'New Capital Properties', 'New Capital Offices'],
                'features' => [
                    ['title_ar' => 'البرج الأيقوني وحي المال والأعمال', 'title_en' => 'Iconic Tower & CBD', 'description_ar' => 'أطول برج في أفريقيا وأكبر مركز مالي وإداري.', 'description_en' => 'Africa tallest skyscraper and regional financial headquarters.'],
                    ['title_ar' => 'النهر الأخضر والحديقة المركزية', 'title_en' => 'Green River Mega Park', 'description_ar' => 'أطول سلسلة حدائق وسطية متصلة في العالم.', 'description_en' => 'World longest continuous urban park system.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'الحي الحكومي والوزارات', 'name_en' => 'Government District', 'description_ar' => 'مقر مجلس الوزراء وجميع الوزارات', 'description_en' => 'Cabinet and all Ministerial Head Quarters', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي القطاعات الأكثر ربحية للاستثمار في العاصمة الإدارية؟', 'question_en' => 'Which sectors offer highest ROI in New Capital?', 'answer_ar' => 'المكاتب الإدارية والعيادات الطبية في حي المال والأعمال والوحدات السكنية في أحياء R7 و R8.', 'answer_en' => 'Administrative offices in CBD and residential units in R7 & R8 districts.'],
                ]
            ],

            // 8. العلمين الجديدة
            [
                'slug' => 'new-alamein',
                'name_ar' => 'العلمين الجديدة',
                'name_en' => 'New Alamein',
                'sort_order' => 8,
                'latitude' => 30.8351,
                'longitude' => 28.9483,
                'address_ar' => 'مدينة العلمين الجديدة، الساحل الشمالي، مصر',
                'address_en' => 'New Alamein City, North Coast, Egypt',
                'short_description_ar' => 'مدينة سياحية وسكنية عالمية طوال العام، تشتهر بأبراج العلمين الشاطئية الفاخرة والمنطقة الترفيهية والبحيرة الصناعية.',
                'short_description_en' => 'A world-class year-round coastal metropolis featuring iconic beachfront towers, crystal lagoons, and global events.',
                'hero_title_ar' => 'عقارات وأبراج العلمين الجديدة على البحر',
                'hero_title_en' => 'Beachfront Towers & Properties in New Alamein',
                'hero_description_ar' => 'امتلك شقة فاخرة في أبراج العلمين الجديدة الشاطئية بأطول فترات سداد وأفضل رؤية للبحر.',
                'hero_description_en' => 'Buy luxury beachfront apartments and towers in New Alamein City.',
                'about_ar' => 'مدينة العلمين الجديدة هي أول مدينة سكنية سياحية متكاملة تعمل على مدار السنة في الساحل الشمالي. تمتد على مساحة 50 ألف فدان وتضم أبراجاً شاطئية تنافس أبراج دبي، بجانب جامعة العلمين الدولية، والمنطقة التراثية والترفيهية.',
                'about_en' => 'New Alamein City redefines Mediterranean urban tourism as a year-round smart coastal city. Spanning 50,000 feddans, it features skyscraper towers on the sea, lagoon promenades, and international universities.',
                'meta_title_ar' => 'عقارات أبراج العلمين الجديدة | شقق للبيع في العلمين',
                'meta_title_en' => 'New Alamein Real Estate | Beachfront Towers & Apartments',
                'meta_description_ar' => 'امتلك شقة في أبراج العلمين الجديدة على البحر مباشرة بأطول فترات سداد وأعلى عائد استثماري.',
                'meta_description_en' => 'Buy luxury beachfront apartments and towers in New Alamein City with direct sea view.',
                'meta_keywords_ar' => ['العلمين الجديدة', 'أبراج العلمين', 'شقق العلمين', 'عقارات العلمين'],
                'meta_keywords_en' => ['New Alamein', 'Alamein Towers', 'Alamein Apartments'],
                'features' => [
                    ['title_ar' => 'أبراج شاطئية فائقة الفخامة', 'title_en' => 'Ultra-Luxury Sea Towers', 'description_ar' => 'ناطحات سحاب سكنية وفندقية مباشرة على البحر.', 'description_en' => 'Residential & hotel skyscrapers directly on the coastline.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'المنطقة الترفيهية بالعلمين', 'name_en' => 'Alamein Entertainment Hub', 'description_ar' => 'مركز مطاعم ومقاهي عالمية على الشاطئ', 'description_en' => 'Beachfront Dining & Retail Center', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تعمل مدينة العلمين الجديدة صيفاً وشتاءً؟', 'question_en' => 'Is New Alamein functional year-round?', 'answer_ar' => 'نعم، تم تصميمها كمدينة متكاملة بها جامعات ومستشفيات ومراكز حكومية وسكان دائمون على مدار العام.', 'answer_en' => 'Yes, built with universities, hospitals, civic centers, and permanent year-round residents.'],
                ]
            ],

            // 9. العجمي
            [
                'slug' => 'agami',
                'name_ar' => 'العجمي',
                'name_en' => 'Agami',
                'sort_order' => 9,
                'latitude' => 31.0967,
                'longitude' => 29.7712,
                'address_ar' => 'حي العجمي، الإسكندرية، مصر',
                'address_en' => 'El Agami District, Alexandria, Egypt',
                'short_description_ar' => 'أحد أشهر الأحياء الساحلية في غرب الإسكندرية، يتميز بشواطئه العريقة وأسعاره الاقتصادية المناسبة للسكن والمصيف.',
                'short_description_en' => 'A famous coastal district in west Alexandria known for popular beaches and accessible real estate prices.',
                'hero_title_ar' => 'عقارات وشقق العجمي والبيطاش والهانوفيل',
                'hero_title_en' => 'Properties & Chalets in Agami Alexandria',
                'hero_description_ar' => 'تصفح أفضل الشقق والوحدات المصيفية والسكنية في العجمي بالإسكندرية بأسعار اقتصادية.',
                'hero_description_en' => 'Find affordable sea view apartments and holiday chalets in Agami.',
                'about_ar' => 'حي العجمي هو وجهة مصيفية وسكنية تاريخية تقع غرب مدينة الإسكندرية. يضم مناطق شهيرة مثل البيطاش والهانوفيل والدخيلة وتتميز بشواطئها الممتدة وأسعار عقاراتها الاقتصادية والتنافسية.',
                'about_en' => 'El Agami is a historic seaside neighborhood west of Alexandria, featuring Bitash and Hanoville districts with highly accessible apartment pricing.',
                'meta_title_ar' => 'عقارات العجمي | شقق وشاليهات للبيع في العجمي بالإسكندرية',
                'meta_title_en' => 'Agami Properties | Affordable Apartments in Alexandria',
                'meta_description_ar' => 'تصفح شقق وشاليهات البيطاش والهانوفيل بالعجمي بأسعار مناسبة للتمليك والمصيف.',
                'meta_description_en' => 'Browse budget-friendly sea view chalets and flats in Agami, Alexandria.',
                'meta_keywords_ar' => ['العجمي', 'شقق العجمي', 'البيطاش', 'الهانوفيل'],
                'meta_keywords_en' => ['Agami', 'Bitash', 'Hanoville', 'Agami Apartments'],
                'features' => [
                    ['title_ar' => 'أسعار سكن ومصيف اقتصادية', 'title_en' => 'Affordable Beachfront Units', 'description_ar' => 'تتنوع الأسعار ل تناسب الميزانيات الاقتصادية والمتوسطة.', 'description_en' => 'Offers highly competitive pricing for holiday & permanent living.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'شاطئ البيطاش', 'name_en' => 'Bitash Beach', 'description_ar' => 'شاطئ مصيفي شهير', 'description_en' => 'Popular Coastal Beach', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تتوفر شقق للبيع بالتقسيط في العجمي؟', 'question_en' => 'Are installment options available in Agami?', 'answer_ar' => 'نعم، تتوفر خيارات عديدة للشراء كاش وبالتقسيط على فترات ميسرة.', 'answer_en' => 'Yes, cash and flexible seller installment plans are available.'],
                ]
            ],

            // 10. العين السخنة
            [
                'slug' => 'ain-sokhna',
                'name_ar' => 'العين السخنة',
                'name_en' => 'Ain Sokhna',
                'sort_order' => 10,
                'latitude' => 29.6000,
                'longitude' => 32.3167,
                'address_ar' => 'العين السخنة، محافظة السويس، خليج السويس، مصر',
                'address_en' => 'Ain Sokhna, Suez Governorate, Gulf of Suez, Egypt',
                'short_description_ar' => 'أقرب منتجع ساحلي للقاهرة على البحر الأحمر، تتميز بجوها الدافئ شتاءً وشواطئها الجبلية الخلابة وقربها من العاصمة.',
                'short_description_en' => 'The closest Red Sea resort to Cairo, famous for warm winter weather, mountain ocean views, and quick highway access.',
                'hero_title_ar' => 'أفخم شاليهات وفلل العين السخنة والجلالة',
                'hero_title_en' => 'Luxury Red Sea Chalets in Ain Sokhna & Galala',
                'hero_description_ar' => 'احجز شاليهك المفضل بالعين السخنة على البحر الأحمر مباشرة بأقسط ميسرة.',
                'hero_description_en' => 'Reserve luxury Red Sea chalets and oceanfront villas in Ain Sokhna.',
                'about_ar' => 'تقع العين السخنة على خليج السويس وتبعد حوالي 60 دقيقة فقط عن القاهرة عبر طريق الجلالة الجديد وطريق السخنة. تمتاز بشواطئها المترفة والطقس الدافئ طوال العام.',
                'about_en' => 'Ain Sokhna sits along the Gulf of Suez, just an hour drive from Cairo via the Galala Highway. Famous for warm sunny winters, crystal beaches, and mountain developments.',
                'meta_title_ar' => 'عقارات العين السخنة | شاليهات وفلل للبيع في السخنة',
                'meta_title_en' => 'Ain Sokhna Real Estate | Chalets & Villas for Sale',
                'meta_description_ar' => 'احجز شاليهك في العين السخنة والجلالة بإطلالة ساحرة على البحر الأحمر بأقل مقدم وأطول سداد.',
                'meta_description_en' => 'Buy luxury Red Sea chalets and villas in Ain Sokhna and Galala City with easy installments.',
                'meta_keywords_ar' => ['العين السخنة', 'شاليهات السخنة', 'مدينة الجلالة', 'بورتو السخنة'],
                'meta_keywords_en' => ['Ain Sokhna', 'Sokhna Chalets', 'Galala City', 'Porto Sokhna'],
                'features' => [
                    ['title_ar' => 'طقس دافئ ومثالي طوال العام', 'title_en' => 'Year-Round Warm Climate', 'description_ar' => 'منتجع ساحلي متميز يعمل في الصيف والشتاء.', 'description_en' => 'Ideal Red Sea destination for both winter and summer.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مدينة الجلالة العالمية', 'name_en' => 'Galala Resort City', 'description_ar' => 'مجمع سياحي وجبلي متكامل', 'description_en' => 'Mega Coastal & Mountain Destination', 'distance' => '10', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'كم تبلغ المسافة من القاهرة إلى العين السخنة؟', 'question_en' => 'How far is Ain Sokhna from Cairo?', 'answer_ar' => 'حوالي 60 إلى 90 دقيقة فقط بالسيارة عبر طريق القطامية - السخنة أو طريق الجلالة.', 'answer_en' => 'Approximately 60 to 90 minutes drive via Katameya-Sokhna Highway.'],
                ]
            ],

            // 11. المعادي
            [
                'slug' => 'maadi',
                'name_ar' => 'المعادي',
                'name_en' => 'Maadi',
                'sort_order' => 11,
                'latitude' => 29.9602,
                'longitude' => 31.2569,
                'address_ar' => 'حي المعادي، جنوب القاهرة، مصر',
                'address_en' => 'Maadi District, South Cairo, Egypt',
                'short_description_ar' => 'ضاحية خضراء عريقة في جنوب القاهرة، تشتهر بشوارعها المشجرة، السفارات الأجنبية، وأرقى السرايات والشقق المطلة على النيل.',
                'short_description_en' => 'A green historic suburb in South Cairo known for tree-lined streets, diplomatic embassies, and luxury Nile-view flats.',
                'hero_title_ar' => 'عقارات وشقق المعادي وسرايات المعادي',
                'hero_title_en' => 'Properties & Nile View Apartments in Maadi',
                'hero_description_ar' => 'تصفح أحدث الشقق للتمليك والإيجار في المعادي ودجلة وزهراء المعادي وكورنيش النيل.',
                'hero_description_en' => 'Explore luxury Nile view and residential apartments in Maadi.',
                'about_ar' => 'تعتبر المعادي من أعرق وأهدأ ضواحي القاهرة الكبرى. تضم مناطـق متنوعة أشهرها سرايات المعادي، المعادي القديمة، كورنيش المعادي، وزهراء المعادي. تقطنها نسبة عالية من الجاليات الأجنبية والدبلوماسيين بفضل جوها الهادئ.',
                'about_en' => 'Maadi is one of Cairo most tranquil and diplomatic residential suburbs. Divided into Sarayat Maadi, Old Maadi, Corniche Maadi, and Zahraa Maadi, it is favored by expatriates and diplomats.',
                'meta_title_ar' => 'عقارات المعادي | شقق للبيع والإيجار في المعادي',
                'meta_title_en' => 'Maadi Real Estate | Apartments for Sale & Rent in Maadi',
                'meta_description_ar' => 'ابحث عن شقق للتمليك والإيجار في سرايات المعادي ودجلة وزهراء المعادي وكورنيش النيل.',
                'meta_description_en' => 'Browse luxury Nile view apartments and flats for sale or rent in Sarayat Maadi & Zahraa Maadi.',
                'meta_keywords_ar' => ['المعادي', 'سرايات المعادي', 'زهراء المعادي', 'شقق المعادي'],
                'meta_keywords_en' => ['Maadi', 'Sarayat Maadi', 'Zahraa Maadi', 'Maadi Apartments'],
                'features' => [
                    ['title_ar' => 'حي دبلوماسي وأشجار عريقة', 'title_en' => 'Diplomatic & Tree-Lined Suburb', 'description_ar' => 'مقر العديد من السفارات والمدارس الدولية.', 'description_en' => 'Home to international embassies and leafy avenues.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'كورنيش نيل المعادي', 'name_en' => 'Maadi Nile Corniche', 'description_ar' => 'ممشي ومطاعم على النيل مباشرة', 'description_en' => 'Nile Promenade & Dining', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي أشهر مناطق المعادي للسكن الراقي؟', 'question_en' => 'Which areas in Maadi are best for high-end living?', 'answer_ar' => 'سرايات المعادي ودجلة للشوارع الهادئة، وكورنيش المعادي للشقق المطلة على النيل.', 'answer_en' => 'Sarayat Maadi and Degla for peaceful streets; Corniche Maadi for direct Nile views.'],
                ]
            ],

            // 12. المهندسين
            [
                'slug' => 'mohandessin',
                'name_ar' => 'المهندسين',
                'name_en' => 'Mohandessin',
                'sort_order' => 12,
                'latitude' => 30.0511,
                'longitude' => 31.2003,
                'address_ar' => 'حي المهندسين، محافظة الجيزة، مصر',
                'address_en' => 'Mohandessin District, Giza Governorate, Egypt',
                'short_description_ar' => 'قلب الجيزة التجاري والسكني النابض، يضم أشهر الشوارع مثل جامعة الدول العربية وجامعة الدول والمحلات والمطاعم الكبرى.',
                'short_description_en' => 'The vibrant commercial and residential heart of Giza, famous for Gameat El Dowal Street and high commercial activity.',
                'hero_title_ar' => 'عقارات ومكاتب المهندسين التجارية والسنكية',
                'hero_title_en' => 'Properties & Commercial Offices in Mohandessin',
                'hero_description_ar' => 'ابحث عن أفضل الشقق السكنية والمكاتب والعيادات الطبية في جامعة الدول والمهندسين.',
                'hero_description_en' => 'Discover prime apartments and corporate offices for sale or rent in Mohandessin.',
                'about_ar' => 'حي المهندسين هو أحد أرقى وأنشط أحياء محافظة الجيزة وسط القاهرة الكبرى. تم إنشاؤه في خمسينيات القرن الماضي ويتميز بشوارعه العريضة وحيويته التجارية العالية، حيث يضم مراكز الشركات والمطاعم الشهيرة والمستشفيات والعيادات الطبية.',
                'about_en' => 'Mohandessin is a central commercial and residential district established in the 1950s. Known for Gameat Al Dowal Street, it is a hub for corporate offices, medical centers, and prime retail.',
                'meta_title_ar' => 'عقارات المهندسين | شقق ومكاتب للبيع في المهندسين',
                'meta_title_en' => 'Mohandessin Real Estate | Apartments & Offices for Sale',
                'meta_description_ar' => 'تصفح أفضل الشقق السكنية والمكاتب التجارية المتاحة للبيع والإيجار في المهندسين والجيزة.',
                'meta_description_en' => 'Find prime apartments, medical clinics, and commercial offices for sale or rent in Mohandessin.',
                'meta_keywords_ar' => ['المهندسين', 'جامعة الدول', 'شقق المهندسين', 'مكاتب المهندسين'],
                'meta_keywords_en' => ['Mohandessin', 'Gameat Al Dowal', 'Mohandessin Offices'],
                'features' => [
                    ['title_ar' => 'موقع حيوي وسط القاهرة والجيزة', 'title_en' => 'Prime Central Hub', 'description_ar' => 'سهولة الوصول للزمالك والدقي والدائري.', 'description_en' => 'Immediate access to Zamalek, Dokki, and Ring Road.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'شارع جامعة الدول العربية', 'name_en' => 'Gameat Al Dowal Street', 'description_ar' => 'أشهر شريان تجاري بالمهندسين', 'description_en' => 'Main Commercial Boulevard', 'distance' => '2', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تعتبر المكاتب والعيادات في المهندسين استثماراً ناجحاً؟', 'question_en' => 'Are commercial properties in Mohandessin high yield?', 'answer_ar' => 'نعم، نظراً لكون المهندسين مركزاً تجارياً وطبياً رئيساً يضم إقبالاً مستمراً من العملاء والشركات.', 'answer_en' => 'Yes, due to its status as a top tier corporate and healthcare node in Greater Cairo.'],
                ]
            ],

            // 13. رأس الحكمة
            [
                'slug' => 'ras-el-hekma',
                'name_ar' => 'رأس الحكمة',
                'name_en' => 'Ras El Hekma',
                'sort_order' => 13,
                'latitude' => 31.1098,
                'longitude' => 27.8485,
                'address_ar' => 'خليج رأس الحكمة، الساحل الشمالي الجديد، مصر',
                'address_en' => 'Ras El Hekma Bay, New North Coast, Egypt',
                'short_description_ar' => 'مالديف البحر الأبيض المتوسط، المنطقة السياحية والاستثمارية الأضخم في الساحل الشمالي الجديد باستثمارات عالمية كبرى.',
                'short_description_en' => 'The Maldives of the Mediterranean, host to mega global foreign direct investments and unmatched turquoise sea bays.',
                'hero_title_ar' => 'شاليهات وفلل خليج رأس الحكمة الجديد',
                'hero_title_en' => 'Ras El Hekma Luxury Chalets & Villas',
                'hero_description_ar' => 'احجز وحدتك الشاطئية في رأس الحكمة بأحدث مشاريع الساحل الشمالي وأعلى قيمة استثمارية مستقبلياً.',
                'hero_description_en' => 'Invest in Ras El Hekma luxury chalets, twin houses, and villas with direct sea views.',
                'about_ar' => 'يعد خليج رأس الحكمة من أجمل 3 شواطئ على مستوى العالم، ويقع في الساحل الشمالي الجديد بين الضبعة ومرسى مطروح. يشهد تصفقة استثمارية وتطويرية عالمية تاريخية لبناء مدينة رأس الحكمة الجديدة التي ستضم مطاراً دولياً ومارينا لليخوت ومجموعات فندقية عالمية.',
                'about_en' => 'Ras El Hekma Bay is ranked among the top Mediterranean coastal destinations globally. The historic multi-billion dollar investment deal establishes a futuristic coastal mega city featuring an international airport, mega yacht marinas, and 5-star hotel chains.',
                'meta_title_ar' => 'عقارات رأس الحكمة | شاليهات وفلل للبيع في خليج رأس الحكمة',
                'meta_title_en' => 'Ras El Hekma Real Estate | Luxury Chalets & Beachfront Villas',
                'meta_description_ar' => 'احجز وحدتك الشاطئية في رأس الحكمة بأحدث مشاريع الساحل الشمالي وأعلى قيمة استثمارية مستقبلياً.',
                'meta_description_en' => 'Invest in Ras El Hekma luxury chalets, twin houses, and villas with direct sea views.',
                'meta_keywords_ar' => ['رأس الحكمة', 'شاليهات رأس الحكمة', 'مشروع رأس الحكمة', 'تطوير رأس الحكمة'],
                'meta_keywords_en' => ['Ras El Hekma', 'Ras El Hekma Chalets', 'Ras El Hekma Investment'],
                'features' => [
                    ['title_ar' => 'أجمل مياه وخليج طبيعي', 'title_en' => 'World Top Natural Sea Bay', 'description_ar' => 'مياه فيروزية هادئة بدون أمواج حادة.', 'description_en' => 'Calm turquoise bay with minimal wave action.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'طريق الضبعة الجديد', 'name_en' => 'Dabaa Highway', 'description_ar' => 'ربط سريع ومباشر بالقاهرة', 'description_en' => 'Fast highway connection to Cairo', 'distance' => '15', 'distance_unit' => 'دقيقة'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما الذي يجعل الاستثمار في رأس الحكمة فرصة استثنائية؟', 'question_en' => 'Why is Ras El Hekma a historic investment opportunity?', 'answer_ar' => 'الضخ الاستثماري الضخم والمخطط العالمي للمدينة يضمن تضاعف رأس المال والقيمة العقارية سريعا.', 'answer_en' => 'Massive international capital influx and master planning ensure maximum capital appreciation.'],
                ]
            ],

            // 14. سيدي كرير
            [
                'slug' => 'sidi-kerir',
                'name_ar' => 'سيدي كرير',
                'name_en' => 'Sidi Kerir',
                'sort_order' => 14,
                'latitude' => 31.0234,
                'longitude' => 29.6123,
                'address_ar' => 'سيدي كرير، الكيلو 34، الساحل الشمالي، مصر',
                'address_en' => 'Sidi Kerir, KM 34, North Coast, Egypt',
                'short_description_ar' => 'منطقة ساحلية عريقة في أول الساحل الشمالي قرب الإسكندرية والكرير، تتميز بسهولة الوصول إليها والهدوء الأسري.',
                'short_description_en' => 'A classic coastal enclave at KM 34 North Coast, close to Alexandria, offering calm family beaches and accessibility.',
                'hero_title_ar' => 'شاليهات وعقارات سيدي كرير الكلاسيكية',
                'hero_title_en' => 'Sidi Kerir Coast Chalets & Properties',
                'hero_description_ar' => 'تصفح أحدث الشاليهات والفلل المعروضة للبيع في سيدي كرير بالساحل الشمالي بأفضل الأسعار.',
                'hero_description_en' => 'Find family chalets and holiday villas for sale in Sidi Kerir, North Coast.',
                'about_ar' => 'تقع منطقة سيدي كرير عند الكيلو 34 إلى الكيلو 40 على طريق الإسكندرية - مطروح. تُعد من أقرب مناطق الساحل الشمالي لمحافظة الإسكندرية ومطار برج العرب، وتضم قري سياحية عريقة ومشاريع سكنية ومصيفية هادئة مناسبة للعائلات.',
                'about_en' => 'Sidi Kerir is located between KM 34 and KM 40 on Alexandria-Matrouh Coastal Road. Positioned conveniently near Borg El Arab International Airport.',
                'meta_title_ar' => 'عقارات سيدي كرير | شاليهات وفلل للبيع في سيدي كرير',
                'meta_title_en' => 'Sidi Kerir Real Estate | Chalets & Villas for Sale',
                'meta_description_ar' => 'تصفح أحدث الشاليهات والفلل المعروضة للبيع في سيدي كرير بالساحل الشمالي بأفضل الأسعار.',
                'meta_description_en' => 'Find family chalets and holiday villas for sale in Sidi Kerir, North Coast.',
                'meta_keywords_ar' => ['سيدي كرير', 'شاليهات سيدي كرير', 'قرية سيدي كرير'],
                'meta_keywords_en' => ['Sidi Kerir', 'Sidi Kerir Chalets'],
                'features' => [
                    ['title_ar' => 'قرب ممتاز من الإسكندرية ومطار برج العرب', 'title_en' => 'Close to Alexandria & Airport', 'description_ar' => 'تبعد 20 دقيقة فقط عن مطار برج العرب.', 'description_en' => 'Just 20 minutes from Borg El Arab International Airport.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مطار برج العرب الدولي', 'name_en' => 'Borg El Arab Airport', 'description_ar' => 'مطار دولي رئيسي', 'description_en' => 'International Airport', 'distance' => '20', 'distance_unit' => 'دقيقة'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما الذي يميز سيدي كرير عن باقي مناطق الساحل البعيدة؟', 'question_en' => 'What sets Sidi Kerir apart from distant coastal zones?', 'answer_ar' => 'قربها المباشر من القاهرة والإسكندرية مما يجعل زيارتها أسبوعياً طوال العام أمراً سهلاً.', 'answer_en' => 'Proximity to Alexandria and Cairo allows easy weekend getaways year-round.'],
                ]
            ],

            // 15. سيدي عبد الرحمن
            [
                'slug' => 'sidi-abdel-rahman',
                'name_ar' => 'سيدي عبد الرحمن',
                'name_en' => 'Sidi Abdel Rahman',
                'sort_order' => 15,
                'latitude' => 30.9642,
                'longitude' => 28.7011,
                'address_ar' => 'خليج سيدي عبد الرحمن، الكيلو 120، الساحل الشمالي، مصر',
                'address_en' => 'Sidi Abdel Rahman Bay, KM 120, North Coast, Egypt',
                'short_description_ar' => 'أشهر خليج سياحي في مصر، يضم منتجع مراسي العالمي وهاسيندا وأرقى الشواطئ الرملية الفاخرة على البحر المتوسط.',
                'short_description_en' => 'Egypt iconic luxury bay, home to Marassi, Hacienda Bay, and the finest white sand beaches on the Mediterranean.',
                'hero_title_ar' => 'شاليهات ومراسي سيدي عبد الرحمن الفاخرة',
                'hero_title_en' => 'Sidi Abdel Rahman & Marassi Luxury Chalets',
                'hero_description_ar' => 'امتلك شاليه أو فيلا في خليج سيدي عبد الرحمن ومراسي بالتقسيط وأفخم التشطيبات الفندقية.',
                'hero_description_en' => 'Explore beachfront chalets and villas for sale in Marassi and Sidi Abdel Rahman Bay.',
                'about_ar' => 'يقع خليج سيدي عبد الرحمن في الكيلو 120 على الساحل الشمالي. يُعد الرمز الأول للفخامة والرفاهية في مصر، حيث يضم مشروع مراسي المطور من شركة إعمار مصر، ومشاريع هاسيندا من بالم هيلز، وأمواج. يمتاز بشاطئه الرملي الأبيض الخالي من الصخور ومياهه الفيروزية الساحرة.',
                'about_en' => 'Sidi Abdel Rahman Bay at KM 120 is the undisputed capital of luxury resort living in Egypt. Home to Emaar Marassi, Palm Hills Hacienda, and Amwaj, it features flawless rock-free white sand beaches.',
                'meta_title_ar' => 'عقارات سيدي عبد الرحمن | شاليهات وفلل في مراسي وهاسيندا',
                'meta_title_en' => 'Sidi Abdel Rahman Real Estate | Marassi & Hacienda Chalets',
                'meta_description_ar' => 'امتلك شاليه أو فيلا في خليج سيدي عبد الرحمن ومراسي بالتقسيط وأفخم التشطيبات الفندقية.',
                'meta_description_en' => 'Explore beachfront chalets and villas for sale in Marassi and Sidi Abdel Rahman Bay.',
                'meta_keywords_ar' => ['سيدي عبد الرحمن', 'مراسي', 'هاسيندا', 'شاليهات سيدي عبد الرحمن'],
                'meta_keywords_en' => ['Sidi Abdel Rahman', 'Marassi', 'Hacienda Bay', 'Marassi Chalets'],
                'features' => [
                    ['title_ar' => 'أفخم منتجعات ومراسي في مصر', 'title_en' => 'Top Luxury Marassi & Hacienda', 'description_ar' => 'تضم أشهر الفنادق والمطاعم العالمية.', 'description_en' => 'Hosting 5-star hotels, marinas, and global dining.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مراسي إعمار', 'name_en' => 'Marassi Emaar', 'description_ar' => 'أفخم مجتمع سياحي ساحلي', 'description_en' => 'Premier Mediterranean Resort', 'distance' => '2', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما الذي يضمن نجاح الاستثمار في سيدي عبد الرحمن؟', 'question_en' => 'What secures investment success in Sidi Abdel Rahman?', 'answer_ar' => 'الطلب العالمي والمحلي المرتفع للغاية وعائدات الإيجار اليومية القياسية خلال فصل الصيف.', 'answer_en' => 'Peak seasonal daily rental rates and unmatched market demand.'],
                ]
            ],

            // 16. مارينا
            [
                'slug' => 'marina',
                'name_ar' => 'مارينا',
                'name_en' => 'Marina Alamein',
                'sort_order' => 16,
                'latitude' => 30.8654,
                'longitude' => 28.9876,
                'address_ar' => 'مركز مارينا العلمين السياحي، الساحل الشمالي، مصر',
                'address_en' => 'Marina Alamein Tourist Center, North Coast, Egypt',
                'short_description_ar' => 'أسطورة الساحل الشمالي الكلاسيكية وأكبر منتجع سياحي متكامل، يضم مارينا 1 إلى 7 والبحيرات والأنشطة البحرية.',
                'short_description_en' => 'The flagship classic North Coast resort center, encompassing Marina 1 to 7 with expansive lagoons & boat marinas.',
                'hero_title_ar' => 'شاليهات وفلل مارينا العلمين الكلاسيكية',
                'hero_title_en' => 'Marina Alamein Classic Resort Chalets',
                'hero_description_ar' => 'اعثر على أفضل الشاليهات والفلل المعروضة للبيع في مارينا 1 إلى 7 بأسعار ممتازة.',
                'hero_description_en' => 'Find chalets, villas, and resort flats for sale across Marina 1 to 7 in North Coast.',
                'about_ar' => 'تُعد مارينا العلمين (من مارينا 1 حتى مارينا 7) أشهر وأعرق مجمع سياحي متكامل على ساحل البحر المتوسط في مصر. تمتد على مساحة واسعة وتتميز بوجود لسان بحري وبحيرات صناعية داخلية، بجانب مرافئ اليخوت والمطاعم والخدمات المتكاملة.',
                'about_en' => 'Marina Alamein (Marina 1 through 7) is the historic pioneer of coastal resorts in Egypt. Featuring artificial lakes, yachting marinas, and extensive commercial zones.',
                'meta_title_ar' => 'عقارات مارينا العلمين | شاليهات وفيلا للبيع في مارينا',
                'meta_title_en' => 'Marina Alamein Real Estate | Chalets & Villas for Sale',
                'meta_description_ar' => 'اعثر على أفضل الشاليهات والفلل المعروضة للبيع في مارينا 1 إلى 7 بأسعار ممتازة.',
                'meta_description_en' => 'Find chalets, villas, and resort flats for sale across Marina 1 to 7 in North Coast.',
                'meta_keywords_ar' => ['مارينا', 'مارينا العلمين', 'شاليهات مارينا', 'فلل مارينا'],
                'meta_keywords_en' => ['Marina', 'Marina Alamein', 'Marina Chalets'],
                'features' => [
                    ['title_ar' => 'بحيرات ومرافئ يخوت متكاملة', 'title_en' => 'Expansive Lagoons & Yacht Marinas', 'description_ar' => 'قنوات مائية وبحيرات آمنة للسباحة والألعاب المائية.', 'description_en' => 'Inland saltwater lakes and water sports facilities.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مارينا 5 ومارينا 7', 'name_en' => 'Marina 5 & 7 Hubs', 'description_ar' => 'أشهر مراكز الخدمات في مارينا', 'description_en' => 'Prime Commercial Centers', 'distance' => '2', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تتوفر شاليهات للبيع بإطلالة على البحيرات في مارينا؟', 'question_en' => 'Are lake-view chalets available in Marina?', 'answer_ar' => 'نعم، تتوفر خيارات متنوعة من الشاليهات المطلة على البحيرات أو البحر مباشرة.', 'answer_en' => 'Yes, a wide selection of lake-facing and direct sea view chalets is available.'],
                ]
            ],

            // 17. مرسى مطروح
            [
                'slug' => 'marsa-matruh',
                'name_ar' => 'مرسى مطروح',
                'name_en' => 'Marsa Matruh',
                'sort_order' => 17,
                'latitude' => 31.3543,
                'longitude' => 27.2373,
                'address_ar' => 'مدينة مرسى مطروح، عاصمة محافظة مطروح، مصر',
                'address_en' => 'Marsa Matruh City, Capital of Matruh Governorate, Egypt',
                'short_description_ar' => 'عاصمة السحر والجمال بشواطئها العالمية الخلابة مثل كليوباترا والغرام والغرام الأبيض وبشققها المصيفية ذات الأسعار الاقتصادية.',
                'short_description_en' => 'Famous for breathtaking natural lagoons, Cleopatra Beach, Agiba, and highly accessible summer vacation apartments.',
                'hero_title_ar' => 'عقارات وشقق مرسى مطروح المصيفية',
                'hero_title_en' => 'Marsa Matruh Vacation Apartments & Properties',
                'hero_description_ar' => 'تصفح شقق ومصايف للبيع في مرسى مطروح وقرب شاطئ عجيبة وكليوباترا بأحسن سعر.',
                'hero_description_en' => 'Browse affordable coastal apartments and summer chalets for sale in Marsa Matruh.',
                'about_ar' => 'مدينة مرسى مطروح هي عاصمة محافظة مطروح وتعتبر من أجمل المدن الساحلية في مصر والعالم بفضل خليجها الطبيعي وشواطئها الكريستالية الشهيرة مثل شاطئ عجيبة وشاطئ كليوباترا والغروب. تتميز بتنوع الوحدات السكنية والمصيفية وبأسعارها المناسبة لمختلف الفئات.',
                'about_en' => 'Marsa Matruh is celebrated for its natural sea lagoons, transparent waters, and legendary beaches like Agiba and Cleopatra. It offers accessible residential and summer holiday apartments.',
                'meta_title_ar' => 'عقارات مرسى مطروح | شقق ومصايف للبيع في مطروح',
                'meta_title_en' => 'Marsa Matruh Real Estate | Vacation Apartments for Sale',
                'meta_description_ar' => 'تصفح شقق ومصايف للبيع في مرسى مطروح وقرب شاطئ عجيبة وكليوباترا بأحسن سعر.',
                'meta_description_en' => 'Browse affordable coastal apartments and summer chalets for sale in Marsa Matruh.',
                'meta_keywords_ar' => ['مرسى مطروح', 'شقق مطروح', 'مصايف مطروح', 'شاطئ عجيبة'],
                'meta_keywords_en' => ['Marsa Matruh', 'Matruh Apartments', 'Agiba Beach'],
                'features' => [
                    ['title_ar' => 'شواطئ كريستالية طبيعية ساحرة', 'title_en' => 'Crystal Natural Lagoons', 'description_ar' => 'تتميز بتدرج درجات الأزرق في المياه والرمال الناعمة.', 'description_en' => 'Renowned for multi-toned blue waters and white sands.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'شاطئ عجيبة', 'name_en' => 'Agiba Beach', 'description_ar' => 'من أجمل معالم الطبيعة في مطروح', 'description_en' => 'Iconic Cliffside Beach', 'distance' => '15', 'distance_unit' => 'دقيقة'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تعتبر مطروح مناسبة للشراء بغرض التمليك والاستثمار المصيفي؟', 'question_en' => 'Is Marsa Matruh suitable for summer holiday home investment?', 'answer_ar' => 'نعم، تحقق الشقق المطلة على البحر نسبة إقبال مرتفعة جداً وتأجيراً موسمياً مربحاً.', 'answer_en' => 'Yes, sea view apartments achieve strong summer holiday occupancy rates.'],
                ]
            ],

            // 18. مدينة نصر
            [
                'slug' => 'nasr-city',
                'name_ar' => 'مدينة نصر',
                'name_en' => 'Nasr City',
                'sort_order' => 18,
                'latitude' => 30.0561,
                'longitude' => 31.3301,
                'address_ar' => 'حي مدينة نصر، شرق القاهرة، مصر',
                'address_en' => 'Nasr City District, East Cairo, Egypt',
                'short_description_ar' => 'أحد أكبر وأشهر أحياء القاهرة الكبرى، يمتاز بشبكة الطرق الحديثة، المجمعات التجارية الكبرى كـ سيتي ستارز، والخدمات المكتملة.',
                'short_description_en' => 'One of Greater Cairo largest districts, featuring City Stars Mall, major commercial corridors, and dense infrastructure.',
                'hero_title_ar' => 'عقارات ومشاريع مدينة نصر الحيوية',
                'hero_title_en' => 'Nasr City Properties & Commercial Hubs',
                'hero_description_ar' => 'تصفح أحدث الشقق والمكاتب التجارية المتاحة للبيع والإيجار في عباس العقاد ومكرم عبيد والحي السابع.',
                'hero_description_en' => 'Find apartments, commercial spaces, and offices for sale or rent in Nasr City.',
                'about_ar' => 'تُعد مدينة نصر من أكبر أحياء القاهرة مساحة وأكثرها حيوية. تضم مناطق سكنية عريقة مثل الحي السابع، الحي الثامن، ومكرم عبيد وعباس العقاد. تتميز بوفرة المولات مثل سيتي ستارز وسيتي سنتر، وقربها المباشر من مطار القاهرة والتجمع الخامس.',
                'about_en' => 'Nasr City is a premier eastern Cairo residential and commercial district. Encompassing Abbas Al Akkad, Makram Ebeid, and City Stars Mall, it enjoys direct connectivity to Cairo Airport.',
                'meta_title_ar' => 'عقارات مدينة نصر | شقق ومكاتب للبيع في مدينة نصر',
                'meta_title_en' => 'Nasr City Real Estate | Apartments & Offices for Sale',
                'meta_description_ar' => 'تصفح أحدث الشقق والمكاتب التجارية المتاحة للبيع والإيجار في عباس العقاد ومكرم عبيد والحي السابع.',
                'meta_description_en' => 'Find apartments, commercial spaces, and offices for sale or rent in Nasr City.',
                'meta_keywords_ar' => ['مدينة نصر', 'شقق مدينة نصر', 'عباس العقاد', 'سيتي ستارز'],
                'meta_keywords_en' => ['Nasr City', 'Nasr City Apartments', 'Abbas Al Akkad'],
                'features' => [
                    ['title_ar' => 'مراكز تجارية وكباري حديثة', 'title_en' => 'Major Malls & Modern Bridges', 'description_ar' => 'تضم سيتي ستارز وتتصل بشبكة كباري يسهل الحركة.', 'description_en' => 'Home to City Stars with streamlined elevated road networks.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'سيتي ستارز مول', 'name_en' => 'City Stars Mall', 'description_ar' => 'أشهر مجمع تجاري وفندقي', 'description_en' => 'Major Shopping & Hotel Complex', 'distance' => '5', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'هل تعتبر مدينة نصر خياراً ممتازاً للمكاتب الإدارية؟', 'question_en' => 'Is Nasr City recommended for corporate offices?', 'answer_ar' => 'نعم، تعتبر مكرم عبيد وعباس العقاد والمنطقة الأولى خيارات استثنائية للمكاتب والعيادات.', 'answer_en' => 'Yes, Makram Ebeid and Abbas El Akkad are top Cairo commercial hubs.'],
                ]
            ],

            // 19. الرحاب
            [
                'slug' => 'rehab',
                'name_ar' => 'الرحاب',
                'name_en' => 'Al Rehab City',
                'sort_order' => 19,
                'latitude' => 30.0617,
                'longitude' => 31.4889,
                'address_ar' => 'مدينة الرحاب، القاهرة الجديدة، مصر',
                'address_en' => 'Al Rehab City, New Cairo, Egypt',
                'short_description_ar' => 'أول مدينة سكنية متكاملة الخدمات يطورها القطاع الخاص في القاهرة الجديدة، تتميز بالهدوء والأمن والمساحات الخضراء.',
                'short_description_en' => 'Egypt pioneer private fully integrated master-planned city in New Cairo, known for security, greenery, and convenience.',
                'hero_title_ar' => 'عقارات وشقق مدينة الرحاب 1 و 2',
                'hero_title_en' => 'Al Rehab City 1 & 2 Properties',
                'hero_description_ar' => 'ابحث عن شقق وفلل للبيع والإيجار في الرحاب 1 والرحاب 2 بالقاهرة الجديدة بأفضل الأسعار.',
                'hero_description_en' => 'Find luxury apartments and villas for sale or rent in Al Rehab City, New Cairo.',
                'about_ar' => 'مدينة الرحاب هي أول مدينة سكنية متكاملة يسكنها أكثر من 200 ألف نسمة في القاهرة الجديدة، طورها مجموعة طلعت مصطفى. تضم الرحاب 1 والرحاب 2، وتوفر كافة الخدمات من مجمعات تجارية (السوق التجاري والمول)، مساجد، كنيسة، نادي الرحاب الرياضي، ومدارس دولية.',
                'about_en' => 'Al Rehab City is Egypt premier private gated city developed by Talaat Moustafa Group in New Cairo. Featuring Rehab 1 & 2, it boasts Rehab Sports Club, commercial markets, and international schools.',
                'meta_title_ar' => 'عقارات الرحاب | شقق وفلل للبيع في مدينة الرحاب',
                'meta_title_en' => 'Al Rehab City Real Estate | Apartments & Villas for Sale',
                'meta_description_ar' => 'ابحث عن شقق وفلل للبيع والإيجار في الرحاب 1 والرحاب 2 بالقاهرة الجديدة بأفضل الأسعار.',
                'meta_description_en' => 'Find luxury apartments and villas for sale or rent in Al Rehab City, New Cairo.',
                'meta_keywords_ar' => ['الرحاب', 'مدينة الرحاب', 'شقق الرحاب', 'عقارات الرحاب'],
                'meta_keywords_en' => ['Al Rehab', 'Rehab City', 'Rehab Apartments'],
                'features' => [
                    ['title_ar' => 'مجتمع سكني مغلق وآمن بالكامل', 'title_en' => 'Fully Gated & Secured City', 'description_ar' => 'أمن ونظافة وصيانة على مدار 24 ساعة.', 'description_en' => '24/7 private security, maintenance, and green spaces.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'السوق الشرقي التجاري', 'name_en' => 'Eastern Market Hub', 'description_ar' => 'مجمع خدمات ومطاعم متكامل', 'description_en' => 'Integrated Commercial Services', 'distance' => '3', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي مميزات السكن في مدينة الرحاب؟', 'question_en' => 'What are the main benefits of living in Al Rehab City?', 'answer_ar' => 'الخصوصية التامة، توفر الخدمات دون الحاجة للخروج من المدينة، وجود النادي والحدائق.', 'answer_en' => 'Complete self-sufficiency, high security, sports club, and green surroundings.'],
                ]
            ],

            // 20. 6 أكتوبر
            [
                'slug' => '6th-october',
                'name_ar' => '6 أكتوبر',
                'name_en' => '6th of October City',
                'sort_order' => 20,
                'latitude' => 29.9744,
                'longitude' => 30.9427,
                'address_ar' => 'مدينة 6 أكتوبر، محافظة الجيزة، مصر',
                'address_en' => '6th of October City, Giza Governorate, Egypt',
                'short_description_ar' => 'إحدى أكبر المدن السكنية والصناعية في مصر، تقع غرب القاهرة وتضم مول مصر والمستشفيات والجامعات الكبرى.',
                'short_description_en' => 'A major residential and industrial city west of Cairo, home to Mall of Egypt, top universities, and vast residential zones.',
                'hero_title_ar' => 'عقارات ومشاريع 6 أكتوبر والحي المتميز',
                'hero_title_en' => '6th of October City Properties & Compounds',
                'hero_description_ar' => 'تصفح أحدث الشقق والفلل والكمبوندات السكنية والتجارية في مدينة 6 أكتوبر بأفضل الأسعار.',
                'hero_description_en' => 'Explore residential apartments, villas, and industrial properties in 6th of October City.',
                'about_ar' => 'مدينة السادس من أكتوبر هي مدينة سكنية وصناعية متكاملة تقع في محافظة الجيزة. تتميز بالارتفاع عن سطح البحر ونقاء الجو وتنوع الأحياء السكنية من السياحية والأحياء الـ 12 إلى الكمبوندات الفاخرة، بالإضافة إلى مول مصر ومستشفى سعاد كفافي وجامعة 6 أكتوبر.',
                'about_en' => '6th of October City is a major urban center west of Giza. Celebrated for clean air, high elevation, Mall of Egypt, 6th of October University, and diverse compound choices.',
                'meta_title_ar' => 'عقارات 6 أكتوبر | شقق وفلل للبيع في السادس من أكتوبر',
                'meta_title_en' => '6th of October Real Estate | Apartments & Villas for Sale',
                'meta_description_ar' => 'تصفح أحدث الشقق والفلل والكمبوندات السكنية والتجارية في مدينة 6 أكتوبر بأفضل الأسعار.',
                'meta_description_en' => 'Explore residential apartments, villas, and industrial properties in 6th of October City.',
                'meta_keywords_ar' => ['6 أكتوبر', 'السادس من أكتوبر', 'شقق 6 أكتوبر', 'عقارات أكتوبر'],
                'meta_keywords_en' => ['6th of October', '6 October Apartments', '6th October Compounds'],
                'features' => [
                    ['title_ar' => 'جو نقي وارتفاع عن مستوى سطح البحر', 'title_en' => 'High Elevation & Fresh Air', 'description_ar' => 'تتميز بالاعتدال المناخي وانخفاض الرطوبة.', 'description_en' => 'Offers cooler climate and lower humidity level.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مول مصر', 'name_en' => 'Mall of Egypt', 'description_ar' => 'مركز تسوق وترفيه كبـير يضم سكي مصر', 'description_en' => 'Premier Shopping Mall with Ski Egypt', 'distance' => '10', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي أرقى الأحياء السكنية في 6 أكتوبر؟', 'question_en' => 'Which are the most prestigious districts in 6th of October?', 'answer_ar' => 'الحي المتميز، المنطقة السياحية، وأحياء التوسعات الشمالية والكمبوندات المغلقة.', 'answer_en' => 'Distinctive District (Motamayez), Tourist Area, and Northern Expansions compounds.'],
                ]
            ],

            // 21. مصر الجديدة
            [
                'slug' => 'heliopolis',
                'name_ar' => 'مصر الجديدة',
                'name_en' => 'Heliopolis',
                'sort_order' => 21,
                'latitude' => 30.0889,
                'longitude' => 31.3322,
                'address_ar' => 'حي مصر الجديدة، القاهرة، مصر',
                'address_en' => 'Heliopolis District, Cairo, Egypt',
                'short_description_ar' => 'أحد أعرق وأجمل أحياء القاهرة الملكية، يتميز بالمعمار البلجيكي العريق، قصر البارون، والموقع المباشر قرب مطار القاهرة.',
                'short_description_en' => 'A historic royal Cairo district designed with Belgian architecture, home to Baron Empain Palace and minutes from Cairo Airport.',
                'hero_title_ar' => 'عقارات ومشاريع مصر الجديدة والكوربة',
                'hero_title_en' => 'Heliopolis & Korba Properties & Offices',
                'hero_description_ar' => 'ابحث عن شقق وعقارات للبيع والإيجار في الكوربة وأرض الجولف والميرغني بمصر الجديدة.',
                'hero_description_en' => 'Browse luxury flats and commercial properties for sale in Korba, Merghany, and Heliopolis.',
                'about_ar' => 'تعد مصر الجديدة (هليوبوليس) من أرقى وأعرق أحياء العاصمة. أسسها البارون إمبان في أوائل القرن العشرين وتتميز بالمعمار الكلاسيكي الفريد، وتضم معالم بارزة مثل قصر البارون الكوربة، وقصر الاتحادية، ومطار القاهرة الدولي.',
                'about_en' => 'Heliopolis was founded by Baron Empain in the early 20th century. Renowned for Belgian architecture, Korba commercial avenues, Baron Palace, and proximity to Cairo International Airport.',
                'meta_title_ar' => 'عقارات مصر الجديدة | شقق ومكاتب للبيع في مصر الجديدة',
                'meta_title_en' => 'Heliopolis Real Estate | Luxury Apartments & Offices for Sale',
                'meta_description_ar' => 'ابحث عن شقق وعقارات للبيع والإيجار في الكوربة وأرض الجولف والميرغني بمصر الجديدة.',
                'meta_description_en' => 'Browse luxury flats and commercial properties for sale in Korba, Merghany, and Heliopolis.',
                'meta_keywords_ar' => ['مصر الجديدة', 'الكوربة', 'شقق مصر الجديدة', 'عقارات هليوبوليس'],
                'meta_keywords_en' => ['Heliopolis', 'Korba', 'Heliopolis Apartments'],
                'features' => [
                    ['title_ar' => 'طراز معماري كلاسيكي فريد', 'title_en' => 'Unique Belgian Architectural Heritage', 'description_ar' => 'تتميز منطقة الكوربة بمبانيها التاريخية الفخمة.', 'description_en' => 'Korba area showcases grand historic palaces and avenues.'],
                ],
                'nearby_places' => [
                    ['name_ar' => 'مطار القاهرة الدولي', 'name_en' => 'Cairo International Airport', 'description_ar' => 'المطار الرئيسي للعاصمة', 'description_en' => 'Cairo Main International Airport', 'distance' => '10', 'distance_unit' => 'دقائق'],
                ],
                'faqs' => [
                    ['question_ar' => 'ما هي أشهر مناطق مصر الجديدة للسكن والاستثمار؟', 'question_en' => 'Which areas in Heliopolis are most desirable?', 'answer_ar' => 'منطقة الكوربة، أرض الجولف، شارع الميرغني، وميدان الحجاز.', 'answer_en' => 'Korba, Ard El Golf, Merghany Street, and Hegaz Square.'],
                ]
            ],
        ];

        foreach ($areasData as $data) {
            $features = $data['features'] ?? [];
            $nearbyPlaces = $data['nearby_places'] ?? [];
            $faqs = $data['faqs'] ?? [];

            unset($data['features'], $data['nearby_places'], $data['faqs']);

            // Find or create the area by slug, leaving image fields intact if existing
            $area = Area::where('slug', $data['slug'])->first();

            // Ensure map_url is concise to fit varchar column
            $data['map_url'] = "https://maps.google.com/?q={$data['latitude']},{$data['longitude']}";
            $data['is_active'] = true;

            if ($area) {
                // Update text & spatial fields, preserving existing images
                $area->update($data);
            } else {
                // Create new area with defaults
                $area = Area::create($data);
            }

            // Sync features
            if (!empty($features)) {
                AreaFeature::where('area_id', $area->id)->delete();
                foreach ($features as $idx => $feat) {
                    AreaFeature::create([
                        'area_id' => $area->id,
                        'title_ar' => $feat['title_ar'],
                        'title_en' => $feat['title_en'],
                        'description_ar' => $feat['description_ar'] ?? null,
                        'description_en' => $feat['description_en'] ?? null,
                        'icon' => $feat['icon'] ?? 'check',
                        'sort_order' => $idx + 1,
                        'is_active' => true,
                    ]);
                }
            }

            // Sync nearby places
            if (!empty($nearbyPlaces)) {
                AreaNearbyPlace::where('area_id', $area->id)->delete();
                foreach ($nearbyPlaces as $idx => $place) {
                    AreaNearbyPlace::create([
                        'area_id' => $area->id,
                        'name_ar' => $place['name_ar'],
                        'name_en' => $place['name_en'],
                        'description_ar' => $place['description_ar'] ?? null,
                        'description_en' => $place['description_en'] ?? null,
                        'distance' => $place['distance'] ?? '5',
                        'distance_unit' => $place['distance_unit'] ?? 'دقائق',
                        'sort_order' => $idx + 1,
                        'is_active' => true,
                    ]);
                }
            }

            // Sync FAQs
            if (!empty($faqs)) {
                AreaFaq::where('area_id', $area->id)->delete();
                foreach ($faqs as $idx => $faq) {
                    AreaFaq::create([
                        'area_id' => $area->id,
                        'question_ar' => $faq['question_ar'],
                        'question_en' => $faq['question_en'],
                        'answer_ar' => $faq['answer_ar'],
                        'answer_en' => $faq['answer_en'],
                        'sort_order' => $idx + 1,
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}