import sendRequest from "./sendRequest";

const BASE_URL = "/api/groups";  // Changed from /api/posts

// Get all user's golf groups
export async function getUserGroups() {
  return sendRequest(BASE_URL);
}

// Create new golf group
export async function createGroup(groupData) {
  return sendRequest(BASE_URL, "POST", groupData);
}

// Join group via invite code
export async function joinGroup(inviteCode) {
  return sendRequest(`${BASE_URL}/join`, "POST", { inviteCode });
}

// Get specific group details with outings
export async function getGroupDetails(groupId) {
  return sendRequest(`${BASE_URL}/${groupId}`);
}

// Create outing in a specific group
export async function createOuting(groupId, outingData) {
  return sendRequest(`${BASE_URL}/${groupId}/outings`, "POST", outingData);
}

// RSVP to an outing
export async function rsvpToOuting(groupId, outingId, rsvpStatus) {
  return sendRequest(`${BASE_URL}/${groupId}/outings/${outingId}/rsvp`, "PUT", { 
    rsvpStatus 
  });
}
