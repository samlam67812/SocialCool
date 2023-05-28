import { useState } from "react";
import { Menu, Form, Container, Message, List} from "semantic-ui-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    // sign up a new user
    if (activeItem === "register") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
          setIsLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode)
          switch (errorCode) {
            case "auth/email-already-exists":
              setErrorMessage("Email Already in Use / 郵箱已被註冊");
              break;
            case "auth/invalid-email":
              setErrorMessage("Invalid Email Format / 郵箱格式不正確");
              break;
            case "auth/weak-password":
              setErrorMessage("Weak Password / 密碼強度不足");
              break;
              case "auth/email-already-in-use":
              setErrorMessage("Email Already in Use / 郵箱已被註冊");
              break;
            default:
              setErrorMessage("Error Occurs / 系統錯誤 請重新輸入");
              break;
          }
          setIsLoading(false);
        });
    } else if (activeItem === "signin") {
      // sign in existing user
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
          setIsLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          switch (errorCode) {
            case "auth/invalid-email":
              setErrorMessage("Invalid Email Format / 郵箱格式不正確");
              break;
            case "auth/user-not-found":
              setErrorMessage("User not found / 用戶不存在 請先註冊");
              break;
            case "auth/wrong-password":
              setErrorMessage("Wrong Password / 密碼錯誤 請重新輸入");
              break;
            default:
              setErrorMessage("Error Occurs / 系統錯誤 請重新輸入");
              break;
          }
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Container>
        <Menu widths={2}>
          <Menu.Item
            active={activeItem === "register"}
            onClick={() => {
              setErrorMessage("");
              setActiveItem("register");
            }}
          >
            {/* 註冊 */}
            Register
          </Menu.Item>
          <Menu.Item
            active={activeItem === "signin"}
            onClick={() => {
              setErrorMessage("");
              setActiveItem("signin");
            }}
          >
            {/* 登入 */}
            Sign in
          </Menu.Item>
        </Menu>
        <Form onSubmit={onSubmit}>
          <Form.Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email"
          />
          <Form.Input
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter your password"
            type="password"
          />
          {errorMessage && <Message negative>{errorMessage}</Message>}
          {/* <List>
            <List.Item as={Link} to="/reset-password">Forgot Password</List.Item>
          </List> */}
          {/* reset password place  */}
          <Form.Button loading={isLoading}>
            {activeItem === "register" && "Register"}
            {activeItem === "signin" && "Sign In"}
          </Form.Button>
        </Form>
      </Container>
    </>
  );
};

export default Signin;
