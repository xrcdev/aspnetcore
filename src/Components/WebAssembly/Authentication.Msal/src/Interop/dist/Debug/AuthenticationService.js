/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./AuthenticationService.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./AuthenticationService.ts":
/*!**********************************!*\
  !*** ./AuthenticationService.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Msal = __importStar(__webpack_require__(/*! msal */ "./node_modules/msal/lib-es6/index.js"));
const ClientAuthError_1 = __webpack_require__(/*! msal/lib-commonjs/error/ClientAuthError */ "./node_modules/msal/lib-commonjs/error/ClientAuthError.js");
var AccessTokenResultStatus;
(function (AccessTokenResultStatus) {
    AccessTokenResultStatus["Success"] = "success";
    AccessTokenResultStatus["RequiresRedirect"] = "requiresRedirect";
})(AccessTokenResultStatus || (AccessTokenResultStatus = {}));
var AuthenticationResultStatus;
(function (AuthenticationResultStatus) {
    AuthenticationResultStatus["Redirect"] = "redirect";
    AuthenticationResultStatus["Success"] = "success";
    AuthenticationResultStatus["Failure"] = "failure";
    AuthenticationResultStatus["OperationCompleted"] = "operationCompleted";
})(AuthenticationResultStatus || (AuthenticationResultStatus = {}));
class MsalAuthorizeService {
    constructor(_settings) {
        this._settings = _settings;
        // It is important that we capture the callback-url here as msal will remove the auth parameters
        // from the url as soon as it gets initialized.
        const callbackUrl = location.href;
        this._msalApplication = new Msal.UserAgentApplication(this._settings);
        // This promise will only resolve in callback-paths, which is where we check it.
        this._callbackPromise = this.createCallbackResult(callbackUrl);
    }
    async getUser() {
        var _a;
        const account = this._msalApplication.getAccount();
        return (_a = account) === null || _a === void 0 ? void 0 : _a.idTokenClaims;
    }
    async getAccessToken(request) {
        var _a;
        try {
            const newToken = await this.getTokenCore((_a = request) === null || _a === void 0 ? void 0 : _a.scopes);
            return {
                status: AccessTokenResultStatus.Success,
                token: newToken
            };
        }
        catch (e) {
            return {
                status: AccessTokenResultStatus.RequiresRedirect
            };
        }
    }
    async getTokenCore(scopes) {
        const tokenScopes = {
            redirectUri: this._settings.auth.redirectUri,
            scopes: scopes || this._settings.defaultAccessTokenScopes
        };
        const response = await this._msalApplication.acquireTokenSilent(tokenScopes);
        return {
            value: response.accessToken,
            grantedScopes: response.scopes,
            expires: response.expiresOn
        };
    }
    async signIn(state) {
        var _a;
        try {
            // Before we start any sign-in flow, clear out any previous state so that it doesn't pile up.
            this.purgeState();
            const request = {
                redirectUri: this._settings.auth.redirectUri,
                state: await this.saveState(state)
            };
            if (this._settings.defaultAccessTokenScopes && this._settings.defaultAccessTokenScopes.length > 0) {
                request.scopes = this._settings.defaultAccessTokenScopes;
            }
            if (this._settings.additionalScopesToConsent && this._settings.additionalScopesToConsent.length > 0) {
                request.extraScopesToConsent = this._settings.additionalScopesToConsent;
            }
            const result = await this.signInCore(request);
            if (!result) {
                return this.redirect();
            }
            else if (this.isMsalError(result)) {
                return this.error(result.errorMessage);
            }
            try {
                if (((_a = this._settings.defaultAccessTokenScopes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    // This provisions the token as part of the sign-in flow eagerly so that is already in the cache
                    // when the app asks for it.
                    await this._msalApplication.acquireTokenSilent(request);
                }
            }
            catch (e) {
                return this.error(e.errorMessage);
            }
            return this.success(state);
        }
        catch (e) {
            return this.error(e.message);
        }
    }
    async signInCore(request) {
        try {
            return await this._msalApplication.loginPopup(request);
        }
        catch (e) {
            // If the user explicitly cancelled the pop-up, avoid performing a redirect.
            if (this.isMsalError(e) && e.errorCode !== ClientAuthError_1.ClientAuthErrorMessage.userCancelledError.code) {
                try {
                    this._msalApplication.loginRedirect(request);
                }
                catch (e) {
                    return e;
                }
            }
            else {
                return e;
            }
        }
    }
    completeSignIn() {
        return this._callbackPromise;
    }
    async signOut(state) {
        // We are about to sign out, so clear any state before we do so and leave just the sign out state for
        // the current sign out flow.
        this.purgeState();
        const logoutStateId = await this.saveState(state);
        // msal.js doesn't support providing logout state, so we shim it by putting the identifier in session storage
        // and using that on the logout callback to workout the problems.
        sessionStorage.setItem(`${AuthenticationService._infrastructureKey}.LogoutState`, logoutStateId);
        this._msalApplication.logout();
        // We are about to be redirected.
        return this.redirect();
    }
    async completeSignOut(url) {
        const logoutStateId = sessionStorage.getItem(`${AuthenticationService._infrastructureKey}.LogoutState`);
        const updatedUrl = new URL(url);
        updatedUrl.search = `?state=${logoutStateId}`;
        const logoutState = await this.retrieveState(updatedUrl.href, /*isLogout*/ true);
        sessionStorage.removeItem(`${AuthenticationService._infrastructureKey}.LogoutState`);
        if (logoutState) {
            return this.success(logoutState);
        }
        else {
            return this.operationCompleted();
        }
    }
    // msal.js only allows a string as the account state and it simply attaches it to the sign-in request state.
    // Given that we don't want to serialize the entire state and put it in the query string, we need to serialize the
    // state ourselves and pass an identifier to retrieve it while in the callback flow.
    async saveState(state) {
        const base64UrlIdentifier = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = evt => {
                var _a, _b;
                return resolve(((_b = (_a = evt) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.result)
                    // The result comes back as a base64 string inside a dataUrl.
                    // We remove the prefix and convert it to base64url by replacing '+' with '-', '/' with '_' and removing '='.
                    .split(',')[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));
            };
            reader.onerror = evt => { var _a, _b; return reject((_b = (_a = evt.target) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message); };
            // We generate a base 64 url encoded string of random data.
            const entropy = window.crypto.getRandomValues(new Uint8Array(32));
            reader.readAsDataURL(new Blob([entropy]));
        });
        sessionStorage.setItem(`${AuthenticationService._infrastructureKey}.AuthorizeService.${base64UrlIdentifier}`, JSON.stringify(state));
        return base64UrlIdentifier;
    }
    async retrieveState(url, isLogout = false) {
        const parsedUrl = new URL(url);
        const fromHash = parsedUrl.hash && parsedUrl.hash.length > 0 && new URLSearchParams(parsedUrl.hash.substring(1));
        let state = fromHash && fromHash.getAll('state');
        if (state && state.length > 1) {
            return undefined;
        }
        else if (!state || state.length == 0) {
            state = parsedUrl.searchParams && parsedUrl.searchParams.getAll('state');
            if (!state || state.length !== 1) {
                return undefined;
            }
        }
        // We need to calculate the state key in two different ways. The reason for it is that
        // msal.js doesn't support the state parameter on logout flows, which forces us to shim our own logout state.
        // The format then is different, as msal follows the pattern state=<<guid>>|<<user_state>> and our format
        // simple uses <<base64urlIdentifier>>.
        const appState = !isLogout ? this._msalApplication.getAccountState(state[0]) : state[0];
        const stateKey = `${AuthenticationService._infrastructureKey}.AuthorizeService.${appState}`;
        const stateString = sessionStorage.getItem(stateKey);
        if (stateString) {
            sessionStorage.removeItem(stateKey);
            const savedState = JSON.parse(stateString);
            return savedState;
        }
        return undefined;
    }
    purgeState() {
        var _a;
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if ((_a = key) === null || _a === void 0 ? void 0 : _a.startsWith(AuthenticationService._infrastructureKey)) {
                sessionStorage.removeItem(key);
            }
        }
    }
    async createCallbackResult(callbackUrl) {
        // msal.js requires a callback to be registered during app initialization to handle redirect flows.
        // To map that behavior to our API we register a callback early and store the result of that callback
        // as a promise on an instance field to be able to serve the state back to the main app.
        const promiseFactory = (resolve, reject) => {
            this._msalApplication.handleRedirectCallback(authenticationResponse => {
                resolve(authenticationResponse);
            }, authenticationError => {
                reject(authenticationError);
            });
        };
        try {
            // Evaluate the promise to capture any authentication errors
            await new Promise(promiseFactory);
            // See https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/FAQs#q6-how-to-avoid-page-reloads-when-acquiring-and-renewing-tokens-silently
            if (window !== window.parent && !window.opener) {
                return this.operationCompleted();
            }
            else {
                const state = await this.retrieveState(callbackUrl);
                return this.success(state);
            }
        }
        catch (e) {
            if (this.isMsalError(e)) {
                return this.error(e.errorMessage);
            }
            else {
                return this.error(e);
            }
        }
    }
    isMsalError(resultOrError) {
        var _a;
        return (_a = resultOrError) === null || _a === void 0 ? void 0 : _a.errorCode;
    }
    error(message) {
        return { status: AuthenticationResultStatus.Failure, errorMessage: message };
    }
    success(state) {
        return { status: AuthenticationResultStatus.Success, state };
    }
    redirect() {
        return { status: AuthenticationResultStatus.Redirect };
    }
    operationCompleted() {
        return { status: AuthenticationResultStatus.OperationCompleted };
    }
}
class AuthenticationService {
    static async init(settings) {
        if (!AuthenticationService._initialized) {
            AuthenticationService._initialized = true;
            AuthenticationService.instance = new MsalAuthorizeService(settings);
        }
    }
    static getUser() {
        return AuthenticationService.instance.getUser();
    }
    static getAccessToken(request) {
        return AuthenticationService.instance.getAccessToken(request);
    }
    static signIn(state) {
        return AuthenticationService.instance.signIn(state);
    }
    // url is not used in the msal.js implementation but we keep it here
    // as it is part of the default RemoteAuthenticationService contract implementation.
    // The unused parameter here just reflects that.
    static completeSignIn(url) {
        return AuthenticationService.instance.completeSignIn();
    }
    static signOut(state) {
        return AuthenticationService.instance.signOut(state);
    }
    static completeSignOut(url) {
        return AuthenticationService.instance.completeSignOut(url);
    }
}
exports.AuthenticationService = AuthenticationService;
AuthenticationService._infrastructureKey = 'Microsoft.Authentication.WebAssembly.Msal';
AuthenticationService._initialized = false;
window.AuthenticationService = AuthenticationService;


/***/ }),

/***/ "./node_modules/msal/lib-commonjs/error/AuthError.js":
/*!***********************************************************!*\
  !*** ./node_modules/msal/lib-commonjs/error/AuthError.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
exports.AuthErrorMessage = {
    unexpectedError: {
        code: "unexpected_error",
        desc: "Unexpected error in authentication."
    },
    noWindowObjectError: {
        code: "no_window_object",
        desc: "No window object available. Details:"
    }
};
/**
 * General error class thrown by the MSAL.js library.
 */
var AuthError = /** @class */ (function (_super) {
    tslib_1.__extends(AuthError, _super);
    function AuthError(errorCode, errorMessage) {
        var _this = _super.call(this, errorMessage) || this;
        Object.setPrototypeOf(_this, AuthError.prototype);
        _this.errorCode = errorCode;
        _this.errorMessage = errorMessage;
        _this.name = "AuthError";
        return _this;
    }
    AuthError.createUnexpectedError = function (errDesc) {
        return new AuthError(exports.AuthErrorMessage.unexpectedError.code, exports.AuthErrorMessage.unexpectedError.desc + ": " + errDesc);
    };
    AuthError.createNoWindowObjectError = function (errDesc) {
        return new AuthError(exports.AuthErrorMessage.noWindowObjectError.code, exports.AuthErrorMessage.noWindowObjectError.desc + " " + errDesc);
    };
    return AuthError;
}(Error));
exports.AuthError = AuthError;
//# sourceMappingURL=AuthError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-commonjs/error/ClientAuthError.js":
/*!*****************************************************************!*\
  !*** ./node_modules/msal/lib-commonjs/error/ClientAuthError.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
var AuthError_1 = __webpack_require__(/*! ./AuthError */ "./node_modules/msal/lib-commonjs/error/AuthError.js");
var StringUtils_1 = __webpack_require__(/*! ../utils/StringUtils */ "./node_modules/msal/lib-commonjs/utils/StringUtils.js");
exports.ClientAuthErrorMessage = {
    multipleMatchingTokens: {
        code: "multiple_matching_tokens",
        desc: "The cache contains multiple tokens satisfying the requirements. " +
            "Call AcquireToken again providing more requirements like authority."
    },
    multipleCacheAuthorities: {
        code: "multiple_authorities",
        desc: "Multiple authorities found in the cache. Pass authority in the API overload."
    },
    endpointResolutionError: {
        code: "endpoints_resolution_error",
        desc: "Error: could not resolve endpoints. Please check network and try again."
    },
    popUpWindowError: {
        code: "popup_window_error",
        desc: "Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser."
    },
    tokenRenewalError: {
        code: "token_renewal_error",
        desc: "Token renewal operation failed due to timeout."
    },
    invalidIdToken: {
        code: "invalid_id_token",
        desc: "Invalid ID token format."
    },
    invalidStateError: {
        code: "invalid_state_error",
        desc: "Invalid state."
    },
    nonceMismatchError: {
        code: "nonce_mismatch_error",
        desc: "Nonce is not matching, Nonce received: "
    },
    loginProgressError: {
        code: "login_progress_error",
        desc: "Login_In_Progress: Error during login call - login is already in progress."
    },
    acquireTokenProgressError: {
        code: "acquiretoken_progress_error",
        desc: "AcquireToken_In_Progress: Error during login call - login is already in progress."
    },
    userCancelledError: {
        code: "user_cancelled",
        desc: "User cancelled the flow."
    },
    callbackError: {
        code: "callback_error",
        desc: "Error occurred in token received callback function."
    },
    userLoginRequiredError: {
        code: "user_login_error",
        desc: "User login is required."
    },
    userDoesNotExistError: {
        code: "user_non_existent",
        desc: "User object does not exist. Please call a login API."
    },
    clientInfoDecodingError: {
        code: "client_info_decoding_error",
        desc: "The client info could not be parsed/decoded correctly. Please review the trace to determine the root cause."
    },
    clientInfoNotPopulatedError: {
        code: "client_info_not_populated_error",
        desc: "The service did not populate client_info in the response, Please verify with the service team"
    },
    nullOrEmptyIdToken: {
        code: "null_or_empty_id_token",
        desc: "The idToken is null or empty. Please review the trace to determine the root cause."
    },
    idTokenNotParsed: {
        code: "id_token_parsing_error",
        desc: "ID token cannot be parsed. Please review stack trace to determine root cause."
    },
    tokenEncodingError: {
        code: "token_encoding_error",
        desc: "The token to be decoded is not encoded correctly."
    },
    invalidInteractionType: {
        code: "invalid_interaction_type",
        desc: "The interaction type passed to the handler was incorrect or unknown"
    },
    cacheParseError: {
        code: "cannot_parse_cache",
        desc: "The cached token key is not a valid JSON and cannot be parsed"
    },
    blockTokenRequestsInHiddenIframe: {
        code: "block_token_requests",
        desc: "Token calls are blocked in hidden iframes"
    }
};
/**
 * Error thrown when there is an error in the client code running on the browser.
 */
var ClientAuthError = /** @class */ (function (_super) {
    tslib_1.__extends(ClientAuthError, _super);
    function ClientAuthError(errorCode, errorMessage) {
        var _this = _super.call(this, errorCode, errorMessage) || this;
        _this.name = "ClientAuthError";
        Object.setPrototypeOf(_this, ClientAuthError.prototype);
        return _this;
    }
    ClientAuthError.createEndpointResolutionError = function (errDetail) {
        var errorMessage = exports.ClientAuthErrorMessage.endpointResolutionError.desc;
        if (errDetail && !StringUtils_1.StringUtils.isEmpty(errDetail)) {
            errorMessage += " Details: " + errDetail;
        }
        return new ClientAuthError(exports.ClientAuthErrorMessage.endpointResolutionError.code, errorMessage);
    };
    ClientAuthError.createMultipleMatchingTokensInCacheError = function (scope) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.multipleMatchingTokens.code, "Cache error for scope " + scope + ": " + exports.ClientAuthErrorMessage.multipleMatchingTokens.desc + ".");
    };
    ClientAuthError.createMultipleAuthoritiesInCacheError = function (scope) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.multipleCacheAuthorities.code, "Cache error for scope " + scope + ": " + exports.ClientAuthErrorMessage.multipleCacheAuthorities.desc + ".");
    };
    ClientAuthError.createPopupWindowError = function (errDetail) {
        var errorMessage = exports.ClientAuthErrorMessage.popUpWindowError.desc;
        if (errDetail && !StringUtils_1.StringUtils.isEmpty(errDetail)) {
            errorMessage += " Details: " + errDetail;
        }
        return new ClientAuthError(exports.ClientAuthErrorMessage.popUpWindowError.code, errorMessage);
    };
    ClientAuthError.createTokenRenewalTimeoutError = function (urlNavigate) {
        var errorMessage = "URL navigated to is " + urlNavigate + ", " + exports.ClientAuthErrorMessage.tokenRenewalError.desc;
        return new ClientAuthError(exports.ClientAuthErrorMessage.tokenRenewalError.code, errorMessage);
    };
    ClientAuthError.createInvalidIdTokenError = function (idToken) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.invalidIdToken.code, exports.ClientAuthErrorMessage.invalidIdToken.desc + " Given token: " + idToken);
    };
    // TODO: Is this not a security flaw to send the user the state expected??
    ClientAuthError.createInvalidStateError = function (invalidState, actualState) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.invalidStateError.code, exports.ClientAuthErrorMessage.invalidStateError.desc + " " + invalidState + ", state expected : " + actualState + ".");
    };
    // TODO: Is this not a security flaw to send the user the Nonce expected??
    ClientAuthError.createNonceMismatchError = function (invalidNonce, actualNonce) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.nonceMismatchError.code, exports.ClientAuthErrorMessage.nonceMismatchError.desc + " " + invalidNonce + ", nonce expected : " + actualNonce + ".");
    };
    ClientAuthError.createLoginInProgressError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.loginProgressError.code, exports.ClientAuthErrorMessage.loginProgressError.desc);
    };
    ClientAuthError.createAcquireTokenInProgressError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.acquireTokenProgressError.code, exports.ClientAuthErrorMessage.acquireTokenProgressError.desc);
    };
    ClientAuthError.createUserCancelledError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.userCancelledError.code, exports.ClientAuthErrorMessage.userCancelledError.desc);
    };
    ClientAuthError.createErrorInCallbackFunction = function (errorDesc) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.callbackError.code, exports.ClientAuthErrorMessage.callbackError.desc + " " + errorDesc + ".");
    };
    ClientAuthError.createUserLoginRequiredError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.userLoginRequiredError.code, exports.ClientAuthErrorMessage.userLoginRequiredError.desc);
    };
    ClientAuthError.createUserDoesNotExistError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.userDoesNotExistError.code, exports.ClientAuthErrorMessage.userDoesNotExistError.desc);
    };
    ClientAuthError.createClientInfoDecodingError = function (caughtError) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.clientInfoDecodingError.code, exports.ClientAuthErrorMessage.clientInfoDecodingError.desc + " Failed with error: " + caughtError);
    };
    ClientAuthError.createClientInfoNotPopulatedError = function (caughtError) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.clientInfoNotPopulatedError.code, exports.ClientAuthErrorMessage.clientInfoNotPopulatedError.desc + " Failed with error: " + caughtError);
    };
    ClientAuthError.createIdTokenNullOrEmptyError = function (invalidRawTokenString) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.nullOrEmptyIdToken.code, exports.ClientAuthErrorMessage.nullOrEmptyIdToken.desc + " Raw ID Token Value: " + invalidRawTokenString);
    };
    ClientAuthError.createIdTokenParsingError = function (caughtParsingError) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.idTokenNotParsed.code, exports.ClientAuthErrorMessage.idTokenNotParsed.desc + " Failed with error: " + caughtParsingError);
    };
    ClientAuthError.createTokenEncodingError = function (incorrectlyEncodedToken) {
        return new ClientAuthError(exports.ClientAuthErrorMessage.tokenEncodingError.code, exports.ClientAuthErrorMessage.tokenEncodingError.desc + " Attempted to decode: " + incorrectlyEncodedToken);
    };
    ClientAuthError.createInvalidInteractionTypeError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.invalidInteractionType.code, exports.ClientAuthErrorMessage.invalidInteractionType.desc);
    };
    ClientAuthError.createCacheParseError = function (key) {
        var errorMessage = "invalid key: " + key + ", " + exports.ClientAuthErrorMessage.cacheParseError.desc;
        return new ClientAuthError(exports.ClientAuthErrorMessage.cacheParseError.code, errorMessage);
    };
    ClientAuthError.createBlockTokenRequestsInHiddenIframeError = function () {
        return new ClientAuthError(exports.ClientAuthErrorMessage.blockTokenRequestsInHiddenIframe.code, exports.ClientAuthErrorMessage.blockTokenRequestsInHiddenIframe.desc);
    };
    return ClientAuthError;
}(AuthError_1.AuthError));
exports.ClientAuthError = ClientAuthError;
//# sourceMappingURL=ClientAuthError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-commonjs/utils/StringUtils.js":
/*!*************************************************************!*\
  !*** ./node_modules/msal/lib-commonjs/utils/StringUtils.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    /**
     * Check if a string is empty
     *
     * @param str
     */
    StringUtils.isEmpty = function (str) {
        return (typeof str === "undefined" || !str || 0 === str.length);
    };
    return StringUtils;
}());
exports.StringUtils = StringUtils;
//# sourceMappingURL=StringUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/Account.js":
/*!**********************************************!*\
  !*** ./node_modules/msal/lib-es6/Account.js ***!
  \**********************************************/
/*! exports provided: Account */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Account", function() { return Account; });
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


/**
 * accountIdentifier       combination of idToken.uid and idToken.utid
 * homeAccountIdentifier   combination of clientInfo.uid and clientInfo.utid
 * userName                idToken.preferred_username
 * name                    idToken.name
 * idToken                 idToken
 * sid                     idToken.sid - session identifier
 * environment             idtoken.issuer (the authority that issues the token)
 */
var Account = /** @class */ (function () {
    /**
     * Creates an Account Object
     * @praram accountIdentifier
     * @param homeAccountIdentifier
     * @param userName
     * @param name
     * @param idToken
     * @param sid
     * @param environment
     */
    function Account(accountIdentifier, homeAccountIdentifier, userName, name, idTokenClaims, sid, environment) {
        this.accountIdentifier = accountIdentifier;
        this.homeAccountIdentifier = homeAccountIdentifier;
        this.userName = userName;
        this.name = name;
        // will be deprecated soon
        this.idToken = idTokenClaims;
        this.idTokenClaims = idTokenClaims;
        this.sid = sid;
        this.environment = environment;
    }
    /**
     * @hidden
     * @param idToken
     * @param clientInfo
     */
    Account.createAccount = function (idToken, clientInfo) {
        // create accountIdentifier
        var accountIdentifier = idToken.objectId || idToken.subject;
        // create homeAccountIdentifier
        var uid = clientInfo ? clientInfo.uid : "";
        var utid = clientInfo ? clientInfo.utid : "";
        var homeAccountIdentifier;
        if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_1__["StringUtils"].isEmpty(uid) && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_1__["StringUtils"].isEmpty(utid)) {
            homeAccountIdentifier = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Encode(uid) + "." + _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Encode(utid);
        }
        return new Account(accountIdentifier, homeAccountIdentifier, idToken.preferredName, idToken.name, idToken.claims, idToken.sid, idToken.issuer);
    };
    /**
     * Utils function to compare two Account objects - used to check if the same user account is logged in
     *
     * @param a1: Account object
     * @param a2: Account object
     */
    Account.compareAccounts = function (a1, a2) {
        if (!a1 || !a2) {
            return false;
        }
        if (a1.homeAccountIdentifier && a2.homeAccountIdentifier) {
            if (a1.homeAccountIdentifier === a2.homeAccountIdentifier) {
                return true;
            }
        }
        return false;
    };
    return Account;
}());

//# sourceMappingURL=Account.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/AuthResponse.js":
/*!***************************************************!*\
  !*** ./node_modules/msal/lib-es6/AuthResponse.js ***!
  \***************************************************/
/*! exports provided: buildResponseStateOnly */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildResponseStateOnly", function() { return buildResponseStateOnly; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function buildResponseStateOnly(state) {
    return {
        uniqueId: "",
        tenantId: "",
        tokenType: "",
        idToken: null,
        idTokenClaims: null,
        accessToken: "",
        scopes: null,
        expiresOn: null,
        account: null,
        accountState: state,
        fromCache: false
    };
}
//# sourceMappingURL=AuthResponse.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/ClientInfo.js":
/*!*************************************************!*\
  !*** ./node_modules/msal/lib-es6/ClientInfo.js ***!
  \*************************************************/
/*! exports provided: ClientInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientInfo", function() { return ClientInfo; });
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */



/**
 * @hidden
 */
var ClientInfo = /** @class */ (function () {
    function ClientInfo(rawClientInfo) {
        if (!rawClientInfo || _utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(rawClientInfo)) {
            this.uid = "";
            this.utid = "";
            return;
        }
        try {
            var decodedClientInfo = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Decode(rawClientInfo);
            var clientInfo = JSON.parse(decodedClientInfo);
            if (clientInfo) {
                if (clientInfo.hasOwnProperty("uid")) {
                    this.uid = clientInfo.uid;
                }
                if (clientInfo.hasOwnProperty("utid")) {
                    this.utid = clientInfo.utid;
                }
            }
        }
        catch (e) {
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_1__["ClientAuthError"].createClientInfoDecodingError(e);
        }
    }
    Object.defineProperty(ClientInfo.prototype, "uid", {
        get: function () {
            return this._uid ? this._uid : "";
        },
        set: function (uid) {
            this._uid = uid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClientInfo.prototype, "utid", {
        get: function () {
            return this._utid ? this._utid : "";
        },
        set: function (utid) {
            this._utid = utid;
        },
        enumerable: true,
        configurable: true
    });
    return ClientInfo;
}());

//# sourceMappingURL=ClientInfo.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/Configuration.js":
/*!****************************************************!*\
  !*** ./node_modules/msal/lib-es6/Configuration.js ***!
  \****************************************************/
/*! exports provided: buildConfiguration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildConfiguration", function() { return buildConfiguration; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logger */ "./node_modules/msal/lib-es6/Logger.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */



/**
 * Defaults for the Configuration Options
 */
var FRAME_TIMEOUT = 6000;
var OFFSET = 300;
var NAVIGATE_FRAME_WAIT = 500;
var DEFAULT_AUTH_OPTIONS = {
    clientId: "",
    authority: null,
    validateAuthority: true,
    redirectUri: function () { return _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_2__["UrlUtils"].getDefaultRedirectUri(); },
    postLogoutRedirectUri: function () { return _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_2__["UrlUtils"].getDefaultRedirectUri(); },
    navigateToLoginRequestUrl: true
};
var DEFAULT_CACHE_OPTIONS = {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
};
var DEFAULT_SYSTEM_OPTIONS = {
    logger: new _Logger__WEBPACK_IMPORTED_MODULE_1__["Logger"](null),
    loadFrameTimeout: FRAME_TIMEOUT,
    tokenRenewalOffsetSeconds: OFFSET,
    navigateFrameWait: NAVIGATE_FRAME_WAIT
};
var DEFAULT_FRAMEWORK_OPTIONS = {
    isAngular: false,
    unprotectedResources: new Array(),
    protectedResourceMap: new Map()
};
/**
 * MSAL function that sets the default options when not explicitly configured from app developer
 *
 * @param TAuthOptions
 * @param TCacheOptions
 * @param TSystemOptions
 * @param TFrameworkOptions
 *
 * @returns TConfiguration object
 */
function buildConfiguration(_a) {
    var auth = _a.auth, _b = _a.cache, cache = _b === void 0 ? {} : _b, _c = _a.system, system = _c === void 0 ? {} : _c, _d = _a.framework, framework = _d === void 0 ? {} : _d;
    var overlayedConfig = {
        auth: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, DEFAULT_AUTH_OPTIONS, auth),
        cache: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, DEFAULT_CACHE_OPTIONS, cache),
        system: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, DEFAULT_SYSTEM_OPTIONS, system),
        framework: tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, DEFAULT_FRAMEWORK_OPTIONS, framework)
    };
    return overlayedConfig;
}
//# sourceMappingURL=Configuration.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/IdToken.js":
/*!**********************************************!*\
  !*** ./node_modules/msal/lib-es6/IdToken.js ***!
  \**********************************************/
