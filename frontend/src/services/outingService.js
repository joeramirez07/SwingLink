import sendRequest from "./sendRequest";
const BASE_URL = "/api/outings";

export function createOuting(groupId, data) {
  return sendRequest(`${BASE_URL}/${groupId}`, "POST", data);
}
