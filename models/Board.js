import mongoose from "mongoose";

// - Mongoose requires a Schema to structure data and a Model to interact with the database
// - Schema is a blueprint for the data structure, defining the fields and their types
// - Each field in the Schema can have a type like `String`, `Number`, `Date`, `Boolean`, `Array`, `ObjectId`, etc.
// - Options like `type`, `required`, `trim`, `lowercase`, `minlength`, and `default` can be 
// used to control and validate data - Fields can also have a `ref` property to reference another Model

const boardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    default: "a board",
  },
});

// if board exists, create board. if it does not, create new model
// Models allow you to create, delete, and update collections in the database
// `Board.find()`, `Board.update()`, `Board.delete()` are examples of operations you can perform
// Models are exported for use in other files
export default mongoose.models.Board || mongoose.model("Board", boardSchema)