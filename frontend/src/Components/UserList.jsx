import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const UsersList = () => {
	//get data from backend
	let isMounted = true;

	useEffect(() => {
		axios
			.get("https://jsonplaceholder.typicode.com/users")
			.then((response) => {
				if (isMounted) setUsers(response.data);
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	// table columns
	const columns = [
		{
			name: "کد کاربر",
			selector: (row) => row.id,
			sortable: true,
			// width: "120px",
		},
		{
			name: "نام نماینده",
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: "کد ملی",
			selector: (row) => row.username,
			sortable: true,
			// width: "120px",
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.username}</div>,
		},
		{
			name: "نقش",
			selector: (row) => row.email,
			sortable: true,
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.email}</div>,
		},
		{
			name: "سطح",
			selector: (row) => row.phone,
			sortable: true,
			width: "150px",
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.phone}</div>,
		},
		{
			name: "سابقه کاری",
			selector: (row) => row.website,
			sortable: true,
			cell: (row) => <div style={{ whiteSpace: "nowrap" }}>{row.website}</div>,
		},
		{
			name: "دسترسی به پنل",
			selector: (row) => row.price,
			sortable: true,
			cell: (row) => (
				<div style={{ whiteSpace: "nowrap" }}>
					{row.id <= 5 ? (
						<span style={{ color: "green" }}>فعال</span>
					) : (
						<span style={{ color: "red" }}>غیر فعال</span>
					)}
				</div>
			),
		},
		{
			name: "ابزارها",
			cell: (row) => (
				<div className="d-flex justify-content-center align-items-center">
					<span
						className="theme-text text-primary"
						style={{ cursor: "pointer", fontSize: "17px" }}
						onClick={() => showProductDetail(row)}
					>
						<i className="fa fa-eye"></i>
					</span>
					<span
						className="theme-text text-primary mx-3"
						style={{ cursor: "pointer", fontSize: "17px" }}
						onClick={() => showEditModal(row)}
					>
						<i className="fa fa-edit"></i>
					</span>

					<span
						className="theme-text text-danger"
						style={{ cursor: "pointer", fontSize: "17px" }}
						onClick={() => showDeleteUserModal(row)}
					>
						<i className="fa fa-trash-o"></i>
					</span>
				</div>
			),
			ignoreRowClick: true,
		},
	];

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [modal, setModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [cats, setCat] = useState([]);
	const [fileSrc, setFileSrc] = useState([]);
	const [isNewUser, setIsNewUser] = useState(false);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [selectedFilters, setSelectedFilters] = useState({
		role: "",
		grade: "",
		history: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		nationalCode: "",
		role: "",
		grade: "",
		userImage: "",
		history: "",
		status: false,
		newDocuments: [],
	});

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

	//send filter options to render table
	const applyFilters = async () => {
		console.log("filtering");
		// try {
		// 	const response = await axios.post(
		// 		"https://api-url.com/filter-users",
		// 		selectedFilters
		// 	);
		// 	setFilteredUsers(response.data);
		// } catch (error) {
		// 	console.error("Error filtering users:", error);
		// }
	};

	//this function is for searching data in datatable
	const searchTableData = (
		filteredUsers.length > 0 ? filteredUsers : users
	).filter(
		(user) =>
			user.name?.toLowerCase().includes(search.toLowerCase()) ||
			user.username?.toLowerCase().includes(search.toLowerCase()) ||
			user.email?.toLowerCase().includes(search.toLowerCase()) ||
			user.phone?.toString().includes(search.toLowerCase()) ||
			user.website?.toString().includes(search.toLowerCase()) ||
			user.id?.toString().includes(search)
	);

	//for open/close modal in only show detail mode
	const showEditModal = (row) => {
		setIsEdit(true);
		setModal(true);
		setSelectedUser(row);
	};

	//for open/close modal in edit mode
	const showProductDetail = (product) => {
		setModal(true);
		setIsEdit(false);
		setSelectedUser(product);
	};

	//edit data in database and localy
	const editUser = (row) => {
		const editData = new FormData();

		editData.append("id", row.id);
		editData.append("name", row.name);
		editData.append("username", row.username);
		editData.append("email", row.email);
		editData.append("website", row.website);
		editData.append("phone", row.phone);

		//to save image
		if (row.file) {
			editData.append("image", row.file);
		}

		//to save multi docs
		if (row.documents && row.documents.length > 0) {
			row.documents.forEach((file) => {
				editData.append("documents", file);
			});
		}

		//log formdata
		[...editData.entries()].forEach(([key, value]) => {
			console.log(key, value);
		});

		setModal(!modal);
	};

	//delete user
	const deleteUser = async (row) => {
		try {
			const response = await axios.delete(`/api/your-route/${row.id}`);
			console.log("DELETE response:", response);
			// toast.success("نماینده با موفقیت حذف شد");
			// setUsers((prev) => prev.filter((user) => user.id !== row.id));
		} catch (error) {
			console.error("Error deleting user:", error);
			// toast.error("خطا در حذف نماینده");
		}
	};

	//close modal
	const toggle = () => {
		setModal(!modal);
		setIsEdit(false);
	};

	//close new user create modal
	const closeCreateModal = () => {
		setIsNewUser(!isNewUser);
	};

	//close delete user modal
	const closeDeleteModal = () => {
		setDeleteModal(!deleteModal);
	};

	//close btn for modal
	const CloseBtn = (
		<button
			type="button"
			className="close"
			style={{ position: "absolute", top: "15px", right: "15px" }}
			onClick={closeCreateModal}
		>
			&times;
		</button>
	);

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

		setSelectedUser((prev) => ({
			...prev,
			documents: filesArray,
		}));
	};

	//option of category select box
	const options = cats.map((cat) => ({
		value: cat.title,
		label: cat.id + ". " + cat.title,
	}));

	const userRole = [
		{ value: "CEO", label: "CEO" },
		{ value: "COO", label: "COO" },
		{ value: "CFO", label: "CFO" },
	];

	const userGrade = [
		{ value: "مدیر ارشد اجرایی", label: "مدیر ارشد اجرایی" },
		{ value: "مدیران عالی‌رتبه", label: "مدیران عالی‌رتبه" },
		{ value: "مدیران بازاریابی", label: "مدیران بازاریابی" },
	];

	const userHistory = [
		{ value: "۱ سال", label: "۱ سال" },
		{ value: "۲ سال", label: "۲ سال" },
		{ value: "۳ سال", label: "۳ سال" },
		{ value: "۴ سال", label: "۴ سال" },
		{ value: "۵ سال", label: "۵ سال" },
		{ value: "۶ سال", label: "۶ سال" },
		{ value: "۷ سال", label: "۷ سال" },
		{ value: "۸ سال", label: "۸ سال" },
		{ value: "۹ سال", label: "۹ سال" },
		{ value: "۱۰ سال", label: "۱۰ سال" },
	];

	const createNewUser = async () => {
		try {
			const sendData = new FormData();
			sendData.append("userName", formData.userName);
			sendData.append("nationalCode", formData.nationalCode);
			sendData.append("role", formData.role);
			sendData.append("grade", formData.grade?.value || "");
			sendData.append("history", formData.history);

			if (formData.userImage) {
				sendData.append("userImage", formData.userImage);
			}

			if (formData.newDocuments.length > 0) {
				formData.newDocuments.forEach((doc) => {
					sendData.append("newDocuments", doc);
				});
			}

			// const response = await axios.post("/api/your-route", sendData);
			// console.log("User created successfully", response.data);
			// toast.success("نماینده با موفقیت ایجاد شد");
		} catch (error) {
			// console.error("Error creating user:", error);
			// toast.error("خطا در ایجاد نماینده");
		}
		setIsNewUser(false);
	};

	const openCreateUserModal = () => {
		console.log("newUser modal open");
		setIsNewUser(true);
	};

	const showDeleteUserModal = () => {
		console.log("delete modal open");
		setDeleteModal(true);
	};

	return (
		<div className="px-4">
			{/* filter options */}
			<div className="d-flex gap-2 mb-4 row mx-1"></div>
			<div className="mb-4 row mx-1 gap-2">
				<Select
					placeholder={"فیلتر بر اساس نقش نماینده "}
					className="col-lg-2 p-0"
					defaultValue={null}
					onChange={(selectedRole) => {
						console.log("selectedRole", selectedRole);
						setSelectedFilters({
							...selectedFilters,
							role: selectedRole ? selectedRole.value : "",
						});
					}}
					options={userRole}
				/>
				<Select
					placeholder={"فیلتر بر اساس سطح نماینده "}
					className="col-lg-2 p-0"
					defaultValue={null}
					onChange={(selectedGrade) => {
						console.log("selectedGrade", selectedGrade);
						setSelectedFilters({
							...selectedFilters,
							grade: selectedGrade ? selectedGrade.value : "",
						});
					}}
					options={userGrade}
				/>
				<Select
					placeholder={"فیلتر بر اساس سابقه کاری"}
					className="col-lg-2 p-0"
					defaultValue={null}
					onChange={(selectedHistory) => {
						console.log("selectedHistory", selectedHistory);
						setSelectedFilters({
							...selectedFilters,
							history: selectedHistory ? selectedHistory.value : "",
						});
					}}
					options={userHistory}
				/>
				<Button
					color="success"
					className="p-0 fw-bold col-lg-2"
					style={{ height: "40px" }}
					onClick={applyFilters}
				>
					اعمال فیلتر
				</Button>
				<Button
					color="primary"
					onClick={openCreateUserModal}
					className="col-lg-2 ms-auto p-0 fw-bold px-2"
					style={{ height: "40px" }}
				>
					افزودن نماینده
				</Button>
				{/* <input
					type="text"
					placeholder="جستجوی نماینده"
					className="p-2 border border-gray-300 rounded col-md-2 ms-auto"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/> */}
			</div>
			<DataTable
				title={<h5>لیست نمایندگان</h5>}
				columns={columns}
				data={searchTableData}
				pagination
				highlightOnHover
				striped
				responsive
				subHeader
				subHeaderComponent={
					<div className="w-100 row d-flex justify-content-start">
						<input
							type="text"
							placeholder="جستجوی نماینده"
							className="p-2 border rounded col-md-2"
							style={{
								border: "1px solid #dee2e6",
								outline: "none",
							}}
							value={search}
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
						{isEdit ? "ویرایش اطلاعات نماینده" : "مشاهده اطلاعات نماینده"}
					</ModalHeader>
					<ModalBody>
						{selectedUser &&
							(isEdit ? (
								<form>
									<div className="row">
										{/* user code */}
										<div className="form-group  col-md-6">
											<label className="fw-bold">کد نماینده</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.id}
												onChange={() => {}}
											/>
										</div>
										{/*user name */}
										<div className="form-group  col-md-6">
											<label className="fw-bold">نام</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.name}
												onChange={(e) =>
													setSelectedUser({
														...selectedUser,
														name: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div className="row">
										{/* nationalcode */}
										<div className="form-group col-md-6">
											<label className="fw-bold">کد ملی</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.username}
												onChange={(e) =>
													setSelectedUser({
														...selectedUser,
														username: e.target.value,
													})
												}
											/>
										</div>
										{/* role */}
										<div className="form-group col-md-6">
											<label className="fw-bold">نقش</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.email}
												onChange={(e) =>
													setSelectedUser({
														...selectedUser,
														email: e.target.value,
													})
												}
											/>
										</div>
									</div>

									<div className="row">
										{/* grade */}
										<div className="form-group col-md-6">
											<label className="fw-bold">سطح</label>
											<Select
												placeholder={selectedUser.phone}
												className="mb-2"
												value={options.find(
													(opt) => opt.value === selectedUser.phone
												)}
												onChange={(selectedOption) => {
													console.log("selectedOption", selectedOption);
													setSelectedUser({
														...selectedUser,
														phone: selectedOption ? selectedOption.value : "",
													});
												}}
												options={options}
											/>
										</div>
										{/* history */}
										<div className="form-group col-md-6">
											<label className="fw-bold"> سابقه نماینده</label>
											<input
												type="number"
												className="form-control mb-2"
												value={selectedUser.website}
												onChange={(e) =>
													setSelectedUser({
														...selectedUser,
														website: e.target.value,
													})
												}
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
										{/* user image */}
										<div className="form-group col-md-6">
											<label className="fw-bold">عکس نماینده</label>

											{/* show the current product image*/}
											{selectedUser.image ? (
												<div className="mb-2">
													<img
														src={selectedUser.image}
														alt="عکس محصول"
														style={{
															width: "150px",
															height: "auto",
															borderRadius: "8px",
														}}
													/>
												</div>
											) : (
												<p className="text-muted">
													برای این نماینده عکسی ثبت نشده است.
												</p>
											)}

											{/* upload new user image*/}
											<input
												type="file"
												className="form-control"
												onChange={(e) => {
													const file = e.target.files[0];
													if (file) {
														setSelectedUser({
															...selectedUser,
															image: URL.createObjectURL(file),
															file: file,
														});
													}
												}}
											/>
										</div>
									</div>
									<div className="row">
										{/* user access status*/}
										<div className="form-group col-md-6">
											<label className="fw-bold d-block mb-2">
												دسترسی به پنل
											</label>
											<div className="form-check form-switch">
												<input
													className="form-check-input border border-secondary"
													style={{ width: "50px", height: "25px" }}
													type="checkbox"
													checked={selectedUser.status}
													onChange={(e) =>
														setSelectedUser({
															...selectedUser,
															status: e.target.value,
														})
													}
												/>
											</div>
										</div>
									</div>
								</form>
							) : (
								<form>
									<div className="row">
										{/* user code */}
										<div className="col-md-6">
											<label className="fw-bold">کد نماینده</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.id}
												disabled
											/>
										</div>
										{/*user name */}
										<div className="col-md-6">
											<label className="fw-bold">نام نماینده</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.name}
												disabled
											/>
										</div>
									</div>

									<div className="row">
										{/* nationalcode */}
										<div className="col-md-6">
											<label className="fw-bold">کد ملی</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.username}
												disabled
											/>
										</div>
										{/* role */}
										<div className=" col-md-6">
											<label className="fw-bold">نقش</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.email}
												disabled
											/>
										</div>
									</div>

									<div className="row">
										{/* grade */}
										<div className="col-md-6">
											<label className="fw-bold">سطح</label>
											<input
												type="text"
												className="form-control mb-2"
												value={selectedUser.phone}
												disabled
											/>
										</div>
										{/* user image */}
										<div className="col-md-6">
											<label className="fw-bold">عکس کابر</label>

											{/* نمایش عکس فعلی */}
											{selectedUser.image ? (
												<div className="mb-2">
													<img
														src={selectedUser.image}
														alt="عکس محصول"
														style={{
															width: "150px",
															height: "auto",
															borderRadius: "8px",
														}}
													/>
												</div>
											) : (
												<p className="text-muted">
													برای این نماینده عکسی ثبت نشده است.
												</p>
											)}
										</div>
									</div>
									{/* history  */}
									<div>
										<label className="fw-bold">سابقه کاری </label>
										<textarea
											className="form-control mb-2"
											rows="4"
											value={selectedUser.website}
											disabled
										/>
									</div>
								</form>
							))}
					</ModalBody>
					<ModalFooter>
						{isEdit ? (
							<Button color="primary" onClick={() => editUser(selectedUser)}>
								ویرایش
							</Button>
						) : null}
						<Button color="secondary" onClick={toggle}>
							بستن
						</Button>
					</ModalFooter>
				</Modal>
			)}
			{isNewUser && (
				<Modal
					isOpen={isNewUser}
					toggle={closeCreateModal}
					external={CloseBtn}
					className="modal-dialog-centered modal-xl"
				>
					<ModalHeader>ایجاد نماینده جدید</ModalHeader>
					<ModalBody>
						<form>
							<div className="row">
								{/*user name */}
								<div className="form-group  col-md-6">
									<label className="fw-bold">نام</label>
									<input
										type="text"
										className="form-control mb-2"
										value={formData.name}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												name: e.target.value,
											}))
										}
									/>
								</div>
								{/* nationalcode */}
								<div className="form-group col-md-6">
									<label className="fw-bold">کد ملی</label>
									<input
										type="number"
										className="form-control mb-2"
										value={formData.nationalCode}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												nationalCode: e.target.value,
											}))
										}
									/>
								</div>
							</div>

							<div className="row">
								{/* role */}
								<div className="form-group col-md-6">
									<label className="fw-bold">نقش</label>
									<input
										type="text"
										className="form-control mb-2"
										value={formData.role}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												role: e.target.value,
											}))
										}
									/>
								</div>
								{/* history */}
								<div className="form-group col-md-6">
									<label className="fw-bold"> سابقه نماینده</label>
									<input
										type="number"
										className="form-control mb-2"
										value={formData.history}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												history: e.target.value,
											}))
										}
									/>
								</div>
							</div>

							<div className="row">
								{/* grade */}
								<div className="form-group col-md-6">
									<label className="fw-bold">سطح</label>
									<Select
										placeholder={""}
										className="mb-2"
										options={options}
										value={formData.grade}
										onChange={(selectedOption) =>
											setFormData((prev) => ({
												...prev,
												grade: selectedOption,
											}))
										}
									/>
								</div>
								{/* user access status*/}
								<div className="form-group col-md-6">
									<label className="fw-bold d-block mb-2">دسترسی به پنل</label>
									<div className="form-check form-switch">
										<input
											className="form-check-input border border-secondary"
											style={{ width: "50px", height: "25px" }}
											type="checkbox"
											id="accessLevelSwitch"
											checked={formData.status}
											onChange={(e) => {
												console.log("e.target.checked", e.target.checked);
												setFormData((prev) => ({
													...prev,
													status: e.target.checked,
												}));
											}}
										/>
									</div>
								</div>
							</div>

							<div className="row">
								{/* user image */}
								<div className="form-group col-md-6">
									<label className="fw-bold">عکس نماینده</label>
									<input
										type="file"
										className="form-control"
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												userImage: e.target.files[0],
											}))
										}
									/>
								</div>
								{/* upload files*/}
								<div className="form-group col-md-6">
									<label className="fw-bold">آپلود فایل</label>
									<input
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												newDocuments: Array.from(e.target.files),
											}))
										}
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
							</div>
						</form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={createNewUser}>
							ایجاد
						</Button>
						<Button color="secondary" onClick={closeCreateModal}>
							بستن
						</Button>
					</ModalFooter>
				</Modal>
			)}
			{deleteModal && (
				<Modal
					isOpen={deleteModal}
					toggle={closeDeleteModal}
					className="modal-dialog-centered"
				>
					<ModalHeader>حذف نماینده</ModalHeader>
					<ModalBody>
						<div>آیا از حذف این نماینده مطمئن هستید؟</div>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={deleteUser}>
							حذف نماینده
						</Button>
						<Button color="primary" onClick={closeDeleteModal}>
							انصراف
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</div>
	);
};

export default UsersList;
