import clsx from "clsx";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/components/utility/buttons/button";
import { Input } from "~/components/utility/forms";
import { Labeled } from "~/components/utility/Labeled";
import { Message } from "~/components/utility/Message";

import { useAppDispatch } from "~/modules/hooks";
import { create } from "~/modules/organizations/actions";

type Plan = "FREE" | "PREMIUM";

export const PlanElement: React.FC<{
  onClick(): void;
  isSelected: boolean;
  children: React.ReactNode;
}> = ({ onClick, isSelected, children }) => (
  <div
    className={clsx(
      "flex cursor-pointer items-start gap-6 px-6 py-6 first:rounded-t last:rounded-b",
      isSelected ? "bg-white" : "bg-grey-eee"
    )}
    onClick={onClick}
  >
    <input
      type="radio"
      className="mt-[3px] block"
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
  <div className="flex flex-col rounded border border-grey-ccc">
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
      <div className="mt-1 font-bold text-[#1bb732]">
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef.current]);

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

  const canSubmit = !_.isEmpty(value) && !hasClicked;
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-7">
        <div className="flex flex-col gap-8">
          <Labeled label="Organization Name">
            <Input
              placeholder="name"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              theme="large"
              ref={inputRef}
            />
          </Labeled>

          <Labeled label="Plan">
            <PlanList
              plan={plan}
              onSelect={(plan) => {
                setPlan(plan);
              }}
            />
          </Labeled>
        </div>

        <div className="mt-8">
          <Button
            color="green"
            size="large"
            disabled={!canSubmit}
            loading={hasClicked}
            onClick={handleSubmit}
          >
            Create Organization
          </Button>
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
