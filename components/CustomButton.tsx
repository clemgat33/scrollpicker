import React from "react";
import { makeStyles, CircularProgress, useTheme } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

interface IProps {
  text: string; // already a t('')
  handleClick?: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "reset" | "submit";
  back?: boolean;
  size?: "small";
}

const CustomButton: React.FC<IProps> = ({ handleClick, text, isLoading, disabled, type, back, size }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";

  return (
    <button
      type={type}
      className={`${classes.button} ${isLoading ? "loading" : ""} ${disabled ? "disabled" : ""}`}
      style={size === "small" ? { width: "fit-content" } : {}}
      onClick={(e: React.MouseEvent) => {
        !disabled && handleClick && handleClick(e);
      }}
      disabled={disabled}
    >
      {isLoading ? (
        <CircularProgress size={20} className={classes.loading} />
      ) : back ? (
        <>
          {isRtl ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          <span style={isRtl ? { marginRight: 10 } : { marginLeft: 10 }}>{text}</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;

const useStyles = makeStyles(theme => ({
  button: {
    padding: "0 10px",
    width: 220,
    maxWidth: "100%",
    height: 36,
    border: 0,
    borderRadius: 0,
    textTransform: "uppercase",
    backgroundColor: "#191919",
    color: "#fff",
    fontWeight: 800,
    fontSize: ".8rem",
    transition: ".2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover&:not(.loading)&:not(.disabled)": {
      cursor: "pointer",
      backgroundColor: "#F9C700",
      color: "#191919",
    },
    "&.disabled": {
      color: "#D2D2D2",
      backgroundColor: "#F1F1F1",
    },
  },
  loading: {
    display: "block",
    margin: "auto",
  },
}));
