import errorMessages from './inputErrors.js';
import Api from "./Api.js";

import '../pages/index.css';

const cardTemplate = document.querySelector('#card-template');
const placesList = document.querySelector('.places__list');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');
const popupCloseButton = popupImage.querySelector('.popup__close');

const popupNewCard = document.querySelector('.popup_type_new-card');
const popupNewCardOpenButton = document.querySelector('.profile__add-button');
const popupNewCardCloseButton = popupNewCard.querySelector('.popup__close');
const popupNewCardForm = popupNewCard.querySelector('.popup__form');
const cardNameInput = popupNewCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = popupNewCardForm.querySelector('.popup__input_type_url');
const cardSubmitButton = popupNewCardForm.querySelector('.popup__button');

const popupEditProfile = document.querySelector('.popup_type_edit');
const popupEditProfileOpenButton = document.querySelector('.profile__edit-button');
const popupEditProfileCloseButton = popupEditProfile.querySelector('.popup__close');
const popupEditProfileForm = popupEditProfile.querySelector('.popup__form');

const popupEditProfileImage = document.querySelector('.popup_type_avatar-edit');
const popupEditAvatarCloseButton = popupEditProfileImage.querySelector('.popup__close');
const profileEditImageButton = document.querySelector('.profile__edit-image-button');
const popupEditProfileImageForm = popupEditProfileImage.querySelector('.popup__form');
const profileImageUrlInput = popupEditProfileImageForm.querySelector('.popup__input_type_url');


const profileNameInput = popupEditProfileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = popupEditProfileForm.querySelector('.popup__input_type_description');
const profileButton = popupEditProfileForm.querySelector('.popup__button');
const profileTitle = document.querySelector('.profile__title');
const profileAvatar = document.querySelector('.profile__image');
const profileDescription = document.querySelector('.profile__description');
const profileNameError = document.getElementById('profileNameError');
const profileDescriptionError = document.getElementById('profileDescriptionError');
const placeNameError = document.getElementById('placeNameError');
const placeUrlError = document.getElementById('placeUrlError');

const group = 'apf-cohort-202';
const token = '24d82705-51c9-4b53-ac21-c31a1a368731'
const api = new Api({
    baseUrl: `https://mesto.nomoreparties.co/v1/${group}`,
  headers: {
      authorization: token,
    'Content-Type': 'application/json'
  }
});

let id;
api.getUserInfo()
    .then(info =>{
        id = info._id;
        console.log(id);
    })

function createCard(data) {
    const cardElement = cardTemplate.content.cloneNode(true).querySelector('.card');
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCounter = cardElement.querySelector('.card__like-counter');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;
    likeCounter.textContent = data.likes.length;

    console.log(data);

    if(id != data.owner._id){
        deleteButton.style.display = 'none';
    }

    if(data.likes.map(dict => dict._id).includes(id)){
        const buttonClass = 'card__like-button_is-active'
        likeButton.classList.toggle(buttonClass);
    }

    deleteButton.addEventListener('click', () => removeCard(cardElement, data._id));

    likeButton.addEventListener('click', () => toggleLike(likeButton, likeCounter, data._id));

    imageElement.addEventListener('click', () => openImagePopup(data));

    return cardElement;
}
function removeCard(card, id) {
    card.remove();

    api.deleteCard(id);
}

function toggleLike(button, likeCounter, id) {
    const buttonClass = 'card__like-button_is-active'
    button.classList.toggle(buttonClass);

    let method;

    if(button.classList.contains(buttonClass)){
        likeCounter.textContent++;
        method = 'PUT';
    }
    else{
        likeCounter.textContent--;
        method = 'DELETE';
    }

    api.togleLike(id, method);
}

function openImagePopup(data) {
    popupImageElement.src = data.link;
    popupImageElement.alt = data.name;
    popupCaption.textContent = data.name;
    openPopup(popupImage);
}


function openPopup(popup) {
    popup.classList.add('popup_is-opened');
}

function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

profileEditImageButton.addEventListener('click', () => openPopup(popupEditProfileImage));

popupCloseButton.addEventListener('click', () => closePopup(popupImage));

popupNewCardOpenButton.addEventListener('click', () => openPopup(popupNewCard));

popupNewCardCloseButton.addEventListener('click', () => closePopup(popupNewCard));

popupNewCardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    api.addCard({
        name: cardNameInput.value,
        link: cardLinkInput.value,
    })
    .then(card => {
        const newCard = createCard(card);
        placesList.prepend(newCard);
    });

    closePopup(popupNewCard);
});

cardNameInput.addEventListener('input', () => showInputError(cardNameInput, placeNameError, cardSubmitButton));
cardLinkInput.addEventListener('input', () => showInputError(cardLinkInput, placeUrlError, cardSubmitButton));

popupEditProfileOpenButton.addEventListener('click', () => {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openPopup(popupEditProfile);
});

popupEditProfileCloseButton.addEventListener('click', () => closePopup(popupEditProfile));

popupEditAvatarCloseButton.addEventListener('click', () => closePopup(popupEditProfileImage));


function showInputError(input, errorElement, button) {
    if (input.validity.valid) {
        errorElement.textContent = '';
        input.classList.remove('popup__input_is-error');
        button.disabled = false;
        return;
    }

    const errorMessagesMap = {
        valueMissing: errorMessages.valueMissing,
        tooShort: errorMessages.tooShort(input.minLength, input.value.length),
        tooLong: errorMessages.tooLong(input.maxLength, input.value.length),
        invalidValue: errorMessages.invalidValue,
        typeMismatch: errorMessages.typeMissmatch,
    };

    for (const [key, message] of Object.entries(errorMessagesMap)) {
        if (input.validity[key]) {
            errorElement.textContent = message;
            break;
        }
    }

    input.classList.add('popup__input_is-error');
    button.disabled = true;
}

popupEditProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;

    api.editUserInfo({
        name: profileNameInput.value,
        about: profileDescriptionInput.value,
    })

    closePopup(popupEditProfile);

});

popupEditProfileImageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    api.changeAvatar({
        avatar: profileImageUrlInput.value,
    });

    closePopup(popupEditProfile);
});


profileNameInput.addEventListener('input', () => showInputError(profileNameInput, profileNameError, profileButton));
profileDescriptionInput.addEventListener('input', () => showInputError(profileDescriptionInput, profileDescriptionError, profileButton));



function closePopupOnClickOutside(event) {
    if (event.target.classList.contains('popup_is-opened')) {
        closePopup(event.target);
    }
}

function closePopupOnEscape(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closePopup(openedPopup);
        }
    }
}

document.addEventListener('click', closePopupOnClickOutside);

document.addEventListener('keydown', closePopupOnEscape);


api.getInitialCards()
    .then(cards => {
        cards.forEach(card => {
            placesList.appendChild(createCard(card));
        });
    });

api.getUserInfo()
    .then(info => {
        profileTitle.textContent = info.name;
        profileDescription.textContent = info.about;
        console.log(info.avatar);
        profileAvatar.style.backgroundImage = `url(${info.avatar})`;
    });


