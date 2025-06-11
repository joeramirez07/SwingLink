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
