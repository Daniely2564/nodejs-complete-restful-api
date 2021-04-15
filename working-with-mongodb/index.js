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
  const courses = await Course.find().limit(10).sort({ name: 1 });

  console.log(courses);
}

async function updateCourseByQueryingFirst(id) {
  let course = await Course.findById(id);
  if (!course) return;

  // Two approaches are identical
  // 1. Using the property
  course.isPublished = false;
  course.author = "Someone Else";

  // 2. Using the set method
  course.set({
    isPublished: true,
    author: "Someone Else",
  });

  const result = await course.save();
  console.log(result);
}

async function updateCourseByUpdate(id) {
  let course = await Course.updateOne(
    { _id: id },
    {
      $inc: {
        price: 33,
      },
    }
  );
  console.log(course);
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

// updateCourseByUpdate("6077c40e9315a02a107d292a");
