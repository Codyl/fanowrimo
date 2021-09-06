import React from 'react';
import './index.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
class Login extends React.Component
{
    constructor(props) {
        super(props);
        this.goToHomePage = this.goToHomePage.bind(this);
    }
    goToHomePage() {

    }
    render() {
        return (
            <div className='myContainer aligned'>
                <div id='login'>
                    <h1 id='title'>Fanowrimo</h1>
                    <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control id='username' type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control id='password' type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3 buttons">
                        <Button className='loginButton' type="submit">
                            Login
                        </Button>
                        <Button className='loginButton' type="submit">
                            Create Account
                        </Button>
                    </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}
export default Login;