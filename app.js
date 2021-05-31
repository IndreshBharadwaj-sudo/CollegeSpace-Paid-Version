if (process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
var favicon = require('serve-favicon')
const mongoose = require('mongoose');
const Course = require('./models/courses');
const Joi = require('joi');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { captureRejectionSymbol } = require('events');
const { courseSchema,materialSchema } = require('./schemas.js');
const Material = require('./models/material');
const coursesRoutes = require('./routes/courses');
const materialsRoutes = require('./routes/materials');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/collegespace';

const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error:"));
db.once("open", () =>
{
    console.log("Database Connected");
})

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session(
      {
        secret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ 
            mongoUrl: dbUrl,
            touchAfter: 24 * 3600
        }),
        
    }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet());

const sessionConfig = {
    name: 'uchimakavasaki',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/nitw/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) =>
{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/courses', coursesRoutes);
app.use('/courses/:id/materials', materialsRoutes);


app.get('/', (req, res) =>
{
    res.render('home');
})


app.all('*', (req, res, next) =>
{
    next(new ExpressError('Page Not Found',404))
})

app.use((err, req, res, next) =>
{
    const { statusCode = 500 } = err;
    if(!err.message) err.message='Oh No,Something Went Wrong!'
    res.status(statusCode).render('error',{err});
})

const port = process.env.PORT || 3000;

app.listen(port, () =>
{
    console.log(`Connected On ${port}`)
})