import React, { Fragment } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import { Breadcrumbs,P } from "../../../AbstractElements";
import FollowerGrowth from "../Dashboard/Default/FollowerGrowth";
import OverallBalance from "../Dashboard/Default/OverallBalance";
// import HeaderCard from "../../Common/Component/HeaderCard";

const Dashboard = () => {
	return (
		<Fragment>
			<Breadcrumbs mainTitle="داشبورد" parent="داشبورد" />
			<Container fluid={true}>
				<FollowerGrowth />
				<Row>
					<Col
						sm="12"
						className="d-flex justify-content-center align-items-center"
					>
						{/* <OverallBalance /> */}
						<Card>
						
							<CardBody>
								<P>
									{
										"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
									}
								</P>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Dashboard;
