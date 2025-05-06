import React from "react";
import UserList from "../../UserList";
import { Breadcrumbs } from "../../../AbstractElements";

function Products() {
	return (
		<div>
			<Breadcrumbs
				mainTitle="مدیریت کاربران"
				parent="کاربران"
				title="مدیریت کاربران"
			/>
			<UserList />
		</div>
	);
}

export default Products;
