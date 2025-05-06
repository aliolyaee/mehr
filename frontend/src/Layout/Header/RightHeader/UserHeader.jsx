import React, { useContext, useEffect, useState } from "react";
import { LogIn, User } from "react-feather";
import { useNavigate } from "react-router-dom";
import man from "../../../assets/images/dashboard/profile.png";

import { useRef } from "react";
import { Image, LI, P, UL } from "../../../AbstractElements";
import { Account, Admin, LogOut } from "../../../Constant";
import CustomizerContext from "../../../_helper/Customizer";

const UserHeader = () => {
	const history = useNavigate();
	const [profile, setProfile] = useState("");
	const [name, setName] = useState("Emay Walter");
	const { layoutURL } = useContext(CustomizerContext);
	const authenticated = JSON.parse(localStorage.getItem("authenticated"));
	const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const profileRef = useRef(null);

	//close user menu when click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (profileRef.current && !profileRef.current.contains(event.target)) {
				setIsProfileMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setProfile(localStorage.getItem("profileURL") || man);
		setName(localStorage.getItem("Name") ? localStorage.getItem("Name") : name);
	}, []);

	const Logout = () => {
		console.log("herererereer");
		localStorage.removeItem("profileURL");
		localStorage.removeItem("token");
		localStorage.removeItem("auth0_profile");
		localStorage.removeItem("Name");
		localStorage.setItem("authenticated", false);
		localStorage.setItem("login", false);
		// history(`${process.env.REACT_APP_BASE_PATH}/login`);
		window.location.href = `${process.env.REACT_APP_BASE_PATH}/login`;
	};

	const UserMenuRedirect = (redirect) => {
		history(redirect);
	};

	return (
		// <li className="profile-nav onhover-dropdown pe-0 py-0">
		// 	<div
		// 		ref={profileRef}
		// 		className="media profile-media position-relative"
		// 		onClick={() => setIsProfileMenuOpen((prev) => !prev)}
		// 		style={{ cursor: "pointer" }}
		// 	>
		// 		<Image
		// 			attrImage={{
		// 				className: "b-r-10 m-0",
		// 				src: `${authenticated ? auth0_profile.picture : profile}`,
		// 				alt: "",
		// 			}}
		// 		/>
		// 		<div className="media-body">
		// 			<span>{authenticated ? auth0_profile.name : name}</span>
		// 			<P attrPara={{ className: "mb-0 font-roboto" }}>
		// 				{Admin} <i className="middle fa fa-angle-down"></i>
		// 			</P>
		// 		</div>
		// 	</div>
		// 	<UL
		// 		attrUL={{
		// 			className: `simple-list profile-dropdown shadow p-2 bg-white rounded`,
		// 			style: {
		// 				top: "40px",
		// 				position: "absolute",
		// 				zIndex: 8,
		// 				backgroundColor: "#fff",
		// 				display: isProfileMenuOpen ? "block" : "none",
		// 			},
		// 		}}
		//   >
		// 	{/* <UL
		// 		attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}
		// 	> */}
		// 		<LI
		// 			attrLI={{
		// 				onClick: () =>
		// 					UserMenuRedirect(
		// 						`${process.env.REACT_APP_BASE_PATH}/app/users/userProfile/${layoutURL}`
		// 					),
		// 			}}
		// 		>
		// 			<User />
		// 			<span>{Account} </span>
		// 		</LI>
		// 		{/* <LI
		//       attrLI={{
		//         onClick: () => UserMenuRedirect(`${process.env.REACT_APP_BASE_PATH}/app/email-app/${layoutURL}`),
		//       }}>
		//       <Mail />
		//       <span>{Inbox}</span>
		//     </LI>
		//     <LI
		//       attrLI={{
		//         onClick: () => UserMenuRedirect(`${process.env.REACT_APP_BASE_PATH}/app/todo-app/todo/${layoutURL}`),
		//       }}>
		//       <FileText />
		//       <span>{Taskboard}</span>
		//     </LI> */}
		// 		<LI attrLI={{ onClick: Logout }}>
		// 			<LogIn />
		// 			<span>{LogOut}</span>
		// 		</LI>
		// 	</UL>
		// </li>

		<li className="profile-nav pe-0 py-0">
			<div ref={profileRef} className="position-relative">
				<div
					className="media profile-media"
					onClick={() => setIsProfileMenuOpen((prev) => !prev)}
					style={{ cursor: "pointer" }}
				>
					<Image
						attrImage={{
							className: "b-r-10 m-0",
							src: `${authenticated ? auth0_profile.picture : profile}`,
							alt: "",
						}}
					/>
					<div className="media-body">
						<span>{authenticated ? auth0_profile.name : name}</span>
						<P attrPara={{ className: "mb-0 font-roboto" }}>
							{Admin} <i className="middle fa fa-angle-down"></i>
						</P>
					</div>
				</div>

				{/* Dropdown menu */}
				<UL
					attrUL={{
						className: `simple-list profile-dropdown shadow p-2 bg-white rounded`,
						style: {
							top: "40px",
							position: "absolute",
							zIndex: 8,
							display: isProfileMenuOpen ? "block" : "none",
							cursor: "pointer",
						},
					}}
				>
					<LI
						attrLI={{
							onClick: () =>
								UserMenuRedirect(
									`${process.env.REACT_APP_BASE_PATH}/app/users/userProfile/${layoutURL}`
								),
						}}
					>
						<User />
						<span>{Account} </span>
					</LI>
					<LI attrLI={{ onClick: Logout }}>
						<LogIn />
						<span>{LogOut}</span>
					</LI>
				</UL>
			</div>
		</li>
	);
};

export default UserHeader;
