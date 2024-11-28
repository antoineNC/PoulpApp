import { createEvent, createStore } from "effector";
import { Point } from "@types";

const actionPoint = {
  setPoint: createEvent<Point[]>("GET_SCORE"),
  resetPosts: createEvent("RESET_SCORE"),
  logout: createEvent("LOGOUT"),
};

const defaultPoint: Point[] = [];

const $pointStore = createStore(defaultPoint)
  .on(actionPoint.setPoint, (state, payload) => payload)
  .reset(actionPoint.logout);

export { $pointStore, actionPoint };
