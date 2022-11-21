import { PixabayAPI } from './js/api-service';
import renderHTML from './js/renderHTML';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
// const searchBtnEl = document.querySelector('#search-btn');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayAPI = new PixabayAPI();

// console.log(pixabayAPI);
searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

let elCounter = null;

function onSearchFormSubmit(event) {
  event.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.searchQuery = event.target.elements.searchQuery.value;

  pixabayAPI
    .fetchImages()
    .then(({ data }) => {
      if (data.total === 0) {
        console.log(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
      galleryEl.innerHTML = renderHTML(data.hits);
      loadMoreBtnEl.classList.remove('hidden');
      elCounter = data.hits.length;
      console.log('elCounter : ', elCounter);
    })
    .catch(err => {
      console.log(err);
    });
}

// Pagination

function onLoadMoreBtnClick(event) {
  pixabayAPI.page += 1;

  pixabayAPI
    .fetchImages()
    .then(({ data }) => {
      // виконую рендур елементів
      galleryEl.insertAdjacentHTML('beforeend', renderHTML(data.hits));

      // логіка лічильника зображень, що залишились
      elCounter += data.hits.length;
      let imagesLeft = data.totalHits - elCounter;
      console.log('imagesLeft : ', imagesLeft);

      // виконую перевірку елементів, що залишились
      // якщо елементів вже не залишилось, то виводжу повідомлення
      if (imagesLeft <= 0) {
        loadMoreBtnEl.classList.add('hidden');
        console.log(
          "We're sorry, but you've reached the end of search results."
        );
        // return;
      }
      console.log(data);

      // логіка лічильника зображень, що залишились
      elCounter += elCounter;
    })
    .catch(err => {
      console.log(err);
    });
}
