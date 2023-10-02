import { useContext } from "react";
import { OrderAiContext } from "../../Context/ContextProvider";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { Loading } from "../LoadingApi/Loading.style";

export function LoadingModal() {
 const { handleModalClose, isModalOpen } = useContext(OrderAiContext);

 return (
  <Modal open={isModalOpen} onClose={handleModalClose}>
   <Loading>
    <CircularProgress color="secondary" />
   </Loading>
  </Modal>
 );
}
