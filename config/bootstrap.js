/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  sails.bcrypt = require('bcryptjs');
  
  var salt = await sails.bcrypt.genSalt(10);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  if (await Coupon.count() > 0) {
    return;
  }

  await Coupon.createEach([
    { title: "Greyhound Café giving 20% discount for 10 days!", restaurant: "Greyhound Café", region: "Hong Kong Island", mall: "IFC Mall", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602337379680&di=262e0b4ed7b0ded1a85c1dc56b849009&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3D8a8329075543fbf2c52ca62b807fca1e%2F679e9b13b07eca8029e735e8972397dda044836a.jpg", quota: 888, coins: 300, expire: "20/1/2021", detail: "Use it for dog." },
    { title: "50% discount offered by clicking", restaurant: "Mongo Tree", region: "Kowloon", mall: "MegaBox", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1602337335384&di=722ac27b608f841055a3297d7ec4533a&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn14%2F540%2Fw667h673%2F20180401%2F0ae7-fyssmme3719453", quota: 30, coins: 250, expire: "15/11/2020", detail: "50% off this dog canteen" },
    { title: "Simply receive a complimentary drink", "restaurant": "Yoogane", region: "New Territories", mall: "New Town Plaza", image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603225096117&di=15edff70441f8f75dd6c4e82df670f42&imgtype=0&src=http%3A%2F%2Fstatic-xiaoguotu.17house.com%2F000%2F209%2F201406202321401743.jpg", quota: 10, coins: 100, expire: "26/10/2020", detail: "Simply receive a complimentary drink" },
    { title: "50% Off BIG COUPON", restaurant: "ANA Gura", region: "Kowloon", mall: "Festival Walk", image: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2581711193,2306308678&fm=26&gp=0.jpg", quota: 55, coins: 23, expire: "30/2/2021", detail: "50% discount on ANA Gura" },
    { title: "FREE for once", restaurant: "Delifrance", region: "Hong Kong Island", mall: "Times Square", image: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3249424126,3913868516&fm=26&gp=0.jpg", quota: 99, coins: 456, expire: "10/3/2022", detail: "Get a free dinner for once!" },
    { title: "The burger only sales for 85% now", restaurant: "The Butchers Club Burger", region: "Kowloon", mall: "APM", image: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2809302815,422194011&fm=26&gp=0.jpg", quota: 643, coins: 34, expire: "23/11/2020", detail: "Use this coupon to have a 15% discount for any burger." },
  ]);

  if (await User.count() > 0) {
    return;
  }

  var pswd = await sails.bcrypt.hash("123456", salt);
  await User.createEach([
    {username: "admin1", password: pswd, coins: "60000", role: "admin"},
    {username: "admin2", password: pswd, coins: "50000", role: "admin"}
  ]);
};
