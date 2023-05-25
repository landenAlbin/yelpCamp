// loads the campground model 
const Camp = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOXTOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary')


// renders the camps page
module.exports.index = async (req, res) => {
     const camps = await Camp.find({});
     res.render('camps/index', { camps })
}

//renders the new form
module.exports.renderNewForm = (req, res) => {
     res.render('camps/new')
}
// creates a new campground
module.exports.createCamp = async (req, res) => {
     const geoData = await geocoder.forwardGeocode({
          query: req.body.camp.location,
          limit: 1
     }).send()
     const camp = new Camp(req.body.camp);
     camp.geometry = geoData.body.features[0].geometry
     camp.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
     camp.author = req.user._id;
     await camp.save();
     console.log(camp);
     req.flash('success', 'Successfully created new Camp! ')
     res.redirect(`camps/${camp._id}`);
}

//  renders the show page
module.exports.showCamp = async (req, res, next) => {
     const camp = await Camp.findById(req.params.id).populate({
          path: 'reviews',
          populate: {
               path: 'author'
          }
     }).populate('author');
     console.log(camp);
     if (!camp) {
          req.flash('error', 'Cannot find that campground ')
          return res.redirect('/camps')
     }
     res.render('camps/show', { camp })
}

// renders the edit form
module.exports.renderEditForm = async (req, res) => {
     const { id } = req.params;
     const camp = await Camp.findById(id);
     if (!camp) {
          req.flash('error', 'Cannot find that campground ')
          return res.redirect('/camps')
     }
     res.render('camps/edit', { camp });
}

// updates the campground
module.exports.editCamp = async (req, res) => {
     const { id } = req.params;
     console.log(req.body);
     const camp = await Camp.findByIdAndUpdate(id, { ...req.body.camp });
     const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
     camp.image.push(...img);
     if (req.body.deleteImages) {
          for (let filename of req.body.deleteImages) {
               await cloudinary.uploader.destroy(filename);
          }
          await camp.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
          console.log(camp);

     }
     await camp.save()
     req.flash('success', 'Camp successfully updated!')
     res.redirect(`/camps/${camp._id}`)
}

//  deletes the campground
module.exports.deleteCamp = async (req, res) => {
     const { id } = req.params;
     await Camp.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted campground!')
     res.redirect('/camps');
}