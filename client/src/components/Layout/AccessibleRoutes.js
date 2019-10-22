import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import LayoutRoute from './LayoutRoute';
import * as Layouts from 'components/Layout';
import * as Pages from 'pages';

const AccessibleRoutes = ({ roles }) => (
    <BrowserRouter>
        <Switch>
            {
                roles.map((role, index) => {
                    const { to, layout, component, sub } = role;

                    return sub.length > 0 ? sub.map((subRole, index) => {

                        const { to, layout, component } = subRole;

                        return (<LayoutRoute key={index} exact path={to} layout={Layouts[layout]} component={Pages[component]} />)
                    }) : (
                            <LayoutRoute key={index} exact path={to} layout={Layouts[layout]} component={Pages[component]} />
                        )
                })
            }
        </Switch>
    </BrowserRouter>
)

export default AccessibleRoutes;