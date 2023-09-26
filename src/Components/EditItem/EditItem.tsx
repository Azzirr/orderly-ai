import { useEffect, useState, useContext } from "react";
import { Grid } from "@mui/material";
import { Input, Label, SelectList, SelectListCheckmarks } from "../../ui";
import { StyledAdminContentContainer, StyledGridContainer, StyledVideoContainer, StyledVideoPreview } from "./EditItem.styles";
import { StyledIconButton } from "../Menu/Menu.styles";
import "./EditItem.css";
import { useParams } from "react-router";
import { useOrderAi } from "../../Context/useOrderAi";
import { useFormik } from "formik";
import { OrderAiContext } from "../../Context/ContextProvider";
// import { User, UserRole } from "../../Context/ContextProvider";
import * as Yup from "yup";
import { ErrorMessage } from "../../ui/ErrorMessage/ErrorMessage.styles";
import useDecrypt from "../../Hooks/useDecrypt";

const names = ["Darmowa", "Płatna"];
const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

export const EditItem = () => {
 const { categories } = useOrderAi();
 const { id } = useParams<{ id: string }>();
 const [youtubeUrl, setyoutubeUrl] = useState<string>("");
 const [validUrl, setValidUrl] = useState(false);
 const categoryNames = categories.map((category) => category.name)
 const { parseJwtToken } = useDecrypt();
//  const user: User | undefined = parseJwtToken();

 useEffect(() => {
  categories.forEach((category) => {
   category.products.forEach((item) => {
    if (item.id == Number(id)) {
     let license = item.license.split(",");
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

 const { getEmbedYTLink } = useContext(OrderAiContext);

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
   console.log(values);
  },
 });

 const commonInputsProperties = (key: "name" | "category" | "license" | "youtubeUrl" | "website" | "description") => ({
  id: key,
  onChange: (e: { target: { value: string } }) => {
   if (key === "youtubeUrl") {
    const isValid = youtubeUrlRegex.test(e.target.value);
    setValidUrl(isValid);
    if (isValid) {
     setyoutubeUrl(getEmbedYTLink(e.target.value));
    }
   }
   form.handleChange(e);
  },
  onBlur: form.handleBlur,
  value: form.values[key],
 });

 const handleClearForm = () => {
  form.resetForm();
 };

 return (
  <StyledAdminContentContainer>
   <form onSubmit={form.handleSubmit}>
    <StyledGridContainer container spacing={2}>
     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12}>
      <Label htmlFor="name">Name:</Label>
      <Input
       variant="standard"
       placeholder="name"
       InputProps={{
        disableUnderline: true,
       }}
       {...commonInputsProperties("name")}
      />{" "}
      <ErrorMessage>{form.touched.name && form.errors.name ? <div>{form.errors.name}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"end"} item desktop={2} laptop={2} tablet={2} mobile={12}>
      <Grid container justifyContent={"space-between"}>
       <StyledIconButton type="submit">
        <img src="../../../src/assets/clarity_check-line.png" />
       </StyledIconButton>
       {/* {user && user.role === UserRole.admin ? ( */}
        <StyledIconButton>
         <img src="../../../src/assets/clarity_trash-line.png" />
        </StyledIconButton>
       {/* ) : null} */}
       <StyledIconButton onClick={handleClearForm}>
        <img src="../../../src/assets/clarity_close-line.png" />
       </StyledIconButton>
      </Grid>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12}>
      <Label htmlFor="category" sx={{ marginRight: "8px" }}>
       Category:{" "}
      </Label>
      <SelectList name="category" items={categoryNames} field={form.getFieldProps("category")} />
      <ErrorMessage>{form.touched.category && form.errors.category ? <div>{form.errors.category}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12}>
      <Label htmlFor="license" sx={{ marginRight: "8px" }}>
       License:{" "}
      </Label>
      <SelectListCheckmarks name="license" items={names} field={form.getFieldProps("license")} />
      <ErrorMessage>{form.touched.license && form.errors.license ? <div>{form.errors.license}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12}>
      <Label htmlFor="website">Website:</Label>
      <Input
       variant="standard"
       placeholder="web url"
       InputProps={{
        disableUnderline: true,
       }}
       {...commonInputsProperties("website")}
      />{" "}
      <ErrorMessage>{form.touched.website && form.errors.website ? <div>{form.errors.website}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item desktop={6} laptop={6} tablet={6} mobile={12}>
      <Label htmlFor="ytUrl">YouTube URL:</Label>
      <Input
       variant="standard"
       placeholder="Enter YouTube Url"
       InputProps={{
        disableUnderline: true,
       }}
       {...commonInputsProperties("youtubeUrl")}
      />{" "}
      <ErrorMessage>{form.touched.youtubeUrl && form.errors.youtubeUrl ? <div>{form.errors.youtubeUrl}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"left"} item laptop={12} desktop={12} tablet={12} mobile={12}>
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
       {...commonInputsProperties("description")}
       multiline
      />{" "}
      <ErrorMessage>{form.touched.description && form.errors.description ? <div>{form.errors.description}</div> : null}</ErrorMessage>
     </Grid>

     <Grid container justifyContent={"center"} item laptop={12} desktop={12} tablet={12} mobile={12} display={"flex"}>
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
  </StyledAdminContentContainer>
 );
};
