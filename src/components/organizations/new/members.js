import React from 'react'

import {MembersTab} from 'gComponents/organizations/show/members'

export const LocalAddMembers = ({organization}) => {
  return (
    <MembersTab
      members={organization.members}
      invitations={organization.invitations}
      admin_id={organization.admin_id}
      meIsAdmin={true}
    />
  )
}
