import { Box, FormControlLabel, List, ListItem, Typography, styled } from "@mui/material";
import { fontSizeVar } from "../../Theme/variables";

export const UsersEditContainer = styled(Box)(({ theme: theme }) => ({
 height: "fit-content",
 maxHeight: "880px",
 backgroundColor: theme.palette.background.paper,
 borderRadius: "15px",
 padding: "0px",
}));

export const UsersEditList = styled(List)(() => ({
 width: "100%",
 display: "flex",
 flexDirection: "column",
 maxHeight: "100vh",
 overflow: "auto",
 color: fontSizeVar.loginModalDefault,
}));

export const UsersEditListRow = styled(Typography)(() => ({
 display: "flex",
 verticalAlign: "center",
 textAlign: "center",
}));

export const UsersEditListItem = styled(ListItem)(() => ({
 flexDirection: "column",
 alignItems: "flex-start",
 overflowWrap: "break-word",
 wordBreak: "break-all",
 width: "100%",
 flexBasis: "200%",
}));

export const UsersEditCheckbox = styled(FormControlLabel)(() => ({
 alignSelf: "flex-end", 
 width: "100%",
 margin: "auto 0 auto 0",
 paddingRight: "10px",
}));