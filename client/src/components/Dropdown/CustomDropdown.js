import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

const CustomDropdown = ({ outline, color, selectedMenu, menus, onSelect, className, style }) => {
    const [ open, setOpen ] = useState(false);

    const onOpen = () => {
        setOpen(prevState => {
            return !prevState
        })
    }

    const getMenus = () => {
        return menus.map(menu => <DropdownItem key={menu.key} onClick={() => onSelect(menu)}>{menu.value}</DropdownItem>);
    }

    return (
        <Dropdown isOpen={open} toggle={onOpen} className={className} style={style}>
            <DropdownToggle caret outline={outline} color={color} className="title-font">
                {selectedMenu.value}
            </DropdownToggle>
            <DropdownMenu>
                {getMenus()}
            </DropdownMenu>
        </Dropdown>
    )
}

CustomDropdown.propTypes = {
    outline: PropTypes.bool,
    color: PropTypes.string,
    selectedMenu: PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string
    }),
    menus: PropTypes.array,
    onSelect: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
}

CustomDropdown.defaultProps = {
    toggle: () => console.warn('Warning: toggle is undefined'),
    outline: false,
    color: 'primary',
    selectedMenu: {
        key: '',
        value: '[PROJECT]'
    },
    menus: [],
    onSelect: () => console.warn('Warning: onSelect is undefined'),
}

export default CustomDropdown;