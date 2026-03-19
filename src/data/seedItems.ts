import type { NewNestingItem } from '../types'
import { CATEGORY_SORT_BLOCK } from '../lib/constants'

function item(
  name_he: string,
  name_en: string | null,
  category: NewNestingItem['category'],
  idx: number,
  overrides: Partial<NewNestingItem> = {}
): NewNestingItem {
  return {
    name_he,
    name_en,
    category,
    acquisition_types: ['buy_new'],
    priority: 'must_have',
    for_whom: 'baby',
    got_it: false,
    borrow_from: null,
    gift_from: null,
    store_links: [],
    notes: null,
    sort_order: CATEGORY_SORT_BLOCK[category] + idx * 1000,
    ...overrides,
  }
}

export const seedItems: NewNestingItem[] = [
  // ──────────────── עגלה והליכות ────────────────
  item('עגלה לעיר', 'City stroller', 'stroller', 1, { priority: 'must_have' }),
  item('עגלה לשטח', 'Terrain stroller', 'stroller', 2, { priority: 'question_mark' }),
  item('תיק לעגלה', 'Stroller bag', 'stroller', 3, { priority: 'nice_to_have' }),
  item('סדינים לעגלה', 'Stroller sheets', 'stroller', 4, { priority: 'must_have' }),
  item('קשת פעילות לעגלה', 'Activity arch for stroller', 'stroller', 5, { priority: 'nice_to_have' }),
  item('שאקל לעגלה', 'Stroller hook', 'stroller', 6, { priority: 'nice_to_have' }),
  item('וו לעגלה', 'Stroller handle hook', 'stroller', 7, { priority: 'nice_to_have' }),
  item('מתקן לכוס לעגלה', 'Cup holder for stroller', 'stroller', 8, { priority: 'nice_to_have' }),

  // ──────────────── בטיחות ונסיעות ────────────────
  item('סל קל + מתאמים', 'Infant carrier + adapters', 'safety_travel', 1, { priority: 'must_have' }),
  item('כיסא בטיחות 0-3', 'Car seat 0-3', 'safety_travel', 2, { priority: 'must_have' }),
  item('מראה לרכב', 'Car mirror', 'safety_travel', 3, {
    priority: 'must_have',
    store_links: [{ label: 'Amazon', url: 'https://www.amazon.co.il/s?k=baby+car+mirror' }],
  }),
  item('צלון לרכב', 'Car sunshade', 'safety_travel', 4, { priority: 'nice_to_have' }),
  item('בייבי סנס', 'Baby Sense monitor', 'safety_travel', 5, { priority: 'must_have' }),

  // ──────────────── שינה ────────────────
  item('מוניטור', 'Baby monitor', 'sleep', 1, { priority: 'must_have' }),
  item('מיטחברת / לול', 'Co-sleeper / bassinet', 'sleep', 2, {
    priority: 'must_have',
    notes: 'Cozee / שילב להשאלה',
  }),
  item('מזרון לעריסה', 'Bassinet mattress', 'sleep', 3, { priority: 'must_have' }),
  item('מצעים וסדינים', 'Sheets & linens', 'sleep', 4, { priority: 'must_have' }),
  item('שמיכת קיץ', 'Summer blanket', 'sleep', 5, { priority: 'must_have' }),
  item('שמיכת חורף', 'Winter blanket', 'sleep', 6, { priority: 'nice_to_have' }),
  item('מגן ראש למיטה', 'Head guard for bed', 'sleep', 7, { priority: 'nice_to_have' }),
  item('מנורת הנקה', 'Nursing night light', 'sleep', 8, { priority: 'must_have' }),
  item('מנורת לילה', 'Night light', 'sleep', 9, { priority: 'nice_to_have' }),

  // ──────────────── החתלה ────────────────
  item('שידת החתלה', 'Changing table', 'changing', 1, { priority: 'must_have' }),
  item('משטח החתלה', 'Changing mat', 'changing', 2, { priority: 'must_have' }),
  item('משטחי החתלה רב פעמי', 'Reusable changing pads', 'changing', 3, { priority: 'must_have' }),
  item('משטחי החתלה חד פעמי', 'Disposable changing pads', 'changing', 4, { priority: 'must_have' }),
  item('סל כביסה', 'Laundry basket', 'changing', 5, { priority: 'must_have' }),
  item('נחשוש', 'Diaper pail / hamper', 'changing', 6, { priority: 'nice_to_have' }),
  item('סלסלות ארגוניות לשידה', 'Organizer baskets for table', 'changing', 7, { priority: 'nice_to_have' }),

  // ──────────────── חיתולים ────────────────
  item('חיתולים ניובורן', 'Newborn diapers', 'diapers', 1, { priority: 'must_have' }),
  item('חיתולי טטרה', 'Muslin / tetra diapers', 'diapers', 2, { priority: 'must_have' }),
  item('קרם לטוסיק', 'Diaper rash cream', 'diapers', 3, { priority: 'must_have' }),

  // ──────────────── אמבטיה ────────────────
  item('אמבטיה + מעמד', 'Baby bath + stand', 'bath', 1, {
    priority: 'must_have',
    notes: 'מדניאל להשאלה',
    acquisition_types: ['borrow'],
    borrow_from: 'דניאל',
  }),
  item('מושב לאמבטיה (דפני)', 'Bath seat (Daphne)', 'bath', 2, {
    priority: 'nice_to_have',
    acquisition_types: ['borrow'],
    borrow_from: 'דניאל',
  }),
  item('מגבות x2', 'Hooded towels x2', 'bath', 3, { priority: 'must_have' }),
  item('מד טמפרטורה לאמבטיה', 'Bath thermometer', 'bath', 4, { priority: 'must_have' }),
  item('מחמם מגבונים', 'Wipe warmer', 'bath', 5, { priority: 'nice_to_have' }),

  // ──────────────── טיפול והיגיינה ────────────────
  item('סבון לתינוק', 'Baby soap', 'care_hygiene', 1, { priority: 'must_have' }),
  item('שמן רחצה', 'Bath oil (Balneum / Emol)', 'care_hygiene', 2, { priority: 'must_have' }),
  item('משחה לתפרחת חיתולים', 'Diaper rash ointment', 'care_hygiene', 3, { priority: 'must_have' }),
  item('קרם לחות לתינוק', 'Baby moisturizer', 'care_hygiene', 4, { priority: 'must_have' }),
  item('מדחום דיגיטלי גמיש', 'Digital flexible thermometer', 'care_hygiene', 5, { priority: 'must_have' }),
  item('מגבונים לחים', 'Wet wipes', 'care_hygiene', 6, { priority: 'must_have' }),
  item('מסרק/מברשת שיער', 'Baby hair brush', 'care_hygiene', 7, { priority: 'must_have' }),
  item('מספריים לציפורניים', 'Nail clippers / scissors', 'care_hygiene', 8, { priority: 'must_have' }),
  item('ויטמין D', 'Vitamin D drops', 'care_hygiene', 9, { priority: 'must_have' }),
  item('ג\'ל ומרכך כביסה היפואלרגני', 'Hypoallergenic laundry detergent', 'care_hygiene', 10, { priority: 'must_have' }),
  item('אלכוהול 70%', '70% Alcohol', 'care_hygiene', 11, { priority: 'must_have' }),
  item('צמר גפן', 'Cotton wool', 'care_hygiene', 12, { priority: 'must_have' }),
  item('נובימול טיפות ונרות', 'Novimol drops & suppositories', 'care_hygiene', 13, { priority: 'must_have' }),

  // ──────────────── האכלה ────────────────
  item('בקבוקים', 'Bottles', 'feeding', 1, { priority: 'must_have' }),
  item('פטמות לבקבוקים', 'Bottle nipples', 'feeding', 2, { priority: 'must_have' }),
  item('מחלק מנות', 'Formula dispenser', 'feeding', 3, { priority: 'nice_to_have' }),
  item('סטריליזטור', 'Sterilizer', 'feeding', 4, { priority: 'must_have' }),
  item('מתקן ייבוש בקבוקים', 'Bottle drying rack', 'feeding', 5, { priority: 'must_have' }),
  item('סבון לניקוי בקבוקים', 'Bottle washing soap', 'feeding', 6, { priority: 'must_have' }),
  item('שקיות הקפאת חלב', 'Breast milk storage bags', 'feeding', 7, { priority: 'must_have' }),
  item('משאבת הנקה', 'Breast pump', 'feeding', 8, { priority: 'must_have', for_whom: 'mother' }),
  item('כרית הנקה', 'Nursing pillow', 'feeding', 9, { priority: 'must_have', for_whom: 'mother' }),
  item('סיליקון שאיבת חלב', 'Silicone breast milk collector', 'feeding', 10, { priority: 'nice_to_have', for_whom: 'mother' }),

  // ──────────────── ביגוד ────────────────
  item('ביגוד ניובורן', 'Newborn clothing set', 'clothing', 1, { priority: 'must_have' }),
  item('טטרות במבו קטנות x12', 'Small bamboo muslin cloths x12', 'clothing', 2, { priority: 'must_have' }),
  item('טטרות במבו גדולות x4', 'Large bamboo muslin cloths x4', 'clothing', 3, { priority: 'must_have' }),

  // ──────────────── צעצועים ופעילות ────────────────
  item('טרמפולינה בייבי ביורן', 'Baby Bjorn Bouncer', 'toys_activities', 1, { priority: 'must_have' }),
  item('מוצצים', 'Pacifiers', 'toys_activities', 2, { priority: 'must_have' }),
  item('קופסה למוצץ', 'Pacifier box', 'toys_activities', 3, { priority: 'must_have' }),
  item('שרשרת למוצץ', 'Pacifier clip', 'toys_activities', 4, { priority: 'must_have' }),
  item('שרשרת לנישנוש', 'Teething chain', 'toys_activities', 5, { priority: 'nice_to_have' }),
  item('משטח פעילות מתקפל', 'Foldable activity mat', 'toys_activities', 6, { priority: 'must_have' }),
  item('אוניברסיטה', 'Baby gym / activity arch', 'toys_activities', 7, { priority: 'must_have' }),
  item('מובייל', 'Mobile', 'toys_activities', 8, {
    priority: 'nice_to_have',
    notes: 'להשאיל מטל - מובייל קטן',
    acquisition_types: ['borrow'],
    borrow_from: 'טל',
  }),
  item('פוף', 'Pouf / floor cushion', 'toys_activities', 9, { priority: 'nice_to_have' }),
  item('מנשא', 'Baby carrier / wrap', 'toys_activities', 10, { priority: 'must_have' }),
  item('כיסא הנקה', 'Nursing chair / glider', 'toys_activities', 11, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('ניענוע / צעצועי מנשנש', 'Teether / rattle toys', 'toys_activities', 12, { priority: 'nice_to_have' }),
  item('צעצועי התפתחות', 'Development toys', 'toys_activities', 13, { priority: 'nice_to_have' }),

  // ──────────────── תיק לידה ────────────────
  item('תעודת זהות ותיק רפואי', 'ID & medical documents', 'hospital_bag', 1, { priority: 'must_have', for_whom: 'mother' }),
  item('תכנית לידה', 'Birth plan', 'hospital_bag', 2, { priority: 'must_have', for_whom: 'mother' }),
  item('שמן שקדים', 'Almond oil', 'hospital_bag', 3, { priority: 'must_have', for_whom: 'mother' }),
  item('כדור טניס', 'Tennis ball (for massage)', 'hospital_bag', 4, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('כרית הנקה לבית חולים', 'Nursing pillow (hospital)', 'hospital_bag', 5, { priority: 'must_have', for_whom: 'mother' }),
  item('בגדים נוחים ושמיכה לאמא', 'Comfortable clothes & blanket for mom', 'hospital_bag', 6, { priority: 'must_have', for_whom: 'mother' }),
  item('תחתוני קוטקס', 'Disposable underwear (Kotex)', 'hospital_bag', 7, { priority: 'must_have', for_whom: 'mother' }),
  item('פדים לאחרי לידה', 'Postpartum pads', 'hospital_bag', 8, { priority: 'must_have', for_whom: 'mother' }),
  item('ספריי לתפרים', 'Perineal spray', 'hospital_bag', 9, { priority: 'must_have', for_whom: 'mother' }),
  item('משחה לפטמות', 'Nipple cream (Lansinoh)', 'hospital_bag', 10, { priority: 'must_have', for_whom: 'mother' }),
  item('מגן פטמה', 'Nipple shield', 'hospital_bag', 11, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('רפידות הנקה', 'Nursing pads', 'hospital_bag', 12, { priority: 'must_have', for_whom: 'mother' }),
  item('חזיות הנקה', 'Nursing bras', 'hospital_bag', 13, { priority: 'must_have', for_whom: 'mother' }),
  item('רמקול למוזיקה', 'Bluetooth speaker', 'hospital_bag', 14, { priority: 'nice_to_have', for_whom: 'both' }),
  item('אוזניות', 'Headphones', 'hospital_bag', 15, { priority: 'nice_to_have', for_whom: 'both' }),
  item('מטען לטלפון', 'Phone charger', 'hospital_bag', 16, { priority: 'must_have', for_whom: 'both' }),
  item('נשנושים ושתייה', 'Snacks & drinks', 'hospital_bag', 17, { priority: 'must_have', for_whom: 'both' }),
  item('שפתון', 'Lip balm', 'hospital_bag', 18, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('מברשת ומשחת שיניים', 'Toothbrush & toothpaste', 'hospital_bag', 19, { priority: 'must_have', for_whom: 'both' }),
  item('בגדים לתינוק + כובע', 'Baby clothes + hat', 'hospital_bag', 20, { priority: 'must_have', for_whom: 'baby' }),
  item('שמיכה לתינוק', 'Baby blanket', 'hospital_bag', 21, { priority: 'must_have', for_whom: 'baby' }),
  item('סלקל', 'Infant carrier (for going home)', 'hospital_bag', 22, { priority: 'must_have', for_whom: 'baby' }),
  item('משפטים מחזקים ותמונות', 'Affirmations & photos', 'hospital_bag', 23, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('כיסוי עיניים', 'Eye mask', 'hospital_bag', 24, { priority: 'nice_to_have', for_whom: 'mother' }),
  item('נעלי בית', 'Slippers', 'hospital_bag', 25, { priority: 'must_have', for_whom: 'mother' }),
  item('מגבות', 'Towels', 'hospital_bag', 26, { priority: 'must_have', for_whom: 'both' }),
]
