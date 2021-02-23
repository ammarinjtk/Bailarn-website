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

export const TAG_DESCRIPTIONS = {
    X: null,
    DTM_B: "[Beginning] Date/Time",
    DTM_I: "[Inside] Date/Time",
    DES_B: "[Beginning] Designation",
    DES_I: "[Inside] Designation",
    TTL_B: "[Beginning] Title",
    TTL_I: "[Inside] Title",
    BRN_B: "[Beginning] Brand",
    BRN_I: "[Inside] Brand",
    PER_B: "[Beginning] Person name",
    PER_I: "[Inside] Person name",
    MEA_B: "[Beginning] Measurement",
    MEA_I: "[Inside] Measurement",
    NUM_B: "[Beginning] Number",
    NUM_I: "[Inside] Number",
    LOC_B: "[Beginning] Location",
    LOC_I: "[Inside] Location",
    TRM_B: "[Beginning] Terminology",
    TRM_I: "[Inside] Terminology",
    ORG_B: "[Beginning] Organization",
    ORG_I: "[Inside] Organization",
    ABB_ORG_B: "[Beginning] Abbreviation of Organization",
    ABB_ORG_I: "[Inside] Abbreviation of Organization",
    ABB_LOC_B: "[Beginning] Abbreviation of Location",
    ABB_LOC_I: "[Inside] Abbreviation of Location",
    ABB_DES_B: "[Beginning] Abbreviation of Designation",
    ABB_DES_I: "[Inside] Abbreviation of Designation",
    ABB_PER_B: "[Beginning] Abbreviation of Person name",
    ABB_PER_I: "[Inside] Abbreviation of Person name",
    ABB_TTL_B: "[Beginning] Abbreviation of Title",
    ABB_TTL_I: "[Inside] Abbreviation of Title",
    ABB_B: "[Beginning] Abbreviation",
    ABB_I: "[Inside] Abbreviation",
    ABB: null,
    DDEM: null,
    NAME_B: null,
    __: null,
    O: null,
    UNK: null,
};


export const NUM_TAGS = TAG_LIST.length;
