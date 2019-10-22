import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const LoginForm = ({ onChange, onSubmit }) => (
    <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
    }}>
        <Typography tag="h1" className="text-center logo-font">Docs</Typography>
        <FormGroup>
            <Label for="userId">User</Label>
            <Input type='text' name='userId' placeholder="your id" onChange={onChange} />
        </FormGroup>
        <FormGroup>
            <Label for="pwd">Password</Label>
            <Input type='password' name='pwd' placeholder="your password" onChange={onChange} />
        </FormGroup>
        <hr />
        <Button type='submit' size="lg" className="w-100 bg-gradient-theme-left border-0">LOGIN</Button>
    </Form>
)

LoginForm.propTypes = {
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
};


LoginForm.defaultProps = {
    onChange: () => console.warn('Warning: onChange is not defined'),
    onSubmit: () => console.warn('Warning: onSubmit is not defined')
};

export default LoginForm;