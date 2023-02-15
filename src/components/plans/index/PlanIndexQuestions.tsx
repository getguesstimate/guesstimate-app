import React from "react";

const questions = [
  {
    header: "What is a model?",
    body: (
      <p>
        A model is a single spreadsheet made. One example is{" "}
        <a href="/scratchpad">here</a>.
      </p>
    ),
  },
  {
    header: "Who can access a private models?",
    body: (
      <p>
        Individual private models can only be accessed by that individual.
        Organizational private models can be seen and edited by all members of
        that organization.
      </p>
    ),
  },
  {
    header: "What payment methods do you accept?",
    body: (
      <p>We accept all Visa, American Express, and Mastercard credit cards.</p>
    ),
  },
  {
    header: "Is there a minimum contract time?",
    body: (
      <p>All plans are monthly and can be canceled or changed at any time.</p>
    ),
  },
  {
    header: "What happens after I unsubscribe?",
    body: (
      <p>
        Your private models will be disabled until you begin a plan again. This
        means they will not be viewable or editable.
      </p>
    ),
  },
  {
    header: "Do you offer educational or nonprofit discounts?",
    body: (
      <p>
        Yes. Please <a href="mailto:ozzie@getguesstimate.com">contact us</a> for
        more information.
      </p>
    ),
  },
];

export const PlanIndexQuestions: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-x-20 gap-y-16">
      {questions.map((q) => (
        <div className="text-grey-main" key={q.header}>
          <h3 className="text-xl">{q.header}</h3>
          <div>{q.body}</div>
        </div>
      ))}
    </div>
  );
};
