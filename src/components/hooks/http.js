import { useCallback, useReducer } from "react";

const initialState = {
	loading: false,
	error: null,
	data: null,
	extra: null,
	identifier: null,
};
const httpReducer = (currHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return {
				loading: true,
				error: null,
				data: null,
				extra: null,
				identifier: action.identifier,
			};
		case "RESPONSE":
			return {
				...currHttpState,
				loading: false,
				data: action.responseData,
				extra: action.extra,
				error: null,
			};
		case "ERROR":
			return { loading: false, error: action.error };
		case "CLEAR":
			return initialState;
		default:
			throw new Error("Should not be reached");
	}
};
const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

	const clear = () => {
		dispatchHttp({ type: "CLEAR" });
	};
	const sendRequest = useCallback(
		async (url, method, body, extra, reqIdentifier, error) => {
			dispatchHttp({ type: "SEND", identifier: reqIdentifier });

			const response = await fetch(url, {
				method: method,
				body: body,
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				dispatchHttp({ type: "ERROR", error });
			} else {
				const responseData = await response.json();
				dispatchHttp({
					type: "RESPONSE",
					responseData: responseData,
					extra: extra,
				});
			}
		},
		[],
	);
	return {
		isLoading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
		extra: httpState.extra,
		reqIdentifier: httpState.identifier,
		clear: clear,
	};
};

export default useHttp;
