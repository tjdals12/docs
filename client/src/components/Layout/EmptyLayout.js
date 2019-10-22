import React from 'react';
import Content from './Content';

const EmptyLayout = ({ children, ...rest }) => (
    <main className="cr-app bg-light" {...rest}>
        <Content fluid>{children}</Content>
    </main>
)

export default EmptyLayout;