/*! exports provided: IdToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IdToken", function() { return IdToken; });
/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/* harmony import */ var _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/TokenUtils */ "./node_modules/msal/lib-es6/utils/TokenUtils.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */



/**
 * @hidden
 */
var IdToken = /** @class */ (function () {
    /* tslint:disable:no-string-literal */
    function IdToken(rawIdToken) {
        if (_utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(rawIdToken)) {
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__["ClientAuthError"].createIdTokenNullOrEmptyError(rawIdToken);
        }
        try {
            this.rawIdToken = rawIdToken;
            this.claims = _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_1__["TokenUtils"].extractIdToken(rawIdToken);
            if (this.claims) {
                if (this.claims.hasOwnProperty("iss")) {
                    this.issuer = this.claims["iss"];
                }
                if (this.claims.hasOwnProperty("oid")) {
                    this.objectId = this.claims["oid"];
                }
                if (this.claims.hasOwnProperty("sub")) {
                    this.subject = this.claims["sub"];
                }
                if (this.claims.hasOwnProperty("tid")) {
                    this.tenantId = this.claims["tid"];
                }
                if (this.claims.hasOwnProperty("ver")) {
                    this.version = this.claims["ver"];
                }
                if (this.claims.hasOwnProperty("preferred_username")) {
                    this.preferredName = this.claims["preferred_username"];
                }
                if (this.claims.hasOwnProperty("name")) {
                    this.name = this.claims["name"];
                }
                if (this.claims.hasOwnProperty("nonce")) {
                    this.nonce = this.claims["nonce"];
                }
                if (this.claims.hasOwnProperty("exp")) {
                    this.expiration = this.claims["exp"];
                }
                if (this.claims.hasOwnProperty("home_oid")) {
                    this.homeObjectId = this.claims["home_oid"];
                }
                if (this.claims.hasOwnProperty("sid")) {
                    this.sid = this.claims["sid"];
                }
                if (this.claims.hasOwnProperty("cloud_instance_host_name")) {
                    this.cloudInstance = this.claims["cloud_instance_host_name"];
                }
                /* tslint:enable:no-string-literal */
            }
        }
        catch (e) {
            /*
             * TODO: This error here won't really every be thrown, since extractIdToken() returns null if the decodeJwt() fails.
             * Need to add better error handling here to account for being unable to decode jwts.
             */
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__["ClientAuthError"].createIdTokenParsingError(e);
        }
    }
    return IdToken;
}());

//# sourceMappingURL=IdToken.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/Logger.js":
/*!*********************************************!*\
  !*** ./node_modules/msal/lib-es6/Logger.js ***!
  \*********************************************/
/*! exports provided: LogLevel, Logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Warning"] = 1] = "Warning";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Verbose"] = 3] = "Verbose";
})(LogLevel || (LogLevel = {}));
var Logger = /** @class */ (function () {
    function Logger(localCallback, options) {
        if (options === void 0) { options = {}; }
        /**
         * @hidden
         */
        this.level = LogLevel.Info;
        var _a = options.correlationId, correlationId = _a === void 0 ? "" : _a, _b = options.level, level = _b === void 0 ? LogLevel.Info : _b, _c = options.piiLoggingEnabled, piiLoggingEnabled = _c === void 0 ? false : _c;
        this.localCallback = localCallback;
        this.correlationId = correlationId;
        this.level = level;
        this.piiLoggingEnabled = piiLoggingEnabled;
    }
    /**
     * @hidden
     */
    Logger.prototype.logMessage = function (logLevel, logMessage, containsPii) {
        if ((logLevel > this.level) || (!this.piiLoggingEnabled && containsPii)) {
            return;
        }
        var timestamp = new Date().toUTCString();
        var log;
        if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_0__["StringUtils"].isEmpty(this.correlationId)) {
            log = timestamp + ":" + this.correlationId + "-" + Object(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["libraryVersion"])() + "-" + LogLevel[logLevel] + " " + logMessage;
        }
        else {
            log = timestamp + ":" + Object(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["libraryVersion"])() + "-" + LogLevel[logLevel] + " " + logMessage;
        }
        this.executeCallback(logLevel, log, containsPii);
    };
    /**
     * @hidden
     */
    Logger.prototype.executeCallback = function (level, message, containsPii) {
        if (this.localCallback) {
            this.localCallback(level, message, containsPii);
        }
    };
    /**
     * @hidden
     */
    Logger.prototype.error = function (message) {
        this.logMessage(LogLevel.Error, message, false);
    };
    /**
     * @hidden
     */
    Logger.prototype.errorPii = function (message) {
        this.logMessage(LogLevel.Error, message, true);
    };
    /**
     * @hidden
     */
    Logger.prototype.warning = function (message) {
        this.logMessage(LogLevel.Warning, message, false);
    };
    /**
     * @hidden
     */
    Logger.prototype.warningPii = function (message) {
        this.logMessage(LogLevel.Warning, message, true);
    };
    /**
     * @hidden
     */
    Logger.prototype.info = function (message) {
        this.logMessage(LogLevel.Info, message, false);
    };
    /**
     * @hidden
     */
    Logger.prototype.infoPii = function (message) {
        this.logMessage(LogLevel.Info, message, true);
    };
    /**
     * @hidden
     */
    Logger.prototype.verbose = function (message) {
        this.logMessage(LogLevel.Verbose, message, false);
    };
    /**
     * @hidden
     */
    Logger.prototype.verbosePii = function (message) {
        this.logMessage(LogLevel.Verbose, message, true);
    };
    Logger.prototype.isPiiLoggingEnabled = function () {
        return this.piiLoggingEnabled;
    };
    return Logger;
}());

//# sourceMappingURL=Logger.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/ScopeSet.js":
/*!***********************************************!*\
  !*** ./node_modules/msal/lib-es6/ScopeSet.js ***!
  \***********************************************/
/*! exports provided: ScopeSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScopeSet", function() { return ScopeSet; });
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var ScopeSet = /** @class */ (function () {
    function ScopeSet() {
    }
    /**
     * Check if there are dup scopes in a given request
     *
     * @param cachedScopes
     * @param scopes
     */
    // TODO: Rename this, intersecting scopes isn't a great name for duplicate checker
    ScopeSet.isIntersectingScopes = function (cachedScopes, scopes) {
        cachedScopes = this.convertToLowerCase(cachedScopes);
        for (var i = 0; i < scopes.length; i++) {
            if (cachedScopes.indexOf(scopes[i].toLowerCase()) > -1) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check if a given scope is present in the request
     *
     * @param cachedScopes
     * @param scopes
     */
    ScopeSet.containsScope = function (cachedScopes, scopes) {
        cachedScopes = this.convertToLowerCase(cachedScopes);
        return scopes.every(function (value) { return cachedScopes.indexOf(value.toString().toLowerCase()) >= 0; });
    };
    /**
     * toLower
     *
     * @param scopes
     */
    // TODO: Rename this, too generic name for a function that only deals with scopes
    ScopeSet.convertToLowerCase = function (scopes) {
        return scopes.map(function (scope) { return scope.toLowerCase(); });
    };
    /**
     * remove one element from a scope array
     *
     * @param scopes
     * @param scope
     */
    // TODO: Rename this, too generic name for a function that only deals with scopes
    ScopeSet.removeElement = function (scopes, scope) {
        return scopes.filter(function (value) { return value !== scope; });
    };
    /**
     * Parse the scopes into a formatted scopeList
     * @param scopes
     */
    ScopeSet.parseScope = function (scopes) {
        var scopeList = "";
        if (scopes) {
            for (var i = 0; i < scopes.length; ++i) {
                scopeList += (i !== scopes.length - 1) ? scopes[i] + " " : scopes[i];
            }
        }
        return scopeList;
    };
    /**
     * @hidden
     *
     * Used to validate the scopes input parameter requested  by the developer.
     * @param {Array<string>} scopes - Developer requested permissions. Not all scopes are guaranteed to be included in the access token returned.
     * @param {boolean} scopesRequired - Boolean indicating whether the scopes array is required or not
     * @ignore
     */
    ScopeSet.validateInputScope = function (scopes, scopesRequired, clientId) {
        if (!scopes) {
            if (scopesRequired) {
                throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__["ClientConfigurationError"].createScopesRequiredError(scopes);
            }
            else {
                return;
            }
        }
        // Check that scopes is an array object (also throws error if scopes == null)
        if (!Array.isArray(scopes)) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__["ClientConfigurationError"].createScopesNonArrayError(scopes);
        }
        // Check that scopes is not an empty array
        if (scopes.length < 1) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__["ClientConfigurationError"].createEmptyScopesArrayError(scopes.toString());
        }
        // Check that clientId is passed as single scope
        if (scopes.indexOf(clientId) > -1) {
            if (scopes.length > 1) {
                throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__["ClientConfigurationError"].createClientIdSingleScopeError(scopes.toString());
            }
        }
    };
    /**
     * @hidden
     *
     * Extracts scope value from the state sent with the authentication request.
     * @param {string} state
     * @returns {string} scope.
     * @ignore
     */
    ScopeSet.getScopeFromState = function (state) {
        if (state) {
            var splitIndex = state.indexOf("|");
            if (splitIndex > -1 && splitIndex + 1 < state.length) {
                return state.substring(splitIndex + 1);
            }
        }
        return "";
    };
    /**
     * @ignore
     * Appends extraScopesToConsent if passed
     * @param {@link AuthenticationParameters}
     */
    ScopeSet.appendScopes = function (reqScopes, reqExtraScopesToConsent) {
        if (reqScopes) {
            return reqExtraScopesToConsent ? reqScopes.concat(reqExtraScopesToConsent) : reqScopes;
        }
        return null;
    };
    return ScopeSet;
}());

//# sourceMappingURL=ScopeSet.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/ServerRequestParameters.js":
/*!**************************************************************!*\
  !*** ./node_modules/msal/lib-es6/ServerRequestParameters.js ***!
  \**************************************************************/
/*! exports provided: ServerRequestParameters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerRequestParameters", function() { return ServerRequestParameters; });
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */



/**
 * Nonce: OIDC Nonce definition: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * State: OAuth Spec: https://tools.ietf.org/html/rfc6749#section-10.12
 * @hidden
 */
var ServerRequestParameters = /** @class */ (function () {
    /**
     * Constructor
     * @param authority
     * @param clientId
     * @param scope
     * @param responseType
     * @param redirectUri
     * @param state
     */
    function ServerRequestParameters(authority, clientId, responseType, redirectUri, scopes, state, correlationId) {
        this.authorityInstance = authority;
        this.clientId = clientId;
        this.nonce = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].createNewGuid();
        // set scope to clientId if null
        this.scopes = scopes ? scopes.slice() : [clientId];
        // set state (already set at top level)
        this.state = state;
        // set correlationId
        this.correlationId = correlationId;
        // telemetry information
        this.xClientSku = "MSAL.JS";
        this.xClientVer = Object(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["libraryVersion"])();
        this.responseType = responseType;
        this.redirectUri = redirectUri;
    }
    Object.defineProperty(ServerRequestParameters.prototype, "authority", {
        get: function () {
            return this.authorityInstance ? this.authorityInstance.CanonicalAuthority : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @ignore
     *
     * Utility to populate QueryParameters and ExtraQueryParameters to ServerRequestParamerers
     * @param request
     * @param serverAuthenticationRequest
     */
    ServerRequestParameters.prototype.populateQueryParams = function (account, request, adalIdTokenObject) {
        var queryParameters = {};
        if (request) {
            // add the prompt parameter to serverRequestParameters if passed
            if (request.prompt) {
                this.promptValue = request.prompt;
            }
            // Add claims challenge to serverRequestParameters if passed
            if (request.claimsRequest) {
                this.claimsValue = request.claimsRequest;
            }
            // if the developer provides one of these, give preference to developer choice
            if (ServerRequestParameters.isSSOParam(request)) {
                queryParameters = this.constructUnifiedCacheQueryParameter(request, null);
            }
        }
        if (adalIdTokenObject) {
            queryParameters = this.constructUnifiedCacheQueryParameter(null, adalIdTokenObject);
        }
        /*
         * adds sid/login_hint if not populated; populates domain_req, login_req and domain_hint
         * this.logger.verbose("Calling addHint parameters");
         */
        queryParameters = this.addHintParameters(account, queryParameters);
        // sanity check for developer passed extraQueryParameters
        var eQParams = request.extraQueryParameters;
        // Populate the extraQueryParameters to be sent to the server
        this.queryParameters = ServerRequestParameters.generateQueryParametersString(queryParameters);
        this.extraQueryParameters = ServerRequestParameters.generateQueryParametersString(eQParams);
    };
    // #region QueryParam helpers
    /**
     * Constructs extraQueryParameters to be sent to the server for the AuthenticationParameters set by the developer
     * in any login() or acquireToken() calls
     * @param idTokenObject
     * @param extraQueryParameters
     * @param sid
     * @param loginHint
     */
    // TODO: check how this behaves when domain_hint only is sent in extraparameters and idToken has no upn.
    ServerRequestParameters.prototype.constructUnifiedCacheQueryParameter = function (request, idTokenObject) {
        // preference order: account > sid > login_hint
        var ssoType;
        var ssoData;
        var serverReqParam = {};
        // if account info is passed, account.sid > account.login_hint
        if (request) {
            if (request.account) {
                var account = request.account;
                if (account.sid) {
                    ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID;
                    ssoData = account.sid;
                }
                else if (account.userName) {
                    ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT;
                    ssoData = account.userName;
                }
            }
            // sid from request
            else if (request.sid) {
                ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID;
                ssoData = request.sid;
            }
            // loginHint from request
            else if (request.loginHint) {
                ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT;
                ssoData = request.loginHint;
            }
        }
        // adalIdToken retrieved from cache
        else if (idTokenObject) {
            if (idTokenObject.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].upn)) {
                ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ID_TOKEN;
                ssoData = idTokenObject.upn;
            }
            else {
                ssoType = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ORGANIZATIONS;
                ssoData = null;
            }
        }
        serverReqParam = this.addSSOParameter(ssoType, ssoData);
        // add the HomeAccountIdentifier info/ domain_hint
        if (request && request.account && request.account.homeAccountIdentifier) {
            serverReqParam = this.addSSOParameter(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].HOMEACCOUNT_ID, request.account.homeAccountIdentifier, serverReqParam);
        }
        return serverReqParam;
    };
    /**
     * @hidden
     *
     * Adds login_hint to authorization URL which is used to pre-fill the username field of sign in page for the user if known ahead of time
     * domain_hint can be one of users/organizations which when added skips the email based discovery process of the user
     * domain_req utid received as part of the clientInfo
     * login_req uid received as part of clientInfo
     * Also does a sanity check for extraQueryParameters passed by the user to ensure no repeat queryParameters
     *
     * @param {@link Account} account - Account for which the token is requested
     * @param queryparams
     * @param {@link ServerRequestParameters}
     * @ignore
     */
    ServerRequestParameters.prototype.addHintParameters = function (account, qParams) {
        /*
         * This is a final check for all queryParams added so far; preference order: sid > login_hint
         * sid cannot be passed along with login_hint or domain_hint, hence we check both are not populated yet in queryParameters
         */
        if (account && !qParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID]) {
            // sid - populate only if login_hint is not already populated and the account has sid
            var populateSID = !qParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT] && account.sid && this.promptValue === _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PromptState"].NONE;
            if (populateSID) {
                qParams = this.addSSOParameter(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID, account.sid, qParams);
            }
            // login_hint - account.userName
            else {
                var populateLoginHint = !qParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT] && account.userName && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(account.userName);
                if (populateLoginHint) {
                    qParams = this.addSSOParameter(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT, account.userName, qParams);
                }
            }
            var populateReqParams = !qParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_REQ] && !qParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_REQ];
            if (populateReqParams) {
                qParams = this.addSSOParameter(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].HOMEACCOUNT_ID, account.homeAccountIdentifier, qParams);
            }
        }
        return qParams;
    };
    /**
     * Add SID to extraQueryParameters
     * @param sid
     */
    ServerRequestParameters.prototype.addSSOParameter = function (ssoType, ssoData, ssoParam) {
        if (!ssoParam) {
            ssoParam = {};
        }
        if (!ssoData) {
            return ssoParam;
        }
        switch (ssoType) {
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].SID] = ssoData;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ID_TOKEN: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT] = ssoData;
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_HINT] = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ORGANIZATIONS;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_HINT] = ssoData;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ORGANIZATIONS: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_HINT] = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ORGANIZATIONS;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].CONSUMERS: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_HINT] = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].CONSUMERS;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].HOMEACCOUNT_ID: {
                var homeAccountId = ssoData.split(".");
                var uid = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Decode(homeAccountId[0]);
                var utid = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Decode(homeAccountId[1]);
                // TODO: domain_req and login_req are not needed according to eSTS team
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_REQ] = uid;
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_REQ] = utid;
                if (utid === _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].consumersUtid) {
                    ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_HINT] = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].CONSUMERS;
                }
                else {
                    ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_HINT] = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].ORGANIZATIONS;
                }
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_REQ: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].LOGIN_REQ] = ssoData;
                break;
            }
            case _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_REQ: {
                ssoParam[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["SSOTypes"].DOMAIN_REQ] = ssoData;
                break;
            }
        }
        return ssoParam;
    };
    /**
     * Utility to generate a QueryParameterString from a Key-Value mapping of extraQueryParameters passed
     * @param extraQueryParameters
     */
    ServerRequestParameters.generateQueryParametersString = function (queryParameters) {
        var paramsString = null;
        if (queryParameters) {
            Object.keys(queryParameters).forEach(function (key) {
                if (paramsString == null) {
                    paramsString = key + "=" + encodeURIComponent(queryParameters[key]);
                }
                else {
                    paramsString += "&" + key + "=" + encodeURIComponent(queryParameters[key]);
                }
            });
        }
        return paramsString;
    };
    // #endregion
    /**
     * Check to see if there are SSO params set in the Request
     * @param request
     */
    ServerRequestParameters.isSSOParam = function (request) {
        return request && (request.account || request.sid || request.loginHint);
    };
    return ServerRequestParameters;
}());

//# sourceMappingURL=ServerRequestParameters.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/UserAgentApplication.js":
/*!***********************************************************!*\
  !*** ./node_modules/msal/lib-es6/UserAgentApplication.js ***!
  \***********************************************************/
/*! exports provided: UserAgentApplication */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserAgentApplication", function() { return UserAgentApplication; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _cache_AccessTokenKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cache/AccessTokenKey */ "./node_modules/msal/lib-es6/cache/AccessTokenKey.js");
/* harmony import */ var _cache_AccessTokenValue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cache/AccessTokenValue */ "./node_modules/msal/lib-es6/cache/AccessTokenValue.js");
/* harmony import */ var _ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ServerRequestParameters */ "./node_modules/msal/lib-es6/ServerRequestParameters.js");
/* harmony import */ var _ClientInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ClientInfo */ "./node_modules/msal/lib-es6/ClientInfo.js");
/* harmony import */ var _IdToken__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IdToken */ "./node_modules/msal/lib-es6/IdToken.js");
/* harmony import */ var _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cache/AuthCache */ "./node_modules/msal/lib-es6/cache/AuthCache.js");
/* harmony import */ var _Account__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Account */ "./node_modules/msal/lib-es6/Account.js");
/* harmony import */ var _ScopeSet__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ScopeSet */ "./node_modules/msal/lib-es6/ScopeSet.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/* harmony import */ var _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/WindowUtils */ "./node_modules/msal/lib-es6/utils/WindowUtils.js");
/* harmony import */ var _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/TokenUtils */ "./node_modules/msal/lib-es6/utils/TokenUtils.js");
/* harmony import */ var _utils_TimeUtils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/TimeUtils */ "./node_modules/msal/lib-es6/utils/TimeUtils.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/* harmony import */ var _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./utils/RequestUtils */ "./node_modules/msal/lib-es6/utils/RequestUtils.js");
/* harmony import */ var _utils_ResponseUtils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/ResponseUtils */ "./node_modules/msal/lib-es6/utils/ResponseUtils.js");
/* harmony import */ var _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./authority/AuthorityFactory */ "./node_modules/msal/lib-es6/authority/AuthorityFactory.js");
/* harmony import */ var _Configuration__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Configuration */ "./node_modules/msal/lib-es6/Configuration.js");
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _error_AuthError__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./error/AuthError */ "./node_modules/msal/lib-es6/error/AuthError.js");
/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/* harmony import */ var _error_ServerError__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./error/ServerError */ "./node_modules/msal/lib-es6/error/ServerError.js");
/* harmony import */ var _error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./error/InteractionRequiredAuthError */ "./node_modules/msal/lib-es6/error/InteractionRequiredAuthError.js");
/* harmony import */ var _AuthResponse__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./AuthResponse */ "./node_modules/msal/lib-es6/AuthResponse.js");
/* harmony import */ var _telemetry_TelemetryManager__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./telemetry/TelemetryManager */ "./node_modules/msal/lib-es6/telemetry/TelemetryManager.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


























// default authority
var DEFAULT_AUTHORITY = "https://login.microsoftonline.com/common";
/**
 * @hidden
 * @ignore
 * response_type from OpenIDConnect
 * References: https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html & https://tools.ietf.org/html/rfc6749#section-4.2.1
 * Since we support only implicit flow in this library, we restrict the response_type support to only 'token' and 'id_token'
 *
 */
var ResponseTypes = {
    id_token: "id_token",
    token: "token",
    id_token_token: "id_token token"
};
/**
 * UserAgentApplication class
 *
 * Object Instance that the developer can use to make loginXX OR acquireTokenXX functions
 */
