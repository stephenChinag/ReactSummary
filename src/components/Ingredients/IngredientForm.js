import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
	const [inputeTitle, setInputeTitle] = useState("");
	const [inputeAmount, setInputeAmount] = useState(0);
	const submitHandler = (event) => {
		event.preventDefault();

		props.onAddIngredent({ title: inputeTitle, amount: inputeAmount });
	};

	const onChangeAmountHandler = (e) => {
		setInputeAmount(e.target.value);
	};
	const onChangeTitle = (e) => {
		setInputeTitle(e.target.value);
	};
	return (
		<section className="ingredient-form">
			<Card>
				<form onSubmit={submitHandler}>
					<div className="form-control">
						<label htmlFor="title">Name</label>
						<input
							type="text"
							id="title"
							value={inputeTitle}
							onChange={onChangeTitle}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="amount">Amount</label>
						<input
							type="number"
							id="amount"
							value={inputeAmount}
							onChange={onChangeAmountHandler}
						/>
					</div>
					<div className="ingredient-form__actions">
						<button type="submit">Add Ingredient</button>
					</div>
				</form>
			</Card>
		</section>
	);
});

export default IngredientForm;
