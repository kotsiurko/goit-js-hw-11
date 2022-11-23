import { PixabayAPI } from './js/api-service';
import renderHTML from './js/renderHTML';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const targetElement = document.querySelector('.js-target-element');

const pixabayAPI = new PixabayAPI();

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchFormEl.addEventListener('submit', onSearchFormSubmit);
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

    // Виконую перевірку на випадок ДУУУЖЕ рідкісного запиту
    if (pixabayAPI.page === totalPages) {
      loadMoreBtnEl.classList.add('hidden');
    }
    observer.observe(targetElement);
  } catch (err) {
    console.log(err);
  }
}

// Pagination
const observer = new IntersectionObserver(
  async (entries, observer) => {
    if (entries[0].isIntersecting) {
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
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          observer.unobserve(targetElement);
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  {
    root: null,
    rootMargin: '0px 0px 100px 0px',
    threshold: 1,
  }
);
