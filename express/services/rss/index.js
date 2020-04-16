const recurrentLinkService = require("./query.js");
const links = require("./links");

const startRSSService = (workerId, cpuCount) => {
  //balances links count to each worker.
  const nblinks = Math.ceil(links.length / cpuCount);
  linkToQuery = links.slice(workerId - 1, workerId + nblinks);

  linkToQuery.map((link) => {
    console.log(`worker id : ${workerId} just took link: ${link}`);
    //offloads links to rss service workers.
    recurrentLinkService(link);
  });
};

module.exports = startRSSService;
