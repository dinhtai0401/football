const config = {
    port: 9090,
    env: process.env.NODE_ENV || 'development',

    /** Database settings */
    databaseURL: process.env.DATABASE_URL!
};

export default config;
