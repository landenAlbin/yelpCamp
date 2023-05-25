const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passLM = require('passport-local-mongoose');

const userSchema = new Schema({
          email: {
                    type: String,
                    required: true,
                    unique: true
          }
});
userSchema.plugin(passLM);
module.exports = mongoose.model('User', userSchema);