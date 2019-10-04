import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import bn from 'utils/bemnames';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const bem = bn.create('page');

const Page = ({ tag: Tag, title, breadcrumbs, children, className, ...restProps }) => {
	const classes = bem.b('px-3', className);

	return (
		<Tag className={classes} {...restProps}>
			<div className={bem.e('header')}>
				{typeof title === 'string' ? (
					<Typography type="h1" className={bem.e('title')}>
						{title}
					</Typography>
				) : (
					{ title }
				)}
				{breadcrumbs && (
					<Breadcrumb className={bem.e('breadcrumb')}>
						<BreadcrumbItem>Home</BreadcrumbItem>
						{breadcrumbs.length &&
							breadcrumbs.map(({ name, active }, index) => (
								<BreadcrumbItem key={index} active={active}>
									{name}
								</BreadcrumbItem>
							))}
					</Breadcrumb>
				)}
			</div>
			{children}
		</Tag>
	);
};

Page.propTypes = {
	tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
	title: PropTypes.string,
	breadcrumbs: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			active: PropTypes.bool
		})
	),
	children: PropTypes.node,
	className: PropTypes.string
};

Page.defaultProps = {
	tag: 'div',
	title: ''
};

export default Page;
