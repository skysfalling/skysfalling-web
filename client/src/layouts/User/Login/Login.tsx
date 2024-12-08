import * as Yup from "yup";
import { Login as LoginForm, Register } from "../../../components/Form";
import { User } from "../../../objects/Settings";
import "./Login.styles.css";



const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(User.name.minLength)
    .max(User.name.maxLength)
    .required(),
  password: Yup.string()
    .min(User.password.minLength)
    .max(User.password.maxLength)
    .required(),
});

function Login() {
  return (
    <section className="login-page">
      <LoginForm/>
      <Register/>
    </section>
  );
}



export default Login;
