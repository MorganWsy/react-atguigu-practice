import {SAVE_USERINFO, DELETE_USERINFO} from '../constant';

export const createLoginAction = (data) => {
  if(data['username']){
    return {type: SAVE_USERINFO,data};
  }else{
    return {type: DELETE_USERINFO, data};
  }
}
