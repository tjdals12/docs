import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import LayoutRoute from './LayoutRoute';
import * as Layouts from 'components/Layout';
import * as Pages from 'pages';

const AccessibleRoutes = ({ roles }) => (
    <BrowserRouter>
        <Switch>
            <LayoutRoute exact path="/login" layout={Layouts['EmptyLayout']} component={Pages['LoginPage']} />
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
    </BrowserRouter>
)

export default AccessibleRoutes;