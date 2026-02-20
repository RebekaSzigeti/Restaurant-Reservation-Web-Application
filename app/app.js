import express from 'express';
import morgan from 'morgan';
import vendegloRoutes from './routes/vendeglo.js';
import vendegloDetailRoutes from './routes/vendegloReszletek.route.js';
import path from 'path';
import foglalasRoutes from './routes/foglalas.route.js';
import fenykepRoutes from './routes/fenykep.route.js';
import errorMiddleware from './middleware/error.middleware.js';
import loginRoutes from './routes/login.route.js';
import session from 'express-session';

const app = express();

app.use(
  session({
    secret: '142e6ecf42884f03',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 ora
    },
  }),
);

app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(morgan('tiny'));

app.use('/', vendegloRoutes);
app.use('/', vendegloDetailRoutes);
app.use('/', foglalasRoutes);
app.use('/', fenykepRoutes);
app.use('/', loginRoutes);

app.use(errorMiddleware);

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080');
});
