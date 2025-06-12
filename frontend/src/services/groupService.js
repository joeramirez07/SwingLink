import sendRequest from "./sendRequest";

const BASE_URL = "/api/groups";

export async function getUserGroups() {
  return sendRequest(BASE_URL);
}

export async function createGroup(groupData) {
  return sendRequest(BASE_URL, "POST", groupData);
}

export async function joinGroup(inviteCode) {
  return sendRequest(`${BASE_URL}/join`, "POST", { inviteCode });
}

export async function getGroupDetails(groupId) {
  return sendRequest(`${BASE_URL}/${groupId}`);
}

// Create outing
export async function createOuting(groupId, outingData) {
  return sendRequest(`${BASE_URL}/${groupId}/outings`, "POST", outingData);
}

export async function rsvpToOuting(outingId) {
  return sendRequest(`/api/outings/${outingId}/rsvp`, "POST");
}
