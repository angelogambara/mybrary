import { Router } from 'express';
const router = Router();

import AuthorModel from '../models/author.js';
import BookModel from '../models/book.js';

router.get('/', async (req, res) => {
  try {
    const q = {};

    if (req.query.s) {
      q.name = new RegExp(req.query.s, 'i');
    }

    const authorsByName =
      await AuthorModel.find(q).sort({ name: 1 });

    res.render('authors', {
      authorsByName: authorsByName,
      query: req.query,
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const author = await new AuthorModel({
      name: req.body.name
    }).save();

    res.redirect('/authors/' + author.id);
  } catch {
    res.redirect('/authors/new');
  }
});

router.get('/new', async (req, res) => {
  try {
    res.render('authors/new', {
      author: new AuthorModel()
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    res.render('authors/edit', {
      author: await AuthorModel.findById(req.params.id)
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const authorBooksByTitle = await BookModel.find({
      author: req.params.id
    }).sort({ title: 1 });

    res.render('authors/view', {
      author: await AuthorModel.findById(req.params.id),
      authorBooksByTitle: authorBooksByTitle
    });
  } catch {
    res.send('500 Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  let author;

  try {
    author = await AuthorModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name
    });

    res.redirect('/authors/' + author.id);
  } catch {
    res.redirect('/authors/' + author.id + 'edit');
  }
});

router.delete('/:id', async (req, res) => {
  let author;

  try {
    author = await AuthorModel.findByIdAndDelete(req.params.id);

    res.redirect('/authors');
  } catch {
    res.redirect('/authors/' + author.id);
  }
});

export default router;
