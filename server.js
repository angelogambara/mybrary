import express from 'express';
import db from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';

app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout', 'layouts/main');

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(methodOverride('method'));

import indexRoute from './routes/index.js';
import authorRoute from './routes/author.js';
import bookRoute from './routes/book.js';

app.use('/', indexRoute);
app.use('/authors', authorRoute);
app.use('/books', bookRoute);

db.connect(process.env.DATABASE_URL);
app.listen(process.env.PORT || 8080);
