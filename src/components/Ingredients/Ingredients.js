import React, { useCallback, useReducer } from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
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

const httpReducer = (currHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null };
		case "RESPONSE":
			return { ...currHttpState, loading: false };
		case "ERROR":
			return { loading: false, error: action.errorData };
		case "CLEAR":
			return { ...currHttpState, error: null };
		default:
			throw new Error("Should not be reached");
	}
};
function Ingredients() {
	const [userIngredient, dispatch] = useReducer(ingredientReducer, []);
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	});

	const SearchedIngredient = useCallback((searchIngred) => {
		dispatch({ type: "SET", ingredients: searchIngred });
	}, []);

	async function getEnteredUserIngredient(ingredient) {
		// setIsLoading(true);
		dispatchHttp({ type: "SEND" });
		const response = await fetch(
			"https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients.json",
			{
				method: "POST",
				body: JSON.stringify(ingredient),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			<p> Sorry Something went Wrong</p>;
		} else {
			dispatchHttp({ type: "RESPONSE" });
			const getRest = await response.json();

			dispatch({
				type: "ADD",
				ingredient: { id: getRest.name, ...ingredient },
			});
		}
	}

	const removeIngredient = async (ingredientId) => {
		// setIsLoading(true);
		dispatchHttp({ type: "SEND" });

		try {
			const response = await fetch(
				`https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
				{
					method: "DELETE",
				},
			);
			if (!response.ok) {
				console.log("Something went Wrong");
			}
			// console.log(response);
		} catch (err) {
			dispatchHttp({ type: "ERROR", errorData: "Something went 	Wrond" });
			return;
		}

		// if (!response.ok) {
		// 	setError("Something Went Wrong");
		// }
		// setIsLoading(false);
		dispatchHttp({ type: "RESPONSE" });

		// 	setUserIngredient((prev) =>
		// 		prev.filter((ingredient) => ingredient.id !== ingredientId),
		// 	);

		dispatch({ type: "DELETE", id: ingredientId });
	};
	const clearError = () => {
		dispatchHttp({ type: "CLEAR" });
	};
	return (
		<div className="App">
			{httpState.error && (
				<ErrorModal onClose={clearError}> {httpState.error}</ErrorModal>
			)}
			<IngredientForm
				onAddIngredent={getEnteredUserIngredient}
				loading={httpState.loading}
			/>

			<section>
				<Search onLoadIngredients={SearchedIngredient} />
				<IngredientList
					ingredients={userIngredient}
					onRemoveItem={removeIngredient}
				/>
			</section>
		</div>
	);
}

export default Ingredients;
