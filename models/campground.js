const mongoose = require('mongoose');
const { campSchema } = require('../Schema');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
     url: String,
     filename: String

});

ImageSchema.virtual('thumb').get(function () {
     return this.url.replace('/upload', '/upload/w_200');
})

const ops = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
     title: String,
     image: [ImageSchema],
     geometry: {
          type: {
               type: String,
               enum: ['Point'],
               required: true
          },
          coordinates: {
               type: [Number],
               required: true
          }
     },
     price: Number,
     desc: String,
     location: String,
     author: {
          type: Schema.Types.ObjectId,
          ref: 'User'
     },
     reviews: [
          {
               type: Schema.Types.ObjectId,
               ref: 'Review'
          }
     ],

},ops);

CampgroundSchema.virtual('properties.popupText').get(function () {
     return `<a href="/camps/${this._id}">${this.title}</a>`
})
CampgroundSchema.post('findOneAndDelete', async function (dog) {
     if (dog) {
          await Review.deleteMany({
               _id: {
                    $in: dog.reviews
               }
          })
     }
})

module.exports = mongoose.model('Camp', CampgroundSchema);