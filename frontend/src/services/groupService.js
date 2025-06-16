import sendRequest from "./sendRequest";

const BASE_URL = "/api/groups";

export async function getUserGroups() {
  return sendRequest(BASE_URL);
}

export async function createGroup(groupData) {
  return sendRequest(BASE_URL, "POST", groupData);
}

export function joinGroup(inviteCode) {
  return sendRequest("/api/groups/join", "POST", { inviteCode });
}

export async function getGroupDetails(groupId) {
  return sendRequest(`${BASE_URL}/${groupId}`);
}

export async function createOuting(groupId, outingData) {
  return sendRequest(`${BASE_URL}/${groupId}/outings`, "POST", outingData);
}
export async function rsvpToOuting(groupId, outingId) {
  return sendRequest(`/api/groups/${groupId}/outings/${outingId}/rsvp`, "PUT");
}

export function deleteGroup(id) {
  return sendRequest(`${BASE_URL}/${id}`, "DELETE");
}
