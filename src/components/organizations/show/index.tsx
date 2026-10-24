import { FC, useEffect, useState } from "react";

import _ from "lodash";
import Icon from "~/components/react-fa-patched";
import { AccountShell } from "~/components/account/AccountShell";
import {
  CollectionAvatar,
  ModelCollection,
} from "~/components/collections/ModelCollection";
import { loadOrganizationCollection } from "~/components/collections/actions";
import styles from "../../collections/collections.module.css";
import account from "../../account/account.module.css";
import { ButtonWithIcon } from "~/components/utility/buttons/button";
import * as e from "~/lib/engine/engine";
import { FactCategory } from "~/lib/engine/fact_category";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as modalActions from "~/modules/modal/actions";
import * as organizationActions from "~/modules/organizations/actions";
import * as userOrganizationMembershipActions from "~/modules/userOrganizationMemberships/actions";

import { Category } from "./categories/Category";
import { CategoryForm } from "./categories/CategoryForm";
import { FactGraph } from "./facts/FactGraph";
import { MembersTab } from "./MembersTab";
import { organizationMemberSelector } from "./organizationMemberSelector";
import { organizationSpaceSelector } from "./organizationSpaceSelector";

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

const FactTab: FC<{
  organization: any;
  facts: any[];
  factCategories: any[];
  onAddCategory(category: any): void;
  onEditCategory(category: any): void;
  onDeleteCategory(category: any): void;
}> = ({
  organization,
  facts,
  factCategories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const categorySets = [
    ...factCategories.map((c) => ({
      category: c,
      facts: e.collections.filter(facts, c.id, "category_id") as any,
    })),
    {
      category: null,
      facts: _.filter(facts, (f) => !f.category_id),
    },
  ];
  const existingVariableNames = facts.map(e.facts.getVar);
  const existingCategoryNames = factCategories.map((c) => c.name);

  return (
    <div>
      <div className={styles.factGrid}>
        {categorySets.map(({ category, facts }) => (
          <div
            className={styles.libraryPanel}
            key={category ? category.name : "uncategorized"}
          >
            <Category
              key={category ? category.name : "uncategorized"}
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
      <div className="mt-6">
        <NewCategorySection
          onSubmit={onAddCategory}
          existingCategoryNames={existingCategoryNames}
        />
      </div>
    </div>
  );
};

const NewCategorySection: FC<{
  onSubmit(category: FactCategory): void;
  existingCategoryNames: string[];
}> = (props) => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (category: FactCategory) => {
    setShowForm(false);
    props.onSubmit(category);
  };

  if (showForm) {
    return (
      <CategoryForm
        onSubmit={handleSubmit}
        existingCategoryNames={props.existingCategoryNames}
      />
    );
  } else {
    return (
      <ButtonWithIcon
        color="green"
        size="padded"
        onClick={() => setShowForm(true)}
        icon={<Icon name="plus" />}
        text="New Category"
      />
    );
  }
};

export const OrganizationShow: FC<{
  organizationId: number;
  tab: null | string;
}> = ({ organizationId, tab }) => {
  const [openTab, setOpenTab] = useState(
    isValidTabString(tab) ? tab : MODEL_TAB
  );
  const dispatch = useAppDispatch();

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [reload, setReload] = useState(0);
  const refreshData = () => setReload((value) => value + 1);
  const me = useAppSelector((state) => state.me);
  useEffect(() => {
    if (me.tag === "SIGNED_IN_LOADING_PROFILE") return;
    let active = true;
    setLoadState("loading");
    dispatch(loadOrganizationCollection(organizationId))
      .then(() => {
        if (active) setLoadState("ready");
      })
      .catch(() => {
        if (active) setLoadState("error");
      });
    return () => {
      active = false;
    };
  }, [dispatch, organizationId, me.tag, me.profile?.id, reload]);
  useEffect(() => {
    setOpenTab(isValidTabString(tab) ? tab : MODEL_TAB);
  }, [tab]);
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

  const destroyMembership = (membershipId: number) => {
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

  const confirmRemove = ({ name, membershipId }) => {
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
  const meIsAdmin = !!organization && organization.admin_id === me.profile?.id;
  const meIsMember =
    meIsAdmin || !!members.find((m) => m.id === me.profile?.id);

  if (loadState !== "ready" || !organization) {
    return (
      <AccountShell wide title="Organization">
        {loadState === "error" ? (
          <section className={account.card} role="alert">
            <h2>Organization couldn’t be loaded</h2>
            <button className={account.secondary} onClick={refreshData}>
              Retry
            </button>
          </section>
        ) : (
          <p role="status">Loading organization…</p>
        )}
      </AccountShell>
    );
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
  if (portalUrl) {
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
    <AccountShell
      wide
      title={organization.name}
      description="Models, members, and shared metrics."
      avatar={
        <CollectionAvatar
          name={organization.name}
          picture={organization.picture}
        />
      }
      newModelOrganizationId={meIsMember ? organizationId : undefined}
    >
      {meIsMember && (
        <nav className={styles.tabs} aria-label="Organization sections">
          {tabs.map((item) => (
            <a
              key={item.key}
              href={item.href || `/organizations/${organizationId}/${item.key}`}
              aria-current={openTab === item.key ? "page" : undefined}
              target={item.href ? "_blank" : undefined}
              rel={item.href ? "noopener noreferrer" : undefined}
              onClick={
                item.href
                  ? () => {
                      window.setTimeout(refreshData, 0);
                    }
                  : undefined
              }
            >
              {item.name}
            </a>
          ))}
        </nav>
      )}
      <div>
        {(openTab === MODEL_TAB || !meIsMember) && (
          <ModelCollection
            showPrivacy={meIsMember}
            models={spaces.map((model) => ({
              ...model,
              objectID: String(model.id),
              organization_info: organization,
            }))}
            emptyDescription={
              meIsMember
                ? "Create your team’s first model to get started."
                : "This organization hasn’t shared any public models yet."
            }
          />
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
          <div className={styles.graphPanel}>
            <FactGraph facts={facts} spaces={spaces} />
          </div>
        )}
      </div>
    </AccountShell>
  );
};
