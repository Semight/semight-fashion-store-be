const whitelist = [
    "http://localhost:3000",
    "https://semight-fashion-store.vercel.app",
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  
  module.exports = corsOptions;