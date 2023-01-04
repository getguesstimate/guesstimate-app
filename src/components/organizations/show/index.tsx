import _ from "lodash";
import { useRouter } from "next/router";
import React, { Component, useEffect, useState } from "react";

import Icon from "gComponents/react-fa-patched";

import { NewSpaceCard, SpaceCard } from "gComponents/spaces/cards";
import Container from "gComponents/utility/container/Container";
import { Category } from "./categories/category";
import { CategoryForm } from "./categories/form";
import { FactGraph } from "./facts/factGraph";
import { MembersTab } from "./members";

import { organizationMemberSelector } from "./organizationMemberSelector";
import { organizationSpaceSelector } from "./organizationSpaceSelector";

import * as modalActions from "gModules/modal/actions";
import * as organizationActions from "gModules/organizations/actions";
import * as spaceActions from "gModules/spaces/actions";
import * as userOrganizationMembershipActions from "gModules/userOrganizationMemberships/actions";

import * as e from "gEngine/engine";
import { FactCategory } from "gEngine/fact_category";
import { useAppDispatch, useAppSelector } from "gModules/hooks";

const MODEL_TAB = "models";
const MEMBERS_TAB = "members";
const FACT_BOOK_TAB = "facts";
const FACT_GRAPH_TAB = "fact-graph";

type Tab = {
  name: string;
  key: string;
  href?: string;
  onMouseUp?(): void;
};

const isValidTabString = (tabStr: string | null): tabStr is string => {
  return Boolean(
    tabStr &&
      [MODEL_TAB, MEMBERS_TAB, FACT_BOOK_TAB, FACT_GRAPH_TAB].includes(tabStr)
  );
};

const OrganizationHeader: React.FC<{ organization: any }> = ({
  organization,
}) => (
  <div className="row OrganizationHeader">
    <div className="col-md-4" />
    <div className="col-md-4 col-xs-12">
      <div className="col-sm-12">
        <div className="center-display">
          <img src={organization.picture} />
          <h1> {organization.name} </h1>
        </div>
      </div>
    </div>
  </div>
);

const OrganizationTabButtons: React.FC<{
  tabs: Tab[];
  openTab: string;
  changeTab(key: string): void;
}> = ({ tabs, openTab, changeTab }) => (
  <div className="row OrganizationTabButtons">
    <div className="col-xs-12">
      <div className="ui secondary menu">
        {tabs.map((e) => {
          const className = `item ${openTab === e.key ? "active" : ""}`;
          if (!!e.href) {
            return (
              <a
                className="item"
                key={e.key}
                href={e.href}
                target="_blank"
                onMouseUp={e.onMouseUp ? e.onMouseUp : () => {}}
              >
                {e.name}
              </a>
            );
          } else {
            return (
              <a
                className={className}
                key={e.key}
                onClick={() => {
                  changeTab(e.key);
                }}
              >
                {" "}
                {e.name}{" "}
              </a>
            );
          }
        })}
      </div>
    </div>
  </div>
);

