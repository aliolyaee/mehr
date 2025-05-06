import React, { useContext, useState } from "react";
import { Grid } from "react-feather";
import { Link } from "react-router-dom";
import { Image } from "../../AbstractElements";
import CustomizerContext from "../../_helper/Customizer";
import adminIcon from "../../assets/images/logo/admin.png";

const SidebarLogo = () => {
	const { mixLayout, toggleSidebar, layout, layoutURL } =
		useContext(CustomizerContext);
	const [toggle, setToggle] = useState(false);

	const openCloseSidebar = () => {
		setToggle(!toggle);
		toggleSidebar(toggle);
	};

	const layout1 = localStorage.getItem("sidebar_layout") || layout;

	return (
		<div className="logo-wrapper">
			{layout1 !== "compact-wrapper dark-sidebar" &&
			layout1 !== "compact-wrapper color-sidebar" &&
			mixLayout ? (
				<Link to={`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`}>
					<Image
						attrImage={{
							className: "img-fluid d-inline",
							src: `${adminIcon}`,
							alt: "",
							style: { width: "122px" },
						}}
					/>
				</Link>
			) : (
				<Link to={`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`}>
					<Image
						attrImage={{
							className: "img-fluid d-inline",
							src: `${adminIcon}`,
							alt: "",
							style: { width: "122px" },
						}}
					/>
				</Link>
			)}
			<div className="back-btn" onClick={() => openCloseSidebar()}>
				<i className="fa fa-angle-left"></i>
			</div>
			<div className="toggle-sidebar" onClick={openCloseSidebar}>
				<Grid className="status_toggle middle sidebar-toggle" />
			</div>
		</div>
	);
};

export default SidebarLogo;
