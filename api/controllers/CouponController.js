/**
 * CouponController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // create
    create: async function(req, res) {
       
        if (req.method == "GET") {
            return res.view('coupon/create');
        }


        
        await Coupon.create(req.body).fetch();
        return res.redirect('/admin');
    },

    // admin
    admin: async function(req, res) {
        var allCoupon = await Coupon.find();
        return res.view('coupon/admin', {coupons: allCoupon});
    },

    // update 
    update: async function(req, res) {
        if (req.method == "GET") {
            var theCoupon = await Coupon.findOne(req.params.id);
            
            if (!theCoupon) {
                return res.notFound();
            } else {
                return res.view('coupon/update', {coupon: theCoupon});
            }
        } else {
            var updateCoupon = await Coupon.updateOne(req.params.id).set(req.body);

            if (!updateCoupon) {
                return res.notFound();
            } else {
                return res.redirect('/admin');
            }
        }
    },

    // delete 
    delete: async function (req, res) {
        var deletedCoupon= await Coupon.destroyOne(req.params.id);
    
        if (!deletedCoupon) {
            return res.notFound();
        } else {
            return res.redirect('/admin');
        }
    },

    // search 
    search: async function (req, res) {
        var whereClause = {};
        
        if (req.query.region) {
            whereClause.region = {
                contains: req.query.region
            };
        }

        var parsedCoinsMin = parseInt(req.query.coinsMin);
        var parsedCoinsMax = parseInt(req.query.coinsMax);
        
        if (!isNaN(parsedCoinsMin) && !isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '>=': parsedCoinsMin,
                '<=': parsedCoinsMax
            };
        } else if (!isNaN(parsedCoinsMin)) {
            whereClause.coins = {
                '>=': parsedCoinsMin
            };
        } else if (!isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '<=': parsedCoinsMax
            };
        }
        
        if (req.query.expire) {
            whereClause.expire = req.query.expire;
        }
        var coupnsResultAll = await Coupon.find({
            where: whereClause
        });

        
        var resultKeysArr = Object.keys(coupnsResultAll);
        var count = resultKeysArr.length;

      
        var limit = Math.max(req.query.limit, 2) || 2;
        var offset = Math.max(req.query.offset, 0) || 0;

       
        var coupnsResult = await Coupon.find({
            where: whereClause,
            limit: limit,
            skip: offset
        });

        var requests = req.query;
        
        return res.view('coupon/search', {
            coupons: coupnsResult,
            numOfRecords: count,
            request: requests
        });
    },

    // ajaxSearch
    ajaxSearch:  async function (req, res) {
        var whereClause = {};
            
  
        if (req.query.region) {
            whereClause.region = {
                contains: req.query.region
            };
        }

      
        var parsedCoinsMin = parseInt(req.query.coinsMin);
        var parsedCoinsMax = parseInt(req.query.coinsMax);
        
        if (!isNaN(parsedCoinsMin) && !isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '>=': parsedCoinsMin,
                '<=': parsedCoinsMax
            };
        } else if (!isNaN(parsedCoinsMin)) {
            whereClause.coins = {
                '>=': parsedCoinsMin
            };
        } else if (!isNaN(parsedCoinsMax)) {
            whereClause.coins = {
                '<=': parsedCoinsMax
            };
        }
        
        if (req.query.expire) {
            whereClause.expire = req.query.expire;
        }

        if (req.wantsJSON) {
       
            var coupnsResultAll = await Coupon.find({
                where: whereClause
            });
    
        
            var resultKeysArr = Object.keys(coupnsResultAll);
            var count = resultKeysArr.length;

          
            var limit = Math.max(req.query.limit, 2) || 2;
            var offset = Math.max(req.query.offset, 0) || 0;

            var coupnsResult = await Coupon.find({
                where: whereClause,
                limit: limit,
                skip: offset
            });
            
            var multi = {coupons: coupnsResult, count:count};
            return res.json(multi);
        } else {
            var coupnsResultAll = await Coupon.find({
                where: whereClause
            });
    
            var resultKeysArr = Object.keys(coupnsResultAll);
            var count = resultKeysArr.length;

            return res.view('coupon/search', {
                numOfRecords: count
            });
        }
    },

    homepage: async function (req, res) {
        
        var hki = await Coupon.find({
            where: {region: 'Hong Kong Island'},
            limit: 2
        });

       
        var kl = await Coupon.find({
            where: {region: 'Kowloon'},
            limit: 2
        });

     
        var nt = await Coupon.find({
            where: {region: 'New Territories'},
            limit: 2
        });

        return res.view('pages/homepage', {
            hkiCoupons: hki,
            klCoupons: kl,
            ntCoupons: nt
        });
    },

    //  details
    details: async function (req, res) {
        var coupon = await Coupon.findOne(req.params.id);
        var currentUserId = req.session.userid;
        
        if(!currentUserId) {
            return res.view('coupon/details', {
                coupon: coupon,
            });
        } else {
            var redeemValidation;
            var redeemedByUser = await User.findOne({id: currentUserId}).populate("coupons", {id: req.params.id});
            
            if ((redeemedByUser.coupons.length == 0) && (redeemedByUser.coins >= coupon.coins)) {
                redeemValidation = true;
            } else {
                redeemValidation = false;
            }

            return res.view('coupon/details', {
                coupon: coupon,
                redeemValidation: redeemValidation
            });
        }
    },

    // redeem
    redeem: async function (req, res) {
        var currentUserId = req.session.userid;

        if(!await Coupon.findOne(req.params.id)) {
            return res.status(404).json("Coupon not found.");
        }

        if (!currentUserId) {
            return res.status(403).json("Please login.");
        } else {
            var currentUser = await User.findOne({id: currentUserId}).populate("coupons", {id: req.params.id});
            if (!currentUser) {
                return res.status(404).json("User not found.");
            }
    
            if (currentUser.coupons.length > 0) {
                return res.status(409).json("Coupon already redeemed.");
            }
    
           
            var theCoupon = await Coupon.findOne(req.params.id);
            if ((theCoupon.quota > 0) && (currentUser.coins >= theCoupon.coins)) {
                
                await Coupon.addToCollection(req.params.id, 'redeemedBy').members(req.session.userid);
                await Coupon.updateOne({id: req.params.id}).set({quota: theCoupon.quota - 1});

               
                await User.updateOne({id: req.session.userid}).set({coins: currentUser.coins - theCoupon.coins});
                
                if (req.wantsJSON) {
                    res.json("Redeem Success.");
                } else {
                    return res.redirect('/details/' + req.params.id);
                }
            } else {
                return res.status(409).json("Coupon has no quota or user do not have enough coins.");
            }   
        }
    },

    
    cpnusr: async function (req, res) {
        if (req.wantsJSON) {
            var theCoupon = await Coupon.findOne({
                where: {id: req.params.id}
            });

            if (!theCoupon) {
                return res.json('Coupon not found.');
            } else {
                var couponid = theCoupon.id;
                var couponWithUsers = await Coupon.findOne({id: couponid}).populate("redeemedBy");

                return res.json({users: couponWithUsers.redeemedBy});
            }

        } else {
            var theCoupon = await Coupon.findOne({
                where: {id: req.params.id}
            });

            if (!theCoupon) {
                return res.view({msg: 'Coupon not found.'});
            } else {
                var couponid = req.params.id;
                return res.view('coupon/users', {couponid: couponid});
            }
        }
    },

    // hometab
    hometab: async function(req, res) {
        if (req.wantsJSON) {
            var coupnsResultAll = await Coupon.find();
            return res.json(coupnsResultAll);
        }
        
    },

    // searchCouponMall
    searchCouponMall: async function(req, res) {
        var whereClause = {};

        if (req.wantsJSON) {
            
            whereClause.mall = {
                contains: req.body.mall
            };
            
            var coupnsResult = await Coupon.find({
                where: whereClause
            });

            if (coupnsResult.length > 0) {
                return res.json(coupnsResult);
            } else {
                return res.status(404).json("Coupon not found.");
            }
            
        }
    },

    searchCouponCoins: async function(req, res) {
        var whereClause = {};

        if (req.wantsJSON) {
            var range = req.body.coinRange.content;
            console.log(range)
            if (range === "Coins ≥ 700") {
                whereClause.coins = {
                    '>=': 700
                };
            } else if (range === "300 < Coins < 700") {
                whereClause.coins = {
                    '>': 300,
                    '<': 700
                };
            } else if (range === "Coins ≤ 300") {
                whereClause.coins = {
                    '<=': 300
                };
            }
            
            var coupnsResult = await Coupon.find({
                where: whereClause
            });

            if (coupnsResult.length > 0) {
                return res.json(coupnsResult);
            } else {
                return res.status(404).json("Coupon not found.");
            }
        }
    }

};