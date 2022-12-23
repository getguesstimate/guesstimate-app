import _ from "lodash";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { NewSpaceCard, SpaceCard } from "gComponents/spaces/cards";
import Container from "gComponents/utility/container/Container";

import { userSpaceSelector } from "./userSpaceSelector";

import { useAppDispatch, useAppSelector } from "gModules/hooks";
import * as spaceActions from "gModules/spaces/actions";
import * as userActions from "gModules/users/actions";

type Props = {
  userId: string;
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
    dispatch(spaceActions.fetch({ userId, organizationId: undefined }));
  }, [dispatch, userId]);

  const _newModel = () => {
    dispatch(spaceActions.create(undefined, {}, router));
  };

  const spaces = _.orderBy(userSpaces.asMutable(), ["updated_at"], ["desc"]);
  const isMe = parseInt(me.id || "") === parseInt(userId);

  let user = null;

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
                <img src={(user as any).picture} />
                {user && <h1>{(user as any).name}</h1>}
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
