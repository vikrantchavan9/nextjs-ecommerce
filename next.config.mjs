/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
          remotePatterns: [
               {
                    protocol: 'https',
                    hostname: 'res.cloudinary.com',
               },
          ],
     },

     webpack: (config, { isServer, webpack }) => {
          if (!isServer) {
               config.resolve.fallback = {
                    ...config.resolve.fallback,
                    fs: false,
                    net: false,
                    dns: false,
                    tls: false,
               };
          }

          config.plugins.push(
               new webpack.IgnorePlugin({
                    resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
               })
          );

          return config;
     },
};

export default nextConfig;
