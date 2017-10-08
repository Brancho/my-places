const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'ADD STORE' })
};

exports.createStore = async (req, res) => {
  req.body.tags = trimTags(req.body.tags);
  const store = await(new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'STORES', stores })
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  res.render('editStore', { title: `EDIT ${store.name.toUpperCase()}`, store })
};


exports.updateStore = async (req, res) => {
  req.body.tags = trimTags(req.body.tags);
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name}.`);
  res.redirect(`/store/${store.slug}`);
};


function trimTags(tags){
  return tags.split(',').map(function(tag) {
    return tag.trim();
  });
}








