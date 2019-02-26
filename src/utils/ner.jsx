export const EMBEDDING_SIZE = 128;
export const WORD_INDEXER_SIZE = 55709;

export const SEQUENCE_LENGTH = 60;

export const SPACEBAR = " ";

export const ESCAPE_WORD_DELIMITER = "\t";
export const ESCAPE_TAG_DELIMITER = "\v";

export const DATA_DIM = 300;

export const TAG_START_INDEX = 0;

export const TAG_LIST = [
  "X",
  "DTM_B",
  "DTM_I",
  "DES_B",
  "DES_I",
  "TTL_B",
  "TTL_I",
  "BRN_B",
  "BRN_I",
  "PER_B",
  "PER_I",
  "MEA_B",
  "MEA_I",
  "NUM_B",
  "NUM_I",
  "LOC_B",
  "LOC_I",
  "TRM_B",
  "TRM_I",
  "ORG_B",
  "ORG_I",
  "ABB_ORG_B",
  "ABB_ORG_I",
  "ABB_LOC_B",
  "ABB_LOC_I",
  "ABB_DES_B",
  "ABB_DES_I",
  "ABB_PER_B",
  "ABB_PER_I",
  "ABB_TTL_B",
  "ABB_TTL_I",
  "ABB_B",
  "ABB_I",
  "ABB",
  "DDEM",
  "NAME_B",
  "__",
  "O",
  "UNK"
];

export const NUM_TAGS = TAG_LIST.length;
