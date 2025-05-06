import React from "react";
import OrderableProducts from "../../OrderableProducts";
import { Breadcrumbs } from "../../../AbstractElements";

function Orderable() {
	return (
		<div>
			<Breadcrumbs mainTitle="محصولات قابل سفارش" parent="محصولات" title="قابل سفارش" />
			<OrderableProducts />
		</div>
	);
}

export default Orderable;