var UserAgentApplication = /** @class */ (function () {
    /**
     * @constructor
     * Constructor for the UserAgentApplication used to instantiate the UserAgentApplication object
     *
     * Important attributes in the Configuration object for auth are:
     * - clientID: the application ID of your application.
     * You can obtain one by registering your application with our Application registration portal : https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredAppsPreview
     * - authority: the authority URL for your application.
     *
     * In Azure AD, authority is a URL indicating the Azure active directory that MSAL uses to obtain tokens.
     * It is of the form https://login.microsoftonline.com/&lt;Enter_the_Tenant_Info_Here&gt;.
     * If your application supports Accounts in one organizational directory, replace "Enter_the_Tenant_Info_Here" value with the Tenant Id or Tenant name (for example, contoso.microsoft.com).
     * If your application supports Accounts in any organizational directory, replace "Enter_the_Tenant_Info_Here" value with organizations.
     * If your application supports Accounts in any organizational directory and personal Microsoft accounts, replace "Enter_the_Tenant_Info_Here" value with common.
     * To restrict support to Personal Microsoft accounts only, replace "Enter_the_Tenant_Info_Here" value with consumers.
     *
     *
     * In Azure B2C, authority is of the form https://&lt;instance&gt;/tfp/&lt;tenant&gt;/&lt;policyName&gt;/
     *
     * @param {@link (Configuration:type)} configuration object for the MSAL UserAgentApplication instance
     */
    function UserAgentApplication(configuration) {
        // callbacks for token/error
        this.authResponseCallback = null;
        this.tokenReceivedCallback = null;
        this.errorReceivedCallback = null;
        // Set the Configuration
        this.config = Object(_Configuration__WEBPACK_IMPORTED_MODULE_17__["buildConfiguration"])(configuration);
        // Set the callback boolean
        this.redirectCallbacksSet = false;
        this.logger = this.config.system.logger;
        this.clientId = this.config.auth.clientId;
        this.inCookie = this.config.cache.storeAuthStateInCookie;
        this.telemetryManager = this.getTelemetryManagerFromConfig(this.config.system.telemetry, this.clientId);
        // if no authority is passed, set the default: "https://login.microsoftonline.com/common"
        this.authority = this.config.auth.authority || DEFAULT_AUTHORITY;
        // cache keys msal - typescript throws an error if any value other than "localStorage" or "sessionStorage" is passed
        this.cacheStorage = new _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"](this.clientId, this.config.cache.cacheLocation, this.inCookie);
        // Initialize window handling code
        window.activeRenewals = {};
        window.renewStates = [];
        window.callbackMappedToRenewStates = {};
        window.promiseMappedToRenewStates = {};
        window.msal = this;
        var urlHash = window.location.hash;
        var urlContainsHash = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].urlContainsHash(urlHash);
        // check if back button is pressed
        _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].checkIfBackButtonIsPressed(this.cacheStorage);
        // On the server 302 - Redirect, handle this
        if (urlContainsHash && !_utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].isInIframe() && !_utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].isInPopup()) {
            this.handleAuthenticationResponse(urlHash);
        }
    }
    Object.defineProperty(UserAgentApplication.prototype, "authority", {
        /**
         * Method to manage the authority URL.
         *
         * @returns {string} authority
         */
        get: function () {
            return this.authorityInstance.CanonicalAuthority;
        },
        /**
         * setter for the authority URL
         * @param {string} authority
         */
        // If the developer passes an authority, create an instance
        set: function (val) {
            this.authorityInstance = _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(val, this.config.auth.validateAuthority);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the current authority instance from the MSAL configuration object
     *
     * @returns {@link Authority} authority instance
     */
    UserAgentApplication.prototype.getAuthorityInstance = function () {
        return this.authorityInstance;
    };
    UserAgentApplication.prototype.handleRedirectCallback = function (authOrTokenCallback, errorReceivedCallback) {
        if (!authOrTokenCallback) {
            this.redirectCallbacksSet = false;
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_18__["ClientConfigurationError"].createInvalidCallbackObjectError(authOrTokenCallback);
        }
        // Set callbacks
        if (errorReceivedCallback) {
            this.tokenReceivedCallback = authOrTokenCallback;
            this.errorReceivedCallback = errorReceivedCallback;
            this.logger.warning("This overload for callback is deprecated - please change the format of the callbacks to a single callback as shown: (err: AuthError, response: AuthResponse).");
        }
        else {
            this.authResponseCallback = authOrTokenCallback;
        }
        this.redirectCallbacksSet = true;
        // On the server 302 - Redirect, handle this
        var cachedHash = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].URL_HASH);
        if (cachedHash) {
            this.processCallBack(cachedHash, null);
        }
    };
    /**
     * Public API to verify if the URL contains the hash with known properties
     * @param hash
     */
    UserAgentApplication.prototype.urlContainsHash = function (hash) {
        return _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].urlContainsHash(hash);
    };
    UserAgentApplication.prototype.authResponseHandler = function (interactionType, response, resolve) {
        if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect) {
            if (this.errorReceivedCallback) {
                this.tokenReceivedCallback(response);
            }
            else if (this.authResponseCallback) {
                this.authResponseCallback(null, response);
            }
        }
        else if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup) {
            resolve(response);
        }
        else {
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createInvalidInteractionTypeError();
        }
    };
    UserAgentApplication.prototype.authErrorHandler = function (interactionType, authErr, response, reject) {
        // set interaction_status to complete
        this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
        if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect) {
            if (this.errorReceivedCallback) {
                this.errorReceivedCallback(authErr, response.accountState);
            }
            else {
                this.authResponseCallback(authErr, response);
            }
        }
        else if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup) {
            reject(authErr);
        }
        else {
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createInvalidInteractionTypeError();
        }
    };
    // #endregion
    /**
     * Use when initiating the login process by redirecting the user's browser to the authorization endpoint.
     * @param {@link (AuthenticationParameters:type)}
     */
    UserAgentApplication.prototype.loginRedirect = function (userRequest) {
        // validate request
        var request = _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__["RequestUtils"].validateRequest(userRequest, true, this.clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, this.redirectCallbacksSet);
        this.acquireTokenInteractive(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, true, request, null, null);
    };
    /**
     * Use when you want to obtain an access_token for your API by redirecting the user's browser window to the authorization endpoint.
     * @param {@link (AuthenticationParameters:type)}
     *
     * To renew idToken, please pass clientId as the only scope in the Authentication Parameters
     */
    UserAgentApplication.prototype.acquireTokenRedirect = function (userRequest) {
        // validate request
        var request = _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__["RequestUtils"].validateRequest(userRequest, false, this.clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, this.redirectCallbacksSet);
        this.acquireTokenInteractive(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, false, request, null, null);
    };
    /**
     * Use when initiating the login process via opening a popup window in the user's browser
     *
     * @param {@link (AuthenticationParameters:type)}
     *
     * @returns {Promise.<AuthResponse>} - a promise that is fulfilled when this function has completed, or rejected if an error was raised. Returns the {@link AuthResponse} object
     */
    UserAgentApplication.prototype.loginPopup = function (userRequest) {
        var _this = this;
        // validate request
        var request = _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__["RequestUtils"].validateRequest(userRequest, true, this.clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup);
        return new Promise(function (resolve, reject) {
            _this.acquireTokenInteractive(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup, true, request, resolve, reject);
        }).catch(function (error) {
            _this.cacheStorage.resetTempCacheItems(request.state);
            throw error;
        });
    };
    /**
     * Use when you want to obtain an access_token for your API via opening a popup window in the user's browser
     * @param {@link AuthenticationParameters}
     *
     * To renew idToken, please pass clientId as the only scope in the Authentication Parameters
     * @returns {Promise.<AuthResponse>} - a promise that is fulfilled when this function has completed, or rejected if an error was raised. Returns the {@link AuthResponse} object
     */
    UserAgentApplication.prototype.acquireTokenPopup = function (userRequest) {
        var _this = this;
        // validate request
        var request = _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__["RequestUtils"].validateRequest(userRequest, false, this.clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup);
        return new Promise(function (resolve, reject) {
            _this.acquireTokenInteractive(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup, false, request, resolve, reject);
        }).catch(function (error) {
            _this.cacheStorage.resetTempCacheItems(request.state);
            throw error;
        });
    };
    // #region Acquire Token
    /**
     * Use when initiating the login process or when you want to obtain an access_token for your API,
     * either by redirecting the user's browser window to the authorization endpoint or via opening a popup window in the user's browser.
     * @param {@link (AuthenticationParameters:type)}
     *
     * To renew idToken, please pass clientId as the only scope in the Authentication Parameters
     */
    UserAgentApplication.prototype.acquireTokenInteractive = function (interactionType, isLoginCall, request, resolve, reject) {
        var _this = this;
        // block the request if made from the hidden iframe
        _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].blockReloadInHiddenIframes();
        var interactionProgress = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
        if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect) {
            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].REDIRECT_REQUEST, "" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + request.state);
        }
        // If already in progress, do not proceed
        if (interactionProgress === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress) {
            var thrownError = isLoginCall ? _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createLoginInProgressError() : _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createAcquireTokenInProgressError();
            var stateOnlyResponse = Object(_AuthResponse__WEBPACK_IMPORTED_MODULE_23__["buildResponseStateOnly"])(this.getAccountState(request.state));
            this.cacheStorage.resetTempCacheItems(request.state);
            this.authErrorHandler(interactionType, thrownError, stateOnlyResponse, reject);
            return;
        }
        // Get the account object if a session exists
        var account = (request && request.account && !isLoginCall) ? request.account : this.getAccount();
        // If no session exists, prompt the user to login.
        if (!account && !_ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__["ServerRequestParameters"].isSSOParam(request)) {
            if (isLoginCall) {
                // extract ADAL id_token if exists
                var adalIdToken = this.extractADALIdToken();
                // silent login if ADAL id_token is retrieved successfully - SSO
                if (adalIdToken && !request.scopes) {
                    this.logger.info("ADAL's idToken exists. Extracting login information from ADAL's idToken ");
                    var tokenRequest = this.buildIDTokenRequest(request);
                    this.silentLogin = true;
                    this.acquireTokenSilent(tokenRequest).then(function (response) {
                        _this.silentLogin = false;
                        _this.logger.info("Unified cache call is successful");
                        _this.authResponseHandler(interactionType, response, resolve);
                        return;
                    }, function (error) {
                        _this.silentLogin = false;
                        _this.logger.error("Error occurred during unified cache ATS: " + error);
                        // proceed to login since ATS failed
                        _this.acquireTokenHelper(null, interactionType, isLoginCall, request, resolve, reject);
                    });
                }
                // No ADAL token found, proceed to login
                else {
                    this.acquireTokenHelper(null, interactionType, isLoginCall, request, resolve, reject);
                }
            }
            // AcquireToken call, but no account or context given, so throw error
            else {
                this.logger.info("User login is required");
                var stateOnlyResponse = Object(_AuthResponse__WEBPACK_IMPORTED_MODULE_23__["buildResponseStateOnly"])(this.getAccountState(request.state));
                this.cacheStorage.resetTempCacheItems(request.state);
                this.authErrorHandler(interactionType, _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createUserLoginRequiredError(), stateOnlyResponse, reject);
                return;
            }
        }
        // User session exists
        else {
            this.acquireTokenHelper(account, interactionType, isLoginCall, request, resolve, reject);
        }
    };
    /**
     * @hidden
     * @ignore
     * Helper function to acquireToken
     *
     */
    UserAgentApplication.prototype.acquireTokenHelper = function (account, interactionType, isLoginCall, request, resolve, reject) {
        var _this = this;
        // Track the acquireToken progress
        this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress);
        var scope = request.scopes ? request.scopes.join(" ").toLowerCase() : this.clientId.toLowerCase();
        var serverAuthenticationRequest;
        var acquireTokenAuthority = (request && request.authority) ? _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(request.authority, this.config.auth.validateAuthority) : this.authorityInstance;
        var popUpWindow;
        if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup) {
            // Generate a popup window
            try {
                popUpWindow = this.openPopup("about:blank", "msal", _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].popUpWidth, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].popUpHeight);
                // Push popup window handle onto stack for tracking
                _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].trackPopup(popUpWindow);
            }
            catch (e) {
                this.logger.info(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthErrorMessage"].popUpWindowError.code + ":" + _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthErrorMessage"].popUpWindowError.desc);
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR, _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthErrorMessage"].popUpWindowError.code);
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR_DESC, _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthErrorMessage"].popUpWindowError.desc);
                if (reject) {
                    reject(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createPopupWindowError());
                }
            }
            if (!popUpWindow) {
                return;
            }
        }
        acquireTokenAuthority.resolveEndpointsAsync().then(function () { return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this, void 0, void 0, function () {
            var responseType, loginStartPage, urlNavigate, hash, error_1;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responseType = isLoginCall ? ResponseTypes.id_token : this.getTokenType(account, request.scopes, false);
                        if (isLoginCall) {
                            // if the user sets the login start page - angular only??
                            loginStartPage = this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].ANGULAR_LOGIN_REQUEST + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + request.state);
                            if (!loginStartPage || loginStartPage === "") {
                                loginStartPage = window.location.href;
                            }
                            else {
                                this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].ANGULAR_LOGIN_REQUEST + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + request.state, "");
                            }
                        }
                        serverAuthenticationRequest = new _ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__["ServerRequestParameters"](acquireTokenAuthority, this.clientId, responseType, this.getRedirectUri(request && request.redirectUri), request.scopes, request.state, request.correlationId);
                        this.updateCacheEntries(serverAuthenticationRequest, account, loginStartPage);
                        // populate QueryParameters (sid/login_hint/domain_hint) and any other extraQueryParameters set by the developer
                        serverAuthenticationRequest.populateQueryParams(account, request);
                        urlNavigate = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].createNavigateUrl(serverAuthenticationRequest) + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].response_mode_fragment;
                        // set state in cache
                        if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect) {
                            if (!isLoginCall) {
                                this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].STATE_ACQ_TOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + request.state, serverAuthenticationRequest.state, this.inCookie);
                            }
                        }
                        else if (interactionType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypePopup) {
                            window.renewStates.push(serverAuthenticationRequest.state);
                            window.requestType = isLoginCall ? _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].login : _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken;
                            // Register callback to capture results from server
                            this.registerCallback(serverAuthenticationRequest.state, scope, resolve, reject);
                        }
                        else {
                            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createInvalidInteractionTypeError();
                        }
                        // prompt user for interaction
                        this.navigateWindow(urlNavigate, popUpWindow);
                        if (!popUpWindow) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].monitorWindowForHash(popUpWindow, this.config.system.loadFrameTimeout, urlNavigate)];
                    case 2:
                        hash = _a.sent();
                        this.handleAuthenticationResponse(hash);
                        // Request completed successfully, set to completed
                        this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
                        this.logger.info("Closing popup window");
                        // TODO: Check how this can be extracted for any framework specific code?
                        if (this.config.framework.isAngular) {
                            this.broadcast("msal:popUpHashChanged", hash);
                            _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].closePopups();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        if (reject) {
                            reject(error_1);
                        }
                        if (this.config.framework.isAngular) {
                            this.broadcast("msal:popUpClosed", error_1.errorCode + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + error_1.errorMessage);
                        }
                        else {
                            // Request failed, set to canceled
                            this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
                            popUpWindow.close();
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }).catch(function (err) {
            _this.logger.warning("could not resolve endpoints");
            _this.cacheStorage.resetTempCacheItems(request.state);
            _this.authErrorHandler(interactionType, _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createEndpointResolutionError(err.toString), Object(_AuthResponse__WEBPACK_IMPORTED_MODULE_23__["buildResponseStateOnly"])(request.state), reject);
            if (popUpWindow) {
                popUpWindow.close();
            }
        });
    };
    /**
     * Use this function to obtain a token before every call to the API / resource provider
     *
     * MSAL return's a cached token when available
     * Or it send's a request to the STS to obtain a new token using a hidden iframe.
     *
     * @param {@link AuthenticationParameters}
     *
     * To renew idToken, please pass clientId as the only scope in the Authentication Parameters
     * @returns {Promise.<AuthResponse>} - a promise that is fulfilled when this function has completed, or rejected if an error was raised. Returns the {@link AuthResponse} object
     *
     */
    UserAgentApplication.prototype.acquireTokenSilent = function (userRequest) {
        var _this = this;
        // validate the request
        var request = _utils_RequestUtils__WEBPACK_IMPORTED_MODULE_14__["RequestUtils"].validateRequest(userRequest, false, this.clientId);
        return new Promise(function (resolve, reject) {
            // block the request if made from the hidden iframe
            _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].blockReloadInHiddenIframes();
            var scope = request.scopes.join(" ").toLowerCase();
            // if the developer passes an account, give that account the priority
            var account = request.account || _this.getAccount();
            // extract if there is an adalIdToken stashed in the cache
            var adalIdToken = _this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].adalIdToken);
            // if there is no account logged in and no login_hint/sid is passed in the request
            if (!account && !(request.sid || request.loginHint) && _utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(adalIdToken)) {
                _this.logger.info("User login is required");
                return reject(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createUserLoginRequiredError());
            }
            // set the response type based on the current cache status / scopes set
            var responseType = _this.getTokenType(account, request.scopes, true);
            // create a serverAuthenticationRequest populating the `queryParameters` to be sent to the Server
            var serverAuthenticationRequest = new _ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__["ServerRequestParameters"](_authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(request.authority, _this.config.auth.validateAuthority), _this.clientId, responseType, _this.getRedirectUri(request.redirectUri), request.scopes, request.state, request.correlationId);
            // populate QueryParameters (sid/login_hint/domain_hint) and any other extraQueryParameters set by the developer
            if (_ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__["ServerRequestParameters"].isSSOParam(request) || account) {
                serverAuthenticationRequest.populateQueryParams(account, request);
            }
            // if user didn't pass login_hint/sid and adal's idtoken is present, extract the login_hint from the adalIdToken
            else if (!account && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(adalIdToken)) {
                // if adalIdToken exists, extract the SSO info from the same
                var adalIdTokenObject = _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_11__["TokenUtils"].extractIdToken(adalIdToken);
                _this.logger.verbose("ADAL's idToken exists. Extracting login information from ADAL's idToken ");
                serverAuthenticationRequest.populateQueryParams(account, null, adalIdTokenObject);
            }
            var userContainedClaims = request.claimsRequest || serverAuthenticationRequest.claimsValue;
            var authErr;
            var cacheResultResponse;
            if (!userContainedClaims && !request.forceRefresh) {
                try {
                    cacheResultResponse = _this.getCachedToken(serverAuthenticationRequest, account);
                }
                catch (e) {
                    authErr = e;
                }
            }
            // resolve/reject based on cacheResult
            if (cacheResultResponse) {
                _this.logger.info("Token is already in cache for scope:" + scope);
                resolve(cacheResultResponse);
                return null;
            }
            else if (authErr) {
                _this.logger.infoPii(authErr.errorCode + ":" + authErr.errorMessage);
                reject(authErr);
                return null;
            }
            // else proceed with login
            else {
                var logMessage = void 0;
                if (userContainedClaims) {
                    logMessage = "Skipped cache lookup since claims were given.";
                }
                else if (request.forceRefresh) {
                    logMessage = "Skipped cache lookup since request.forceRefresh option was set to true";
                }
                else {
                    logMessage = "Token is not in cache for scope:" + scope;
                }
                _this.logger.verbose(logMessage);
                // Cache result can return null if cache is empty. In that case, set authority to default value if no authority is passed to the api.
                if (!serverAuthenticationRequest.authorityInstance) {
                    serverAuthenticationRequest.authorityInstance = request.authority ? _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(request.authority, _this.config.auth.validateAuthority) : _this.authorityInstance;
                }
                // cache miss
                return serverAuthenticationRequest.authorityInstance.resolveEndpointsAsync()
                    .then(function () {
                    /*
                     * refresh attempt with iframe
                     * Already renewing for this scope, callback when we get the token.
                     */
                    if (window.activeRenewals[scope]) {
                        _this.logger.verbose("Renew token for scope: " + scope + " is in progress. Registering callback");
                        // Active renewals contains the state for each renewal.
                        _this.registerCallback(window.activeRenewals[scope], scope, resolve, reject);
                    }
                    else {
                        if (request.scopes && request.scopes.indexOf(_this.clientId) > -1 && request.scopes.length === 1) {
                            /*
                             * App uses idToken to send to api endpoints
                             * Default scope is tracked as clientId to store this token
                             */
                            _this.logger.verbose("renewing idToken");
                            _this.silentLogin = true;
                            _this.renewIdToken(request.scopes, resolve, reject, account, serverAuthenticationRequest);
                        }
                        else {
                            // renew access token
                            _this.logger.verbose("renewing accesstoken");
                            _this.renewToken(request.scopes, resolve, reject, account, serverAuthenticationRequest);
                        }
                    }
                }).catch(function (err) {
                    _this.logger.warning("could not resolve endpoints");
                    reject(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createEndpointResolutionError(err.toString()));
                    return null;
                });
            }
        }).catch(function (error) {
            _this.cacheStorage.resetTempCacheItems(request.state);
            throw error;
        });
    };
    // #endregion
    // #region Popup Window Creation
    /**
     * @hidden
     *
     * Configures popup window for login.
     *
     * @param urlNavigate
     * @param title
     * @param popUpWidth
     * @param popUpHeight
     * @ignore
     * @hidden
     */
    UserAgentApplication.prototype.openPopup = function (urlNavigate, title, popUpWidth, popUpHeight) {
        try {
            /**
             * adding winLeft and winTop to account for dual monitor
             * using screenLeft and screenTop for IE8 and earlier
             */
            var winLeft = window.screenLeft ? window.screenLeft : window.screenX;
            var winTop = window.screenTop ? window.screenTop : window.screenY;
            /**
             * window.innerWidth displays browser window"s height and width excluding toolbars
             * using document.documentElement.clientWidth for IE8 and earlier
             */
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var left = ((width / 2) - (popUpWidth / 2)) + winLeft;
            var top_1 = ((height / 2) - (popUpHeight / 2)) + winTop;
            // open the window
            var popupWindow = window.open(urlNavigate, title, "width=" + popUpWidth + ", height=" + popUpHeight + ", top=" + top_1 + ", left=" + left);
            if (!popupWindow) {
                throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createPopupWindowError();
            }
            if (popupWindow.focus) {
                popupWindow.focus();
            }
            return popupWindow;
        }
        catch (e) {
            this.logger.error("error opening popup " + e.message);
            this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createPopupWindowError(e.toString());
        }
    };
    // #endregion
    // #region Iframe Management
    /**
     * @hidden
     * Calling _loadFrame but with a timeout to signal failure in loadframeStatus. Callbacks are left.
     * registered when network errors occur and subsequent token requests for same resource are registered to the pending request.
     * @ignore
     */
    UserAgentApplication.prototype.loadIframeTimeout = function (urlNavigate, frameName, scope) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var expectedState, iframe, hash, error_2;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedState = window.activeRenewals[scope];
                        this.logger.verbose("Set loading state to pending for: " + scope + ":" + expectedState);
                        this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].RENEW_STATUS + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + expectedState, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress);
                        return [4 /*yield*/, _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].loadFrame(urlNavigate, frameName, this.config.system.navigateFrameWait, this.logger)];
                    case 1:
                        iframe = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].monitorWindowForHash(iframe.contentWindow, this.config.system.loadFrameTimeout, urlNavigate)];
                    case 3:
                        hash = _a.sent();
                        if (hash) {
                            this.handleAuthenticationResponse(hash);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        if (this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].RENEW_STATUS + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + expectedState) === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress) {
                            // fail the iframe session if it's in pending state
                            this.logger.verbose("Loading frame has timed out after: " + (this.config.system.loadFrameTimeout / 1000) + " seconds for scope " + scope + ":" + expectedState);
                            // Error after timeout
                            if (expectedState && window.callbackMappedToRenewStates[expectedState]) {
                                window.callbackMappedToRenewStates[expectedState](null, error_2);
                            }
                            this.cacheStorage.removeItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].RENEW_STATUS + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + expectedState);
                        }
                        _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].removeHiddenIframe(iframe);
                        throw error_2;
                    case 5:
                        _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].removeHiddenIframe(iframe);
                        return [2 /*return*/];
                }
            });
        });
    };
    // #endregion
    // #region General Helpers
    /**
     * @hidden
     * Used to redirect the browser to the STS authorization endpoint
     * @param {string} urlNavigate - URL of the authorization endpoint
     */
    UserAgentApplication.prototype.navigateWindow = function (urlNavigate, popupWindow) {
        // Navigate if valid URL
        if (urlNavigate && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(urlNavigate)) {
            var navigateWindow = popupWindow ? popupWindow : window;
            var logMessage = popupWindow ? "Navigated Popup window to:" + urlNavigate : "Navigate to:" + urlNavigate;
            this.logger.infoPii(logMessage);
            navigateWindow.location.assign(urlNavigate);
        }
        else {
            this.logger.info("Navigate url is empty");
            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Navigate url is empty");
        }
    };
    /**
     * @hidden
     * Used to add the developer requested callback to the array of callbacks for the specified scopes. The updated array is stored on the window object
     * @param {string} expectedState - Unique state identifier (guid).
     * @param {string} scope - Developer requested permissions. Not all scopes are guaranteed to be included in the access token returned.
     * @param {Function} resolve - The resolve function of the promise object.
     * @param {Function} reject - The reject function of the promise object.
     * @ignore
     */
    UserAgentApplication.prototype.registerCallback = function (expectedState, scope, resolve, reject) {
        var _this = this;
        // track active renewals
        window.activeRenewals[scope] = expectedState;
        // initialize callbacks mapped array
        if (!window.promiseMappedToRenewStates[expectedState]) {
            window.promiseMappedToRenewStates[expectedState] = [];
        }
        // indexing on the current state, push the callback params to callbacks mapped
        window.promiseMappedToRenewStates[expectedState].push({ resolve: resolve, reject: reject });
        // Store the server response in the current window??
        if (!window.callbackMappedToRenewStates[expectedState]) {
            window.callbackMappedToRenewStates[expectedState] = function (response, error) {
                // reset active renewals
                window.activeRenewals[scope] = null;
                // for all promiseMappedtoRenewStates for a given 'state' - call the reject/resolve with error/token respectively
                for (var i = 0; i < window.promiseMappedToRenewStates[expectedState].length; ++i) {
                    try {
                        if (error) {
                            window.promiseMappedToRenewStates[expectedState][i].reject(error);
                        }
                        else if (response) {
                            window.promiseMappedToRenewStates[expectedState][i].resolve(response);
                        }
                        else {
                            _this.cacheStorage.resetTempCacheItems(expectedState);
                            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Error and response are both null");
                        }
                    }
                    catch (e) {
                        _this.logger.warning(e);
                    }
                }
                // reset
                window.promiseMappedToRenewStates[expectedState] = null;
                window.callbackMappedToRenewStates[expectedState] = null;
            };
        }
    };
    // #endregion
    // #region Logout
    /**
     * Use to log out the current user, and redirect the user to the postLogoutRedirectUri.
     * Default behaviour is to redirect the user to `window.location.href`.
     */
    UserAgentApplication.prototype.logout = function () {
        var _this = this;
        this.clearCache();
        this.account = null;
        var logout = "";
        if (this.getPostLogoutRedirectUri()) {
            logout = "post_logout_redirect_uri=" + encodeURIComponent(this.getPostLogoutRedirectUri());
        }
        this.authorityInstance.resolveEndpointsAsync().then(function (authority) {
            var urlNavigate = authority.EndSessionEndpoint
                ? authority.EndSessionEndpoint + "?" + logout
                : _this.authority + "oauth2/v2.0/logout?" + logout;
            _this.navigateWindow(urlNavigate);
        });
    };
    /**
     * @hidden
     * Clear all access tokens in the cache.
     * @ignore
     */
    UserAgentApplication.prototype.clearCache = function () {
        window.renewStates = [];
        var accessTokenItems = this.cacheStorage.getAllAccessTokens(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].homeAccountIdentifier);
        for (var i = 0; i < accessTokenItems.length; i++) {
            this.cacheStorage.removeItem(JSON.stringify(accessTokenItems[i].key));
        }
        this.cacheStorage.resetCacheItems();
        // state not being sent would mean this call may not be needed; check later
        this.cacheStorage.clearMsalCookie();
    };
    /**
     * @hidden
     * Clear a given access token from the cache.
     *
     * @param accessToken
     */
    UserAgentApplication.prototype.clearCacheForScope = function (accessToken) {
        var accessTokenItems = this.cacheStorage.getAllAccessTokens(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].homeAccountIdentifier);
        for (var i = 0; i < accessTokenItems.length; i++) {
            var token = accessTokenItems[i];
            if (token.value.accessToken === accessToken) {
                this.cacheStorage.removeItem(JSON.stringify(token.key));
            }
        }
    };
    // #endregion
    // #region Response
    /**
     * @hidden
     * @ignore
     * Checks if the redirect response is received from the STS. In case of redirect, the url fragment has either id_token, access_token or error.
     * @param {string} hash - Hash passed from redirect page.
     * @returns {Boolean} - true if response contains id_token, access_token or error, false otherwise.
     */
    UserAgentApplication.prototype.isCallback = function (hash) {
        this.logger.info("isCallback will be deprecated in favor of urlContainsHash in MSAL.js v2.0.");
        return _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].urlContainsHash(hash);
    };
    /**
     * @hidden
     * Used to call the constructor callback with the token/error
     * @param {string} [hash=window.location.hash] - Hash fragment of Url.
     */
    UserAgentApplication.prototype.processCallBack = function (hash, stateInfo, parentCallback) {
        this.logger.info("Processing the callback from redirect response");
        // get the state info from the hash
        if (!stateInfo) {
            stateInfo = this.getResponseState(hash);
        }
        var response;
        var authErr;
        // Save the token info from the hash
        try {
            response = this.saveTokenFromHash(hash, stateInfo);
        }
        catch (err) {
            authErr = err;
        }
        // remove hash from the cache
        this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].URL_HASH);
        try {
            // Clear the cookie in the hash
            this.cacheStorage.clearMsalCookie(stateInfo.state);
            var accountState = this.getAccountState(stateInfo.state);
            if (response) {
                if ((stateInfo.requestType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken) || response.accessToken) {
                    if (window.parent !== window) {
                        this.logger.verbose("Window is in iframe, acquiring token silently");
                    }
                    else {
                        this.logger.verbose("acquiring token interactive in progress");
                    }
                    response.tokenType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ACCESS_TOKEN;
                }
                else if (stateInfo.requestType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].login) {
                    response.tokenType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN;
                }
                if (!parentCallback) {
                    this.authResponseHandler(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, response);
                    return;
                }
            }
            else if (!parentCallback) {
                this.cacheStorage.resetTempCacheItems(stateInfo.state);
                this.authErrorHandler(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].interactionTypeRedirect, authErr, Object(_AuthResponse__WEBPACK_IMPORTED_MODULE_23__["buildResponseStateOnly"])(accountState));
                return;
            }
            parentCallback(response, authErr);
        }
        catch (err) {
            this.logger.error("Error occurred in token received callback function: " + err);
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createErrorInCallbackFunction(err.toString());
        }
    };
    /**
     * @hidden
     * This method must be called for processing the response received from the STS. It extracts the hash, processes the token or error information and saves it in the cache. It then
     * calls the registered callbacks in case of redirect or resolves the promises with the result.
     * @param {string} [hash=window.location.hash] - Hash fragment of Url.
     */
    UserAgentApplication.prototype.handleAuthenticationResponse = function (hash) {
        // retrieve the hash
        var locationHash = hash || window.location.hash;
        // Check if the current flow is popup or hidden iframe
        var iframeWithHash = _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].getIframeWithHash(locationHash);
        var popUpWithHash = _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].getPopUpWithHash(locationHash);
        var isPopupOrIframe = !!(iframeWithHash || popUpWithHash);
        // if (window.parent !== window), by using self, window.parent becomes equal to window in getResponseState method specifically
        var stateInfo = this.getResponseState(locationHash);
        var tokenResponseCallback = null;
        this.logger.info("Returned from redirect url");
        // If parent window is the msal instance which opened the current window (iframe)
        if (isPopupOrIframe) {
            tokenResponseCallback = window.callbackMappedToRenewStates[stateInfo.state];
        }
        else {
            // Redirect cases
            tokenResponseCallback = null;
            // if set to navigate to loginRequest page post login
            if (this.config.auth.navigateToLoginRequestUrl) {
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].URL_HASH, locationHash);
                if (window.parent === window) {
                    var loginRequestUrl = this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].LOGIN_REQUEST + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie);
                    // Redirect to home page if login request url is null (real null or the string null)
                    if (!loginRequestUrl || loginRequestUrl === "null") {
                        this.logger.error("Unable to get valid login request url from cache, redirecting to home page");
                        window.location.href = "/";
                    }
                    else {
                        window.location.href = loginRequestUrl;
                    }
                }
                return;
            }
            else {
                window.location.hash = "";
            }
            if (!this.redirectCallbacksSet) {
                // We reached this point too early - cache hash, return and process in handleRedirectCallbacks
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].URL_HASH, locationHash);
                return;
            }
        }
        this.processCallBack(locationHash, stateInfo, tokenResponseCallback);
        // If current window is opener, close all windows
        if (isPopupOrIframe) {
            _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].closePopups();
        }
    };
    /**
     * @hidden
     * Creates a stateInfo object from the URL fragment and returns it.
     * @param {string} hash  -  Hash passed from redirect page
     * @returns {TokenResponse} an object created from the redirect response from AAD comprising of the keys - parameters, requestType, stateMatch, stateResponse and valid.
     * @ignore
     */
    UserAgentApplication.prototype.getResponseState = function (hash) {
        var parameters = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].deserializeHash(hash);
        var stateResponse;
        if (!parameters) {
            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Hash was not parsed correctly.");
        }
        if (parameters.hasOwnProperty("state")) {
            stateResponse = {
                requestType: _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].unknown,
                state: parameters.state,
                stateMatch: false
            };
        }
        else {
            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Hash does not contain state.");
        }
        /*
         * async calls can fire iframe and login request at the same time if developer does not use the API as expected
         * incoming callback needs to be looked up to find the request type
         */
        // loginRedirect
        if (stateResponse.state === this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].STATE_LOGIN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateResponse.state, this.inCookie) || stateResponse.state === this.silentAuthenticationState) { // loginRedirect
            stateResponse.requestType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].login;
            stateResponse.stateMatch = true;
            return stateResponse;
        }
        // acquireTokenRedirect
        else if (stateResponse.state === this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].STATE_ACQ_TOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateResponse.state, this.inCookie)) { // acquireTokenRedirect
            stateResponse.requestType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken;
            stateResponse.stateMatch = true;
            return stateResponse;
        }
        // external api requests may have many renewtoken requests for different resource
        if (!stateResponse.stateMatch) {
            stateResponse.requestType = window.requestType;
            var statesInParentContext = window.renewStates;
            for (var i = 0; i < statesInParentContext.length; i++) {
                if (statesInParentContext[i] === stateResponse.state) {
                    stateResponse.stateMatch = true;
                    break;
                }
            }
        }
        return stateResponse;
    };
    // #endregion
    // #region Token Processing (Extract to TokenProcessing.ts)
    /**
     * @hidden
     * Used to get token for the specified set of scopes from the cache
     * @param {@link ServerRequestParameters} - Request sent to the STS to obtain an id_token/access_token
     * @param {Account} account - Account for which the scopes were requested
     */
    UserAgentApplication.prototype.getCachedToken = function (serverAuthenticationRequest, account) {
        var accessTokenCacheItem = null;
        var scopes = serverAuthenticationRequest.scopes;
        // filter by clientId and account
        var tokenCacheItems = this.cacheStorage.getAllAccessTokens(this.clientId, account ? account.homeAccountIdentifier : null);
        // No match found after initial filtering
        if (tokenCacheItems.length === 0) {
            return null;
        }
        var filteredItems = [];
        // if no authority passed
        if (!serverAuthenticationRequest.authority) {
            // filter by scope
            for (var i = 0; i < tokenCacheItems.length; i++) {
                var cacheItem = tokenCacheItems[i];
                var cachedScopes = cacheItem.key.scopes.split(" ");
                if (_ScopeSet__WEBPACK_IMPORTED_MODULE_8__["ScopeSet"].containsScope(cachedScopes, scopes)) {
                    filteredItems.push(cacheItem);
                }
            }
            // if only one cached token found
            if (filteredItems.length === 1) {
                accessTokenCacheItem = filteredItems[0];
                serverAuthenticationRequest.authorityInstance = _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(accessTokenCacheItem.key.authority, this.config.auth.validateAuthority);
            }
            // if more than one cached token is found
            else if (filteredItems.length > 1) {
                throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createMultipleMatchingTokensInCacheError(scopes.toString());
            }
            // if no match found, check if there was a single authority used
            else {
                var authorityList = this.getUniqueAuthority(tokenCacheItems, "authority");
                if (authorityList.length > 1) {
                    throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createMultipleAuthoritiesInCacheError(scopes.toString());
                }
                serverAuthenticationRequest.authorityInstance = _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(authorityList[0], this.config.auth.validateAuthority);
            }
        }
        // if an authority is passed in the API
        else {
            // filter by authority and scope
            for (var i = 0; i < tokenCacheItems.length; i++) {
                var cacheItem = tokenCacheItems[i];
                var cachedScopes = cacheItem.key.scopes.split(" ");
                if (_ScopeSet__WEBPACK_IMPORTED_MODULE_8__["ScopeSet"].containsScope(cachedScopes, scopes) && _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].CanonicalizeUri(cacheItem.key.authority) === serverAuthenticationRequest.authority) {
                    filteredItems.push(cacheItem);
                }
            }
            // no match
            if (filteredItems.length === 0) {
                return null;
            }
            // if only one cachedToken Found
            else if (filteredItems.length === 1) {
                accessTokenCacheItem = filteredItems[0];
            }
            else {
                // if more than one cached token is found
                throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createMultipleMatchingTokensInCacheError(scopes.toString());
            }
        }
        if (accessTokenCacheItem != null) {
            var expired = Number(accessTokenCacheItem.value.expiresIn);
            // If expiration is within offset, it will force renew
            var offset = this.config.system.tokenRenewalOffsetSeconds || 300;
            if (expired && (expired > _utils_TimeUtils__WEBPACK_IMPORTED_MODULE_12__["TimeUtils"].now() + offset)) {
                var idTokenObj = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](accessTokenCacheItem.value.idToken);
                if (!account) {
                    account = this.getAccount();
                    if (!account) {
                        throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Account should not be null here.");
                    }
                }
                var aState = this.getAccountState(serverAuthenticationRequest.state);
                var response = {
                    uniqueId: "",
                    tenantId: "",
                    tokenType: (accessTokenCacheItem.value.idToken === accessTokenCacheItem.value.accessToken) ? _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN : _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ACCESS_TOKEN,
                    idToken: idTokenObj,
                    idTokenClaims: idTokenObj.claims,
                    accessToken: accessTokenCacheItem.value.accessToken,
                    scopes: accessTokenCacheItem.key.scopes.split(" "),
                    expiresOn: new Date(expired * 1000),
                    account: account,
                    accountState: aState,
                    fromCache: true
                };
                _utils_ResponseUtils__WEBPACK_IMPORTED_MODULE_15__["ResponseUtils"].setResponseIdToken(response, idTokenObj);
                return response;
            }
            else {
                this.cacheStorage.removeItem(JSON.stringify(filteredItems[0].key));
                return null;
            }
        }
        else {
            return null;
        }
    };
    /**
     * @hidden
     * Used to get a unique list of authorities from the cache
     * @param {Array<AccessTokenCacheItem>}  accessTokenCacheItems - accessTokenCacheItems saved in the cache
     * @ignore
     */
    UserAgentApplication.prototype.getUniqueAuthority = function (accessTokenCacheItems, property) {
        var authorityList = [];
        var flags = [];
        accessTokenCacheItems.forEach(function (element) {
            if (element.key.hasOwnProperty(property) && (flags.indexOf(element.key[property]) === -1)) {
                flags.push(element.key[property]);
                authorityList.push(element.key[property]);
            }
        });
        return authorityList;
    };
    /**
     * @hidden
     * Check if ADAL id_token exists and return if exists.
     *
     */
    UserAgentApplication.prototype.extractADALIdToken = function () {
        var adalIdToken = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].adalIdToken);
        if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(adalIdToken)) {
            return _utils_TokenUtils__WEBPACK_IMPORTED_MODULE_11__["TokenUtils"].extractIdToken(adalIdToken);
        }
        return null;
    };
    /**
     * @hidden
     * Acquires access token using a hidden iframe.
     * @ignore
     */
    UserAgentApplication.prototype.renewToken = function (scopes, resolve, reject, account, serverAuthenticationRequest) {
        var scope = scopes.join(" ").toLowerCase();
        this.logger.verbose("renewToken is called for scope:" + scope);
        var frameName = "msalRenewFrame" + scope;
        var frameHandle = _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].addHiddenIFrame(frameName, this.logger);
        this.updateCacheEntries(serverAuthenticationRequest, account);
        this.logger.verbose("Renew token Expected state: " + serverAuthenticationRequest.state);
        // Build urlNavigate with "prompt=none" and navigate to URL in hidden iFrame
        var urlNavigate = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].urlRemoveQueryStringParameter(_utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].createNavigateUrl(serverAuthenticationRequest), _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].prompt) + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].prompt_none + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].response_mode_fragment;
        window.renewStates.push(serverAuthenticationRequest.state);
        window.requestType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken;
        this.registerCallback(serverAuthenticationRequest.state, scope, resolve, reject);
        this.logger.infoPii("Navigate to:" + urlNavigate);
        frameHandle.src = "about:blank";
        this.loadIframeTimeout(urlNavigate, frameName, scope).catch(function (error) { return reject(error); });
    };
    /**
     * @hidden
     * Renews idtoken for app's own backend when clientId is passed as a single scope in the scopes array.
     * @ignore
     */
    UserAgentApplication.prototype.renewIdToken = function (scopes, resolve, reject, account, serverAuthenticationRequest) {
        this.logger.info("renewidToken is called");
        var frameName = "msalIdTokenFrame";
        var frameHandle = _utils_WindowUtils__WEBPACK_IMPORTED_MODULE_10__["WindowUtils"].addHiddenIFrame(frameName, this.logger);
        this.updateCacheEntries(serverAuthenticationRequest, account);
        this.logger.verbose("Renew Idtoken Expected state: " + serverAuthenticationRequest.state);
        // Build urlNavigate with "prompt=none" and navigate to URL in hidden iFrame
        var urlNavigate = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].urlRemoveQueryStringParameter(_utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].createNavigateUrl(serverAuthenticationRequest), _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].prompt) + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].prompt_none + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].response_mode_fragment;
        if (this.silentLogin) {
            window.requestType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].login;
            this.silentAuthenticationState = serverAuthenticationRequest.state;
        }
        else {
            window.requestType = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken;
            window.renewStates.push(serverAuthenticationRequest.state);
        }
        // note: scope here is clientId
        this.registerCallback(serverAuthenticationRequest.state, this.clientId, resolve, reject);
        this.logger.infoPii("Navigate to:" + urlNavigate);
        frameHandle.src = "about:blank";
        this.loadIframeTimeout(urlNavigate, frameName, this.clientId).catch(function (error) { return reject(error); });
    };
    /**
     * @hidden
     *
     * This method must be called for processing the response received from AAD. It extracts the hash, processes the token or error, saves it in the cache and calls the registered callbacks with the result.
     * @param {string} authority authority received in the redirect response from AAD.
     * @param {TokenResponse} requestInfo an object created from the redirect response from AAD comprising of the keys - parameters, requestType, stateMatch, stateResponse and valid.
     * @param {Account} account account object for which scopes are consented for. The default account is the logged in account.
     * @param {ClientInfo} clientInfo clientInfo received as part of the response comprising of fields uid and utid.
     * @param {IdToken} idToken idToken received as part of the response.
     * @ignore
     * @private
     */
    /* tslint:disable:no-string-literal */
    UserAgentApplication.prototype.saveAccessToken = function (response, authority, parameters, clientInfo, idTokenObj) {
        var scope;
        var accessTokenResponse = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, response);
        var clientObj = new _ClientInfo__WEBPACK_IMPORTED_MODULE_4__["ClientInfo"](clientInfo);
        var expiration;
        // if the response contains "scope"
        if (parameters.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].SCOPE)) {
            // read the scopes
            scope = parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].SCOPE];
            var consentedScopes = scope.split(" ");
            // retrieve all access tokens from the cache, remove the dup scores
            var accessTokenCacheItems = this.cacheStorage.getAllAccessTokens(this.clientId, authority);
            for (var i = 0; i < accessTokenCacheItems.length; i++) {
                var accessTokenCacheItem = accessTokenCacheItems[i];
                if (accessTokenCacheItem.key.homeAccountIdentifier === response.account.homeAccountIdentifier) {
                    var cachedScopes = accessTokenCacheItem.key.scopes.split(" ");
                    if (_ScopeSet__WEBPACK_IMPORTED_MODULE_8__["ScopeSet"].isIntersectingScopes(cachedScopes, consentedScopes)) {
                        this.cacheStorage.removeItem(JSON.stringify(accessTokenCacheItem.key));
                    }
                }
            }
            // Generate and cache accessTokenKey and accessTokenValue
            var expiresIn = _utils_TimeUtils__WEBPACK_IMPORTED_MODULE_12__["TimeUtils"].parseExpiresIn(parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].EXPIRES_IN]);
            expiration = _utils_TimeUtils__WEBPACK_IMPORTED_MODULE_12__["TimeUtils"].now() + expiresIn;
            var accessTokenKey = new _cache_AccessTokenKey__WEBPACK_IMPORTED_MODULE_1__["AccessTokenKey"](authority, this.clientId, scope, clientObj.uid, clientObj.utid);
            var accessTokenValue = new _cache_AccessTokenValue__WEBPACK_IMPORTED_MODULE_2__["AccessTokenValue"](parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ACCESS_TOKEN], idTokenObj.rawIdToken, expiration.toString(), clientInfo);
            this.cacheStorage.setItem(JSON.stringify(accessTokenKey), JSON.stringify(accessTokenValue));
            accessTokenResponse.accessToken = parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ACCESS_TOKEN];
            accessTokenResponse.scopes = consentedScopes;
        }
        // if the response does not contain "scope" - scope is usually client_id and the token will be id_token
        else {
            scope = this.clientId;
            // Generate and cache accessTokenKey and accessTokenValue
            var accessTokenKey = new _cache_AccessTokenKey__WEBPACK_IMPORTED_MODULE_1__["AccessTokenKey"](authority, this.clientId, scope, clientObj.uid, clientObj.utid);
            expiration = Number(idTokenObj.expiration);
            var accessTokenValue = new _cache_AccessTokenValue__WEBPACK_IMPORTED_MODULE_2__["AccessTokenValue"](parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN], parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN], expiration.toString(), clientInfo);
            this.cacheStorage.setItem(JSON.stringify(accessTokenKey), JSON.stringify(accessTokenValue));
            accessTokenResponse.scopes = [scope];
            accessTokenResponse.accessToken = parameters[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN];
        }
        if (expiration) {
            accessTokenResponse.expiresOn = new Date(expiration * 1000);
        }
        else {
            this.logger.error("Could not parse expiresIn parameter");
        }
        return accessTokenResponse;
    };
    /**
     * @hidden
     * Saves token or error received in the response from AAD in the cache. In case of id_token, it also creates the account object.
     * @ignore
     */
    UserAgentApplication.prototype.saveTokenFromHash = function (hash, stateInfo) {
        this.logger.info("State status:" + stateInfo.stateMatch + "; Request type:" + stateInfo.requestType);
        var response = {
            uniqueId: "",
            tenantId: "",
            tokenType: "",
            idToken: null,
            idTokenClaims: null,
            accessToken: null,
            scopes: [],
            expiresOn: null,
            account: null,
            accountState: "",
            fromCache: false
        };
        var error;
        var hashParams = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].deserializeHash(hash);
        var authorityKey = "";
        var acquireTokenAccountKey = "";
        var idTokenObj = null;
        // If server returns an error
        if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION) || hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR)) {
            this.logger.infoPii("Error :" + hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR] + "; Error description:" + hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION]);
            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR, hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR]);
            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR_DESC, hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION]);
            // login
            if (stateInfo.requestType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].login) {
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].LOGIN_ERROR, hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION] + ":" + hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR]);
                authorityKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAuthorityKey(stateInfo.state);
            }
            // acquireToken
            if (stateInfo.requestType === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].renewToken) {
                authorityKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAuthorityKey(stateInfo.state);
                var account = this.getAccount();
                var accountId = void 0;
                if (account && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(account.homeAccountIdentifier)) {
                    accountId = account.homeAccountIdentifier;
                }
                else {
                    accountId = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].no_account;
                }
                acquireTokenAccountKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAcquireTokenAccountKey(accountId, stateInfo.state);
            }
            var _a = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR, hashErr = hashParams[_a], _b = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION, hashErrDesc = hashParams[_b];
            if (_error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_22__["InteractionRequiredAuthError"].isInteractionRequiredError(hashErr) ||
                _error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_22__["InteractionRequiredAuthError"].isInteractionRequiredError(hashErrDesc)) {
                error = new _error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_22__["InteractionRequiredAuthError"](hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR], hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION]);
            }
            else {
                error = new _error_ServerError__WEBPACK_IMPORTED_MODULE_21__["ServerError"](hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR], hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ERROR_DESCRIPTION]);
            }
        }
        // If the server returns "Success"
        else {
            // Verify the state from redirect and record tokens to storage if exists
            if (stateInfo.stateMatch) {
                this.logger.info("State is right");
                if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].SESSION_STATE)) {
                    this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].SESSION_STATE + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].SESSION_STATE]);
                }
                response.accountState = this.getAccountState(stateInfo.state);
                var clientInfo = "";
                // Process access_token
                if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ACCESS_TOKEN)) {
                    this.logger.info("Fragment has access token");
                    // retrieve the id_token from response if present
                    if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN)) {
                        idTokenObj = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN]);
                        response.idToken = idTokenObj;
                        response.idTokenClaims = idTokenObj.claims;
                    }
                    else {
                        idTokenObj = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["PersistentCacheKeys"].IDTOKEN));
                        response = _utils_ResponseUtils__WEBPACK_IMPORTED_MODULE_15__["ResponseUtils"].setResponseIdToken(response, idTokenObj);
                    }
                    // set authority
                    var authority = this.populateAuthority(stateInfo.state, this.inCookie, this.cacheStorage, idTokenObj);
                    // retrieve client_info - if it is not found, generate the uid and utid from idToken
                    if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].CLIENT_INFO)) {
                        clientInfo = hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].CLIENT_INFO];
                    }
                    else {
                        this.logger.warning("ClientInfo not received in the response from AAD");
                        throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createClientInfoNotPopulatedError("ClientInfo not received in the response from the server");
                    }
                    response.account = _Account__WEBPACK_IMPORTED_MODULE_7__["Account"].createAccount(idTokenObj, new _ClientInfo__WEBPACK_IMPORTED_MODULE_4__["ClientInfo"](clientInfo));
                    var accountKey = void 0;
                    if (response.account && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(response.account.homeAccountIdentifier)) {
                        accountKey = response.account.homeAccountIdentifier;
                    }
                    else {
                        accountKey = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].no_account;
                    }
                    acquireTokenAccountKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAcquireTokenAccountKey(accountKey, stateInfo.state);
                    var acquireTokenAccountKey_noaccount = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAcquireTokenAccountKey(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].no_account, stateInfo.state);
                    var cachedAccount = this.cacheStorage.getItem(acquireTokenAccountKey);
                    var acquireTokenAccount = void 0;
                    // Check with the account in the Cache
                    if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(cachedAccount)) {
                        acquireTokenAccount = JSON.parse(cachedAccount);
                        if (response.account && acquireTokenAccount && _Account__WEBPACK_IMPORTED_MODULE_7__["Account"].compareAccounts(response.account, acquireTokenAccount)) {
                            response = this.saveAccessToken(response, authority, hashParams, clientInfo, idTokenObj);
                            this.logger.info("The user object received in the response is the same as the one passed in the acquireToken request");
                        }
                        else {
                            this.logger.warning("The account object created from the response is not the same as the one passed in the acquireToken request");
                        }
                    }
                    else if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(this.cacheStorage.getItem(acquireTokenAccountKey_noaccount))) {
                        response = this.saveAccessToken(response, authority, hashParams, clientInfo, idTokenObj);
                    }
                }
                // Process id_token
                if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN)) {
                    this.logger.info("Fragment has id token");
                    // set the idToken
                    idTokenObj = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN]);
                    response = _utils_ResponseUtils__WEBPACK_IMPORTED_MODULE_15__["ResponseUtils"].setResponseIdToken(response, idTokenObj);
                    if (hashParams.hasOwnProperty(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].CLIENT_INFO)) {
                        clientInfo = hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].CLIENT_INFO];
                    }
                    else {
                        this.logger.warning("ClientInfo not received in the response from AAD");
                    }
                    // set authority
                    var authority = this.populateAuthority(stateInfo.state, this.inCookie, this.cacheStorage, idTokenObj);
                    this.account = _Account__WEBPACK_IMPORTED_MODULE_7__["Account"].createAccount(idTokenObj, new _ClientInfo__WEBPACK_IMPORTED_MODULE_4__["ClientInfo"](clientInfo));
                    response.account = this.account;
                    if (idTokenObj && idTokenObj.nonce) {
                        // check nonce integrity if idToken has nonce - throw an error if not matched
                        if (idTokenObj.nonce !== this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].NONCE_IDTOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie)) {
                            this.account = null;
                            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].LOGIN_ERROR, "Nonce Mismatch. Expected Nonce: " + this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].NONCE_IDTOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie) + "," + "Actual Nonce: " + idTokenObj.nonce);
                            this.logger.error("Nonce Mismatch.Expected Nonce: " + this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].NONCE_IDTOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie) + "," + "Actual Nonce: " + idTokenObj.nonce);
                            error = _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createNonceMismatchError(this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].NONCE_IDTOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie), idTokenObj.nonce);
                        }
                        // Save the token
                        else {
                            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["PersistentCacheKeys"].IDTOKEN, hashParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ServerHashParamKeys"].ID_TOKEN]);
                            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["PersistentCacheKeys"].CLIENT_INFO, clientInfo);
                            // Save idToken as access token for app itself
                            this.saveAccessToken(response, authority, hashParams, clientInfo, idTokenObj);
                        }
                    }
                    else {
                        authorityKey = stateInfo.state;
                        acquireTokenAccountKey = stateInfo.state;
                        this.logger.error("Invalid id_token received in the response");
                        error = _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createInvalidIdTokenError(idTokenObj);
                        this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR, error.errorCode);
                        this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR_DESC, error.errorMessage);
                    }
                }
            }
            // State mismatch - unexpected/invalid state
            else {
                authorityKey = stateInfo.state;
                acquireTokenAccountKey = stateInfo.state;
                var expectedState = this.cacheStorage.getItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].STATE_LOGIN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state, this.inCookie);
                this.logger.error("State Mismatch.Expected State: " + expectedState + "," + "Actual State: " + stateInfo.state);
                error = _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_20__["ClientAuthError"].createInvalidStateError(stateInfo.state, expectedState);
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR, error.errorCode);
                this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["ErrorCacheKeys"].ERROR_DESC, error.errorMessage);
            }
        }
        // Set status to completed
        this.cacheStorage.removeItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].RENEW_STATUS + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + stateInfo.state);
        this.cacheStorage.resetTempCacheItems(stateInfo.state);
        // this is required if navigateToLoginRequestUrl=false
        if (this.inCookie) {
            this.cacheStorage.setItemCookie(authorityKey, "", -1);
            this.cacheStorage.clearMsalCookie(stateInfo.state);
        }
        if (error) {
            // Error case, set status to cancelled
            throw error;
        }
        if (!response) {
            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_19__["AuthError"].createUnexpectedError("Response is null");
        }
        return response;
    };
    /**
     * Set Authority when saving Token from the hash
     * @param state
     * @param inCookie
     * @param cacheStorage
     * @param idTokenObj
     * @param response
     */
    UserAgentApplication.prototype.populateAuthority = function (state, inCookie, cacheStorage, idTokenObj) {
        var authorityKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAuthorityKey(state);
        var cachedAuthority = cacheStorage.getItem(authorityKey, inCookie);
        // retrieve the authority from cache and replace with tenantID
        return _utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(cachedAuthority) ? cachedAuthority : _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].replaceTenantPath(cachedAuthority, idTokenObj.tenantId);
    };
    /* tslint:enable:no-string-literal */
    // #endregion
    // #region Account
    /**
     * Returns the signed in account
     * (the account object is created at the time of successful login)
     * or null when no state is found
     * @returns {@link Account} - the account object stored in MSAL
     */
    UserAgentApplication.prototype.getAccount = function () {
        // if a session already exists, get the account from the session
        if (this.account) {
            return this.account;
        }
        // frame is used to get idToken and populate the account for the given session
        var rawIdToken = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["PersistentCacheKeys"].IDTOKEN);
        var rawClientInfo = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["PersistentCacheKeys"].CLIENT_INFO);
        if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(rawIdToken) && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(rawClientInfo)) {
            var idToken = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](rawIdToken);
            var clientInfo = new _ClientInfo__WEBPACK_IMPORTED_MODULE_4__["ClientInfo"](rawClientInfo);
            this.account = _Account__WEBPACK_IMPORTED_MODULE_7__["Account"].createAccount(idToken, clientInfo);
            return this.account;
        }
        // if login not yet done, return null
        return null;
    };
    /**
     * @hidden
     *
     * Extracts state value from the accountState sent with the authentication request.
     * @returns {string} scope.
     * @ignore
     */
    UserAgentApplication.prototype.getAccountState = function (state) {
        if (state) {
            var splitIndex = state.indexOf("|");
            if (splitIndex > -1 && splitIndex + 1 < state.length) {
                return state.substring(splitIndex + 1);
            }
        }
        return state;
    };
    /**
     * Use to get a list of unique accounts in MSAL cache based on homeAccountIdentifier.
     *
     * @param {@link Array<Account>} Account - all unique accounts in MSAL cache.
     */
    UserAgentApplication.prototype.getAllAccounts = function () {
        var accounts = [];
        var accessTokenCacheItems = this.cacheStorage.getAllAccessTokens(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].clientId, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].homeAccountIdentifier);
        for (var i = 0; i < accessTokenCacheItems.length; i++) {
            var idToken = new _IdToken__WEBPACK_IMPORTED_MODULE_5__["IdToken"](accessTokenCacheItems[i].value.idToken);
            var clientInfo = new _ClientInfo__WEBPACK_IMPORTED_MODULE_4__["ClientInfo"](accessTokenCacheItems[i].value.homeAccountIdentifier);
            var account = _Account__WEBPACK_IMPORTED_MODULE_7__["Account"].createAccount(idToken, clientInfo);
            accounts.push(account);
        }
        return this.getUniqueAccounts(accounts);
    };
    /**
     * @hidden
     *
     * Used to filter accounts based on homeAccountIdentifier
     * @param {Array<Account>}  Accounts - accounts saved in the cache
     * @ignore
     */
    UserAgentApplication.prototype.getUniqueAccounts = function (accounts) {
        if (!accounts || accounts.length <= 1) {
            return accounts;
        }
        var flags = [];
        var uniqueAccounts = [];
        for (var index = 0; index < accounts.length; ++index) {
            if (accounts[index].homeAccountIdentifier && flags.indexOf(accounts[index].homeAccountIdentifier) === -1) {
                flags.push(accounts[index].homeAccountIdentifier);
                uniqueAccounts.push(accounts[index]);
            }
        }
        return uniqueAccounts;
    };
    // #endregion
    // #region Angular
    /**
     * @hidden
     *
     * Broadcast messages - Used only for Angular?  *
     * @param eventName
     * @param data
     */
    UserAgentApplication.prototype.broadcast = function (eventName, data) {
        var evt = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(evt);
    };
    /**
     * @hidden
     *
     * Helper function to retrieve the cached token
     *
     * @param scopes
     * @param {@link Account} account
     * @param state
     * @return {@link AuthResponse} AuthResponse
     */
    UserAgentApplication.prototype.getCachedTokenInternal = function (scopes, account, state, correlationId) {
        // Get the current session's account object
        var accountObject = account || this.getAccount();
        if (!accountObject) {
            return null;
        }
        // Construct AuthenticationRequest based on response type; set "redirectUri" from the "request" which makes this call from Angular - for this.getRedirectUri()
        var newAuthority = this.authorityInstance ? this.authorityInstance : _authority_AuthorityFactory__WEBPACK_IMPORTED_MODULE_16__["AuthorityFactory"].CreateInstance(this.authority, this.config.auth.validateAuthority);
        var responseType = this.getTokenType(accountObject, scopes, true);
        var serverAuthenticationRequest = new _ServerRequestParameters__WEBPACK_IMPORTED_MODULE_3__["ServerRequestParameters"](newAuthority, this.clientId, responseType, this.getRedirectUri(), scopes, state, correlationId);
        // get cached token
        return this.getCachedToken(serverAuthenticationRequest, account);
    };
    /**
     * @hidden
     *
     * Get scopes for the Endpoint - Used in Angular to track protected and unprotected resources without interaction from the developer app
     * Note: Please check if we need to set the "redirectUri" from the "request" which makes this call from Angular - for this.getRedirectUri()
     *
     * @param endpoint
     */
    UserAgentApplication.prototype.getScopesForEndpoint = function (endpoint) {
        // if user specified list of unprotectedResources, no need to send token to these endpoints, return null.
        if (this.config.framework.unprotectedResources.length > 0) {
            for (var i = 0; i < this.config.framework.unprotectedResources.length; i++) {
                if (endpoint.indexOf(this.config.framework.unprotectedResources[i]) > -1) {
                    return null;
                }
            }
        }
        // process all protected resources and send the matched one
        if (this.config.framework.protectedResourceMap.size > 0) {
            for (var _i = 0, _a = Array.from(this.config.framework.protectedResourceMap.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                // configEndpoint is like /api/Todo requested endpoint can be /api/Todo/1
                if (endpoint.indexOf(key) > -1) {
                    return this.config.framework.protectedResourceMap.get(key);
                }
            }
        }
        /*
         * default resource will be clientid if nothing specified
         * App will use idtoken for calls to itself
         * check if it's staring from http or https, needs to match with app host
         */
        if (endpoint.indexOf("http://") > -1 || endpoint.indexOf("https://") > -1) {
            if (_utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].getHostFromUri(endpoint) === _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].getHostFromUri(this.getRedirectUri())) {
                return new Array(this.clientId);
            }
        }
        else {
            /*
             * in angular level, the url for $http interceptor call could be relative url,
             * if it's relative call, we'll treat it as app backend call.
             */
            return new Array(this.clientId);
        }
        // if not the app's own backend or not a domain listed in the endpoints structure
        return null;
    };
    /**
     * Return boolean flag to developer to help inform if login is in progress
     * @returns {boolean} true/false
     */
    UserAgentApplication.prototype.getLoginInProgress = function () {
        var pendingCallback = this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].URL_HASH);
        if (pendingCallback) {
            return true;
        }
        return this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS) === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress;
    };
    /**
     * @hidden
     * @ignore
     *
     * @param loginInProgress
     */
    UserAgentApplication.prototype.setInteractionInProgress = function (inProgress) {
        if (inProgress) {
            this.cacheStorage.setItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS, _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress);
        }
        else {
            this.cacheStorage.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS);
        }
    };
    /**
     * @hidden
     * @ignore
     *
     * @param loginInProgress
     */
    UserAgentApplication.prototype.setloginInProgress = function (loginInProgress) {
        this.setInteractionInProgress(loginInProgress);
    };
    /**
     * @hidden
     * @ignore
     *
     * returns the status of acquireTokenInProgress
     */
    UserAgentApplication.prototype.getAcquireTokenInProgress = function () {
        return this.cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].INTERACTION_STATUS) === _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].inProgress;
    };
    /**
     * @hidden
     * @ignore
     *
     * @param acquireTokenInProgress
     */
    UserAgentApplication.prototype.setAcquireTokenInProgress = function (acquireTokenInProgress) {
        this.setInteractionInProgress(acquireTokenInProgress);
    };
    /**
     * @hidden
     * @ignore
     *
     * returns the logger handle
     */
    UserAgentApplication.prototype.getLogger = function () {
        return this.config.system.logger;
    };
    // #endregion
    // #region Getters and Setters
    /**
     * Use to get the redirect uri configured in MSAL or null.
     * Evaluates redirectUri if its a function, otherwise simply returns its value.
     *
     * @returns {string} redirect URL
     */
    UserAgentApplication.prototype.getRedirectUri = function (reqRedirectUri) {
        if (reqRedirectUri) {
            return reqRedirectUri;
        }
        else if (typeof this.config.auth.redirectUri === "function") {
            return this.config.auth.redirectUri();
        }
        return this.config.auth.redirectUri;
    };
    /**
     * Use to get the post logout redirect uri configured in MSAL or null.
     * Evaluates postLogoutredirectUri if its a function, otherwise simply returns its value.
     *
     * @returns {string} post logout redirect URL
     */
    UserAgentApplication.prototype.getPostLogoutRedirectUri = function () {
        if (typeof this.config.auth.postLogoutRedirectUri === "function") {
            return this.config.auth.postLogoutRedirectUri();
        }
        return this.config.auth.postLogoutRedirectUri;
    };
    /**
     * Use to get the current {@link Configuration} object in MSAL
     *
     * @returns {@link Configuration}
     */
    UserAgentApplication.prototype.getCurrentConfiguration = function () {
        if (!this.config) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_18__["ClientConfigurationError"].createNoSetConfigurationError();
        }
        return this.config;
    };
    /**
     * @ignore
     *
     * Utils function to create the Authentication
     * @param {@link account} account object
     * @param scopes
     * @param silentCall
     *
     * @returns {string} token type: id_token or access_token
     *
     */
    UserAgentApplication.prototype.getTokenType = function (accountObject, scopes, silentCall) {
        /*
         * if account is passed and matches the account object/or set to getAccount() from cache
         * if client-id is passed as scope, get id_token else token/id_token_token (in case no session exists)
         */
        var tokenType;
        // acquireTokenSilent
        if (silentCall) {
            if (_Account__WEBPACK_IMPORTED_MODULE_7__["Account"].compareAccounts(accountObject, this.getAccount())) {
                tokenType = (scopes.indexOf(this.config.auth.clientId) > -1) ? ResponseTypes.id_token : ResponseTypes.token;
            }
            else {
                tokenType = (scopes.indexOf(this.config.auth.clientId) > -1) ? ResponseTypes.id_token : ResponseTypes.id_token_token;
            }
            return tokenType;
        }
        // all other cases
        else {
            if (!_Account__WEBPACK_IMPORTED_MODULE_7__["Account"].compareAccounts(accountObject, this.getAccount())) {
                tokenType = ResponseTypes.id_token_token;
            }
            else {
                tokenType = (scopes.indexOf(this.clientId) > -1) ? ResponseTypes.id_token : ResponseTypes.token;
            }
            return tokenType;
        }
    };
    /**
     * @hidden
     * @ignore
     *
     * Sets the cachekeys for and stores the account information in cache
     * @param account
     * @param state
     * @hidden
     */
    UserAgentApplication.prototype.setAccountCache = function (account, state) {
        // Cache acquireTokenAccountKey
        var accountId = account ? this.getAccountId(account) : _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].no_account;
        var acquireTokenAccountKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAcquireTokenAccountKey(accountId, state);
        this.cacheStorage.setItem(acquireTokenAccountKey, JSON.stringify(account));
    };
    /**
     * @hidden
     * @ignore
     *
     * Sets the cacheKey for and stores the authority information in cache
     * @param state
     * @param authority
     * @hidden
     */
    UserAgentApplication.prototype.setAuthorityCache = function (state, authority) {
        // Cache authorityKey
        var authorityKey = _cache_AuthCache__WEBPACK_IMPORTED_MODULE_6__["AuthCache"].generateAuthorityKey(state);
        this.cacheStorage.setItem(authorityKey, _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_13__["UrlUtils"].CanonicalizeUri(authority), this.inCookie);
    };
    /**
     * Updates account, authority, and nonce in cache
     * @param serverAuthenticationRequest
     * @param account
     * @hidden
     * @ignore
     */
    UserAgentApplication.prototype.updateCacheEntries = function (serverAuthenticationRequest, account, loginStartPage) {
        // Cache account and authority
        if (loginStartPage) {
            // Cache the state, nonce, and login request data
            this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].LOGIN_REQUEST + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + serverAuthenticationRequest.state, loginStartPage, this.inCookie);
            this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].STATE_LOGIN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + serverAuthenticationRequest.state, serverAuthenticationRequest.state, this.inCookie);
        }
        else {
            this.setAccountCache(account, serverAuthenticationRequest.state);
        }
        // Cache authorityKey
        this.setAuthorityCache(serverAuthenticationRequest.state, serverAuthenticationRequest.authority);
        // Cache nonce
        this.cacheStorage.setItem("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["TemporaryCacheKeys"].NONCE_IDTOKEN + _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].resourceDelimiter + serverAuthenticationRequest.state, serverAuthenticationRequest.nonce, this.inCookie);
    };
    /**
     * Returns the unique identifier for the logged in account
     * @param account
     * @hidden
     * @ignore
     */
    UserAgentApplication.prototype.getAccountId = function (account) {
        // return `${account.accountIdentifier}` + Constants.resourceDelimiter + `${account.homeAccountIdentifier}`;
        var accountId;
        if (!_utils_StringUtils__WEBPACK_IMPORTED_MODULE_9__["StringUtils"].isEmpty(account.homeAccountIdentifier)) {
            accountId = account.homeAccountIdentifier;
        }
        else {
            accountId = _utils_Constants__WEBPACK_IMPORTED_MODULE_25__["Constants"].no_account;
        }
        return accountId;
    };
    /**
     * @ignore
     * @param extraQueryParameters
     *
     * Construct 'tokenRequest' from the available data in adalIdToken
     */
    UserAgentApplication.prototype.buildIDTokenRequest = function (request) {
        var tokenRequest = {
            scopes: [this.clientId],
            authority: this.authority,
            account: this.getAccount(),
            extraQueryParameters: request.extraQueryParameters
        };
        return tokenRequest;
    };
    /**
     * @ignore
     * @param config
     * @param clientId
     *
     * Construct TelemetryManager from Configuration
     */
    UserAgentApplication.prototype.getTelemetryManagerFromConfig = function (config, clientId) {
        if (!config) { // if unset
            return null;
        }
        // if set then validate
        var applicationName = config.applicationName, applicationVersion = config.applicationVersion, telemetryEmitter = config.telemetryEmitter;
        if (!applicationName || !applicationVersion || !telemetryEmitter) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_18__["ClientConfigurationError"].createTelemetryConfigError(config);
        }
        // if valid then construct
        var telemetryPlatform = {
            sdk: "msal.js",
            sdkVersion: Object(_utils_Constants__WEBPACK_IMPORTED_MODULE_25__["libraryVersion"])(),
            applicationName: applicationName,
            applicationVersion: applicationVersion
        };
        var telemetryManagerConfig = {
            platform: telemetryPlatform,
            clientId: clientId
        };
        return new _telemetry_TelemetryManager__WEBPACK_IMPORTED_MODULE_24__["default"](telemetryManagerConfig, telemetryEmitter);
    };
    return UserAgentApplication;
}());

