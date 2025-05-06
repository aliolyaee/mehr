import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Btn, H4 } from "../AbstractElements";
import { EmailAddress, Password, reEnterPassword } from "../Constant";

function SignUpTab() {
	const history = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [reEnterpassword, setReEnterPassword] = useState("");
	const [togglePassword, setTogglePassword] = useState(false);

	const CreateNewAccount = async (e) => {
		console.log("create new account");
		// e.preventDefault();
		// setValue(man);
		// setName("Emay Walter");
		// if (email !== "" && password !== "") {
		// 	localStorage.setItem("login", JSON.stringify(true));
		// 	history(`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`);
		// }
	};

	return (
		<Fragment>
			<Form className="theme-form">
				<H4>ساخت حساب کاربری</H4>
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
				<FormGroup className="position-relative">
					<Label className="col-form-label text-end d-block">
						{reEnterPassword}
					</Label>
					<div className="position-relative">
						<Input
							className="form-control"
							type={togglePassword ? "text" : "password"}
							onChange={(e) => setReEnterPassword(e.target.value)}
							value={reEnterpassword}
						/>
						<div
							className="show-hide"
							onClick={() => setTogglePassword(!togglePassword)}
						>
							<span className={togglePassword ? "" : "show"}></span>
						</div>
					</div>
				</FormGroup>
				<Btn
					attrBtn={{
						color: "primary",
						className: "d-block w-100 mt-5",
						onClick: (e) => CreateNewAccount(e),
					}}
				>
					ایجاد حساب
				</Btn>
				<Btn
					attrBtn={{
						color: "success",
						className: "d-block w-100 mt-4",
						onClick: ()=>{history(`${process.env.REACT_APP_BASE_PATH}/login`);},
					}}
				>
					بازگشت به صفحه ورود
				</Btn>
			</Form>
		</Fragment>
	);
}

export default SignUpTab;
