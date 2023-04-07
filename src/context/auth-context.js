import React, { useState } from "react";

export const AuthContext = React.createContext({
	isAuth: false,
	login: () => {},
});
const AuthContextProvider = (props) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const isLoginHandler = (props) => {
		setIsAuthenticated(props);
	};

	return (
		<AuthContext.Provider
			value={{ login: isLoginHandler, isAuth: isAuthenticated }}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
