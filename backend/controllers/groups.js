const Group = require("../models/group");
const User = require("../models/user");

async function createGroup(req, res) {
  try {
    function generateInviteCode() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

    let inviteLink;
    let existingGroup;
    do {
      inviteLink = generateInviteCode();
      existingGroup = await Group.findOne({ inviteLink });
    } while (existingGroup);

    const group = await Group.create({
      teamName: req.body.teamName,
      creator: req.user._id,
      members: [req.user._id],
      inviteLink: inviteLink,
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

async function joinGroupByInviteCode(req, res) {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode || !inviteCode.trim()) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const cleanCode = inviteCode.trim();

    const group = await Group.findOne({
      $or: [
        { inviteLink: cleanCode },
        { inviteLink: cleanCode.toUpperCase() },
        { inviteLink: cleanCode.toLowerCase() },
      ],
    });

    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User already member" });
    }

    group.members.push(req.user._id);
    await group.save();

    await group.populate("members", "name email");
    res.json(group);
  } catch (err) {
    console.error("Join group error:", err);
    res.status(500).json({ message: "Failed to join group" });
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

    const newOuting = {
      courseName: req.body.courseName,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes,
      createdBy: req.user._id,
      players: [
        {
          userId: req.user._id,
          userName: req.user.name,
        },
      ],
    };

    group.outings.push(newOuting);
    await group.save();

    res.status(201).json(group.outings[group.outings.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating outing" });
  }
}

async function rsvpToOuting(req, res) {
  try {
    const { groupId, outingId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You must be a group member to RSVP" });
    }

    const outing = group.outings.id(outingId);
    if (!outing) {
      return res.status(404).json({ message: "Outing not found" });
    }

    let playerRsvp = outing.players.find((player) =>
      player.userId.equals(req.user._id),
    );

    if (playerRsvp) {
      playerRsvp.cancelled = false;
    } else {
      outing.players.push({
        userId: req.user._id,
        userName: req.user.name,
        cancelled: false,
      });
    }

    await group.save();

    // Return the updated outing with populated data
    await group.populate("outings.players.userId", "name email");
    const updatedOuting = group.outings.id(outingId);

    res.json({
      message: "RSVP successful! You're going to this outing.",
      outing: updatedOuting,
    });
  } catch (err) {
    console.error("RSVP error:", err);
    res.status(500).json({ message: "Error updating RSVP" });
  }
}

async function deleteGroup(req, res) {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    res.json(deletedGroup);
  } catch (err) {
    res.status(400).json({ message: "Failed to delete group" });
  }
}

module.exports = {
  createGroup,
  getUserGroups,
  joinGroup,
  getGroupDetails,
  createOuting,
  rsvpToOuting,
  joinGroupByInviteCode,
  deleteGroup,
};
