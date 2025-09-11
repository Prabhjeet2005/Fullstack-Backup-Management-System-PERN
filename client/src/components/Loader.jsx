import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ isLoading }) => {
	return (
		<>
			{isLoading && (
				<>
					<Spinner animation="border loader" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</>
			)}
		</>
	);
};

export default Loader;