//# sourceMappingURL=UserAgentApplication.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/XHRClient.js":
/*!************************************************!*\
  !*** ./node_modules/msal/lib-es6/XHRClient.js ***!
  \************************************************/
/*! exports provided: XhrClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XhrClient", function() { return XhrClient; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * XHR client for JSON endpoints
 * https://www.npmjs.com/package/async-promise
 * @hidden
 */
var XhrClient = /** @class */ (function () {
    function XhrClient() {
    }
    XhrClient.prototype.sendRequestAsync = function (url, method, enableCaching) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url, /* async: */ true);
            if (enableCaching) {
                /*
                 * TODO: (shivb) ensure that this can be cached
                 * xhr.setRequestHeader("Cache-Control", "Public");
                 */
            }
            xhr.onload = function (ev) {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject(_this.handleError(xhr.responseText));
                }
                var jsonResponse;
                try {
                    jsonResponse = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    reject(_this.handleError(xhr.responseText));
                }
                resolve(jsonResponse);
            };
            xhr.onerror = function (ev) {
                reject(xhr.status);
            };
            if (method === "GET") {
                xhr.send();
            }
            else {
                throw "not implemented";
            }
        });
    };
    XhrClient.prototype.handleError = function (responseText) {
        var jsonResponse;
        try {
            jsonResponse = JSON.parse(responseText);
            if (jsonResponse.error) {
                return jsonResponse.error;
            }
            else {
                throw responseText;
            }
        }
        catch (e) {
            return responseText;
        }
    };
    return XhrClient;
}());

