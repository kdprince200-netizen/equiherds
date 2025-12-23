import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  date: { type: Date, required: true },
  images: [{ type: String }]
}, {
  timestamps: true
});

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;


