export const SEQUENCE_LENGTH = 60;
export const VECTOR_DIM = 300;

export const PAD_TAG_INDEX = 0;
export const TAG_START_INDEX = 1;

export const TAG_LIST = [
  "NN",
  "NR",
  "PPER",
  "PINT",
  "PDEM",
  "DPER",
  "DINT",
  "DDEM",
  "PDT",
  "REFX",
  "VV",
  "VA",
  "AUX",
  "JJA",
  "JJV",
  "ADV",
  "NEG",
  "PAR",
  "CL",
  "CD",
  "OD",
  "FXN",
  "FXG",
  "FXAV",
  "FXAJ",
  "COMP",
  "CNJ",
  "P",
  "IJ",
  "PU",
  "FWN",
  "FWV",
  "FWA",
  "FWX"
];

export const TAG_INDEXER = {
  "<PAD>": 0,
  ADV: 16,
  AUX: 13,
  CD: 20,
  CL: 19,
  CNJ: 27,
  COMP: 26,
  DDEM: 8,
  DINT: 7,
  DPER: 6,
  FWA: 33,
  FWN: 31,
  FWV: 32,
  FWX: 34,
  FXAJ: 25,
  FXAV: 24,
  FXG: 23,
  FXN: 22,
  IJ: 29,
  JJA: 14,
  JJV: 15,
  NEG: 17,
  NN: 1,
  NR: 2,
  OD: 21,
  P: 28,
  PAR: 18,
  PDEM: 5,
  PDT: 9,
  PINT: 4,
  PPER: 3,
  PU: 30,
  REFX: 10,
  VA: 12,
  VV: 11
};

export const NUM_TAGS = TAG_LIST.length + 1;
export const NUM_WORD = 55710;
