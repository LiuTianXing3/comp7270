/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

     
    '/': { view: 'pages/homepage' },


    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/

    // ╭══╮╭══╮╭╮╭╮╭══╮╭══╮╭╮╭╮
    // ║╭═╯║╭╮║║║║║║╭╮║║╭╮║║╰╮║
    // ║║  ║║║║║║║║║╰╯║║║║║║  ║
    // ║║  ║║║║║║║║║╭═╯║║║║║  ║
    // ║╰═╮║╰╯║║╰╯║║║  ║╰╯║║╰╮║
    // ╰══╯╰══╯╰══╯╰╯  ╰══╯╰╯╰╯

    // CREATE
    'GET /create': 'CouponController.create',
    'POST /create': 'CouponController.create',

    // ADMIN
    'GET /admin': 'CouponController.admin',

    // UPDATE
    'GET /update/:id': 'CouponController.update',
    'POST /update/:id': 'CouponController.update',

    // DELETE
    'GET /delete/:id': 'CouponController.delete',

    // SEARCH and PAGINATION
    'GET /search': 'CouponController.search',

    // AJAX SEARCH and PAGINATION
    'GET /ajaxSearch': 'CouponController.ajaxSearch',

    // HOMEPAGE
    'GET /': 'CouponController.homepage',

    // DETAILS
    'GET /details/:id': 'CouponController.details',

    // REDEEM
    'GET /redeem/:id': 'CouponController.redeem',

    // USERS that REDEEM COUPON
    'GET /users/:id': 'CouponController.cpnusr',

    // HOMETAB
    'GET /hometab': 'CouponController.hometab',
    
    // SEARCHCOUPONMALL
    'POST /searchCouponMall': 'CouponController.searchCouponMall',

    // SEARCHCOUPONMALL
    'POST /searchCouponCoins': 'CouponController.searchCouponCoins',
    
    // ╭╮╭╮╭══╮╭══╮╭══╮
    // ║║║║║╭═╯║╭═╯║╭╮║
    // ║║║║║╰═╮║╰═╮║╰╯║
    // ║║║║╰═╮║║╭═╯║╭╭╯
    // ║╰╯║╭═╯║║╰═╮║║╰╮
    // ╰══╯╰══╯╰══╯╰╯╰╯

    // CREATE
    'GET /signup': 'UserController.create',
    'POST /signup': 'UserController.create',

    // SEARCH BY USERNAME
    'GET /user/search': 'UserController.search',

    // LOGIN
    'GET /login': 'UserController.login',
    'POST /login': 'UserController.login',

    // LOGOUT
    'GET /logout': 'UserController.logout',

    // COUPONS that USER REDEEMED
    'GET /coupons': 'UserController.usrcpn',

    // LOGIN CHECK
    'GET /check': 'UserController.check',

    // APPLOGOUT
    'GET /appLogout': 'UserController.appLogout',
};