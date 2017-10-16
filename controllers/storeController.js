const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto){
      next(null, true);
    } else {
      next({ message: 'That file type is not alowed!' }, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if(!req.file) return next();
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'ADD STORE' })
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  req.body.tags = trimTags(req.body.tags);
  const store = await(new Store(req.body)).save();
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'STORES', stores })
};

const confirmOwner = (store, user) => {
  if(!store.author.equals(user._id)){
    throw Error('You must order a store in order to edit it!')
  }
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  confirmOwner(store, req.user);
  res.render('editStore', { title: `EDIT ${store.name.toUpperCase()}`, store })
};


exports.updateStore = async (req, res) => {
  req.body.tags = trimTags(req.body.tags);
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated ${store.name}.`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug});
  if(!store) return next();
  res.render('store', {store, title: store.name});
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;

  const tagsPromise = Store.getTagsList();
  const tagQuery = tag || { $exists: true };
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tags', {tags, tag, stores, title: 'Tags'});
};

exports.searchStores = async (req, res) => {
  const stores = await Store.find({
    $text: {
      $search: req.query.q,
    }
  }, {
    score: { $meta: 'textScore' }
  }).sort({
    score: { $meta: 'textScore' }
  });
  res.json(stores);
};

function trimTags(tags){
  return tags.split(',').map(function(tag) {
    return tag.trim();
  });
}








