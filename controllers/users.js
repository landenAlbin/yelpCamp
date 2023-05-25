const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
          res.render('users/register');
}
module.exports.createUser = async (req, res, next) => {
          try {
                    const { username, email, password } = req.body;
                    const user = new User({ username, email });
                    const regUser = await User.register(user, password)
                    req.login(regUser, err => {
                              if (err) return next(err);
                              req.flash('success', 'Welcome to Yelp Camp!');
                              res.redirect('/camps');
                    })

          } catch (e) {
                    req.flash('error', e.message);
                    res.redirect('register')
          }
}
module.exports.renderLoginForm = (req, res) => {
          res.render('users/login');
}

module.exports.loginUser = (req, res) => {
          req.flash('success', 'Welcome Back!')
          const redirectUser = req.session.returnTo || '/camps';
          delete req.session.returnTo;
          res.redirect(redirectUser)
}

module.exports.logoutUser = (req, res, next) => {
          req.logout()
          req.flash('success', 'Successfully logged out. See ya later!')
          res.redirect('/camps')
}