/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/data/[device]/route";
exports.ids = ["app/api/data/[device]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/data/[device]/route.ts":
/*!****************************************!*\
  !*** ./app/api/data/[device]/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs/promises */ \"fs/promises\");\n/* harmony import */ var fs_promises__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_promises__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function GET(request, { params }) {\n    try {\n        const device = params.device;\n        // Fix: Use the correct path to the public/data directory\n        const dataPath = (0,path__WEBPACK_IMPORTED_MODULE_2__.join)(process.cwd(), \"public\", \"data\", device);\n        console.log(`Looking for files in: ${dataPath}`);\n        // Read the directory\n        const files = await (0,fs_promises__WEBPACK_IMPORTED_MODULE_1__.readdir)(dataPath);\n        // Filter for .txt files that start with oneProbs or sameProbs\n        const relevantFiles = files.filter((file)=>{\n            const lowerName = file.toLowerCase();\n            return file.endsWith(\".txt\") && (lowerName.startsWith(\"oneprobs\") || lowerName.startsWith(\"sameprobs\"));\n        });\n        console.log(`Found relevant files:`, relevantFiles);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            files: relevantFiles\n        });\n    } catch (error) {\n        console.error(`Error reading directory for device ${params.device}:`, error);\n        // Check if it's a directory not found error\n        if (error.code === \"ENOENT\") {\n            console.log(`Directory not found: public/data/${params.device}`);\n            console.log(`Current working directory: ${process.cwd()}`);\n            console.log(`Full path attempted: ${(0,path__WEBPACK_IMPORTED_MODULE_2__.join)(process.cwd(), \"public\", \"data\", params.device)}`);\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            files: [],\n            error: \"Directory not found\"\n        }, {\n            status: 404\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2RhdGEvW2RldmljZV0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTREO0FBQ3ZCO0FBQ1Y7QUFFcEIsZUFBZUcsSUFBSUMsT0FBb0IsRUFBRSxFQUFFQyxNQUFNLEVBQWtDO0lBQ3hGLElBQUk7UUFDRixNQUFNQyxTQUFTRCxPQUFPQyxNQUFNO1FBQzVCLHlEQUF5RDtRQUN6RCxNQUFNQyxXQUFXTCwwQ0FBSUEsQ0FBQ00sUUFBUUMsR0FBRyxJQUFJLFVBQVUsUUFBUUg7UUFFdkRJLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixFQUFFSixVQUFVO1FBRS9DLHFCQUFxQjtRQUNyQixNQUFNSyxRQUFRLE1BQU1YLG9EQUFPQSxDQUFDTTtRQUU1Qiw4REFBOEQ7UUFDOUQsTUFBTU0sZ0JBQWdCRCxNQUFNRSxNQUFNLENBQUMsQ0FBQ0M7WUFDbEMsTUFBTUMsWUFBWUQsS0FBS0UsV0FBVztZQUNsQyxPQUFPRixLQUFLRyxRQUFRLENBQUMsV0FBWUYsQ0FBQUEsVUFBVUcsVUFBVSxDQUFDLGVBQWVILFVBQVVHLFVBQVUsQ0FBQyxZQUFXO1FBQ3ZHO1FBRUFULFFBQVFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQUVFO1FBRXJDLE9BQU9iLHFEQUFZQSxDQUFDb0IsSUFBSSxDQUFDO1lBQUVSLE9BQU9DO1FBQWM7SUFDbEQsRUFBRSxPQUFPUSxPQUFPO1FBQ2RYLFFBQVFXLEtBQUssQ0FBQyxDQUFDLG1DQUFtQyxFQUFFaEIsT0FBT0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFZTtRQUV0RSw0Q0FBNEM7UUFDNUMsSUFBSUEsTUFBTUMsSUFBSSxLQUFLLFVBQVU7WUFDM0JaLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLGlDQUFpQyxFQUFFTixPQUFPQyxNQUFNLEVBQUU7WUFDL0RJLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLDJCQUEyQixFQUFFSCxRQUFRQyxHQUFHLElBQUk7WUFDekRDLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixFQUFFVCwwQ0FBSUEsQ0FBQ00sUUFBUUMsR0FBRyxJQUFJLFVBQVUsUUFBUUosT0FBT0MsTUFBTSxHQUFHO1FBQzVGO1FBRUEsT0FBT04scURBQVlBLENBQUNvQixJQUFJLENBQUM7WUFBRVIsT0FBTyxFQUFFO1lBQUVTLE9BQU87UUFBc0IsR0FBRztZQUFFRSxRQUFRO1FBQUk7SUFDdEY7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2FzdHJ5ZHBhcmsvRG9jdW1lbnRzL0dpdEh1Yi9BX0dhbWVfdG9fQmVuY2htYXJrX1F1YW50dW1fQ29tcHV0ZXJzL2FwcC9hcGkvZGF0YS9bZGV2aWNlXS9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0eXBlIE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IHsgcmVhZGRpciB9IGZyb20gXCJmcy9wcm9taXNlc1wiXG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIlxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0LCB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBkZXZpY2U6IHN0cmluZyB9IH0pIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkZXZpY2UgPSBwYXJhbXMuZGV2aWNlXG4gICAgLy8gRml4OiBVc2UgdGhlIGNvcnJlY3QgcGF0aCB0byB0aGUgcHVibGljL2RhdGEgZGlyZWN0b3J5XG4gICAgY29uc3QgZGF0YVBhdGggPSBqb2luKHByb2Nlc3MuY3dkKCksIFwicHVibGljXCIsIFwiZGF0YVwiLCBkZXZpY2UpXG5cbiAgICBjb25zb2xlLmxvZyhgTG9va2luZyBmb3IgZmlsZXMgaW46ICR7ZGF0YVBhdGh9YClcblxuICAgIC8vIFJlYWQgdGhlIGRpcmVjdG9yeVxuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgcmVhZGRpcihkYXRhUGF0aClcblxuICAgIC8vIEZpbHRlciBmb3IgLnR4dCBmaWxlcyB0aGF0IHN0YXJ0IHdpdGggb25lUHJvYnMgb3Igc2FtZVByb2JzXG4gICAgY29uc3QgcmVsZXZhbnRGaWxlcyA9IGZpbGVzLmZpbHRlcigoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgbG93ZXJOYW1lID0gZmlsZS50b0xvd2VyQ2FzZSgpXG4gICAgICByZXR1cm4gZmlsZS5lbmRzV2l0aChcIi50eHRcIikgJiYgKGxvd2VyTmFtZS5zdGFydHNXaXRoKFwib25lcHJvYnNcIikgfHwgbG93ZXJOYW1lLnN0YXJ0c1dpdGgoXCJzYW1lcHJvYnNcIikpXG4gICAgfSlcblxuICAgIGNvbnNvbGUubG9nKGBGb3VuZCByZWxldmFudCBmaWxlczpgLCByZWxldmFudEZpbGVzKVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZmlsZXM6IHJlbGV2YW50RmlsZXMgfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBFcnJvciByZWFkaW5nIGRpcmVjdG9yeSBmb3IgZGV2aWNlICR7cGFyYW1zLmRldmljZX06YCwgZXJyb3IpXG5cbiAgICAvLyBDaGVjayBpZiBpdCdzIGEgZGlyZWN0b3J5IG5vdCBmb3VuZCBlcnJvclxuICAgIGlmIChlcnJvci5jb2RlID09PSBcIkVOT0VOVFwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhgRGlyZWN0b3J5IG5vdCBmb3VuZDogcHVibGljL2RhdGEvJHtwYXJhbXMuZGV2aWNlfWApXG4gICAgICBjb25zb2xlLmxvZyhgQ3VycmVudCB3b3JraW5nIGRpcmVjdG9yeTogJHtwcm9jZXNzLmN3ZCgpfWApXG4gICAgICBjb25zb2xlLmxvZyhgRnVsbCBwYXRoIGF0dGVtcHRlZDogJHtqb2luKHByb2Nlc3MuY3dkKCksIFwicHVibGljXCIsIFwiZGF0YVwiLCBwYXJhbXMuZGV2aWNlKX1gKVxuICAgIH1cblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGZpbGVzOiBbXSwgZXJyb3I6IFwiRGlyZWN0b3J5IG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInJlYWRkaXIiLCJqb2luIiwiR0VUIiwicmVxdWVzdCIsInBhcmFtcyIsImRldmljZSIsImRhdGFQYXRoIiwicHJvY2VzcyIsImN3ZCIsImNvbnNvbGUiLCJsb2ciLCJmaWxlcyIsInJlbGV2YW50RmlsZXMiLCJmaWx0ZXIiLCJmaWxlIiwibG93ZXJOYW1lIiwidG9Mb3dlckNhc2UiLCJlbmRzV2l0aCIsInN0YXJ0c1dpdGgiLCJqc29uIiwiZXJyb3IiLCJjb2RlIiwic3RhdHVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/data/[device]/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&page=%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute.ts&appDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&page=%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute.ts&appDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_astrydpark_Documents_GitHub_A_Game_to_Benchmark_Quantum_Computers_app_api_data_device_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/data/[device]/route.ts */ \"(rsc)/./app/api/data/[device]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/data/[device]/route\",\n        pathname: \"/api/data/[device]\",\n        filename: \"route\",\n        bundlePath: \"app/api/data/[device]/route\"\n    },\n    resolvedPagePath: \"/Users/astrydpark/Documents/GitHub/A_Game_to_Benchmark_Quantum_Computers/app/api/data/[device]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_astrydpark_Documents_GitHub_A_Game_to_Benchmark_Quantum_Computers_app_api_data_device_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkYXRhJTJGJTVCZGV2aWNlJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZkYXRhJTJGJTVCZGV2aWNlJTVEJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGZGF0YSUyRiU1QmRldmljZSU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFzdHJ5ZHBhcmslMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZBX0dhbWVfdG9fQmVuY2htYXJrX1F1YW50dW1fQ29tcHV0ZXJzJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmFzdHJ5ZHBhcmslMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZBX0dhbWVfdG9fQmVuY2htYXJrX1F1YW50dW1fQ29tcHV0ZXJzJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN1RDtBQUNwSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2FzdHJ5ZHBhcmsvRG9jdW1lbnRzL0dpdEh1Yi9BX0dhbWVfdG9fQmVuY2htYXJrX1F1YW50dW1fQ29tcHV0ZXJzL2FwcC9hcGkvZGF0YS9bZGV2aWNlXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZGF0YS9bZGV2aWNlXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RhdGEvW2RldmljZV1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2RhdGEvW2RldmljZV0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvYXN0cnlkcGFyay9Eb2N1bWVudHMvR2l0SHViL0FfR2FtZV90b19CZW5jaG1hcmtfUXVhbnR1bV9Db21wdXRlcnMvYXBwL2FwaS9kYXRhL1tkZXZpY2VdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&page=%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute.ts&appDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&page=%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdata%2F%5Bdevice%5D%2Froute.ts&appDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fastrydpark%2FDocuments%2FGitHub%2FA_Game_to_Benchmark_Quantum_Computers&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();