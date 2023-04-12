import React, { useEffect, useRef, useState } from "react";
import useHttp from "../hooks/http";
import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
	const [enteredValue, setEnteredValue] = useState("");
	const { isLoading, data, error, sendRequest, clear } = useHttp();
	const inputRef = useRef();
	const { onLoadIngredients } = props;
	const onChangeHandler = (event) => {
		setEnteredValue(event.target.value);
	};
	useEffect(() => {
		const timer = setTimeout(() => {
			if (enteredValue === inputRef.current.value) {
				const query =
					enteredValue.length === 0
						? ""
						: `?orderBy="title"&equalTo="${enteredValue}"`;

				const fetchData = async () => {
					sendRequest(
						"https://react-hook-summary-8c475-default-rtdb.firebaseio.com/ingredients.json" +
							query,
						"GET",
					);
				};
				fetchData();
			}
			return clearTimeout(timer);
		}, 0);
	}, [enteredValue, inputRef, sendRequest]);

	useEffect(() => {
		if (!isLoading && !error && data) {
			const loadedadata = [];
			for (const key in data) {
				loadedadata.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount,
				});
				// console.log(loadedadata);
				onLoadIngredients(loadedadata);
			}
		}
	}, [data, isLoading, error, onLoadIngredients]);
	return (
		<section className="search">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{isLoading && <span> Loading....</span>}
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
