const recurrentLinkService = require("./query.js");
const links = require("./links");

const startRSSService = (workerId, cpuCount) => {
  const nblinks = Math.ceil(links.length / cpuCount);
  linkToQuery = links.slice(workerId, workerId + nblinks);
  console.log("links to woffload", linkToQuery);
  console.log("wr id", workerId);

  linkToQuery.map(link => {
    console.log(`worker id : ${workerId} just took link: ${link}`);
    recurrentLinkService(link);
  });
};

module.exports = startRSSService;
