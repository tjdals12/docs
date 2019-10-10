import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const tagMap = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	'display-1': 'h1',
	'display-2': 'h1',
	'display-3': 'h1',
	'display-4': 'h1',
	p: 'p',
	leaf: 'p',
	blockqoute: 'blockqoute'
};

const types = Object.keys(tagMap);

const Typography = ({ tag: Tag, type, className, ...restProps }) => {
	let classes = classNames({ type: !!type }, className);
	let Typocomp;

	if (Tag) {
		Typocomp = Tag;
	} else if (!Tag && tagMap[type]) {
		Typocomp = tagMap[type];
	} else {
		Typocomp = 'p';
	}

	return <Typocomp className={classes} {...restProps} />;
};

Typography.propTypes = {
	tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
	type: PropTypes.oneOf(types),
	className: PropTypes.string
};

Typography.defaultProps = {
	type: 'p'
};

export default Typography;
