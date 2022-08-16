import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inpText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const clearContent = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInp = e.target.value.trim();
  if (!textInp) {
    clearContent(countryList);
    clearContent(countryInfo);
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
      clearContent(countryList);
      clearContent(countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = country => {
  if (country.length === 1) {
    clearContent(countryList);
    const markupInfo = createInfoMarkup(country);
    countryInfo.innerHTML = markupInfo;
  } else {
    clearContent(countryInfo);
    const markupList = createListMarkup(country);
    countryInfo.innerHTML = markupList;
  }
};

const createListMarkup = country => {
  return country
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="40" height="20">${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = country => {
  return country
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.png}" alt="${
          name.official
        }" width="90" height="70">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
    )
    .join('');
};

inpText.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
