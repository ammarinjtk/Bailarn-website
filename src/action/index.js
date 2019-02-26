import axios from "axios";


const TOKENIZE_WORD = 'TOKENIZE_WORD';
const VECTORIZE_WORD = 'VECTORIZE_WORD'; 
const NER_CONSTANCE = "NER_CONSTANCE";
const POS_CONSTANCE = 'POS_CONSTANCE';
const MOCK_DATA = 'MOCK_DATA';
const SENTIMENT = "SENTIMENT";
const EXPAND = "EXPAND";
const CATEGORIZE = "CATEGORIZE";

export function tokenizeWord(type, text) {
    const url = "/thainlp/tokenize"
    const mapping = { TEXT: "raw_text", URL: "webpage" };
    let data = { type: mapping[type], url: text, text };
    console.log(data)
    const request = axios.post(url,data);
    return { type: TOKENIZE_WORD, payload: request };
}

export function vectorizeWord(word_list){
    const url = "/thainlp/vector_distance";
    let data = { word_list };
    const request = axios.post(url, data);
    return { type: VECTORIZE_WORD, payload: request }
}

export function NER(type, text) {
  
  const url = "/thainlp/ner";
  const mapping = { TEXT: "raw_text", URL: "webpage" };
  let data = { type: mapping[type], url: text, text };
  console.log(data);
  const request = axios.post(url, data);
  
  return { type: NER_CONSTANCE, payload: request };
}

export function POS(type, text) {
  // for testing
  // if (text === "https://www.mockups.com/best") {
  //   return { type: MOCK_DATA };
  // }
  const url = "/thainlp/pos";
  const mapping = { TEXT: "raw_text", URL: "webpage" };
  let data = { type: mapping[type], url: text, text };
  console.log(data);
  const request = axios.post(url, data);
  return { type: POS_CONSTANCE, payload: request };
}

export function sentiment(type, text, model){
  
  const url = "/thainlp/sentiment";
  const mapping = { TEXT: "raw_text", URL: "webpage" };
  let data = { type: mapping[type], url: text, text };
  console.log(data);
  const request = axios.post(url, data);
  return { type: SENTIMENT, payload: request };
}

export function keywordExpand(type, text, model){
  
  const url = "/thainlp/keyword_expansion";
  const mapping = { TEXT: "raw_text", URL: "webpage" };
  let data = { type: mapping[type], url: text, text };
  console.log(data);
  const request = axios.post(url, data);
  return { type: EXPAND, payload: request };
}

export function classify(type, text, model){
  
  const url = "/thainlp/categorization";
  const mapping = { TEXT: "raw_text", URL: "webpage" };
  let data = { type: mapping[type], url: text, text };
  console.log(data);
  const request = axios.post(url, data);
  return { type: CATEGORIZE, payload: request };
}

export {
  TOKENIZE_WORD,
  VECTORIZE_WORD,
  NER_CONSTANCE,
  POS_CONSTANCE,
  MOCK_DATA,
  SENTIMENT,
  EXPAND,
  CATEGORIZE,
};