import { useContext, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { PopupContext } from "../contexts/PopupContext";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading, showLoader }) {
	const handleOverlayClick = useContext(PopupContext);
	const [title, setTitle] = useState('')
	const [link, setLink] = useState('')
	const handleTitleChange = (evt) => setTitle(evt.target.value);
	const handleLinkChange = (evt) => setLink(evt.target.value);

	useEffect(() => {
		setTitle('');
		setLink('');
	}, [isOpen])

	function handleSubmit(evt) {
		evt.preventDefault();
		showLoader();	
		onAddPlace({
			name: title,
			link: link
		})
	}

	return (
		<PopupWithForm
			name="add"
			title="Новое место"
			isOpen={isOpen}
			onClose={onClose}
			onSubmit={handleSubmit}
			buttonText="Создать"
			handleOverlayClick={handleOverlayClick}
			isLoading={isLoading}>
			<input
				value={title ?? ''}
				name="add__title"
				id="title-input"
				type="text"
				className="popup__field form__input"
				placeholder="Название"
				minLength="2" maxLength="30"
				onChange={handleTitleChange}
				required
			/>
			<span className="title-input-error form__error-message"></span>
			<input
				value={link ?? ''}
				name="add__link"
				id="link-input"
				type="url"
				className="popup__field form__input"
				placeholder="Ссылка на изображение"
				onChange={handleLinkChange}
				required
			/>
			<span className="link-input-error form__error-message"></span>
		</PopupWithForm>
	)
}
	
export default AddPlacePopup;