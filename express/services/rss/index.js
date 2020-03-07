const recurrentLinkService = require("./query.js");
const links = require("./links");

const startRSSService = (workerId, cpuCount) => {
  //offloads links to rss service workers.
  const nblinks = Math.ceil(links.length / cpuCount);
  linkToQuery = links.slice(workerId - 1, workerId + nblinks);

  linkToQuery.map(link => {
    console.log(`worker id : ${workerId} just took link: ${link}`);
    recurrentLinkService(link);
  });
};

module.exports = startRSSService;
