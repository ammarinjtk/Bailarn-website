// Entity types in the BEST2010 NER scheme. Each tag is a type plus _B (first word) or _I (a following word).
export const ENTITY_TYPES: Record<string, string> = {
  PER: 'Person',
  ORG: 'Organisation',
  LOC: 'Location',
  DTM: 'Date or time',
  DES: 'Designation',
  TTL: 'Title',
  BRN: 'Brand',
  MEA: 'Measurement',
  NUM: 'Number',
  TRM: 'Term',
  ABB_ORG: 'Abbreviated organisation',
  ABB_LOC: 'Abbreviated location',
  ABB_DES: 'Abbreviated designation',
  ABB_PER: 'Abbreviated person',
  ABB_TTL: 'Abbreviated title',
  ABB: 'Abbreviation',
}