//# sourceMappingURL=XHRClient.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/authority/AadAuthority.js":
/*!*************************************************************!*\
  !*** ./node_modules/msal/lib-es6/authority/AadAuthority.js ***!
  \*************************************************************/
/*! exports provided: AadAuthority */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AadAuthority", function() { return AadAuthority; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _Authority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Authority */ "./node_modules/msal/lib-es6/authority/Authority.js");
/* harmony import */ var _XHRClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../XHRClient */ "./node_modules/msal/lib-es6/XHRClient.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */




/**
 * @hidden
 */
var AadAuthority = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AadAuthority, _super);
    function AadAuthority(authority, validateAuthority) {
        return _super.call(this, authority, validateAuthority) || this;
    }
    Object.defineProperty(AadAuthority.prototype, "AadInstanceDiscoveryEndpointUrl", {
        get: function () {
            return AadAuthority.AadInstanceDiscoveryEndpoint + "?api-version=1.0&authorization_endpoint=" + this.CanonicalAuthority + "oauth2/v2.0/authorize";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AadAuthority.prototype, "AuthorityType", {
        get: function () {
            return _Authority__WEBPACK_IMPORTED_MODULE_1__["AuthorityType"].Aad;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a promise which resolves to the OIDC endpoint
     * Only responds with the endpoint
     */
    AadAuthority.prototype.GetOpenIdConfigurationEndpointAsync = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var client;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                if (!this.IsValidationEnabled || this.IsInTrustedHostList(this.CanonicalAuthorityUrlComponents.HostNameAndPort)) {
                    return [2 /*return*/, this.DefaultOpenIdConfigurationEndpoint];
                }
                client = new _XHRClient__WEBPACK_IMPORTED_MODULE_2__["XhrClient"]();
                return [2 /*return*/, client.sendRequestAsync(this.AadInstanceDiscoveryEndpointUrl, "GET", true)
                        .then(function (response) {
                        return response.tenant_discovery_endpoint;
                    })];
            });
        });
    };
    /**
     * Checks to see if the host is in a list of trusted hosts
     * @param {string} The host to look up
     */
    AadAuthority.prototype.IsInTrustedHostList = function (host) {
        return _utils_Constants__WEBPACK_IMPORTED_MODULE_3__["AADTrustedHostList"][host.toLowerCase()];
    };
    AadAuthority.AadInstanceDiscoveryEndpoint = "https://login.microsoftonline.com/common/discovery/instance";
    return AadAuthority;
}(_Authority__WEBPACK_IMPORTED_MODULE_1__["Authority"]));

//# sourceMappingURL=AadAuthority.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/authority/Authority.js":
/*!**********************************************************!*\
  !*** ./node_modules/msal/lib-es6/authority/Authority.js ***!
  \**********************************************************/
/*! exports provided: AuthorityType, Authority */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthorityType", function() { return AuthorityType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Authority", function() { return Authority; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _XHRClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../XHRClient */ "./node_modules/msal/lib-es6/XHRClient.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */




/**
 * @hidden
 */
var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["Aad"] = 0] = "Aad";
    AuthorityType[AuthorityType["Adfs"] = 1] = "Adfs";
    AuthorityType[AuthorityType["B2C"] = 2] = "B2C";
})(AuthorityType || (AuthorityType = {}));
/**
 * @hidden
 */
var Authority = /** @class */ (function () {
    function Authority(authority, validateAuthority) {
        this.IsValidationEnabled = validateAuthority;
        this.CanonicalAuthority = authority;
        this.validateAsUri();
    }
    Object.defineProperty(Authority.prototype, "Tenant", {
        get: function () {
            return this.CanonicalAuthorityUrlComponents.PathSegments[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authority.prototype, "AuthorizationEndpoint", {
        get: function () {
            this.validateResolved();
            return this.tenantDiscoveryResponse.AuthorizationEndpoint.replace("{tenant}", this.Tenant);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authority.prototype, "EndSessionEndpoint", {
        get: function () {
            this.validateResolved();
            return this.tenantDiscoveryResponse.EndSessionEndpoint.replace("{tenant}", this.Tenant);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authority.prototype, "SelfSignedJwtAudience", {
        get: function () {
            this.validateResolved();
            return this.tenantDiscoveryResponse.Issuer.replace("{tenant}", this.Tenant);
        },
        enumerable: true,
        configurable: true
    });
    Authority.prototype.validateResolved = function () {
        if (!this.tenantDiscoveryResponse) {
            throw "Please call ResolveEndpointsAsync first";
        }
    };
    Object.defineProperty(Authority.prototype, "CanonicalAuthority", {
        /**
         * A URL that is the authority set by the developer
         */
        get: function () {
            return this.canonicalAuthority;
        },
        set: function (url) {
            this.canonicalAuthority = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_3__["UrlUtils"].CanonicalizeUri(url);
            this.canonicalAuthorityUrlComponents = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authority.prototype, "CanonicalAuthorityUrlComponents", {
        get: function () {
            if (!this.canonicalAuthorityUrlComponents) {
                this.canonicalAuthorityUrlComponents = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_3__["UrlUtils"].GetUrlComponents(this.CanonicalAuthority);
            }
            return this.canonicalAuthorityUrlComponents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Authority.prototype, "DefaultOpenIdConfigurationEndpoint", {
        /**
         * // http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
         */
        get: function () {
            return this.CanonicalAuthority + "v2.0/.well-known/openid-configuration";
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Given a string, validate that it is of the form https://domain/path
     */
    Authority.prototype.validateAsUri = function () {
        var components;
        try {
            components = this.CanonicalAuthorityUrlComponents;
        }
        catch (e) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_1__["ClientConfigurationErrorMessage"].invalidAuthorityType;
        }
        if (!components.Protocol || components.Protocol.toLowerCase() !== "https:") {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_1__["ClientConfigurationErrorMessage"].authorityUriInsecure;
        }
        if (!components.PathSegments || components.PathSegments.length < 1) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_1__["ClientConfigurationErrorMessage"].authorityUriInvalidPath;
        }
    };
    /**
     * Calls the OIDC endpoint and returns the response
     */
    Authority.prototype.DiscoverEndpoints = function (openIdConfigurationEndpoint) {
        var client = new _XHRClient__WEBPACK_IMPORTED_MODULE_2__["XhrClient"]();
        return client.sendRequestAsync(openIdConfigurationEndpoint, "GET", /* enableCaching: */ true)
            .then(function (response) {
            return {
                AuthorizationEndpoint: response.authorization_endpoint,
                EndSessionEndpoint: response.end_session_endpoint,
                Issuer: response.issuer
            };
        });
    };
    /**
     * Returns a promise.
     * Checks to see if the authority is in the cache
     * Discover endpoints via openid-configuration
     * If successful, caches the endpoint for later use in OIDC
     */
    Authority.prototype.resolveEndpointsAsync = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var openIdConfigurationEndpointResponse, _a;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.GetOpenIdConfigurationEndpointAsync()];
                    case 1:
                        openIdConfigurationEndpointResponse = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.DiscoverEndpoints(openIdConfigurationEndpointResponse)];
                    case 2:
                        _a.tenantDiscoveryResponse = _b.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    return Authority;
}());

//# sourceMappingURL=Authority.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/authority/AuthorityFactory.js":
/*!*****************************************************************!*\
  !*** ./node_modules/msal/lib-es6/authority/AuthorityFactory.js ***!
  \*****************************************************************/
/*! exports provided: AuthorityFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthorityFactory", function() { return AuthorityFactory; });
/* harmony import */ var _AadAuthority__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AadAuthority */ "./node_modules/msal/lib-es6/authority/AadAuthority.js");
/* harmony import */ var _B2cAuthority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./B2cAuthority */ "./node_modules/msal/lib-es6/authority/B2cAuthority.js");
/* harmony import */ var _Authority__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Authority */ "./node_modules/msal/lib-es6/authority/Authority.js");
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */






var AuthorityFactory = /** @class */ (function () {
    function AuthorityFactory() {
    }
    /**
     * Parse the url and determine the type of authority
     */
    AuthorityFactory.DetectAuthorityFromUrl = function (authorityUrl) {
        authorityUrl = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__["UrlUtils"].CanonicalizeUri(authorityUrl);
        var components = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__["UrlUtils"].GetUrlComponents(authorityUrl);
        var pathSegments = components.PathSegments;
        switch (pathSegments[0]) {
            case "tfp":
                return _Authority__WEBPACK_IMPORTED_MODULE_2__["AuthorityType"].B2C;
            default:
                return _Authority__WEBPACK_IMPORTED_MODULE_2__["AuthorityType"].Aad;
        }
    };
    /**
     * Create an authority object of the correct type based on the url
     * Performs basic authority validation - checks to see if the authority is of a valid type (eg aad, b2c)
     */
    AuthorityFactory.CreateInstance = function (authorityUrl, validateAuthority) {
        if (_utils_StringUtils__WEBPACK_IMPORTED_MODULE_5__["StringUtils"].isEmpty(authorityUrl)) {
            return null;
        }
        var type = AuthorityFactory.DetectAuthorityFromUrl(authorityUrl);
        // Depending on above detection, create the right type.
        switch (type) {
            case _Authority__WEBPACK_IMPORTED_MODULE_2__["AuthorityType"].B2C:
                return new _B2cAuthority__WEBPACK_IMPORTED_MODULE_1__["B2cAuthority"](authorityUrl, validateAuthority);
            case _Authority__WEBPACK_IMPORTED_MODULE_2__["AuthorityType"].Aad:
                return new _AadAuthority__WEBPACK_IMPORTED_MODULE_0__["AadAuthority"](authorityUrl, validateAuthority);
            default:
                throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_3__["ClientConfigurationErrorMessage"].invalidAuthorityType;
        }
    };
    return AuthorityFactory;
}());

//# sourceMappingURL=AuthorityFactory.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/authority/B2cAuthority.js":
/*!*************************************************************!*\
  !*** ./node_modules/msal/lib-es6/authority/B2cAuthority.js ***!
  \*************************************************************/
/*! exports provided: B2cAuthority */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B2cAuthority", function() { return B2cAuthority; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AadAuthority__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AadAuthority */ "./node_modules/msal/lib-es6/authority/AadAuthority.js");
/* harmony import */ var _Authority__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Authority */ "./node_modules/msal/lib-es6/authority/Authority.js");
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */





/**
 * @hidden
 */
var B2cAuthority = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](B2cAuthority, _super);
    function B2cAuthority(authority, validateAuthority) {
        var _this = _super.call(this, authority, validateAuthority) || this;
        var urlComponents = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__["UrlUtils"].GetUrlComponents(authority);
        var pathSegments = urlComponents.PathSegments;
        if (pathSegments.length < 3) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_3__["ClientConfigurationErrorMessage"].b2cAuthorityUriInvalidPath;
        }
        _this.CanonicalAuthority = "https://" + urlComponents.HostNameAndPort + "/" + pathSegments[0] + "/" + pathSegments[1] + "/" + pathSegments[2] + "/";
        return _this;
    }
    Object.defineProperty(B2cAuthority.prototype, "AuthorityType", {
        get: function () {
            return _Authority__WEBPACK_IMPORTED_MODULE_2__["AuthorityType"].B2C;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a promise with the TenantDiscoveryEndpoint
     */
    B2cAuthority.prototype.GetOpenIdConfigurationEndpointAsync = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                if (!this.IsValidationEnabled || this.IsInTrustedHostList(this.CanonicalAuthorityUrlComponents.HostNameAndPort)) {
                    return [2 /*return*/, this.DefaultOpenIdConfigurationEndpoint];
                }
                throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_3__["ClientConfigurationErrorMessage"].unsupportedAuthorityValidation;
            });
        });
    };
    B2cAuthority.B2C_PREFIX = "tfp";
    return B2cAuthority;
}(_AadAuthority__WEBPACK_IMPORTED_MODULE_1__["AadAuthority"]));

//# sourceMappingURL=B2cAuthority.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/cache/AccessTokenCacheItem.js":
/*!*****************************************************************!*\
  !*** ./node_modules/msal/lib-es6/cache/AccessTokenCacheItem.js ***!
  \*****************************************************************/
/*! exports provided: AccessTokenCacheItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessTokenCacheItem", function() { return AccessTokenCacheItem; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var AccessTokenCacheItem = /** @class */ (function () {
    function AccessTokenCacheItem(key, value) {
        this.key = key;
        this.value = value;
    }
    return AccessTokenCacheItem;
}());

//# sourceMappingURL=AccessTokenCacheItem.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/cache/AccessTokenKey.js":
/*!***********************************************************!*\
  !*** ./node_modules/msal/lib-es6/cache/AccessTokenKey.js ***!
  \***********************************************************/
/*! exports provided: AccessTokenKey */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessTokenKey", function() { return AccessTokenKey; });
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


/**
 * @hidden
 */
var AccessTokenKey = /** @class */ (function () {
    function AccessTokenKey(authority, clientId, scopes, uid, utid) {
        this.authority = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_1__["UrlUtils"].CanonicalizeUri(authority);
        this.clientId = clientId;
        this.scopes = scopes;
        this.homeAccountIdentifier = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Encode(uid) + "." + _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Encode(utid);
    }
    return AccessTokenKey;
}());

//# sourceMappingURL=AccessTokenKey.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/cache/AccessTokenValue.js":
/*!*************************************************************!*\
  !*** ./node_modules/msal/lib-es6/cache/AccessTokenValue.js ***!
  \*************************************************************/
/*! exports provided: AccessTokenValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccessTokenValue", function() { return AccessTokenValue; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var AccessTokenValue = /** @class */ (function () {
    function AccessTokenValue(accessToken, idToken, expiresIn, homeAccountIdentifier) {
        this.accessToken = accessToken;
        this.idToken = idToken;
        this.expiresIn = expiresIn;
        this.homeAccountIdentifier = homeAccountIdentifier;
    }
    return AccessTokenValue;
}());

//# sourceMappingURL=AccessTokenValue.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/cache/AuthCache.js":
/*!******************************************************!*\
  !*** ./node_modules/msal/lib-es6/cache/AuthCache.js ***!
  \******************************************************/
/*! exports provided: AuthCache */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthCache", function() { return AuthCache; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony import */ var _AccessTokenCacheItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AccessTokenCacheItem */ "./node_modules/msal/lib-es6/cache/AccessTokenCacheItem.js");
/* harmony import */ var _BrowserStorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BrowserStorage */ "./node_modules/msal/lib-es6/cache/BrowserStorage.js");
/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */





/**
 * @hidden
 */
