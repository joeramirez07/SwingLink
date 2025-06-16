const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    cancelled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const outingSchema = new Schema(
  {
    courseName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    players: [playerSchema],
  },
  { timestamps: true },
);

const groupSchema = new Schema(
  {
    teamName: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    inviteLink: { type: String, unique: true },
    outings: [outingSchema],
  },
  { timestamps: true },
);

// Generate a more readable invite code
function generateInviteCode() {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // Removed O, 0 for clarity
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

groupSchema.pre("save", async function (next) {
  if (this.isNew && !this.inviteLink) {
    let inviteCode;
    let existing;

    // Ensure uniqueness
    do {
      inviteCode = generateInviteCode();
      existing = await mongoose
        .model("Group")
        .findOne({ inviteLink: inviteCode });
    } while (existing);

    this.inviteLink = inviteCode;
  }
  next();
});

module.exports = mongoose.model("Group", groupSchema);
