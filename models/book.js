import mongoose from 'mongoose';
import db from 'mongoose';

export default db.model('Book',
  new db.Schema({
    author: {
      required: true,
      type: mongoose.Schema.Types.ObjectId
    },
    title: {
      required: true,
      type: String
    },
    createdDate: {
      default: Date.now,
      required: true,
      type: Date
    },
    updatedDate: {
      default: Date.now,
      required: true,
      type: Date
    },
    publishDate: {
      default: Date.now,
      required: true,
      type: Date
    },
  })
);
