function PopupWithForm({ 
	name, title, children, isOpen, onClose, onSubmit, buttonText, handleOverlayClick, isLoading }) {


	return(
			<div className={`popup ${isOpen ? "popup_opened" : ""} popup_type_${name}`} onClick={handleOverlayClick} >
					<div className="popup__container overlay">
							<button 
								className="popup__close-button" 
								aria-label="Закрыть" 
								type="button"
								onClick={onClose}/>
							<p className="popup__title">{title}</p>
							<form action="#" name={`form__${name}`} className="form" onSubmit={onSubmit}>
									{children}
									<button 
										className="popup__submit-button popup__submit-button_type_profile"
										type="submit"
									>{isLoading ? ('Сохранение...') : (buttonText)}
									</button>
							</form>
					</div>
			</div>
	)
}

export default PopupWithForm;