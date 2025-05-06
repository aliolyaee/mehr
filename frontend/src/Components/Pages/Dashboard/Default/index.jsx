import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";

import OverallBalance from "./OverallBalance";


const Dashboard = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle="Default" parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
      
          <OverallBalance />
        
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
