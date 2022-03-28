import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ModalSelect from "./modalSelect/ModalSelect";

const Pickers: React.FC = () => {
  const classes = useStyles();
  const initialValue = new Date();

  const [year, setYear] = React.useState(initialValue ? initialValue.getFullYear() : 0);
  const [openv1, setOpenv1] = React.useState<boolean>(false);
  const [openv2, setOpenv2] = React.useState<boolean>(false);
  const [openv3, setOpenv3] = React.useState<boolean>(false);

  const years = [...Array(100)].map((_, i) => (new Date().getFullYear() - 18 - i).toString());

  return (
    <div className={classes.wrapper}>
      <div>
        <h4>Version 1</h4>
        <ModalSelect
          open={openv1}
          handleClose={() => setOpenv1(false)}
          options={years.map(option => ({ value: option }))}
          initialValue={year ? year.toString() : years[0]}
          handleSelectChange={value => setYear(parseInt(value))}
          size="small"
          version={1}
        />
        <Button className={classes.buttonSelect} onClick={() => setOpenv1(true)} endIcon={<KeyboardArrowDownIcon />}>
          {year !== 0 ? year.toString() : "Year" ?? "-"}
        </Button>
      </div>

      <div>
        <h4>Version 2</h4>
        <ModalSelect
          open={openv2}
          handleClose={() => setOpenv2(false)}
          options={years.map(option => ({ value: option }))}
          initialValue={year ? year.toString() : years[0]}
          handleSelectChange={value => setYear(parseInt(value))}
          size="small"
          version={2}
        />
        <Button className={classes.buttonSelect} onClick={() => setOpenv2(true)} endIcon={<KeyboardArrowDownIcon />}>
          {year !== 0 ? year.toString() : "Year" ?? "-"}
        </Button>
      </div>

      <div>
        <h4>Version 3</h4>
        <ModalSelect
          open={openv3}
          handleClose={() => setOpenv3(false)}
          options={years.map(option => ({ value: option }))}
          initialValue={year ? year.toString() : years[0]}
          handleSelectChange={value => setYear(parseInt(value))}
          size="small"
          version={3}
        />
        <Button className={classes.buttonSelect} onClick={() => setOpenv3(true)} endIcon={<KeyboardArrowDownIcon />}>
          {year !== 0 ? year.toString() : "Year" ?? "-"}
        </Button>
      </div>
    </div>
  );
};

export default Pickers;

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    "&& > div ": {
      margin: 10,
    },
  },
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
