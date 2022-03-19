import { TOGGLE_COLLAPSED } from "../constant";

export const collapsedAction = (data) => {
  return {type: TOGGLE_COLLAPSED, data};
}