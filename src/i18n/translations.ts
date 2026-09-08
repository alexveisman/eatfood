import { Language, CategoryId } from '../types';

export interface TranslationDict {
  // Navigation & Header
  pickupAddress: string;
  freeSweetGift: string;
  whatsappBtn: string;
  cartBtn: string;
  languageName: string;

  // Hero
  heroTitle: string;
  heroSubtitle: string;

  // Promo Banner
  giftBadge: string;
  giftTitle: string;
  giftDesc: string;

  // Category Nav & Search
  searchPlaceholder: string;
  allFillings: string;
  filterByFillings: string;
  noProductsFound: string;
  noProductsFoundDesc: string;
  showAllMenu: string;

  // Product Card & Modal
  currency: string;
  /** Подпись вместо цены у блюд, которые считаются под конкретный заказ. */
  priceOnRequest: string;
  inCart: string;
  addToOrder: string;
  chooseOptions: string;
  preorderOnlyBadge: string;
  fillingsLabel: string;
  fillingsInParenthesesPrefix: string;
  askOnWhatsApp: string;
  portionUnit: string;
  selectFillingPrompt: string;
  selectCookingPrompt: string;
  ingredientsTitle: string;
  storageTitle: string;
  instructionsTitle: string;
  notesPlaceholder: string;
  specialNotesTitle: string;
  quantityLabel: string;
  totalLabel: string;
  addToCartBtn: string;
  addedSuccess: string;
  askChefWhatsApp: string;

  // Restaurant Menu List & Photo Gallery
  viewModeMenu: string;
  viewModeGrid: string;
  photoGalleryTitle: string;
  photoGallerySubtitle: string;
  swipeHint: string;
  quickSelect: string;
  fillingsOnChoice: string;
  cookingPreparation: string;
  chefTip: string;
  orderDishOnWhatsApp: string;
  restaurantMenuTitle: string;
  restaurantMenuSubtitle: string;
  textUsWhatsAppHeader: string;
  textUsWhatsAppDesc: string;

  // Preorder Section
  preorderSectionBadge: string;
  preorderSectionTitle: string;
  preorderSectionSubtitle: string;
  preorderFeature1Title: string;
  preorderFeature1Desc: string;
  preorderFeature2Title: string;
  preorderFeature2Desc: string;
  preorderFeature3Title: string;
  preorderFeature3Desc: string;
  preorderDiscussWhatsApp: string;

  // Delivery Section
  deliveryBadge: string;
  deliveryTitle: string;
  deliverySubtitle: string;
  pickupCardTitle: string;
  pickupCardTime: string;
  pickupCardDesc: string;
  courierCardTitle: string;
  courierCardTime: string;
  courierCardDesc: string;
  orderTermsTitle: string;
  orderTermsPreorder: string;
  orderTermsMinimum: string;
  orderTermsPayment: string;

  // Reviews Section
  reviewsBadge: string;
  reviewsTitle: string;
  reviewsSubtitle: string;
  verifiedBuyer: string;
  leaveReviewBtn: string;
  reviewModalTitle: string;
  yourName: string;
  yourRating: string;
  yourOrderItems: string;
  yourReviewComment: string;
  submitReviewBtn: string;
  reviewSuccessMessage: string;

  // Cart Drawer
  cartDrawerTitle: string;
  cartEmptyTitle: string;
  cartEmptySubtitle: string;
  cartDeliveryType: string;
  deliveryOptionPickup: string;
  deliveryOptionTaxi: string;
  customerNameLabel: string;
  customerPhoneLabel: string;
  preferredDateLabel: string;
  preferredTimeLabel: string;
  orderNotesLabel: string;
  orderNotesPlaceholder: string;
  orderSummaryTitle: string;
  orderTotalLabel: string;
  giftIncluded: string;
  whatsappCheckoutBtn: string;
  whatsappManagerNote: string;
  clearCartBtn: string;
  deleteItem: string;

  // Footer
  footerAboutTitle: string;
  footerAboutText: string;
  footerHoursTitle: string;
  footerHoursText: string;
  footerContactsTitle: string;
  footerPickupText: string;
  footerCopyright: string;
  footerHomemadeGuarantee: string;

  // Restaurant Menu Additional Localized Strings
  ingredientsAndTips: string;
  quickOrderWhatsApp: string;
  storageLabel: string;
  portionWeightLabel: string;
  pickupAndDeliveryFooter: string;
  sweetComplimentFooter: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  ru: {
    pickupAddress: 'ул. Реувен Рубин 5',
    freeSweetGift: 'Ежедневно: 10:00 - 21:00',
    whatsappBtn: 'WhatsApp',
    cartBtn: 'Корзина',
    languageName: 'Русский',

    heroTitle: 'Домашняя кухня & выпечка',
    heroSubtitle: 'Горячие пирожки, хрустящие плацинды, вареники, пельмени и праздничные блюда. Выбирайте начинку и заказывайте в WhatsApp!',

    giftBadge: 'Свежая выпечка',
    giftTitle: 'Свежая выпечка и домашняя кухня',
    giftDesc: 'Готовим из натуральных фермерских продуктов по проверенным домашним рецептам.',

    searchPlaceholder: 'Поиск блюд, начинок или ингредиентов...',
    allFillings: 'Все начинки',
    filterByFillings: 'Фильтр по начинкам:',
    noProductsFound: 'Блюда не найдены',
    noProductsFoundDesc: 'Попробуйте изменить запрос или очистить фильтры по начинкам.',
    showAllMenu: 'Показать всё меню',

    currency: '₪',
    priceOnRequest: 'Цена по договорённости',
    inCart: 'В корзине',
    addToOrder: 'В заказ',
    chooseOptions: 'Выбрать',
    preorderOnlyBadge: 'Предзаказ',
    fillingsLabel: 'Начинки:',
    fillingsInParenthesesPrefix: 'на выбор',
    askOnWhatsApp: 'Спросить в WhatsApp',
    portionUnit: 'шт',
    selectFillingPrompt: 'Выберите начинку:',
    selectCookingPrompt: 'Способ приготовления:',
    ingredientsTitle: 'Состав & Ингредиенты:',
    storageTitle: 'Срок хранения:',
    instructionsTitle: 'Рекомендация по приготовлению:',
    notesPlaceholder: 'Ваши пожелания (например, без лука, больше зелени, к определенному часу)...',
    specialNotesTitle: 'Пожелания к блюду:',
    quantityLabel: 'Количество:',
    totalLabel: 'Итого к оплате:',
    addToCartBtn: 'Добавить в корзину',
    addedSuccess: '✓ Добавлено в заказ!',
    askChefWhatsApp: 'Уточнить у повара в WhatsApp',

    // Restaurant Menu List & Photo Gallery
    viewModeMenu: 'Меню списком',
    viewModeGrid: 'Карточки',
    photoGalleryTitle: 'Фотогалерея наших блюд',
    photoGallerySubtitle: 'Наши свежеприготовленные блюда — нажимайте на любое фото для быстрого заказа в WhatsApp',
    swipeHint: '← Фотографии наших блюд →',
    quickSelect: 'Заказать в WhatsApp',
    fillingsOnChoice: 'Начинки на выбор',
    cookingPreparation: 'Приготовление',
    chefTip: 'Рекомендация',
    orderDishOnWhatsApp: 'Заказать в WhatsApp',
    restaurantMenuTitle: 'Меню домашней кухни',
    restaurantMenuSubtitle: 'Все блюда готовятся свежими под заказ из натуральных фермерских продуктов. Напишите нам в WhatsApp для быстрого заказа!',
    textUsWhatsAppHeader: 'Заказ напрямую в WhatsApp',
    textUsWhatsAppDesc: 'Нажмите кнопку рядом с любым блюдом — текст с вашим выбором сформируется автоматически!',

    preorderSectionBadge: 'Индивидуальный заказ',
    preorderSectionTitle: 'Индивидуальный заказ',
    preorderSectionSubtitle: 'Мы можем больше, в том числе торты со сложным декором — напишите нам, и мы приготовим то, что нужно!',
    preorderFeature1Title: 'Торты со сложным декором',
    preorderFeature1Desc: 'Авторский декор, фигурная лепка, детские и свадебные торты, капкейки и изысканные десерты.',
    preorderFeature2Title: 'Блюда по вашему рецепту',
    preorderFeature2Desc: 'Приготовим любимые домашние блюда, выпечку и деликатесы по вашему индивидуальному списку.',
    preorderFeature3Title: 'Праздники и семейные ужины',
    preorderFeature3Desc: 'Банкетные сеты, праздничные столы и выпечка точно к назначенному времени.',
    preorderDiscussWhatsApp: 'Написать нам в WhatsApp',

    deliveryBadge: 'Условия & Самовывоз',
    deliveryTitle: 'Как получить заказ',
    deliverySubtitle: 'Заберите свежеприготовленные блюда самостоятельно или закажите доставку.',
    pickupCardTitle: 'Самовывоз (Бесплатно)',
    pickupCardTime: 'Ежедневно: 10:00 - 21:00',
    pickupCardDesc: 'г. Тель-Авив / Бат-Ям, ул. Реувен Рубин 5. Упакуем горячим к назначенному времени.',
    courierCardTitle: 'Доставка через Такси / Курьера',
    courierCardTime: 'По тарифу курьерской службы',
    courierCardDesc: 'Отправляем курьером прямо до вашей двери по тарифам службы.',
    orderTermsTitle: 'Важная информация о заказах',
    orderTermsPreorder: 'Свежая выпечка готовится под заказ, среднее время приготовления — от 1.5 до 3 часов.',
    orderTermsMinimum: 'Минимальной суммы заказа нет для самовывоза.',
    orderTermsPayment: 'Оплата наличными или переводом (Bit / PayBox / Банк) при согласовании заказа.',

    reviewsBadge: 'Отзывы гостей',
    reviewsTitle: 'Отзывы наших гостей',
    reviewsSubtitle: 'Реальные впечатления о вкусе, качестве начинок и домашней атмосфере.',
    verifiedBuyer: 'Проверенный заказ',
    leaveReviewBtn: 'Оставить отзыв',
    reviewModalTitle: 'Поделитесь отзывом',
    yourName: 'Ваше имя',
    yourRating: 'Оценка блюд:',
    yourOrderItems: 'Что вы заказывали?',
    yourReviewComment: 'Ваш отзыв и впечатления',
    submitReviewBtn: 'Опубликовать отзыв',
    reviewSuccessMessage: 'Спасибо за ваш отзыв! Мы ценим ваше доверие ❤️',

    cartDrawerTitle: 'Ваша корзина',
    cartEmptyTitle: 'Корзина пуста',
    cartEmptySubtitle: 'Выберите вкуснейшую домашнюю выпечку или полуфабрикаты из меню!',
    cartDeliveryType: 'Способ получения:',
    deliveryOptionPickup: 'Самовывоз (Реувен Рубин 5)',
    deliveryOptionTaxi: 'Доставка (Курьер / Такси)',
    customerNameLabel: 'Ваше имя *',
    customerPhoneLabel: 'Номер телефона (WhatsApp) *',
    preferredDateLabel: 'Желаемая дата',
    preferredTimeLabel: 'Желаемое время',
    orderNotesLabel: 'Пожелания к заказу / Адрес доставки',
    orderNotesPlaceholder: 'Укажите адрес доставки для курьера или комментарии к заказу...',
    orderSummaryTitle: 'Сумма заказа',
    orderTotalLabel: 'Итого:',
    giftIncluded: 'Свежеприготовленный заказ из натуральных ингредиентов',
    whatsappCheckoutBtn: 'Оформить заказ в WhatsApp',
    whatsappManagerNote: 'После нажатия откроется чат с готовым списком блюд. Мы сразу подтвердим заказ!',
    clearCartBtn: 'Очистить корзину',
    deleteItem: 'Удалить',

    footerAboutTitle: 'Домашняя кухня & выпечка',
    footerAboutText: 'Свежая выпечка, пельмени и вареники ручной лепки, праздничные блюда и торты. Всё готовится только из натуральных ингредиентов с душой.',
    footerHoursTitle: 'Время работы',
    footerHoursText: 'Ежедневно: 10:00 - 21:00',
    footerContactsTitle: 'Контакты & Самовывоз',
    footerPickupText: 'ул. Реувен Рубин 5\nWhatsApp для заказов: Быстрый ответ 5-10 мин',
    footerCopyright: '© 2026 Домашняя кухня & выпечка. Все права защищены.',
    footerHomemadeGuarantee: '100% натуральные фермерские продукты без консервантов',

    // Restaurant Menu Additional Localized Strings
    ingredientsAndTips: 'Состав и рекомендации к блюду',
    quickOrderWhatsApp: 'Быстрый заказ в WhatsApp',
    storageLabel: 'Хранение:',
    portionWeightLabel: 'Вес порции:',
    pickupAndDeliveryFooter: '📍 Самовывоз: ул. Реувен Рубин 5 | 🚕 Доставка: курьером / на такси',
    sweetComplimentFooter: 'Заберите свежеприготовленные блюда самостоятельно или закажите доставку.',
  },

