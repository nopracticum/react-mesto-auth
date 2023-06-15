import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';


function Header({ loggedIn, userEmail, handleLogOut }) {
	const url = useLocation();
	const path = (url.pathname === '/sign-in') ? '/sign-up' : '/sign-in';
	const linkTitle = (url.pathname === '/sign-in') ? 'Регистрация' : 'Войти';

	return(
		<header className="header">
			<img src={logo} alt="Логотип" className="header__logo"/>
			{loggedIn ? (
				<div className='header__container' >
					<p className="header__email">{userEmail}</p>
					<button className="header__link" onClick={handleLogOut}>Выйти</button>
				</div>
			) : (
				<Link className="header__link" to={path}>{linkTitle}</Link>
			)}
		</header>
	)
}

export default Header;