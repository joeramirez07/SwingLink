const Group = require("../models/group");
const User = require("../models/user");

async function createGroup(req, res) {
  try {
    const group = await Group.create({
      teamName: req.body.teamName,
      creator: req.user._id,
      members: [req.user._id],
    });

    await group.populate("members", "name email");
    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating group" });
  }
}

async function getUserGroups(req, res) {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate("members", "name email phoneNumber");

    res.json(groups);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error fetching groups" });
  }
}

async function joinGroup(req, res) {
  try {
    const { inviteCode } = req.body;

    const invitingUser = await User.findOne({
      inviteCode: inviteCode.toUpperCase(),
    });
    if (!invitingUser) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const group = await Group.findOne({ members: invitingUser._id });
    if (!group) {
      return res.status(404).json({ message: "No group found for this user" });
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    await group.populate("members", "name email");
    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error joining group" });
  }
}

async function getGroupDetails(req, res) {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email phoneNumber")
      .populate("outings.createdBy", "name")
      .populate("outings.players.userId", "name");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.some((member) => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    res.json(group);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error fetching group details" });
  }
}

async function createOuting(req, res) {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error creating outing" });
  }
}
async function rsvpToOuting(req, res) {
  try {
    const { groupId, outingId } = req.params;
    const { rsvpStatus } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const outing = group.outings.id(outingId);
    if (!outing) {
      return res.status(404).json({ message: "Outing not found" });
    }

    const playerRsvp = outing.players.find((player) =>
      player.userId.equals(req.user._id),
    );

    if (playerRsvp) {
      playerRsvp.rsvpStatus = rsvpStatus;
      await group.save();
      res.json({ message: "RSVP updated successfully", outing });
    } else {
      res.status(404).json({ message: "You are not invited to this outing" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Error updating RSVP" });
  }
}

module.exports = {
  createGroup,
  getUserGroups,
  joinGroup,
  getGroupDetails,
  createOuting,
  rsvpToOuting,
};
