async function create(req, res) {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const outingData = {
      ...req.body,
      createdBy: req.user._id,
      players: [
        {
          userId: req.user._id,
          userName: req.user.name,
          cancelled: false,
        },
      ],
    };

    group.outings.push(outingData);
    await group.save();

    await group.populate("outings.players.userId", "name");

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating outing" });
  }
}

async function addRsvp(req, res) {
  try {
    const group = await Group.findOne({ "outings._id": req.params.outingId });
    if (!group) {
      return res.status(404).json({ message: "Outing not found" });
    }

    const outing = group.outings.id(req.params.outingId);
    if (!outing) {
      return res.status(404).json({ message: "Outing not found" });
    }

    const existingPlayer = outing.players.find((player) =>
      player.userId.equals(req.user._id),
    );
    if (existingPlayer) {
      return res.status(400).json({ message: "Already RSVP'd" });
    }

    outing.players.push({
      userId: req.user._id,
      userName: req.user.name,
      cancelled: false,
    });

    await group.save();

    res.json({ message: "RSVP added", outing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding RSVP" });
  }
}

module.exports = {
  create,
  addRsvp,
};
