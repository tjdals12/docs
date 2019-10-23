import React from 'react';
import bn from 'utils/bemnames';
import SidebarContainer from 'containers/Layout/SidebarContainer';
import Content from './Content';
import HeaderContainer from 'containers/Layout/HeaderContainer';
import Footer from './Footer';
import componentQueries from 'react-component-queries';

const bem = bn.create('app');

class MainLayout extends React.Component {
	static isSidebarOpen() {
		return document.querySelector('.cr-sidebar').classList.contains('cr-sidebar--open');
	}

	componentWillReceiveProps({ breakpoint }) {
		if (breakpoint !== this.props.breakpoint) {
			this.checkBreakpoint(breakpoint);
		}
	}

	componentDidMount() {
		this.checkBreakpoint(this.props.breakpoint);
	}

	checkBreakpoint(breakpoint) {
		switch (breakpoint) {
			case 'xs':
			case 'sm':
			case 'md':
				return this.openSidebar('close');

			case 'lg':
			case 'xl':
			default:
				return this.openSidebar('open');
		}
	}

	openSidebar(openOrClose) {
		if (openOrClose === 'open') {
			return document.querySelector('.cr-sidebar').classList.add('cr-sidebar--open');
		}
		document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
	}

	render() {
		const { children } = this.props;

		return (
			<main className={bem.b('bg-light')}>
				<SidebarContainer />
				<Content fluid>
					<HeaderContainer />
					{children}
					<Footer />
				</Content>
			</main>
		);
	}
}

const query = ({ width }) => {
	if (width < 575) {
		return { breakpoint: 'xs' };
	}

	if (576 < width && width < 767) {
		return { breakpoint: 'sm' };
	}

	if (768 < width && width < 991) {
		return { breakpoint: 'md' };
	}

	if (992 < width && width < 1199) {
		return { breakpoint: 'lg' };
	}

	if (width > 1200) {
		return { breakpoint: 'xl' };
	}

	return { breakpoint: 'xs' };
};

export default componentQueries(query)(MainLayout);
