import React from 'react';
import { Switch } from 'react-router-dom';
import LayoutRoute from './LayoutRoute';
import * as Layouts from 'components/Layout';
import * as Pages from 'pages';

const AccessibleRoutes = ({ roles, myRoles }) => {
    return (
        <>
            <LayoutRoute path="/login" layout={Layouts['EmptyLayout']} component={Pages['LoginPage']} />
            <Switch>
                {
                    roles.filter(({ roleId }) => myRoles.includes(roleId['READ'])).map((role) => {
                        const { to, layout, component, sub, roleId } = role;

                        const writable = myRoles.includes(roleId['WRITE']);

                        return sub.length > 0 ? sub.filter(({ roleId }) => myRoles.includes(roleId['READ'])).map((subRole) => {
                            const { to, layout, component, roleId: subRoldId } = subRole;

                            const subWritable = myRoles.includes(subRoldId['WRITE']);

                            return (<LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} writable={subWritable} />)
                        }) : to !== 'ROOT' && (
                            <LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} writable={writable} />
                        )
                    })
                }
            </Switch>
        </>
    )
}

export default AccessibleRoutes;