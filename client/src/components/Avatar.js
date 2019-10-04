import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import userImg from 'assets/img/users/100.jpg';

const Avatar = ({ circle, rounded, size, src, style, tag: Tag, className, ...restProps }) => {
	const classes = classNames({ 'rounded-circle': circle, rounded }, className);

	return <Tag src={src} className={classes} {...restProps} style={{ width: size, height: size, ...style }} />;
};

Avatar.propTypes = {
	circle: PropTypes.bool,
	rounded: PropTypes.bool,
	size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
	src: PropTypes.string,
	style: PropTypes.object,
	tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
	className: PropTypes.string
};

Avatar.defaultProps = {
	circle: true,
	rounded: false,
	size: 40,
	src: userImg,
	tag: 'img',
	style: {}
};

export default Avatar;
