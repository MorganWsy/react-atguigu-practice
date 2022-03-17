import { SAVE_USERINFO } from "../constant";

const initialState = [];
export default function loginReducer (previousState=initialState,action){
  // data应该是包含username和password属性的对象
  const {type,data} = action;
  switch(type){
    case SAVE_USERINFO:
      return [...previousState, data];
    default:
      return previousState;
  }
}