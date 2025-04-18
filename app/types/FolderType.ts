export type FolderType = {
  id: string;
  name: string;
  level: number;
  children: FolderType[];
};
