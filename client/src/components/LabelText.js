import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FaCaretRight } from 'react-icons/fa';
import Typography from 'components/Typography';

const LabelText = ({ label, labelColor, text, textColor, className }) => {
	const classes = classNames('d-flex justify-content-between mb-2', className);

	return (
		<div className={classes}>
			<Typography tag="span" className={`text-${labelColor}`}>
				<FaCaretRight /> {label} :{' '}
			</Typography>
			<Typography tag="span" className={`text-${textColor}`}>
				{text}
			</Typography>
		</div>
	);
};

LabelText.propTypes = {
	label: PropTypes.string,
	labelColor: PropTypes.string,
	text: PropTypes.string,
	textColor: PropTypes.string,
	className: PropTypes.string
};

LabelText.defaultProps = {
	labelColor: 'dark',
	textColor: 'dark'
};

export default LabelText;
