require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
const logger = require('./middleware/logger');

const app = express();

// === SECURITY ===
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    }
  }
}));

// Rate limiting
app.use('/admin/login', rateLimit({ windowMs: 15*60*1000, max: 10 }));
app.use('/ppdb/save', rateLimit({ windowMs: 15*60*1000, max: 5 }));

// === MIDDLEWARE ===
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(logger);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24*60*60*1000 }
}));

const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/', 'application/pdf'];
    if (allowed.some(type => file.mimetype.startsWith(type))) cb(null, true);
    else cb(new Error('File tidak didukung!'));
  }
});
app.locals.upload = upload;

// === DATABASE ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });

// === ROUTES ===
app.use('/', require('./routes/mainRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/admin', require('./routes/adminGaleri'));

// === ERROR PAGES ===
app.use((req, res) => res.status(404).render('404', { title: '404' }));
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(500).render('500', { title: '500' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
