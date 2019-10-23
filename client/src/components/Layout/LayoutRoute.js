import React from 'react';
import { Route } from 'react-router-dom';


const LayoutRoute = ({ component: Component, layout: Layout, writable, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => (
				<Layout>
					<Component {...props} writable={writable} />
				</Layout>
			)}
		/>
	);
};

export default LayoutRoute;
