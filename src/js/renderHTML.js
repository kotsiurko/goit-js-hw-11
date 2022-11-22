export default function renderHTML(elemsArray) {
  return elemsArray
    .map(el => {
      let {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = el;
      return `
          <a class="gallery__item" href="${largeImageURL}">
            <div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image"/>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b>
                  ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  ${downloads}
                </p>
              </div>
            </div>
          </a>
            `;
    })
    .join('');
}
