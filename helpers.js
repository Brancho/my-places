const fs = require('fs');

exports.moment = require('moment');
exports.dump = (obj) => JSON.stringify(obj, null, 2);
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);
exports.siteName = `Yummm!`;

