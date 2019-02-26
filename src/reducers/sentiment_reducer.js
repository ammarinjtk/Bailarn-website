import { MOCK_DATA, SENTIMENT } from "../action/index";

export default function(state = {}, action) {
console.log(action);
  switch (action.type){
    case SENTIMENT:
      if(action.payload.request.status){
          if (action.payload.request.status === 200) return { status: "OK", data: action.payload.data };
          else if (action.payload.request.status === 400) return { status: "ERROR", data: "Sorry, The text from this URL cannot be retrieved." };
          else return { status: "ERROR", data: action.payload.request.statusText };
        }
        return { status: "LOADING", data: "Loading" };
    case MOCK_DATA:
      return { status: "OK", data: { positive: 0.5, neutral: 0.22, negative: 0.28 } };
    default:
      return {}

  }
  
}
