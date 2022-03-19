import { TOGGLE_COLLAPSED } from "../constant";

const initialState = {isCollapsed: false};
export default function adminReducer (prevState=initialState, action) {
  const {type,data} = action;
  switch(type){
    case TOGGLE_COLLAPSED:
      // 深度复制，产生一个新对象
      // let newState = {...prevState};
      // newState.isCollapsed = true;
      return data;
    default:
      return prevState;
  }
}