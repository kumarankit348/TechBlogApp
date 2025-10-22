import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Swel from "sweetalert2";
import { resetErrorAction } from "../../redux/slices/globalSlice/globalSlice";

const ErrorMsg = ({ message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Swel.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      }).then(() => {
        // clear error after showing popup
        dispatch(resetErrorAction());
      });
    }
  }, [message, dispatch]);

  return null; // no UI needed, just handles alert
};

export default ErrorMsg;
