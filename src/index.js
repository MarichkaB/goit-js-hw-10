import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inpText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInp = e.target.value.trim();
  if (!textInp) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(textInp)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderMarkup(country);
    })
    .catch(error => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = country => {
  if (country.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createInfoMarkup(country);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(country);
    countryInfo.innerHTML = markupList;
  }
};
