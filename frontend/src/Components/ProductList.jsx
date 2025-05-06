import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ProductList = () => {
	//get data from backend
	let isMounted = true;

	useEffect(() => {
		axios
			.get("https://fakestoreapi.com/products")
			.then((response) => {
				if (isMounted) setProducts(response.data);
			})
			.catch((error) => {
				console.error("Error fetching products:", error);
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
			width: "120px",
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
			width: "150px",
		},
		{ name: "دسته بندی", selector: (row) => row.category, sortable: true },
		{
			name: "قیمت",
			selector: (row) => row.price,
			sortable: true,
			width: "150px",
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.price}</div>,
		},
		{
			name: "موجودی",
			selector: (row) => row.count,
			sortable: true,
			width: "150px",
			cell: (row) => (
				// <div style={{ whiteSpace: "nowrap" }}>{row.count}</div>
				<div style={{ whiteSpace: "nowrap" }}>{row.rating.count}</div>
			),
		},
		{
			name: "ابزارها",
			width: "150px",
			cell: (row) => (
				<div className="d-flex justify-content-center align-items-center">
					<span
						className="theme-text text-primary"
						style={{ cursor: "pointer", fontSize: "17px" }}
						onClick={() => showEditModal(row)}
					>
						<i className="fa fa-edit"></i>
					</span>
					<span
						className="theme-text text-primary mx-4"
						style={{ cursor: "pointer", fontSize: "17px" }}
						onClick={() => showProductDetail(row)}
					>
						<i className="fa fa-eye"></i>
					</span>
				</div>
			),
			ignoreRowClick: true,
		},
	];

	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [modal, setModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [cats, setCat] = useState([]);
	const [fileSrc, setFileSrc] = useState([]);

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

	//for open/close modal in only show detail mode
	const showEditModal = (row) => {
		setIsEdit(true);
		setModal(true);
		setSelectedProduct(row);
	};

	//for open/close modal in edit mode
	const showProductDetail = (product) => {
		setModal(true);
		setIsEdit(false);
		setSelectedProduct(product);
	};

	//edit data in database and localy
	const editProduct = async (row) => {
		console.log("row", row);
		const formData = new FormData();
		formData.append("id", row.id);
		formData.append("name", row.name);
		formData.append("description", row.description);
		formData.append("category", row.category);
		formData.append("count", row.count);
		formData.append("price", row.price);

		//to save image
		if (row.file) {
			formData.append("image", row.file);
		}

		//to save multi docs
		if (row.documents && row.documents.length > 0) {
			row.documents.forEach((file) => {
				formData.append("documents", file);
			});
		}

		//log formdata
		[...formData.entries()].forEach(([key, value]) => {
			console.log(key, value);
		});

		// send to api with axios
		// 	const { data } = await axios.put(
		// 		`/api/endpoint/${row.id}`,
		// 		formData,
		// 		{
		// 			headers: {
		// 				"Content-Type": "multipart/form-data",
		// 			},
		// 		}
		// 	);
		// 	console.log("PUT response:", data);
		// 	// آپدیت لیست محصولات
		// 	setProducts((prev) => prev.map((p) => (p.id === row.id ? row : p)));
		// 	setModal(false);
		// } catch (error) {
		// 	console.error("Error uploading:", error);
		// }

		//send to api with fetch
		// fetch(`/api/your-endpoint/${row.id}`, {
		// 	method: "PUT",
		// 	body: formData,
		// })
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		console.log("PUT response:", data);
		// 		setProducts((prev) => prev.map((p) => (p.id === row.id ? row : p)));
		// 		setModal(false);
		// 	})
		// 	.catch((err) => console.error("Error uploading:", err));

		setModal(!modal);
	};

	//close modal
	const toggle = () => {
		setModal(!modal);
		setIsEdit(false);
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

	//hndle documents function
	const handleDocuments = (e) => {
		if (!e.target.files) return;
		const filesArray = Array.from(e.target.files);

		setSelectedProduct((prev) => ({
			...prev,
			documents: filesArray,
		}));
	};

	//option of category select box
	const options = cats.map((cat) => ({
		value: cat.title,
		label: cat.id + ". " + cat.title,
	}));

	return (
		<div className="p-4">
			{/* <input
				type="text"
				placeholder="جستجوی محصول"
				className="mb-4 p-2 border border-gray-300 rounded"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/> */}
			<DataTable
				title={<h5>لیست محصولات</h5>}
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
							className="mb-4 p-2 border border-gray-300 rounded col-md-2"
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
			{modal && (
				<Modal
					isOpen={modal}
					toggle={toggle}
					external={externalCloseBtn}
					className="modal-dialog-centered modal-xl"
				>
					<ModalHeader>
						{isEdit ? "ویرایش محصول" : "مشاهده جزئیات محصول"}
					</ModalHeader>
					<ModalBody>
						{selectedProduct &&
							(isEdit ? (
								<form>
									<div className="row">
										{/* code */}
										<div className="form-group  col-md-6">
											<label className="fw-bold">کد محصول</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedProduct.id}
												onChange={() => {}}
											/>
										</div>
										{/* name */}
										<div className="form-group  col-md-6">
											<label className="fw-bold">نام</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedProduct.title}
												onChange={(e) =>
													setSelectedProduct({
														...selectedProduct,
														title: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div className="row">
										{/* count */}
										<div className="form-group col-md-6">
											<label className="fw-bold">موجودی</label>
											<input
												type="number"
												className="form-control mb-2"
												value={selectedProduct.count}
												onChange={(e) =>
													setSelectedProduct({
														...selectedProduct,
														count: e.target.value,
													})
												}
											/>
										</div>
										{/* price */}
										<div className="form-group col-md-6">
											<label className="fw-bold">قیمت</label>
											<input
												type="number"
												className="form-control mb-2"
												value={selectedProduct.price}
												onChange={(e) =>
													setSelectedProduct({
														...selectedProduct,
														price: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div className="row">
										{/* category */}
										<div className="form-group col-md-6">
											<label className="fw-bold">دسته‌بندی</label>
											{/* <select
												className="form-control mb-2"
												value={selectedProduct.category}
												onChange={(e) =>
													setSelectedProduct({
														...selectedProduct,
														category: e.target.value,
													})
												}
											>
												{cats.map((cat) => (
													<option key={cat.id} value={cat.title}>
														{cat.title}
													</option>
												))}
											</select> */}
											<Select
												placeholder={selectedProduct.category}
												className="mb-2"
												value={options.find(
													(opt) => opt.value === selectedProduct.category
												)}
												onChange={(selectedOption) => {
													console.log("selectedOption", selectedOption);
													setSelectedProduct({
														...selectedProduct,
														category: selectedOption
															? selectedOption.value
															: "",
													});
												}}
												options={options}
											/>
										</div>
										{/* image */}
										{/* <div className="form-group col-md-6">
											<label className="fw-bold">عکس محصول</label>

											show the current product image
											{selectedProduct.image ? (
												<div className="mb-2">
													<img
														src={selectedProduct.image}
														alt="عکس محصول"
														style={{
															width: "50px",
															height: "auto",
															borderRadius: "8px",
														}}
													/>
												</div>
											) : (
												<p className="text-muted">
													برای این محصول عکسی ثبت نشده است.
												</p>
											)}

											upload new product image
											<input
												type="file"
												className="form-control"
												onChange={(e) => {
													const file = e.target.files[0];
													if (file) {
														setSelectedProduct({
															...selectedProduct,
															image: URL.createObjectURL(file),
															file: file,
														});
													}
												}}
											/>
										</div> */}
										<div className="form-group col-md-6">
											<label className="fw-bold">عکس محصول</label>

											{/* current product image*/}
											{selectedProduct.image ? (
												<div className="mb-2">
													<img
														src={selectedProduct.image}
														alt="عکس محصول"
														style={{
															width: "50px",
															height: "auto",
															borderRadius: "8px",
															cursor: "pointer",
														}}
														onClick={() =>
															document.getElementById("imageInput").click()
														}
													/>
												</div>
											) : (
												<p className="text-muted">
													برای این محصول عکسی ثبت نشده است.
												</p>
											)}

											{/* hidden input to get new product image*/}
											<input
												type="file"
												id="imageInput"
												className="form-control d-none"
												onChange={(e) => {
													const file = e.target.files[0];
													if (file) {
														setSelectedProduct({
															...selectedProduct,
															image: URL.createObjectURL(file),
															file: file,
														});
													}
												}}
											/>
										</div>
									</div>
									<div className="row">
										{/* upload files*/}
										<div className="form-group col-md-6">
											<label className="fw-bold">آپلود فایل</label>
											<input
												onChange={handleDocuments}
												type="file"
												name="documents"
												multiple
												className="form-control mb-2"
											/>
											{fileSrc.map((name, index) => (
												<div key={index}>
													<p className="text-xs p-2">
														{++index}- {name}
													</p>
												</div>
											))}
										</div>
										{/* description */}
										<div className="form-group col-md-6">
											<label className="fw-bold">توضیحات</label>
											<textarea
												className="form-control mb-2"
												rows="4"
												value={selectedProduct.description}
												onChange={(e) =>
													setSelectedProduct({
														...selectedProduct,
														description: e.target.value,
													})
												}
											/>
										</div>
									</div>
								</form>
							) : (
								<form>
									<div className="row">
										{/* code */}
										<div className="col-md-6">
											<label className="fw-bold">کد محصول</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedProduct.id}
												disabled
											/>
										</div>
										{/* name */}
										<div className="col-md-6">
											<label className="fw-bold">نام</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedProduct.title}
												disabled
											/>
										</div>
									</div>

									<div className="row">
										{/* count */}
										<div className="col-md-6">
											<label className="fw-bold">موجودی</label>
											<input
												type="number"
												className="form-control mb-2"
												value={selectedProduct.count}
												disabled
											/>
										</div>
										{/* price */}
										<div className=" col-md-6">
											<label className="fw-bold">قیمت</label>
											<input
												type="number"
												className="form-control mb-2"
												value={selectedProduct.price}
												disabled
											/>
										</div>
									</div>

									<div className="row">
										{/* category */}
										<div className="col-md-6">
											<label className="fw-bold">دسته‌بندی</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedProduct.category}
												disabled
											/>
										</div>
										{/* image */}
										<div className="col-md-6">
											<label className="fw-bold">عکس محصول</label>

											{/* نمایش عکس فعلی */}
											{selectedProduct.image ? (
												<div className="mb-2">
													<img
														src={selectedProduct.image}
														alt="عکس محصول"
														style={{
															width: "50px",
															height: "auto",
															borderRadius: "8px",
														}}
													/>
												</div>
											) : (
												<p className="text-muted">
													عکسی برای این محصول ثبت نشده است.
												</p>
											)}
										</div>
									</div>
									{/* description */}
									<div>
										<label className="fw-bold">توضیحات</label>
										<textarea
											className="form-control mb-2"
											rows="4"
											value={selectedProduct.description}
											disabled
										/>
									</div>
								</form>
							))}
					</ModalBody>
					<ModalFooter>
						{isEdit ? (
							<Button
								color="primary"
								onClick={() => editProduct(selectedProduct)}
							>
								ویرایش
							</Button>
						) : null}
						<Button color="secondary" onClick={toggle}>
							بستن
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</div>
	);
};

export default ProductList;
