import { Alert, AlertColor, Grid, Snackbar } from "@mui/material";
import { Input, Label } from "../../ui";
import { ColorCircle, ColorsGrid, StyledAdminContentContainer, StyledColorsGridImage, StyledColorsGridTitle, StyledGridContainer } from "./AddCategory.styles";
import { StyledIconButton } from "../Menu/Menu.styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateRandomPastelColorsArray } from "../../Context/utils";
import { useContext, useState } from "react";
import { ErrorMessage } from "../../ui/ErrorMessage/ErrorMessage.styles";
import { OrderAiContext } from "../../Context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import CheckButton from "../../assets/clarity_check-line.png";
import CloseButton from "../../assets/clarity_close-line.png";
import ReloadButton from "../../assets/clarity_refresh-line.png";

const categoryExistsMessage = "Category name already exists!";

export const AddCategory = () => {
 const navigate = useNavigate();
 const { categories, jsonData, gptData, addCategory, findFreeCategoryId } = useContext(OrderAiContext);
 const [colors, setColors] = useState<string[]>(generateRandomPastelColorsArray(48));
 const dataToUse = gptData || jsonData || categories || [];
 const [open, setOpen] = useState(false);
 const [message, setMessage] = useState("");
 const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

 const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === "clickaway") {
   return;
  }

  setOpen(false);
 };

 const form = useFormik({
  initialValues: {
   name: "",
   imageUrl: "",
   color: colors[0],
  },
  validationSchema: Yup.object({
   name: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
   color: Yup.string().required("Required"),
  }),
  onSubmit: (values) => {
   const isCategoryNameExists = dataToUse.some((category) => category.name === values.name);

   const errorElement = document.getElementById("error-message");
   if (isCategoryNameExists) {
    if (errorElement) {
     errorElement.textContent = categoryExistsMessage;
    }
   } else {
    if (errorElement) {
     errorElement.textContent = "";
    }
    addCategory({
     name: values.name,
     imageUrl: values.imageUrl,
     color: values.color,
     id: findFreeCategoryId(),
     products: [],
    });
    setOpen(true);
    setMessage("Category added successfully!");
    setSeverity("success");
    setTimeout(() => {
     navigate("/admin");
    }, 500);
   }
  },
 });

 const handleColorClick = (color: string) => {
  form.setFieldValue("color", color);
 };

 const reloadColors = () => {
  setColors(generateRandomPastelColorsArray(48));
  form.values.color = "";
 };

 return (
  <StyledAdminContentContainer>
   <form onSubmit={form.handleSubmit}>
    <StyledGridContainer container spacing={2}>
     <Grid container justifyContent={"left"} item desktop={8} laptop={8} tablet={8} mobile={12} order={{ tablet: 1, mobile: 2 }}>
      <Label htmlFor="name">Name:</Label>
      <Input
       variant="standard"
       placeholder="chatbots"
       InputProps={{
        disableUnderline: true,
       }}
       {...form.getFieldProps("name")}
      />
      <ErrorMessage>{form.touched.name && form.errors.name ? <div>{form.errors.name}</div> : null}</ErrorMessage>
      <ErrorMessage>{categoryExistsMessage ? <div id="error-message"></div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"end"} item desktop={2} laptop={2} tablet={4} mobile={12} order={{ tablet: 2, mobile: 1 }}>
      <Grid container justifyContent={"space-between"}>
       <StyledIconButton type="submit">
        <img src={CheckButton} alt="Check button" />
       </StyledIconButton>
       <StyledIconButton>
        <Link to="/admin">
         <img src={CloseButton} alt="Close button" />
        </Link>
       </StyledIconButton>
      </Grid>
     </Grid>
     <Grid container justifyContent={"left"} item desktop={12} laptop={12} tablet={12} mobile={12} order={{ tablet: 2, mobile: 2 }}>
      <StyledColorsGridTitle>
       <Label htmlFor="color" style={{ alignSelf: "flex-start" }}>
        Color:
       </Label>
       <Label
        htmlFor="color"
        style={{
         alignSelf: "flex-end",
         display: "flex",
         alignItems: "center",
        }}>
        {" "}
        <StyledColorsGridImage src={ReloadButton} alt="Reload button" onClick={() => reloadColors()} /> Reload colors
       </Label>
      </StyledColorsGridTitle>
      <ColorsGrid>
       {colors.map((color, index) => (
        <ColorCircle key={index} className={`color-circle ${form.values.color === color ? "selected" : ""}`} style={{ backgroundColor: color }} onClick={() => handleColorClick(color)}></ColorCircle>
       ))}
      </ColorsGrid>
      <ErrorMessage>{form.touched.color && form.errors.color ? <div>{form.errors.color}</div> : null}</ErrorMessage>
     </Grid>
    </StyledGridContainer>
   </form>
   <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
    <Alert variant="filled" onClose={handleClose} severity={severity}>
     {message}
    </Alert>
   </Snackbar>{" "}
  </StyledAdminContentContainer>
 );
};
