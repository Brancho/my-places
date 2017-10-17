import axios from 'axios';

function ajaxHeart(e){
  e.preventDefault();
  axios.post(this.action).then(res => {
   const isHearted = this.heart.classList.toggle('heart__button--hearted');
   document.getElementsByClassName('heart-count')[0].innerHTML = res.data.hearts.length;
   if(isHearted){
     this.heart.classList.add('heart__button--float');
     setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
   }
  }).catch(console.error)
}

export default ajaxHeart;