const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

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

groupSchema.pre("save", function (next) {
  if (this.isNew && !this.inviteLink) {
    this.inviteLink = crypto.randomUUID().slice(0, 5);
  }
  next();
});

module.exports = mongoose.model("Group", groupSchema);
