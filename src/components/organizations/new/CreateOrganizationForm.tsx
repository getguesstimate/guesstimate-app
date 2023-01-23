import clsx from "clsx";
import _ from "lodash";
import React, { useState } from "react";

import { useAppDispatch } from "~/modules/hooks";
import { create } from "~/modules/organizations/actions";
import { Message } from "./Message";

type Plan = "FREE" | "PREMIUM";

export const PlanElement: React.FC<{
  onClick(): void;
  isSelected: boolean;
  children: React.ReactNode;
}> = ({ onClick, isSelected, children }) => (
  <div
    className={clsx(
      "flex items-start px-6 py-6 gap-6 first:rounded-t last:rounded-b",
      isSelected ? "bg-white" : "bg-grey-eee"
    )}
    onClick={onClick}
  >
    <input
      type="radio"
      className="block mt-[3px]"
      checked={isSelected}
      readOnly={true}
    />
    <div className="text-sm">{children}</div>
  </div>
);

export const PlanList: React.FC<{
  onSelect(plan: Plan): void;
  plan: Plan;
}> = ({ onSelect, plan }) => (
  <div className="border border-grey-ccc rounded flex flex-col">
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
      <div className="text-[#1bb732] font-bold mt-1">
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

  const handleSubmit = () => {
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
    <div className="grid grid-cols-12">
      <div className="col-span-7">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-bold">Organization Name</label>
            <input
              placeholder="name"
              // based on styles from semantic-ui
              className="border border-grey-333/20 outline-none focus:border-[#85b7d9] transition rounded p-2"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold">Plan</label>
            <PlanList
              plan={plan}
              onSelect={(plan) => {
                setPlan(plan);
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <div
            className={clsx(
              "ui button submit",
              canSubmit ? "disabled" : "green"
            )}
            onClick={handleSubmit}
          >
            Create Organization
          </div>
        </div>
      </div>

      <div className="col-span-4 col-start-9">
        <Message title="Organizations">
          <p>Share & collaborate on models with a group you trust.</p>
        </Message>
      </div>
    </div>
  );
};
