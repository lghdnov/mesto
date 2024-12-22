import initialCards from "./cards.js";
import errorMessages from './inputErrors.js';

import '../pages/index.css';

// DOM узлы
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
const profileNameInput = popupEditProfileForm.querySelector('.popup__input_type_name');
const profileDescriptionInput = popupEditProfileForm.querySelector('.popup__input_type_description');
const profileButton = popupEditProfileForm.querySelector('.popup__button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileNameError = document.getElementById('profileNameError');
const profileDescriptionError = document.getElementById('profileDescriptionError');
const placeNameError = document.getElementById('placeNameError');
const placeUrlError = document.getElementById('placeUrlError');

// Функция создания карточки
function createCard(data) {
    const cardElement = cardTemplate.content.cloneNode(true).querySelector('.card');
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;

    // Добавляем обработчик удаления
    deleteButton.addEventListener('click', () => removeCard(cardElement));

    // Добавляем обработчик лайка
    likeButton.addEventListener('click', () => toggleLike(likeButton));

    // Добавляем обработчик открытия попапа с изображением
    imageElement.addEventListener('click', () => openImagePopup(data));

    return cardElement;
}

// Функция удаления карточки
function removeCard(card) {
    card.remove();
}

// Функция переключения лайка
function toggleLike(button) {
    button.classList.toggle('card__like-button_is-active');
}

// Функция открытия попапа с изображением
function openImagePopup(data) {
    popupImageElement.src = data.link;
    popupImageElement.alt = data.name;
    popupCaption.textContent = data.name;
    openPopup(popupImage);
}

// Функция открытия попапа
function openPopup(popup) {
    popup.classList.add('popup_is-opened');
}

// Функция закрытия попапа
function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
}

// Добавляем обработчик для закрытия попапа с изображением
popupCloseButton.addEventListener('click', () => closePopup(popupImage));

// Обработчик открытия попапа добавления новой карточки
popupNewCardOpenButton.addEventListener('click', () => openPopup(popupNewCard));

// Обработчик закрытия попапа добавления новой карточки
popupNewCardCloseButton.addEventListener('click', () => closePopup(popupNewCard));

// Обработчик отправки формы добавления новой карточки
popupNewCardForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newCard = createCard({
        name: cardNameInput.value,
        link: cardLinkInput.value,
    });
    placesList.prepend(newCard);
    closePopup(popupNewCard);
});

cardNameInput.addEventListener('input', () => showInputError(cardNameInput, placeNameError, cardSubmitButton));
cardLinkInput.addEventListener('input', () => showInputError(cardLinkInput, placeUrlError, cardSubmitButton));

// Обработчик открытия попапа редактирования профиля
popupEditProfileOpenButton.addEventListener('click', () => {
    profileNameInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openPopup(popupEditProfile);
});

// Обработчик закрытия попапа редактирования профиля
popupEditProfileCloseButton.addEventListener('click', () => closePopup(popupEditProfile));


function showInputError(input, errorElement, button) {
    // Если поле валидное, убираем сообщение об ошибке и стили
    if (input.validity.valid) {
        errorElement.textContent = '';
        input.classList.remove('popup__input_is-error');
        button.disabled = false;
        return;
    }

    // Сопоставление ошибок с сообщениями
    const errorMessagesMap = {
        valueMissing: errorMessages.valueMissing,
        tooShort: errorMessages.tooShort(input.minLength, input.value.length),
        tooLong: errorMessages.tooLong(input.maxLength, input.value.length),
        invalidValue: errorMessages.invalidValue,
        typeMismatch: errorMessages.typeMissmatch,
    };

    // Определение текущей ошибки
    for (const [key, message] of Object.entries(errorMessagesMap)) {
        if (input.validity[key]) {
            errorElement.textContent = message;
            break;
        }
    }

    // Добавляем класс для стилизации ошибки
    input.classList.add('popup__input_is-error');
    button.disabled = true;
}

// Обработчик отправки формы редактирования профиля с валидацией
popupEditProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    profileTitle.textContent = profileNameInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup(popupEditProfile);

});


profileNameInput.addEventListener('input', () => showInputError(profileNameInput, profileNameError, profileButton));
profileDescriptionInput.addEventListener('input', () => showInputError(profileDescriptionInput, profileDescriptionError, profileButton));


// Вывести карточки на страницу
initialCards.forEach((data) => {
    const card = createCard(data);
    placesList.appendChild(card);
});


// Функция для закрытия всех попапов при клике за их пределами
function closePopupOnClickOutside(event) {
    // Проверяем, был ли клик сделан за пределами попапа
    if (event.target.classList.contains('popup_is-opened')) {
        closePopup(event.target);
    }
}

// Функция для закрытия попапа при нажатии клавиши Escape
function closePopupOnEscape(event) {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closePopup(openedPopup);
        }
    }
}

// Добавляем обработчик для закрытия попапов при клике за пределами попапа
document.addEventListener('click', closePopupOnClickOutside);

// Добавляем обработчик для закрытия попапа при нажатии на клавишу Escape
document.addEventListener('keydown', closePopupOnEscape);