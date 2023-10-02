import { useEffect, useState, useContext } from "react";
import { Alert, AlertColor, Grid, Snackbar } from "@mui/material";
import { Input, Label, SelectList, SelectListCheckmarks } from "../../ui";
import { StyledAdminContentContainer, StyledGridContainer, StyledVideoContainer, StyledVideoPreview } from "./EditItem.styles";
import { StyledIconButton } from "../Menu/Menu.styles";
import "./EditItem.css";
import { useParams } from "react-router";
import { useFormik } from "formik";
import { OrderAiContext } from "../../Context/ContextProvider";
import * as Yup from "yup";
import { ErrorMessage } from "../../ui/ErrorMessage/ErrorMessage.styles";
import { UserRole } from "../../Context/types";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckButton from "../../assets/clarity_check-line.png";
import CloseButton from "../../assets/clarity_close-line.png";
import TrashButton from "../../assets/clarity_trash-line.png";

const names = ["Darmowa", "Płatna"];
const productExistsMessage = "Product name already exists!";
const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

export const EditItem = () => {
 const navigate = useNavigate();

 const { categories, jsonData, gptData, editProduct, deleteProduct, loggedUserRole, findCategoryId, getEmbedYTLink } = useContext(OrderAiContext);
 const { id } = useParams<{ id: string }>();
 const dataToUse = gptData || jsonData || categories || [];

 let productIdInt = 0;
 if (id !== undefined) {
  productIdInt = parseInt(id, 10);
 } else {
  productIdInt = 0;
 }
 const [youtubeUrl, setyoutubeUrl] = useState<string>("");
 const [validUrl, setValidUrl] = useState(false);
 const categoryNames = dataToUse ? dataToUse.map((category) => category.name) : [];
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
  dataToUse.forEach((category) => {
   category.products.forEach((item) => {
    if (item.id == Number(id)) {
      const license = item.license.split(",");
     form.setValues({
      name: item.name || "",
      category: category.name || "",
      license: license || [],
      website: item.website || "",
      youtubeUrl: item.youtubeUrl || "",
      description: item.description || "",
     });
     const isValid = youtubeUrlRegex.test(item.youtubeUrl);
     setValidUrl(isValid);
     if (isValid) {
      setyoutubeUrl(getEmbedYTLink(item.youtubeUrl));
     }
    }
   });
  });
 }, [categories, id]);

 const form = useFormik({
  initialValues: {
   name: "",
   category: "",
   license: [] as string[],
   website: "",
   youtubeUrl: "",
   description: "",
  },
  validationSchema: Yup.object({
   name: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
   category: Yup.string().required("Required"),
   license: Yup.array().min(1, "Array must not be empty").required("Required"),
   website: Yup.string()
    .matches(/(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, "Enter correct url!")
    .required("Required"),
   youtubeUrl: Yup.string().matches(youtubeUrlRegex, "Invalid YouTube URL").required("Required"),
   description: Yup.string().min(3, "Must be 3 characters or more").max(150, "Must be 150 characters or less").required("Required"),
  }),
  onSubmit: (values) => {
   const isProductNameExists = dataToUse.some((category) => category.name === values.name);
   const errorElement = document.getElementById("error-message");
   if (isProductNameExists) {
    if (errorElement) {
     errorElement.textContent = productExistsMessage;
    }
   } else {
    if (errorElement) {
     errorElement.textContent = "";
    }
    const categoryId = findCategoryId(values.category);
    editProduct(
     {
      id: productIdInt,
      name: values.name,
      license: values.license.join(","),
      website: values.website,
      youtubeUrl: values.youtubeUrl,
      description: values.description,
     },
     categoryId,
    );
    setOpen(true);
    setMessage("Product edited successfully!");
    setSeverity("success");
   }
  },
 });

 const handleYoutubeUrlChange = (e: { target: { value: string } }) => {
  const isValid = youtubeUrlRegex.test(e.target.value);
  setValidUrl(isValid);
  if (isValid) {
   setyoutubeUrl(getEmbedYTLink(e.target.value));
  }
  form.handleChange(e);
 };

 const handleDeleteProduct = () => {
  if (id !== undefined) {
   const shouldDelete = window.confirm("Are you sure you want to delete this category?");
   if (shouldDelete) {
    deleteProduct(productIdInt, findCategoryId(form.values.category));
    setOpen(true);
    setMessage("Product deleted successfully!");
    setSeverity("success");
    setTimeout(() => {
     navigate("/admin");
    }, 1500);
   }
  } else {
   setOpen(true);
   setMessage("Couldn't delete product!");
   setSeverity("error");
  }
 };

 return (
  <StyledAdminContentContainer>
   <form onSubmit={form.handleSubmit}>
    <StyledGridContainer container spacing={2}>
     <Grid container justifyContent={"left"} item desktop={8} laptop={8} tablet={8} mobile={12} order={{ tablet: 1, mobile: 2 }}>
      <Label htmlFor="name">Name:</Label>
      <Input
       variant="standard"
       placeholder="name"
       InputProps={{
        disableUnderline: true,
       }}
       {...form.getFieldProps("name")}
      />{" "}
      <ErrorMessage>{form.touched.name && form.errors.name ? <div>{form.errors.name}</div> : null}</ErrorMessage>{" "}
      <ErrorMessage>{productExistsMessage ? <div id="error-message"></div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"end"} item desktop={4} laptop={4} tablet={4} mobile={12} order={{ tablet: 2, mobile: 1 }}>
      <Grid container justifyContent={"space-between"}>
       <StyledIconButton type="submit">
        <img src={CheckButton} alt="Check button" />
       </StyledIconButton>
       {loggedUserRole === UserRole.admin ? (
        <StyledIconButton onClick={handleDeleteProduct}>
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

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12} order={{ mobile: 3 }}>
      <Label htmlFor="category" sx={{ marginRight: "8px" }}>
       Category:{" "}
      </Label>
      <SelectList name="category" items={categoryNames} field={form.getFieldProps("category")} />
      <ErrorMessage>{form.touched.category && form.errors.category ? <div>{form.errors.category}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12} order={{ mobile: 4 }}>
      <Label htmlFor="license" sx={{ marginRight: "8px" }}>
       License:{" "}
      </Label>
      <SelectListCheckmarks name="license" items={names} field={form.getFieldProps("license")} />
      <ErrorMessage>{form.touched.license && form.errors.license ? <div>{form.errors.license}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12} order={{ mobile: 5 }}>
      <Label htmlFor="website">Website:</Label>
      <Input
       variant="standard"
       placeholder="web url"
       InputProps={{
        disableUnderline: true,
       }}
       {...form.getFieldProps("website")}
      />{" "}
      <ErrorMessage>{form.touched.website && form.errors.website ? <div>{form.errors.website}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12} order={{ mobile: 6 }}>
      <Label htmlFor="youtubeUrl">YouTube URL:</Label>
      <Input
       variant="standard"
       placeholder="Enter YouTube Url"
       InputProps={{
        disableUnderline: true,
       }}
       {...form.getFieldProps("youtubeUrl")}
       onChange={handleYoutubeUrlChange}
      />{" "}
      <ErrorMessage>{form.touched.youtubeUrl && form.errors.youtubeUrl ? <div>{form.errors.youtubeUrl}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item laptop={12} desktop={12} tablet={12} mobile={12} order={{ mobile: 7 }}>
      <Label htmlFor="description">Description:</Label>
      <Input
       sx={{ height: "120px" }}
       variant="standard"
       placeholder="description"
       InputProps={{
        disableUnderline: true,
        minRows: 3,
        maxRows: 4,
       }}
       {...form.getFieldProps("description")}
       multiline
      />{" "}
      <ErrorMessage>{form.touched.description && form.errors.description ? <div>{form.errors.description}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"center"} item laptop={12} desktop={12} tablet={12} mobile={12} display={"flex"} order={{ mobile: 8 }}>
      <Grid item laptop={6} desktop={6} tablet={6} mobile={12}>
       <StyledVideoContainer>
        <StyledVideoPreview>
         {validUrl && (
          <iframe
           width="100%"
           height="100%"
           src={youtubeUrl}
           title="YouTube Video"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen></iframe>
         )}
        </StyledVideoPreview>
       </StyledVideoContainer>
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
