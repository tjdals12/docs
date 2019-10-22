import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink as BSNavLink, Collapse } from 'reactstrap';
import * as MaterialDesign from 'react-icons/md';
import {
	MdKeyboardArrowDown
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
		const { roles } = this.props;

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
						{
							roles.map(({ to, name, icon, dispGb, sub }, index) => {
								const Icon = MaterialDesign[icon];

								return sub.length > 0 ? ([
									<NavItem key={`nav-${index}`} className={bem.e('nav-item')}>
										<BSNavLink className={bem.e('nav-collapse')} onClick={this.handleClick(name)}>
											<div className="d-flex">
												<Icon className={bem.e('nav-item-icon')} />
												<span className="text-uppercase">{name}</span>
											</div>
											<MdKeyboardArrowDown
												className={bem.e('nav-item-icon')}
												style={{
													padding: 0,
													transform: !this.state[`isOpen${name}`] ? 'rotate(-90deg)' : 'rotate(0deg)',
													transitionProperty: 'transform',
													transitionDuration: '.2s'
												}} />
										</BSNavLink>
									</NavItem>,
									<Collapse key={`collapse-${index}`} isOpen={this.state[`isOpen${name}`]}>
										{
											sub.filter(({ dispGb }) => dispGb === '01').map(({ to, name, icon: subIcon }, subIndex) => {
												const SubIcon = MaterialDesign[subIcon];

												return (
													<NavItem key={`${index}-${subIndex}`} className={bem.e('nav-item')}>
														<BSNavLink
															id={`navItem-${name}-${index}`}
															className="text-uppercase"
															activeClassName="active"
															to={to}
															exact={true}
															tag={NavLink}>
															<SubIcon className={bem.e('nav-item-icon')} />
															<span className='text-white'>{name}</span>
														</BSNavLink>
													</NavItem>
												)
											})
										}
									</Collapse>
								]) : dispGb === '01' && (
									<NavItem key={index} className={bem.e('nav-item')}>
										<BSNavLink
											id={`navItem-${name}-${index}`}
											className="text-uppercase"
											activeClassName="active"
											to={to}
											exact={true}
											tag={NavLink}>
											<Icon className={bem.e('nav-item-icon')} />
											<span className="text-white">{name}</span>
										</BSNavLink>
									</NavItem>
								)
							})
						}
					</Nav>

					<Nav vertical className="nav-bottom">
						{
							roles.filter(({ dispGb }) => dispGb === '99').map(({ to, name, icon }, index) => {
								const Icon = MaterialDesign[icon];

								return (
									<NavItem key={index} className={bem.e('nav-item')}>
										<BSNavLink
											id={`navItem-${name}-${index}`}
											className="text-uppercase"
											activeClassName="active"
											to={to}
											exact={true}
											tag={NavLink}>
											<Icon className={bem.e('nav-item-icon')} />
											<span className="text-white">{name}</span>
										</BSNavLink>
									</NavItem>
								)
							})
						}
					</Nav>
				</div>
			</aside>
		);
	}
}

export default Sidebar;
