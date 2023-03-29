import React, { useEffect, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
	const [userIngredient, setUserIngredient] = useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				"https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients.json",
			);
			if (!response.ok) {
				return;
			}
			const responseData = await response.json();
			const loadedadata = [];
			for (const key in responseData) {
				loadedadata.push({
					id: key,
					title: responseData[key].title,
					amount: responseData[key].amount,
				});
				// console.log(loadedadata);
				setUserIngredient(loadedadata);
			}
		};
		fetchData();
	}, []);
	async function getEnteredUserIngredient(ingredient) {
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
			const getRest = await response.json();
			setUserIngredient((prev) => [
				...prev,
				{ id: getRest.name, ...ingredient },
			]);
			console.log(getRest);
		}
	}

	const removeIngredient = (ingredientId) => {
		setUserIngredient((prev) =>
			prev.filter((ingredient) => ingredient.id !== ingredientId),
		);
	};
	return (
		<div className="App">
			<IngredientForm onAddIngredent={getEnteredUserIngredient} />

			<section>
				<Search />
				<IngredientList
					ingredients={userIngredient}
					onRemoveItem={removeIngredient}
				/>
			</section>
		</div>
	);
}

export default Ingredients;
