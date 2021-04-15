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
    - [Updating Documents](#updating-documents)
    - [Removing Documents](#removing-documents)
  - [MongoDB Data Validation](#mongodb-data-validation)

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

> mongoimport --db \<database name\> --collection \<collection name\> --file \<json file to import\> --jsonArray

Add __--jsonArray__ if your json file is an array.

**Tip** : From Version 4.4, (not sure about the next versions) mongodb will not download the tools automatically such as mongoimport and mongoexport. You have to download separately from the link [https://www.mongodb.com/try/download/database-tools](https://www.mongodb.com/try/download/database-tools) and extract it in the bin folder.

### Updating Documents

We have two ways to update documents.
1. Query first and modify the properties and **save()**

```js
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

```

2. Update directly. The updated document is then returned.
   - [db.collection.updateOne(\<filter\>, \<update\>, \<options\>)](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne)
     - The following example uses the db.collection.updateOne() method on the inventory collection to update the first document where item equals "paper":
     ```js
        db.inventory.updateOne(
          { item: "paper" },
          {
            $set: { "size.uom": "cm", status: "P" },
            $currentDate: { lastModified: true }
          }
        )
      ```
   - [db.collection.updateMany(\<filter\>, \<update\>, \<options\>)](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)
     - uses the \$set operator to update the value of the size.uom field to "cm" and the value of the status field to "P",
     - uses the \$currentDate operator to update the value of the lastModified field to the current date. If lastModified field does not exist, \$currentDate will create the field.
     ```js
      db.inventory.updateMany(
         { "qty": { $lt: 50 } },
         {
           $set: { "size.uom": "in", status: "P" },
           $currentDate: { lastModified: true }
         }
      )
     ```
   - [db.collection.replaceOne(\<filter\>, \<update\>, \<options\>)](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#mongodb-method-db.collection.replaceOne)
      - uses the \$set operator to update the value of the size.uom field to "in" and the value of the status field to "P",
      - uses the \$currentDate operator to update the value of the lastModified field to the current date. If lastModified field does not exist, \$currentDate will create the field.

|Name|Description|
|---|---|
|\$currentDate|Sets the value of a field to current date, either as a Date or a Timestamp.|
|\$inc|Increments the value of the field by the specified amount.|
|\$min|Only updates the field if the specified value is less than the existing field value.|
|\$max|Only updates the field if the specified value is greater than the existing field value.|
|\$mul|Multiplies the value of the field by the specified amount.
|\$rename|Renames a field.|
|\$set|Sets the value of a field in a document.|
|\$setOnInsert|Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents.|
|\$unset|Removes the specified field from a document.|

Example:
```js
db.products.update(
   { sku: "abc123" },
   { $inc: { quantity: -2, "metrics.orders": 1 } }
)
```


Interestingly, it returns the number of updated documents as a return value.
```sh
{ n: 1, nModified: 1, ok: 1 }
```

### Removing Documents

Removing a document or documents is very similar to the update. We can also deleteOne, deleteMany, findByIdAndDelete, or findByIdAndRemove.

Difference between findOneAndDelete vs findOneAndRemove.

> This function differs slightly from Model.findOneAndRemove() in that findOneAndRemove() becomes a MongoDB findAndModify() command, as opposed to a findOneAndDelete() command. For most mongoose use cases, this distinction is purely pedantic. You should use findOneAndDelete() unless you have a good reason not to.

Source : https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo

## MongoDB Data Validation

Unless we set up `required` property to true in the schema, MongoDB won't care if we have the data or not.
So we will change our schema as follow:
```js
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
```