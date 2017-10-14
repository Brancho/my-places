const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const passport = require('passport');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' })
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' })
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next()
};

exports.login = passport.authenticate('local', {
  faliureRedirect: '/login',
  faliureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
    return;
  }
  else {
    req.flash('error', 'Ooops, you must be logged in to do that!');
    res.redirect('/login');
  }
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'You must supply a password!').notEmpty();
  req.checkBody('password-confirm', 'You must confirm your password!').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match!').equals(req.body.password);

  const errors = req.validationErrors();
  if(errors){
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

exports.account = (req, res) => {
  res.render('account', { title: 'Edit account' });
};

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
    );
  req.login(user);
  req.flash('success', 'Account successfully updated');
  res.redirect('back');
};

