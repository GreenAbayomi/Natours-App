const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'The rating must be 1 and above'],
      max: [5, 'The rating must be 5 and below'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Review = new model('Review', reviewSchema);

module.exports = Review;
