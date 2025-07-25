import { toast } from "react-toastify";

export const showFaliureToast = (message) => {
  toast.error(message, {
    style: {
      backgroundColor: "#F8D7DA",
      fontSize: 14,
      fontWeight: 400,
      color: "#E74C3C",
      border: "2px solid #E74C3C",
    },
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    style: {
      backgroundColor: "#D1ECF1",
      fontSize: 14,
      fontWeight: 400,
      color: "#3498DB",
      border: "2px solid #3498DB",
    },
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    style: {
      backgroundColor: "#FFF3CD",
      fontSize: 14,
      fontWeight: 400,
      color: "#FFBB33",
      border: "2px solid #FFBB33",
    },
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      backgroundColor: "#D1ECDD",
      fontSize: 14,
      fontWeight: 400,
      color: "#1AA053",
      border: "2px solid #1AA053",
    },
  });
};
