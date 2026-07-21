export interface editMenuProps {
  oldName: string;
  menuId: string;
}

export interface Menu {
  id: string;
  name: string;
  ownerId: string;
  _count: {
    items: number;
    categories: number;
  };
  owner: {
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
}
