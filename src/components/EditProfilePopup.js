import { useContext, useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm.js"
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { PopupContext } from "../contexts/PopupContext.js";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading, showLoader }) {

	const currentUser = useContext(CurrentUserContext);
	const handleOverlayClick = useContext(PopupContext);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const handleNameChange = (evt) => setName(evt.target.value);
	const handleAboutChange = (evt) => setDescription(evt.target.value);
	
	useEffect(() => {
		setName(currentUser.name);
		setDescription(currentUser.about);
	}, [currentUser, isOpen])

	function handleSubmit(evt) {
		evt.preventDefault();
		showLoader();	
		onUpdateUser({
			name: name,
			about: description
		});
	}

	return (
		<PopupWithForm
			name="profile"
			title="Редактировать профиль"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			buttonText="Сохранить"
			handleOverlayClick={handleOverlayClick}
			isLoading={isLoading}>
			<input
				value={name ?? ''}
				onChange={handleNameChange}
				name="name"
				id="name-input"
				className="popup__field form__input popup__field_type_profile-name"
				type="text"
				placeholder="Имя"
				minLength="2" maxLength="40"
				required
			/>
			<span className="name-input-error form__error-message"></span>
			<input
				value={description ?? ''}
				onChange={handleAboutChange}
				name="about"
				id="occupation-input"
				className="popup__field form__input popup__field_type_profile-occupation"
				type="text"
				placeholder="О себе"
				minLength="2" maxLength="200"
				required
			/>
			<span className="occupation-input-error form__error-message"></span>
		</PopupWithForm>
	)
}

export default EditProfilePopup;