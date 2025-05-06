import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function OrderableProducts() {
	const [cats, setCat] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState();
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	let isMounted = true;
	//fake api to get category
	useEffect(() => {
		axios
			.get("https://jsonplaceholder.typicode.com/todos")
			.then((response) => {
				if (isMounted) setCat(response.data);
			})
			.catch((error) => {
				console.error("Axios error:", error);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	// datatable columns
	const columns = [
		{
			name: "کد محصول",
			selector: (row) => row.id,
			sortable: true,
			maxWidth: "120px",
		},
		{
			name: "نام محصول",
			selector: (row) => row.title,
			sortable: true,
		},
		{
			name: "توضیحات",
			selector: (row) => row.description,
			sortable: true,
			maxWidth: "150px",
		},
		{ name: "دسته بندی", selector: (row) => row.category, sortable: true },
		{
			name: "قیمت",
			selector: (row) => row.price,
			sortable: true,
			maxWidth: "150px",
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.price}</div>,
		},
		{
			name: "موجودی",
			selector: (row) => row.count,
			sortable: true,
			maxWidth: "150px",
			cell: (row) => (
				// <div style={{ whiteSpace: "nowrap" }}>{row.count}</div>
				<div style={{ whiteSpace: "nowrap" }}>{row.rating.count}</div>
			),
		},
	];

	//this function is for searching data in datatable
	const filteredData = products.filter(
		(row) =>
			row.title?.toLowerCase().includes(search.toLowerCase()) ||
			row.category?.toLowerCase().includes(search.toLowerCase()) ||
			row.description?.toLowerCase().includes(search.toLowerCase()) ||
			row.count?.toString().includes(search) ||
			row.price?.toString().includes(search) ||
			row.id?.toString().includes(search)
	);

	const openModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	//close modal
	const toggle = () => {
		setIsModalOpen(!isModalOpen);
	};

	//close btn for modal
	const externalCloseBtn = (
		<button
			type="button"
			className="close"
			style={{ position: "absolute", top: "15px", right: "15px" }}
			onClick={toggle}
		>
			&times;
		</button>
	);

	const options = cats.map((cat) => ({
		value: cat.title,
		label: cat.id + ". " + cat.title,
	}));

	const createNewCategory = async () => {
		try {
			const categoryData = {
				categoryName: newCategory,
				categoryParentName: selectedCategory?.value,
			};
			console.log("categoryData", categoryData);
			// const response = await axios.post("/api-route", categoryData);
			// toast.success("دسته‌بندی با موفقیت ایجاد شد!");
			setNewCategory("");
			setSelectedCategory(null);
			setIsModalOpen(!isModalOpen);
		} catch (error) {
			console.error("Error creating category:", error);
			toast.danger("خطا در ایجاد دسته بندی");
		}
	};

	return (
		<div className="px-4">
			<div className="form-group d-flex flex-column">
				<div className="row mx-1 mt-3">
					<Button
						className="col-md-2 ms-auto p-2 fw-bold"
						color="primary"
						onClick={() => openModal()}
					>
						ایجاد دسته‌بندی
					</Button>
				</div>
				<div className="mx-1 mb-4">
					<label className="fw-bold mt-4">نوع سفارش</label>
					<Select
						placeholder={"انتخاب نوع سفارش "}
						defaultValue={selectedCategory}
						onChange={(selectedOption) => {
							console.log(
								"selectedOption in orderable products",
								selectedOption
							);
							setSelectedCategory(selectedOption);
						}}
						options={options}
					/>
				</div>
			</div>
			{/* <input
				type="text"
				placeholder="جستجوی محصول"
				className="mt-4 mb-2 p-2 border border-gray-300 rounded"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/> */}
			<DataTable
				// title={<h5>محصولات قابل سفارش</h5>}
				columns={columns}
				data={filteredData}
				pagination
				highlightOnHover
				striped
				responsive
				subHeader
				subHeaderComponent={
					<div className="w-100 row d-flex justify-content-start">
						<input
							type="text"
							placeholder="جستجوی محصول"
							className="mt-4 mb-2 p-2 border border-gray-300 rounded col-md-2"
							value={search}
							style={{
								border: "1px solid #dee2e6",
								outline: "none",
							}}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				}
				paginationComponentOptions={{
					rowsPerPageText: "تعداد ردیف قابل نمایش در هر صفحه",
					rangeSeparatorText: "از",
					selectAllRowsItem: true,
					selectAllRowsItemText: "همه",
				}}
				noDataComponent={
					<div className="text-center p-3">داده ای برای نمایش یافت نشد!</div>
				}
			/>
			{isModalOpen && (
				<Modal
					isOpen={isModalOpen}
					toggle={toggle}
					external={externalCloseBtn}
					className="modal-dialog-centered"
				>
					<ModalHeader>ایجاد دسته‌بندی جدید</ModalHeader>
					<ModalBody>
						<form>
							<div className="form-group">
								<label className="fw-bold">نام دسته‌بندی</label>
								<input
									type="text"
									className="form-control mb-2"
									value={newCategory}
									onChange={(e) => {
										console.log("new cat name", e.target);
										setNewCategory(e.target.value);
									}}
								/>
								<label className="fw-bold"> انتخاب دسته‌بندی اصلی</label>
								<Select
									placeholder={""}
									defaultValue={selectedCategory}
									onChange={(selectedOption) => {
										console.log(
											"selectedOption in create new cat",
											selectedOption
										);
										setSelectedCategory(selectedOption);
									}}
									options={options}
								/>
							</div>
						</form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={createNewCategory}>
							ایجاد
						</Button>

						<Button color="secondary" onClick={toggle}>
							بستن
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</div>
	);
}

export default OrderableProducts;
