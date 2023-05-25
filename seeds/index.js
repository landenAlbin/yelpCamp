const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, campType } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
      console.log('Connected successfully...');
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
      await Campground.deleteMany({});
      for (let i = 0; i < 10; i++) {
            const rand1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 50) + 50;
            const camp = new Campground({
                  author: '646531bd01b539649b4758c7',
                  location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
                  title: `${sample(descriptors)} ${sample(places)} ${sample(campType)}`,
                  image: `https://source.unsplash.com/collection/483251`,
                  desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, adipisci eligendi. Velit exercitationem odit adipisci quam incidunt repudiandae nisi delectus consectetur magni distinctio ea, illo fugiat odio doloribus voluptatem expedita!',
                  price
            })
            await camp.save();
      }
}

seedDB().then(() => {
      console.log('You have NEW campgrounds! :D');
      mongoose.connection.close();
})