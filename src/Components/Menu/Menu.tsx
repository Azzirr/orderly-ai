import { useRef, useState } from "react";
import {
 LogoDesktop,
 LogoMobile,
 StyledAvatar,
 StyledButtonContainer,
 StyledCloseIcon,
 StyledDrawer,
 StyledIconButton,
 StyledIconButtonMenu,
 StyledLogoContainer,
 StyledMenu,
 StyledMenuIcon,
} from "./Menu.styles";
import { Box, Divider, ListItem, ListItemButton } from "@mui/material";
import List from "@mui/material/List";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { OrderAiContext } from "../../Context/ContextProvider";
import { ModeToggle, SignIn } from "..";
import { SignOut } from "../SignButtons/SignOut";
import { AdminPanel } from "../SignButtons/AdminPanel";
import useClickOutside from "../../Hooks/useClickOutside";
import ImportButton from "../../assets/clarity_import-line.png";
import ExportButton from "../../assets/clarity_export-line.png";
import AvatarPhoto from "../../assets/clarity_avatar-line.png";
import LogoDesktopImg from "../../assets/logo.png";
import LogoMobileImg from "../../assets/logo_mobile.png";

export const Menu = () => {
 const { loggedUserRole, loggedUserEmail, changeModal, handleModalOpen } = useContext(OrderAiContext);
 const [showButtons, setShowButtons] = useState("none");
 const [open, setOpen] = useState(false);

 const handleDrawerOpen = () => {
  setOpen((prev) => !prev);
 };

 const showHideLoginButtons = () => {
  if (showButtons === "none") {
   return setShowButtons("block");
  } else {
   return setShowButtons("none");
  }
 };

 const handleImport = () => {
  handleModalOpen();
  changeModal("Import");
 };

 const handleExport = () => {
  handleModalOpen();
  changeModal("Export");
 };

 const buttonsContainerStyles = {
  display: showButtons,
  position: "absolute",
  marginTop: "20px",
  marginLeft: "30px",
  backgroundColor: "transparent",
  zIndex: "1000",
 };

 const outsideClickRef = useRef(null);
 const handleClickOutsideMenuButtons = () => {
  setShowButtons("none");
 };
 useClickOutside(outsideClickRef, handleClickOutsideMenuButtons);

 return (
  <Box sx={{ justifySelf: "center" }}>
   <StyledMenu>
    <ModeToggle />
    <StyledIconButton onClick={handleImport}>
     <img src={ImportButton} alt="Import button" />
    </StyledIconButton>
    <StyledIconButton onClick={handleExport}>
     <img src={ExportButton} alt="Export button" />
    </StyledIconButton>
    {loggedUserRole ? (
     <StyledIconButton onClick={showHideLoginButtons}>
      <StyledAvatar>{loggedUserEmail.slice(0, 2)}</StyledAvatar>
     </StyledIconButton>
    ) : (
     <StyledIconButton onClick={showHideLoginButtons}>
      <img src={AvatarPhoto} alt="Avatar" />
     </StyledIconButton>
    )}
   </StyledMenu>
   {open ? (
    <StyledIconButtonMenu onClick={handleDrawerOpen} sx={{ display: "flex", justifyContent: "end" }}>
     {<StyledCloseIcon />}
    </StyledIconButtonMenu>
   ) : (
    <StyledIconButtonMenu onClick={handleDrawerOpen}>{<StyledMenuIcon />}</StyledIconButtonMenu>
   )}
   <StyledDrawer variant="persistent" anchor="right" open={open}>
    <Divider />
    <List>
     <ListItem>
      <ListItemButton sx={{ display: "flex", justifyContent: "center" }} onClick={handleDrawerOpen}>
       <StyledButtonContainer>
        {loggedUserRole ? (
         <>
          <SignOut />
          <AdminPanel />
          <StyledAvatar>{loggedUserEmail.slice(0, 2)}</StyledAvatar>
          <ModeToggle />
         </>
        ) : (
         <>
          <SignIn />
          <ModeToggle />
         </>
        )}
       </StyledButtonContainer>
      </ListItemButton>
     </ListItem>
    </List>
   </StyledDrawer>
   <Box sx={buttonsContainerStyles} ref={outsideClickRef}>
    {loggedUserRole ? (
     <>
      <SignOut />
      <AdminPanel />
     </>
    ) : (
     <SignIn />
    )}
   </Box>
  </Box>
 );
};

export const LogoContainer = () => {
 return (
  <Link to="/">
   <StyledLogoContainer>
    <LogoMobile>
     <img src={LogoMobileImg} alt="Logo mobile" />
    </LogoMobile>
    <LogoDesktop>
     <img src={LogoDesktopImg} alt="Logo desktop" />
    </LogoDesktop>
   </StyledLogoContainer>
  </Link>
 );
};
