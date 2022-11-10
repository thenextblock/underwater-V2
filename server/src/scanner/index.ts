require("dotenv").config();
import _ from "lodash";
import { queryAccounts } from "./graph/index";

// (async () => {
//   // let data = await getBorrowdAccountsFromGraph();
//   // console.log("Final Data : ", data.length);
// })();

/**
 * Scanner
 */

interface accountItem {
  id: string;
  hasBorrowed: boolean;
}

export async function getBorrowdAccountsFromGraph(): Promise<accountItem[]> {
  let _data: accountItem[] = [];

  let fetchedAccounts = 1;
  let page = 0;
  let lastId = "";

  while (fetchedAccounts !== 0) {
    const res = await queryAccounts(1000, lastId);
    console.log("Page : ", page, "Fetched : ", res.data.accounts.length);
    fetchedAccounts = res.data.accounts.length;

    _data = _.union(_data, res.data.accounts);

    if (fetchedAccounts !== 0) {
      lastId = res.data.accounts[res.data.accounts.length - 1].id;
      console.log("---------------------------");
      console.log(`PAGE: ${page}  ADD JOBS IN QUEE`);
    }

    // fetchedAccounts = 0; // using for stop
    page += 1;

    if (page === 5) {
      fetchedAccounts = 0;
    } // just stop on page 5
  }

  return _data;
}
