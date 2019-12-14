import React from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Typography from "components/Typography";
import PropTypes from "prop-types";

const LoginForm = ({ error, onChange, onSubmit }) => (
  <Form
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <Typography tag="h1" className="text-center logo-font">
      Docs
    </Typography>
    <FormGroup>
      <Label for="userId">User</Label>
      <Input
        type="text"
        name="userId"
        placeholder="your id"
        onChange={onChange}
      />
    </FormGroup>
    <FormGroup>
      <Label for="pwd">Password</Label>
      <Input
        type="password"
        name="pwd"
        placeholder="your password"
        onChange={onChange}
      />
    </FormGroup>
    {error && (
      <strong className="m-auto text-danger">
        * 회원정보가 일치하지 않습니다.
      </strong>
    )}
    <hr />
    <Typography tag="p" className="text-muted font-italic">
      guest / 1234
    </Typography>
    <Button
      type="submit"
      size="lg"
      className="w-100 bg-gradient-theme-left border-0"
    >
      LOGIN
    </Button>
  </Form>
);

LoginForm.propTypes = {
  error: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

LoginForm.defaultProps = {
  error: false,
  onChange: () => console.warn("Warning: onChange is not defined"),
  onSubmit: () => console.warn("Warning: onSubmit is not defined")
};

export default LoginForm;
