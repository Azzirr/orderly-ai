import { useFormik } from "formik";
import * as Yup from "yup";
import { LoginModalContainer } from "./LoginModal.styles";
import { StyledButton } from "../../ui/StyledButton/StyledButton.styles";
import { CloseModalButtonMobile, ModalErrorMessage, ModalFooter, ModalHeader, ModalInput, ModalSubHeader } from "../../ui";
import { useContext } from "react";
import { OrderAiContext } from "../../Context/ContextProvider";
import Modal from "@mui/material/Modal";
import useAuth from "../../Hooks/useAuth";
import useDecrypt from "../../Hooks/useDecrypt";
import { User } from "../../Context/types";
import CloseButton from "../../assets/clarity_close-line.png";

export function LoginModal() {
 const { changeModal, handleModalClose, isModalOpen, saveLoggedUserRole, saveLoggedUserEmail } = useContext(OrderAiContext);
 const { getMatchUser, generateToken } = useAuth();
 const { parseJwtToken } = useDecrypt();
 const formik = useFormik({
  initialValues: {
   email: "",
   password: "",
  },
  validationSchema: Yup.object({
   email: Yup.string().max(25, "Email must be 25 characters or less.").email("Invalid email address.").required("Required"),
   password: Yup.string().max(25, "Password must be 25 characters or less.").min(8, "Password must be minimum 8 characters.").required("Required"),
  }),
  onSubmit: (values) => {
   const matchUser = getMatchUser(values.email, values.password);
   if (matchUser) {
    generateToken(matchUser);
    alert("Successfully logged!");
    handleModalClose();
    const user: User | undefined = parseJwtToken();
    saveLoggedUserRole(user?.role || "");
    saveLoggedUserEmail(user?.email || "");
   } else {
    alert("Wrong password or email!");
   }
  },
 });

 const commonInputsProperties = (key: "email" | "password") => ({
  id: key,
  name: key,
  type: key,
  onChange: formik.handleChange,
  onBlur: formik.handleBlur,
  value: formik.values[key],
 });
 return (
  <Modal open={isModalOpen} onClose={handleModalClose}>
   <LoginModalContainer>
    <CloseModalButtonMobile>
     <img src={CloseButton} alt="Close button" onClick={handleModalClose} />
    </CloseModalButtonMobile>
    <ModalHeader>Sign In</ModalHeader>
    <ModalSubHeader>Welcome back. Sign in to continue</ModalSubHeader>
    <form onSubmit={formik.handleSubmit}>
     <ModalInput placeholder="Email" {...commonInputsProperties("email")} />
     <ModalErrorMessage>{formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}</ModalErrorMessage>

     <ModalInput placeholder="Password" {...commonInputsProperties("password")} />
     <ModalErrorMessage>{formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}</ModalErrorMessage>

     <StyledButton type="submit">Submit</StyledButton>
    </form>
    <ModalFooter>
     Don't have an account?{" "}
     <a
      onClick={() => {
       changeModal("Sign Up");
      }}>
      <b>Create account</b>
     </a>
    </ModalFooter>
   </LoginModalContainer>
  </Modal>
 );
}
