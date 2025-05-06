import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import SvgIcon from "../../Components/Common/Component/SvgIcon";
import CustomizerContext from "../../_helper/Customizer";
import H6 from "../Headings/H6Element";

const Breadcrumbs = (props) => {
	const { layoutURL } = useContext(CustomizerContext);
	return (
		<Fragment>
			<Container fluid={true} style={{ padding: "23px" }}>
				<div className="page-title m-0">
					<Row>
						<Col xs="6">
							<H6>{props.mainTitle}</H6>
						</Col>
						<Col xs="6">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									<Link
										to={`${process.env.REACT_APP_BASE_PATH}/Dashboard/${layoutURL}`}
									>
										<SvgIcon iconId="stroke-home" />
									</Link>
								</li>
								<li className="breadcrumb-item">{props.parent}</li>
								{props.subParent ? (
									<li className="breadcrumb-item">{props.subParent}</li>
								) : (
									""
								)}
								<li className="breadcrumb-item active">{props.title}</li>
							</ol>
						</Col>
					</Row>
				</div>
			</Container>
		</Fragment>
	);
};

export default Breadcrumbs;
