import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inpText = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const clearContent = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const inputHandler = e => {
  const textInp = e.target.value.trim();
  if (!textInp) {
    clearContent();
    return;
  }

  fetchCountries(textInp)
    .then(country => {
      clearContent();

      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (country.length === 1) {
        createInfoMarkup(country);
      } else if (country.length > 1 && country.length <= 10) {
        createListMarkup(country);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearContent();
    });
};

const createListMarkup = country => {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}" width="40" height="20"><p>${name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

const createInfoMarkup = country => {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section><h1><img src="${flags.png}" alt="${
        name.official
      }" width="90" height="70">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p><section>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

inpText.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
