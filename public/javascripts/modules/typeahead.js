import axios from 'axios'

function searchResultsHTML(stores){
  return stores.map(store => {
    return `<a href="/store/${store.slug}" class="search__result black"> <strong>${store.name}</strong></a>`
  }).join();
}


function typeAhead(search){
  if(!search) return;
  const searchInput = search.querySelector('input');
  const searchResults = search.querySelector('.search__results');

  searchInput.addEventListener('keyup', function(){
    if(!this.value){
      searchResults.style.display = 'none';
      return;
    }
    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios.get(`/api/search?q=${this.value}`).then(res => {
      if(res.data.length){
        searchResults.innerHTML = searchResultsHTML(res.data);
      } else {
        searchResults.innerHTML = `<div class="search__result">No results for ${this.value} found!</div>`
      }
    }).catch(err => {
      console.error(err);
    })
  })
}

export default typeAhead