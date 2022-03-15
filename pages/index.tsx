import React from "react";
import { makeStyles, Button } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ModalSelect from "../components/modalSelect/ModalSelect";

const Home: React.FC = () => {
  const classes = useStyles();
  const initialValue = new Date();

  const [year, setYear] = React.useState(
    initialValue ? initialValue.getFullYear() : 0
  );
  const [open, setOpen] = React.useState<boolean>(false);

  const years = [...Array(100)].map((_, i) =>
    (new Date().getFullYear() - 18 - i).toString()
  );

  return (
    <div style={{ margin: 40 }}>
      <h1>ScrollPicker</h1>
      <div>
        <ModalSelect
          open={open}
          handleClose={() => setOpen(false)}
          options={years.map((option) => ({ value: option }))}
          initialValue={year ? year.toString() : years[0]}
          handleSelectChange={(value) => setYear(parseInt(value))}
          size="small"
        />
        <Button
          className={classes.buttonSelect}
          onClick={() => setOpen(true)}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {year !== 0 ? year.toString() : "Year" ?? "-"}
        </Button>
      </div>
    </div>
  );
};

export default Home;

const useStyles = makeStyles((theme) => ({
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
