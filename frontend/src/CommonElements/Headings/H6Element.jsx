import React from 'react';

const H6 = (props) =>{
    return (
			<h6
				className="mb-3 text-start"
				style={{ color: "#545863" }}
				{...props.attrH6}
			>
				{props.children}
			</h6>
		);
};

export default H6;