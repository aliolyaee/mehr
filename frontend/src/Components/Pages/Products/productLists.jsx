import React from "react";
import { Breadcrumbs } from "../../../AbstractElements.jsx";
import ProductList from "../../ProductList";

function Products() {
	return (
		<div>
			<Breadcrumbs mainTitle="مدیریت محصولات" parent="محصولات" title="لیست محصولات" />
			<ProductList />
		</div>
	);
}

export default Products;
