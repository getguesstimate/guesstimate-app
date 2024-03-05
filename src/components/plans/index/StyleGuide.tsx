import React from "react";

import { ComponentEditor } from "~/components/style_guide/ComponentEditor";
import { PlanIndex, Props } from "./PlanIndex";

const options: {
  context: string;
  props: Omit<Props, "onChoose" | "onNewOrganizationNavigation">;
}[] = [
  {
    context: "a logged out user",
    props: {
      userPlanId: "",
      portalUrl: "",
      isLoggedIn: false,
    },
  },
  {
    context: "a new user",
    props: {
      userPlanId: "personal_free",
      portalUrl: "",
      isLoggedIn: true,
    },
  },
  {
    context: "an infinite user",
    props: {
      userPlanId: "personal_infinite",
      portalUrl: "",
      isLoggedIn: true,
    },
  },
  {
    context: "a user with payment account",
    props: {
      userPlanId: "personal_small",
      portalUrl: "http://google.com",
      isLoggedIn: true,
    },
  },
];

export const PlanStyleGuide: React.FC = () => {
  const fakeCallbacks = {
    onChoose() {},
    onNewOrganizationNavigation() {},
  };
  return (
    <div>
      {options.map((option) => {
        return (
          <ComponentEditor
            child={PlanIndex}
            childProps={{ ...option.props, ...fakeCallbacks }}
            name="PlanIndex"
            context={option.context}
            key={option.context}
            backgroundColor="grey"
          />
        );
      })}
    </div>
  );
};
