import { EXPAND } from "../action/index";

export default function(state = {}, action) {
  console.log(action)
  switch (action.type) {
    case EXPAND:
      console.log(action);
        if(action.payload.request.status){
          if (action.payload.request.status === 200) return { status: "OK", data: action.payload.data };
          else return { status: "ERROR", data: action.payload.request.statusText };
        }
        return { status: "LOADING", data: "Loading" };
    default:
        return {}
  }

}
