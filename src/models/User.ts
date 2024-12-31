import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

export type UserType = InferSchemaType<typeof UserSchema>;

UserSchema.pre('save', async function(next) {
  if(this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
  }
})

const User = mongoose.model<UserType>("User", UserSchema);
export default User;
