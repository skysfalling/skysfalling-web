// Import Node.js path module for handling file paths
const path = require("path");

// Import utilities from craco for webpack loader manipulation
// getLoader: finds a loader in webpack config
// loaderByName: helps identify loaders by their name
const { getLoader, loaderByName } = require("@craco/craco");

// Initialize an array to store paths to external packages that need to be included in the build
const packages = [];

// Log the current directory path for debugging purposes
console.log(__dirname);

// Add the shared module path to the packages array
// This allows the shared module to be included in the webpack build process
packages.push(path.join(__dirname, "../shared"));

module.exports = {
  webpack: {
    alias: {
      'shared': path.resolve(__dirname, '../shared')
    },
    // Configure webpack with custom settings
    configure: (webpackConfig) => {
      // Add file extensions that webpack should resolve
      // This allows imports without file extensions
      // e.g., import Component from './Component' will look for Component.ts, Component.tsx, etc.
      webpackConfig.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];

      // Find the babel-loader in webpack config
      // babel-loader is responsible for transforming JavaScript and TypeScript files
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );

      // If babel-loader is found in the config
      if (isFound) {
        // Get the 'include' paths from the loader
        // These paths tell webpack which files should be processed by this loader
        const include = Array.isArray(match.loader.include)
          ? match.loader.include        // If it's already an array, use it
          : [match.loader.include];     // If it's not an array, convert it to one

        // Add our external package paths to the include array
        // This ensures our shared module gets processed by babel-loader
        match.loader.include = include.concat(packages);
      }

      // Add shared module to module resolution
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../shared'),
      ];
      
      // Allow importing from outside src directory
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      
      /*
      // Add optimization settings
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
      */

      // Return the modified webpack configuration
      return webpackConfig;
    }
  },
  // Add performance hints
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};