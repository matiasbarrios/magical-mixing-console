module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-advanced-variables': {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
    },
};
