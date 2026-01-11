import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    id: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    userId: String,
    userName: String,
    color: String,
    source: String,
    status: String,
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, unique: true },
    name: String,
    notes: [NoteSchema],
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
