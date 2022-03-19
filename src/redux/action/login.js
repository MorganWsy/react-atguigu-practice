import {SAVE_USERINFO} from '../constant';

export const createLoginAction = (data) => {
  return {type: SAVE_USERINFO,data};
}
