import { Router } from 'express';
const router = Router();

import AuthorModel from '../models/author.js';
import BookModel from '../models/book.js';

router.get('/', async (req, res) => {
  try {
    const booksByPublishDate = await BookModel.find().sort({
      publishDate: -1, title: 1
    });
    const booksByCreatedDate = await BookModel.find().sort({
      createdDate: -1, title: 1
    });

    // TODO: Filter search params

    if (req.query.s) {
      const regex = new RegExp(req.query.s, 'i');

      booksByPublishDate = booksByPublishDate.regex('title', regex);
      booksByCreatedDate = booksByCreatedDate.regex('title', regex);
    }

    if (req.query.pa) {
      booksByPublishDate = booksByPublishDate.gte('publishDate', req.query.pa);
      booksByCreatedDate = booksByCreatedDate.gte('publishDate', req.query.pa);
    }

    if (req.query.pb) {
      booksByPublishDate = booksByPublishDate.lte('publishDate', req.query.pb);
      booksByCreatedDate = booksByCreatedDate.lte('publishDate', req.query.pb);
    }

    if (req.query.s || req.query.pa || req.query.pb) {
      booksByPublishDate.exec();
      booksByCreatedDate.exec();
    }

    res.render('books', {
      booksByPublishDate: booksByPublishDate,
      booksByCreatedDate: booksByCreatedDate,
      query: req.query
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  let bookEncoded;

  try {
    const book = new BookModel({
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      title: req.body.title
    });

    bookEncoded =
      '?title=' + encodeURIComponent(req.body.title) +
      '&publishDate=' + encodeURIComponent(req.body.publishDate) +
      '&author=' + encodeURIComponent(req.body.author);

    await book.save();

    res.redirect('/books/' + book.id);
  } catch {
    res.redirect('/books/new' + bookEncoded);
  }
});

router.get('/new', async (req, res) => {
  try {
    const authors = await AuthorModel.find({});
    const options = { authors: authors, error: req.query.error };

    if (req.query.error) {
      options.book = new BookModel({
        author: decodeURIComponent(req.query.author),
        publishDate: decodeURIComponent(req.query.publishDate),
        title: decodeURIComponent(req.query.title)
      });
    } else {
      options.book = new BookModel();
    }

    res.render('books/new', options);
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    res.render('books/edit', {
      authors: await AuthorModel.find({}),
      book: await BookModel.findById(req.params.id),
      error: req.query.error
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    res.render('books/view', {
      book: await BookModel.findById(req.params.id)
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  let book;

  try {
    book = await BookModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      publishDate: req.body.publishDate,
      author: req.body.author
    });

    res.redirect('/books/' + book.id);
  } catch {
    res.redirect('/books/' + book.id + '/edit');
  }
});

router.delete('/:id', async (req, res) => {
  let book;

  try {
    book = await BookModel.findByIdAndDelete(req.params.id);

    res.redirect('/books');
  } catch {
    res.redirect('/books/' + book.id);
  }
});

export default router;