var AuthCache = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AuthCache, _super);
    function AuthCache(clientId, cacheLocation, storeAuthStateInCookie) {
        var _this = _super.call(this, cacheLocation) || this;
        _this.clientId = clientId;
        // This is hardcoded to true for now. We may make this configurable in the future
        _this.rollbackEnabled = true;
        _this.migrateCacheEntries(storeAuthStateInCookie);
        return _this;
    }
    /**
     * Support roll back to old cache schema until the next major release: true by default now
     * @param storeAuthStateInCookie
     */
    AuthCache.prototype.migrateCacheEntries = function (storeAuthStateInCookie) {
        var _this = this;
        var idTokenKey = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PersistentCacheKeys"].IDTOKEN;
        var clientInfoKey = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PersistentCacheKeys"].CLIENT_INFO;
        var errorKey = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["ErrorCacheKeys"].ERROR;
        var errorDescKey = _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["ErrorCacheKeys"].ERROR_DESC;
        var idTokenValue = _super.prototype.getItem.call(this, idTokenKey);
        var clientInfoValue = _super.prototype.getItem.call(this, clientInfoKey);
        var errorValue = _super.prototype.getItem.call(this, errorKey);
        var errorDescValue = _super.prototype.getItem.call(this, errorDescKey);
        var values = [idTokenValue, clientInfoValue, errorValue, errorDescValue];
        var keysToMigrate = [_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PersistentCacheKeys"].IDTOKEN, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PersistentCacheKeys"].CLIENT_INFO, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["ErrorCacheKeys"].ERROR, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["ErrorCacheKeys"].ERROR_DESC];
        keysToMigrate.forEach(function (cacheKey, index) { return _this.duplicateCacheEntry(cacheKey, values[index], storeAuthStateInCookie); });
    };
    /**
     * Utility function to help with roll back keys
     * @param newKey
     * @param value
     * @param storeAuthStateInCookie
     */
    AuthCache.prototype.duplicateCacheEntry = function (newKey, value, storeAuthStateInCookie) {
        if (value) {
            this.setItem(newKey, value, storeAuthStateInCookie);
        }
    };
    /**
     * Prepend msal.<client-id> to each key; Skip for any JSON object as Key (defined schemas do not need the key appended: AccessToken Keys or the upcoming schema)
     * @param key
     * @param addInstanceId
     */
    AuthCache.prototype.generateCacheKey = function (key, addInstanceId) {
        try {
            // Defined schemas do not need the key appended
            JSON.parse(key);
            return key;
        }
        catch (e) {
            if (key.indexOf("" + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix) === 0 || key.indexOf(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].adalIdToken) === 0) {
                return key;
            }
            return addInstanceId ? _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + this.clientId + "." + key : _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix + "." + key;
        }
    };
    /**
     * add value to storage
     * @param key
     * @param value
     * @param enableCookieStorage
     */
    AuthCache.prototype.setItem = function (key, value, enableCookieStorage, state) {
        _super.prototype.setItem.call(this, this.generateCacheKey(key, true), value, enableCookieStorage);
        if (this.rollbackEnabled) {
            _super.prototype.setItem.call(this, this.generateCacheKey(key, false), value, enableCookieStorage);
        }
    };
    /**
     * get one item by key from storage
     * @param key
     * @param enableCookieStorage
     */
    AuthCache.prototype.getItem = function (key, enableCookieStorage) {
        return _super.prototype.getItem.call(this, this.generateCacheKey(key, true), enableCookieStorage);
    };
    /**
     * remove value from storage
     * @param key
     */
    AuthCache.prototype.removeItem = function (key) {
        _super.prototype.removeItem.call(this, this.generateCacheKey(key, true));
        if (this.rollbackEnabled) {
            _super.prototype.removeItem.call(this, this.generateCacheKey(key, false));
        }
    };
    /**
     * Reset the cache items
     */
    AuthCache.prototype.resetCacheItems = function () {
        var storage = window[this.cacheLocation];
        var key;
        for (key in storage) {
            // Check if key contains msal prefix; For now, we are clearing all cache items created by MSAL.js
            if (storage.hasOwnProperty(key) && (key.indexOf(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].cachePrefix) !== -1)) {
                _super.prototype.removeItem.call(this, key);
                // TODO: Clear cache based on client id (clarify use cases where this is needed)
            }
        }
    };
    /**
     * Reset all temporary cache items
     */
    AuthCache.prototype.resetTempCacheItems = function (state) {
        var storage = window[this.cacheLocation];
        var key;
        // check state and remove associated cache
        for (key in storage) {
            if (!state || key.indexOf(state) !== -1) {
                var splitKey = key.split(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].resourceDelimiter);
                var keyState = splitKey.length > 1 ? splitKey[splitKey.length - 1] : null;
                if (keyState === state && !this.tokenRenewalInProgress(keyState)) {
                    this.removeItem(key);
                    this.setItemCookie(key, "", -1);
                    this.clearMsalCookie(state);
                }
            }
        }
        // delete the interaction status cache
        this.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].INTERACTION_STATUS);
        this.removeItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].REDIRECT_REQUEST);
    };
    /**
     * Set cookies for IE
     * @param cName
     * @param cValue
     * @param expires
     */
    AuthCache.prototype.setItemCookie = function (cName, cValue, expires) {
        _super.prototype.setItemCookie.call(this, this.generateCacheKey(cName, true), cValue, expires);
        if (this.rollbackEnabled) {
            _super.prototype.setItemCookie.call(this, this.generateCacheKey(cName, false), cValue, expires);
        }
    };
    /**
     * get one item by key from cookies
     * @param cName
     */
    AuthCache.prototype.getItemCookie = function (cName) {
        return _super.prototype.getItemCookie.call(this, this.generateCacheKey(cName, true));
    };
    /**
     * Get all access tokens in the cache
     * @param clientId
     * @param homeAccountIdentifier
     */
    AuthCache.prototype.getAllAccessTokens = function (clientId, homeAccountIdentifier) {
        var _this = this;
        var results = Object.keys(window[this.cacheLocation]).reduce(function (tokens, key) {
            var keyMatches = key.match(clientId) && key.match(homeAccountIdentifier) && key.match(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].scopes);
            if (keyMatches) {
                var value = _this.getItem(key);
                if (value) {
                    try {
                        var parseAtKey = JSON.parse(key);
                        var newAccessTokenCacheItem = new _AccessTokenCacheItem__WEBPACK_IMPORTED_MODULE_2__["AccessTokenCacheItem"](parseAtKey, JSON.parse(value));
                        return tokens.concat([newAccessTokenCacheItem]);
                    }
                    catch (e) {
                        throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_4__["ClientAuthError"].createCacheParseError(key);
                    }
                }
            }
            return tokens;
        }, []);
        return results;
    };
    /**
     * Return if the token renewal is still in progress
     * @param stateValue
     */
    AuthCache.prototype.tokenRenewalInProgress = function (stateValue) {
        var renewStatus = this.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].RENEW_STATUS + "|" + stateValue);
        return !!(renewStatus && renewStatus === _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].inProgress);
    };
    /**
     * Clear all cookies
     */
    AuthCache.prototype.clearMsalCookie = function (state) {
        this.clearItemCookie(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].NONCE_IDTOKEN + "|" + state);
        this.clearItemCookie(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].STATE_LOGIN + "|" + state);
        this.clearItemCookie(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].LOGIN_REQUEST + "|" + state);
        this.clearItemCookie(_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].STATE_ACQ_TOKEN + "|" + state);
    };
    /**
     * Create acquireTokenAccountKey to cache account object
     * @param accountId
     * @param state
     */
    AuthCache.generateAcquireTokenAccountKey = function (accountId, state) {
        return "" + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].ACQUIRE_TOKEN_ACCOUNT + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].resourceDelimiter + accountId + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].resourceDelimiter + state;
    };
    /**
     * Create authorityKey to cache authority
     * @param state
     */
    AuthCache.generateAuthorityKey = function (state) {
        return "" + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["TemporaryCacheKeys"].AUTHORITY + _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].resourceDelimiter + state;
    };
    return AuthCache;
}(_BrowserStorage__WEBPACK_IMPORTED_MODULE_3__["BrowserStorage"]));

//# sourceMappingURL=AuthCache.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/cache/BrowserStorage.js":
/*!***********************************************************!*\
  !*** ./node_modules/msal/lib-es6/cache/BrowserStorage.js ***!
  \***********************************************************/
/*! exports provided: BrowserStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserStorage", function() { return BrowserStorage; });
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _error_AuthError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../error/AuthError */ "./node_modules/msal/lib-es6/error/AuthError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


/**
 * @hidden
 */
var BrowserStorage = /** @class */ (function () {
    function BrowserStorage(cacheLocation) {
        if (!window) {
            throw _error_AuthError__WEBPACK_IMPORTED_MODULE_1__["AuthError"].createNoWindowObjectError("Browser storage class could not find window object");
        }
        var storageSupported = typeof window[cacheLocation] !== "undefined" && window[cacheLocation] != null;
        if (!storageSupported) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_0__["ClientConfigurationError"].createStorageNotSupportedError(cacheLocation);
        }
        this.cacheLocation = cacheLocation;
    }
    /**
     * add value to storage
     * @param key
     * @param value
     * @param enableCookieStorage
     */
    BrowserStorage.prototype.setItem = function (key, value, enableCookieStorage) {
        window[this.cacheLocation].setItem(key, value);
        if (enableCookieStorage) {
            this.setItemCookie(key, value);
        }
    };
    /**
     * get one item by key from storage
     * @param key
     * @param enableCookieStorage
     */
    BrowserStorage.prototype.getItem = function (key, enableCookieStorage) {
        if (enableCookieStorage && this.getItemCookie(key)) {
            return this.getItemCookie(key);
        }
        return window[this.cacheLocation].getItem(key);
    };
    /**
     * remove value from storage
     * @param key
     */
    BrowserStorage.prototype.removeItem = function (key) {
        return window[this.cacheLocation].removeItem(key);
    };
    /**
     * clear storage (remove all items from it)
     */
    BrowserStorage.prototype.clear = function () {
        return window[this.cacheLocation].clear();
    };
    /**
     * add value to cookies
     * @param cName
     * @param cValue
     * @param expires
     */
    BrowserStorage.prototype.setItemCookie = function (cName, cValue, expires) {
        var cookieStr = cName + "=" + cValue + ";path=/;";
        if (expires) {
            var expireTime = this.getCookieExpirationTime(expires);
            cookieStr += "expires=" + expireTime + ";";
        }
        document.cookie = cookieStr;
    };
    /**
     * get one item by key from cookies
     * @param cName
     */
    BrowserStorage.prototype.getItemCookie = function (cName) {
        var name = cName + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    /**
     * Clear an item in the cookies by key
     * @param cName
     */
    BrowserStorage.prototype.clearItemCookie = function (cName) {
        this.setItemCookie(cName, "", -1);
    };
    /**
     * Get cookie expiration time
     * @param cookieLifeDays
     */
    BrowserStorage.prototype.getCookieExpirationTime = function (cookieLifeDays) {
        var today = new Date();
        var expr = new Date(today.getTime() + cookieLifeDays * 24 * 60 * 60 * 1000);
        return expr.toUTCString();
    };
    return BrowserStorage;
}());

//# sourceMappingURL=BrowserStorage.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/error/AuthError.js":
/*!******************************************************!*\
  !*** ./node_modules/msal/lib-es6/error/AuthError.js ***!
  \******************************************************/
/*! exports provided: AuthErrorMessage, AuthError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthErrorMessage", function() { return AuthErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthError", function() { return AuthError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var AuthErrorMessage = {
    unexpectedError: {
        code: "unexpected_error",
        desc: "Unexpected error in authentication."
    },
    noWindowObjectError: {
        code: "no_window_object",
        desc: "No window object available. Details:"
    }
};
/**
 * General error class thrown by the MSAL.js library.
 */
var AuthError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AuthError, _super);
    function AuthError(errorCode, errorMessage) {
        var _this = _super.call(this, errorMessage) || this;
        Object.setPrototypeOf(_this, AuthError.prototype);
        _this.errorCode = errorCode;
        _this.errorMessage = errorMessage;
        _this.name = "AuthError";
        return _this;
    }
    AuthError.createUnexpectedError = function (errDesc) {
        return new AuthError(AuthErrorMessage.unexpectedError.code, AuthErrorMessage.unexpectedError.desc + ": " + errDesc);
    };
    AuthError.createNoWindowObjectError = function (errDesc) {
        return new AuthError(AuthErrorMessage.noWindowObjectError.code, AuthErrorMessage.noWindowObjectError.desc + " " + errDesc);
    };
    return AuthError;
}(Error));

//# sourceMappingURL=AuthError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/error/ClientAuthError.js":
/*!************************************************************!*\
  !*** ./node_modules/msal/lib-es6/error/ClientAuthError.js ***!
  \************************************************************/
/*! exports provided: ClientAuthErrorMessage, ClientAuthError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientAuthErrorMessage", function() { return ClientAuthErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientAuthError", function() { return ClientAuthError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AuthError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AuthError */ "./node_modules/msal/lib-es6/error/AuthError.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */



var ClientAuthErrorMessage = {
    multipleMatchingTokens: {
        code: "multiple_matching_tokens",
        desc: "The cache contains multiple tokens satisfying the requirements. " +
            "Call AcquireToken again providing more requirements like authority."
    },
    multipleCacheAuthorities: {
        code: "multiple_authorities",
        desc: "Multiple authorities found in the cache. Pass authority in the API overload."
    },
    endpointResolutionError: {
        code: "endpoints_resolution_error",
        desc: "Error: could not resolve endpoints. Please check network and try again."
    },
    popUpWindowError: {
        code: "popup_window_error",
        desc: "Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser."
    },
    tokenRenewalError: {
        code: "token_renewal_error",
        desc: "Token renewal operation failed due to timeout."
    },
    invalidIdToken: {
        code: "invalid_id_token",
        desc: "Invalid ID token format."
    },
    invalidStateError: {
        code: "invalid_state_error",
        desc: "Invalid state."
    },
    nonceMismatchError: {
        code: "nonce_mismatch_error",
        desc: "Nonce is not matching, Nonce received: "
    },
    loginProgressError: {
        code: "login_progress_error",
        desc: "Login_In_Progress: Error during login call - login is already in progress."
    },
    acquireTokenProgressError: {
        code: "acquiretoken_progress_error",
        desc: "AcquireToken_In_Progress: Error during login call - login is already in progress."
    },
    userCancelledError: {
        code: "user_cancelled",
        desc: "User cancelled the flow."
    },
    callbackError: {
        code: "callback_error",
        desc: "Error occurred in token received callback function."
    },
    userLoginRequiredError: {
        code: "user_login_error",
        desc: "User login is required."
    },
    userDoesNotExistError: {
        code: "user_non_existent",
        desc: "User object does not exist. Please call a login API."
    },
    clientInfoDecodingError: {
        code: "client_info_decoding_error",
        desc: "The client info could not be parsed/decoded correctly. Please review the trace to determine the root cause."
    },
    clientInfoNotPopulatedError: {
        code: "client_info_not_populated_error",
        desc: "The service did not populate client_info in the response, Please verify with the service team"
    },
    nullOrEmptyIdToken: {
        code: "null_or_empty_id_token",
        desc: "The idToken is null or empty. Please review the trace to determine the root cause."
    },
    idTokenNotParsed: {
        code: "id_token_parsing_error",
        desc: "ID token cannot be parsed. Please review stack trace to determine root cause."
    },
    tokenEncodingError: {
        code: "token_encoding_error",
        desc: "The token to be decoded is not encoded correctly."
    },
    invalidInteractionType: {
        code: "invalid_interaction_type",
        desc: "The interaction type passed to the handler was incorrect or unknown"
    },
    cacheParseError: {
        code: "cannot_parse_cache",
        desc: "The cached token key is not a valid JSON and cannot be parsed"
    },
    blockTokenRequestsInHiddenIframe: {
        code: "block_token_requests",
        desc: "Token calls are blocked in hidden iframes"
    }
};
/**
 * Error thrown when there is an error in the client code running on the browser.
 */
var ClientAuthError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ClientAuthError, _super);
    function ClientAuthError(errorCode, errorMessage) {
        var _this = _super.call(this, errorCode, errorMessage) || this;
        _this.name = "ClientAuthError";
        Object.setPrototypeOf(_this, ClientAuthError.prototype);
        return _this;
    }
    ClientAuthError.createEndpointResolutionError = function (errDetail) {
        var errorMessage = ClientAuthErrorMessage.endpointResolutionError.desc;
        if (errDetail && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(errDetail)) {
            errorMessage += " Details: " + errDetail;
        }
        return new ClientAuthError(ClientAuthErrorMessage.endpointResolutionError.code, errorMessage);
    };
    ClientAuthError.createMultipleMatchingTokensInCacheError = function (scope) {
        return new ClientAuthError(ClientAuthErrorMessage.multipleMatchingTokens.code, "Cache error for scope " + scope + ": " + ClientAuthErrorMessage.multipleMatchingTokens.desc + ".");
    };
    ClientAuthError.createMultipleAuthoritiesInCacheError = function (scope) {
        return new ClientAuthError(ClientAuthErrorMessage.multipleCacheAuthorities.code, "Cache error for scope " + scope + ": " + ClientAuthErrorMessage.multipleCacheAuthorities.desc + ".");
    };
    ClientAuthError.createPopupWindowError = function (errDetail) {
        var errorMessage = ClientAuthErrorMessage.popUpWindowError.desc;
        if (errDetail && !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(errDetail)) {
            errorMessage += " Details: " + errDetail;
        }
        return new ClientAuthError(ClientAuthErrorMessage.popUpWindowError.code, errorMessage);
    };
    ClientAuthError.createTokenRenewalTimeoutError = function (urlNavigate) {
        var errorMessage = "URL navigated to is " + urlNavigate + ", " + ClientAuthErrorMessage.tokenRenewalError.desc;
        return new ClientAuthError(ClientAuthErrorMessage.tokenRenewalError.code, errorMessage);
    };
    ClientAuthError.createInvalidIdTokenError = function (idToken) {
        return new ClientAuthError(ClientAuthErrorMessage.invalidIdToken.code, ClientAuthErrorMessage.invalidIdToken.desc + " Given token: " + idToken);
    };
    // TODO: Is this not a security flaw to send the user the state expected??
    ClientAuthError.createInvalidStateError = function (invalidState, actualState) {
        return new ClientAuthError(ClientAuthErrorMessage.invalidStateError.code, ClientAuthErrorMessage.invalidStateError.desc + " " + invalidState + ", state expected : " + actualState + ".");
    };
    // TODO: Is this not a security flaw to send the user the Nonce expected??
    ClientAuthError.createNonceMismatchError = function (invalidNonce, actualNonce) {
        return new ClientAuthError(ClientAuthErrorMessage.nonceMismatchError.code, ClientAuthErrorMessage.nonceMismatchError.desc + " " + invalidNonce + ", nonce expected : " + actualNonce + ".");
    };
    ClientAuthError.createLoginInProgressError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.loginProgressError.code, ClientAuthErrorMessage.loginProgressError.desc);
    };
    ClientAuthError.createAcquireTokenInProgressError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.acquireTokenProgressError.code, ClientAuthErrorMessage.acquireTokenProgressError.desc);
    };
    ClientAuthError.createUserCancelledError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.userCancelledError.code, ClientAuthErrorMessage.userCancelledError.desc);
    };
    ClientAuthError.createErrorInCallbackFunction = function (errorDesc) {
        return new ClientAuthError(ClientAuthErrorMessage.callbackError.code, ClientAuthErrorMessage.callbackError.desc + " " + errorDesc + ".");
    };
    ClientAuthError.createUserLoginRequiredError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.userLoginRequiredError.code, ClientAuthErrorMessage.userLoginRequiredError.desc);
    };
    ClientAuthError.createUserDoesNotExistError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.userDoesNotExistError.code, ClientAuthErrorMessage.userDoesNotExistError.desc);
    };
    ClientAuthError.createClientInfoDecodingError = function (caughtError) {
        return new ClientAuthError(ClientAuthErrorMessage.clientInfoDecodingError.code, ClientAuthErrorMessage.clientInfoDecodingError.desc + " Failed with error: " + caughtError);
    };
    ClientAuthError.createClientInfoNotPopulatedError = function (caughtError) {
        return new ClientAuthError(ClientAuthErrorMessage.clientInfoNotPopulatedError.code, ClientAuthErrorMessage.clientInfoNotPopulatedError.desc + " Failed with error: " + caughtError);
    };
    ClientAuthError.createIdTokenNullOrEmptyError = function (invalidRawTokenString) {
        return new ClientAuthError(ClientAuthErrorMessage.nullOrEmptyIdToken.code, ClientAuthErrorMessage.nullOrEmptyIdToken.desc + " Raw ID Token Value: " + invalidRawTokenString);
    };
    ClientAuthError.createIdTokenParsingError = function (caughtParsingError) {
        return new ClientAuthError(ClientAuthErrorMessage.idTokenNotParsed.code, ClientAuthErrorMessage.idTokenNotParsed.desc + " Failed with error: " + caughtParsingError);
    };
    ClientAuthError.createTokenEncodingError = function (incorrectlyEncodedToken) {
        return new ClientAuthError(ClientAuthErrorMessage.tokenEncodingError.code, ClientAuthErrorMessage.tokenEncodingError.desc + " Attempted to decode: " + incorrectlyEncodedToken);
    };
    ClientAuthError.createInvalidInteractionTypeError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.invalidInteractionType.code, ClientAuthErrorMessage.invalidInteractionType.desc);
    };
    ClientAuthError.createCacheParseError = function (key) {
        var errorMessage = "invalid key: " + key + ", " + ClientAuthErrorMessage.cacheParseError.desc;
        return new ClientAuthError(ClientAuthErrorMessage.cacheParseError.code, errorMessage);
    };
    ClientAuthError.createBlockTokenRequestsInHiddenIframeError = function () {
        return new ClientAuthError(ClientAuthErrorMessage.blockTokenRequestsInHiddenIframe.code, ClientAuthErrorMessage.blockTokenRequestsInHiddenIframe.desc);
    };
    return ClientAuthError;
}(_AuthError__WEBPACK_IMPORTED_MODULE_1__["AuthError"]));

//# sourceMappingURL=ClientAuthError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js":
/*!*********************************************************************!*\
  !*** ./node_modules/msal/lib-es6/error/ClientConfigurationError.js ***!
  \*********************************************************************/
/*! exports provided: ClientConfigurationErrorMessage, ClientConfigurationError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientConfigurationErrorMessage", function() { return ClientConfigurationErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientConfigurationError", function() { return ClientConfigurationError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ClientAuthError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


var ClientConfigurationErrorMessage = {
    configurationNotSet: {
        code: "no_config_set",
        desc: "Configuration has not been set. Please call the UserAgentApplication constructor with a valid Configuration object."
    },
    storageNotSupported: {
        code: "storage_not_supported",
        desc: "The value for the cacheLocation is not supported."
    },
    noRedirectCallbacksSet: {
        code: "no_redirect_callbacks",
        desc: "No redirect callbacks have been set. Please call handleRedirectCallback() with the appropriate function arguments before continuing. " +
            "More information is available here: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics."
    },
    invalidCallbackObject: {
        code: "invalid_callback_object",
        desc: "The object passed for the callback was invalid. " +
            "More information is available here: https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics."
    },
    scopesRequired: {
        code: "scopes_required",
        desc: "Scopes are required to obtain an access token."
    },
    emptyScopes: {
        code: "empty_input_scopes_error",
        desc: "Scopes cannot be passed as empty array."
    },
    nonArrayScopes: {
        code: "nonarray_input_scopes_error",
        desc: "Scopes cannot be passed as non-array."
    },
    clientScope: {
        code: "clientid_input_scopes_error",
        desc: "Client ID can only be provided as a single scope."
    },
    invalidPrompt: {
        code: "invalid_prompt_value",
        desc: "Supported prompt values are 'login', 'select_account', 'consent' and 'none'",
    },
    invalidAuthorityType: {
        code: "invalid_authority_type",
        desc: "The given authority is not a valid type of authority supported by MSAL. Please see here for valid authorities: <insert URL here>."
    },
    authorityUriInsecure: {
        code: "authority_uri_insecure",
        desc: "Authority URIs must use https."
    },
    authorityUriInvalidPath: {
        code: "authority_uri_invalid_path",
        desc: "Given authority URI is invalid."
    },
    unsupportedAuthorityValidation: {
        code: "unsupported_authority_validation",
        desc: "The authority validation is not supported for this authority type."
    },
    b2cAuthorityUriInvalidPath: {
        code: "b2c_authority_uri_invalid_path",
        desc: "The given URI for the B2C authority is invalid."
    },
    claimsRequestParsingError: {
        code: "claims_request_parsing_error",
        desc: "Could not parse the given claims request object."
    },
    emptyRequestError: {
        code: "empty_request_error",
        desc: "Request object is required."
    },
    invalidCorrelationIdError: {
        code: "invalid_guid_sent_as_correlationId",
        desc: "Please set the correlationId as a valid guid"
    },
    telemetryConfigError: {
        code: "telemetry_config_error",
        desc: "Telemetry config is not configured with required values"
    }
};
/**
 * Error thrown when there is an error in configuration of the .js library.
 */
var ClientConfigurationError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ClientConfigurationError, _super);
    function ClientConfigurationError(errorCode, errorMessage) {
        var _this = _super.call(this, errorCode, errorMessage) || this;
        _this.name = "ClientConfigurationError";
        Object.setPrototypeOf(_this, ClientConfigurationError.prototype);
        return _this;
    }
    ClientConfigurationError.createNoSetConfigurationError = function () {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.configurationNotSet.code, "" + ClientConfigurationErrorMessage.configurationNotSet.desc);
    };
    ClientConfigurationError.createStorageNotSupportedError = function (givenCacheLocation) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.storageNotSupported.code, ClientConfigurationErrorMessage.storageNotSupported.desc + " Given location: " + givenCacheLocation);
    };
    ClientConfigurationError.createRedirectCallbacksNotSetError = function () {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.noRedirectCallbacksSet.code, ClientConfigurationErrorMessage.noRedirectCallbacksSet.desc);
    };
    ClientConfigurationError.createInvalidCallbackObjectError = function (callbackObject) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.invalidCallbackObject.code, ClientConfigurationErrorMessage.invalidCallbackObject.desc + " Given value for callback function: " + callbackObject);
    };
    ClientConfigurationError.createEmptyScopesArrayError = function (scopesValue) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.emptyScopes.code, ClientConfigurationErrorMessage.emptyScopes.desc + " Given value: " + scopesValue + ".");
    };
    ClientConfigurationError.createScopesNonArrayError = function (scopesValue) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.nonArrayScopes.code, ClientConfigurationErrorMessage.nonArrayScopes.desc + " Given value: " + scopesValue + ".");
    };
    ClientConfigurationError.createClientIdSingleScopeError = function (scopesValue) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.clientScope.code, ClientConfigurationErrorMessage.clientScope.desc + " Given value: " + scopesValue + ".");
    };
    ClientConfigurationError.createScopesRequiredError = function (scopesValue) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.scopesRequired.code, ClientConfigurationErrorMessage.scopesRequired.desc + " Given value: " + scopesValue);
    };
    ClientConfigurationError.createInvalidPromptError = function (promptValue) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.invalidPrompt.code, ClientConfigurationErrorMessage.invalidPrompt.desc + " Given value: " + promptValue);
    };
    ClientConfigurationError.createClaimsRequestParsingError = function (claimsRequestParseError) {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.claimsRequestParsingError.code, ClientConfigurationErrorMessage.claimsRequestParsingError.desc + " Given value: " + claimsRequestParseError);
    };
    ClientConfigurationError.createEmptyRequestError = function () {
        var _a = ClientConfigurationErrorMessage.emptyRequestError, code = _a.code, desc = _a.desc;
        return new ClientConfigurationError(code, desc);
    };
    ClientConfigurationError.createInvalidCorrelationIdError = function () {
        return new ClientConfigurationError(ClientConfigurationErrorMessage.invalidCorrelationIdError.code, ClientConfigurationErrorMessage.invalidCorrelationIdError.desc);
    };
    ClientConfigurationError.createTelemetryConfigError = function (config) {
        var _a = ClientConfigurationErrorMessage.telemetryConfigError, code = _a.code, desc = _a.desc;
        var requiredKeys = {
            applicationName: "string",
            applicationVersion: "string",
            telemetryEmitter: "function"
        };
        var missingKeys = Object.keys(requiredKeys)
            .reduce(function (keys, key) {
            return config[key] ? keys : keys.concat([key + " (" + requiredKeys[key] + ")"]);
        }, []);
        return new ClientConfigurationError(code, desc + " mising values: " + missingKeys.join(","));
    };
    return ClientConfigurationError;
}(_ClientAuthError__WEBPACK_IMPORTED_MODULE_1__["ClientAuthError"]));

//# sourceMappingURL=ClientConfigurationError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/error/InteractionRequiredAuthError.js":
/*!*************************************************************************!*\
  !*** ./node_modules/msal/lib-es6/error/InteractionRequiredAuthError.js ***!
  \*************************************************************************/
/*! exports provided: InteractionRequiredAuthErrorMessage, InteractionRequiredAuthError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InteractionRequiredAuthErrorMessage", function() { return InteractionRequiredAuthErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InteractionRequiredAuthError", function() { return InteractionRequiredAuthError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _ServerError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ServerError */ "./node_modules/msal/lib-es6/error/ServerError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


var InteractionRequiredAuthErrorMessage = {
    interactionRequired: {
        code: "interaction_required"
    },
    consentRequired: {
        code: "consent_required"
    },
    loginRequired: {
        code: "login_required"
    },
};
/**
 * Error thrown when the user is required to perform an interactive token request.
 */
var InteractionRequiredAuthError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](InteractionRequiredAuthError, _super);
    function InteractionRequiredAuthError(errorCode, errorMessage) {
        var _this = _super.call(this, errorCode, errorMessage) || this;
        _this.name = "InteractionRequiredAuthError";
        Object.setPrototypeOf(_this, InteractionRequiredAuthError.prototype);
        return _this;
    }
    InteractionRequiredAuthError.isInteractionRequiredError = function (errorString) {
        var interactionRequiredCodes = [
            InteractionRequiredAuthErrorMessage.interactionRequired.code,
            InteractionRequiredAuthErrorMessage.consentRequired.code,
            InteractionRequiredAuthErrorMessage.loginRequired.code
        ];
        return errorString && interactionRequiredCodes.indexOf(errorString) > -1;
    };
    InteractionRequiredAuthError.createLoginRequiredAuthError = function (errorDesc) {
        return new InteractionRequiredAuthError(InteractionRequiredAuthErrorMessage.loginRequired.code, errorDesc);
    };
    InteractionRequiredAuthError.createInteractionRequiredAuthError = function (errorDesc) {
        return new InteractionRequiredAuthError(InteractionRequiredAuthErrorMessage.interactionRequired.code, errorDesc);
    };
    InteractionRequiredAuthError.createConsentRequiredAuthError = function (errorDesc) {
        return new InteractionRequiredAuthError(InteractionRequiredAuthErrorMessage.consentRequired.code, errorDesc);
    };
    return InteractionRequiredAuthError;
}(_ServerError__WEBPACK_IMPORTED_MODULE_1__["ServerError"]));

//# sourceMappingURL=InteractionRequiredAuthError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/error/ServerError.js":
/*!********************************************************!*\
  !*** ./node_modules/msal/lib-es6/error/ServerError.js ***!
  \********************************************************/
