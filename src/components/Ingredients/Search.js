import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
	const [enteredValue, setEnteredValue] = useState("");
	const inputRef = useRef();
	const { onLoadIngredients } = props;
	const onChangeHandler = (event) => {
		setEnteredValue(event.target.value);
	};
	useEffect(() => {
		setTimeout(() => {
			if (enteredValue === inputRef.current.value) {
				const query =
					enteredValue.length === 0
						? ""
						: `?orderBy="title"&equalTo="${enteredValue}"`;

				const fetchData = async () => {
					const response = await fetch(
						"https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients.json" +
							query,
					);
					if (!response.ok) {
						return console.log("null");
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
						onLoadIngredients(loadedadata);
					}
				};
				fetchData();
			}
		}, 0);
	}, [enteredValue, onLoadIngredients, inputRef]);
	return (
		<section className="search">
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					<input
						type="text"
						ref={inputRef}
						value={enteredValue}
						onChange={onChangeHandler}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
