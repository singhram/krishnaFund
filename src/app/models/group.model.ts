import { User } from "./user.model";

export interface GroupInterface {
    /** MongoDB unique identifier */
    _id: string;

    /** Business name or ID for the group */
    groupId: string;

    /** Total duration of the auction/scheme */
    numberOfmonths: number;

    /** Current month or iteration number */
    running: number;

    /** Current financial balance of the group */
    balance: number;

    /** Current auction number */
    auction: number;

    /** Percentage of interest applied */
    interest: number;

    /** Entity or person who took the auction */
    takenBy: string;

    /** The starting or reference date (ISO String) */
    createdDate: string;

    /** Array of associated User UUIDs */
    users: string[];
    balanceMonth: number;
    totalnumberOfmonths: number;
    runningMonth: number;
    baseAmount: number;
    net: number;
    groupAmount: number;
    id: string
}

export interface GroupUserInterface {
    group :GroupInterface,
    userDetails:User[]
}
export interface userGroupInterface {
   group: GroupInterface
  userDetails: User[]
}