/*! exports provided: ServerErrorMessage, ServerError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerErrorMessage", function() { return ServerErrorMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerError", function() { return ServerError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _AuthError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AuthError */ "./node_modules/msal/lib-es6/error/AuthError.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


var ServerErrorMessage = {
    serverUnavailable: {
        code: "server_unavailable",
        desc: "Server is temporarily unavailable."
    },
    unknownServerError: {
        code: "unknown_server_error"
    },
};
/**
 * Error thrown when there is an error with the server code, for example, unavailability.
 */
var ServerError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](ServerError, _super);
    function ServerError(errorCode, errorMessage) {
        var _this = _super.call(this, errorCode, errorMessage) || this;
        _this.name = "ServerError";
        Object.setPrototypeOf(_this, ServerError.prototype);
        return _this;
    }
    ServerError.createServerUnavailableError = function () {
        return new ServerError(ServerErrorMessage.serverUnavailable.code, ServerErrorMessage.serverUnavailable.desc);
    };
    ServerError.createUnknownServerError = function (errorDesc) {
        return new ServerError(ServerErrorMessage.unknownServerError.code, errorDesc);
    };
    return ServerError;
}(_AuthError__WEBPACK_IMPORTED_MODULE_1__["AuthError"]));

//# sourceMappingURL=ServerError.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/index.js":
/*!********************************************!*\
  !*** ./node_modules/msal/lib-es6/index.js ***!
  \********************************************/
/*! exports provided: UserAgentApplication, Logger, LogLevel, Account, Constants, Authority, CryptoUtils, AuthError, ClientAuthError, ServerError, ClientConfigurationError, InteractionRequiredAuthError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UserAgentApplication__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserAgentApplication */ "./node_modules/msal/lib-es6/UserAgentApplication.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UserAgentApplication", function() { return _UserAgentApplication__WEBPACK_IMPORTED_MODULE_0__["UserAgentApplication"]; });

/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Logger */ "./node_modules/msal/lib-es6/Logger.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return _Logger__WEBPACK_IMPORTED_MODULE_1__["Logger"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return _Logger__WEBPACK_IMPORTED_MODULE_1__["LogLevel"]; });

/* harmony import */ var _Account__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Account */ "./node_modules/msal/lib-es6/Account.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Account", function() { return _Account__WEBPACK_IMPORTED_MODULE_2__["Account"]; });

/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return _utils_Constants__WEBPACK_IMPORTED_MODULE_3__["Constants"]; });

/* harmony import */ var _authority_Authority__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./authority/Authority */ "./node_modules/msal/lib-es6/authority/Authority.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Authority", function() { return _authority_Authority__WEBPACK_IMPORTED_MODULE_4__["Authority"]; });

/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CryptoUtils", function() { return _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"]; });

/* harmony import */ var _error_AuthError__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./error/AuthError */ "./node_modules/msal/lib-es6/error/AuthError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthError", function() { return _error_AuthError__WEBPACK_IMPORTED_MODULE_6__["AuthError"]; });

/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClientAuthError", function() { return _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_7__["ClientAuthError"]; });

/* harmony import */ var _error_ServerError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./error/ServerError */ "./node_modules/msal/lib-es6/error/ServerError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ServerError", function() { return _error_ServerError__WEBPACK_IMPORTED_MODULE_8__["ServerError"]; });

/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ClientConfigurationError", function() { return _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_9__["ClientConfigurationError"]; });

/* harmony import */ var _error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./error/InteractionRequiredAuthError */ "./node_modules/msal/lib-es6/error/InteractionRequiredAuthError.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InteractionRequiredAuthError", function() { return _error_InteractionRequiredAuthError__WEBPACK_IMPORTED_MODULE_10__["InteractionRequiredAuthError"]; });








// Errors





//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/telemetry/DefaultEvent.js":
/*!*************************************************************!*\
  !*** ./node_modules/msal/lib-es6/telemetry/DefaultEvent.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TelemetryConstants */ "./node_modules/msal/lib-es6/telemetry/TelemetryConstants.js");
/* harmony import */ var _TelemetryEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TelemetryEvent */ "./node_modules/msal/lib-es6/telemetry/TelemetryEvent.js");
/* harmony import */ var _TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TelemetryUtils */ "./node_modules/msal/lib-es6/telemetry/TelemetryUtils.js");




var DefaultEvent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](DefaultEvent, _super);
    // TODO Platform Type
    function DefaultEvent(platform, correlationId, clientId, eventCount) {
        var _this = _super.call(this, Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("default_event"), correlationId) || this;
        _this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("client_id")] = clientId;
        _this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("sdk_plaform")] = platform.sdk;
        _this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("sdk_version")] = platform.sdkVersion;
        _this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("application_name")] = platform.applicationName;
        _this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("application_version")] = platform.applicationVersion;
        _this.event["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].UiEventCountTelemetryBatchKey] = _this.getEventCount(Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("ui_event"), eventCount);
        _this.event["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].HttpEventCountTelemetryBatchKey] = _this.getEventCount(Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("http_event"), eventCount);
        _this.event["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].CacheEventCountConstStrKey] = _this.getEventCount(Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_3__["prependEventNamePrefix"])("cache_event"), eventCount);
        return _this;
        // / Device id?
    }
    DefaultEvent.prototype.getEventCount = function (eventName, eventCount) {
        if (!eventCount[eventName]) {
            return 0;
        }
        return eventCount[eventName];
    };
    return DefaultEvent;
}(_TelemetryEvent__WEBPACK_IMPORTED_MODULE_2__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (DefaultEvent);
//# sourceMappingURL=DefaultEvent.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/telemetry/TelemetryConstants.js":
/*!*******************************************************************!*\
  !*** ./node_modules/msal/lib-es6/telemetry/TelemetryConstants.js ***!
  \*******************************************************************/
/*! exports provided: EVENT_NAME_PREFIX, EVENT_NAME_KEY, START_TIME_KEY, ELAPSED_TIME_KEY, TELEMETRY_BLOB_EVENT_NAMES, TENANT_PLACEHOLDER */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT_NAME_PREFIX", function() { return EVENT_NAME_PREFIX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT_NAME_KEY", function() { return EVENT_NAME_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "START_TIME_KEY", function() { return START_TIME_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ELAPSED_TIME_KEY", function() { return ELAPSED_TIME_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TELEMETRY_BLOB_EVENT_NAMES", function() { return TELEMETRY_BLOB_EVENT_NAMES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TENANT_PLACEHOLDER", function() { return TENANT_PLACEHOLDER; });
var EVENT_NAME_PREFIX = "msal.";
var EVENT_NAME_KEY = "event_name";
var START_TIME_KEY = "start_time";
var ELAPSED_TIME_KEY = "elapsed_time";
var TELEMETRY_BLOB_EVENT_NAMES = {
    MsalCorrelationIdConstStrKey: "Microsoft.MSAL.correlation_id",
    ApiTelemIdConstStrKey: "msal.api_telem_id",
    ApiIdConstStrKey: "msal.api_id",
    BrokerAppConstStrKey: "Microsoft_MSAL_broker_app",
    CacheEventCountConstStrKey: "Microsoft_MSAL_cache_event_count",
    HttpEventCountTelemetryBatchKey: "Microsoft_MSAL_http_event_count",
    IdpConstStrKey: "Microsoft_MSAL_idp",
    IsSilentTelemetryBatchKey: "",
    IsSuccessfulConstStrKey: "Microsoft_MSAL_is_successful",
    ResponseTimeConstStrKey: "Microsoft_MSAL_response_time",
    TenantIdConstStrKey: "Microsoft_MSAL_tenant_id",
    UiEventCountTelemetryBatchKey: "Microsoft_MSAL_ui_event_count"
};
// This is used to replace the real tenant in telemetry info
var TENANT_PLACEHOLDER = "<tenant>";
//# sourceMappingURL=TelemetryConstants.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/telemetry/TelemetryEvent.js":
/*!***************************************************************!*\
  !*** ./node_modules/msal/lib-es6/telemetry/TelemetryEvent.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TelemetryConstants */ "./node_modules/msal/lib-es6/telemetry/TelemetryConstants.js");
/* harmony import */ var _TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TelemetryUtils */ "./node_modules/msal/lib-es6/telemetry/TelemetryUtils.js");
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");





var TelemetryEvent = /** @class */ (function () {
    function TelemetryEvent(eventName, correlationId) {
        var _a;
        this.startTimestamp = Date.now();
        this.eventId = _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_3__["CryptoUtils"].createNewGuid();
        this.event = (_a = {},
            _a[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__["prependEventNamePrefix"])(_TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["EVENT_NAME_KEY"])] = eventName,
            _a[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__["prependEventNamePrefix"])(_TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["START_TIME_KEY"])] = this.startTimestamp,
            _a[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__["prependEventNamePrefix"])(_TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["ELAPSED_TIME_KEY"])] = -1,
            _a["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].MsalCorrelationIdConstStrKey] = correlationId,
            _a);
    }
    TelemetryEvent.prototype.setElapsedTime = function (time) {
        this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__["prependEventNamePrefix"])(_TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["ELAPSED_TIME_KEY"])] = time;
    };
    TelemetryEvent.prototype.stop = function () {
        // Set duration of event
        this.setElapsedTime(+Date.now() - +this.startTimestamp);
    };
    Object.defineProperty(TelemetryEvent.prototype, "telemetryCorrelationId", {
        get: function () {
            return this.event["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].MsalCorrelationIdConstStrKey];
        },
        set: function (value) {
            this.event["" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["TELEMETRY_BLOB_EVENT_NAMES"].MsalCorrelationIdConstStrKey] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TelemetryEvent.prototype, "eventName", {
        get: function () {
            return this.event[Object(_TelemetryUtils__WEBPACK_IMPORTED_MODULE_2__["prependEventNamePrefix"])(_TelemetryConstants__WEBPACK_IMPORTED_MODULE_1__["EVENT_NAME_KEY"])];
        },
        enumerable: true,
        configurable: true
    });
    TelemetryEvent.prototype.get = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this.event, { eventId: this.eventId });
    };
    return TelemetryEvent;
}());
/* harmony default export */ __webpack_exports__["default"] = (TelemetryEvent);
//# sourceMappingURL=TelemetryEvent.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/telemetry/TelemetryManager.js":
/*!*****************************************************************!*\
  !*** ./node_modules/msal/lib-es6/telemetry/TelemetryManager.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DefaultEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultEvent */ "./node_modules/msal/lib-es6/telemetry/DefaultEvent.js");

// for use in cache events
var MSAL_CACHE_EVENT_VALUE_PREFIX = "msal.token";
var MSAL_CACHE_EVENT_NAME = "msal.cache_event";
var createEventKey = function (event) { return (event.telemetryCorrelationId + "-" + event.eventId + "-" + event.eventName); };
var TelemetryManager = /** @class */ (function () {
    function TelemetryManager(config, telemetryEmitter) {
        // correlation Id to list of events
        this.completedEvents = {};
        // event key to event
        this.inProgressEvents = {};
        // correlation id to map of eventname to count
        this.eventCountByCorrelationId = {};
        // Implement after API EVENT
        this.onlySendFailureTelemetry = false;
        // TODO THROW if bad options
        this.telemetryPlatform = config.platform;
        this.clientId = config.clientId;
        this.onlySendFailureTelemetry = config.onlySendFailureTelemetry;
        /*
         * TODO, when i get to wiring this through, think about what it means if
         * a developer does not implement telem at all, we still instrument, but telemetryEmitter can be
         * optional?
         */
        this.telemetryEmitter = telemetryEmitter;
    }
    TelemetryManager.prototype.startEvent = function (event) {
        if (!this.telemetryEmitter) {
            return;
        }
        var eventKey = createEventKey(event);
        this.inProgressEvents[eventKey] = event;
    };
    TelemetryManager.prototype.stopEvent = function (event) {
        var eventKey = createEventKey(event);
        if (!this.telemetryEmitter || !this.inProgressEvents[eventKey]) {
            return;
        }
        event.stop();
        this.incrementEventCount(event);
        var completedEvents = this.completedEvents[event.telemetryCorrelationId];
        this.completedEvents[event.telemetryCorrelationId] = (completedEvents || []).concat([event]);
        delete this.inProgressEvents[eventKey];
    };
    TelemetryManager.prototype.flush = function (correlationId) {
        var _this = this;
        // If there is only unfinished events should this still return them?
        if (!this.telemetryEmitter || !this.completedEvents[correlationId]) {
            return;
        }
        var orphanedEvents = this.getOrphanedEvents(correlationId);
        orphanedEvents.forEach(function (event) { return _this.incrementEventCount(event); });
        var eventsToFlush = this.completedEvents[correlationId].concat(orphanedEvents);
        delete this.completedEvents[correlationId];
        var eventCountsToFlush = this.eventCountByCorrelationId[correlationId];
        delete this.eventCountByCorrelationId[correlationId];
        // TODO add funcitonality for onlyFlushFailures after implementing api event? ??
        if (!eventsToFlush || !eventsToFlush.length) {
            return;
        }
        var defaultEvent = new _DefaultEvent__WEBPACK_IMPORTED_MODULE_0__["default"](this.telemetryPlatform, correlationId, this.clientId, eventCountsToFlush);
        var eventsWithDefaultEvent = eventsToFlush.concat([defaultEvent]);
        this.telemetryEmitter(eventsWithDefaultEvent.map(function (e) { return e.get(); }));
    };
    TelemetryManager.prototype.incrementEventCount = function (event) {
        var _a;
        /*
         * TODO, name cache event different?
         * if type is cache event, change name
         */
        var eventName = event.eventName;
        var eventCount = this.eventCountByCorrelationId[event.telemetryCorrelationId];
        if (!eventCount) {
            this.eventCountByCorrelationId[event.telemetryCorrelationId] = (_a = {},
                _a[eventName] = 1,
                _a);
        }
        else {
            eventCount[eventName] = eventCount[eventName] ? eventCount[eventName] + 1 : 1;
        }
    };
    TelemetryManager.prototype.getOrphanedEvents = function (correlationId) {
        var _this = this;
        return Object.keys(this.inProgressEvents)
            .reduce(function (memo, eventKey) {
            if (eventKey.indexOf(correlationId) !== -1) {
                var event_1 = _this.inProgressEvents[eventKey];
                delete _this.inProgressEvents[eventKey];
                return memo.concat([event_1]);
            }
            return memo;
        }, []);
    };
    return TelemetryManager;
}());
/* harmony default export */ __webpack_exports__["default"] = (TelemetryManager);
//# sourceMappingURL=TelemetryManager.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/telemetry/TelemetryUtils.js":
/*!***************************************************************!*\
  !*** ./node_modules/msal/lib-es6/telemetry/TelemetryUtils.js ***!
  \***************************************************************/
/*! exports provided: scrubTenantFromUri, hashPersonalIdentifier, prependEventNamePrefix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrubTenantFromUri", function() { return scrubTenantFromUri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hashPersonalIdentifier", function() { return hashPersonalIdentifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prependEventNamePrefix", function() { return prependEventNamePrefix; });
/* harmony import */ var _authority_B2cAuthority__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../authority/B2cAuthority */ "./node_modules/msal/lib-es6/authority/B2cAuthority.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony import */ var _TelemetryConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TelemetryConstants */ "./node_modules/msal/lib-es6/telemetry/TelemetryConstants.js");
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");





var scrubTenantFromUri = function (uri) {
    var url = _utils_UrlUtils__WEBPACK_IMPORTED_MODULE_4__["UrlUtils"].GetUrlComponents(uri);
    // validate trusted host
    if (!_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["AADTrustedHostList"][url.HostNameAndPort.toLocaleLowerCase()]) {
        // Should this return null or what was passed?
        return null;
    }
    var pathParams = url.PathSegments;
    if (pathParams && pathParams.length >= 2) {
        var tenantPosition = pathParams[1] === _authority_B2cAuthority__WEBPACK_IMPORTED_MODULE_0__["B2cAuthority"].B2C_PREFIX ? 2 : 1;
        if (tenantPosition < pathParams.length) {
            pathParams[tenantPosition] = _TelemetryConstants__WEBPACK_IMPORTED_MODULE_2__["TENANT_PLACEHOLDER"];
        }
    }
    return url.Protocol + "//" + url.HostNameAndPort + "/" + pathParams.join("/");
};
var hashPersonalIdentifier = function (valueToHash) {
    /*
     * TODO sha256 this
     * Current test runner is being funny with node libs that are webpacked anyway
     * need a different solution
     */
    return _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_3__["CryptoUtils"].base64Encode(valueToHash);
};
var prependEventNamePrefix = function (suffix) { return "" + _TelemetryConstants__WEBPACK_IMPORTED_MODULE_2__["EVENT_NAME_PREFIX"] + (suffix || ""); };
//# sourceMappingURL=TelemetryUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/Constants.js":
/*!******************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/Constants.js ***!
  \******************************************************/
