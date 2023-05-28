import { useState } from "react";
import { Menu, Form, Container, Message, List, Icon} from "semantic-ui-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { set } from "lodash";


const ResetPassword = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeItem, setActiveItem] = useState("reset");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSent, setIsSent]= useState(false);

    const onSubmit = async () => {
        setIsLoading(true)
        await sendPasswordResetEmail(auth, email)
        .then(() => {
            setIsSent(true);
           setIsLoading(false);
           setEmail("");      
           alert("Password reset email sent");
     
        })
        .catch((error) => {
            setIsLoading(false);
            setEmail("");
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
    }

  return (
    <>
    <Container>
      <Menu widths={3}>
        <Menu.Item
          active={activeItem === 'signin'}
          onClick={() => {navigate("/signin")}}
        > <Icon name="arrow left"/>Back to Sign In
        </Menu.Item>
        <Menu.Item
          active={activeItem === "reset"}
          onClick={() => {
            setErrorMessage("");
            setActiveItem("reset")}}
        >
          重設密碼
        </Menu.Item>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={() => {navigate("/")}}
        />
      </Menu>
      <Form onSubmit={onSubmit}>
        <Form.Input
          label="信箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter your email"
        />
        {isSent && <Message positive>Password reset email sent</Message>}
        <Form.Button loading={isLoading}>
          {/* 確認 */}
          Confirm
        </Form.Button>
      </Form>
    </Container>
    </>
  )
}

export default ResetPassword