var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/import-meta-resolve/lib/resolve.js
var resolve_exports = {};
__export(resolve_exports, {
  defaultResolve: () => defaultResolve,
  getPackageType: () => getPackageType,
  moduleResolve: () => moduleResolve
});
var import_url2 = require("url");
var import_fs2 = require("fs");
var import_path3 = __toESM(require("path"), 1);
var import_builtins = __toESM(require("builtins"), 1);

// node_modules/import-meta-resolve/lib/package-json-reader.js
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var reader = { read };
var package_json_reader_default = reader;
function read(jsonPath) {
  return find(import_path.default.dirname(jsonPath));
}
function find(dir) {
  try {
    const string = import_fs.default.readFileSync(import_path.default.toNamespacedPath(import_path.default.join(dir, "package.json")), "utf8");
    return { string };
  } catch (error) {
    if (error.code === "ENOENT") {
      const parent = import_path.default.dirname(dir);
      if (dir !== parent)
        return find(parent);
      return { string: void 0 };
    }
    throw error;
  }
}

// node_modules/import-meta-resolve/lib/get-format.js
var import_path2 = __toESM(require("path"), 1);
var import_url = require("url");

// node_modules/import-meta-resolve/lib/errors.js
var import_assert = __toESM(require("assert"), 1);
var import_util = require("util");
var isWindows = process.platform === "win32";
var own = {}.hasOwnProperty;
var codes = {};
var messages = /* @__PURE__ */ new Map();
var nodeInternalPrefix = "__node_internal_";
var userStackTraceLimit;
codes.ERR_INVALID_MODULE_SPECIFIER = createError("ERR_INVALID_MODULE_SPECIFIER", (request, reason, base = void 0) => {
  return `Invalid module "${request}" ${reason}${base ? ` imported from ${base}` : ""}`;
}, TypeError);
codes.ERR_INVALID_PACKAGE_CONFIG = createError("ERR_INVALID_PACKAGE_CONFIG", (path4, base, message) => {
  return `Invalid package config ${path4}${base ? ` while importing ${base}` : ""}${message ? `. ${message}` : ""}`;
}, Error);
codes.ERR_INVALID_PACKAGE_TARGET = createError("ERR_INVALID_PACKAGE_TARGET", (pkgPath, key, target, isImport = false, base = void 0) => {
  const relError = typeof target === "string" && !isImport && target.length > 0 && !target.startsWith("./");
  if (key === ".") {
    (0, import_assert.default)(isImport === false);
    return `Invalid "exports" main target ${JSON.stringify(target)} defined in the package config ${pkgPath}package.json${base ? ` imported from ${base}` : ""}${relError ? '; targets must start with "./"' : ""}`;
  }
  return `Invalid "${isImport ? "imports" : "exports"}" target ${JSON.stringify(target)} defined for '${key}' in the package config ${pkgPath}package.json${base ? ` imported from ${base}` : ""}${relError ? '; targets must start with "./"' : ""}`;
}, Error);
codes.ERR_MODULE_NOT_FOUND = createError("ERR_MODULE_NOT_FOUND", (path4, base, type = "package") => {
  return `Cannot find ${type} '${path4}' imported from ${base}`;
}, Error);
codes.ERR_PACKAGE_IMPORT_NOT_DEFINED = createError("ERR_PACKAGE_IMPORT_NOT_DEFINED", (specifier, packagePath, base) => {
  return `Package import specifier "${specifier}" is not defined${packagePath ? ` in package ${packagePath}package.json` : ""} imported from ${base}`;
}, TypeError);
codes.ERR_PACKAGE_PATH_NOT_EXPORTED = createError("ERR_PACKAGE_PATH_NOT_EXPORTED", (pkgPath, subpath, base = void 0) => {
  if (subpath === ".")
    return `No "exports" main defined in ${pkgPath}package.json${base ? ` imported from ${base}` : ""}`;
  return `Package subpath '${subpath}' is not defined by "exports" in ${pkgPath}package.json${base ? ` imported from ${base}` : ""}`;
}, Error);
codes.ERR_UNSUPPORTED_DIR_IMPORT = createError("ERR_UNSUPPORTED_DIR_IMPORT", "Directory import '%s' is not supported resolving ES modules imported from %s", Error);
codes.ERR_UNKNOWN_FILE_EXTENSION = createError("ERR_UNKNOWN_FILE_EXTENSION", 'Unknown file extension "%s" for %s', TypeError);
codes.ERR_INVALID_ARG_VALUE = createError("ERR_INVALID_ARG_VALUE", (name, value, reason = "is invalid") => {
  let inspected = (0, import_util.inspect)(value);
  if (inspected.length > 128) {
    inspected = `${inspected.slice(0, 128)}...`;
  }
  const type = name.includes(".") ? "property" : "argument";
  return `The ${type} '${name}' ${reason}. Received ${inspected}`;
}, TypeError);
codes.ERR_UNSUPPORTED_ESM_URL_SCHEME = createError("ERR_UNSUPPORTED_ESM_URL_SCHEME", (url) => {
  let message = "Only file and data URLs are supported by the default ESM loader";
  if (isWindows && url.protocol.length === 2) {
    message += ". On Windows, absolute paths must be valid file:// URLs";
  }
  message += `. Received protocol '${url.protocol}'`;
  return message;
}, Error);
function createError(sym, value, def) {
  messages.set(sym, value);
  return makeNodeErrorWithCode(def, sym);
}
function makeNodeErrorWithCode(Base, key) {
  return NodeError;
  function NodeError(...args) {
    const limit = Error.stackTraceLimit;
    if (isErrorStackTraceLimitWritable())
      Error.stackTraceLimit = 0;
    const error = new Base();
    if (isErrorStackTraceLimitWritable())
      Error.stackTraceLimit = limit;
    const message = getMessage(key, args, error);
    Object.defineProperty(error, "message", {
      value: message,
      enumerable: false,
      writable: true,
      configurable: true
    });
    Object.defineProperty(error, "toString", {
      value() {
        return `${this.name} [${key}]: ${this.message}`;
      },
      enumerable: false,
      writable: true,
      configurable: true
    });
    addCodeToName(error, Base.name, key);
    error.code = key;
    return error;
  }
}
var addCodeToName = hideStackFrames(function(error, name, code) {
  error = captureLargerStackTrace(error);
  error.name = `${name} [${code}]`;
  error.stack;
  if (name === "SystemError") {
    Object.defineProperty(error, "name", {
      value: name,
      enumerable: false,
      writable: true,
      configurable: true
    });
  } else {
    delete error.name;
  }
});
function isErrorStackTraceLimitWritable() {
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return own.call(desc, "writable") ? desc.writable : desc.set !== void 0;
}
function hideStackFrames(fn) {
  const hidden = nodeInternalPrefix + fn.name;
  Object.defineProperty(fn, "name", { value: hidden });
  return fn;
}
var captureLargerStackTrace = hideStackFrames(function(error) {
  const stackTraceLimitIsWritable = isErrorStackTraceLimitWritable();
  if (stackTraceLimitIsWritable) {
    userStackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = Number.POSITIVE_INFINITY;
  }
  Error.captureStackTrace(error);
  if (stackTraceLimitIsWritable)
    Error.stackTraceLimit = userStackTraceLimit;
  return error;
});
function getMessage(key, args, self) {
  const message = messages.get(key);
  if (typeof message === "function") {
    (0, import_assert.default)(message.length <= args.length, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${message.length}).`);
    return Reflect.apply(message, self, args);
  }
  const expectedLength = (message.match(/%[dfijoOs]/g) || []).length;
  (0, import_assert.default)(expectedLength === args.length, `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`);
  if (args.length === 0)
    return message;
  args.unshift(message);
  return Reflect.apply(import_util.format, null, args);
}

// node_modules/import-meta-resolve/lib/get-format.js
var { ERR_UNKNOWN_FILE_EXTENSION } = codes;
var extensionFormatMap = {
  __proto__: null,
  ".cjs": "commonjs",
  ".js": "module",
  ".mjs": "module"
};
function defaultGetFormat(url) {
  if (url.startsWith("node:")) {
    return { format: "builtin" };
  }
  const parsed = new import_url.URL(url);
  if (parsed.protocol === "data:") {
    const { 1: mime } = /^([^/]+\/[^;,]+)[^,]*?(;base64)?,/.exec(parsed.pathname) || [null, null];
    const format2 = mime === "text/javascript" ? "module" : null;
    return { format: format2 };
  }
  if (parsed.protocol === "file:") {
    const ext = import_path2.default.extname(parsed.pathname);
    let format2;
    if (ext === ".js") {
      format2 = getPackageType(parsed.href) === "module" ? "module" : "commonjs";
    } else {
      format2 = extensionFormatMap[ext];
    }
    if (!format2) {
      throw new ERR_UNKNOWN_FILE_EXTENSION(ext, (0, import_url.fileURLToPath)(url));
    }
    return { format: format2 || null };
  }
  return { format: null };
}

// node_modules/import-meta-resolve/lib/resolve.js
var listOfBuiltins = (0, import_builtins.default)();
var {
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
  ERR_INVALID_ARG_VALUE
} = codes;
var own2 = {}.hasOwnProperty;
var DEFAULT_CONDITIONS = Object.freeze(["node", "import"]);
var DEFAULT_CONDITIONS_SET = new Set(DEFAULT_CONDITIONS);
var invalidSegmentRegEx = /(^|\\|\/)(\.\.?|node_modules)(\\|\/|$)/;
var patternRegEx = /\*/g;
var encodedSepRegEx = /%2f|%2c/i;
var emittedPackageWarnings = /* @__PURE__ */ new Set();
var packageJsonCache = /* @__PURE__ */ new Map();
function emitFolderMapDeprecation(match, pjsonUrl, isExports, base) {
  const pjsonPath = (0, import_url2.fileURLToPath)(pjsonUrl);
  if (emittedPackageWarnings.has(pjsonPath + "|" + match))
    return;
  emittedPackageWarnings.add(pjsonPath + "|" + match);
  process.emitWarning(`Use of deprecated folder mapping "${match}" in the ${isExports ? '"exports"' : '"imports"'} field module resolution of the package at ${pjsonPath}${base ? ` imported from ${(0, import_url2.fileURLToPath)(base)}` : ""}.
Update this package.json to use a subpath pattern like "${match}*".`, "DeprecationWarning", "DEP0148");
}
function emitLegacyIndexDeprecation(url, packageJsonUrl, base, main) {
  const { format: format2 } = defaultGetFormat(url.href);
  if (format2 !== "module")
    return;
  const path4 = (0, import_url2.fileURLToPath)(url.href);
  const pkgPath = (0, import_url2.fileURLToPath)(new import_url2.URL(".", packageJsonUrl));
  const basePath = (0, import_url2.fileURLToPath)(base);
  if (main)
    process.emitWarning(`Package ${pkgPath} has a "main" field set to ${JSON.stringify(main)}, excluding the full filename and extension to the resolved file at "${path4.slice(pkgPath.length)}", imported from ${basePath}.
 Automatic extension resolution of the "main" field isdeprecated for ES modules.`, "DeprecationWarning", "DEP0151");
  else
    process.emitWarning(`No "main" or "exports" field defined in the package.json for ${pkgPath} resolving the main entry point "${path4.slice(pkgPath.length)}", imported from ${basePath}.
Default "index" lookups for the main are deprecated for ES modules.`, "DeprecationWarning", "DEP0151");
}
function getConditionsSet(conditions) {
  if (conditions !== void 0 && conditions !== DEFAULT_CONDITIONS) {
    if (!Array.isArray(conditions)) {
      throw new ERR_INVALID_ARG_VALUE("conditions", conditions, "expected an array");
    }
    return new Set(conditions);
  }
  return DEFAULT_CONDITIONS_SET;
}
function tryStatSync(path4) {
  try {
    return (0, import_fs2.statSync)(path4);
  } catch {
    return new import_fs2.Stats();
  }
}
function getPackageConfig(path4, specifier, base) {
  const existing = packageJsonCache.get(path4);
  if (existing !== void 0) {
    return existing;
  }
  const source = package_json_reader_default.read(path4).string;
  if (source === void 0) {
    const packageConfig2 = {
      pjsonPath: path4,
      exists: false,
      main: void 0,
      name: void 0,
      type: "none",
      exports: void 0,
      imports: void 0
    };
    packageJsonCache.set(path4, packageConfig2);
    return packageConfig2;
  }
  let packageJson;
  try {
    packageJson = JSON.parse(source);
  } catch (error) {
    throw new ERR_INVALID_PACKAGE_CONFIG(path4, (base ? `"${specifier}" from ` : "") + (0, import_url2.fileURLToPath)(base || specifier), error.message);
  }
  const { exports, imports, main, name, type } = packageJson;
  const packageConfig = {
    pjsonPath: path4,
    exists: true,
    main: typeof main === "string" ? main : void 0,
    name: typeof name === "string" ? name : void 0,
    type: type === "module" || type === "commonjs" ? type : "none",
    exports,
    imports: imports && typeof imports === "object" ? imports : void 0
  };
  packageJsonCache.set(path4, packageConfig);
  return packageConfig;
}
function getPackageScopeConfig(resolved) {
  let packageJsonUrl = new import_url2.URL("./package.json", resolved);
  while (true) {
    const packageJsonPath2 = packageJsonUrl.pathname;
    if (packageJsonPath2.endsWith("node_modules/package.json"))
      break;
    const packageConfig2 = getPackageConfig((0, import_url2.fileURLToPath)(packageJsonUrl), resolved);
    if (packageConfig2.exists)
      return packageConfig2;
    const lastPackageJsonUrl = packageJsonUrl;
    packageJsonUrl = new import_url2.URL("../package.json", packageJsonUrl);
    if (packageJsonUrl.pathname === lastPackageJsonUrl.pathname)
      break;
  }
  const packageJsonPath = (0, import_url2.fileURLToPath)(packageJsonUrl);
  const packageConfig = {
    pjsonPath: packageJsonPath,
    exists: false,
    main: void 0,
    name: void 0,
    type: "none",
    exports: void 0,
    imports: void 0
  };
  packageJsonCache.set(packageJsonPath, packageConfig);
  return packageConfig;
}
function fileExists(url) {
  return tryStatSync((0, import_url2.fileURLToPath)(url)).isFile();
}
function legacyMainResolve(packageJsonUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== void 0) {
    guess = new import_url2.URL(`./${packageConfig.main}`, packageJsonUrl);
    if (fileExists(guess))
      return guess;
    const tries2 = [
      `./${packageConfig.main}.js`,
      `./${packageConfig.main}.json`,
      `./${packageConfig.main}.node`,
      `./${packageConfig.main}/index.js`,
      `./${packageConfig.main}/index.json`,
      `./${packageConfig.main}/index.node`
    ];
    let i2 = -1;
    while (++i2 < tries2.length) {
      guess = new import_url2.URL(tries2[i2], packageJsonUrl);
      if (fileExists(guess))
        break;
      guess = void 0;
    }
    if (guess) {
      emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
      return guess;
    }
  }
  const tries = ["./index.js", "./index.json", "./index.node"];
  let i = -1;
  while (++i < tries.length) {
    guess = new import_url2.URL(tries[i], packageJsonUrl);
    if (fileExists(guess))
      break;
    guess = void 0;
  }
  if (guess) {
    emitLegacyIndexDeprecation(guess, packageJsonUrl, base, packageConfig.main);
    return guess;
  }
  throw new ERR_MODULE_NOT_FOUND((0, import_url2.fileURLToPath)(new import_url2.URL(".", packageJsonUrl)), (0, import_url2.fileURLToPath)(base));
}
function finalizeResolution(resolved, base) {
  if (encodedSepRegEx.test(resolved.pathname))
    throw new ERR_INVALID_MODULE_SPECIFIER(resolved.pathname, 'must not include encoded "/" or "\\" characters', (0, import_url2.fileURLToPath)(base));
  const path4 = (0, import_url2.fileURLToPath)(resolved);
  const stats = tryStatSync(path4.endsWith("/") ? path4.slice(-1) : path4);
  if (stats.isDirectory()) {
    const error = new ERR_UNSUPPORTED_DIR_IMPORT(path4, (0, import_url2.fileURLToPath)(base));
    error.url = String(resolved);
    throw error;
  }
  if (!stats.isFile()) {
    throw new ERR_MODULE_NOT_FOUND(path4 || resolved.pathname, base && (0, import_url2.fileURLToPath)(base), "module");
  }
  return resolved;
}
function throwImportNotDefined(specifier, packageJsonUrl, base) {
  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(specifier, packageJsonUrl && (0, import_url2.fileURLToPath)(new import_url2.URL(".", packageJsonUrl)), (0, import_url2.fileURLToPath)(base));
}
function throwExportsNotFound(subpath, packageJsonUrl, base) {
  throw new ERR_PACKAGE_PATH_NOT_EXPORTED((0, import_url2.fileURLToPath)(new import_url2.URL(".", packageJsonUrl)), subpath, base && (0, import_url2.fileURLToPath)(base));
}
function throwInvalidSubpath(subpath, packageJsonUrl, internal, base) {
  const reason = `request is not a valid subpath for the "${internal ? "imports" : "exports"}" resolution of ${(0, import_url2.fileURLToPath)(packageJsonUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(subpath, reason, base && (0, import_url2.fileURLToPath)(base));
}
function throwInvalidPackageTarget(subpath, target, packageJsonUrl, internal, base) {
  target = typeof target === "object" && target !== null ? JSON.stringify(target, null, "") : `${target}`;
  throw new ERR_INVALID_PACKAGE_TARGET((0, import_url2.fileURLToPath)(new import_url2.URL(".", packageJsonUrl)), subpath, target, internal, base && (0, import_url2.fileURLToPath)(base));
}
function resolvePackageTargetString(target, subpath, match, packageJsonUrl, base, pattern, internal, conditions) {
  if (subpath !== "" && !pattern && target[target.length - 1] !== "/")
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (!target.startsWith("./")) {
    if (internal && !target.startsWith("../") && !target.startsWith("/")) {
      let isURL = false;
      try {
        new import_url2.URL(target);
        isURL = true;
      } catch {
      }
      if (!isURL) {
        const exportTarget = pattern ? target.replace(patternRegEx, subpath) : target + subpath;
        return packageResolve(exportTarget, packageJsonUrl, conditions);
      }
    }
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  }
  if (invalidSegmentRegEx.test(target.slice(2)))
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  const resolved = new import_url2.URL(target, packageJsonUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new import_url2.URL(".", packageJsonUrl).pathname;
  if (!resolvedPath.startsWith(packagePath))
    throwInvalidPackageTarget(match, target, packageJsonUrl, internal, base);
  if (subpath === "")
    return resolved;
  if (invalidSegmentRegEx.test(subpath))
    throwInvalidSubpath(match + subpath, packageJsonUrl, internal, base);
  if (pattern)
    return new import_url2.URL(resolved.href.replace(patternRegEx, subpath));
  return new import_url2.URL(subpath, resolved);
}
function isArrayIndex(key) {
  const keyNumber = Number(key);
  if (`${keyNumber}` !== key)
    return false;
  return keyNumber >= 0 && keyNumber < 4294967295;
}
function resolvePackageTarget(packageJsonUrl, target, subpath, packageSubpath, base, pattern, internal, conditions) {
  if (typeof target === "string") {
    return resolvePackageTargetString(target, subpath, packageSubpath, packageJsonUrl, base, pattern, internal, conditions);
  }
  if (Array.isArray(target)) {
    const targetList = target;
    if (targetList.length === 0)
      return null;
    let lastException;
    let i = -1;
    while (++i < targetList.length) {
      const targetItem = targetList[i];
      let resolved;
      try {
        resolved = resolvePackageTarget(packageJsonUrl, targetItem, subpath, packageSubpath, base, pattern, internal, conditions);
      } catch (error) {
        lastException = error;
        if (error.code === "ERR_INVALID_PACKAGE_TARGET")
          continue;
        throw error;
      }
      if (resolved === void 0)
        continue;
      if (resolved === null) {
        lastException = null;
        continue;
      }
      return resolved;
    }
    if (lastException === void 0 || lastException === null) {
      return lastException;
    }
    throw lastException;
  }
  if (typeof target === "object" && target !== null) {
    const keys = Object.getOwnPropertyNames(target);
    let i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG((0, import_url2.fileURLToPath)(packageJsonUrl), base, '"exports" cannot contain numeric property keys.');
      }
    }
    i = -1;
    while (++i < keys.length) {
      const key = keys[i];
      if (key === "default" || conditions && conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolved = resolvePackageTarget(packageJsonUrl, conditionalTarget, subpath, packageSubpath, base, pattern, internal, conditions);
        if (resolved === void 0)
          continue;
        return resolved;
      }
    }
    return void 0;
  }
  if (target === null) {
    return null;
  }
  throwInvalidPackageTarget(packageSubpath, target, packageJsonUrl, internal, base);
}
function isConditionalExportsMainSugar(exports, packageJsonUrl, base) {
  if (typeof exports === "string" || Array.isArray(exports))
    return true;
  if (typeof exports !== "object" || exports === null)
    return false;
  const keys = Object.getOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  let j = -1;
  while (++j < keys.length) {
    const key = keys[j];
    const curIsConditionalSugar = key === "" || key[0] !== ".";
    if (i++ === 0) {
      isConditionalSugar = curIsConditionalSugar;
    } else if (isConditionalSugar !== curIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG((0, import_url2.fileURLToPath)(packageJsonUrl), base, `"exports" cannot contain some keys starting with '.' and some not. The exports object must either be an object of package subpath keys or an object of main entry condition name keys only.`);
    }
  }
  return isConditionalSugar;
}
function packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJsonUrl, base))
    exports = { ".": exports };
  if (own2.call(exports, packageSubpath)) {
    const target = exports[packageSubpath];
    const resolved = resolvePackageTarget(packageJsonUrl, target, "", packageSubpath, base, false, false, conditions);
    if (resolved === null || resolved === void 0)
      throwExportsNotFound(packageSubpath, packageJsonUrl, base);
    return { resolved, exact: true };
  }
  let bestMatch = "";
  const keys = Object.getOwnPropertyNames(exports);
  let i = -1;
  while (++i < keys.length) {
    const key = keys[i];
    if (key[key.length - 1] === "*" && packageSubpath.startsWith(key.slice(0, -1)) && packageSubpath.length >= key.length && key.length > bestMatch.length) {
      bestMatch = key;
    } else if (key[key.length - 1] === "/" && packageSubpath.startsWith(key) && key.length > bestMatch.length) {
      bestMatch = key;
    }
  }
  if (bestMatch) {
    const target = exports[bestMatch];
    const pattern = bestMatch[bestMatch.length - 1] === "*";
    const subpath = packageSubpath.slice(bestMatch.length - (pattern ? 1 : 0));
    const resolved = resolvePackageTarget(packageJsonUrl, target, subpath, bestMatch, base, pattern, false, conditions);
    if (resolved === null || resolved === void 0)
      throwExportsNotFound(packageSubpath, packageJsonUrl, base);
    if (!pattern)
      emitFolderMapDeprecation(bestMatch, packageJsonUrl, true, base);
    return { resolved, exact: pattern };
  }
  throwExportsNotFound(packageSubpath, packageJsonUrl, base);
}
function packageImportsResolve(name, base, conditions) {
  if (name === "#" || name.startsWith("#/")) {
    const reason = "is not a valid internal imports specifier name";
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, (0, import_url2.fileURLToPath)(base));
  }
  let packageJsonUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJsonUrl = (0, import_url2.pathToFileURL)(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (own2.call(imports, name)) {
        const resolved = resolvePackageTarget(packageJsonUrl, imports[name], "", name, base, false, true, conditions);
        if (resolved !== null)
          return { resolved, exact: true };
      } else {
        let bestMatch = "";
        const keys = Object.getOwnPropertyNames(imports);
        let i = -1;
        while (++i < keys.length) {
          const key = keys[i];
          if (key[key.length - 1] === "*" && name.startsWith(key.slice(0, -1)) && name.length >= key.length && key.length > bestMatch.length) {
            bestMatch = key;
          } else if (key[key.length - 1] === "/" && name.startsWith(key) && key.length > bestMatch.length) {
            bestMatch = key;
          }
        }
        if (bestMatch) {
          const target = imports[bestMatch];
          const pattern = bestMatch[bestMatch.length - 1] === "*";
          const subpath = name.slice(bestMatch.length - (pattern ? 1 : 0));
          const resolved = resolvePackageTarget(packageJsonUrl, target, subpath, bestMatch, base, pattern, true, conditions);
          if (resolved !== null) {
            if (!pattern)
              emitFolderMapDeprecation(bestMatch, packageJsonUrl, false, base);
            return { resolved, exact: pattern };
          }
        }
      }
    }
  }
  throwImportNotDefined(name, packageJsonUrl, base);
}
function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url);
  return packageConfig.type;
}
function parsePackageName(specifier, base) {
  let separatorIndex = specifier.indexOf("/");
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === "@") {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = specifier.indexOf("/", separatorIndex + 1);
    }
  }
  const packageName = separatorIndex === -1 ? specifier : specifier.slice(0, separatorIndex);
  let i = -1;
  while (++i < packageName.length) {
    if (packageName[i] === "%" || packageName[i] === "\\") {
      validPackageName = false;
      break;
    }
  }
  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(specifier, "is not a valid package name", (0, import_url2.fileURLToPath)(base));
  }
  const packageSubpath = "." + (separatorIndex === -1 ? "" : specifier.slice(separatorIndex));
  return { packageName, packageSubpath, isScoped };
}
function packageResolve(specifier, base, conditions) {
  const { packageName, packageSubpath, isScoped } = parsePackageName(specifier, base);
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    const packageJsonUrl2 = (0, import_url2.pathToFileURL)(packageConfig.pjsonPath);
    if (packageConfig.name === packageName && packageConfig.exports !== void 0 && packageConfig.exports !== null) {
      return packageExportsResolve(packageJsonUrl2, packageSubpath, packageConfig, base, conditions).resolved;
    }
  }
  let packageJsonUrl = new import_url2.URL("./node_modules/" + packageName + "/package.json", base);
  let packageJsonPath = (0, import_url2.fileURLToPath)(packageJsonUrl);
  let lastPath;
  do {
    const stat = tryStatSync(packageJsonPath.slice(0, -13));
    if (!stat.isDirectory()) {
      lastPath = packageJsonPath;
      packageJsonUrl = new import_url2.URL((isScoped ? "../../../../node_modules/" : "../../../node_modules/") + packageName + "/package.json", packageJsonUrl);
      packageJsonPath = (0, import_url2.fileURLToPath)(packageJsonUrl);
      continue;
    }
    const packageConfig2 = getPackageConfig(packageJsonPath, specifier, base);
    if (packageConfig2.exports !== void 0 && packageConfig2.exports !== null)
      return packageExportsResolve(packageJsonUrl, packageSubpath, packageConfig2, base, conditions).resolved;
    if (packageSubpath === ".")
      return legacyMainResolve(packageJsonUrl, packageConfig2, base);
    return new import_url2.URL(packageSubpath, packageJsonUrl);
  } while (packageJsonPath.length !== lastPath.length);
  throw new ERR_MODULE_NOT_FOUND(packageName, (0, import_url2.fileURLToPath)(base));
}
function isRelativeSpecifier(specifier) {
  if (specifier[0] === ".") {
    if (specifier.length === 1 || specifier[1] === "/")
      return true;
    if (specifier[1] === "." && (specifier.length === 2 || specifier[2] === "/")) {
      return true;
    }
  }
  return false;
}
function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === "")
    return false;
  if (specifier[0] === "/")
    return true;
  return isRelativeSpecifier(specifier);
}
function moduleResolve(specifier, base, conditions) {
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    resolved = new import_url2.URL(specifier, base);
  } else if (specifier[0] === "#") {
    ;
    ({ resolved } = packageImportsResolve(specifier, base, conditions));
  } else {
    try {
      resolved = new import_url2.URL(specifier);
    } catch {
      resolved = packageResolve(specifier, base, conditions);
    }
  }
  return finalizeResolution(resolved, base);
}
function defaultResolve(specifier, context = {}) {
  const { parentURL } = context;
  let parsed;
  try {
    parsed = new import_url2.URL(specifier);
    if (parsed.protocol === "data:") {
      return { url: specifier };
    }
  } catch {
  }
  if (parsed && parsed.protocol === "node:")
    return { url: specifier };
  if (parsed && parsed.protocol !== "file:" && parsed.protocol !== "data:")
    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(parsed);
  if (listOfBuiltins.includes(specifier)) {
    return { url: "node:" + specifier };
  }
  if (parentURL.startsWith("data:")) {
    new import_url2.URL(specifier, parentURL);
  }
  const conditions = getConditionsSet(context.conditions);
  let url = moduleResolve(specifier, new import_url2.URL(parentURL), conditions);
  const urlPath = (0, import_url2.fileURLToPath)(url);
  const real = (0, import_fs2.realpathSync)(urlPath);
  const old = url;
  url = (0, import_url2.pathToFileURL)(real + (urlPath.endsWith(import_path3.default.sep) ? "/" : ""));
  url.search = old.search;
  url.hash = old.hash;
  return { url: `${url}` };
}
module.exports = __toCommonJS(resolve_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultResolve,
  getPackageType,
  moduleResolve
});
