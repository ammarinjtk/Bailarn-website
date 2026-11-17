"""Export the label lists and character index the models were trained with.

Reads the constants from a checkout of Bailarn-python-library and writes lib/nlp/constants.json,
so the browser encodes and decodes exactly as training did.

    python scripts/export_constants.py ../Bailarn-python-library
"""
import json
import runpy
import sys
from pathlib import Path

lib = Path(sys.argv[1]) / "bailarn"
const = lambda task: runpy.run_path(str(lib / task / "constant.py"))


def char_index(chars, start):
    # Same rule as training: an entry that is a list maps all its characters to one index.
    index, i = {}, start
    for entry in chars:
        for c in entry if isinstance(entry, list) else [entry]:
            index[c] = i
        i += 1
    return index


tok, ner, pos, sen, cat = (const(t) for t in ["tokenizer", "ner", "pos", "sentiment", "categorization"])
thresholds = json.loads((lib / "categorization" / "threshold_selection.json").read_text())

out = {
    "tokenizer": {
        "sequenceLength": tok["SEQUENCE_LENGTH"],
        "charIndex": char_index(tok["CHARACTER_LIST"], tok["CHAR_START_INDEX"]),
        "unknownChar": tok["UNKNOW_CHAR_INDEX"],
        "nonSegmentTag": tok["NON_SEGMENT_TAG_INDEX"],
        "tagStart": tok["TAG_START_INDEX"],
        "tags": tok["TAG_LIST"],
    },
    "ner": {"sequenceLength": 60, "tags": ner["TAG_LIST"]},
    "pos": {"sequenceLength": pos["SEQUENCE_LENGTH"], "tags": [t for t, _ in sorted(pos["TAG_INDEXER"].items(), key=lambda kv: kv[1])]},
    "sentiment": {"sequenceLength": sen["SEQUENCE_LENGTH"], "tags": sen["TAG_LIST"]},
    "topics": {
        "sequenceLength": cat["SEQUENCE_LENGTH"],
        "tags": cat["TAG_LIST"],
        "thresholds": [thresholds[f"class_{i}"] for i in range(len(cat["TAG_LIST"]))],
    },
}
Path("lib/nlp/constants.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
print("wrote lib/nlp/constants.json")
