import _ from "lodash";
import React, { useState } from "react";

import { useAppDispatch } from "gModules/hooks";
import { create } from "gModules/organizations/actions";

type Plan = "FREE" | "PREMIUM";

export const PlanElement: React.FC<{
  onClick(): void;
  isSelected: boolean;
  children: React.ReactNode;
}> = ({ onClick, isSelected, children }) => (
  <div className={`PlanElement ${isSelected && "selected"}`} onClick={onClick}>
    <div className="radio-section">
      <input type="radio" checked={isSelected} readOnly={true} />
    </div>
    <div className="content-section">{children}</div>
  </div>
);

export const PlanList: React.FC<{
  onSelect(plan: Plan): void;
  plan: Plan;
}> = ({ onSelect, plan }) => (
  <div className="PlanList">
    <PlanElement
      onClick={() => {
        onSelect("FREE");
      }}
      isSelected={plan === "FREE"}
    >
      Unlimited members and public models for free.
    </PlanElement>
    <PlanElement
      onClick={() => {
        onSelect("PREMIUM");
      }}
      isSelected={plan === "PREMIUM"}
    >
      Unlimited private models. $12/month per user.
      <div className="free-trial">
        Free 30-day trial, no credit card needed.
      </div>
    </PlanElement>
  </div>
);

export const CreateOrganizationForm: React.FC = () => {
  const [hasClicked, setHasClicked] = useState(false);
  const [plan, setPlan] = useState<Plan>("PREMIUM");
  const [value, setValue] = useState("");
  const dispatch = useAppDispatch();

  const _onSubmit = () => {
    if (hasClicked) {
      return;
    }
    const newOrganization = {
      name: value,
      plan: plan === "PREMIUM" ? 6 : 5,
    };
    dispatch(create(newOrganization));
    setHasClicked(true);
  };

  const canSubmit = _.isEmpty(value) && !hasClicked;
  return (
    <div className="row">
      <div className="col-sm-7">
        <div className="ui form">
          <div className="field name">
            <label>Organization Name</label>
            <input
              placeholder={"name"}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </div>

          <div className="field plan">
            <label>Plan</label>
            <PlanList
              plan={plan}
              onSelect={(plan) => {
                setPlan(plan);
              }}
            />
          </div>
          <div
            className={`ui button submit ${canSubmit ? "disabled" : "green"}`}
            onClick={_onSubmit}
          >
            Create Organization
          </div>
        </div>
      </div>

      <div className="col-sm-1" />
      <div className="col-sm-4">
        <div className="ui message">
          <h3> Organizations </h3>
          <p>Share & collaborate on models with a group you trust.</p>
        </div>
      </div>
    </div>
  );
};
