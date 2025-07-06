import mongoose from "mongoose";

const paragraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty: { type: String, required: true },
});

const Paragraph = mongoose.model("Paragraph", paragraphSchema);

export default Paragraph;