  en: {
    pickupAddress: '5 Reuven Rubin St',
    freeSweetGift: 'Daily: 10:00 - 21:00',
    whatsappBtn: 'WhatsApp',
    cartBtn: 'Cart',
    languageName: 'English',

    heroTitle: 'Homemade Kitchen & Bakery',
    heroSubtitle: 'Fresh pirozhki, crispy moldavian placinte, handmade dumplings, pelmeni, and festive dishes. Choose your filling and order directly on WhatsApp!',

    giftBadge: 'Fresh Baking',
    giftTitle: 'Fresh Homemade Bakery & Cuisine',
    giftDesc: 'Crafted from 100% natural farm ingredients following authentic family recipes.',

    searchPlaceholder: 'Search dishes, fillings, or ingredients...',
    allFillings: 'All fillings',
    filterByFillings: 'Filter by filling:',
    noProductsFound: 'No dishes found',
    noProductsFoundDesc: 'Try adjusting your search query or clear the fillings filter.',
    showAllMenu: 'Show full menu',

    currency: '₪',
    priceOnRequest: 'Price on request',
    inCart: 'In Cart',
    addToOrder: 'Add',
    chooseOptions: 'Select',
    preorderOnlyBadge: 'Pre-order',
    fillingsLabel: 'Fillings:',
    fillingsInParenthesesPrefix: 'options',
    askOnWhatsApp: 'Ask on WhatsApp',
    portionUnit: 'pcs',
    selectFillingPrompt: 'Choose your filling:',
    selectCookingPrompt: 'Preparation method:',
    ingredientsTitle: 'Ingredients & Composition:',
    storageTitle: 'Storage recommendations:',
    instructionsTitle: 'Serving / Cooking advice:',
    notesPlaceholder: 'Your preferences (e.g., less salt, extra herbs, preferred delivery time)...',
    specialNotesTitle: 'Special requests / Notes:',
    quantityLabel: 'Quantity:',
    totalLabel: 'Total amount:',
    addToCartBtn: 'Add to Cart',
    addedSuccess: '✓ Added to order!',
    askChefWhatsApp: 'Ask baker on WhatsApp',

    // Restaurant Menu List & Photo Gallery
    viewModeMenu: 'Menu List',
    viewModeGrid: 'Cards Grid',
    photoGalleryTitle: 'Food Photo Gallery',
    photoGallerySubtitle: 'Our freshly prepared food — tap any item to order on WhatsApp',
    swipeHint: '← Dishes gallery →',
    quickSelect: 'Order on WhatsApp',
    fillingsOnChoice: 'Fillings of choice',
    cookingPreparation: 'Preparation',
    chefTip: 'Chef tip',
    orderDishOnWhatsApp: 'Order on WhatsApp',
    restaurantMenuTitle: 'Homemade Kitchen Menu',
    restaurantMenuSubtitle: 'All dishes are freshly crafted to order from natural farm ingredients. Text us on WhatsApp for fast ordering!',
    textUsWhatsAppHeader: 'Direct WhatsApp Ordering',
    textUsWhatsAppDesc: 'Tap the button next to any item to quickly send your order via WhatsApp!',

    preorderSectionBadge: 'Custom Orders',
    preorderSectionTitle: 'Custom Orders',
    preorderSectionSubtitle: 'We can do much more, including cakes with complex custom decor — write to us and we will prepare whatever you need!',
    preorderFeature1Title: 'Cakes with Complex Custom Decor',
    preorderFeature1Desc: 'Bespoke designs, handcrafted sugar modeling, wedding & birthday cakes, cupcakes and fine desserts.',
    preorderFeature2Title: 'Dishes Made to Your Recipe',
    preorderFeature2Desc: 'We prepare your favorite home dishes, pastries, and specialties tailored to your personal preferences.',
    preorderFeature3Title: 'Celebrations & Family Dinners',
    preorderFeature3Desc: 'Banquet platters, holiday catering, and fresh pastries ready right on time for your event.',
    preorderDiscussWhatsApp: 'Message Us on WhatsApp',

    deliveryBadge: 'Delivery & Pickup',
    deliveryTitle: 'How to receive your order',
    deliverySubtitle: 'Pick up freshly baked goods in person or schedule convenient door-to-door delivery.',
    pickupCardTitle: 'Self-Pickup (Free)',
    pickupCardTime: 'Daily: 10:00 - 21:00',
    pickupCardDesc: '5 Reuven Rubin St. Packed piping hot and ready at your requested hour.',
    courierCardTitle: 'Courier / Taxi Delivery',
    courierCardTime: 'According to courier service rates',
    courierCardDesc: 'We dispatch via courier straight to your doorstep.',
    orderTermsTitle: 'Ordering Guidelines',
    orderTermsPreorder: 'Pastries are freshly made upon order. Preparation time is typically 1.5 to 3 hours.',
    orderTermsMinimum: 'No minimum order requirement for self-pickup.',
    orderTermsPayment: 'Payment via Bit / PayBox / Bank Transfer or Cash upon order confirmation.',

    reviewsBadge: 'Guest Reviews',
    reviewsTitle: 'What our guests say',
    reviewsSubtitle: 'Genuine feedback on our authentic flavors, generous fillings, and cozy home taste.',
    verifiedBuyer: 'Verified order',
    leaveReviewBtn: 'Leave a Review',
    reviewModalTitle: 'Share your feedback',
    yourName: 'Your Name',
    yourRating: 'Rating:',
    yourOrderItems: 'What did you order?',
    yourReviewComment: 'Your review and impressions',
    submitReviewBtn: 'Submit Review',
    reviewSuccessMessage: 'Thank you for your review! We appreciate your trust ❤️',

    cartDrawerTitle: 'Your Cart',
    cartEmptyTitle: 'Cart is empty',
    cartEmptySubtitle: 'Explore our delicious home bakery and handmade specialties from the menu!',
    cartDeliveryType: 'Fulfillment method:',
    deliveryOptionPickup: 'Self-Pickup (5 Reuven Rubin St)',
    deliveryOptionTaxi: 'Delivery (Courier / Taxi)',
    customerNameLabel: 'Your name *',
    customerPhoneLabel: 'Phone number (WhatsApp) *',
    preferredDateLabel: 'Preferred date',
    preferredTimeLabel: 'Preferred time',
    orderNotesLabel: 'Order notes / Delivery address',
    orderNotesPlaceholder: 'Enter delivery address for courier or special instructions...',
    orderSummaryTitle: 'Order summary',
    orderTotalLabel: 'Total:',
    giftIncluded: 'Freshly prepared from natural farm ingredients',
    whatsappCheckoutBtn: 'Send Order via WhatsApp',
    whatsappManagerNote: 'Clicking opens WhatsApp with your itemized list. We will confirm your order right away!',
    clearCartBtn: 'Clear cart',
    deleteItem: 'Delete',

    footerAboutTitle: 'Homemade Bakery & Kitchen',
    footerAboutText: 'Fresh pastries, handmade dumplings and pelmeni, banquet specials, and cakes. Crafted strictly from natural ingredients with warmth and love.',
    footerHoursTitle: 'Working Hours',
    footerHoursText: 'Daily: 10:00 - 21:00',
    footerContactsTitle: 'Contacts & Pickup',
    footerPickupText: '5 Reuven Rubin St\nWhatsApp orders: Fast reply in 5-10 mins',
    footerCopyright: '© 2026 Homemade Bakery & Kitchen. All rights reserved.',
    footerHomemadeGuarantee: '100% natural farm ingredients without preservatives',

    // Restaurant Menu Additional Localized Strings
    ingredientsAndTips: 'Ingredients & Chef Tips',
    quickOrderWhatsApp: 'Quick Order on WhatsApp',
    storageLabel: 'Storage:',
    portionWeightLabel: 'Portion weight:',
    pickupAndDeliveryFooter: '📍 Pickup: 5 Reuven Rubin St | 🚕 Delivery: Courier / Taxi',
    sweetComplimentFooter: 'Pick up freshly baked goods in person or schedule convenient door-to-door delivery.',
  },

