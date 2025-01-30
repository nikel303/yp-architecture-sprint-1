import React, {lazy, Suspense, useEffect, useState} from 'react';

import "../blocks/places/places.css"
import api from "../utils/api";
import Card from "./Card";
import AddPlacePopup from "./AddPlacePopup";

const PopupWithForm = lazy(() => import('ui/PopupWithForm'));
const ImagePopup = lazy(() => import('ui/ImagePopup'));

export default function Profile({currentUser}) {

    const [cards, setCards] = useState([]);

    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);

    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    }

    useEffect(() => {

        api.getCardList()
            .then((data) => {
                setCards(data);
            })
            .catch((err) => {
                console.log(err)
            })

        addEventListener('onCardAddClick', handleAddPlaceClick)
        return () => {
            removeEventListener('onCardAddClick', handleAddPlaceClick)
        }
    })

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function onCloseAllPopups() {
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api
            .addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                onCloseAllPopups();
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            <div className="places">
                <ul className="places__list">
                    {cards.map((card) => (
                        <Card
                            key={card._id}
                            currentUser={currentUser}
                            card={card}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                    ))}
                </ul>
            </div>
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={onCloseAllPopups}
            />
            <Suspense>
                <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да"/>
            </Suspense>
            <Suspense>
                <ImagePopup card={selectedCard} onClose={onCloseAllPopups}/>
            </Suspense>
        </>
    )
}