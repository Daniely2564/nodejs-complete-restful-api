# Complete Guide to Node.js Restful API

- [Complete Guide to Node.js Restful API](#complete-guide-to-nodejs-restful-api)
  - [Working with MongoDB](#working-with-mongodb)
    - [How to download](#how-to-download)
    - [Creating a schema](#creating-a-schema)
    - [Creating a model](#creating-a-model)
    - [Working with documents](#working-with-documents)
      - [Comparison Query Operators](#comparison-query-operators)
      - [Logical Query Operator](#logical-query-operator)
      - [Using Regular Expression](#using-regular-expression)
      - [Counting](#counting)
      - [Pagination](#pagination)
    - [Importing a json file to mongodb](#importing-a-json-file-to-mongodb)

## Working with MongoDB

### How to download
Go to the [mongodb.com](mongodb.com) and download community server according to your os. If window set up the path through the environment variables.

Download mongodb compass on your preference.

The mongodb will complain when you command `mongod`. Mongodb expects a folder `c:\data\db`. Create it using file explorer or using the command `md c:\data\db`

### Creating a schema

Example: 
```js
const courseSchema = new Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});
```

- Types you can give
  - String
  - Number
  - Date
  - Buffer
  - Boolean
  - ObjectID (mongoose.Types.ObjectId)
  - Array 

### Creating a model
```js
const Course = model("Course", courseSchema);
```
### Working with documents

__save()__ : saves a document. It returns a promise

```js
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
```

__find()__ : query documents based on the provided filter. Can be an empty object.
For more information : [https://mongoosejs.com/docs/api/query.html](https://mongoosejs.com/docs/api/query.html)
```js
async function getCourses(filter = {}) {
  const courses = await Course.find(filter);
}
```

```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ author: "Daniel", isPublished: false })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
}
```

__find()__ : finds based on the given query
__limit()__ : limit number of documents returned
__sort()__ : sort it based on the given query
__select()__ : only query for the values we asked 

#### Comparison Query Operators
- eq : equal
- ne : not equal
- gt : greater than
- gte : greater than or equal to
- lt : less than
- lte : less than or equal to
- in : in
- nin : not in

```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ price: { $gte: 10, $lte: 5 }})
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ price: { $in: [5, 10, 15] }})
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

#### Logical Query Operator
- or
- and

**OR**
```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find()
    .or([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

**AND**
```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find()
    .and([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

#### Using Regular Expression
```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ author: /pattern/})
    .or([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

Example, starts with Dan

```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ author: /^Dan/i})
    .or([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

Contains __ani__
```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ author: /.*ani.*/i})
    .or([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

#### Counting
__count()__ : returns a number of documents based on the given query
```js
async function getCourses(filter = {}) {
  const courses = await Course
    .find({ author: /.*ani.*/i})
    .or([{ author: 'Daniel'},{ isPublished: true}])
    .limit(10)
    .sort({ name: 1 })
    .count();

  console.log(courses);
}
```

#### Pagination
__skip()__ : allows us to skip number of documents we query

```js
async function getCourses(filter = {}) {
  const pageNumber = 2;
  const pageSize = 5;

  const courses = await Course
    .find()
    .skip((pageNumber-1) * pageSize)
    .limit(pageSize);
}
```

### Importing a json file to mongodb

> mongoimport --db \<database name\> --collection \<collection name\> --file \<json file to import\>