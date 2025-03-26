import db from 'mongoose';
import BookModel from './book.js';

const AuthorSchema = new db.Schema({
  name: {
    required: true,
    type: String
  }
});

// Callback based handler (no need to comment)
AuthorSchema.pre('remove', next => {
  BookModel.find({
    author: this.id
  }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('Remove all books before the author'));
    } else {
      next();
    }
  });
});

// Promises based handler (async-await)
AuthorSchema.pre('remove', async next => {
  try {
    await BookModel.find({
      author: this.id
    }, (err, books) => {
      if (err) throw err;
      if (books.length > 0)
        throw new Error('Remove all books before the author');
    });
    next();
  } catch (err) {
    next(err);
  }
});

export default db.model('Author', AuthorSchema);
