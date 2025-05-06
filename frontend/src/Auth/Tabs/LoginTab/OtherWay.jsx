import React from "react";
import { Link } from "react-router-dom";
import { P } from "../../../AbstractElements";

const OtherWay = () => {
	return (
		<>
			<div className="d-flex align-items-center my-4">
				<div className="flex-grow-1 border-top"></div>
				<P attrPara={{ className: "px-3 mb-0 fw-bold text-muted" }}>
					<div
						style={{ color: "#000" }}
						to={`${process.env.REACT_APP_BASE_PATH}/signup`}
					>
						ایجاد حساب کاربری
					</div>
				</P>
				<div className="flex-grow-1 border-top"></div>
			</div>
			<P attrPara={{ className: "text-center my-4" }}>
				<Link
					className="ms-2 fw-bold"
					to={`${process.env.REACT_APP_BASE_PATH}/signup`}
				>
					ساخت حساب جديد
				</Link>
			</P>

		
		</>
	);
};

export default OtherWay;
