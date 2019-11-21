import React from 'react';
import { Navbar, Nav, Button, NavItem, NavLink, Popover, PopoverBody, ListGroup, ListGroupItem } from 'reactstrap';
import {
	MdClearAll,
	MdNotificationsNone,
	MdNotificationsActive,
	MdAssignmentInd,
	MdAssessment,
	MdMessage,
	MdHelp,
	MdSettingsApplications,
	MdExitToApp
} from 'react-icons/md';
import bn from 'utils/bemnames';

import SearchForm from 'components/SearchForm';
import Avatar from 'components/Avatar';
import withBadge from 'hocs/withBadge';
import Notifications from 'components/Notifications';
import { notificationsData } from 'demos/header';
import UserCard from 'components/Card/UserCard';

const bem = bn.create('header');

const MdNotificationsActiveWithBadge = withBadge({
	position: 'top-right',
	size: 'md',
	color: 'primary',
	style: {
		top: -10,
		right: -10,
		display: 'flex',
		alignItems: 'center',
		jutifyContent: 'center'
	},
	children: <small>3</small>
})(MdNotificationsActive);

class Header extends React.Component {
	state = {
		isNotificationsConfirmed: false,
		isOpenNotificationsPopover: false,
		isOpenUserCardPopover: false
	};

	toggleNotificationPopover = () => {
		this.setState({
			isOpenNotificationsPopover: !this.state.isOpenNotificationsPopover
		});

		if (!this.state.isNotificationsConfirmed) {
			this.setState({
				isNotificationsConfirmed: true
			});
		}
	};

	toggleUserCardPopover = () => {
		this.setState({
			isOpenUserCardPopover: !this.state.isOpenUserCardPopover
		});
	};

	sidebarControl = (event) => {
		event.preventDefault();
		event.stopPropagation();

		document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
	};

	render() {
		const { userInfo, onLogout } = this.props;

		return (
			<Navbar light expand className={bem.b('bg-white')}>
				<Nav navbar className="mr-3">
					<Button outline onClick={this.sidebarControl}>
						<MdClearAll size={25} />
					</Button>
				</Nav>
				<Nav navbar>
					<SearchForm />
				</Nav>
				<Nav navbar className={bem.e('nav-right')}>
					<NavItem className="d-inline-flex">
						<NavLink id="Popover1">
							{this.state.isNotificationsConfirmed ? (
								<MdNotificationsNone size={25} className="can-click text-secondary" />
							) : (
									<MdNotificationsActiveWithBadge
										size={25}
										className="can-click text-secondary swing animated infinite"
									/>
								)}
						</NavLink>
						<Popover
							placement="bottom"
							isOpen={this.state.isOpenNotificationsPopover}
							toggle={this.toggleNotificationPopover}
							target="Popover1"
						>
							<PopoverBody>
								<Notifications notificationsData={notificationsData} />
							</PopoverBody>
						</Popover>
					</NavItem>

					<NavItem>
						<NavLink id="Popover2">
							<Avatar className="can-click" src={userInfo.getIn(['profile', 'thumbnail'])} />
						</NavLink>
						<Popover
							placement="bottom-end"
							isOpen={this.state.isOpenUserCardPopover}
							toggle={this.toggleUserCardPopover}
							target="Popover2"
							style={{ minWidth: 200 }}
						>
							<PopoverBody className="p-0 border-light">
								<UserCard
									avatar={userInfo.getIn(['profile', 'thumbnail'])}
									title={userInfo.getIn(['profile', 'username'])}
									subtitle={userInfo.getIn(['profile', 'description'])}
									text={userInfo.getIn(['profile', 'userType'])}
								>
									<ListGroup flush>
										{/* <ListGroupItem tag="button" action className="border-light">
											<MdAssignmentInd /> Profile
										</ListGroupItem>
										<ListGroupItem tag="button" action className="border-light">
											<MdAssessment /> Stat
										</ListGroupItem>
										<ListGroupItem tag="button" action className="border-light">
											<MdMessage /> Message
										</ListGroupItem>
										<ListGroupItem tag="button" action className="border-light">
											<MdHelp /> Help
										</ListGroupItem>
										<ListGroupItem tag="button" action className="border-light">
											<MdSettingsApplications /> Settings
										</ListGroupItem> */}
										<ListGroupItem tag="button" action className="border-light" onClick={onLogout}>
											<MdExitToApp /> Signout
										</ListGroupItem>
									</ListGroup>
								</UserCard>
							</PopoverBody>
						</Popover>
					</NavItem>
				</Nav>
			</Navbar>
		);
	}
}

export default Header;
