import React from "react";
import ModalSelect from "./ModalSelect";
import CustomButton from "../CustomButton";

interface IProps {
  options: { value: string; logo?: string }[];
  selectedValue: string;
  placeholder: string;
  size: "small" | "large";
  handleSelectChange: (value: string) => void;
  specialType?: "countries" | "logos";
}

const SelectButtonWithModal: React.FC<IProps> = ({
  selectedValue,
  options,
  placeholder,
  size,
  handleSelectChange,
  specialType,
}) => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);

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
      <CustomButton
        text={placeholder}
        handleClick={e => {
          e.preventDefault();
          setOpenModal(true);
        }}
      />
    </div>
  );
};

export default SelectButtonWithModal;
