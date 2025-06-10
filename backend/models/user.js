const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    phoneNumber: {
      // NEW: For SMS notifications
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    inviteCode: {
      // NEW: For joining golf groups
      type: String,
      unique: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
    // Remove password when doc is sent across network
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

// Generate invite code for new users
userSchema.pre("save", async function (next) {
  // Generate unique invite code for new users
  if (this.isNew && !this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Hash password if modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

module.exports = mongoose.model("User", userSchema);
