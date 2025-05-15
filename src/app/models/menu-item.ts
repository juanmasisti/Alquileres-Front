export interface MenuItem {
  title: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  path?: string;
  children?: MenuItem[];
}