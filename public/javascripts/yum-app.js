import '../sass/style.scss';

import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeahead';
import makeMap from './modules/map';




autocomplete(document.getElementById('address'), document.getElementById('lat'), document.getElementById('lng'));
typeAhead(document.getElementsByClassName('search')[0]);
makeMap(document.getElementById('map'));