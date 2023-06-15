import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import ImagePopup from "./ImagePopup.js";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { PopupContext } from "../contexts/PopupContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTooltip from "./InfoTooltip.js";
import * as auth from "../utils/Auth.js";

function App() {
  const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [registred, setRegister] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserDataApi(), api.getInitialCardsApi()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => alert(`Возникла ошибка ${err}`));
    }
  }, [loggedIn]);

  function handleLogOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then(() => {
        setRegister(true);
        setInfoTooltipOpen(true);
        navigate("/sign-in");
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        console.log(`Возникла ошибка ${err}`);
      });
  }

  function handleLogin({ email, password }) {
    auth
      .authorize({ email, password })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setLoggedIn(true);
          setUserEmail(email);
          navigate("/main");
        }
      })
      .catch((err) => console.log(err));
  }

  function handleTokenCheck() {
    const token = localStorage.getItem("token");

    if (token) {
      auth
        .checkToken(token)
        .then((user) => {
          if (user) {
            const curentUserEmail = user.data.email;
            setLoggedIn(true);
            navigate("/main", { replace: true });
            setUserEmail(curentUserEmail);
          }
        })
        .catch((err) => alert(`Возникла ошибка ${err}`));
    }
  }

  useEffect(() => {
    handleTokenCheck();
  }, []);

  function handleUpdateAvatar(data) {
    api
      .changeUserAvatarApi(data)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => alert(`Ошибка ${err}`));
  }

  function handleUpdateUser(data) {
    api
      .changeUserDataApi(data)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => alert(`Ошибка ${err}`));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCardApi(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => alert(`Ошибка ${err}`));
  }

  function handleCardLike(card) {
    const isCurrentUserLiked = card.likes.some(
      (like) => like._id === currentUser._id
    );
    api
      .changeLikeCardStatus(card._id, !isCurrentUserLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => alert(`Ошибка ${err}`));
  }

  function handleCardDelete(card) {
    api
      .deleteCardApi(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => alert(`Ошибка ${err}`));
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setAvatarPopupOpen(false);
    setProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setInfoTooltipOpen(false);
  }

  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  }

  function showLoader() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          handleLogOut={handleLogOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/main" />
              ) : (
                <Navigate to="/sign-in" replace />
              )
            }
          />
          <Route
            path="/sign-up"
            element={
              <Register
                buttonText="Зарегестрироваться"
                handleRegister={handleRegister}
              />
            }
          />
          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} buttonText="Войти" />}
          />
          <Route
            path="/main"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
            }
          />
        </Routes>
        <Footer />
        <PopupContext.Provider value={handleOverlayClick}>
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
            showLoader={showLoader}
          />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
            showLoader={showLoader}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
            showLoader={showLoader}
          />
        </PopupContext.Provider>
        <InfoTooltip
          name="infoTooltip"
          successTitle="Вы успешно зарегистрировались!"
          deniedTitle="Что-то пошло не так! Попробуйте ещё раз."
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          registred={registred}
          handleOverlayClick={handleOverlayClick}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          handleOverlayClick={handleOverlayClick}
        ></ImagePopup>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;