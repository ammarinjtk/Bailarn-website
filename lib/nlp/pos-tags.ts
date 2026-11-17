// The 34 word classes, grouped into families. Descriptions are given only where the tag's meaning is unambiguous;
// the full definitions are in the BEST2010_I2R annotation guideline, which is not part of this repository.
export const POS_FAMILIES: { family: string; tags: [string, string | null][] }[] = [
  { family: 'Nouns', tags: [['NN', 'common noun'], ['NR', 'proper noun']] },
  { family: 'Pronouns', tags: [['PPER', 'personal'], ['PINT', 'interrogative'], ['PDEM', 'demonstrative'], ['REFX', 'reflexive']] },
  { family: 'Determiners', tags: [['DPER', 'personal'], ['DINT', 'interrogative'], ['DDEM', 'demonstrative'], ['PDT', null]] },
  { family: 'Verbs', tags: [['VV', 'verb'], ['VA', null], ['AUX', 'auxiliary']] },
  { family: 'Modifiers', tags: [['JJA', null], ['JJV', null], ['ADV', 'adverb'], ['NEG', 'negator']] },
  { family: 'Numbers and classifiers', tags: [['CD', 'cardinal number'], ['OD', 'ordinal number'], ['CL', 'classifier']] },
  { family: 'Prefixes', tags: [['FXN', 'forms a noun, e.g. ความ, การ'], ['FXG', null], ['FXAV', 'forms an adverb'], ['FXAJ', 'forms an adjective']] },
  { family: 'Function words', tags: [['P', 'preposition'], ['CNJ', 'conjunction'], ['COMP', 'complementiser'], ['PAR', 'particle'], ['IJ', 'interjection'], ['PU', 'punctuation']] },
  { family: 'Foreign words', tags: [['FWN', 'noun'], ['FWV', 'verb'], ['FWA', 'adjective'], ['FWX', 'other']] },
]

export const POS_FAMILY_OF: Record<string, string> = Object.fromEntries(POS_FAMILIES.flatMap((f) => f.tags.map(([t]) => [t, f.family])))
