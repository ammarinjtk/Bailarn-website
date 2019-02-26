import { CATEGORIZE } from "../action/index";

export default function(state = {},action) {
  switch (action.type) {
    case CATEGORIZE:
      console.log(action);
      if (action.payload.request.status) {
        if (action.payload.request.status === 200) return { status: "OK", data: action.payload.data };
        else if (action.payload.request.status === 400) return { status: "ERROR", data: "Sorry, The text from this URL cannot be retrieved." };
          else return{ status: "ERROR", data: action.payload.request.statusText };
      }
      return { status: "LOADING", data: "Loading" };
    default:
      return {};
  }
}
