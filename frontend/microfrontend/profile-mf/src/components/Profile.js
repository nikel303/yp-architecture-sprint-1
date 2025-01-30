import React from 'react';

import "../blocks/profile/profile.css"
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import api from "../utils/api";

export default function Profile({currentUser}) {

    const imageStyle = {backgroundImage: `url(${currentUser.avatar})`};

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);

    function onUserUpdated(user) {
        dispatchEvent(new CustomEvent('onUserUpdated', {
            user,
        }));
    }

    function onAddPlaceClick(e) {
        e.preventDefault();
        dispatchEvent(new CustomEvent('onAddPlaceClick', {}));
    }

    function onEditProfileClick(e) {
        e.preventDefault();
        setIsEditProfilePopupOpen(true);
    }

    function onEditAvatarClick(e) {
        e.preventDefault();
        setIsEditAvatarPopupOpen(true);
    }

    function onCloseAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
    }

    function handleUpdateUser(userUpdate) {
        api
            .setUserInfo(userUpdate)
            .then((newUserData) => {
                onUserUpdated(newUserData);
                onCloseAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar(avatarUpdate) {
        api
            .setUserAvatar(avatarUpdate)
            .then((newUserData) => {
                onUserUpdated(newUserData);
                onCloseAllPopups();
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            <section className="profile page__section">
                <div className="profile__image" onClick={onEditAvatarClick} style={imageStyle}></div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <button className="profile__edit-button" type="button" onClick={onEditProfileClick}></button>
                    <p className="profile__description">{currentUser.about}</p>
                </div>
                <button className="profile__add-button" type="button" onClick={onAddPlaceClick}></button>
            </section>
            <EditProfilePopup
                currentUser={currentUser}
                isOpen={isEditProfilePopupOpen}
                onUpdateUser={handleUpdateUser}
                onClose={onCloseAllPopups}
            />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onUpdateAvatar={handleUpdateAvatar}
                onClose={onCloseAllPopups}
            />
        </>
    )
}