import React from "react";
import { makeStyles } from "@material-ui/core";
import Scrollbar from "smooth-scrollbar";
import { ScrollStatus } from "smooth-scrollbar/interfaces";

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
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  let scrollbar: Scrollbar | null = null;

  React.useEffect(() => {
    initScrollbar();

    return () => {
      if (scrollbar) {
        scrollbar.removeListener(listenerScrollbar);
        scrollbar.destroy();
      }
    };
  }, []);

  const initialScrollTop = selectedValue ? elements.map(elem => elem.value).indexOf(selectedValue) * 30 : 0;

  const options = {
    damping: 0.1,
    plugins: {
      overscroll: { enable: true, effect: "bounce", damping: 0.15, maxOverscroll: 150 },
    },
  };
  const initScrollbar = () => {
    if (!scrollbar && scrollerRef.current) {
      scrollbar = Scrollbar.init(scrollerRef.current, options);
      scrollbar.scrollTop = initialScrollTop;
      scrollbar.addListener(listenerScrollbar);
      if (scrollerRef.current?.children[0]) styleChildren(scrollerRef.current.children[0].children, initialScrollTop);
    }
  };

  const listenerScrollbar = (status: ScrollStatus) => {
    const closestPoint = Math.round(status.offset.y / 30) * 30;
    if (scrollbar) scrollbar.scrollTop = closestPoint;
    const value = getSelectedValue(closestPoint);
    handleSelect(value);
    if (scrollerRef.current?.children[0]) styleChildren(scrollerRef.current.children[0].children, closestPoint);
  };

  const styleChildren = (children: any, offsetY: number) => {
    // selected child
    children[offsetY / 30 + 3]?.setAttribute("data-selected", "0");
    // selected child +- 1
    children[offsetY / 30 + 2]?.setAttribute("data-selected", "1");
    children[offsetY / 30 + 4]?.setAttribute("data-selected", "1");
    // selected child +- 2
    children[offsetY / 30 + 1]?.setAttribute("data-selected", "2");
    children[offsetY / 30 + 5]?.setAttribute("data-selected", "2");
    // selected child +- 3
    children[offsetY / 30]?.setAttribute("data-selected", "3");
    children[offsetY / 30 + 6]?.setAttribute("data-selected", "3");
  };

  //=== START DRAGGABLE ===//
  let initialPosition = {
    scrollTop: 0,
    mouseY: 0,
    offsetY: 0,
    isMoving: false,
  };

  const handleClick = (clickedPoint: number) => {
    const closestPoint = getClosestPoint(clickedPoint, true);
    const value = getSelectedValue(closestPoint);
    handleSelectAndClose(value);
  };

  const getSelectedValue = (point: number) => {
    const index = point / 30;
    const value = elements[index].value;
    return value;
  };

  const getClosestPoint = (offsetY: number, isOnClick?: boolean) => {
    // correcting by mulitple of 30
    const closestPoint = Math.ceil(offsetY / 30) * 30;
    if (isOnClick) {
      if (offsetY < 0) {
        // start of list
        return 0;
      } else if (offsetY > (elements.length - 1) * 30) {
        // end of list
        return (elements.length - 1) * 30;
      } else {
        if (offsetY < closestPoint) {
          // clicked before
          return closestPoint - 30;
        } else if (offsetY > closestPoint - 30) {
          // clicked after
          return closestPoint + 30;
        }
      }
      return closestPoint;
    }
    return closestPoint;
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const { clientY } = event.touches[0];
    if (scrollbar && scrollerRef.current) {
      // Save the position at the moment the user presses down
      var br = document.getElementById("scroll_picker")?.getBoundingClientRect();
      initialPosition = {
        ...initialPosition,
        scrollTop: scrollbar.scrollTop,
        mouseY: clientY,
        offsetY: clientY - (br?.top ?? 0),
      };

      scrollerRef.current.style.cursor = "grabbing";

      // Add the event listeners that will track the mouse position for the rest of the interaction
      document.addEventListener("touchmove", touchMoveHandler);
      document.addEventListener("touchup", touchUpHandler);
    } else initScrollbar();
  };

  const touchMoveHandler = (event: TouchEvent) => {
    const { clientY } = event.touches[0];
    if (scrollbar && scrollerRef.current) {
      const distanceY = clientY - initialPosition.mouseY;
      if (Math.abs(distanceY) > 10) {
        initialPosition.isMoving = true;
        // Scroll the element according to those differences
        scrollbar.scrollTop = initialPosition.scrollTop - distanceY;
      } else initialPosition.isMoving = false;
    }
  };

  const touchUpHandler = () => {
    if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
    // Remove the event listeners since it is not necessary to track the mouse position anymore
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    if (initialPosition.isMoving === false && scrollbar) {
      const clickedPoint = initialPosition.offsetY + scrollbar.scrollTop - 90;
      handleClick(clickedPoint);
    } else initialPosition.isMoving = false;
  };

  const onMouseDown = (event: { clientY: number }) => {
    console.log("onMouseDown", scrollbar, scrollerRef.current);
    if (scrollbar && scrollerRef.current) {
      // Save the position at the moment the user presses down
      var br = document.getElementById("scroll_picker")?.getBoundingClientRect();
      initialPosition = {
        ...initialPosition,
        scrollTop: scrollbar.scrollTop,
        mouseY: event.clientY,
        offsetY: event.clientY - (br?.top ?? 0),
      };

      scrollerRef.current.style.cursor = "grabbing";

      // Add the event listeners that will track the mouse position for the rest of the interaction
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    } else initScrollbar();
  };

  const mouseMoveHandler = (event: { clientY: number }) => {
    if (scrollbar && scrollerRef.current) {
      const distanceY = event.clientY - initialPosition.mouseY;
      if (Math.abs(distanceY) > 10) {
        initialPosition.isMoving = true;
        // Scroll the element according to those differences
        scrollbar.scrollTop = initialPosition.scrollTop - distanceY;
      } else initialPosition.isMoving = false;
    }
  };

  const mouseUpHandler = () => {
    if (scrollerRef.current) scrollerRef.current.style.cursor = "grab";
    // Remove the event listeners since it is not necessary to track the mouse position anymore
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    if (initialPosition.isMoving === false && scrollbar) {
      const clickedPoint = initialPosition.offsetY + scrollbar.scrollTop - 90;
      handleClick(clickedPoint);
    } else initialPosition.isMoving = false;
  };
  //=== END DRAGGABLE ===//

  const emptyElems: { value: string; logo?: string }[] = [...Array(3)].map(() => ({ value: "" }));
  const elementsWithEmpty = [...emptyElems, ...elements, ...emptyElems];

  return (
    <div id="scroll_picker" className={classes.container} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
      <div className={classes.itemBox} />
      <div ref={scrollerRef} className={classes.elements}>
        {elementsWithEmpty.map((elem, index) => (
          <div key={index} className={classes.element}>
            {!specialType ? (
              elem.value
            ) : (
              <>
                {specialType === "countries" && elem.value}
                {specialType === "logos" && elem.logo && <img src={elem.logo} alt={elem.value} />}
              </>
            )}
          </div>
        ))}
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
    position: "relative",
    overflow: "hidden",
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
    cursor: "grab",
    height: "100%",
    "& .scrollbar-track.scrollbar-track-y": {
      display: "none !important",
    },
  },
  element: {
    display: "flex",
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
    fontSize: 6,
    opacity: 0.4,
    "& img": {
      height: 16,
      filter: "grayscale(100%)",
      width: "100%",
      objectFit: "scale-down",
      userDrag: "none",
    },
    "&[data-selected='0']": {
      fontSize: 15,
      opacity: 1,
      letterSpacing: "-.5px",
      "& img": {
        height: 22,
        filter: "grayscale(0%)",
      },
    },
    "&[data-selected='1']": {
      fontSize: 12,
      opacity: 0.8,
      "&& > img": {
        height: 20,
        filter: "grayscale(80%)",
      },
    },
    "&[data-selected='2']": {
      fontSize: 8,
      opacity: 0.6,
      "&& > img": {
        height: 18,
        filter: "grayscale(90%)",
      },
    },
    "&[data-selected='3']": {
      fontSize: 6,
      opacity: 0.4,
      "& > img": {
        height: 16,
        filter: "grayscale(100%)",
      },
    },
  },
}));
