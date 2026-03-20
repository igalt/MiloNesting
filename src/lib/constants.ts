import type { Category, Priority, ForWhom, AcquisitionType } from '../types'

export const CATEGORY_LABELS: Record<Category, string> = {
  stroller: 'עגלה והליכות',
  safety_travel: 'בטיחות ונסיעות',
  sleep: 'שינה',
  changing: 'החתלה',
  diapers: 'חיתולים',
  bath: 'אמבטיה',
  care_hygiene: 'טיפול והיגיינה',
  feeding: 'האכלה',
  clothing: 'ביגוד',
  toys_activities: 'צעצועים ופעילות',
  hospital_bag: 'תיק לידה',
}

export const CATEGORY_EMOJIS: Record<Category, string> = {
  stroller: '🚗',
  safety_travel: '🛡️',
  sleep: '🌙',
  changing: '🧷',
  diapers: '👶',
  bath: '🛁',
  care_hygiene: '🧴',
  feeding: '🍼',
  clothing: '👕',
  toys_activities: '🎁',
  hospital_bag: '🏥',
}

export const CATEGORY_ORDER: Category[] = [
  'stroller',
  'safety_travel',
  'sleep',
  'changing',
  'diapers',
  'bath',
  'care_hygiene',
  'feeding',
  'clothing',
  'toys_activities',
  'hospital_bag',
]

export const PRIORITY_LABELS: Record<Priority, string> = {
  must_have: 'חובה',
  nice_to_have: 'נחמד שיהיה',
  question_mark: 'לא בטוח',
}

export const PRIORITY_EMOJIS: Record<Priority, string> = {
  must_have: '💗',
  nice_to_have: '⭐',
  question_mark: '❓',
}

export const PRIORITY_ORDER: Priority[] = ['must_have', 'nice_to_have', 'question_mark']

export const FOR_WHOM_LABELS: Record<ForWhom, string> = {
  baby: 'תינוק',
  mother: 'אמא',
  both: 'שניהם',
}

export const ACQUISITION_LABELS: Record<AcquisitionType, string> = {
  buy_new: 'קנייה חדשה',
  borrow: 'להשאיל',
  second_hand: 'יד שנייה',
  gift: 'מתנה',
}

export const ACQUISITION_EMOJIS: Record<AcquisitionType, string> = {
  buy_new: '🛍️',
  borrow: '🤝',
  second_hand: '♻️',
  gift: '🎁',
}

// Category sort_order block starts (100k per category)
export const CATEGORY_SORT_BLOCK: Record<Category, number> = {
  stroller: 100000,
  safety_travel: 200000,
  sleep: 300000,
  changing: 400000,
  diapers: 500000,
  bath: 600000,
  care_hygiene: 700000,
  feeding: 800000,
  clothing: 900000,
  toys_activities: 1000000,
  hospital_bag: 1100000,
}
