const mongoose = require("mongoose");
const Course = require("./models/courseModel");

mongoose
  .connect("mongodb://localhost/demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(`Error found ${err.message}`));

async function createCourse({ name, author, tags, isPublished }) {
  const course = new Course({
    name,
    author,
    tags,
    isPublished,
  });

  const result = await course.save();
  console.log(result);
}

async function getCourses(filter = {}) {
  const courses = await Course.find({ author: /pattern/ })
    .or([{ author: "Daniel" }, { isPublished: true }])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}

/* Create some courses */
/*
createCourse({
  name: "React Course",
  author: "Daniel",
  tags: ["react", "frontend"],
  isPublished: true,
});
*/

getCourses({ author: "Daniel" });
