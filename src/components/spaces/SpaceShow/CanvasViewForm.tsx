import {
  CardListElement,
  CardListElementProps,
} from "~/components/utility/card/index";
import { DropDown } from "~/components/utility/DropDown";

import * as canvasStateActions from "~/modules/canvas_state/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";

const arrowsHiddenImage = "/assets/metric-icons/blue/arrows-hidden.png";
const arrowsVisibleImage = "/assets/metric-icons/blue/arrows-visible.png";
const debuggingImage = "/assets/metric-icons/blue/debugging.png";
const scientificImage = "/assets/metric-icons/blue/scientific.png";

export const CanvasViewForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const canvasState = useAppSelector((state) => state.canvasState);

  const selectMetricCardView = (e: string) => {
    dispatch(canvasStateActions.toggleView(e));
  };

  const selectEdgeView = (e: string) => {
    dispatch(canvasStateActions.change({ edgeView: e }));
  };

  type Option = {
    name: CardListElementProps["header"];
    image: CardListElementProps["image"];
    isSelected?: CardListElementProps["isSelected"];
    onClick?: CardListElementProps["onMouseDown"];
  };

  let metricCardViewOptions: (Option & { key: string })[] = [
    {
      name: "scientific",
      image: scientificImage,
      key: "scientificViewEnabled",
    },
    { name: "expanded", image: debuggingImage, key: "expandedViewEnabled" },
  ];

  let arrowViewOptions: Option[] = [
    { name: "hidden", image: arrowsHiddenImage },
    { name: "visible", image: arrowsVisibleImage },
  ];

  metricCardViewOptions = metricCardViewOptions.map((e) => {
    const isSelected = !!canvasState[e.key];
    return {
      ...e,
      isSelected,
      onClick: () => {
        selectMetricCardView(e.name);
      },
    };
  });

  arrowViewOptions = arrowViewOptions.map((e) => {
    const isSelected = e.name === canvasState.edgeView;
    return {
      ...e,
      isSelected,
      onClick: () => {
        selectEdgeView(e.name);
      },
    };
  });

  return (
    <DropDown
      headerText="View Options"
      openLink={<a className="header-action">View</a>}
      position="right"
    >
      <div className="section">
        <div
          className="header-divider"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h3>Metric Style</h3>
        </div>
        <ul>
          {metricCardViewOptions.map((o) => {
            return (
              <CardListElement
                key={o.name}
                header={o.name}
                isSelected={o.isSelected}
                onMouseDown={o.onClick!}
                image={o.image}
              />
            );
          })}
        </ul>
      </div>
      <hr />

      <div className="section">
        <div
          className="header-divider"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h3>Arrows</h3>
        </div>
        <ul>
          {arrowViewOptions.map((o) => {
            return (
              <CardListElement
                key={o.name}
                header={o.name}
                isSelected={o.isSelected}
                onMouseDown={o.onClick!}
                image={o.image}
              />
            );
          })}
        </ul>
      </div>
    </DropDown>
  );
};

export default CanvasViewForm;
