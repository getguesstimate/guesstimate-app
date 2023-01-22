import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import {
  NewSpaceCard,
  SpaceCard,
  SpaceCardGrid,
} from "~/components/spaces/SpaceCards";
import { Container } from "~/components/utility/Container";

import { userSpaceSelector } from "./userSpaceSelector";

import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as spaceActions from "~/modules/spaces/actions";
import * as userActions from "~/modules/users/actions";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";

type Props = {
  userId: number;
};

export const UserShow: React.FC<Props> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const me = useAppSelector((state) => state.me);
  const userSpaces = useAppSelector((state) =>
    userSpaceSelector(state, userId)
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(userActions.fetchById(userId));
    dispatch(spaceActions.fetch({ userId }));
  }, [dispatch, userId]);

  const newModel = () => {
    dispatch(spaceActions.create(undefined, router));
  };

  const spaces = _.orderBy(userSpaces, ["updated_at"], ["desc"]);
  const isMe = me.id === userId;

  let user: ApiUser | undefined;

  if (users && users.length) {
    user = users.find((u) => u.id.toString() === userId.toString());
  }

  return (
    <Container>
      {user && (
        <div className="flex flex-col items-center mb-8">
          <img className="w-32 h-32 rounded-full" src={user.picture} />
          <h1 className="mt-3">{user.name}</h1>
        </div>
      )}
      {spaces && (
        <SpaceCardGrid>
          {isMe && <NewSpaceCard onClick={newModel} />}
          {spaces.map((s) => (
            <SpaceCard key={s.id} space={s} showPrivacy={isMe} />
          ))}
        </SpaceCardGrid>
      )}
    </Container>
  );
};
