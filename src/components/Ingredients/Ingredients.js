import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
} from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import { AuthContext } from "../../context/auth-context";
import useHttp from "../hooks/http";

const ingredientReducer = (currentIngredient, action) => {
	switch (action.type) {
		case "SET":
			return action.ingredients;
		case "ADD":
			return [...currentIngredient, action.ingredient];
		case "DELETE":
			return currentIngredient.filter((ing) => ing.id !== action.id);
		default:
			throw new Error("Should not be reached");
	}
};

function Ingredients() {
	const authContex = useContext(AuthContext);
	const [userIngredient, dispatch] = useReducer(ingredientReducer, []);
	const { data, isLoading, error, sendRequest, extra, reqIdentifier, clear } =
		useHttp();

	const isLogOutHandler = () => {
		authContex.login(false);
	};
	const SearchedIngredient = useCallback((searchIngred) => {
		dispatch({ type: "SET", ingredients: searchIngred });
	}, []);

	useEffect(() => {
		if (!isLoading && !error && reqIdentifier === "REMOVE_INGREDIENT") {
			dispatch({ type: "DELETE", id: extra });
		} else if (!isLoading && !error && reqIdentifier === "ADD_INGREDIENT") {
			dispatch({
				type: "ADD",
				ingredient: { id: data.name, ...extra },
			});
		}
	}, [data, extra, reqIdentifier, isLoading, error]);

	const addIngredientHandler = useCallback(
		(ingredient) => {
			sendRequest(
				"https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients.json",
				"POST",
				JSON.stringify(ingredient),
				ingredient,
				"ADD_INGREDIENT",
			);
		},
		[sendRequest],
	);
	const removeIngredient = useCallback(
		async (ingredientId) => {
			sendRequest(
				`https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
				"DELETE",
				null,
				ingredientId,
				"REMOVE_INGREDIENT",
			);
		},
		[sendRequest],
	);
	const clearError = useCallback(() => {
		clear();
	}, [clear]);
	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredient}
				onRemoveItem={removeIngredient}
			/>
		);
	}, [userIngredient, removeIngredient]);
	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}> {error}</ErrorModal>}
			<IngredientForm
				onAddIngredent={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredients={SearchedIngredient} />
				{ingredientList}
			</section>
			<button onClick={isLogOutHandler}> LougOut</button>
		</div>
	);
}

export default Ingredients;
