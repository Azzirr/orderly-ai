import { Alert, AlertColor, Grid, Snackbar } from "@mui/material";
import { Input, Label, ErrorMessage } from "../../ui";
import { ColorCircle, ColorsGrid, StyledAdminContentContainer, StyledColorsGridImage, StyledColorsGridTitle, StyledGridContainer } from "./EditCategory.styles";
import { StyledIconButton } from "../Menu/Menu.styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { generateRandomPastelColorsArray } from "../../Context/utils";
import { OrderAiContext } from "../../Context/ContextProvider";
import { ProductData, User, UserRole } from "../../Context/types";
import useDecrypt from "../../Hooks/useDecrypt";
import CheckButton from "../../assets/clarity_check-line.png";
import CloseButton from "../../assets/clarity_close-line.png";
import TrashButton from "../../assets/clarity_trash-line.png";
import RefreshButton from "../../assets/clarity_refresh-line.png";

const categoryExistsMessage = "Category name already exists!";

export const EditCategory = () => {
 const navigate = useNavigate();
 const { categories, jsonData, gptData, editCategory, deleteCategory } = useContext(OrderAiContext);
 const dataToUse = gptData || jsonData || categories || [];

 const { id } = useParams<{ id: string }>();
 const [colors, setColors] = useState<string[]>([]);
 const { parseJwtToken } = useDecrypt();
 const user: User | undefined = parseJwtToken();
 const [categoryProducts, setCategoryProducts] = useState<ProductData[]>([]);
 const [open, setOpen] = useState(false);
 const [message, setMessage] = useState("");
 const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);

 const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === "clickaway") {
   return;
  }

  setOpen(false);
 };

 useEffect(() => {
  dataToUse.forEach((item) => {
   if (item.id == Number(id)) {
    const firstLocalColor = item.color || generateRandomPastelColorsArray(1)[0];
    setColors([firstLocalColor, ...generateRandomPastelColorsArray(47)]);
    form.setValues({
     name: item.name || "",
     imageUrl: item.imageUrl || "",
     color: firstLocalColor,
    });
    setCategoryProducts(item.products || []);
   }
  });
 }, [id, gptData, jsonData, categories]);

 const form = useFormik({
  initialValues: {
   name: "",
   imageUrl: "",
   color: colors[0],
  },
  validationSchema: Yup.object({
   name: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
   imageUrl: Yup.string(),
   color: Yup.string().required("Required"),
  }),
  onSubmit: (values) => {
   const isCategoryNameExists = dataToUse.some((category) => category.name === values.name && category.id !== Number(id));
   const errorElement = document.getElementById("error-message");

   if (isCategoryNameExists) {
    if (errorElement) {
     errorElement.textContent = categoryExistsMessage;
    }
   } else {
    if (errorElement) {
     errorElement.textContent = "";
    }
    let localId = 0;
    if (id !== undefined) {
     localId = parseInt(id, 10);
     editCategory({
      name: values.name,
      imageUrl: values.imageUrl,
      color: values.color,
      id: localId,
      products: categoryProducts,
     });
     setOpen(true);
     setMessage("Category edited successfully!");
     setSeverity("success");
    } else {
     setOpen(true);
     setMessage("Couldn't add category!");
     setSeverity("error");
    }
   }
  },
 });

 const handleRemoveCategory = () => {
  if (id !== undefined) {
   const shouldDelete = window.confirm("Are you sure you want to delete this category?");
   if (shouldDelete) {
    deleteCategory(parseInt(id, 10));
    setOpen(true);
    setMessage("Category deleted successfully!");
    setSeverity("success");
    setTimeout(() => {
     navigate("/admin");
    }, 500);
   }
  } else {
   setOpen(true);
   setMessage("Couldn't delete category!");
   setSeverity("error");
  }
 };

 const handleColorClick = (color: string) => {
  form.setFieldValue("color", color);
 };

 const reloadColors = () => {
  const firstLocalColor = form.values.color || generateRandomPastelColorsArray(1)[0];
  setColors([firstLocalColor, ...generateRandomPastelColorsArray(47)]);
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
      <ErrorMessage>{form.touched.name && form.errors.name ? <div>{form.errors.name}</div> : null}</ErrorMessage>{" "}
      <ErrorMessage>{categoryExistsMessage ? <div id="error-message"></div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"end"} item desktop={4} laptop={4} tablet={4} mobile={12} order={{ tablet: 2, mobile: 1 }}>
      <Grid container justifyContent={"space-between"}>
       <StyledIconButton type="submit">
        <img src={CheckButton} alt="Check button" />
       </StyledIconButton>
       {user && user.role === UserRole.admin ? (
        <StyledIconButton onClick={handleRemoveCategory}>
         <img src={TrashButton} alt="Trash button" />
        </StyledIconButton>
       ) : null}
       <StyledIconButton>
        <Link to="/admin">
         <img src={CloseButton} alt="Close button" />
        </Link>
       </StyledIconButton>
      </Grid>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={12} laptop={12} tablet={12} mobile={12} order={{ tablet: 2, mobile: 2 }}>
      <Grid container justifyContent={"left"} item desktop={12} laptop={12} tablet={12} mobile={12}>
       <StyledColorsGridTitle>
        <Label htmlFor="name" style={{ alignSelf: "flex-start" }}>
         Image:
        </Label>
        <Label
         htmlFor="name"
         style={{
          alignSelf: "flex-end",
          display: "flex",
          alignItems: "center",
         }}>
         {" "}
         <StyledColorsGridImage src={RefreshButton} alt="Refresh button" onClick={() => reloadColors()} /> Reload colors
        </Label>
       </StyledColorsGridTitle>
       <ColorsGrid>
        {colors.map((color, index) => (
         <ColorCircle key={index} className={`color-circle ${form.values.color === color ? "selected" : ""}`} style={{ backgroundColor: color }} onClick={() => handleColorClick(color)}></ColorCircle>
        ))}
       </ColorsGrid>{" "}
       <ErrorMessage>{form.touched.color && form.errors.color ? <div>{form.errors.color}</div> : null}</ErrorMessage>
      </Grid>
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
