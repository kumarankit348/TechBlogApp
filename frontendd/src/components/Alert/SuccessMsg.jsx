import Swel from "sweetalert2";
import { resetSuccessAction } from "../../redux/slices/globalSlice/globalSlice";
import { useDispatch } from "react-redux";
const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  Swel.fire({
    icon: "success",
    title: "Good Job",
    text: message,
  });
  dispatch(resetSuccessAction(resetSuccessAction));
};

export default SuccessMsg;
