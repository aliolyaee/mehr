import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Callback from "../Auth/Callback";
import Signin from "../Auth/Signin";
import SignUpForm from "../Components/SignUpForm";
import { classes } from "../Data/Layouts";
import LayoutRoutes from "../Route/LayoutRoutes";
import {
	authHeader,
	configureFakeBackend,
	handleResponse,
} from "../Services/fack.backend";
import { authRoutes } from "./AuthRoutes";
import PrivateRoute from "./PrivateRoute";

// setup fake backend
configureFakeBackend();
const Routers = () => {
	const login = useState(JSON.parse(localStorage.getItem("login")))[0];
	const [authenticated, setAuthenticated] = useState(false);
	const jwt_token = localStorage.getItem("token");
	const defaultLayoutObj = classes.find(
		(item) => Object.values(item).pop(1) === "compact-wrapper"
	);
	const layout =
		localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

	useEffect(() => {
		let abortController = new AbortController();
		const requestOptions = { method: "GET", headers: authHeader() };
		fetch("/users", requestOptions).then(handleResponse);

		setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
		console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
		console.disableYellowBox = true;
		return () => {
			abortController.abort();
		};
	}, []);

	return (
		// <BrowserRouter basename={"/"}>
		// 	<>
		// 		<Suspense fallback={<Loader />}>
		// 			<Routes>
		// 				<Route path={"/"} element={<PrivateRoute />}>
		// 					{login || authenticated || jwt_token ? (
		// 						<>

		// 							<Route
		// 								exact
		// 								path={`${process.env.REACT_APP_BASE_PATH}`}
		// 								element={
		// 									<Navigate
		// 										to={`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layout}`}
		// 									/>
		// 								}
		// 							/>

		// 							<Route
		// 								exact
		// 								path={`/`}
		// 								element={
		// 									<Navigate to={`${process.env.REACT_APP_BASE_PATH}/Dashboard`} />
		// 								}
		// 							/>
		// 						</>
		// 					) : (
		// 						""
		// 					)}
		// 					<Route path={`/*`} element={<LayoutRoutes />} />
		// 				</Route>
		// 				<Route
		// 					path={`${process.env.REACT_APP_BASE_PATH}/callback`}
		// 					render={() => <Callback />}
		// 				/>
		// 				<Route
		// 					exact
		// 					path={`${process.env.REACT_APP_BASE_PATH}/login`}
		// 					element={<Signin />}
		// 				/>
		// 				{authRoutes.map(({ path, Component }, i) => (
		// 					<Route path={path} element={Component} key={i} />
		// 				))}
		// 			</Routes>
		// 		</Suspense>
		// 	</>
		// </BrowserRouter>

		<BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
			<Routes>
				<Route path="/" element={<PrivateRoute />}>
					{(login || authenticated || jwt_token) && (
						<>
							<Route
								exact
								path=""
								element={<Navigate to={`/Dashboard/${layout}`} />}
							/>
							<Route exact path="/" element={<Navigate to="/Dashboard" />} />
						</>
					)}
					<Route path="/*" element={<LayoutRoutes />} />
				</Route>

				<Route path="/callback" element={<Callback />} />
				<Route exact path="/login" element={<Signin />} />
				<Route exact path="/signup" element={<SignUpForm />} />

				{authRoutes.map(({ path, Component }, i) => (
					<Route path={path} element={Component} key={i} />
				))}
			</Routes>
		</BrowserRouter>
	);
};

export default Routers;
