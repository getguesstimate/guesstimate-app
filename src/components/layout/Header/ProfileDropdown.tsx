import { FC } from "react";
import { AccountMenu } from "~/components/workspace/AccountMenu";
import { MeProfile } from "~/modules/me/slice";

export const ProfileDropdown: FC<{ profile: MeProfile }> = () => (
  <AccountMenu callbackUrl="/models" />
);
