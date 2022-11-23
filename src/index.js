import { PixabayAPI } from './js/api-service';
import renderHTML from './js/renderHTML';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayAPI = new PixabayAPI();

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
let totalPages = null;

async function onSearchFormSubmit(event) {
  event.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.searchQuery = event.target.elements.searchQuery.value;

  try {
    const { data } = await pixabayAPI.fetchImages();

    if (data.total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    // Page counter
    totalPages = Math.ceil(data.total / data.hits.length);

    galleryEl.innerHTML = renderHTML(data.hits);
    simpleLightbox.refresh();
    loadMoreBtnEl.classList.remove('hidden');

    // Виконую перевірку на випадок ДУУУЖЕ рідкісного запиту
    if (pixabayAPI.page === totalPages) {
      loadMoreBtnEl.classList.add('hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

// Pagination
async function onLoadMoreBtnClick(event) {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchImages();

    // виконую рендер елементів
    galleryEl.insertAdjacentHTML('beforeend', renderHTML(data.hits));
    simpleLightbox.refresh();

    // Smooth scroll
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    // Виконую перевірку на переміщення до останньої сторінки
    if (pixabayAPI.page === totalPages) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtnEl.classList.add('hidden');
    }
  } catch (err) {
    console.log(err);
  }
}
