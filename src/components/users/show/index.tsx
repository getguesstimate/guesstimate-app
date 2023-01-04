import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { NewSpaceCard, SpaceCard } from "~/components/spaces/cards";
import Container from "~/components/utility/container/Container";

import { userSpaceSelector } from "./userSpaceSelector";

import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as spaceActions from "~/modules/spaces/actions";
import * as userActions from "~/modules/users/actions";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";

type Props = {
  userId: number;
};

const UserShow: React.FC<Props> = ({ userId }) => {
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

  const _newModel = () => {
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
      <div className="UserShow">
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-4 col-xs-12">
            {user && (
              <div className="main-user-tag">
                <img src={user.picture} />
                {user && <h1>{user.name}</h1>}
              </div>
            )}
          </div>
        </div>
        {spaces && (
          <div className="row">
            {isMe && <NewSpaceCard onClick={_newModel} />}
            {_.map(spaces, (s) => (
              <SpaceCard key={s.id} space={s} showPrivacy={isMe} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default UserShow;
