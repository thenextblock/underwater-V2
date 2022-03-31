const axios = require("axios");

axios({
  url: "https://api.thegraph.com/subgraphs/name/juanmardefago/compound-v2",
  method: "post",
  data: {
    query: ` {
        accounts(first: 1000,  where: {hasBorrowed : true, id_gt: ""  } ) {
            id
            hasBorrowed
        } 
      }
      `,
  },
}).then((result: any) => {
  console.log(result.data);
});
