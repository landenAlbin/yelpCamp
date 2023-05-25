const { campSchema, reviewSchema } = require('./Schema');
const ExpressError = require('./utils/expressError')
const Camp = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    next()
}
module.exports.validateCamp = (req, res, next) => {

    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Camp.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'Missing Permissions!')
        return res.redirect(`/camps/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Missing Permissions!')
        return res.redirect(`/camps/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('error', msg)
    } else {
        next();
    }
}