/*! exports provided: Constants, ServerHashParamKeys, TemporaryCacheKeys, PersistentCacheKeys, ErrorCacheKeys, AADTrustedHostList, SSOTypes, BlacklistedEQParams, PromptState, libraryVersion */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return Constants; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerHashParamKeys", function() { return ServerHashParamKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemporaryCacheKeys", function() { return TemporaryCacheKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PersistentCacheKeys", function() { return PersistentCacheKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorCacheKeys", function() { return ErrorCacheKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AADTrustedHostList", function() { return AADTrustedHostList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SSOTypes", function() { return SSOTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BlacklistedEQParams", function() { return BlacklistedEQParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PromptState", function() { return PromptState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "libraryVersion", function() { return libraryVersion; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 * Constants
 */
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Object.defineProperty(Constants, "claims", {
        get: function () { return "claims"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "clientId", {
        get: function () { return "clientId"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "adalIdToken", {
        get: function () { return "adal.idtoken"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "cachePrefix", {
        get: function () { return "msal"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "scopes", {
        get: function () { return "scopes"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "no_account", {
        get: function () { return "NO_ACCOUNT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "consumersUtid", {
        get: function () { return "9188040d-6c67-4c5b-b112-36a304b66dad"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "upn", {
        get: function () { return "upn"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "prompt_select_account", {
        get: function () { return "&prompt=select_account"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "prompt_none", {
        get: function () { return "&prompt=none"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "prompt", {
        get: function () { return "prompt"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "response_mode_fragment", {
        get: function () { return "&response_mode=fragment"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "resourceDelimiter", {
        get: function () { return "|"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "cacheDelimiter", {
        get: function () { return "."; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "popUpWidth", {
        get: function () { return this._popUpWidth; },
        set: function (width) {
            this._popUpWidth = width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "popUpHeight", {
        get: function () { return this._popUpHeight; },
        set: function (height) {
            this._popUpHeight = height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "login", {
        get: function () { return "LOGIN"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "renewToken", {
        get: function () { return "RENEW_TOKEN"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "unknown", {
        get: function () { return "UNKNOWN"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "homeAccountIdentifier", {
        get: function () { return "homeAccountIdentifier"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "common", {
        get: function () { return "common"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "openidScope", {
        get: function () { return "openid"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "profileScope", {
        get: function () { return "profile"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "interactionTypeRedirect", {
        get: function () { return "redirectInteraction"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "interactionTypePopup", {
        get: function () { return "popupInteraction"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Constants, "inProgress", {
        get: function () { return "inProgress"; },
        enumerable: true,
        configurable: true
    });
    Constants._popUpWidth = 483;
    Constants._popUpHeight = 600;
    return Constants;
}());

/**
 * Keys in the hashParams
 */
var ServerHashParamKeys;
(function (ServerHashParamKeys) {
    ServerHashParamKeys["SCOPE"] = "scope";
    ServerHashParamKeys["ERROR"] = "error";
    ServerHashParamKeys["ERROR_DESCRIPTION"] = "error_description";
    ServerHashParamKeys["ACCESS_TOKEN"] = "access_token";
    ServerHashParamKeys["ID_TOKEN"] = "id_token";
    ServerHashParamKeys["EXPIRES_IN"] = "expires_in";
    ServerHashParamKeys["SESSION_STATE"] = "session_state";
    ServerHashParamKeys["CLIENT_INFO"] = "client_info";
})(ServerHashParamKeys || (ServerHashParamKeys = {}));
;
/**
 * @hidden
 * CacheKeys for MSAL
 */
var TemporaryCacheKeys;
(function (TemporaryCacheKeys) {
    TemporaryCacheKeys["AUTHORITY"] = "authority";
    TemporaryCacheKeys["ACQUIRE_TOKEN_ACCOUNT"] = "acquireTokenAccount";
    TemporaryCacheKeys["SESSION_STATE"] = "session.state";
    TemporaryCacheKeys["STATE_LOGIN"] = "state.login";
    TemporaryCacheKeys["STATE_ACQ_TOKEN"] = "state.acquireToken";
    TemporaryCacheKeys["STATE_RENEW"] = "state.renew";
    TemporaryCacheKeys["NONCE_IDTOKEN"] = "nonce.idtoken";
    TemporaryCacheKeys["LOGIN_REQUEST"] = "login.request";
    TemporaryCacheKeys["RENEW_STATUS"] = "token.renew.status";
    TemporaryCacheKeys["URL_HASH"] = "urlHash";
    TemporaryCacheKeys["ANGULAR_LOGIN_REQUEST"] = "angular.login.request";
    TemporaryCacheKeys["INTERACTION_STATUS"] = "interaction_status";
    TemporaryCacheKeys["REDIRECT_REQUEST"] = "redirect_request";
})(TemporaryCacheKeys || (TemporaryCacheKeys = {}));
var PersistentCacheKeys;
(function (PersistentCacheKeys) {
    PersistentCacheKeys["IDTOKEN"] = "idtoken";
    PersistentCacheKeys["CLIENT_INFO"] = "client.info";
})(PersistentCacheKeys || (PersistentCacheKeys = {}));
var ErrorCacheKeys;
(function (ErrorCacheKeys) {
    ErrorCacheKeys["LOGIN_ERROR"] = "login.error";
    ErrorCacheKeys["ERROR"] = "error";
    ErrorCacheKeys["ERROR_DESC"] = "error.description";
})(ErrorCacheKeys || (ErrorCacheKeys = {}));
var AADTrustedHostList = {
    "login.windows.net": "login.windows.net",
    "login.chinacloudapi.cn": "login.chinacloudapi.cn",
    "login.cloudgovapi.us": "login.cloudgovapi.us",
    "login.microsoftonline.com": "login.microsoftonline.com",
    "login.microsoftonline.de": "login.microsoftonline.de",
    "login.microsoftonline.us": "login.microsoftonline.us"
};
/**
 * @hidden
 * SSO Types - generated to populate hints
 */
var SSOTypes;
(function (SSOTypes) {
    SSOTypes["ACCOUNT"] = "account";
    SSOTypes["SID"] = "sid";
    SSOTypes["LOGIN_HINT"] = "login_hint";
    SSOTypes["ID_TOKEN"] = "id_token";
    SSOTypes["DOMAIN_HINT"] = "domain_hint";
    SSOTypes["ORGANIZATIONS"] = "organizations";
    SSOTypes["CONSUMERS"] = "consumers";
    SSOTypes["ACCOUNT_ID"] = "accountIdentifier";
    SSOTypes["HOMEACCOUNT_ID"] = "homeAccountIdentifier";
    SSOTypes["LOGIN_REQ"] = "login_req";
    SSOTypes["DOMAIN_REQ"] = "domain_req";
})(SSOTypes || (SSOTypes = {}));
;
/**
 * @hidden
 */
var BlacklistedEQParams = [
    SSOTypes.SID,
    SSOTypes.LOGIN_HINT
];
/**
 * we considered making this "enum" in the request instead of string, however it looks like the allowed list of
 * prompt values kept changing over past couple of years. There are some undocumented prompt values for some
 * internal partners too, hence the choice of generic "string" type instead of the "enum"
 * @hidden
 */
var PromptState = {
    LOGIN: "login",
    SELECT_ACCOUNT: "select_account",
    CONSENT: "consent",
    NONE: "none",
};
/**
 * MSAL JS Library Version
 */
function libraryVersion() {
    return "1.2.1";
}
//# sourceMappingURL=Constants.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/CryptoUtils.js":
/*!********************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/CryptoUtils.js ***!
  \********************************************************/
/*! exports provided: CryptoUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CryptoUtils", function() { return CryptoUtils; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var CryptoUtils = /** @class */ (function () {
    function CryptoUtils() {
    }
    /**
     * Creates a new random GUID - used to populate state?
     * @returns string (GUID)
     */
    CryptoUtils.createNewGuid = function () {
        /*
         * RFC4122: The version 4 UUID is meant for generating UUIDs from truly-random or
         * pseudo-random numbers.
         * The algorithm is as follows:
         *     Set the two most significant bits (bits 6 and 7) of the
         *        clock_seq_hi_and_reserved to zero and one, respectively.
         *     Set the four most significant bits (bits 12 through 15) of the
         *        time_hi_and_version field to the 4-bit version number from
         *        Section 4.1.3. Version4
         *     Set all the other bits to randomly (or pseudo-randomly) chosen
         *     values.
         * UUID                   = time-low "-" time-mid "-"time-high-and-version "-"clock-seq-reserved and low(2hexOctet)"-" node
         * time-low               = 4hexOctet
         * time-mid               = 2hexOctet
         * time-high-and-version  = 2hexOctet
         * clock-seq-and-reserved = hexOctet:
         * clock-seq-low          = hexOctet
         * node                   = 6hexOctet
         * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
         * y could be 1000, 1001, 1010, 1011 since most significant two bits needs to be 10
         * y values are 8, 9, A, B
         */
        var cryptoObj = window.crypto; // for IE 11
        if (cryptoObj && cryptoObj.getRandomValues) {
            var buffer = new Uint8Array(16);
            cryptoObj.getRandomValues(buffer);
            // buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
            buffer[6] |= 0x40; // buffer[6] | 01000000 will set the 6 bit to 1.
            buffer[6] &= 0x4f; // buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4".
            // buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
            buffer[8] |= 0x80; // buffer[8] | 10000000 will set the 7 bit to 1.
            buffer[8] &= 0xbf; // buffer[8] & 10111111 will set the 6 bit to 0.
            return CryptoUtils.decimalToHex(buffer[0]) + CryptoUtils.decimalToHex(buffer[1])
                + CryptoUtils.decimalToHex(buffer[2]) + CryptoUtils.decimalToHex(buffer[3])
                + "-" + CryptoUtils.decimalToHex(buffer[4]) + CryptoUtils.decimalToHex(buffer[5])
                + "-" + CryptoUtils.decimalToHex(buffer[6]) + CryptoUtils.decimalToHex(buffer[7])
                + "-" + CryptoUtils.decimalToHex(buffer[8]) + CryptoUtils.decimalToHex(buffer[9])
                + "-" + CryptoUtils.decimalToHex(buffer[10]) + CryptoUtils.decimalToHex(buffer[11])
                + CryptoUtils.decimalToHex(buffer[12]) + CryptoUtils.decimalToHex(buffer[13])
                + CryptoUtils.decimalToHex(buffer[14]) + CryptoUtils.decimalToHex(buffer[15]);
        }
        else {
            var guidHolder = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
            var hex = "0123456789abcdef";
            var r = 0;
            var guidResponse = "";
            for (var i = 0; i < 36; i++) {
                if (guidHolder[i] !== "-" && guidHolder[i] !== "4") {
                    // each x and y needs to be random
                    r = Math.random() * 16 | 0;
                }
                if (guidHolder[i] === "x") {
                    guidResponse += hex[r];
                }
                else if (guidHolder[i] === "y") {
                    // clock-seq-and-reserved first hex is filtered and remaining hex values are random
                    r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
                    r |= 0x8; // set pos 3 to 1 as 1???
                    guidResponse += hex[r];
                }
                else {
                    guidResponse += guidHolder[i];
                }
            }
            return guidResponse;
        }
    };
    /**
     * verifies if a string is  GUID
     * @param guid
     */
    CryptoUtils.isGuid = function (guid) {
        var regexGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regexGuid.test(guid);
    };
    /**
     * Decimal to Hex
     *
     * @param num
     */
    CryptoUtils.decimalToHex = function (num) {
        var hex = num.toString(16);
        while (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    // See: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_4_%E2%80%93_escaping_the_string_before_encoding_it
    /**
     * encoding string to base64 - platform specific check
     *
     * @param input
     */
    CryptoUtils.base64Encode = function (input) {
        return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode(Number("0x" + p1));
        }));
    };
    /**
     * Decodes a base64 encoded string.
     *
     * @param input
     */
    CryptoUtils.base64Decode = function (input) {
        var encodedString = input.replace(/-/g, "+").replace(/_/g, "/");
        switch (encodedString.length % 4) {
            case 0:
                break;
            case 2:
                encodedString += "==";
                break;
            case 3:
                encodedString += "=";
                break;
            default:
                throw new Error("Invalid base64 string");
        }
        return decodeURIComponent(atob(encodedString).split("").map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));
    };
    /**
     * deserialize a string
     *
     * @param query
     */
    CryptoUtils.deserialize = function (query) {
        var match; // Regex for replacing addition symbol with a space
        var pl = /\+/g;
        var search = /([^&=]+)=([^&]*)/g;
        var decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        var obj = {};
        match = search.exec(query);
        while (match) {
            obj[decode(match[1])] = decode(match[2]);
            match = search.exec(query);
        }
        return obj;
    };
    return CryptoUtils;
}());

//# sourceMappingURL=CryptoUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/RequestUtils.js":
/*!*********************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/RequestUtils.js ***!
  \*********************************************************/
/*! exports provided: RequestUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestUtils", function() { return RequestUtils; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony import */ var _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../error/ClientConfigurationError */ "./node_modules/msal/lib-es6/error/ClientConfigurationError.js");
/* harmony import */ var _ScopeSet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ScopeSet */ "./node_modules/msal/lib-es6/ScopeSet.js");
/* harmony import */ var _utils_StringUtils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/* harmony import */ var _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */






/**
 * @hidden
 */
var RequestUtils = /** @class */ (function () {
    function RequestUtils() {
    }
    /**
     * @ignore
     *
     * @param request
     * @param isLoginCall
     * @param requestType
     * @param redirectCallbacksSet
     * @param cacheStorage
     * @param clientId
     *
     * validates all request parameters and generates a consumable request object
     */
    RequestUtils.validateRequest = function (request, isLoginCall, clientId, requestType, redirectCallbacksSet) {
        // Throw error if request is empty for acquire * calls
        if (!isLoginCall && !request) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__["ClientConfigurationError"].createEmptyRequestError();
        }
        // Throw error if callbacks are not set before redirect
        if (requestType == _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].interactionTypeRedirect && !redirectCallbacksSet) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__["ClientConfigurationError"].createRedirectCallbacksNotSetError();
        }
        var scopes;
        var extraQueryParameters;
        if (request) {
            // if extraScopesToConsent is passed in loginCall, append them to the login request; Validate and filter scopes (the validate function will throw if validation fails)
            scopes = isLoginCall ? _ScopeSet__WEBPACK_IMPORTED_MODULE_3__["ScopeSet"].appendScopes(request.scopes, request.extraScopesToConsent) : request.scopes;
            _ScopeSet__WEBPACK_IMPORTED_MODULE_3__["ScopeSet"].validateInputScope(scopes, !isLoginCall, clientId);
            // validate prompt parameter
            this.validatePromptParameter(request.prompt);
            // validate extraQueryParameters
            extraQueryParameters = this.validateEQParameters(request.extraQueryParameters, request.claimsRequest);
            // validate claimsRequest
            this.validateClaimsRequest(request.claimsRequest);
        }
        // validate and generate state and correlationId
        var state = this.validateAndGenerateState(request && request.state);
        var correlationId = this.validateAndGenerateCorrelationId(request && request.correlationId);
        var validatedRequest = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, request, { extraQueryParameters: extraQueryParameters,
            scopes: scopes,
            state: state,
            correlationId: correlationId });
        return validatedRequest;
    };
    /**
     * @ignore
     *
     * Utility to test if valid prompt value is passed in the request
     * @param request
     */
    RequestUtils.validatePromptParameter = function (prompt) {
        if (prompt) {
            if ([_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PromptState"].LOGIN, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PromptState"].SELECT_ACCOUNT, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PromptState"].CONSENT, _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["PromptState"].NONE].indexOf(prompt) < 0) {
                throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__["ClientConfigurationError"].createInvalidPromptError(prompt);
            }
        }
    };
    /**
     * @ignore
     *
     * Removes unnecessary or duplicate query parameters from extraQueryParameters
     * @param request
     */
    RequestUtils.validateEQParameters = function (extraQueryParameters, claimsRequest) {
        var eQParams = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, extraQueryParameters);
        if (!eQParams) {
            return null;
        }
        if (claimsRequest) {
            // this.logger.warning("Removed duplicate claims from extraQueryParameters. Please use either the claimsRequest field OR pass as extraQueryParameter - not both.");
            delete eQParams[_utils_Constants__WEBPACK_IMPORTED_MODULE_1__["Constants"].claims];
        }
        _utils_Constants__WEBPACK_IMPORTED_MODULE_1__["BlacklistedEQParams"].forEach(function (param) {
            if (eQParams[param]) {
                // this.logger.warning("Removed duplicate " + param + " from extraQueryParameters. Please use the " + param + " field in request object.");
                delete eQParams[param];
            }
        });
        return eQParams;
    };
    /**
     * @ignore
     *
     * Validates the claims passed in request is a JSON
     * TODO: More validation will be added when the server team tells us how they have actually implemented claims
     * @param claimsRequest
     */
    RequestUtils.validateClaimsRequest = function (claimsRequest) {
        if (!claimsRequest) {
            return;
        }
        var claims;
        try {
            claims = JSON.parse(claimsRequest);
        }
        catch (e) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__["ClientConfigurationError"].createClaimsRequestParsingError(e);
        }
    };
    /**
     * @ignore
     *
     * generate unique state per request
     * @param request
     */
    RequestUtils.validateAndGenerateState = function (state) {
        // append GUID to user set state  or set one for the user if null
        return !_utils_StringUtils__WEBPACK_IMPORTED_MODULE_4__["StringUtils"].isEmpty(state) ? _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"].createNewGuid() + "|" + state : _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"].createNewGuid();
    };
    /**
     * @ignore
     *
     * validate correlationId and generate if not valid or not set by the user
     * @param correlationId
     */
    RequestUtils.validateAndGenerateCorrelationId = function (correlationId) {
        // validate user set correlationId or set one for the user if null
        if (correlationId && !_utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"].isGuid(correlationId)) {
            throw _error_ClientConfigurationError__WEBPACK_IMPORTED_MODULE_2__["ClientConfigurationError"].createInvalidCorrelationIdError();
        }
        return _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"].isGuid(correlationId) ? correlationId : _utils_CryptoUtils__WEBPACK_IMPORTED_MODULE_5__["CryptoUtils"].createNewGuid();
    };
    return RequestUtils;
}());

//# sourceMappingURL=RequestUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/ResponseUtils.js":
/*!**********************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/ResponseUtils.js ***!
  \**********************************************************/
/*! exports provided: ResponseUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResponseUtils", function() { return ResponseUtils; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var ResponseUtils = /** @class */ (function () {
    function ResponseUtils() {
    }
    ResponseUtils.setResponseIdToken = function (originalResponse, idTokenObj) {
        if (!originalResponse) {
            return null;
        }
        else if (!idTokenObj) {
            return originalResponse;
        }
        var exp = Number(idTokenObj.expiration);
        if (exp && !originalResponse.expiresOn) {
            originalResponse.expiresOn = new Date(exp * 1000);
        }
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, originalResponse, { idToken: idTokenObj, idTokenClaims: idTokenObj.claims, uniqueId: idTokenObj.objectId || idTokenObj.subject, tenantId: idTokenObj.tenantId });
    };
    return ResponseUtils;
}());

//# sourceMappingURL=ResponseUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/StringUtils.js":
/*!********************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/StringUtils.js ***!
  \********************************************************/
/*! exports provided: StringUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringUtils", function() { return StringUtils; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    /**
     * Check if a string is empty
     *
     * @param str
     */
    StringUtils.isEmpty = function (str) {
        return (typeof str === "undefined" || !str || 0 === str.length);
    };
    return StringUtils;
}());

//# sourceMappingURL=StringUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/TimeUtils.js":
/*!******************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/TimeUtils.js ***!
  \******************************************************/
/*! exports provided: TimeUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimeUtils", function() { return TimeUtils; });
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var TimeUtils = /** @class */ (function () {
    function TimeUtils() {
    }
    /**
     * Returns time in seconds for expiration based on string value passed in.
     *
     * @param expiresIn
     */
    TimeUtils.parseExpiresIn = function (expiresIn) {
        // if AAD did not send "expires_in" property, use default expiration of 3599 seconds, for some reason AAD sends 3599 as "expires_in" value instead of 3600
        if (!expiresIn) {
            expiresIn = "3599";
        }
        return parseInt(expiresIn, 10);
    };
    /**
     * return the current time in Unix time. Date.getTime() returns in milliseconds.
     */
    TimeUtils.now = function () {
        return Math.round(new Date().getTime() / 1000.0);
    };
    return TimeUtils;
}());

//# sourceMappingURL=TimeUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/TokenUtils.js":
/*!*******************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/TokenUtils.js ***!
  \*******************************************************/
/*! exports provided: TokenUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenUtils", function() { return TokenUtils; });
/* harmony import */ var _CryptoUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/* harmony import */ var _StringUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */


/**
 * @hidden
 */
var TokenUtils = /** @class */ (function () {
    function TokenUtils() {
    }
    /**
     * decode a JWT
     *
     * @param jwtToken
     */
    TokenUtils.decodeJwt = function (jwtToken) {
        if (_StringUtils__WEBPACK_IMPORTED_MODULE_1__["StringUtils"].isEmpty(jwtToken)) {
            return null;
        }
        var idTokenPartsRegex = /^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/;
        var matches = idTokenPartsRegex.exec(jwtToken);
        if (!matches || matches.length < 4) {
            // this._requestContext.logger.warn("The returned id_token is not parseable.");
            return null;
        }
        var crackedToken = {
            header: matches[1],
            JWSPayload: matches[2],
            JWSSig: matches[3]
        };
        return crackedToken;
    };
    /**
     * Extract IdToken by decoding the RAWIdToken
     *
     * @param encodedIdToken
     */
    TokenUtils.extractIdToken = function (encodedIdToken) {
        // id token will be decoded to get the username
        var decodedToken = this.decodeJwt(encodedIdToken);
        if (!decodedToken) {
            return null;
        }
        try {
            var base64IdToken = decodedToken.JWSPayload;
            var base64Decoded = _CryptoUtils__WEBPACK_IMPORTED_MODULE_0__["CryptoUtils"].base64Decode(base64IdToken);
            if (!base64Decoded) {
                // this._requestContext.logger.info("The returned id_token could not be base64 url safe decoded.");
                return null;
            }
            // ECMA script has JSON built-in support
            return JSON.parse(base64Decoded);
        }
        catch (err) {
            // this._requestContext.logger.error("The returned id_token could not be decoded" + err);
        }
        return null;
    };
    return TokenUtils;
}());

//# sourceMappingURL=TokenUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/UrlUtils.js":
/*!*****************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/UrlUtils.js ***!
  \*****************************************************/
/*! exports provided: UrlUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlUtils", function() { return UrlUtils; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");
/* harmony import */ var _ScopeSet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ScopeSet */ "./node_modules/msal/lib-es6/ScopeSet.js");
/* harmony import */ var _StringUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StringUtils */ "./node_modules/msal/lib-es6/utils/StringUtils.js");
/* harmony import */ var _CryptoUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CryptoUtils */ "./node_modules/msal/lib-es6/utils/CryptoUtils.js");
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */




/**
 * @hidden
 */
var UrlUtils = /** @class */ (function () {
    function UrlUtils() {
    }
    /**
     * generates the URL with QueryString Parameters
     * @param scopes
     */
    UrlUtils.createNavigateUrl = function (serverRequestParams) {
        var str = this.createNavigationUrlString(serverRequestParams);
        var authEndpoint = serverRequestParams.authorityInstance.AuthorizationEndpoint;
        // if the endpoint already has queryparams, lets add to it, otherwise add the first one
        if (authEndpoint.indexOf("?") < 0) {
            authEndpoint += "?";
        }
        else {
            authEndpoint += "&";
        }
        var requestUrl = "" + authEndpoint + str.join("&");
        return requestUrl;
    };
    /**
     * Generate the array of all QueryStringParams to be sent to the server
     * @param scopes
     */
    UrlUtils.createNavigationUrlString = function (serverRequestParams) {
        var scopes = serverRequestParams.scopes;
        if (scopes.indexOf(serverRequestParams.clientId) === -1) {
            scopes.push(serverRequestParams.clientId);
        }
        var str = [];
        str.push("response_type=" + serverRequestParams.responseType);
        this.translateclientIdUsedInScope(scopes, serverRequestParams.clientId);
        str.push("scope=" + encodeURIComponent(_ScopeSet__WEBPACK_IMPORTED_MODULE_1__["ScopeSet"].parseScope(scopes)));
        str.push("client_id=" + encodeURIComponent(serverRequestParams.clientId));
        str.push("redirect_uri=" + encodeURIComponent(serverRequestParams.redirectUri));
        str.push("state=" + encodeURIComponent(serverRequestParams.state));
        str.push("nonce=" + encodeURIComponent(serverRequestParams.nonce));
        str.push("client_info=1");
        str.push("x-client-SKU=" + serverRequestParams.xClientSku);
        str.push("x-client-Ver=" + serverRequestParams.xClientVer);
        if (serverRequestParams.promptValue) {
            str.push("prompt=" + encodeURIComponent(serverRequestParams.promptValue));
        }
        if (serverRequestParams.claimsValue) {
            str.push("claims=" + encodeURIComponent(serverRequestParams.claimsValue));
        }
        if (serverRequestParams.queryParameters) {
            str.push(serverRequestParams.queryParameters);
        }
        if (serverRequestParams.extraQueryParameters) {
            str.push(serverRequestParams.extraQueryParameters);
        }
        str.push("client-request-id=" + encodeURIComponent(serverRequestParams.correlationId));
        return str;
    };
    /**
     * append the required scopes: https://openid.net/specs/openid-connect-basic-1_0.html#Scopes
     * @param scopes
     */
    UrlUtils.translateclientIdUsedInScope = function (scopes, clientId) {
        var clientIdIndex = scopes.indexOf(clientId);
        if (clientIdIndex >= 0) {
            scopes.splice(clientIdIndex, 1);
            if (scopes.indexOf("openid") === -1) {
                scopes.push("openid");
            }
            if (scopes.indexOf("profile") === -1) {
                scopes.push("profile");
            }
        }
    };
    /**
     * Returns current window URL as redirect uri
     */
    UrlUtils.getDefaultRedirectUri = function () {
        return window.location.href.split("?")[0].split("#")[0];
    };
    /**
     * Given a url like https://a:b/common/d?e=f#g, and a tenantId, returns https://a:b/tenantId/d
     * @param href The url
     * @param tenantId The tenant id to replace
     */
    UrlUtils.replaceTenantPath = function (url, tenantId) {
        url = url.toLowerCase();
        var urlObject = this.GetUrlComponents(url);
        var pathArray = urlObject.PathSegments;
        if (tenantId && (pathArray.length !== 0 && (pathArray[0] === _Constants__WEBPACK_IMPORTED_MODULE_0__["Constants"].common || pathArray[0] === _Constants__WEBPACK_IMPORTED_MODULE_0__["SSOTypes"].ORGANIZATIONS))) {
            pathArray[0] = tenantId;
        }
        return this.constructAuthorityUriFromObject(urlObject, pathArray);
    };
    UrlUtils.constructAuthorityUriFromObject = function (urlObject, pathArray) {
        return this.CanonicalizeUri(urlObject.Protocol + "//" + urlObject.HostNameAndPort + "/" + pathArray.join("/"));
    };
    /**
     * Parses out the components from a url string.
     * @returns An object with the various components. Please cache this value insted of calling this multiple times on the same url.
     */
    UrlUtils.GetUrlComponents = function (url) {
        if (!url) {
            throw "Url required";
        }
        // https://gist.github.com/curtisz/11139b2cfcaef4a261e0
        var regEx = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
        var match = url.match(regEx);
        if (!match || match.length < 6) {
            throw "Valid url required";
        }
        var urlComponents = {
            Protocol: match[1],
            HostNameAndPort: match[4],
            AbsolutePath: match[5]
        };
        var pathSegments = urlComponents.AbsolutePath.split("/");
        pathSegments = pathSegments.filter(function (val) { return val && val.length > 0; }); // remove empty elements
        urlComponents.PathSegments = pathSegments;
        return urlComponents;
    };
    /**
     * Given a url or path, append a trailing slash if one doesnt exist
     *
     * @param url
     */
    UrlUtils.CanonicalizeUri = function (url) {
        if (url) {
            url = url.toLowerCase();
        }
        if (url && !UrlUtils.endsWith(url, "/")) {
            url += "/";
        }
        return url;
    };
    /**
     * Checks to see if the url ends with the suffix
     * Required because we are compiling for es5 instead of es6
     * @param url
     * @param str
     */
    // TODO: Rename this, not clear what it is supposed to do
    UrlUtils.endsWith = function (url, suffix) {
        if (!url || !suffix) {
            return false;
        }
        return url.indexOf(suffix, url.length - suffix.length) !== -1;
    };
    /**
     * Utils function to remove the login_hint and domain_hint from the i/p extraQueryParameters
     * @param url
     * @param name
     */
    UrlUtils.urlRemoveQueryStringParameter = function (url, name) {
        if (_StringUtils__WEBPACK_IMPORTED_MODULE_2__["StringUtils"].isEmpty(url)) {
            return url;
        }
        var regex = new RegExp("(\\&" + name + "=)[^\&]+");
        url = url.replace(regex, "");
        // name=value&
        regex = new RegExp("(" + name + "=)[^\&]+&");
        url = url.replace(regex, "");
        // name=value
        regex = new RegExp("(" + name + "=)[^\&]+");
        url = url.replace(regex, "");
        return url;
    };
    /**
     * @hidden
     * @ignore
     *
     * Returns the anchor part(#) of the URL
     */
    UrlUtils.getHashFromUrl = function (urlStringOrFragment) {
        var hashIndex1 = urlStringOrFragment.indexOf("#");
        var hashIndex2 = urlStringOrFragment.indexOf("#/");
        if (hashIndex2 > -1) {
            return urlStringOrFragment.substring(hashIndex2 + 2);
        }
        else if (hashIndex1 > -1) {
            return urlStringOrFragment.substring(hashIndex1 + 1);
        }
        return urlStringOrFragment;
    };
    /**
     * @hidden
     * Check if the url contains a hash with known properties
     * @ignore
     */
    UrlUtils.urlContainsHash = function (urlString) {
        var parameters = UrlUtils.deserializeHash(urlString);
        return (parameters.hasOwnProperty(_Constants__WEBPACK_IMPORTED_MODULE_0__["ServerHashParamKeys"].ERROR_DESCRIPTION) ||
            parameters.hasOwnProperty(_Constants__WEBPACK_IMPORTED_MODULE_0__["ServerHashParamKeys"].ERROR) ||
            parameters.hasOwnProperty(_Constants__WEBPACK_IMPORTED_MODULE_0__["ServerHashParamKeys"].ACCESS_TOKEN) ||
            parameters.hasOwnProperty(_Constants__WEBPACK_IMPORTED_MODULE_0__["ServerHashParamKeys"].ID_TOKEN));
    };
    /**
     * @hidden
     * Returns deserialized portion of URL hash
     * @ignore
     */
    UrlUtils.deserializeHash = function (urlFragment) {
        var hash = UrlUtils.getHashFromUrl(urlFragment);
        return _CryptoUtils__WEBPACK_IMPORTED_MODULE_3__["CryptoUtils"].deserialize(hash);
    };
    /**
     * @ignore
     * @param {string} URI
     * @returns {string} host from the URI
     *
     * extract URI from the host
     */
    UrlUtils.getHostFromUri = function (uri) {
        // remove http:// or https:// from uri
        var extractedUri = String(uri).replace(/^(https?:)\/\//, "");
        extractedUri = extractedUri.split("/")[0];
        return extractedUri;
    };
    return UrlUtils;
}());

//# sourceMappingURL=UrlUtils.js.map

/***/ }),

/***/ "./node_modules/msal/lib-es6/utils/WindowUtils.js":
/*!********************************************************!*\
  !*** ./node_modules/msal/lib-es6/utils/WindowUtils.js ***!
  \********************************************************/
/*! exports provided: WindowUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WindowUtils", function() { return WindowUtils; });
/* harmony import */ var _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../error/ClientAuthError */ "./node_modules/msal/lib-es6/error/ClientAuthError.js");
/* harmony import */ var _UrlUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UrlUtils */ "./node_modules/msal/lib-es6/utils/UrlUtils.js");
/* harmony import */ var _utils_Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Constants */ "./node_modules/msal/lib-es6/utils/Constants.js");



var WindowUtils = /** @class */ (function () {
    function WindowUtils() {
    }
    /**
     * @hidden
     * Checks if the current page is running in an iframe.
     * @ignore
     */
    WindowUtils.isInIframe = function () {
        return window.parent !== window;
    };
    /**
     * @hidden
     * Check if the current page is running in a popup.
     * @ignore
     */
    WindowUtils.isInPopup = function () {
        return !!(window.opener && window.opener !== window);
    };
    /**
     * @hidden
     * Monitors a window until it loads a url with a hash
     * @ignore
     */
    WindowUtils.monitorWindowForHash = function (contentWindow, timeout, urlNavigate) {
        return new Promise(function (resolve, reject) {
            var maxTicks = timeout / WindowUtils.POLLING_INTERVAL_MS;
            var ticks = 0;
            var intervalId = setInterval(function () {
                if (contentWindow.closed) {
                    clearInterval(intervalId);
                    reject(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__["ClientAuthError"].createUserCancelledError());
                    return;
                }
                var href;
                try {
                    /*
                     * Will throw if cross origin,
                     * which should be caught and ignored
                     * since we need the interval to keep running while on STS UI.
                     */
                    href = contentWindow.location.href;
                }
                catch (e) { }
                // Don't process blank pages or cross domain
                if (!href || href === "about:blank") {
                    return;
                }
                // Only run clock when we are on same domain
                ticks++;
                if (_UrlUtils__WEBPACK_IMPORTED_MODULE_1__["UrlUtils"].urlContainsHash(href)) {
                    clearInterval(intervalId);
                    resolve(contentWindow.location.hash);
                }
                else if (ticks > maxTicks) {
                    clearInterval(intervalId);
                    reject(_error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__["ClientAuthError"].createTokenRenewalTimeoutError(urlNavigate)); // better error?
                }
            }, WindowUtils.POLLING_INTERVAL_MS);
        });
    };
    /**
     * @hidden
     * Loads iframe with authorization endpoint URL
     * @ignore
     */
    WindowUtils.loadFrame = function (urlNavigate, frameName, timeoutMs, logger) {
        /*
         * This trick overcomes iframe navigation in IE
         * IE does not load the page consistently in iframe
         */
        logger.info("LoadFrame: " + frameName);
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var frameHandle = WindowUtils.addHiddenIFrame(frameName, logger);
                if (!frameHandle) {
                    reject("Unable to load iframe with name: " + frameName);
                    return;
                }
                if (frameHandle.src === "" || frameHandle.src === "about:blank") {
                    frameHandle.src = urlNavigate;
                    logger.infoPii("Frame Name : " + frameName + " Navigated to: " + urlNavigate);
                }
                resolve(frameHandle);
            }, timeoutMs);
        });
    };
    /**
     * @hidden
     * Adds the hidden iframe for silent token renewal.
     * @ignore
     */
    WindowUtils.addHiddenIFrame = function (iframeId, logger) {
        if (typeof iframeId === "undefined") {
            return null;
        }
        logger.info("Add msal frame to document:" + iframeId);
        var adalFrame = document.getElementById(iframeId);
        if (!adalFrame) {
            if (document.createElement &&
                document.documentElement &&
                (window.navigator.userAgent.indexOf("MSIE 5.0") === -1)) {
                var ifr = document.createElement("iframe");
                ifr.setAttribute("id", iframeId);
                ifr.style.visibility = "hidden";
                ifr.style.position = "absolute";
                ifr.style.width = ifr.style.height = "0";
                ifr.style.border = "0";
                ifr.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
                adalFrame = document.getElementsByTagName("body")[0].appendChild(ifr);
            }
            else if (document.body && document.body.insertAdjacentHTML) {
                document.body.insertAdjacentHTML("beforeend", "<iframe name='" + iframeId + "' id='" + iframeId + "' style='display:none'></iframe>");
            }
            if (window.frames && window.frames[iframeId]) {
                adalFrame = window.frames[iframeId];
            }
        }
        return adalFrame;
    };
    /**
     * @hidden
     * Removes a hidden iframe from the page.
     * @ignore
     */
    WindowUtils.removeHiddenIframe = function (iframe) {
        if (document.body !== iframe.parentNode) {
            document.body.removeChild(iframe);
        }
    };
    /**
     * @hidden
     * Find and return the iframe element with the given hash
     * @ignore
     */
    WindowUtils.getIframeWithHash = function (hash) {
        var iframes = document.getElementsByTagName("iframe");
        var iframeArray = Array.apply(null, Array(iframes.length)).map(function (iframe, index) { return iframes.item(index); }); // eslint-disable-line prefer-spread
        return iframeArray.filter(function (iframe) {
            try {
                return iframe.contentWindow.location.hash === hash;
            }
            catch (e) {
                return false;
            }
        })[0];
    };
    /**
     * @hidden
     * Returns an array of all the popups opened by MSAL
     * @ignore
     */
    WindowUtils.getPopups = function () {
        if (!window.openedWindows) {
            window.openedWindows = [];
        }
        return window.openedWindows;
    };
    /**
     * @hidden
     * Find and return the popup with the given hash
     * @ignore
     */
    WindowUtils.getPopUpWithHash = function (hash) {
        return WindowUtils.getPopups().filter(function (popup) {
            try {
                return popup.location.hash === hash;
            }
            catch (e) {
                return false;
            }
        })[0];
    };
    /**
     * @hidden
     * Add the popup to the known list of popups
     * @ignore
     */
    WindowUtils.trackPopup = function (popup) {
        WindowUtils.getPopups().push(popup);
    };
    /**
     * @hidden
     * Close all popups
     * @ignore
     */
    WindowUtils.closePopups = function () {
        WindowUtils.getPopups().forEach(function (popup) { return popup.close(); });
    };
    /**
     * @ignore
     *
     * blocks any login/acquireToken calls to reload from within a hidden iframe (generated for silent calls)
     */
    WindowUtils.blockReloadInHiddenIframes = function () {
        // return an error if called from the hidden iframe created by the msal js silent calls
        if (_UrlUtils__WEBPACK_IMPORTED_MODULE_1__["UrlUtils"].urlContainsHash(window.location.hash) && WindowUtils.isInIframe()) {
            throw _error_ClientAuthError__WEBPACK_IMPORTED_MODULE_0__["ClientAuthError"].createBlockTokenRequestsInHiddenIframeError();
        }
    };
    /**
     *
     * @param cacheStorage
     */
    WindowUtils.checkIfBackButtonIsPressed = function (cacheStorage) {
        var redirectCache = cacheStorage.getItem(_utils_Constants__WEBPACK_IMPORTED_MODULE_2__["TemporaryCacheKeys"].REDIRECT_REQUEST);
        // if redirect request is set and there is no hash
        if (redirectCache && !_UrlUtils__WEBPACK_IMPORTED_MODULE_1__["UrlUtils"].urlContainsHash(window.location.hash)) {
            var splitCache = redirectCache.split(_utils_Constants__WEBPACK_IMPORTED_MODULE_2__["Constants"].resourceDelimiter);
            var state = splitCache.length > 1 ? splitCache[splitCache.length - 1] : null;
            cacheStorage.resetTempCacheItems(state);
        }
    };
    /**
     * @hidden
     * Interval in milliseconds that we poll a window
     * @ignore
     */
    WindowUtils.POLLING_INTERVAL_MS = 50;
    return WindowUtils;
}());

//# sourceMappingURL=WindowUtils.js.map

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ })

/******/ });
//# sourceMappingURL=AuthenticationService.js.map