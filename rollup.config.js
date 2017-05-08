import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

/**
 * Environment variables.
 */
const env = {
    name: process.env.build || 'production',
};

/**
 * Plugins.
 */
const plugins = [
    babel({
        babelrc: false,
        presets: [
            ['es2015', { modules: false }]
        ],
        plugins: [
            'external-helpers'
        ]
    }),

    replace({
        ENVIRONMENT: JSON.stringify(env.name)
    })
];

// production plugins
if (env.name == 'production') {
    plugins.push(
        uglify()
    );
}


/**
 * Export config.
 */

export default {
    format: 'iife',
    plugins: plugins
};
