import axios from "axios";

/**
 * Call Graph Node get only {hasBorrowed} accounts
 *
 * @param {*} pageSize
 * @param {*} skip
 */

export async function queryAccounts(pageSize: number, lastId: string): Promise<any> {
  return axios({
    url: "https://api.thegraph.com/subgraphs/name/juanmardefago/compound-v2",
    method: "post",
    data: {
      query: ` {
        accounts(first: ${pageSize},  where: { hasBorrowed : true, id_gt: "${lastId}"   } ) {
            id
            hasBorrowed
        }
      }
      `,
    },
  }).then((result: any) => {
    return result.data;
  });
}
