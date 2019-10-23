import React from 'react';
import { Switch } from 'react-router-dom';
import LayoutRoute from './LayoutRoute';
import * as Layouts from 'components/Layout';
import * as Pages from 'pages';

const AccessibleRoutes = ({ roles }) => {
    return (
        <>
            <LayoutRoute path="/login" layout={Layouts['EmptyLayout']} component={Pages['LoginPage']} />
            <Switch>
                {
                    roles.map((role) => {
                        const { to, layout, component, sub, roleId } = role;

                        return sub.length > 0 ? sub.map((subRole) => {
                            const { to, layout, component, roleId: subRoleId } = subRole;

                            return (<LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} roleId={subRoleId} />)
                        }) : to !== 'ROOT' && (
                            <LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} roleId={roleId} />
                        )
                    })
                }
            </Switch>
        </>
    )
}

export default AccessibleRoutes;