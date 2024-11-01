/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/webpage",
    output: "export",  // <=== enables static exports
    reactStrictMode: true, 
};

export default nextConfig;