  he: {
    pickupAddress: 'רחוב ראובן רובין 5',
    freeSweetGift: 'מדי יום: 10:00 - 21:00',
    whatsappBtn: 'וואטסאפ',
    cartBtn: 'עגלה',
    languageName: 'עברית',

    heroTitle: 'מטבח ביתי ומאפים',
    heroSubtitle: 'פירוז\'קי חמים מהתנור, פלצ\'ינטה מולדבית פריכה, ורניקי ופלמני בעבודת יד ומנות חג. בחרו מילוי והזמינו בוואטסאפ!',

    giftBadge: 'מאפים טריים',
    giftTitle: 'מאפייה ומטבח ביתי איכותי',
    giftDesc: 'מכינים מ-100% רכיבי חווה טבעיים לפי מתכונים ביתיים מוכחים.',

    searchPlaceholder: 'חיפוש מנות, מילויים או מרכיבים...',
    allFillings: 'כל המילויים',
    filterByFillings: 'סינון לפי מילוי:',
    noProductsFound: 'לא נמצאו מנות',
    noProductsFoundDesc: 'נסו לשנות את מילות החיפוש או לנקות את סינון המילויים.',
    showAllMenu: 'הצג את כל התפריט',

    currency: '₪',
    priceOnRequest: 'מחיר בתיאום',
    inCart: 'בעגלה',
    addToOrder: 'להזמנה',
    chooseOptions: 'לבחור',
    preorderOnlyBadge: 'הזמנה מראש',
    fillingsLabel: 'מילויים:',
    fillingsInParenthesesPrefix: 'לבחירה',
    askOnWhatsApp: 'לשאול בוואטסאפ',
    portionUnit: 'יח׳',
    selectFillingPrompt: 'בחרו מילוי מועדף:',
    selectCookingPrompt: 'אופן הכנה מועדף:',
    ingredientsTitle: 'רכיבים והרכב:',
    storageTitle: 'הנחיות אחסון:',
    instructionsTitle: 'המלצת הגשה / חימום:',
    notesPlaceholder: 'הערות והעדפות (למשל: ללא בצל, פחות מלח, שעת הגעה מבוקשת)...',
    specialNotesTitle: 'הערות מיוחדות למנה:',
    quantityLabel: 'כמות:',
    totalLabel: 'סה״כ לתשלום:',
    addToCartBtn: 'הוספה לעגלה',
    addedSuccess: '✓ נוסף להזמנה!',
    askChefWhatsApp: 'בירור מול האופה בוואטסאפ',

    // Restaurant Menu List & Photo Gallery
    viewModeMenu: 'תפריט רשימה',
    viewModeGrid: 'תצוגת כרטיסים',
    photoGalleryTitle: 'גלריית תמונות המנות',
    photoGallerySubtitle: 'המנות הטריות שלנו — לחצו על כל תמונה להזמנה ישירה בוואטסאפ',
    swipeHint: '← גלריית מנות →',
    quickSelect: 'הזמנה בוואטסאפ',
    fillingsOnChoice: 'מילויים לבחירה',
    cookingPreparation: 'אופן הכנה',
    chefTip: 'המלצת השף',
    orderDishOnWhatsApp: 'הזמנה בוואטסאפ',
    restaurantMenuTitle: 'תפריט המטבח הביתי',
    restaurantMenuSubtitle: 'כל המנות מוכנות טריות לפי הזמנה ממרכיבים כפריים וטבעיים. כתבו לנו בוואטסאפ להזמנה מהירה!',
    textUsWhatsAppHeader: 'הזמנה ישירה בוואטסאפ',
    textUsWhatsAppDesc: 'לחצו על הכפתור לצד המנה הרצויה — ההודעה תנוסח אוטומטית!',

    preorderSectionBadge: 'הזמנה אישית',
    preorderSectionTitle: 'הזמנה אישית',
    preorderSectionSubtitle: 'אנחנו יכולים הרבה יותר, כולל עוגות בעיצוב אישי מורכב — כתבו לנו ונכין בדיוק מה שאתם צריכים!',
    preorderFeature1Title: 'עוגות בעיצוב אישי מורכב',
    preorderFeature1Desc: 'עיצוב אישי, פיסול בסוכר, עוגות יום הולדת ואירועים, קאפקייקס וקינוחי יוקרה.',
    preorderFeature2Title: 'מנות לפי המתכון שלכם',
    preorderFeature2Desc: 'נכין עבורכם מאפים ומנות ביתיות אהובות בהתאמה אישית מלאה.',
    preorderFeature3Title: 'אירועים וארוחות משפחתיות',
    preorderFeature3Desc: 'מגשי אירוח, שולחנות חג ומאפים טריים בדיוק לשעה שתבקשו.',
    preorderDiscussWhatsApp: 'לפנייה בוואטסאפ',

    deliveryBadge: 'משלוחים ואיסוף',
    deliveryTitle: 'איך מקבלים את ההזמנה',
    deliverySubtitle: 'איסוף עצמי של מנות טריות או תיאום משלוח נוח עד הבית.',
    pickupCardTitle: 'איסוף עצמי (ללא עלות)',
    pickupCardTime: 'מדי יום: 10:00 - 21:00',
    pickupCardDesc: 'רחוב ראובן רובין 5. נארוז חם וטרי בדיוק לשעה שתבקשו.',
    courierCardTitle: 'משלוח באמצעות שליח / מונית',
    courierCardTime: 'לפי תעריף חברת השליחויות',
    courierCardDesc: 'שולחים באמצעות שליח ישירות עד דלת הבית שלכם.',
    orderTermsTitle: 'מידע חשוב על הזמנות',
    orderTermsPreorder: 'המאפים נאפים טריים לפי הזמנה. זמן הכנה ממוצע: 1.5 עד 3 שעות.',
    orderTermsMinimum: 'אין מינימום הזמנה לאיסוף עצמי.',
    orderTermsPayment: 'תשלום בביט / פייבוקס / העברה בנקאית או מזומן בעת אישור ההזמנה.',

    reviewsBadge: 'חוות דעת של לקוחות',
    reviewsTitle: 'חוות דעת של לקוחות',
    reviewsSubtitle: 'חוויות אמיתיות על הטעם הביתי, המילויים הנדיבים והשירות האישי.',
    verifiedBuyer: 'הזמנה מאומתת',
    leaveReviewBtn: 'הוספת חוות דעת',
    reviewModalTitle: 'נשמח לשמוע את דעתכם',
    yourName: 'שם מלא',
    yourRating: 'דירוג המנות:',
    yourOrderItems: 'מה הזמנתם?',
    yourReviewComment: 'חוות הדעת וההתרשמות שלכם',
    submitReviewBtn: 'שליחת חוות דעת',
    reviewSuccessMessage: 'תודה רבה על חוות הדעת! מעריכים את האמון שלכם ❤️',

    cartDrawerTitle: 'עגלת הקניות שלך',
    cartEmptyTitle: 'העגלה ריקה',
    cartEmptySubtitle: 'בחרו מאפים ביתיים טריים ומעדנים טעימים מתוך התפריט!',
    cartDeliveryType: 'אופן קבלת ההזמנה:',
    deliveryOptionPickup: 'איסוף עצמי (ראובן רובין 5)',
    deliveryOptionTaxi: 'משלוח (שליח / מונית)',
    customerNameLabel: 'שם מלא *',
    customerPhoneLabel: 'מספר טלפון (וואטסאפ) *',
    preferredDateLabel: 'תאריך מועדף',
    preferredTimeLabel: 'שעה מועדפת',
    orderNotesLabel: 'הערות להזמנה / כתובת למשלוח',
    orderNotesPlaceholder: 'הזינו כתובת מדויקת לשליח או בקשות מיוחדות להכנה...',
    orderSummaryTitle: 'סיכום הזמנה',
    orderTotalLabel: 'סה״כ:',
    giftIncluded: 'הזמנה טרייה מחומרי גלם איכותיים',
    whatsappCheckoutBtn: 'שליחת הזמנה לוואטסאפ',
    whatsappManagerNote: 'בלחיצה ייפתח צ׳אט עם רשימת המנות המוכנה. נאשר את ההזמנה מיד!',
    clearCartBtn: 'ריקון עגלה',
    deleteItem: 'מחיקה',

    footerAboutTitle: 'מאפייה ומטבח ביתי',
    footerAboutText: 'מאפים טריים, פלמני וורניקי בעבודת יד, מנות חג ועוגות ביתיות. הכל מחומרי גלם טבעיים בלבד ובהמון אהבה.',
    footerHoursTitle: 'שעות פעילות',
    footerHoursText: 'מדי יום: 10:00 - 21:00',
    footerContactsTitle: 'יצירת קשר ואיסוף',
    footerPickupText: 'רחוב ראובן רובין 5\nוואטסאפ להזמנות: מענה מהיר תוך 5-10 דקות',
    footerCopyright: '© 2026 מאפייה ומטבח ביתי. כל הזכויות שמורות.',
    footerHomemadeGuarantee: '100% רכיבי חווה טבעיים ללא חומרים משמרים',

    // Restaurant Menu Additional Localized Strings
    ingredientsAndTips: 'רכיבים והמלצות הגשה',
    quickOrderWhatsApp: 'הזמנה מהירה בוואטסאפ',
    storageLabel: 'הנחיות אחסון:',
    portionWeightLabel: 'משקל מנה:',
    pickupAndDeliveryFooter: '📍 איסוף עצמי: רחוב ראובן רובין 5 | 🚕 משלוח: שליח / מונית',
    sweetComplimentFooter: 'איסוף עצמי של מנות טריות או תיאום משלוח נוח עד הבית.',
  }
};

// Category translations
export const CATEGORY_TRANSLATIONS: Record<CategoryId, Record<Language, { label: string; description: string }>> = {
  all: {
    ru: { label: 'Всё меню', description: 'Полный ассортимент домашней выпечки и деликатесов' },
    en: { label: 'Full Menu', description: 'Complete selection of homemade bakery and specialties' },
    he: { label: 'כל התפריט', description: 'מגוון עשיר של מאפים ומעדנים ביתיים' }
  },
  bakery: {
    ru: { label: 'Вся выпечка', description: 'Пирожки, молдавские плацинды, осетинские пироги, фокачча, синнабоны и сдоба' },
    en: { label: 'All Bakery', description: 'Pirozhki, Moldavian placinte, Ossetian pies, focaccia, cinnabons, and brioche' },
    he: { label: 'כל המאפים', description: 'פירוז׳קי, פלצ׳ינטה מולדבית, פאי אוסטי, פוקאצ׳ה, סינבון ומאפי שמרים' }
  },
  blini: {
    ru: { label: 'Блины', description: 'Тонкие кружевные блинчики с сытными и сладкими начинками' },
    en: { label: 'Blini & Crepes', description: 'Delicate lace milk crepes with savory and sweet fillings' },
    he: { label: 'בלינצ׳ס', description: 'חביתיות דקיקות ותחרתיות עם מילויים מלוחים ומתוקים' }
  },
  dumplings_mains: {
    ru: { label: 'Пельмени, вареники, голубцы', description: 'Пельмени и вареники ручной лепки, ленивые вареники, домашние голубцы' },
    en: { label: 'Dumplings & Mains', description: 'Handmade pelmeni, vareniki, lazy dumplings, and stuffed cabbage rolls' },
    he: { label: 'פלמני, ורניקי וממולאים', description: 'פלמני וורניקי בעבודת יד, ורניקי גבינה עצלים וכרוב ממולא' }
  },
  salads: {
    ru: { label: 'Салаты', description: 'Оливье, сельдь под шубой и винегрет' },
    en: { label: 'Salads', description: 'Olivier, Herring Under Fur Coat, and Vinegret' },
    he: { label: 'סלטים', description: 'סלט אוליבייה, הרינג בשכבות (שובה) וויניגרט' }
  }
};

// Product localized content map
export interface LocalizedProductData {
  name: string;
  unit: string;
  weight?: string;
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  availableFillings?: string[];
  cookingOptions?: string[];
  storageInfo?: string;
  cookingInstructions?: string;
}

