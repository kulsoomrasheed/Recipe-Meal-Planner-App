import mongoose from 'mongoose'  

const userSchema = mongoose.Schema(
  {
    _id: { unique: true, type: String },
    email: { required: true, unique: true, type: String },
    name: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
