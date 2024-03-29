import { FC, PropsWithChildren } from "react";

import {
  CardHeader,
  CardListElement,
  CardListElementProps,
} from "~/components/utility/Card";
import { DropDown } from "~/components/utility/DropDown";
import { HR } from "~/components/utility/HR";
import * as canvasStateActions from "~/modules/canvas_state/actions";
import { EdgeViewMode } from "~/modules/canvas_state/reducer";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";

import { ToolbarTextItem } from "./ToolbarTextItem";

const arrowsHiddenImage = "/assets/metric-icons/blue/arrows-hidden.png";
const arrowsVisibleImage = "/assets/metric-icons/blue/arrows-visible.png";
const debuggingImage = "/assets/metric-icons/blue/debugging.png";
const scientificImage = "/assets/metric-icons/blue/scientific.png";

const Section: FC<PropsWithChildren<{ headerText: string }>> = ({
  headerText,
  children,
}) => (
  <div className="my-4">
    <div className="py-2 pl-4">
      <CardHeader>{headerText}</CardHeader>
    </div>
    {children}
  </div>
);

export const CanvasViewForm: FC = () => {
  const dispatch = useAppDispatch();
  const canvasState = useAppSelector((state) => state.canvasState);

  const selectMetricCardView = (e: string) => {
    dispatch(canvasStateActions.toggleView(e));
  };

  const selectEdgeView = (e: EdgeViewMode) => {
    dispatch(canvasStateActions.change({ edgeView: e }));
  };

  type Option<T extends string> = {
    name: T;
    image: CardListElementProps["image"];
    isSelected?: CardListElementProps["isSelected"];
    onClick?: CardListElementProps["onClick"];
  };

  let metricCardViewOptions: (Option<string> & { key: string })[] = [
    {
      name: "scientific",
      image: scientificImage,
      key: "scientificViewEnabled",
    },
    { name: "expanded", image: debuggingImage, key: "expandedViewEnabled" },
  ];

  let arrowViewOptions: Option<EdgeViewMode>[] = [
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
      openLink={<ToolbarTextItem text="View" />}
      position="right"
    >
      <Section headerText="Metric Style">
        <ul>
          {metricCardViewOptions.map((o) => (
            <CardListElement
              key={o.name}
              header={o.name}
              isSelected={o.isSelected}
              onClick={o.onClick!}
              image={o.image}
            />
          ))}
        </ul>
      </Section>
      <HR />
      <Section headerText="Arrows">
        <ul>
          {arrowViewOptions.map((o) => (
            <CardListElement
              key={o.name}
              header={o.name}
              isSelected={o.isSelected}
              onClick={o.onClick!}
              image={o.image}
            />
          ))}
        </ul>
      </Section>
    </DropDown>
  );
};
