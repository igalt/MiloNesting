/**
 * Search aliases per item (name_he → search terms for Yad2/Marketplace).
 * Each item gets multiple terms because people list things under different names.
 */
export const YAD2_ALIASES: Record<string, string[]> = {
  // ── עגלה והליכות ─────────────────────────────────────────
  'עגלה לעיר': ['עגלה תינוק', 'עגלה עירונית', 'stroller', 'bugaboo', 'uppababy', 'yoyo', 'cybex'],
  'עגלה לשטח': ['עגלה שטח', 'terrain stroller', 'thule', 'mountain buggy'],
  'תיק לעגלה': ['תיק עגלה', 'stroller bag'],
  'סדינים לעגלה': ['סדין עגלה', 'סדינים עגלה'],
  'קשת פעילות לעגלה': ['קשת עגלה', 'activity arch stroller'],
  'שאקל לעגלה': ['שאקל עגלה', 'karabiner stroller'],

  // ── בטיחות ונסיעות ────────────────────────────────────────
  'סל קל + מתאמים': ['סלקל', 'סל קל', 'infant carrier', 'maxi cosi', 'cybex aton', 'besafe izi'],
  'כיסא בטיחות 0-3': ['כיסא בטיחות', 'car seat', 'maxi cosi', 'cybex', 'joie', 'britax', 'be safe'],
  'מראה לרכב': ['מראה רכב תינוק', 'car mirror baby'],
  'בייבי סנס': ['baby sense', 'בייבי סנס', 'מוניטור נשימה'],

  // ── שינה ──────────────────────────────────────────────────
  'מוניטור': ['מוניטור תינוק', 'baby monitor', 'motorola', 'philips avent monitor', 'nanit'],
  'מיטחברת / לול': ['מיטחברת', 'לול', 'co-sleeper', 'cozee', 'snuzpod', 'chicco next2me', 'מיטת תינוק'],
  'מזרון לעריסה': ['מזרון עריסה', 'bassinet mattress'],
  'מצעים וסדינים': ['סדין תינוק', 'מצע תינוק', 'baby sheets'],
  'מנורת הנקה': ['מנורה הנקה', 'nursing light', 'מנורת לילה'],

  // ── החתלה ────────────────────────────────────────────────
  'שידת החתלה': ['שידת חיתולים', 'שידה החתלה', 'changing table', 'changing unit'],
  'משטח החתלה': ['משטח החתלה', 'changing mat', 'changing pad'],
  'סל כביסה': ['סל כביסה', 'laundry basket'],
  'נחשוש': ['נחשוש', 'diaper pail', 'sangenic', 'tommee tippee', 'פח חיתולים'],

  // ── אמבטיה ───────────────────────────────────────────────
  'אמבטיה + מעמד': ['אמבטיה תינוק', 'baby bath', 'מעמד אמבטיה', 'bath stand'],
  'מושב לאמבטיה (דפני)': ['מושב אמבטיה', 'daphne', 'bath seat baby', 'כסא אמבטיה'],
  'מחמם מגבונים': ['מחמם מגבונים', 'wipe warmer', 'מחמם מגבון'],

  // ── האכלה ────────────────────────────────────────────────
  'בקבוקים': ['בקבוק תינוק', 'baby bottle', 'dr brown', 'avent bottle', 'nuk bottle'],
  'סטריליזטור': ['סטריליזטור', 'עיקור בקבוקים', 'sterilizer', 'philips avent sterilizer'],
  'מתקן ייבוש בקבוקים': ['מייבש בקבוקים', 'bottle dryer', 'מתקן ייבוש'],
  'משאבת הנקה': ['משאבת הנקה', 'breast pump', 'medela', 'spectra', 'elvie', 'willow'],
  'כרית הנקה': ['כרית הנקה', 'nursing pillow', 'my brest friend', 'boppy'],
  'שקיות הקפאת חלב': ['שקיות חלב', 'breast milk bags', 'שקיות הנקה'],

  // ── צעצועים ופעילות ────────────────────────────────────────
  'טרמפולינה בייבי ביורן': ['בייבי ביורן', 'baby bjorn bouncer', 'טרמפולינה תינוק', 'bouncer', 'כיסא קפיץ'],
  'משטח פעילות מתקפל': ['משטח פעילות', 'activity mat', 'פלייגים', 'play gym', 'playgym'],
  'אוניברסיטה': ['אוניברסיטה תינוק', 'baby gym', 'קשת פעילות', 'activity arch'],
  'מובייל': ['מובייל תינוק', 'mobile baby', 'מובייל מיטה'],
  'מנשא': ['מנשא תינוק', 'baby carrier', 'ergo baby', 'ergobaby', 'boba', 'manduca', 'tula', 'כנגורו'],
  'כיסא הנקה': ['כיסא הנקה', 'nursing chair', 'glider', 'פוף הנקה'],
  'פוף': ['פוף תינוק', 'floor cushion', 'פוף ישיבה'],

  // ── ביגוד ──────────────────────────────────────────────────
  'ביגוד ניובורן': ['בגדי תינוק', 'newborn clothes', 'ביגוד יילוד', 'בגדי יילוד', 'חבילת לידה'],
}

/** Returns search terms for a given item (falls back to name_he + name_en) */
export function getSearchTerms(name_he: string, name_en?: string | null): string[] {
  const aliases = YAD2_ALIASES[name_he]
  if (aliases) return aliases
  // fallback: use the names themselves
  const terms = [name_he]
  if (name_en) terms.push(name_en)
  return terms
}
