const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.omnicoredb.bj9onx4.mongodb.net', (err, addresses) => {
  if (err) {
    console.log("SRV Lookup Error:", err.message);
  } else {
    console.log("SRV Addresses:", addresses);
  }
});

dns.resolveTxt('omnicoredb.bj9onx4.mongodb.net', (err, addresses) => {
  if (err) {
    console.log("TXT Lookup Error:", err.message);
  } else {
    console.log("TXT Addresses:", addresses);
  }
});
