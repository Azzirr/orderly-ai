import { useFormik } from "formik";
import * as Yup from "yup";
import { RegisterModalContainer } from "../RegisterModal/RegisterModal.styles";
import { CloseModalButtonMobile, ModalErrorMessage, ModalFooter, ModalHeader, ModalInput, ModalSubHeader, StyledButton } from "../../ui";
import { useContext } from "react";
import { OrderAiContext } from "../../Context/ContextProvider";
import Modal from "@mui/material/Modal";
import useAuth from "../../Hooks/useAuth";
import useRegister from "../../Hooks/useRegister";
import CloseButton from "../../assets/clarity_close-line.png";

export function RegisterModal() {
 const { changeModal, isModalOpen, handleModalClose } = useContext(OrderAiContext);
 const { getIsEmailExist } = useAuth();
 const { registerUser } = useRegister();

 const formik = useFormik({
  initialValues: {
   email: "",
   password: "",
   repeatPassword: "",
  },
  validationSchema: Yup.object({
   email: Yup.string()
    .max(25, "Email must be 25 characters or less.")
    .email("Invalid email address.")
    .required("Required")
    .test("Unique Email", "Email already in use", (email: string) => {
     const isEmailExist = getIsEmailExist(email);
     return !isEmailExist;
    }),
   password: Yup.string().max(25, "Password must be 25 characters or less.").min(8, "Password must be minimum 8 characters.").required("Required"),
   repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
  }),
  onSubmit: (values) => {
   try {
    registerUser({
     id: 0,
     email: values.email,
     password: values.password,
     role: "user",
    });
    alert(`Successfully registered as ${values.email}`);
    handleModalClose();
   } catch (error) {
    alert("Problem with registration. Try again.");
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
   <RegisterModalContainer>
    <CloseModalButtonMobile>
     <img src={CloseButton} alt="Close button"  onClick={handleModalClose} />
    </CloseModalButtonMobile>
    <ModalHeader>Sign Up</ModalHeader>
    <ModalSubHeader>Start using OrderlyAI today!</ModalSubHeader>
    <form onSubmit={formik.handleSubmit}>
     <ModalInput placeholder="Email" {...commonInputsProperties("email")}></ModalInput>
     <ModalErrorMessage>{formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}</ModalErrorMessage>
     <ModalInput placeholder="Password" {...commonInputsProperties("password")}></ModalInput>
     <ModalErrorMessage>{formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}</ModalErrorMessage>
     <ModalInput
      id="repeatPassword"
      name="repeatPassword"
      type="password"
      placeholder="Repeat password"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.repeatPassword}></ModalInput>
     <ModalErrorMessage>{formik.touched.repeatPassword && formik.errors.repeatPassword ? <div>{formik.errors.repeatPassword}</div> : null}</ModalErrorMessage>
     <StyledButton type="submit">Sign Up</StyledButton>
    </form>
    <ModalFooter>
     Already have an account?{" "}
     <a
      onClick={() => {
       changeModal("Sign In");
      }}>
      <b>Sign in</b>
     </a>
    </ModalFooter>
   </RegisterModalContainer>
  </Modal>
 );
}
