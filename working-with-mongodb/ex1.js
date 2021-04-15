const mongoose = require("mongoose");

const Course = require("./models/courseModel");

mongoose
  .connect("mongodb://localhost/db-exercise", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((suc) => {
    console.log(`DB Connected`);
  })
  .catch((err) => {
    console.log(err);
  });

async function getCourses() {
  const courses = await Course.find({
    tags: /backend/i,
    isPublished: true,
  })
    .select({ name: 1, author: 1, price: 1 })
    .sort({ name: 1 });
  console.log(courses);
}

getCourses();
