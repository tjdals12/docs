import React, { useEffect } from 'react';
import AccessibleRoutes from 'components/Layout/AccessibleRoutes';
import { useSelector, useDispatch } from 'react-redux';
import { getRoles } from 'store/modules/role';

const AccessibleRoutesContainer = () => {
    const roles = useSelector((state) => state.role.get('roles').toJS(), []);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRoles())
    }, [dispatch])

    return (
        <AccessibleRoutes roles={roles} />
    )
}

export default AccessibleRoutesContainer;