import mongoose from 'mongoose';
import crypto from 'crypto';

function hashPassword(password, salt) {
  return crypto.scryptSync(String(password), salt, 64).toString('hex');
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ['admin', 'staff'],
      default: 'staff',
    },

    passwordHash: {
      type: String,
      required: true,
    },

    passwordSalt: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function setPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  this.passwordSalt = salt;
  this.passwordHash = passwordHash;
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  const passwordHash = hashPassword(password, this.passwordSalt);
  return passwordHash === this.passwordHash;
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    _id: this._id.toString(),
    name: this.name,
    username: this.username,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
