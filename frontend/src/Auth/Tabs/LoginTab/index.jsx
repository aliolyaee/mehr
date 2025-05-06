import React, { Fragment, useContext, useEffect, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Btn, H4 } from "../../../AbstractElements";
import {
	EmailAddress,
	ForgotPassword,
	LoginWithJWT,
	Password,
	SignIn,
} from "../../../Constant";

import { useNavigate } from "react-router-dom";
import { Jwt_token } from "../../../Config/Config";
import { handleResponse } from "../../../Services/fack.backend";
import man from "../../../assets/images/dashboard/profile.png";

import CustomizerContext from "../../../_helper/Customizer";
import OtherWay from "./OtherWay";

const LoginTab = ({ selected }) => {
	const history = useNavigate();
	const [email, setEmail] = useState("test@gmail.com");
	const [password, setPassword] = useState("test123");
	const [togglePassword, setTogglePassword] = useState(false);
	const { layoutURL } = useContext(CustomizerContext);
	const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
	const [name, setName] = useState(localStorage.getItem("Name"));

	useEffect(() => {
		localStorage.setItem("profileURL", man);
		localStorage.setItem("Name", "Emay Walter");
	}, [value, name]);

	const loginAuth = async (e) => {
		e.preventDefault();
		setValue(man);
		setName("Emay Walter");
		if (email !== "" && password !== "") {
			localStorage.setItem("login", JSON.stringify(true));
			history(`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`);
		}
	};

	const loginWithJwt = (e) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: { email, password },
		};

		return fetch("/users/authenticate", requestOptions)
			.then(handleResponse)
			.then((user) => {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				setValue(man);
				setName("Emay Walter");
				localStorage.setItem("token", Jwt_token);
				window.location.href = `${process.env.REACT_APP_BASE_PATH}/pages/sample-page/${layoutURL}`;
				return user;
			});
	};

	return (
		<Fragment>
			<Form className="theme-form">
				<H4>
					{selected === "simpleLogin" ? "ورود به پنل" : "Sign In With Jwt"}
				</H4>
				{/* <P>{"Enter your email & password to login"}</P> */}
				<FormGroup>
					<Label className="col-form-label text-end d-block">
						{EmailAddress}
					</Label>
					<Input
						className="form-control"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</FormGroup>
				<FormGroup className="position-relative">
					<Label className="col-form-label text-end d-block">{Password}</Label>
					<div className="position-relative">
						<Input
							className="form-control"
							type={togglePassword ? "text" : "password"}
							onChange={(e) => setPassword(e.target.value)}
							value={password}
						/>
						<div
							className="show-hide"
							onClick={() => setTogglePassword(!togglePassword)}
						>
							<span className={togglePassword ? "" : "show"}></span>
						</div>
					</div>
				</FormGroup>
				<div className="position-relative form-group mb-0">
					<div className="checkbox">
						<Input id="checkbox1" type="checkbox" />
						{/* <Label className="text-muted" for="checkbox1">
							{RememberPassword}
						</Label> */}
					</div>
					<a className="link" href="#javascript">
						{ForgotPassword}
					</a>
					{selected === "simpleLogin" ? (
						<Btn
							attrBtn={{
								color: "primary",
								className: "d-block w-100 my-5",
								onClick: (e) => loginAuth(e),
							}}
						>
							{SignIn}
						</Btn>
					) : (
						<Btn
							attrBtn={{
								color: "primary",
								className: "d-block w-100 mt-2",
								onClick: (e) => loginWithJwt(e),
							}}
						>
							{LoginWithJWT}
						</Btn>
					)}
				</div>
				<OtherWay />
			</Form>
		</Fragment>
	);
};

export default LoginTab;