export const PRODUCT_TRANSLATIONS: Record<string, Record<Language, LocalizedProductData>> = {
  'syrniki': {
    ru: {
      name: 'Сырники творожные',
      unit: 'за 1 шт',
      weight: '~58 г / шт, партия 10 шт',
      badge: 'Завтрак 🥞',
      shortDescription: 'Пышные творожные сырники на манке — румяная корочка снаружи, нежная середина.',
      fullDescription: 'Сырники из весового творога 9%: обжариваем до золотистой корочки, внутри остаются мягкими и нежными. Хороши на завтрак со сметаной, джемом или сгущёнкой.',
      ingredients: [
        'творог 9%',
        'яйцо',
        'манка',
        'крахмал кукурузный',
        'сахар',
        'ванилин',
        'соль',
        'мука пшеничная',
        'масло растительное'
      ],
      storageInfo: 'Хранить в холодильнике до 48 часов.',
      cookingInstructions: 'Разогреть на сухой сковороде под крышкой 2–3 минуты с каждой стороны или в духовке при 160 °C.'
    },
    en: {
      name: 'Curd Cheese Syrniki',
      unit: 'per 1 pc',
      weight: '~58 g / pc, batch of 10',
      badge: 'Breakfast 🥞',
      shortDescription: 'Fluffy curd cheese fritters with a golden crust and a soft, tender centre.',
      fullDescription: 'Syrniki made from fresh 9% curd cheese, pan-fried to a golden crust while staying soft inside. Perfect for breakfast with sour cream, jam or condensed milk.',
      ingredients: [
        'curd cheese 9%',
        'egg',
        'semolina',
        'corn starch',
        'sugar',
        'vanillin',
        'salt',
        'wheat flour',
        'vegetable oil'
      ],
      storageInfo: 'Keep refrigerated for up to 48 hours.',
      cookingInstructions: 'Reheat in a dry covered pan for 2-3 minutes per side, or in the oven at 160 °C.'
    },
    he: {
      name: 'סירניקי גבינה',
      unit: 'ל-1 יח׳',
      weight: 'כ-58 גרם ליחידה, מנה של 10',
      badge: 'ארוחת בוקר 🥞',
      shortDescription: 'לביבות גבינה אווריריות עם קרום זהוב מבחוץ ומרקם רך ועדין מבפנים.',
      fullDescription: 'סירניקי מגבינה לבנה 9% טרייה, מטוגנים עד לקרום זהוב ונשארים רכים בפנים. מצוינים לארוחת בוקר עם שמנת חמוצה, ריבה או חלב מרוכז.',
      ingredients: [
        'גבינה לבנה 9%',
        'ביצה',
        'סולת',
        'קורנפלור',
        'סוכר',
        'וניל',
        'מלח',
        'קמח חיטה',
        'שמן צמחי'
      ],
      storageInfo: 'לשמור בקירור עד 48 שעות.',
      cookingInstructions: 'לחמם במחבת יבשה מכוסה 2-3 דקות מכל צד, או בתנור ב-160 °C.'
    }
  },
  'pirozhki-homemade': {
    ru: {
      name: 'Пирожки домашние с начинкой',
      unit: 'за 1 шт',
      weight: '~108 г / шт, партия 13 шт',
      badge: 'На любой вкус',
      shortDescription: 'Пышное тесто с румяной корочкой и щедрой сочной начинкой на ваш выбор.',
      fullDescription: 'Наши фирменные домашние пирожки — как в детстве у бабушки! Готовятся исключительно из натуральных ингредиентов: отборная мука, сливочное масло, фермерские яйца. Начинки кладем от души, тесто тонкое и воздушное.',
      ingredients: [
        'мука пшеничная',
        'вода',
        'дрожжи сухие',
        'соль',
        'сахар',
        'масло растительное',
        'сметана',
        'яйцо',
        'картофель',
        'грибы шампиньоны',
        'лук репчатый',
        'перец чёрный / специи',
        'зелёный лук',
        'зелень (укроп/петрушка)',
        'творог 9%',
        'ванилин',
        'ягоды замороженные',
        'крахмал кукурузный',
        'фарш телячий',
        'сыр (pizza mix / твёрдый)'
      ],
      availableFillings: [
        'Картофель, грибы и лук — 8 ₪/шт',
        'Яйцо и зелёный лук — 8 ₪/шт',
        'Грибы и лук — 8 ₪/шт',
        'Творог сладкий — 10 ₪/шт',
        'Творог с зеленью — 10 ₪/шт',
        'Ягоды — 10 ₪/шт',
        'Телятина с луком — 10 ₪/шт',
        'Сыр с зеленью — 10 ₪/шт'
      ],
      cookingOptions: ['Печёные'],
      storageInfo: 'Хранить до 48 часов при комнатной температуре или разогревать в духовке/микроволновке.',
      cookingInstructions: 'Рекомендуем подогреть в духовке 3-5 минут при 170°C для возвращения хрустящей корочки.'
    },
    en: {
      name: 'Homemade Stuffed Pirozhki',
      unit: 'per 1 pc',
      weight: '~108 g / pc, batch of 13',
      badge: 'For every taste',
      shortDescription: 'Fluffy golden yeast pastry with generous, juicy filling of your choice.',
      fullDescription: 'Our signature homemade pirozhki are just like grandma used to make! Made exclusively from premium natural ingredients: fine flour, farm butter, and fresh eggs. Generously filled with airy, tender dough.',
      ingredients: [
        'wheat flour',
        'water',
        'dry yeast',
        'salt',
        'sugar',
        'vegetable oil',
        'sour cream',
        'egg',
        'potato',
        'champignon mushrooms',
        'onion',
        'black pepper & spices',
        'spring onion',
        'herbs (dill / parsley)',
        'curd cheese 9%',
        'vanillin',
        'frozen berries',
        'corn starch',
        'minced veal',
        'cheese (pizza mix / hard)'
      ],
      availableFillings: [
        'Potato, mushrooms & onion — 8 ₪ / pc',
        'Egg & spring onion — 8 ₪ / pc',
        'Mushrooms & onion — 8 ₪ / pc',
        'Sweet curd — 10 ₪ / pc',
        'Curd & herbs — 10 ₪ / pc',
        'Berries — 10 ₪ / pc',
        'Veal & onion — 10 ₪ / pc',
        'Cheese & herbs — 10 ₪ / pc'
      ],
      cookingOptions: ['Baked'],
      storageInfo: 'Store up to 48 hours at room temperature; easily reheated in oven or microwave.',
      cookingInstructions: 'Reheat in a preheated oven at 170°C (340°F) for 3-5 minutes for optimal crispiness.'
    },
    he: {
      name: 'פירוז׳קי ביתי במגוון מילויים',
      unit: 'ל-1 יח׳',
      weight: 'כ-108 גרם ליחידה, מנה של 13',
      badge: 'לכל טעם',
      shortDescription: 'בצק שמרים רך ואוורירי עם ציפוי זהוב ומילוי עשיר לבחירתכם.',
      fullDescription: 'פירוז׳קי ביתיים אמיתיים בטעם של פעם! מוכנים מחומרי גלם מובחרים: קמח איכותי, חמאת חווה וביצים טריות. שפע של מילוי עסיסי ובצק נימוח בפה.',
      ingredients: [
        'קמח חיטה',
        'מים',
        'שמרים יבשים',
        'מלח',
        'סוכר',
        'שמן צמחי',
        'שמנת חמוצה',
        'ביצה',
        'תפוחי אדמה',
        'פטריות שמפיניון',
        'בצל',
        'פלפל שחור ותבלינים',
        'בצל ירוק',
        'עשבי תיבול (שמיר/פטרוזיליה)',
        'גבינה לבנה 9%',
        'וניל',
        'פירות יער קפואים',
        'קורנפלור',
        'בשר עגל טחון',
        'גבינה (פיצה מיקס / קשה)'
      ],
      availableFillings: [
        'תפוח אדמה, פטריות ובצל — 8 ₪ / יח׳',
        'ביצה ובצל ירוק — 8 ₪ / יח׳',
        'פטריות ובצל — 8 ₪ / יח׳',
        'גבינה לבנה מתוקה — 10 ₪ / יח׳',
        'גבינה לבנה ועשבי תיבול — 10 ₪ / יח׳',
        'פירות יער — 10 ₪ / יח׳',
        'בשר עגל ובצל — 10 ₪ / יח׳',
        'גבינה ועשבי תיבול — 10 ₪ / יח׳'
      ],
      cookingOptions: ['אפויים'],
      storageInfo: 'נשמר עד 48 שעות בטמפרטורת החדר. ניתן לחמם בתנור או במיקרוגל.',
      cookingInstructions: 'מומלץ לחמם 3-5 דקות בתנור ב-170 מעלות להחזרת הפריכות המושלמת.'
    }
  },

  'placinte-moldavian': {
    ru: {
      name: 'Плацинды домашние молдавские',
      unit: 'за 1 шт (~500 г)',
      weight: '~500 г (крупная плацинда)',
      badge: 'Фирменное блюдо',
      shortDescription: 'Слоеное тесто с сочной домашней начинкой, запеченное до золотистого глянца.',
      fullDescription: 'Традиционные молдавские плацинды, приготовленные по старинному семейному рецепту. Тесто раскатывается вручную, начинка распределяется равномерно, создавая слоистый, нежный и невероятно сочный пирог.',
      ingredients: ['мука', 'вода', 'растительное масло', 'сливочное масло', 'соль', 'начинка на выбор'],
      availableFillings: [
        'Творог соленый с зеленью',
        'Сыр с зеленью',
        'Картофель',
        'Капуста',
        'Творог сладкий',
        'Тыква',
        'Яблоки',
        'Вишня'
      ],
      cookingOptions: ['Печеные', 'Жареные'],
      storageInfo: 'Отлично хранятся в холодильнике 3 суток. Разогревать на сухой сковороде или в духовке.'
    },
    en: {
      name: 'Moldavian Layered Placinte',
      unit: 'per 1 pc (~500 g)',
      weight: '~500g (large placinta)',
      badge: 'Signature Dish',
      shortDescription: 'Layered pastry packed with rich savory or sweet filling.',
      fullDescription: 'Authentic Moldavian placinte prepared according to an old family recipe. Dough is stretched by hand, generously layered with filling, creating a flaky, melt-in-your-mouth pastry.',
      ingredients: ['flour', 'water', 'vegetable oil', 'butter', 'salt', 'filling of choice'],
      availableFillings: [
        'Salted Cottage Cheese & Herbs',
        'Cheese & Herbs',
        'Potato',
        'Cabbage',
        'Sweet Cottage Cheese',
        'Pumpkin',
        'Apples',
        'Cherry'
      ],
      cookingOptions: ['Baked', 'Fried'],
      storageInfo: 'Keeps fresh in the fridge for up to 3 days. Best reheated in a dry pan or oven.'
    },
    he: {
      name: 'פלצ\'ינטה מולדבית מסורתית',
      unit: 'ליחידה (כ-500 גרם)',
      weight: 'כ-500 גרם (מאפה גדול)',
      badge: 'מנת הדגל',
      shortDescription: 'בצק עלים עם שפע מילוי ביתי, פריך ושזוף.',
      fullDescription: 'פלצ\'ינטה מולדבית אותנטית לפי מתכון משפחתי עתיק. הבצק נמתח ביד וממולא בשפע מילוי עשיר וטרי ליצירת מאפה פריך ונימוח.',
      ingredients: ['קמח', 'מים', 'שמן צמחי', 'חמאה', 'מלח', 'מילוי לבחירה'],
      availableFillings: [
        'טוורוג מלוח עם עשבי תיבול',
        'גבינה ועשבי תיבול',
        'תפוחי אדמה',
        'כרוב',
        'טוורוג מתוק',
        'דלעת',
        'תפוחים',
        'דובדבנים'
      ],
      cookingOptions: ['אפויים', 'מטוגנים'],
      storageInfo: 'נשמר מעולה במקרר עד 3 ימים. מומלץ לחמם במחבת יבשה או בתנור.'
    }
  },

  'lazy-vareniki': {
    ru: {
      name: 'Ленивые вареники творожные',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      badge: 'Любимое из детства',
      shortDescription: 'Воздушные творожные облачка из отборного 9% творога. Идеальный полезный завтрак за 3 минуты!',
      fullDescription: 'Мягкие, тающие во рту ленивые вареники, в которых минимум муки и максимум нежного фермерского творога. Готовятся моментально: бросил в кипящую воду — через 2 минуты вкуснейший ресторанный завтрак готов!',
      ingredients: [
        'творог 9%',
        'манка',
        'сахар',
        'соль',
        'мука пшеничная',
        'мак'
      ],
      cookingInstructions: 'Опустить в кипящую слегка подсоленную воду. После всплытия варить ровно 2 минуты на умеренном огне. Подавать со сливочным маслом, сметаной, медом или свежими ягодами.',
      availableFillings: [
        'Классические',
        'С маком'
      ],
    },
    en: {
      name: 'Lazy Sweet Cottage Dumplings',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      badge: 'Childhood Favorite',
      shortDescription: 'Fluffy cottage cheese clouds with 9% rich farmer curd. Perfect wholesome breakfast in 3 mins!',
      fullDescription: 'Melt-in-your-mouth lazy vareniki made with maximum fresh curd and minimum flour. Ready in just 2 minutes after boiling — serve with butter, berries, honey, or sour cream.',
      ingredients: [
        'curd cheese 9%',
        'semolina',
        'sugar',
        'salt',
        'wheat flour',
        'poppy seeds'
      ],
      cookingInstructions: 'Drop into gently boiling salted water. Cook for 2 minutes after they float to the top. Serve warm with butter, cream, or jam.',
      availableFillings: [
        'Classic',
        'With poppy seeds'
      ],
    },
    he: {
      name: 'ורניקי גבינה עצלים (לביבות גבינה מבושלות)',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      badge: 'אהוב מילדות',
      shortDescription: 'ענני גבינת טוורוג 9% נימוחים בפה. ארוחת בוקר מושלמת ובריאה ב-3 דקות!',
      fullDescription: 'ורניקי עצלים רכים וקטיפתיים עם מקסימום גבינת חווה עשירה ומינימום קמח. בישול קצר של 2 דקות במים רותחים והמנה מוכנה להגשה עם חמאה, שמנת, דבש או פירות יער.',
      ingredients: [
        'גבינה לבנה 9%',
        'סולת',
        'סוכר',
        'מלח',
        'קמח חיטה',
        'פרג'
      ],
      cookingInstructions: 'להכניס למים רותחים עם מעט מלח. לאחר שהם צפים, לבשל 2 דקות בלבד. להגיש עם חמאה מומסת, שמנת חמוצה או ריבה.',
      availableFillings: [
        'קלאסי',
        'עם פרג'
      ],
    }
  },

  'pelmeni-homemade': {
    ru: {
      name: 'Пельмени домашние',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      badge: 'Сытный обед 🥟',
      shortDescription: 'Сочнейший фарш, тонкое эластичное тесто, ароматный бульончик внутри каждого пельмешка.',
      fullDescription: 'Настоящие домашние пельмени ручной лепки. Мы используем только отборное мясо, лук, свежемолотый черный перец и чистейшую воду для сочности.',
      ingredients: [
        'мука пшеничная',
        'яйцо',
        'вода',
        'масло растительное',
        'соль',
        'фарш куриный',
        'лук репчатый',
        'перец чёрный / специи',
        'фарш телячий'
      ],
      availableFillings: [
        'Курица — 90 ₪/кг',
        'Телятина с курицей — 95 ₪/кг',
        'Телятина — 100 ₪/кг'
      ],
      cookingInstructions: 'Варить в кипящей подсоленной воде с лавровым листом и перцем горошком 6-7 минут после всплытия. Подавать с кусочком сливочного масла и сметаной.'
    },
    en: {
      name: 'Homemade Pelmeni Dumplings',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      badge: 'Hearty Dish 🥟',
      shortDescription: 'Juicy premium meat filling, silky thin dough, aromatic broth sealed in every bite.',
      fullDescription: 'Authentic homemade pelmeni crafted with fresh chilled meat, onions, black pepper, and ice water for maximum juiciness.',
      ingredients: [
        'wheat flour',
        'egg',
        'water',
        'vegetable oil',
        'salt',
        'minced chicken',
        'onion',
        'black pepper & spices',
        'minced veal'
      ],
      availableFillings: [
        'Chicken — 90 ₪ / kg',
        'Veal & chicken mix — 95 ₪ / kg',
        'Veal — 100 ₪ / kg'
      ],
      cookingInstructions: 'Boil in salted water with a bay leaf and peppercorns for 6-7 minutes after they float. Serve with butter and sour cream.'
    },
    he: {
      name: 'פלמני ביתי',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      badge: 'מנה משביעה 🥟',
      shortDescription: 'בשר מובחר עסיסי, בצק משי דקיק ומרק עשיר שנשמר בתוך כל כיסון.',
      fullDescription: 'פלמני מסורתיים בעבודת יד. בשר טרי טחון, בצל עסיסי, פלפל שחור גרוס ומים קרים לשמירה על עסיסיות מושלמת.',
      ingredients: [
        'קמח חיטה',
        'ביצה',
        'מים',
        'שמן צמחי',
        'מלח',
        'בשר עוף טחון',
        'בצל',
        'פלפל שחור ותבלינים',
        'בשר עגל טחון'
      ],
      availableFillings: [
        'עוף — 90 ₪ / ק״ג',
        'תערובת עגל ועוף — 95 ₪ / ק״ג',
        'בשר עגל — 100 ₪ / ק״ג'
      ],
      cookingInstructions: 'לבשל במים רותחים מומלחים עם עלי דפנה וגרגרי פלפל במשך 6-7 דקות מרגע הציפה. להגיש עם חמאה ושמנת חמוצה.'
    }
  },

  'vareniki-handmade': {
    ru: {
      name: 'Вареники домашние',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      badge: 'Ручная лепка',
      shortDescription: 'Ручная фигурная лепка с косичкой, обилие начинки и тонкое прочное тесто, которое не разваривается.',
      fullDescription: 'Классические вареники с любовью вылепленные вручную. Тонкое тесто бережно удерживает сочную начинку. Идеально подходят как для сытного обеда, так и для сладкого десерта.',
      ingredients: [
        'мука пшеничная',
        'яйцо',
        'вода',
        'масло растительное',
        'соль',
        'капуста белокочанная',
        'морковь',
        'лук репчатый',
        'томатная паста',
        'картофель',
        'грибы шампиньоны',
        'перец чёрный / специи',
        'творог 9%',
        'сметана',
        'сахар',
        'ванилин',
        'ягоды замороженные',
        'крахмал кукурузный',
        'зелень (укроп/петрушка)',
        'зелёный лук',
        'вишня замороженная',
        'сыр (pizza mix / твёрдый)'
      ],
      availableFillings: [
        'Картофель, грибы и лук',
        'Капуста, морковь и лук',
        'Грибы и лук',
        'Творог сладкий',
        'Творог с зеленью',
        'Ягоды',
        'Вишня',
        'Сыр с зеленью'
      ],
      cookingInstructions: 'Опустить в кипящую подсоленную (или сладкую для вишни) воду. Варить 4-5 минут после всплытия. Смазать сливочным маслом.'
    },
    en: {
      name: 'Homemade Vareniki Dumplings',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      badge: 'Handcrafted',
      shortDescription: 'Artisan braided edge, generous filling, and silky elastic dough that never breaks.',
      fullDescription: 'Traditional handmade vareniki dumplings filled with comforting savory and sweet fillings. Elastic dough keeps every drop of juice inside.',
      ingredients: [
        'wheat flour',
        'egg',
        'water',
        'vegetable oil',
        'salt',
        'white cabbage',
        'carrot',
        'onion',
        'tomato paste',
        'potato',
        'champignon mushrooms',
        'black pepper & spices',
        'curd cheese 9%',
        'sour cream',
        'sugar',
        'vanillin',
        'frozen berries',
        'corn starch',
        'herbs (dill / parsley)',
        'spring onion',
        'frozen sour cherries',
        'cheese (pizza mix / hard)'
      ],
      availableFillings: [
        'Potato, mushrooms & onion',
        'Cabbage, carrot & onion',
        'Mushrooms & onion',
        'Sweet curd',
        'Curd & herbs',
        'Berries',
        'Sour cherry',
        'Cheese & herbs'
      ],
      cookingInstructions: 'Boil in salted water (or sweetened water for cherries) for 4-5 minutes after floating. Toss with melted butter.'
    },
    he: {
      name: 'ורניקי ביתי',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      badge: 'עבודת יד',
      shortDescription: 'סגירה ידנית מעוטרת, שפע מילוי עשיר ובצק דק ועמיד שאינו מתפרק בבישול.',
      fullDescription: 'ורניקי קלאסיים בעבודת יד מוקפדת. מתאימים לארוחת צהריים משביעה או כקינוח מתוק מפנק.',
      ingredients: [
        'קמח חיטה',
        'ביצה',
        'מים',
        'שמן צמחי',
        'מלח',
        'כרוב לבן',
        'גזר',
        'בצל',
        'רסק עגבניות',
        'תפוחי אדמה',
        'פטריות שמפיניון',
        'פלפל שחור ותבלינים',
        'גבינה לבנה 9%',
        'שמנת חמוצה',
        'סוכר',
        'וניל',
        'פירות יער קפואים',
        'קורנפלור',
        'עשבי תיבול (שמיר/פטרוזיליה)',
        'בצל ירוק',
        'דובדבנים קפואים',
        'גבינה (פיצה מיקס / קשה)'
      ],
      availableFillings: [
        'תפוח אדמה, פטריות ובצל',
        'כרוב, גזר ובצל',
        'פטריות ובצל',
        'גבינה לבנה מתוקה',
        'גבינה לבנה ועשבי תיבול',
        'פירות יער',
        'דובדבנים',
        'גבינה ועשבי תיבול'
      ],
      cookingInstructions: 'להכניס למים רותחים מומלחים (או ממותקים לדובדבנים). לבשל 4-5 דקות לאחר הציפה. למרוח בחמאה.'
    }
  },

  'pancakes-blini': {
    ru: {
      name: 'Блинчики домашние тонкие',
      unit: 'за 1 шт',
      weight: '~131 г / шт с начинкой, ~76 г без начинки',
      badge: 'С пылу с жару 🥞',
      shortDescription: 'Нежнейшие кружевные блинчики на молоке: стопочкой со сливочным маслом или с сочными начинками на выбор.',
      fullDescription: 'Тоненькие золотистые блинчики с дырочками, пропитанные сливочным маслом. Предлагаются аппетитной стопкой без начинки (~20 шт за 30 ₪) или завернутые с богатыми домашними начинками (от 7 ₪/шт).',
      ingredients: [
        'мука пшеничная',
        'яйцо',
        'молоко',
        'эшель / йогурт',
        'масло растительное',
        'сахар',
        'соль',
        'картофель',
        'грибы шампиньоны',
        'лук репчатый',
        'перец чёрный / специи',
        'зелёный лук',
        'зелень (укроп/петрушка)',
        'творог 9%',
        'сметана',
        'ванилин',
        'яблоко',
        'ягоды замороженные',
        'крахмал кукурузный',
        'вишня замороженная',
        'фарш телячий',
        'джем ягодный (свой)',
        'сыр (pizza mix / твёрдый)'
      ],
      availableFillings: [
        'Без начинки — 4 ₪/шт',
        'Картофель, грибы и лук — 8 ₪/шт',
        'Яйцо и зелёный лук — 8 ₪/шт',
        'Грибы и лук — 8 ₪/шт',
        'Творог сладкий — 10 ₪/шт',
        'Творог с зеленью — 10 ₪/шт',
        'Творог с яблоком — 10 ₪/шт',
        'Ягоды — 10 ₪/шт',
        'Вишня — 10 ₪/шт',
        'Творожный крем и наш джем — 10 ₪/шт',
        'Телятина с луком — 10 ₪/шт',
        'Сыр с зеленью — 10 ₪/шт'
      ],
      cookingInstructions: 'Разогреть на среднем огне на сливочном масле по 2 минуты с каждой стороны до хрустящей корочки.'
    },
    en: {
      name: 'Thin Homemade Blini Crepes',
      unit: 'per 1 pc',
      weight: '~131 g / pc filled, ~76 g plain',
      badge: 'Hot from Pan 🥞',
      shortDescription: 'Delicate lace milk crepes: plain stack brushed with butter or with rich fillings.',
      fullDescription: 'Paper-thin golden crepes folded into neat parcels with generous fillings or served as a plain stack of ~20 pcs for 30 ₪.',
      ingredients: [
        'wheat flour',
        'egg',
        'milk',
        'eshel / yoghurt',
        'vegetable oil',
        'sugar',
        'salt',
        'potato',
        'champignon mushrooms',
        'onion',
        'black pepper & spices',
        'spring onion',
        'herbs (dill / parsley)',
        'curd cheese 9%',
        'sour cream',
        'vanillin',
        'apple',
        'frozen berries',
        'corn starch',
        'frozen sour cherries',
        'minced veal',
        'berry jam (our own)',
        'cheese (pizza mix / hard)'
      ],
      availableFillings: [
        'Plain, no filling — 4 ₪ / pc',
        'Potato, mushrooms & onion — 8 ₪ / pc',
        'Egg & spring onion — 8 ₪ / pc',
        'Mushrooms & onion — 8 ₪ / pc',
        'Sweet curd — 10 ₪ / pc',
        'Curd & herbs — 10 ₪ / pc',
        'Curd & apple — 10 ₪ / pc',
        'Berries — 10 ₪ / pc',
        'Sour cherry — 10 ₪ / pc',
        'Curd cream & our own jam — 10 ₪ / pc',
        'Veal & onion — 10 ₪ / pc',
        'Cheese & herbs — 10 ₪ / pc'
      ],
      cookingInstructions: 'Pan-fry in butter over medium heat for 2 minutes per side until golden and crisp.'
    },
    he: {
      name: 'בלינצ׳ס ביתי דקיק במילויים',
      unit: 'ל-1 יח׳',
      weight: 'כ-131 גרם עם מילוי, כ-76 גרם ללא מילוי',
      badge: 'חם מהמחבת 🥞',
      shortDescription: 'חביתיות דקיקות ותחרתיות על בסיס חלב: ערימה עם חמאה או במגוון מילויים עשירים.',
      fullDescription: 'בלינצ׳ס זהובים ורכים עטופים במעטפות עם שפע מילוי טרי או בערימה של כ-20 יחידות ללא מילוי ב-30 ₪.',
      ingredients: [
        'קמח חיטה',
        'ביצה',
        'חלב',
        'אשל / יוגורט',
        'שמן צמחי',
        'סוכר',
        'מלח',
        'תפוחי אדמה',
        'פטריות שמפיניון',
        'בצל',
        'פלפל שחור ותבלינים',
        'בצל ירוק',
        'עשבי תיבול (שמיר/פטרוזיליה)',
        'גבינה לבנה 9%',
        'שמנת חמוצה',
        'וניל',
        'תפוח',
        'פירות יער קפואים',
        'קורנפלור',
        'דובדבנים קפואים',
        'בשר עגל טחון',
        'ריבת פירות יער ביתית',
        'גבינה (פיצה מיקס / קשה)'
      ],
      availableFillings: [
        'ללא מילוי — 4 ₪ / יח׳',
        'תפוח אדמה, פטריות ובצל — 8 ₪ / יח׳',
        'ביצה ובצל ירוק — 8 ₪ / יח׳',
        'פטריות ובצל — 8 ₪ / יח׳',
        'גבינה לבנה מתוקה — 10 ₪ / יח׳',
        'גבינה לבנה ועשבי תיבול — 10 ₪ / יח׳',
        'גבינה לבנה ותפוח — 10 ₪ / יח׳',
        'פירות יער — 10 ₪ / יח׳',
        'דובדבנים — 10 ₪ / יח׳',
        'קרם גבינה וריבה ביתית — 10 ₪ / יח׳',
        'בשר עגל ובצל — 10 ₪ / יח׳',
        'גבינה ועשבי תיבול — 10 ₪ / יח׳'
      ],
      cookingInstructions: 'לחמם במחבת על אש בינונית עם מעט חמאה 2 דקות מכל צד עד לפריכות זהובה.'
    }
  },

  'cinnamon-rolls': {
    ru: {
      name: 'Синнабоны (корица / фисташка)',
      unit: 'за 1 шт',
      weight: '~130 г / шт (4 шт ~500 г)',
      badge: 'Тает во рту',
      shortDescription: 'Ультрамягкие сдобные завитки с ароматной корицей или фисташкой под шапкой сливочного крема.',
      fullDescription: 'Те самые знаменитые булочки-синнабоны! Мягкое как облачко дрожжевое тесто с карамельной прослойкой из корицы или фисташки, политые нежным сливочным кремом.',
      ingredients: ['мука', 'сливочное масло', 'молоко', 'сахар', 'корица', 'фисташка', 'сыр', 'сахарная пудра', 'ваниль'],
      availableFillings: [
        'С ароматной корицей и крем-чизом (18 ₪)',
        'Фисташковые синабоны с кремом (20 ₪)'
      ],
      cookingInstructions: 'Перед подачей подогрейте 15-20 секунд в микроволновке — крем растает и булочка станет неземной!'
    },
    en: {
      name: 'Cinnabons (Cinnamon / Pistachio)',
      unit: 'per 1 pc',
      weight: '~130g / pc (4 pcs ~500g)',
      badge: 'Melts in Your Mouth',
      shortDescription: 'Ultra-soft swirls of spiced cinnamon or pistachio smothered in rich cream cheese frosting.',
      fullDescription: 'Authentic Cinnabon brioche rolls! Cloud-like dough swirled with brown sugar, fragrant cinnamon or pistachio, generously frosted while warm with smooth cream cheese glaze.',
      ingredients: ['flour', 'butter', 'milk', 'sugar', 'cinnamon', 'pistachio', 'cream cheese', 'powdered sugar', 'vanilla'],
      availableFillings: [
        'Cinnamon with Cream Cheese (18 ₪)',
        'Pistachio Cinnabons with Cream (20 ₪)'
      ],
      cookingInstructions: 'Microwave for 15-20 seconds before serving so the frosting melts into the warm layers!'
    },
    he: {
      name: 'סינבון (קינמון / פיסטוק)',
      unit: 'ל-1 יח׳',
      weight: 'כ-130 גרם / יח׳ (מארז כ-500 גרם)',
      badge: 'נמס בפה',
      shortDescription: 'שבלולי שמרים רכים במיוחד במילוי קינמון או פיסטוק וקרם גבינת שמנת קטיפתי.',
      fullDescription: 'מאפי הסינבון המפורסמים! בצק שמרים רך כענן עם שכבות סוכר חום, קינמון או פיסטוק איכותי, מצופים בקרם עשיר של גבינת שמנת.',
      ingredients: ['קמח', 'חמאה', 'חלב', 'סוכר', 'קינמון', 'פיסטוק', 'גבינת שמנת', 'אבקת סוכר', 'תמצית וניל'],
      availableFillings: [
        'קינמון וקרם גבינה (18 ₪)',
        'סינבון פיסטוק עם קרם (20 ₪)'
      ],
      cookingInstructions: 'מומלץ לחמם 15-20 שניות במיקרוגל לפני האכילה — הקרם נמס והמאפה פשוט נמס בפה!'
    }
  },

  'poppy-seed-buns': {
    ru: {
      name: 'Булочки с маком',
      unit: '10 ₪ / шт (пак 35 ₪ / 4 шт)',
      weight: '~120 г / шт (4 шт ~480 г)',
      badge: 'Мягкое тесто',
      shortDescription: 'Пышные сдобные булочки из мягкого дрожжевого теста со щедрой начинкой из сочного мака.',
      fullDescription: 'Для настоящих ценителей домашней выпечки! Тесто нежнейшее и пушистое, с щедрой начинкой из сочного мака.',
      ingredients: ['мука', 'мак', 'молоко', 'сливочное масло', 'сахар', 'яйца'],
      availableFillings: [
        'С сочным маком'
      ],
      storageInfo: 'Хранятся мягкими до 3 дней в закрытом контейнере.'
    },
    en: {
      name: 'Poppy Seed Buns',
      unit: '10 ₪ / pc (pack 35 ₪ / 4 pcs)',
      weight: '~120g / pc (4 pcs ~480g)',
      badge: 'Soft Brioche',
      shortDescription: 'Fluffy brioche buns with sweet juicy poppy seed filling.',
      fullDescription: 'Delicious homemade brioche buns packed with juicy sweet poppy seed filling in soft golden yeast dough.',
      ingredients: ['flour', 'poppy seeds', 'milk', 'butter', 'sugar', 'eggs'],
      availableFillings: [
        'With Juicy Poppy Seeds'
      ],
      storageInfo: 'Stays soft for up to 3 days in an airtight box.'
    },
    he: {
      name: 'לחמניות שמרים במילוי פרג',
      unit: '10 ₪ / יח׳ (מארז 35 ₪ / 4 יח׳)',
      weight: 'כ-120 גרם / יח׳ (מארז כ-480 גרם)',
      badge: 'בצק רך',
      shortDescription: 'לחמניות שמרים תפוחות עם מילוי פרג עסיסי.',
      fullDescription: 'מאפי שמרים ביתיים ואווריריים במילוי פרג עסיסי עשיר.',
      ingredients: ['קמח', 'פרג', 'חלב', 'חמאה', 'סוכר', 'ביצים'],
      availableFillings: [
        'מילוי פרג עסיסי'
      ],
      storageInfo: 'נשמר רך עד 3 ימים בקופסה סגורה.'
    }
  },

  'vatrushki-cottage-cheese': {
    ru: {
      name: 'Ватрушки с творогом и нежным сметанным кремом',
      unit: 'за 1 шт',
      weight: '~100 г / шт',
      badge: 'Нежный творог 🧀',
      shortDescription: 'Пышное сдобное тесто с щедрой шапкой из творога и шелковистого сметанного крема.',
      fullDescription: 'Классические домашние ватрушки с большим количеством начинки! Воздушное дрожжевое тесто, сочный творог с ноткой ванили и нежный сметанный крем.',
      ingredients: ['мука', 'творог', 'сметана', 'сливочное масло', 'яйца', 'молоко', 'сахар', 'ваниль', 'дрожжи'],
      storageInfo: 'Хранить в закрытом контейнере в холодильнике до 3 суток. Вкусно как в теплом, так и в охлажденном виде.'
    },
    en: {
      name: 'Cottage Cheese Vatrushki with Sour Cream Glaze',
      unit: 'per 1 pc',
      weight: '~100g / pc',
      badge: 'Fresh Curd 🧀',
      shortDescription: 'Fluffy sweet yeast dough topped generously with farm cottage cheese and silky sour cream glaze.',
      fullDescription: 'Traditional homemade vatrushki baked to golden perfection with a rich sweet vanilla cottage cheese filling and delicate sour cream topping.',
      ingredients: ['flour', 'cottage cheese', 'sour cream', 'butter', 'eggs', 'milk', 'sugar', 'vanilla', 'yeast'],
      storageInfo: 'Store in an airtight container in the fridge for up to 3 days. Delicious warm or chilled.'
    },
    he: {
      name: 'ואטרושקי עם גבינת טוורוג וציפוי קרם שמנת',
      unit: 'ל-1 יח׳',
      weight: 'כ-100 גרם / יח׳',
      badge: 'טוורוג עשיר 🧀',
      shortDescription: 'בצק שמרים עשיר ותפוח עם שפע גבינת טוורוג וקרם שמנת חמוצה קטיפתי.',
      fullDescription: 'מאפה ואטרושקה מסורתי עם שפע של מילוי גבינת חווה עשירה בניחוח וניל טבעי וציפוי שמנת רך ונמס בפה.',
      ingredients: ['קמח', 'טוורוג', 'שמנת חמוצה', 'חמאה', 'ביצים', 'חלב', 'סוכר', 'וניל', 'שמרים'],
      storageInfo: 'לשמור בקופסה אטומה במקרר עד 3 ימים. טעים במיוחד חמים או בטמפרטורת החדר.'
    }
  },

  'golubtsy-homemade': {
    ru: {
      name: 'Голубцы домашние',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      badge: 'Сытный обед 🍲',
      shortDescription: 'В капустных и виноградных листьях, томлёные в томатном соусе.',
      fullDescription: 'Настоящие домашние голубцы в капустных и виноградных листьях с сочным фаршем и рисом, томлёные в нежном томатном соусе.',
      ingredients: [
        'куриная грудка',
        'рис',
        'лук репчатый',
        'морковь',
        'томатная паста',
        'масло растительное',
        'соль',
        'перец чёрный / специи',
        'капуста белокочанная',
        'фарш телячий'
      ],
      availableFillings: [
        'Курица с рисом',
        'Курица без риса',
        'Телятина с рисом'
      ],
      cookingInstructions: 'Поставляются готовыми в термоконтейнере. Разогреть в кастрюле под крышкой или в микроволновке 3-4 минуты.'
    },
    en: {
      name: 'Homemade Stuffed Leaves (Golubtsy & Dolma)',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      badge: 'Hearty Lunch 🍲',
      shortDescription: 'In cabbage and grape leaves, simmered in rich tomato sauce.',
      fullDescription: 'Homestyle stuffed cabbage and tender grape leaves with seasoned minced meat and rice, simmered in flavorful tomato sauce.',
      ingredients: [
        'chicken breast',
        'rice',
        'onion',
        'carrot',
        'tomato paste',
        'vegetable oil',
        'salt',
        'black pepper & spices',
        'white cabbage',
        'minced veal'
      ],
      availableFillings: [
        'Chicken & rice',
        'Chicken, no rice',
        'Veal & rice'
      ],
      cookingInstructions: 'Delivered ready to eat in a container. Reheat in a covered saucepan or microwave for 3-4 minutes.'
    },
    he: {
      name: 'גולובצי ועלי גפן ביתיים',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      badge: 'ארוחה משביעה 🍲',
      shortDescription: 'בעלי כרוב ועלי גפן, מבושלים ברוטב עגבניות עשיר.',
      fullDescription: 'ממולאים ביתיים מסורתיים בעלי כרוב ועלי גפן עם מילוי בשר עסיסי ואורז, מבושלים ברוטב עגבניות עשיר.',
      ingredients: [
        'חזה עוף',
        'אורז',
        'בצל',
        'גזר',
        'רסק עגבניות',
        'שמן צמחי',
        'מלח',
        'פלפל שחור ותבלינים',
        'כרוב לבן',
        'בשר עגל טחון'
      ],
      availableFillings: [
        'עוף ואורז',
        'עוף ללא אורז',
        'בשר עגל ואורז'
      ],
      cookingInstructions: 'מגיע מוכן בקופסה תרמית. לחמם בסיר מכוסה או במיקרוגל 3-4 דקות.'
    }
  },

  'salad-olivier': {
    ru: {
      name: 'Салат «Оливье» праздничный (предзаказ)',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      shortDescription: 'Тот самый любимый домашний Оливье. Свежие и маринованные огурчики, нежное мясо/колбаска, домашний соус.',
      fullDescription: 'Любимый салат к праздничному столу или воскресному обеду. Все овощи отварены до идеальной текстуры и нарезаны аккуратным мелким кубиком. По вашему желанию заправляем или отдаем соус отдельно.',
      ingredients: [
        'картофель',
        'морковь',
        'куриная грудка',
        'яйцо',
        'огурцы солёные',
        'горошек консервированный',
        'майонез',
        'лук репчатый',
        'соль',
        'колбаса докторская'
      ],
      storageInfo: 'Готовится строго в день заказа. Срок хранения в холодильнике до 36 часов.',
      availableFillings: [
        'С куриной грудкой',
        'С докторской колбасой'
      ],
    },
    en: {
      name: 'Holiday Olivier Salad (Pre-order)',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      shortDescription: 'The beloved traditional Olivier salad with crisp pickles, sweet peas, eggs, and homemade dressing.',
      fullDescription: 'Classic celebratory salad diced with precision and prepared on the day of delivery. Dressing can be mixed or packed on the side upon request.',
      ingredients: [
        'potato',
        'carrot',
        'chicken breast',
        'egg',
        'pickled cucumbers',
        'canned green peas',
        'mayonnaise',
        'onion',
        'salt',
        'bologna sausage'
      ],
      storageInfo: 'Prepared fresh on the delivery day. Keeps up to 36 hours in refrigerator.',
      availableFillings: [
        'With chicken breast',
        'With bologna sausage'
      ],
    },
    he: {
      name: 'סלט אוליבייה חגיגי (בהזמנה מראש)',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      shortDescription: 'סלט תפוחי האדמה והירקות הקלאסי עם אפונה מתוקה, חמוצים ורוטב ביתי.',
      fullDescription: 'הסלט האהוב ביותר לשולחן החג. כל הירקות מבושלים לדיוק מושלם וחתוכים לקוביות קטנות. ניתן לקבל מתובל או עם רוטב בצד לבחירתכם.',
      ingredients: [
        'תפוחי אדמה',
        'גזר',
        'חזה עוף',
        'ביצה',
        'מלפפונים חמוצים',
        'אפונה משומרת',
        'מיונז',
        'בצל',
        'מלח',
        'נקניק דוקטורסקאיה'
      ],
      storageInfo: 'מוכן טרי ביום ההזמנה. נשמר במקרר עד 36 שעות.',
      availableFillings: [
        'עם חזה עוף',
        'עם נקניק דוקטורסקאיה'
      ],
    }
  },

  'salad-herring-coat': {
    ru: {
      name: 'Салат «Сельдь под шубой» (предзаказ)',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      shortDescription: 'Сочная малосольная селёдочка, нежнейшие слои сладкой свеклы, моркови и картофеля.',
      fullDescription: 'Классическая «Шуба», выложенная идеальными воздушными слоями. Малосольная нежная селедка без косточек, пропитанные слои овощей и легкая сеточка соуса. Тает во рту!',
      ingredients: [
        'свёкла',
        'картофель',
        'морковь',
        'сельдь филе',
        'майонез',
        'лук репчатый',
        'зелёный лук',
        'яйцо',
        'зелень (укроп/петрушка)',
        'лимон',
        'уксус',
        'соль'
      ],
      storageInfo: 'Доставляется в удобном праздничном контейнере. Готов к подаче на стол.'
    },
    en: {
      name: 'Herring Under a Fur Coat (Pre-order)',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      shortDescription: 'Layered salted herring with sweet beets, carrots, potatoes, and delicate dressing.',
      fullDescription: 'Traditional layered Shuba salad with delicate spiced herring fillets, fluffy roasted beet and potato layers, and eggs. Looks stunning on any festive table.',
      ingredients: [
        'beetroot',
        'potato',
        'carrot',
        'herring fillet',
        'mayonnaise',
        'onion',
        'spring onion',
        'egg',
        'herbs (dill / parsley)',
        'lemon',
        'vinegar',
        'salt'
      ],
      storageInfo: 'Delivered in a festive presentation box. Ready to serve.'
    },
    he: {
      name: 'דג מליח בשכבות ירקות וסלק (שובה)',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      shortDescription: 'הרינג מלוח עדין בשכבות אווריריות של סלק מתוק, גזר, תפוחי אדמה ורוטב עדין.',
      fullDescription: 'סלט ה״שובה״ הקלאסי המסורתי. פילה הרינג מלוח ללא עצמות, שכבות סלק אפוי עסיסי, תפוחי אדמה וביצים. מראה מרהיב וטעם עשיר.',
      ingredients: [
        'סלק',
        'תפוחי אדמה',
        'גזר',
        'פילה הרינג',
        'מיונז',
        'בצל',
        'בצל ירוק',
        'ביצה',
        'עשבי תיבול (שמיר/פטרוזיליה)',
        'לימון',
        'חומץ',
        'מלח'
      ],
      storageInfo: 'נמסר בקופסה חגיגית ומוכן מיד להגשה לשולחן.'
    }
  },

  'salad-vinegret': {
    ru: {
      name: 'Винегрет',
      unit: 'за 1 кг',
      weight: 'фасовка 500 г или 1 кг',
      shortDescription: 'Запеченные корнеплоды, хрустящие бочковые огурчики, квашеная капуста и свежая зелень.',
      fullDescription: 'Яркий, свежий и сочный домашний винегрет. Овощи запекаются в духовке для максимального сохранения вкуса и витаминов.',
      ingredients: [
        'свёкла',
        'картофель',
        'морковь',
        'лук репчатый',
        'зелёный лук',
        'горчица',
        'огурцы солёные',
        'квашеная капуста (своя)',
        'масло растительное',
        'соль',
        'горошек консервированный',
        'фасоль консервированная'
      ],
      availableFillings: [
        'Классический',
        'С фасолью и горошком'
      ],
    },
    en: {
      name: 'Vinegret Salad',
      unit: 'per 1 kg',
      weight: '500 g or 1 kg pack',
      shortDescription: 'Oven-roasted root veggies, crunchy barrel pickles, sauerkraut, and fresh herbs.',
      fullDescription: 'Vibrant and refreshing traditional beet salad. Vegetables are baked in the oven to concentrate flavors.',
      ingredients: [
        'beetroot',
        'potato',
        'carrot',
        'onion',
        'spring onion',
        'mustard',
        'pickled cucumbers',
        'sauerkraut (our own)',
        'vegetable oil',
        'salt',
        'canned green peas',
        'canned beans'
      ],
      availableFillings: [
        'Classic',
        'With beans & green peas'
      ],
    },
    he: {
      name: 'סלט ויניגרט',
      unit: 'ל-1 ק״ג',
      weight: 'אריזה 500 גרם או 1 ק״ג',
      shortDescription: 'ירקות שורש אפויים, מלפפונים חמוצים פריכים, כרוב כבוש ועשבי תיבול.',
      fullDescription: 'סלט ויניגרט צבעוני, רענן ובריא. הירקות נאפים בתנור לשמירה על הטעם הטבעי והוויטמינים.',
      ingredients: [
        'סלק',
        'תפוחי אדמה',
        'גזר',
        'בצל',
        'בצל ירוק',
        'חרדל',
        'מלפפונים חמוצים',
        'כרוב כבוש ביתי',
        'שמן צמחי',
        'מלח',
        'אפונה משומרת',
        'שעועית משומרת'
      ],
      availableFillings: [
        'קלאסי',
        'עם שעועית ואפונה'
      ],
    }
  },

  'ossetian-pie': {
    ru: {
      name: 'Осетинский пирог',
      unit: 'за 1 шт (~1 кг, ⌀ 30 см)',
      weight: '~1000 г (диаметр 30 см)',
      badge: 'С пылу с жару 🔥',
      shortDescription: 'Традиционный сочный пирог на тонком тесте с сыром, картофелем, зеленью или мясом.',
      fullDescription: 'Горячий ароматный осетинский пирог с тончайшим нежным тестом и щедрой сочной начинкой, обильно смазанный сливочным маслом.',
      ingredients: ['мука', 'сыр', 'сливочное масло', 'молоко', 'дрожжи', 'соль', 'начинка на выбор'],
      availableFillings: [
        'С сыром и зеленью (Уалибах) — 80 ₪',
        'С сыром и картофелем (Картофджин) — 80 ₪',
        'С сочным мясным фаршем (Фыдджин) — 95 ₪',
        'С сыром и листьями свеклы (Цахараджин) — 80 ₪'
      ],
      storageInfo: 'Разогревать в духовке.'
    },
    en: {
      name: 'Ossetian Pie',
      unit: 'per 1 pie (~1kg, ⌀ 30 cm)',
      weight: '~1000g (30 cm diameter)',
      badge: 'Fresh from Oven 🔥',
      shortDescription: 'Traditional juicy pie with thin tender dough, rich cheese, potatoes, fresh herbs or meat.',
      fullDescription: 'Hot aromatic Ossetian flatbread pie with paper-thin crust, loaded with melted cheese and seasoned fillings, brushed with melted butter.',
      ingredients: ['flour', 'cheese', 'butter', 'milk', 'yeast', 'salt', 'filling of choice'],
      availableFillings: [
        'With Cheese & Fresh Herbs (Walibakh) — 80 ₪',
        'With Cheese & Potatoes (Kartofdzhin) — 80 ₪',
        'With Juicy Minced Meat (Fyddzhin) — 95 ₪',
        'With Cheese & Beetroot Leaves (Tsakharadzhin) — 80 ₪'
      ],
      storageInfo: 'Best reheated in the oven.'
    },
    he: {
      name: 'פאי אוסטי מסורתי (אוסטינסקי פירוג)',
      unit: 'ליחידה (כ-1 ק״ג, קוטר 30 ס״מ)',
      weight: 'כ-1,000 גרם (קוטר 30 ס״מ)',
      badge: 'חם מהתנור 🔥',
      shortDescription: 'מאפה מסורתי עסיסי מבצק דקיק במילוי גבינה, תפוחי אדמה, עשבי תיבול או בשר.',
      fullDescription: 'פאי אוסטי מסורתי חם וריחני עם בצק דק במיוחד, מילוי עשיר ונמס בפה וציפוי חמאה נימוחה.',
      ingredients: ['קמח', 'גבינה', 'חמאה', 'חלב', 'שמרים', 'מלח', 'מילוי לבחירה'],
      availableFillings: [
        'עם גבינה ועשבי תיבול (ואליבאח) — 80 ₪',
        'עם גבינה ותפוחי אדמה (קרטופג׳ין) — 80 ₪',
        'עם בשר טחון עסיסי (פידג׳ין) — 95 ₪',
        'עם גבינה ועלי סלק (צחרדג׳ין) — 80 ₪'
      ],
      storageInfo: 'מומלץ לחימום קל בתנור.'
    }
  },

  'ciabatta-focaccia': {
    ru: {
      name: 'Чиабатта / Фокачча домашняя',
      unit: 'за 1 шт (от 10 ₪)',
      weight: '~200-400 г',
      badge: 'Ароматный хлеб 🥖',
      shortDescription: 'Хрустящая корочка, крупная пористость, оливковое масло первого отжима и розмарин.',
      fullDescription: 'Итальянский ремесленный хлеб длительной холодной ферментации. Хрустящая корочка, влажный ноздреватый мякиш и аромат прованских трав с оливковым маслом.',
      ingredients: ['мука', 'вода', 'оливковое масло', 'соль', 'розмарин', 'чеснок', 'оливки', 'томаты', 'дрожжи'],
      availableFillings: [
        'Классическая чиабатта с хрустящей корочкой (10 ₪/ шт около 200 г)',
        'Фокачча с томатами, розмарином и крупной солью (20 ₪)',
        'Фокачча с чесночным маслом и оливками (25 ₪)'
      ],
      storageInfo: 'Хранить в бумажном пакете до 2 суток. Перед подачей разогреть в духовке 3 мин.'
    },
    en: {
      name: 'Artisan Ciabatta & Focaccia',
      unit: 'per 1 pc (from 10 ₪)',
      weight: '~200-400g',
      badge: 'Artisan Bread 🥖',
      shortDescription: 'Crisp airy crust, open crumb, extra virgin olive oil, and rosemary.',
      fullDescription: 'Slow-fermented artisan Italian bread. Golden crispy crust, airy tender crumb, infused with olive oil and aromatic herbs.',
      ingredients: ['flour', 'water', 'olive oil', 'salt', 'rosemary', 'garlic', 'olives', 'tomatoes', 'yeast'],
      availableFillings: [
        'Classic Crispy Crust Ciabatta (10 ₪ / pc ~200g)',
        'Tomato, Rosemary & Sea Salt Focaccia (20 ₪)',
        'Garlic Butter & Olive Focaccia (25 ₪)'
      ],
      storageInfo: 'Store in paper bag up to 2 days. Reheat in oven for 3 mins before serving.'
    },
    he: {
      name: 'צ׳יאבטה ופוקאצ׳ה ביתית',
      unit: 'ליחידה (החל מ-10 ₪)',
      weight: 'כ-200-400 גרם',
      badge: 'לחם ארטיזנל 🥖',
      shortDescription: 'קרום פריך, בועות אוויר גדולות, שמן זית כתית מעולה ורוזמרין ריחני.',
      fullDescription: 'לחם איטלקי מסורתי בהתפחה אטית. קראסט פריך, מרקם אוורירי ורך, מתובל בשמן זית איכותי ועשבי תיבול.',
      ingredients: ['קמח', 'מים', 'שמן זית', 'מלח', 'רוזמרין', 'שום', 'זיתים', 'עגבניות', 'שמרים'],
      availableFillings: [
        'צ׳יאבטה קלאסית עם קרום פריך (10 ₪ / יח׳ כ-200 גרם)',
        'פוקאצ׳ה עגבניות, רוזמרין ומלח ים (20 ₪)',
        'פוקאצ׳ה שמן שום וזיתים (25 ₪)'
      ],
      storageInfo: 'לשמור בשקית נייר עד יומיים. מומלץ לחמם בתנור 3 דקות לפני ההגשה.'
    }
  },

  'custom-sweet-bakes': {
    ru: {
      name: 'Сладкая выпечка на ваш вкус',
      unit: 'зависит от веса и пожеланий',
      weight: 'по договоренности',
      badge: 'На заказ 🍰',
      shortDescription: 'Шарлотка, брауни, тарты, рулеты, торты («Медовик», «Наполеон»), чизкейки и любые десерты.',
      fullDescription: 'Приготовим для вас любимый десерт или праздничную сладкую выпечку по индивидуальным пожеланиям: шарлотка с яблоками, шоколадный брауни, ягодные тарты, бисквитные рулеты, домашние торты («Медовик», «Наполеон») и нежнейшие чизкейки.',
      ingredients: ['сливки', 'сливочное масло', 'яйца', 'шоколад', 'ягоды', 'фрукты', 'мука', 'сахар'],
      availableFillings: [
        'Шарлотка с яблоками и корицей',
        'Шоколадный брауни с грецким орехом',
        'Ягодный тарт со сливочным кремом',
        'Бисквитный рулет с нежным кремом',
        'Торт «Медовик» домашний',
        'Торт «Наполеон» слоеный',
        'Классический чизкейк'
      ],
      storageInfo: 'Готовится по предзаказу за 24-48 часов из свежайших ингредиентов.'
    },
    en: {
      name: 'Custom Sweet Bakes & Desserts',
      unit: 'depends on weight and wishes',
      weight: 'as requested',
      badge: 'To Order 🍰',
      shortDescription: 'Apple Sharlotka, brownies, fruit tarts, sweet rolls, cakes (Medovik, Napoleon), and cheesecakes.',
      fullDescription: 'Fresh custom baked cakes and desserts made to your exact preferences: classic apple sharlotka, fudgy brownies, berry tarts, delicate cake rolls, artisan Medovik & Napoleon cakes, and creamy cheesecakes.',
      ingredients: ['cream', 'butter', 'eggs', 'chocolate', 'berries', 'fruits', 'flour', 'sugar'],
      availableFillings: [
        'Apple Sharlotka with Cinnamon',
        'Rich Fudgy Walnut Brownie',
        'Fresh Berry Custard Tart',
        'Tender Sponge Swiss Roll',
        'Classic Honey Cake (Medovik)',
        'Layered Custard Napoleon Cake',
        'New York Style Cheesecake'
      ],
      storageInfo: 'Prepared fresh to order with 24-48h notice.'
    },
    he: {
      name: 'מאפים וקינוחים מתוקים לפי טעמכם',
      unit: 'תלוי במשקל ובבקשות',
      weight: 'לפי תיאום',
      badge: 'בהזמנה אישית 🍰',
      shortDescription: 'שרלוטקה תפוחים, בראוניז, טארטים, רולדות, עוגות (מדוביק, נפוליאון), עוגות גבינה ועוד.',
      fullDescription: 'מגוון קינוחים ומאפים מתוקים הנאפים בהתאמה אישית לפי בחירתכם: עוגת שרלוטקה תפוחים עשירה, בראוניז שוקולד פאדג׳, טארט פירות יער, רולדת ביסקוויט, עוגות מדוביק ונפוליאון מסורתיות ועוגות גבינה קרמיות.',
      ingredients: ['שמנת', 'חמאה', 'ביצים', 'שוקולד', 'פירות יער', 'פירות', 'קמח', 'סוכר'],
      availableFillings: [
        'שרלוטקה תפוחים וקינמון',
        'בראוניז שוקולד עשיר עם אגוזי מלך',
        'טארט פירות יער עם קרם פטיסייר',
        'רולדת וניל ושמנת נימוחה',
        'עוגת מדוביק דבש מסורתית',
        'עוגת נפוליאון עלים עשירה',
        'עוגת גבינה ניו יורקית אפויה'
      ],
      storageInfo: 'נאפה בהזמנה מראש בהתראה של 24-48 שעות מחומרים טריים בלבד.'
    }
  }
};
