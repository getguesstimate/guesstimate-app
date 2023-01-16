import React from "react";

const Cost: React.FC<{ cost: string; unit: string }> = ({ cost, unit }) => (
  <div className="PlanCard-Cost">
    <div>
      <sup>$</sup>
      <span className="number">{cost}</span>
    </div>
    {unit === "per_user" && (
      <div className="per-month">
        per user
        <br />
        per month
      </div>
    )}
    {unit !== "per_user" && <div className="per-month">per month</div>}
  </div>
);

// const Limit = ({ limit }) => (
//   <div className="PlanCard-Limit">
//     <span className="number"> {limit} </span>
//     <span> private models </span>
//   </div>
// );

type PlanCardProps = {
  name: string;
  promotion_copy?: string;
  price: string;
  unit: string;
  private_model_count: string;
  upgrade: {
    show: boolean;
    onClick: () => void;
    text: string;
  };
};

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  promotion_copy,
  price,
  unit,
  private_model_count,
  upgrade,
}) => {
  return (
    <div className="PlanCard">
      <h2> {name} </h2>
      <Cost cost={price} unit={unit} />
      <ul>
        <li>
          {" "}
          <strong>{private_model_count}</strong> private models{" "}
        </li>
      </ul>
      {promotion_copy && <div className="promotion">{promotion_copy}</div>}
      {upgrade.show && (
        <a className="ui button large green" onMouseDown={upgrade.onClick}>
          {" "}
          {upgrade.text}{" "}
        </a>
      )}
    </div>
  );
};

type Props = {
  showPersonalUpgradeButton: boolean;
  onChoose: (planId: string) => void;
  isLoggedIn: boolean;
  onNewOrganizationNavigation: () => void;
};

export const Plans: React.FC<Props> = ({
  showPersonalUpgradeButton,
  onChoose,
  isLoggedIn,
  onNewOrganizationNavigation,
}) => {
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="Plans--outer">
          <div className="Plans">
            <PlanCard
              name="Individuals"
              price="5"
              unit="per_month"
              private_model_count="20"
              upgrade={{
                show: showPersonalUpgradeButton,
                onClick: () => {
                  onChoose("personal_lite");
                },
                text: "Upgrade",
              }}
            />
            <PlanCard
              name="Organizations"
              price="12"
              unit="per_user"
              private_model_count="200"
              promotion_copy="30-day free trial"
              upgrade={{
                show: isLoggedIn,
                onClick: () => {
                  onNewOrganizationNavigation();
                },
                text: "Begin Free Trial",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
