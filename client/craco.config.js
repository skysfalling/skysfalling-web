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

// Add optimization settings with error checking and logging
const addOptimizationSettings = (webpackConfig) => {
  try {
    console.log('[Webpack Optimization] Starting chunk optimization setup...');
    
    // Store initial bundle size for comparison
    const initialSize = webpackConfig.performance?.maxAssetSize || 'unknown';
    console.log(`[Webpack Optimization] Initial max asset size: ${initialSize} bytes`);

    /*
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
            // Add logging for vendor chunks
            enforce: true,
            name(module, chunks, cacheGroupKey) {
              const moduleFileName = module
                .identifier()
                .split('/')
                .reduceRight((item) => item);
              console.log(`[Webpack Optimization] Creating vendor chunk: ${moduleFileName}`);
              return `vendor-${moduleFileName}`;
            },
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      // Add monitoring callbacks
      minimize: true,
      minimizer: [
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: false, // Keep console logs for debugging
            },
          },
          // Add minimizer logging
          minify: (file, sourceMap, minimizerOptions) => {
            const originalSize = Buffer.from(file.source).length;
            const result = require('terser').minify(file.source, minimizerOptions);
            const minifiedSize = Buffer.from(result.code).length;
            console.log(`[Webpack Optimization] File minimization:
              - Original size: ${originalSize} bytes
              - Minified size: ${minifiedSize} bytes
              - Reduction: ${((originalSize - minifiedSize) / originalSize * 100).toFixed(2)}%`);
            return result;
          }
        }),
      ],
    };
    */

    // Monitor memory usage during optimization
    const memoryUsage = process.memoryUsage();
    console.log(`[Webpack Optimization] Memory usage after setup:
      - Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB
      - RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB
      - External: ${Math.round(memoryUsage.external / 1024 / 1024)}MB`);

    // Add performance monitoring
    webpackConfig.plugins.push(
      new (require('webpack')).ProgressPlugin((percentage, message, ...args) => {
        console.log(`[Webpack Progress] ${(percentage * 100).toFixed(2)}% - ${message}`);
        if (args.length > 0) {
          console.log(`[Webpack Details] Additional info:`, args);
        }
      })
    );

    return webpackConfig;
  } catch (error) {
    console.error('[Webpack Optimization] Error during optimization setup:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error(`
        Error name: ${error.name}
        Message: ${error.message}
        Stack: ${error.stack}
      `);
    }
    // Return original config if optimization fails
    console.warn('[Webpack Optimization] Falling back to default configuration');
    return webpackConfig;
  }
};

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
      
      // Apply optimization settings with monitoring
      webpackConfig = addOptimizationSettings(webpackConfig);

      // Add error boundary for entire webpack config
      try {
        // Validate the configuration
        require('webpack').validate(webpackConfig);
        console.log('[Webpack Config] Configuration validated successfully');
      } catch (error) {
        console.error('[Webpack Config] Configuration validation failed:', error);
      }

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