const FactTab = ({
  organization,
  facts,
  factCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const categorySets = [
    ..._.map(factCategories, (c) => ({
      category: c,
      facts: e.collections.filter(facts, c.id, "category_id"),
    })),
    {
      category: null,
      facts: _.filter(facts, (f) => !f.category_id),
    },
  ];
  const existingVariableNames = facts.map(e.facts.getVar);
  const existingCategoryNames = _.map(factCategories, (c) => c.name);

  return (
    <div className="FactTab">
      <div className="row">
        {categorySets.map(({ category, facts }) => (
          <div
            className="col-md-6 Category"
            key={!!category ? category.name : "uncategorized"}
          >
            <Category
              category={category}
              categories={factCategories}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              facts={facts}
              existingVariableNames={existingVariableNames}
              organization={organization}
            />
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-6">
          <NewCategorySection
            onSubmit={onAddCategory}
            existingCategoryNames={existingCategoryNames}
          />
        </div>
      </div>
    </div>
  );
};

class NewCategorySection extends Component<{
  onSubmit(category: FactCategory): void;
  existingCategoryNames: string[];
}> {
  state = {
    showForm: false,
  };

  onSubmit(name) {
    this.setState({ showForm: false });
    this.props.onSubmit(name);
  }

  render() {
    if (this.state.showForm) {
      return (
        <CategoryForm
          onSubmit={this.onSubmit.bind(this)}
          existingCategoryNames={this.props.existingCategoryNames}
        />
      );
    } else {
      return (
        <div
          className="ui button green"
          onClick={() => this.setState({ showForm: true })}
        >
          <Icon name="plus" /> New Category
        </div>
      );
    }
  }
}

const OrganizationShow: React.FC<{
  organizationId: string;
  tab: null | string;
}> = ({ organizationId, tab }) => {
  const [openTab, setOpenTab] = useState(
    isValidTabString(tab) ? tab : MODEL_TAB
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const refreshData = () => {
    dispatch(organizationActions.fetchById(organizationId));
    dispatch(spaceActions.fetch({ organizationId }));
  };

  useEffect(refreshData, []);

  const me = useAppSelector((state) => state.me);
  const organizations = useAppSelector((state) => state.organizations);
  const organizationFacts = useAppSelector(
    (state) => state.facts.organizationFacts
  );
  const globalFactCategories = useAppSelector((state) => state.factCategories);
  const { organizationSpaces } = useAppSelector((state) =>
    organizationSpaceSelector(state, organizationId)
  );
  const { members, memberships, invitations } = useAppSelector((state) =>
    organizationMemberSelector(state, organizationId)
  );

  const organization = e.collections.get(organizations, organizationId);

  const changeTab = (openTab: string) => {
    router.push(`${e.organization.url(organization)}/${openTab}`, undefined, {
      shallow: true,
    });
    setOpenTab(openTab);
  };

  const _newModel = () => {
    dispatch(spaceActions.create(organizationId, {}, router));
  };

  const destroyMembership = (membershipId: string) => {
    dispatch(userOrganizationMembershipActions.destroy(membershipId));
  };

  const onAddCategory = (newCategory) => {
    dispatch(organizationActions.addFactCategory(organization, newCategory));
  };
  const onEditCategory = (editedCategory) => {
    dispatch(
      organizationActions.editFactCategory(organization, editedCategory)
    );
  };

  const onDeleteCategory = (category) => {
    dispatch(organizationActions.deleteFactCategory(organization, category));
  };

  const onRemove = (member) => {
    confirmRemove(member);
  };

  const confirmRemove = ({ email, name, membershipId }) => {
    const removeCallback = () => {
      destroyMembership(membershipId);
      dispatch(modalActions.close());
    };

    const message = `Are you sure you want to remove ${name} from this organization?`;

    dispatch(
      modalActions.openConfirmation({ onConfirm: removeCallback, message })
    );
  };

  const factCategories = e.collections.filter(
    globalFactCategories,
    organizationId,
    "organization_id"
  );
  const spaces = _.orderBy(organizationSpaces, ["updated_at"], ["desc"]);
  const hasPrivateAccess = e.organization.hasPrivateAccess(organization);
  const facts = e.organization.findFacts(organizationId, organizationFacts);
  const meIsAdmin = !!organization && organization.admin_id === me.id;
  const meIsMember = meIsAdmin || !!members.find((m) => m.id === me.id);

  if (!organization) {
    return null;
  }
  let tabs: Tab[] = [
    { name: "Models", key: MODEL_TAB },
    { name: "Members", key: MEMBERS_TAB },
  ];
  if (hasPrivateAccess) {
    tabs = [
      { name: "Models", key: MODEL_TAB },
      { name: "Metric Library", key: FACT_BOOK_TAB },
      { name: "Metric Graph", key: FACT_GRAPH_TAB },
      { name: "Members", key: MEMBERS_TAB },
    ];
  }
  const portalUrl = _.get(organization, "account._links.payment_portal.href");
  if (!!portalUrl) {
    tabs = [
      ...tabs,
      {
        name: "Billing",
        key: "BILLING",
        href: portalUrl,
        onMouseUp: refreshData,
      },
    ];
  }

  return (
    <Container>
      <div className="OrganizationShow">
        <OrganizationHeader organization={organization} />

        {meIsMember && (
          <OrganizationTabButtons
            tabs={tabs}
            openTab={openTab}
            changeTab={changeTab}
          />
        )}

        <div className="main-section">
          {(openTab === MODEL_TAB || !meIsMember) && spaces && (
            <div className="row">
              {meIsMember && <NewSpaceCard onClick={_newModel} />}
              {_.map(spaces, (s) => (
                <SpaceCard key={s.id} space={s} showPrivacy={true} />
              ))}
            </div>
          )}

          {openTab === MEMBERS_TAB && meIsMember && members && organization && (
            <MembersTab
              organizationId={organizationId}
              startOnIndexTab={true}
              members={members}
              memberships={memberships}
              invitations={invitations}
              admin_id={organization.admin_id}
              onRemove={onRemove}
              // httpRequests={httpRequests}
              meIsAdmin={meIsAdmin}
            />
          )}

          {openTab === FACT_BOOK_TAB && meIsMember && !!facts && (
            <FactTab
              organization={organization}
              facts={facts}
              factCategories={factCategories}
              onAddCategory={onAddCategory}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {openTab === FACT_GRAPH_TAB && meIsMember && !!facts && (
            <FactGraph
              organization={organization}
              facts={facts}
              spaces={spaces}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default OrganizationShow;
