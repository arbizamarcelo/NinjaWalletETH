import { createStore } from 'redux';

const initialState = {
    error: "",
    password: "",
    appState: "inactive",
    address: [],
    session: "closed",
  };

  const reducerSts = (state = initialState, action) => {
    switch (action.type) {
      case "changePassword":
        return {
          ...state,
          password: action.payload,
        };
      case "setError":
        return {
          ...state,
          error: action.payload,
        };
      case "setAppState":
        return {
            ...state,
            appState: action.payload,
        };
      case "setAddress":
        return {
            ...state,
            address: state.address.concat(action.payload),
        };
      case "setDeleteAddress":
        return {
            ...state,
            address: [],
        };
      case "setDeletePassword":
        return {
            ...state,
            password: "",
        };
      case "setSession":
        return {
            ...state,
            session: action.payload,
        };
      default:
        return state;
    }
  }

  const storeGlobal = createStore(reducerSts);

  const getStore = () => {
    return storeGlobal;
}


  export default getStore;