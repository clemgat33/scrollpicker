import React from "react";
import { makeStyles } from "@material-ui/core";

export interface IProps {
  elements: { value: string; logo?: string }[];
  selectedValue?: string;
  handleSelect: (v: string) => void;
  handleSelectAndClose: (v: string) => void;
  specialType?: "countries" | "logos";
}

const ScrollPicker: React.FC<IProps> = ({
  elements,
  selectedValue,
  handleSelect,
  handleSelectAndClose,
  specialType,
}) => {
  const classes = useStyles();

  const refPicker = React.createRef<HTMLDivElement>();

  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);

  const initialScrollTop = selectedValue
    ? -(elements.map((option) => option.value).indexOf(selectedValue) * 30)
    : 0;

  const [scrollTop, setScrollTop] = React.useState(initialScrollTop);
  const [startY, setStartY] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  });

  const downHandler = (e: any) => {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      handleUpdateScroll(scrollTop + 30);
    } else if (e.key === "ArrowDown") {
      handleUpdateScroll(scrollTop - 30);
    }
  };

  const handleDown = (pageY: number) => {
    setIsScrolling(true);
    setStartY(pageY);
    var br = document.getElementById("scroll_picker")?.getBoundingClientRect();
    setOffsetY(pageY - (br?.top ?? 0));
  };

  const handleMove = (pageY: number) => {
    if (refPicker.current && isScrolling) {
      const walk = startY - pageY;
      if (Math.abs(walk) > 10) {
        setIsMoving(true);
        setStartY(pageY);
        setScrollTop(scrollTop - walk);
      }
    }
  };

  const handleTouchEnd = () => {
    // only when moving (click to select uses onMouseUp)
    if (isMoving) {
      handleUpdateScroll(scrollTop);
    }
  };

  const afterTouching = () => {
    if (isMoving) {
      handleUpdateScroll(scrollTop);
    } else {
      handleClickOnValue();
    }
  };

  const handleClickOnValue = () => {
    // when clicking on a specific value
    const clickedScrollTop = 90 - offsetY + scrollTop;
    setIsMoving(false);
    setIsScrolling(false);
    const newScrollTop = getCorrectedScrollTop(clickedScrollTop);
    setScrollTop(newScrollTop);
    const value = getExactValue(newScrollTop);
    handleSelectAndClose(value);
  };

  const handleUpdateScroll = (scroll: number) => {
    setIsMoving(false);
    setIsScrolling(false);
    const newScrollTop = getCorrectedScrollTop(scroll);
    setScrollTop(newScrollTop);
    handleSelectValue(newScrollTop);
  };

  const handleWheel = (e: any /*React.WheelEvent<HTMLDivElement>*/) => {
    if (e.nativeEvent.wheelDeltaY > 0) {
      let newScrollTop = getCorrectedScrollTop(scrollTop + 30);
      setScrollTop(newScrollTop);
      const value = getExactValue(newScrollTop);
      handleSelect(value);
    } else if (e.nativeEvent.wheelDeltaY < 0) {
      let newScrollTop = getCorrectedScrollTop(scrollTop - 30);
      setScrollTop(newScrollTop);
      handleSelectValue(newScrollTop);
    }
  };

  const handleSelectValue = (scrollY: number) => {
    const value = getExactValue(scrollY);
    handleSelect(value);
  };

  const getCorrectedScrollTop = (st: number) => {
    let correctedScrollTop = st;
    if (st > 0) {
      // start of list
      correctedScrollTop = 0;
    } else if (st < -1 * (elements.length - 1) * 30) {
      // end of list
      correctedScrollTop = -1 * (elements.length - 1) * 30;
    } else {
      // correcting by mulitple of 30
      const closestPoint = Math.round(st / 30) * 30;
      if (st > closestPoint) {
        // clicked before
        correctedScrollTop = closestPoint + 30;
      } else if (st < closestPoint - 30) {
        // clicked after
        correctedScrollTop = closestPoint - 30;
      } else correctedScrollTop = closestPoint;
    }
    return correctedScrollTop;
  };

  const getExactValue = (st: number) => {
    const index = -st / 30;
    const value = elements[index].value;
    return value;
  };

  const getStylePerItem = (index: number) => {
    const roundedScrollTop = Math.round(scrollTop / 30) * 30;
    if (index * 30 === -roundedScrollTop) {
      return "selected";
    } else if (
      (index + 1) * 30 === -roundedScrollTop ||
      (index - 1) * 30 === -roundedScrollTop
    ) {
      return "selected1";
    } else if (
      (index + 2) * 30 === -roundedScrollTop ||
      (index - 2) * 30 === -roundedScrollTop
    ) {
      return "selected2";
    } else {
      return "selected3";
    }
  };

  const items = (
    <div
      className={classes.elements}
      style={{ top: scrollTop + 90 }}
      onWheel={handleWheel}
    >
      {elements.map((element, index) => (
        <div
          key={element.value}
          className={`${classes.element} ${getStylePerItem(index)}`}
          dir="ltr"
        >
          {!specialType ? (
            element.value
          ) : (
            <>
              {specialType === "countries" && element.value}
              {specialType === "logos" && element.logo && (
                <img src={element.logo} alt={element.value} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      id="scroll_picker"
      className={classes.container}
      ref={refPicker}
      onMouseDown={(e: React.MouseEvent) => handleDown(e.pageY)}
      onMouseMove={(e: React.MouseEvent) => handleMove(e.pageY)}
      onMouseUp={afterTouching}
      onMouseLeave={() => handleUpdateScroll(scrollTop)}
      onTouchStart={(e: React.TouchEvent) => handleDown(e.touches[0].pageY)}
      onTouchMove={(e: React.TouchEvent) => handleMove(e.touches[0].pageY)}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <div className={classes.itemBox} />
        {items}
      </div>
    </div>
  );
};

export default ScrollPicker;

const useStyles = makeStyles(() => ({
  container: {
    margin: "auto",
    width: "100%",
    height: 7 * 30,
    backgroundColor: "#F1F1F1",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
    cursor: "grab",
    "&& :active": {
      cursor: "grabbing",
    },
  },
  itemBox: {
    position: "absolute",
    width: "100%",
    height: 30,
    top: 3 * 30,
    borderTop: " 1px solid rgba(0,0,0,.5)",
    borderBottom: "1px solid rgba(0,0,0,.5)",
  },
  elements: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  element: {
    display: "block",
    height: 30,
    padding: "0 5px",
    fontWeight: 600,
    lineHeight: "30px",
    textAlign: "center",
    userSelect: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    justifyContent: "center",
    alignItems: "center",
    "& img": {
      height: 24,
      width: "100%",
      objectFit: "scale-down",
      userDrag: "none",
    },
    "&.selected": {
      fontSize: 15,
      opacity: 1,
      letterSpacing: "-.5px",
    },
    "&.selected1": {
      fontSize: 12,
      opacity: 0.8,
      "&& > img": {
        height: 20,
        filter: "grayscale(80%)",
      },
    },
    "&.selected2": {
      fontSize: 8,
      opacity: 0.6,
      "&& > img": {
        height: 18,
        filter: "grayscale(90%)",
      },
    },
    "&.selected3": {
      fontSize: 6,
      opacity: 0.4,
      "& > img": {
        height: 16,
        filter: "grayscale(100%)",
      },
    },
  },
}));
