import { styled } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";

export const StyledAdminContentContainer = styled(Box)(({ theme }) => ({
 backgroundColor: theme.palette.background.paper,
 borderRadius: "16px",
 padding: "30px",
 maxHeight: `calc(100vh - 250px)`,
 marginBottom: "30px",
 [theme.breakpoints.down("laptop")]: {
  marginBottom: "30px",
 },
}));

export const StyledName = styled(Typography)(({ theme }) => ({
 fontSize: "60px",
 color: theme.palette.common.white,
 fontWeight: theme.typography.fontWeightBold,
 [theme.breakpoints.down("laptop")]: {
  fontSize: "40px",
 },
}));
export const StyledGridContainer = styled(Grid)(({ theme }) => ({
 display: "flex",
 justifyContent: "space-between",
 alignItems: "center",
 [theme.breakpoints.down("tablet")]: {
  display: "flex",
  flexDirection: "column",
 },
}));

export const ColorsGrid = styled("div")({
 display: "flex",
 flexDirection: "row",
 flexWrap: "wrap",
 gap: "20px",
 justifyContent: "center",
 overflowY: "scroll",
 paddingTop: "20px",
 maxHeight: "200px",
 crollbarWidth: "thin",
 "&::-webkit-scrollbar": {
  width: "6px",
  height: "6px",
 },
 "&::-webkit-scrollbar-track ": {
  borderRadius: "10px",
  background: "rgba(0,0,0,0.1)",
 },
 "&::-webkit-scrollbar-thumb": {
  borderRadius: "10px",
  background: "rgba(0,0,0,0.2)",
 },
 "&::-webkit-scrollbar-thumb:hover": {
  background: "rgba(0,0,0,0.4)",
 },
 "&::-webkit-scrollbar-thumb:active": {
  background: " rgba(0,0,0,.9)",
 },
});

export const ColorCircle = styled("div")({
 width: "60px",
 height: "60px",
 borderRadius: "50%",
 border: "2px solid #fff",
 cursor: "pointer",
 transition: "transform 0.2s ease-in-out, border-radius 0.2s ease",
 "&:hover": {
  transform: "scale(1.1)",
 },
 "&.selected": {
  borderRadius: "25%",
  transform: "scale(1.1)",
 },
});

export const StyledPreviewText = styled(Typography)(() => ({
 color: "#666",
 variant: "subtitle2",
}));

export const StyledColorsGridTitle = styled("div")({ display: "flex", justifyContent: "space-between", width: "100%" });

export const StyledColorsGridImage = styled("img")({ height: "20px", paddingRight: "10px", cursor: "pointer" });
