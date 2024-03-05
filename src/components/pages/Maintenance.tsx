import { FC } from "react";

import { Message } from "../utility/Message";

export const Maintenance: FC = () => {
  return (
    <div className="mt-16 flex flex-col items-center">
      <Message title="Maintenance Mode">
        Guesstimate has gone down for maintenance. We'll be back in 10 to 30
        minutes with 90% confidence.
      </Message>
    </div>
  );
};
