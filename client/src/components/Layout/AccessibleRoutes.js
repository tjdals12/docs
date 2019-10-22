import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import LayoutRoute from './LayoutRoute';
import * as Layouts from 'components/Layout';
import * as Pages from 'pages';

const AccessibleRoutes = ({ roles }) => (
    <BrowserRouter>
        <Switch>
            {
                roles.map((role) => {
                    const { to, layout, component, sub } = role;

                    return sub.length > 0 ? sub.map((subRole) => {

                        const { to, layout, component } = subRole;

                        return (<LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} />)
                    }) : (
                            <LayoutRoute exact path={to} layout={Layouts[layout]} component={Pages[component]} />
                        )
                })
            }
        </Switch>
    </BrowserRouter>
)

export default AccessibleRoutes;