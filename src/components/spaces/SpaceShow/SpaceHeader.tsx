import React, { Component } from "react";

import Icon from "~/components/react-fa-patched";
import { CardListSection } from "~/components/utility/Card";

import { DropDown } from "~/components/utility/DropDown";
import { PrivacyToggle } from "./PrivacyToggle";
import { SpaceName } from "./SpaceName";

import * as e from "~/lib/engine/engine";
import { UserTag } from "~/components/UserTag";
import { SpaceHeaderButton } from "./SpaceHeaderButton";

const EnableShareableLinkOption: React.FC<{ onEnable(): void }> = ({
  onEnable,
}) => (
  <div>
    <p>Shareable link disabled.</p>
    <span className="ui button small enable" onClick={onEnable}>
      Enable
    </span>
  </div>
);

const DisableOrRotateShareableLinkOption: React.FC<{
  shareableLinkUrl: string;
  onDisable(): void;
  onRotate(): void;
}> = ({ shareableLinkUrl, onDisable, onRotate }) => (
  <div className="space-y-4">
    <div className="border border-grey-ccc shadow-sm p-4 rounded overflow-scroll">
      {shareableLinkUrl}
    </div>
    <p className="text-sm">
      Anyone with the shareable link will be able to view this model. They will
      not be able to edit the model.
    </p>

    <div className="flex gap-1">
      <div className="ui button small disable" onClick={onDisable}>
        Disable
      </div>
      <div className="ui button small rotate" onClick={onRotate}>
        Reset Link
      </div>
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
      <CardListSection>
        {shareableLinkUrl ? (
          <DisableOrRotateShareableLinkOption
            shareableLinkUrl={shareableLinkUrl}
            onDisable={onDisable}
            onRotate={onRotate}
          />
        ) : (
          <EnableShareableLinkOption onEnable={onEnable} />
        )}
      </CardListSection>
    </DropDown>
  );
};

type Props = {
  name: string;
  isPrivate?: boolean;
  editableByMe: boolean;
  canBePrivate: boolean;
  shareableLinkUrl: string;
  ownerName: string;
  ownerPicture?: string;
  ownerUrl: string;
  ownerIsOrg: boolean;
  editors: any[];
  onSaveName(name: string): void;
  onPublicSelect(): void;
  onPrivateSelect(): void;
  onEnableShareableLink(): void;
  onDisableShareableLink(): void;
  onRotateShareableLink(): void;
};

export const SpaceHeader = React.memo<Props>(function SpaceHeader({
  canBePrivate,
  name,
  ownerName,
  ownerPicture,
  ownerUrl,
  ownerIsOrg,
  isPrivate,
  editableByMe,
  editors,
  shareableLinkUrl,
  onSaveName,
  onPublicSelect,
  onPrivateSelect,
  onEnableShareableLink,
  onDisableShareableLink,
  onRotateShareableLink,
}) {
  return (
    <div className="flex justify-between px-8 py-2">
      <SpaceName name={name} editableByMe={editableByMe} onSave={onSaveName} />

      <div className="flex justify-end items-center flex-wrap md:flex-nowrap space-x-2">
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
