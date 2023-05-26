if (process.env.NODE_ENV !== 'production') {
        require('dotenv').config();
}

console.log(process.env.secret);

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

const passport = require('passport');
const passL = require('passport-local');

const flash = require('connect-flash');
const ExpressError = require('./utils/expressError')
const Camp = require('./models/campground');

const Review = require('./models/review');
const User = require('./models/user')
const helmet = require('helmet');

const userRoutes = require('./routes/users')
const campRoutes = require('./routes/camps');
const reviewRoutes = require('./routes/reviews');
const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://127.0.0.1:27017/yelpcamp';



mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
        console.log('Connected successfully to MongoDB');
});

const app = express();
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(mongoSanitize({
        replaceWith: '_'
}))

const store = new MongoStore({
        url: dbUrl,
        secret: 'thereshouldalwaysbeasecret',
        touchAfter: 24 * 60 * 60

})
store.on('error', function (e){
        console.log('session error', e)
})

const sessionConfig = {
        store,
        name: 'sesh',
        secret: 'secretsecretsecretsecretsecrets',
        resave: false,
        saveUninitialized: true,
        cookie: {
                httpOnly: true,
                expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
                maxAge: 1000 * 60 * 60 * 24 * 7
        }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passL(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
        // console.log(req.query);
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
})

app.get('/fakeUser', async (req, res) => {
        const user = new User({ email: 'lande@gmail.com', username: 'lande' });
        const newUser = await User.register(user, 'lande');
        res.send(`newUser: ${newUser} (yay)`)
})

app.use('/', userRoutes)
app.use('/camps', campRoutes)
app.use('/camps/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
        res.render('home')
})


app.all('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;
        if (!err.message) err.message = 'tf is happening?'
        res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
        console.log(`live on Port ${port}`);
})
