export const MENUITEMS = [
	{
		menutitle: "",
		menucontent: "Dashboards,Widgets",
		Items: [
			{
				title: "داشبورد",
				icon: "sample-page",
				type: "link",
				path: `${process.env.REACT_APP_BASE_PATH}/Dashboard`,
			},
			{
				title: "محصولات",
				icon: "sample-page",
				type: "sub",
				children: [
					{
						active: false,
						path: `${process.env.REACT_APP_BASE_PATH}/products/productList`,
						title: "لیست محصولات",
						type: "link",
					},
					{
						active: false,
						path: `${process.env.REACT_APP_BASE_PATH}/products/orderableProduct`,
						title: "قابل سفارش",
						type: "link",
					},
				],
			},
			{
				title: "کاربران",
				icon: "user",
				type: "sub",
				children: [
					{
						active: false,
						path: `${process.env.REACT_APP_BASE_PATH}/users/usersList`,
						title: "مدیریت کاربران",
						type: "link",
					},
				],
			},
		],
	},
];

// export const MENUITEMS = [
// 	{
// 		menutitle: "",
// 		menucontent: "Dashboards,Widgets",
// 		Items: [
// 			{
// 				title: "داشبورد",
// 				icon: "sample-page",
// 				type: "link",
// 				path: `${process.env.REACT_APP_BASE_PATH}/Dashboard`,
// 			},
// 			{
// 				title: "محصولات",
// 				icon: "sample-page",
// 				type: "sub",
// 				children: [
// 					{
// 						active: false,
// 						path: `${process.env.REACT_APP_BASE_PATH}/products/productList`,
// 						title: "لیست محصولات",
// 						type: "link",
// 					},
// 					{
// 						active: false,
// 						path: `${process.env.REACT_APP_BASE_PATH}/products/orderableProduct`,
// 						title: "قابل سفارش",
// 						type: "link",
// 					},
// 				],
// 			},
// 			{
// 				title: "کاربران",
// 				icon: "user",
// 				type: "sub",
// 				children: [
// 					{
// 						active: false,
// 						path: `${process.env.REACT_APP_BASE_PATH}/users/usersList`,
// 						title: "مدیریت کاربران",
// 						type: "link",
// 					},
// 				],
// 			},
// 		],
// 	},
// ];
