import React, { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import Auth from "./components/Auth";
import Ingredients from "./components/Ingredients/Ingredients";

const App = (props) => {
	const authContex = useContext(AuthContext);
	let content = <Auth />;
	if (authContex.isAuth) {
		content = <Ingredients />;
	}
	return content;
};

export default App;
