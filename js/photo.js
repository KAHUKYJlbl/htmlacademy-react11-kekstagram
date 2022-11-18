import {getPhotosArr} from './data-download.js';
import {getBigPicture} from './big-picture.js';
import {getMiniature} from './miniatures.js';
import {showAlert, getRandomInt} from './util.js';
import {getUniqValue} from './cache.js';

const CHOSEN_PHOTOS_RANDOM_LENGTH = 10;

const photoContainer = document.querySelector('.pictures');
const photoContainerClear = photoContainer.innerHTML;
const miniatureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
const chosenPhotosInterface = document.querySelector('.img-filters');
let currentChosenButton = document.querySelector('.img-filters__button--active');

function getPhotosListFragment (photosArr) {
  const photosListFragment = document.createDocumentFragment();

  photosArr.forEach((photoData) => {
    const newPhoto = getMiniature(photoData, miniatureTemplate);

    newPhoto.addEventListener('click', (evt) => {
      evt.preventDefault();
      getBigPicture(photoData);
    });

    photosListFragment.append(newPhoto);
  });

  return photosListFragment;
}

function showChosenPhotos(photos) {
  let chosenPhotos = [];
  // photoContainer.querySelectorAll('a.picture').forEach((elem) => elem.remove());

  photoContainer.innerHTML = photoContainerClear;

  if (currentChosenButton.id === 'filter-default') {
    photoContainer.append(getPhotosListFragment(photos));
  } else if (currentChosenButton.id === 'filter-random') {
    const getRandomPhoto = getUniqValue(getRandomInt, 0, photos.length - 1);
    for (let i = 0; i < CHOSEN_PHOTOS_RANDOM_LENGTH; i++) {
      chosenPhotos.push(photos[getRandomPhoto()]);
    }
    photoContainer.append(getPhotosListFragment(chosenPhotos));
  } else if (currentChosenButton.id === 'filter-discussed') {
    chosenPhotos = photos
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length);
    photoContainer.append(getPhotosListFragment(chosenPhotos));
  }
}

function setChosenPhotos(cb) {
  chosenPhotosInterface.addEventListener('click', (evt) => {
    currentChosenButton.classList.remove('img-filters__button--active');
    currentChosenButton = evt.target;
    currentChosenButton.classList.add('img-filters__button--active');
    cb();
  });
}

getPhotosArr(
  (photosData) => {
    chosenPhotosInterface.classList.remove('img-filters--inactive');
    showChosenPhotos(photosData);
    setChosenPhotos(() => showChosenPhotos(photosData));
  },
  () => showAlert('Не удалось загрузить фотографии'),
);
