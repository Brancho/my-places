const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'ADD STORE' })
};

exports.createStore = async (req, res) => {
  req.body.tags = req.body.tags.split(',').map(function(tag) {
    return tag.trim();
  });
  const store = await(new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'STORES', stores })
};