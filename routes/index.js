const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');




router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/add', userController.isLoggedIn, storeController.addStore);
router.post('/add', storeController.upload, storeController.resize, catchErrors(storeController.createStore));
router.post('/add/:id', storeController.upload, storeController.resize, catchErrors(storeController.updateStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, userController.register, userController.login);

router.get('/account', userController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(userController.forgot));
router.get('/account/reset/:token', catchErrors(userController.reset));
router.post('/account/reset/:token', userController.confirmedPasswords, catchErrors(userController.update));

router.get('/map', storeController.mapPage);
router.get('/hearts', userController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', userController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));


module.exports = router;
