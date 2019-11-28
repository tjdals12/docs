import React from 'react';
import classNames from 'classnames';
import { Card, Row, Col, Button } from 'reactstrap';
import { FaCircle } from 'react-icons/fa';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const CollapseCard = ({ 
	title, 
	description, 
	onToggle, 
	onAddForm, 
	collapse: Collapse, 
	className }) => {
	const classes = classNames('px-4 py-3 mb-3', className);

	return (
		<Card className={classes}>
			<Row onClick={onToggle} className="align-items-center">
				<Col md={3} className="m-0">
					<Typography type="h2" className="m-0 title-font">
						<FaCircle size={10} className="mr-2" /> {title}
					</Typography>
				</Col>
				<Col md={6}>
					<small className="text-danger">* {description}</small>
				</Col>
				<Col md={3} className="d-flex align-items-center justify-content-end m-0">
					<Button
						color="secondary"
						className="mr-2"
						onClick={(e) => {
							e.stopPropagation();

							onAddForm();
						}}
					>
						추가
					</Button>
				</Col>
			</Row>

			{Collapse}
		</Card>
	);
};

CollapseCard.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	isOpen: PropTypes.bool,
	onToggle: PropTypes.func,
	onAddForm: PropTypes.func,
	collapse: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	className: PropTypes.string
};

CollapseCard.defaultProps = {
	title: 'Title',
	description: 'Description',
	isOpen: false,
	onToggle: () => console.warn('Warning: onToggle is not defined'),
	onAddForm: () => console.warn('Warning: onAddForm is not defined')
};

export default CollapseCard;
