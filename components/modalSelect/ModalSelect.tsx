import React from "react";
import { Dialog, DialogContent, makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CustomButton from "../CustomButton";
import ScrollPicker from "./ScrollPicker";
import ScrollPickerV2 from "./ScrollPicker_v2";
import ScrollPickerV3 from "./ScrollPicker_v3";

interface IProps {
  open: boolean;
  handleClose: () => void;
  options: { value: string; logo?: string }[];
  initialValue?: string;
  handleSelectChange: (v: string) => void;
  size: "small" | "large";
  specialType?: "countries" | "logos";
  version?: 1 | 2 | 3;
}

const ModalSelect: React.FC<IProps> = ({
  open,
  handleClose,
  options,
  initialValue,
  handleSelectChange,
  size,
  specialType,
  version,
}) => {
  const classes = useStyles();

  let value = initialValue;

  const handleSelect = (v: string) => {
    value = v;
  };

  const handleSelectAndClose = (v: string) => {
    if (v) handleSelectChange(v);
    handleClose();
  };

  const handleChooseValue = () => {
    if (value) handleSelectChange(value);
    handleClose();
  };

  const onClose = () => {
    handleClose();
  };

  const downHandler = (e: any) => {
    e.preventDefault();
    if (e.key === "Enter") {
      handleChooseValue();
    }
  };

  React.useEffect(() => {
    if (open) window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [open]);

  return (
    <Dialog className={classes.dialog} open={open} onClose={handleChooseValue}>
      <DialogContent style={size === "small" ? { width: 262 } : { width: 262 }}>
        <div className={classes.closeIcon}>
          <CloseIcon onClick={onClose} />
        </div>
        <div style={size === "small" ? { width: 100 } : { width: 200 }} className={classes.wrapper}>
          {version === 3 && (
            <ScrollPickerV3
              elements={options}
              selectedValue={value}
              handleSelect={handleSelect}
              handleSelectAndClose={handleSelectAndClose}
              specialType={specialType}
            />
          )}
          {version === 1 && (
            <ScrollPicker
              elements={options}
              selectedValue={value}
              handleSelect={handleSelect}
              handleSelectAndClose={handleSelectAndClose}
              specialType={specialType}
            />
          )}
        </div>
        <div className={classes.button} style={size === "small" ? {} : { width: 200 }}>
          <CustomButton handleClick={handleChooseValue} text="OK" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSelect;

const useStyles = makeStyles({
  dialog: {
    "&& .MuiDialogContent-root": {
      maxWidth: "calc(100% - 20px)",
      padding: 10,
    },
  },
  closeIcon: {
    width: "fit-content",
    marginLeft: "auto",
    stroke: "black",
    strokeWidth: 1,
    "&:hover": {
      cursor: "pointer",
    },
  },
  wrapper: {
    margin: "auto",
  },
  button: {
    width: "fit-content",
    margin: "auto",
    marginTop: 20,
  },
});
