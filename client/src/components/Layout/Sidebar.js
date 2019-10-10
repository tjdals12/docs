import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink as BSNavLink, Collapse } from 'reactstrap';
import {
	MdDashboard,
	MdDescription,
	MdBusiness,
	MdKeyboardArrowDown,
	MdFormatListBulleted,
	MdAssignment,
	MdChevronRight,
	MdSettings
} from 'react-icons/md';
import bn from 'utils/bemnames';
import sidebarBgImg from 'assets/img/sidebar/sidebar-9.jpg';
import Typography from 'components/Typography';

const bem = bn.create('sidebar');

const sidebarBackground = {
	background: `url("${sidebarBgImg}")`,
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat'
};

const navMenus = [
	{ to: '/', name: 'Dashboard', exact: true, Icon: MdDashboard },
	{ to: '/documents', name: 'Documents', exact: true, Icon: MdDescription },
	{ to: '/vendors', name: 'Vendors', exact: true, Icon: MdBusiness }
];

const indexMenus = [
	{ to: '/indexes/overall', name: 'Overall', exact: true, Icon: MdChevronRight },
	{ to: '/indexes/infos', name: 'Documents', exact: true, Icon: MdChevronRight }
];

const transmittalMenus = [
	{ to: '/letters/vendor', name: 'Vendor', exact: true, Icon: MdChevronRight },
	{ to: '/letters/internal', name: 'Internal', exact: true, Icon: MdChevronRight }
];

class Sidebar extends React.Component {
	state = {
		isOpenIndexes: false,
		isOpenTransmittals: false
	};

	handleClick = (name) => () => {
		this.setState((prevState) => {
			let isOpen = prevState[`isOpen${name}`];

			return {
				[`isOpen${name}`]: !isOpen
			};
		});
	};

	render() {
		return (
			<aside className={bem.b()} data-image={sidebarBgImg}>
				<div className={bem.e('background')} style={sidebarBackground} />
				<div className={bem.e('content')}>
					<Navbar>
						<NavbarBrand className="w-100 text-center">
							<Typography type='display-2' className="logo-font">
								Docs
							</Typography>
						</NavbarBrand>
					</Navbar>
					<Nav vertical>
						{navMenus.map(({ to, name, exact, Icon }, index) => (
							<NavItem key={index} className={bem.e('nav-item')}>
								<BSNavLink
									id={`navItem-${name}-${index}`}
									className="text-uppercase"
									activeClassName="active"
									to={to}
									exact={exact}
									tag={NavLink}
								>
									<Icon className={bem.e('nav-item-icon')} />
									<span className="text-white">{name}</span>
								</BSNavLink>
							</NavItem>
						))}

						<NavItem className={bem.e('nav-item')}>
							<BSNavLink className={bem.e('nav-collapse')} onClick={this.handleClick('Indexes')}>
								<div className="d-flex">
									<MdFormatListBulleted className={bem.e('nav-item-icon')} />
									<span>INDEXES</span>
								</div>
								<MdKeyboardArrowDown
									className={bem.e('nav-item-icon')}
									style={{
										padding: 0,
										transform: this.state.isOpenIndexes ? 'rotate(0deg)' : 'rotate(-90deg)',
										transitionProperty: 'transform',
										transitionDuration: '.2s'
									}}
								/>
							</BSNavLink>
						</NavItem>
						<Collapse isOpen={this.state.isOpenIndexes} className="pl-3">
							{indexMenus.map(({ to, name, exact, Icon }, index) => (
								<NavItem key={index} className={bem.e('nav-item')}>
									<BSNavLink
										id={`navItem-${name}-${index}`}
										className="text-uppercase"
										activeClassName="active"
										to={to}
										exact={exact}
										tag={NavLink}
									>
										<Icon className={bem.e('nav-item-icon')} />
										<span className="text-white">{name}</span>
									</BSNavLink>
								</NavItem>
							))}
						</Collapse>

						<NavItem className={bem.e('nav-item')}>
							<BSNavLink className={bem.e('nav-collapse')} onClick={this.handleClick('Transmittals')}>
								<div className="d-flex">
									<MdAssignment className={bem.e('nav-item-icon')} />
									<span>TRANSMITTALS</span>
								</div>
								<MdKeyboardArrowDown
									className={bem.e('nav-item-icon')}
									style={{
										padding: 0,
										transform: this.state.isOpenTransmittals ? 'rotate(0deg)' : 'rotate(-90deg)',
										transitionProperty: 'transform',
										transitionDuration: '.2s'
									}}
								/>
							</BSNavLink>
						</NavItem>
						<Collapse isOpen={this.state.isOpenTransmittals} className="pl-3">
							{transmittalMenus.map(({ to, name, exact, Icon }, index) => (
								<NavItem key={index} className={bem.e('nav-item')}>
									<BSNavLink
										id={`navItem-${name}-${index}`}
										className="text-uppercase"
										activeClassName="active"
										to={to}
										exact={exact}
										tag={NavLink}
									>
										<Icon className={bem.e('nav-item-icon')} />
										<span className="text-white">{name}</span>
									</BSNavLink>
								</NavItem>
							))}
						</Collapse>
					</Nav>

					<Nav vertical className="nav-bottom">
						<NavItem className={bem.e('nav-item')}>
							<BSNavLink
								className="text-uppercase"
								activeClassName="active"
								to="/settings"
								exact={true}
								tag={NavLink}
							>
								<MdSettings className={bem.e('nav-item-icon')} />
								<span className="text-white">Settings</span>
							</BSNavLink>
						</NavItem>
					</Nav>
				</div>
			</aside>
		);
	}
}

export default Sidebar;
