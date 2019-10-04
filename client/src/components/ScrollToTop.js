import React from 'react';

class ScrollToTop extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		const { children } = this.props;

		return <div>{children}</div>;
	}
}

export default ScrollToTop;
