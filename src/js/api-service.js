'use strict';
import axios from 'axios';

export class PixabayAPI {
  #BASEURL = 'https://pixabay.com/api/';
  #API_KEY = '31497925-3da7c0b5792e88873a0201f19';

  constructor() {
    this.page = null;
    this.searchQuery = null;
  }

  fetchImages() {
    const searchParams = {
      params: {
        key: this.#API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: this.page,
        per_page: '3',
      },
    };

    return axios.get(`${this.#BASEURL}`, searchParams);
  }

  // getProducts() {
  //   return axios.get(
  //     `${this.#BASEURL}/category/${this.category}?sort=${this.sort}`
  //   );
  // }

  // getAllProducts() {
  //   return axios.get(`${this.#BASEURL}?key=${this.sort}`);
  // }

  // addProducts(product) {
  //   return axios.post(`${this.#BASEURL}`, product);
  // }

  // deleteProducts(productId) {
  //   return axios.delete(`${this.#BASEURL}/${productId}`);
  // }

  // updateProducts(productId, product) {
  //   return axios.patch(`${this.#BASEURL}/${productId}`, product);
  // }
}
