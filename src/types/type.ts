export type NavItem = {
  icon: React.ElementType;
  label: string;
  href?: string;
  children?: NavItem[];
};
