const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' })
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'ADD STORE' })
};

exports.createStore = async (req, res) => {
  req.body.tags = req.body.tags.split(',').map(function(tag) {
    return tag.trim();
  });
  const store = new Store(req.body);
  await store.save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect('/')
};