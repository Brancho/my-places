import '../sass/style.scss';

import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeahead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';





autocomplete(document.getElementById('address'), document.getElementById('lat'), document.getElementById('lng'));
typeAhead(document.getElementsByClassName('search')[0]);
makeMap(document.getElementById('map'));

const heartForms = document.querySelectorAll('form.heart');
heartForms.forEach(form => form.addEventListener('submit', ajaxHeart));

