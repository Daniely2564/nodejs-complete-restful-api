const { Schema, model, Types } = require("mongoose");

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = model("Course", courseSchema);

module.exports = Course;
