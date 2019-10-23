import React from 'react';
import { Route } from 'react-router-dom';


const LayoutRoute = ({ component: Component, layout: Layout, roleId, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => (
				<Layout>
					<Component {...props} roleId={roleId} />
				</Layout>
			)}
		/>
	);
};

export default LayoutRoute;
