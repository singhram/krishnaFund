import { GroupUserInterface } from "@app/models/group.model";

export class GroupUser implements GroupUserInterface {
  userDetails: any[] = [];
  group = {
    groupAmount: 0,
    baseAmount: 0,
    runningMonth: 0,
    balanceMonth: 0,
    net: 0,
    _id: "",
    groupId: "",
    numberOfmonths: 0,
    running: 0,
    balance: 0,
    auction: 0,
    interest: 0,
    takenBy: "",
    createdDate: "",
    users: [],
    id: "",
    totalnumberOfmonths: 0
  };

  constructor(data?: Partial<GroupUserInterface>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}