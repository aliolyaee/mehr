import React, { Fragment, useContext, useLayoutEffect, useState } from "react";
import { AlignCenter } from "react-feather";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { Image } from "../../../AbstractElements";
import CustomizerContext from "../../../_helper/Customizer";

const Leftbar = () => {
	const { layoutURL, toggleSidebar } = useContext(CustomizerContext);
	const [sidebartoggle, setSidebartoggle] = useState(true);
	const width = useWindowSize();

	function useWindowSize() {
		const [size, setSize] = useState([0, 0]);
		useLayoutEffect(() => {
			function updateSize() {
				setSize(window.innerWidth);
				if (window.innerWidth <= 1007) {
					toggleSidebar(true);
					document.querySelector(".page-wrapper").className =
						"page-wrapper compact-wrapper";
				} else {
					toggleSidebar(false);
				}
			}
			window.addEventListener("resize", updateSize);
			updateSize();
			return () => window.removeEventListener("resize", updateSize);
		}, []);
		return size;
	}

	// const responsive_openCloseSidebar = (toggle) => {
	//   if (width <= 991) {
	//     document.querySelector('.page-header').className = 'page-header';
	//     document.querySelector('.sidebar-wrapper').className = 'sidebar-wrapper ';
	//     document.querySelector('.bg-overlay').classList.add('active');
	//   } else {
	//     if (toggle) {
	//       setSidebartoggle(!toggle);
	//       document.querySelector('.page-header').className = 'page-header close_icon';
	//       document.querySelector('.sidebar-wrapper').className = 'sidebar-wrapper close_icon ';
	//       document.querySelector('.mega-menu-container').classList.remove('d-block');
	//     } else {
	//       setSidebartoggle(!toggle);
	//       document.querySelector('.page-header').className = 'page-header';
	//       document.querySelector('.sidebar-wrapper').className = 'sidebar-wrapper ';
	//     }
	//   }
	// };

	const responsive_openCloseSidebar = (toggle) => {
		const pageHeader = document.querySelector(".page-header");
		const sidebarWrapper = document.querySelector(".sidebar-wrapper");
		const megaMenuContainer = document.querySelector(".mega-menu-container");
		const bgOverlay = document.querySelector(".bg-overlay");
		console.log("pageHeader", pageHeader);
		console.log("sidebarWrapper", sidebarWrapper);
		console.log("megaMenuContainer", megaMenuContainer);
		console.log("bgOverlay", bgOverlay);

		if (width <= 991) {
			if (pageHeader) pageHeader.className = "page-header";
			if (sidebarWrapper) sidebarWrapper.className = "sidebar-wrapper ";
			if (bgOverlay) bgOverlay.classList.add("active");
		} else {
			if (toggle) {
				setSidebartoggle(!toggle);
				if (pageHeader) pageHeader.className = "page-header close_icon";
				if (sidebarWrapper)
					sidebarWrapper.className = "sidebar-wrapper close_icon ";
				if (megaMenuContainer) megaMenuContainer.classList.remove("d-block");
			} else {
				setSidebartoggle(!toggle);
				if (pageHeader) pageHeader.className = "page-header";
				if (sidebarWrapper) sidebarWrapper.className = "sidebar-wrapper ";
			}
		}
	};

	return (
		<Fragment>
			<Col className="header-logo-wrapper col-auto p-0" id="out_side_click">
				<div className="logo-wrapper">
					<Link
						to={`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`}
					>
						<Image
							attrImage={{
								className: "img-fluid for-light",
								src: `${require("../../../assets/images/logo/logo.png")}`,
								alt: "",
							}}
						/>
						<Image
							attrImage={{
								className: "img-fluid for-dark",
								src: `${require("../../../assets/images/logo/logo_dark.png")}`,
								alt: "",
							}}
						/>
					</Link>
				</div>
				<div
					className="toggle-sidebar"
					onClick={() => responsive_openCloseSidebar(sidebartoggle)}
					style={
						window.innerWidth <= 991
							? { display: "block" }
							: { display: "none" }
					}
				>
					<AlignCenter
						className="status_toggle middle sidebar-toggle"
						id="sidebar-toggle"
					/>
				</div>
			</Col>
			{/* <Col xxl='5' xl='6' lg='5' md='4' sm='3' className='left-header p-0'>
        <NotificationSlider />
      </Col> */}
		</Fragment>
	);
};

export default Leftbar;
