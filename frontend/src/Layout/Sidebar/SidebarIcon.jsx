import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CustomizerContext from "../../_helper/Customizer";
import cubaimg from "../../assets/images/logo/logo-icon.png";

const SidebarIcon = () => {
	const { layoutURL } = useContext(CustomizerContext);
	return (
		<div className="logo-icon-wrapper">
			<Link
				to={`${process.env.REACT_APP_BASE_PATH}/pages/sample-page/${layoutURL}`}
			>
				<img className="img-fluid" src={cubaimg} alt="" />
			</Link>
		</div>
	);
};

export default SidebarIcon;
