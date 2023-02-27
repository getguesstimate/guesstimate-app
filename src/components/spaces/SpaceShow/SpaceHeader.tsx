import React from "react";

import { DropDown } from "~/components/utility/DropDown";
import { PrivacyToggle } from "./PrivacyToggle";
import { SpaceName } from "./SpaceName";

import { UserTag } from "~/components/UserTag";
import * as e from "~/lib/engine/engine";
import * as spaceActions from "~/modules/spaces/actions";

import { Button } from "~/components/utility/buttons/button";
import { DSpace, getOwner } from "~/lib/engine/space";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { SpaceHeaderButton } from "./SpaceHeaderButton";

const EnableShareableLinkOption: React.FC<{ onEnable(): void }> = ({
  onEnable,
}) => (
  <div>
    <p>Shareable link disabled.</p>
    <Button onClick={onEnable}>Enable</Button>
  </div>
);

const DisableOrRotateShareableLinkOption: React.FC<{
  shareableLinkUrl: string;
  onDisable(): void;
  onRotate(): void;
}> = ({ shareableLinkUrl, onDisable, onRotate }) => (
  <div className="space-y-4">
    <div className="overflow-scroll rounded border border-grey-ccc p-4 shadow-sm">
      {shareableLinkUrl}
    </div>
    <p className="text-sm">
      Anyone with the shareable link will be able to view this model. They will
      not be able to edit the model.
    </p>

    <div className="flex gap-1">
      <Button onClick={onDisable}>Disable</Button>
      <Button onClick={onRotate}>Reset Link</Button>
    </div>
  </div>
);

const ShareableLinkOption: React.FC<{
  shareableLinkUrl?: string;
  onEnable(): void;
  onDisable(): void;
  onRotate(): void;
}> = ({ shareableLinkUrl, onEnable, onDisable, onRotate }) => {
  return (
    <DropDown
      headerText="Shareable Link"
      openLink={<SpaceHeaderButton iconName="link" text="Link" />}
      position="left"
      width="wide"
    >
      <div className="p-4 text-grey-666">
        {shareableLinkUrl ? (
          <DisableOrRotateShareableLinkOption
            shareableLinkUrl={shareableLinkUrl}
            onDisable={onDisable}
            onRotate={onRotate}
          />
        ) : (
          <EnableShareableLinkOption onEnable={onEnable} />
        )}
      </div>
    </DropDown>
  );
};

type Props = {
  space: DSpace;
};

export const SpaceHeader = React.memo<Props>(function SpaceHeader({ space }) {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.me);

  const name = space.name || "";
  const shareableLinkUrl = e.space.urlWithToken(space);
  const isPrivate = space.is_private || false; // TODO - make isPrivate always set on spaces
  const editableByMe = space.editableByMe;
  const editors = space.users;
  const owner = getOwner(space);

  const ownerIsOrg = space.organization?.name;
  const ownerName = owner.name;
  const ownerPicture = owner.picture;
  const ownerUrl = ownerIsOrg
    ? e.organization.url(space.organization)
    : e.user.url(space.user);

  const canBePrivate = ownerIsOrg
    ? e.organization.canMakeMorePrivateModels(space.organization)
    : e.me.canMakeMorePrivateModels(me);

  const onEnableShareableLink = () => {
    dispatch(spaceActions.enableShareableLink(space.id));
  };
  const onDisableShareableLink = () => {
    dispatch(spaceActions.disableShareableLink(space.id));
  };
  const onRotateShareableLink = () => {
    dispatch(spaceActions.rotateShareableLink(space.id));
  };

  const onPublicSelect = () => {
    dispatch(spaceActions.generalUpdate(space.id, { is_private: false }));
  };
  const onPrivateSelect = () => {
    dispatch(spaceActions.generalUpdate(space.id, { is_private: true }));
  };

  const onSaveName = (name: string) => {
    dispatch(spaceActions.update(space.id, { name }));
  };

  return (
    <div className="flex justify-between px-8 py-2">
      <SpaceName name={name} editableByMe={editableByMe} onSave={onSaveName} />

      <div className="flex flex-wrap items-center justify-end gap-2 md:flex-shrink-0 md:flex-nowrap">
        {editableByMe && (
          <PrivacyToggle
            editableByMe={editableByMe}
            isPrivateSelectionInvalid={!canBePrivate}
            isPrivate={isPrivate}
            onPublicSelect={onPublicSelect}
            onPrivateSelect={onPrivateSelect}
          />
        )}
        {isPrivate && editableByMe && (
          <ShareableLinkOption
            shareableLinkUrl={shareableLinkUrl}
            onEnable={onEnableShareableLink}
            onDisable={onDisableShareableLink}
            onRotate={onRotateShareableLink}
          />
        )}
        {(ownerIsOrg || !editableByMe) && (
          <UserTag
            url={ownerUrl}
            picture={ownerPicture}
            name={ownerName}
            bg="WHITE"
          />
        )}
        {ownerIsOrg &&
          editors.map((editor, i) => (
            <a href={e.user.url(editor)} key={i}>
              <img src={editor.picture} className="h-8 w-8 rounded-full" />
            </a>
          ))}
      </div>
    </div>
  );
});
