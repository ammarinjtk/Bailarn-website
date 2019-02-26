import { combineReducers } from "redux";
import TokenWordReducer from "./tokenized_word_reducer";
import VectorizeWordReducer from "./vectorize_word_reducer";
import NameEntityReducer from "./name_entity_recognizer_reducer";
import POSReducer from "./part_of_speech_reducer";
import keywordExpansionReducer from "./keyword_expansion_reducer";
import SentimentReducer from "./sentiment_reducer";
import TextClassReducer from "./text_classifier_reducer";

const rootReducer = combineReducers({
  wordList: TokenWordReducer,
  similarMatrix: VectorizeWordReducer,
  nerTagList: NameEntityReducer,
  posTagList: POSReducer,
  expandedWord: keywordExpansionReducer,
  sentimentValue: SentimentReducer,
  textClasses: TextClassReducer
});

export default rootReducer;
