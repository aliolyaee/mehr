import Dashboard from "../Components/Pages/Dashboard/dashboard";
import Orderable from "../Components/Pages/OrderableProducts";
import Products from "../Components/Pages/Products/productLists";
import Users from "../Components/Pages/Users/users";

export const routes = [
	{
		path: `${process.env.REACT_APP_BASE_PATH}/Dashboard/:layout`,
		Component: <Dashboard />,
	},
	{
		path: `${process.env.REACT_APP_BASE_PATH}/products/productList/:layout`,
		Component: <Products />,
	},
	{
		path: `${process.env.REACT_APP_BASE_PATH}/products/orderableProduct/:layout`,
		Component: <Orderable />,
	},
	{
		path: `${process.env.REACT_APP_BASE_PATH}/users/usersList/:layout`,
		Component: <Users />,
	},
];
