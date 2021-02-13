export interface IGroup {
  id: number;
  name: string;
  creationDate: Date;
  description?: string;
  pointsCompleted: number;
  pointsTotal: number;
  items: IGroupTodo[];
}

export interface IGroupTodo {
  id: number;
  name: string;
  done: boolean;
  points: number;
  group: IGroup;
}
