// Create this file: models/group.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Embedded Outing Schema (lives inside Group)
const outingSchema = new Schema({
  courseName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rsvpStatus: { 
      type: String, 
      enum: ['yes', 'no', 'maybe', 'pending'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

// Main Group Schema
const groupSchema = new Schema({
  teamName: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inviteLink: { type: String, unique: true },
  outings: [outingSchema]  // Embedded outings array
}, { timestamps: true });

// Generate invite link for new groups
groupSchema.pre('save', function(next) {
  if (this.isNew && !this.inviteLink) {
    this.inviteLink = Math.random().toString(36).substring(2, 10).toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Group', groupSchema);
