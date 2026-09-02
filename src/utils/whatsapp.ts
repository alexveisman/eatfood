import { CartItem, OrderFormState, Language } from '../types';
import { PICKUP_ADDRESS, WHATSAPP_PHONE } from '../data/menuData';
import { PRODUCT_TRANSLATIONS } from '../i18n/translations';

export function formatPrice(amount: number): string {
  return `${amount} ₪`;
}

export function generateWhatsAppOrderMessage(
  cartItems: CartItem[],
  orderForm: OrderFormState,
  totalAmount: number,
  _hasPromoGift: boolean = false,
  lang: Language = 'ru'
): string {
  const lines: string[] = [];

  if (lang === 'he') {
    lines.push('👋 שלום! אני רוצה לבצע הזמנת אוכל ביתי:');
    lines.push('');
    lines.push('📋 פירוט ההזמנה:');

    cartItems.forEach((item, index) => {
      const prodTrans = PRODUCT_TRANSLATIONS[item.product.id]?.he;
      const prodName = prodTrans?.name || item.product.name;
      let itemLine = `${index + 1}. *${prodName}* × ${item.quantity}`;
      if (item.selectedFilling) {
        itemLine += `\n   • מילוי: ${item.selectedFilling}`;
      }
      if (item.selectedCookingOption) {
        itemLine += `\n   • אופן הכנה: ${item.selectedCookingOption}`;
      }
      if (item.customNotes) {
        itemLine += `\n   • הערות: ${item.customNotes}`;
      }
      itemLine += `\n   💰 מחיר: ${item.totalPrice} ₪`;
      lines.push(itemLine);
    });

    lines.push('');
    lines.push(`💳 *סה״כ לתשלום:* ${totalAmount} ₪`);
    lines.push('');
    lines.push('🚚 *פרטי אספקה:*');

    if (orderForm.deliveryType === 'pickup') {
      lines.push(`📍 אופן קבלה: איסוף עצמי (רחוב ראובן רובין 5)`);
    } else {
      lines.push('🚕 אופן קבלה: משלוח שליח / מונית (על חשבון המזמין)');
    }

    if (orderForm.customerName) {
      lines.push(`👤 שם המזמין: ${orderForm.customerName}`);
    }
    if (orderForm.customerPhone) {
      lines.push(`📞 טלפון לחזרה: ${orderForm.customerPhone}`);
    }
    if (orderForm.preferredDate || orderForm.preferredTime) {
      const dateTime = [orderForm.preferredDate, orderForm.preferredTime].filter(Boolean).join(', ');
      lines.push(`📅 תאריך ושעה מבוקשים: ${dateTime}`);
    }
    if (orderForm.notes) {
      lines.push(`📝 הערות / כתובת: ${orderForm.notes}`);
    }

    lines.push('');
    lines.push('אשמח לאישור ההזמנה ומועד האיסוף/המשלוח. תודה רבה! ✨');
    return lines.join('\n');
  }

  if (lang === 'en') {
    lines.push('👋 Hello! I would like to place a homemade bakery order:');
    lines.push('');
    lines.push('📋 ORDER ITEMS:');

    cartItems.forEach((item, index) => {
      const prodTrans = PRODUCT_TRANSLATIONS[item.product.id]?.en;
      const prodName = prodTrans?.name || item.product.name;
      let itemLine = `${index + 1}. *${prodName}* × ${item.quantity}`;
      if (item.selectedFilling) {
        itemLine += `\n   • Filling: ${item.selectedFilling}`;
      }
      if (item.selectedCookingOption) {
        itemLine += `\n   • Prep: ${item.selectedCookingOption}`;
      }
      if (item.customNotes) {
        itemLine += `\n   • Notes: ${item.customNotes}`;
      }
      itemLine += `\n   💰 Subtotal: ${item.totalPrice} ₪`;
      lines.push(itemLine);
    });

    lines.push('');
    lines.push(`💳 *TOTAL AMOUNT:* ${totalAmount} ₪`);
    lines.push('');
    lines.push('🚚 *FULFILLMENT DETAILS:*');

    if (orderForm.deliveryType === 'pickup') {
      lines.push(`📍 Method: Self-Pickup (5 Reuven Rubin St)`);
    } else {
      lines.push('🚕 Method: Courier / Taxi Delivery');
    }

    if (orderForm.customerName) {
      lines.push(`👤 Name: ${orderForm.customerName}`);
    }
    if (orderForm.customerPhone) {
      lines.push(`📞 Phone: ${orderForm.customerPhone}`);
    }
    if (orderForm.preferredDate || orderForm.preferredTime) {
      const dateTime = [orderForm.preferredDate, orderForm.preferredTime].filter(Boolean).join(', ');
      lines.push(`📅 Preferred Date/Time: ${dateTime}`);
    }
    if (orderForm.notes) {
      lines.push(`📝 Notes/Address: ${orderForm.notes}`);
    }

    lines.push('');
    lines.push('Please let me know if everything is available and when it can be ready. Thank you! ✨');
    return lines.join('\n');
  }

  // Default: Russian
  lines.push('👋 Здравствуйте! Хочу сделать заказ домашней еды:');
  lines.push('');
  lines.push('📋 СОСТАВ ЗАКАЗА:');
  
  cartItems.forEach((item, index) => {
    const prodTrans = PRODUCT_TRANSLATIONS[item.product.id]?.ru;
    const prodName = prodTrans?.name || item.product.name;
    let itemLine = `${index + 1}. *${prodName}* × ${item.quantity}`;
    if (item.selectedFilling) {
      itemLine += `\n   • Начинка: ${item.selectedFilling}`;
    }
    if (item.selectedCookingOption) {
      itemLine += `\n   • Приготовление: ${item.selectedCookingOption}`;
    }
    if (item.customNotes) {
      itemLine += `\n   • Пожелания: ${item.customNotes}`;
    }
    itemLine += `\n   💰 Стоимость: ${item.totalPrice} ₪`;
    lines.push(itemLine);
  });

  lines.push('');
  lines.push(`💳 *ИТОГО К ОПЛАТЕ:* ${totalAmount} ₪`);
  lines.push('');
  lines.push('🚚 *ДЕТАЛИ ДОСТАВКИ:*');
  
  if (orderForm.deliveryType === 'pickup') {
    lines.push(`📍 Способ: Самовывоз (${PICKUP_ADDRESS})`);
  } else {
    lines.push('🚕 Способ: Доставка на такси / курьер (за счёт клиента)');
  }

  if (orderForm.customerName) {
    lines.push(`👤 Имя заказчика: ${orderForm.customerName}`);
  }
  if (orderForm.customerPhone) {
    lines.push(`📞 Телефон для связи: ${orderForm.customerPhone}`);
  }
  if (orderForm.preferredDate || orderForm.preferredTime) {
    const dateTime = [orderForm.preferredDate, orderForm.preferredTime].filter(Boolean).join(', ');
    lines.push(`📅 Желаемая дата/время: ${dateTime}`);
  }
  if (orderForm.notes) {
    lines.push(`📝 Комментарий к заказу: ${orderForm.notes}`);
  }

  lines.push('');
  lines.push('Подскажите, пожалуйста, всё ли в наличии и когда можно забрать? Спасибо! ✨');

  return lines.join('\n');
}

export function openWhatsAppChat(
  phone: string = WHATSAPP_PHONE,
  message: string
): void {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function openDirectWhatsAppInquiry(
  subject?: string,
  phone: string = WHATSAPP_PHONE,
  lang: Language = 'ru'
): void {
  let message = 'Здравствуйте! У меня есть вопрос по поводу домашней выпечки и заказа.';
  if (lang === 'he') {
    message = subject 
      ? `שלום! רציתי לקבל פרטים נוספים לגבי: "${subject}". האם ניתן להזמין?`
      : 'שלום! יש לי שאלה לגבי תפריט המאפים וההזמנות.';
  } else if (lang === 'en') {
    message = subject 
      ? `Hello! I would like to learn more about: "${subject}". Could you please provide details and availability?`
      : 'Hello! I have a question regarding your homemade bakery menu and orders.';
  } else {
    if (subject) {
      message = `Здравствуйте! Хочу узнать подробнее по поводу: "${subject}". Подскажите детали и возможность заказа?`;
    }
  }
  openWhatsAppChat(phone, message);
}
