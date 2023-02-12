export interface Tag {
  name: string;
  list: [TagDetails];
}

export interface TagDetails {
  color?: string;
  value: string;
}
