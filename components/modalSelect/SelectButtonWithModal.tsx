import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import ModalSelect from "./ModalSelect";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";

interface IProps {
  options: { value: string; logo?: string }[];
  selectedValue: string; //t()
  placeholder: string; //t()
  size: "small" | "large";
  handleSelectChange: (value: string) => void;
  fixedPlaceholder?: boolean;
  specialType?: "countries" | "logos";
}

const SelectButtonWithModal: React.FC<IProps> = ({
  selectedValue,
  options,
  placeholder,
  size,
  handleSelectChange,
  fixedPlaceholder,
  specialType,
}) => {
  const classes = useStyles();

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const placedValue = fixedPlaceholder || selectedValue === "" ? placeholder : selectedValue ?? "-";

  return (
    <div>
      <ModalSelect
        open={openModal}
        handleClose={() => setOpenModal(false)}
        options={options}
        initialValue={selectedValue}
        handleSelectChange={handleSelectChange}
        size={size}
        specialType={specialType}
      />
      <Button
        className={classes.buttonSelect}
        fullWidth
        onClick={() => setOpenModal(true)}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {placedValue}
      </Button>
    </div>
  );
};

export default SelectButtonWithModal;

const useStyles = makeStyles(() => ({
  buttonSelect: {
    textTransform: "none",
    borderRadius: 0,
    height: 36,
    background: "rgba(0, 0, 0, 0.09)",
    color: "rgba(0,0,0,0.9)",
    fontSize: ".8rem",
    fontWeight: 400,
    "&& > span": {
      justifyContent: "space-between",
    },
  },
}));
