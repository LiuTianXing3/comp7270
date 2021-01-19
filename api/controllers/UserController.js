/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // create
    create: async function (req, res) {
        var salt = await sails.bcrypt.genSalt(10);

      
        if (req.method == "GET") {
            return res.view('user/signup');
        }

        var newUser = req.body;
        newUser.coins = 600;
        newUser.password = await sails.bcrypt.hash(newUser.password, salt);

        await User.create(newUser).fetch();
        return res.redirect('/');
    },

    // search
    search: async function (req, res) {
        if (req.wantsJSON) {
            var theUser = await User.find({
                where: {username: req.query.username}
            });

            if (theUser.length == 0) {
                return res.json('');
            } else {
                return res.json({user: 'exist'});
            }
        }
    },

    // login
    login: async function (req, res) {
     
        if (req.method == "GET") {
            var msg = "";
            return res.view('user/login', {msg: msg});
        }

      
        if (!req.body.username || !req.body.password) {
            return res.badRequest();
        }

        var user = await User.findOne({ 
            username: req.body.username 
        });

        if (!user) {
            return res.status(401).json("User not found.");
        }

        var match = await sails.bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json("Wrong password.");
        }

     
        if (!req.session.username) {
            req.session.username = user.username; 
            req.session.userid = user.id;
            req.session.userrole = user.role;

            return res.json(user);
        }
	
   
        req.session.regenerate(function (err) {
            if (err) {
                return res.serverError(err);
            }

            req.session.username = user.username;
            req.session.userid = user.id;
            req.session.userrole = user.role;
            
            return res.json(user);
        });
    },

    // logout
    logout: async function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                return res.serverError(err);
            }
            
            return res.redirect('/');
        });
    },


    usrcpn: async function (req, res) {
        var userid = req.session.userid;
        if (!userid) {
            return res.status(401).json('Please login.');
        }

        if (req.wantsJSON) {
            var theUser = await User.findOne({
                where: {id: req.session.userid}
            });

        
            if (!theUser) {
                return res.status(401).json('User not found.');
            } else {
                var userid = theUser.id;
                var userWithCoupons = await User.findOne({id: theUser.id}).populate("coupons");

                var multi = {coupons: userWithCoupons.coupons, balance: userWithCoupons.coins};
                return res.json(multi);
            }

        } else {
            var theUser = await User.find({
                where: {id: req.session.userid}
            });

           
            if (!theUser) {
                return res.view({msg: 'Please login.'});
            } else {
                var userid = req.session.userid;
                return res.view('user/coupons', {userid: userid});
            }
        }
    },

    //check
    check: async function (req, res) {
        var userid = req.session.userid;
        if (!userid) {
            return res.json('');
        } else {
            return res.json('loggedin');
        }
    },

    //  appLogout
    appLogout: async function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                return res.serverError(err);
            }
            
            return res.json('Logout Success.');
        });
    },
};

