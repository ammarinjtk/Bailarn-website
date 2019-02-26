import { VECTORIZE_WORD } from "../action/index";

export default function(state={}, action){

    switch (action.type) {
      case VECTORIZE_WORD:
        if(action.payload.request.status){
          if (action.payload.request.status === 200) return { status: "OK", data: action.payload.data };
          else return { status: "ERROR", data: action.payload.request.statusText };
        }
        return { status: "LOADING", data: "Loading" };
      default:
        return {};
    }
}