const Camp = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const camp = await Camp.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Successfully added review!')
    res.redirect(`/camps/${camp._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')


    res.redirect(`/camps/${id}`)
}