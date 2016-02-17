var config = {};

config.development = {     
    database: {
        name: 'letsgoout',
        host: 'ds011268.mongolab.com',
        port: '11268',
        credentials: 'example:example'
    },
    application: {
        port: 5000,
        cookieKey: '8YQM5GUAtLAT34'
    }
     
};
 
config.production = {
     
    database: {
        name: 'proddb',
        host: 'localhost',
        port: '8080',
        credentials: 'admin:password@' // username:password@
    },
    smtp: {
        username: "username",
        password: "password",
        host: "smtp.yourmailserver.com",
        port: 25,
        ssl: false
    },    
    application: {
        port: 80,
        cookieKey: '5SCjWfsTW8ySul'
    }    
     
};
 
config.environment = 'development';
 
module.exports = config;