"use client";

import NavShell, {
  DASHBOARD_ITEMS,
  DASHBOARD_MOBILE,
  NavItem,
  UserCardFooter,
  useMe,
} from "./NavShell";

const adminIcon = (s: number) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2l3 6.5 7 1-5 5 1.5 7L12 18l-6.5 3.5 1.5-7-5-5 7-1z" strokeLinejoin="round" />
  </svg>
);

const ADMIN_ITEM: NavItem = {
  id: "admin",
  label: "Admin",
  href: "/dashboard/admin",
  exact: false,
  icon: adminIcon(18),
};

const ADMIN_ITEM_MOBILE: NavItem = {
  ...ADMIN_ITEM,
  icon: adminIcon(20),
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const me = useMe();

  const items = me.isAdmin
    ? [...DASHBOARD_ITEMS, ADMIN_ITEM]
    : DASHBOARD_ITEMS;
  const mobileItems = me.isAdmin
    ? [...DASHBOARD_MOBILE, ADMIN_ITEM_MOBILE]
    : DASHBOARD_MOBILE;

  return (
    <NavShell
      items={items}
      mobileItems={mobileItems}
      footer={<UserCardFooter me={me} />}
      showAbout
      aboutUsername={me.username}
      avatarUrl={me.avatarUrl}
    >
      {children}
    </NavShell>
  );
}
