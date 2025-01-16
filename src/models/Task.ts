import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  text: string;
  completed: boolean;
}

// schema
const TaskSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ITask>("Task", TaskSchema);
