"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportButton = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var GetApp_1 = __importDefault(require("@material-ui/icons/GetApp"));
var react_admin_2 = require("react-admin");
var csv_extractor_1 = require("./csv-extractor");
var uploader_1 = require("./uploader");
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var ra_language_spanish_1 = __importDefault(require("ra-language-spanish"));
var ra_language_chinese_1 = __importDefault(require("ra-language-chinese"));
var domainMessages = __importStar(require("./i18n"));
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var core_1 = require("@material-ui/core");
exports.ImportButton = function (props) {
    var locale = react_admin_2.useDataProvider();
    var messages = {
        es: __assign(__assign({}, ra_language_spanish_1.default), domainMessages.es),
        en: __assign(__assign({}, ra_language_english_1.default), domainMessages.en),
        cn: __assign(__assign({}, ra_language_chinese_1.default), domainMessages.cn),
    };
    var i18nProvider = ra_i18n_polyglot_1.default(function (locale) { return (messages[locale] ? messages[locale] : messages.en); }, locale || react_admin_1.resolveBrowserLocale());
    var _a = props, parseConfig = _a.parseConfig, logging = _a.logging, postCommitCallback = _a.postCommitCallback, preCommitCallback = _a.preCommitCallback, disableImportNew = _a.disableImportNew, disableImportOverwrite = _a.disableImportOverwrite;
    var variant = props.variant, label = props.label, resource = props.resource, resourceName = props.resourceName;
    if (logging) {
        console.log({ props: props });
    }
    if (!resource) {
        throw new Error(i18nProvider.translate('csv.error.emptyResource'));
    }
    if (!label) {
        label = i18nProvider.translate('csv.main.import');
    }
    if (!variant) {
        variant = 'text';
    }
    if (!resourceName) {
        resourceName = resource;
    }
    var _b = react_1.default.useState(false), open = _b[0], setOpen = _b[1];
    var _c = react_1.default.useState(false), importing = _c[0], setImporting = _c[1];
    var _d = react_1.default.useState(null), fileName = _d[0], setFileName = _d[1];
    var _e = react_1.default.useState(null), values = _e[0], setValues = _e[1];
    var _f = react_1.default.useState(null), errorTxt = _f[0], setErrorTxt = _f[1];
    var refresh = react_admin_1.useRefresh();
    var openImportDialog = function () {
        setOpen(true);
    };
    var handleClose = function () {
        setOpen(false);
        setImporting(false);
        setFileName(null);
        setValues(null);
    };
    var handleComplete = function (error) {
        if (error === void 0) { error = false; }
        handleClose();
        if (!error) {
            notify(i18nProvider.translate('csv.alert.imported') + " " + fileName);
            refresh();
        }
        if (error) {
            notify(i18nProvider.translate('csv.error.importing') + " " + fileName + ", " + error, 'error');
        }
    };
    var handleSubmitCreate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setImporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (values.some(function (v) { return v.id; })) {
                        throw new Error(i18nProvider.translate('csv.error.hasId'));
                    }
                    if (preCommitCallback)
                        setValues(preCommitCallback('create', values));
                    return [4 /*yield*/, uploader_1.create(dataProvider, resource, values, postCommitCallback)];
                case 2:
                    _a.sent();
                    handleComplete();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    handleComplete(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmitOverwrite = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setImporting(true);
            try {
                if (values.some(function (v) { return !v.id; })) {
                    throw new Error(i18nProvider.translate('csv.error.noId'));
                }
                if (preCommitCallback)
                    setValues(preCommitCallback('overwrite', values));
                uploader_1.update(dataProvider, resource, values, postCommitCallback)
                    .then(function () { return handleComplete(); })
                    .catch(function (error) { return handleComplete(error); });
            }
            catch (error) {
                handleComplete(error);
            }
            return [2 /*return*/];
        });
    }); };
    var notify = react_admin_2.useNotify();
    var dataProvider = react_admin_2.useDataProvider();
    var onFileAdded = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var file, values_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = e.target.files && e.target.files[0];
                    setFileName(file.name);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, csv_extractor_1.processCsvFile(file, parseConfig)];
                case 2:
                    values_1 = _a.sent();
                    if (logging) {
                        console.log({ values: values_1 });
                    }
                    setValues(values_1);
                    setErrorTxt(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    setValues(null);
                    setErrorTxt(error_2.toString());
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_admin_1.Button, { color: 'primary', component: 'span', variant: variant, label: label, onClick: openImportDialog },
            react_1.default.createElement(GetApp_1.default, { style: { transform: 'rotate(180deg)', fontSize: '20' } })),
        react_1.default.createElement(core_1.Dialog, { open: open, onClose: handleClose, "aria-labelledby": 'alert-dialog-title', "aria-describedby": 'alert-dialog-description' },
            react_1.default.createElement(core_1.DialogTitle, { id: 'alert-dialog-title' },
                i18nProvider.translate('csv.dialog.importTo'),
                " \"",
                resourceName,
                "\""),
            react_1.default.createElement(core_1.DialogContent, null,
                react_1.default.createElement("div", { id: 'alert-dialog-description', style: { fontFamily: 'sans-serif' } },
                    react_1.default.createElement("p", { style: { margin: '0px' } }, i18nProvider.translate('csv.dialog.dataFileReq')),
                    react_1.default.createElement("ol", null,
                        react_1.default.createElement("li", null, i18nProvider.translate('csv.dialog.extension')),
                        react_1.default.createElement("li", null, i18nProvider.translate('csv.dialog.idColumnCreate')),
                        react_1.default.createElement("li", null, i18nProvider.translate('csv.dialog.idColumnUpdate'))),
                    react_1.default.createElement(core_1.Button, { variant: 'contained', component: 'label' },
                        react_1.default.createElement("span", null, i18nProvider.translate('csv.dialog.chooseFile')),
                        react_1.default.createElement(GetApp_1.default, { style: { transform: 'rotate(180deg)', fontSize: '20' } }),
                        react_1.default.createElement("input", { type: 'file', style: { display: 'none' }, onChange: onFileAdded, accept: '.csv,.tsv,.txt' })),
                    !!fileName && (react_1.default.createElement("p", { style: { marginBottom: '0px' } },
                        i18nProvider.translate('csv.dialog.processed'),
                        ": ",
                        react_1.default.createElement("strong", null, fileName))),
                    !!values && (react_1.default.createElement("p", { style: { margin: '0px' } },
                        i18nProvider.translate('csv.dialog.rowCount'),
                        ": ",
                        react_1.default.createElement("strong", null, values.length))),
                    !!errorTxt && react_1.default.createElement("p", { style: { margin: '0px', color: 'red' } }, errorTxt))),
            react_1.default.createElement(core_1.DialogActions, null,
                react_1.default.createElement(core_1.Button, { onClick: handleClose },
                    react_1.default.createElement("span", null, i18nProvider.translate('csv.dialog.cancel'))),
                react_1.default.createElement(core_1.Button, { disabled: !values || importing || disableImportNew, onClick: handleSubmitCreate, color: 'secondary', variant: 'contained' },
                    importing && react_1.default.createElement(core_1.CircularProgress, { size: 18, thickness: 2 }),
                    react_1.default.createElement("span", null, i18nProvider.translate('csv.dialog.importNew'))),
                react_1.default.createElement(core_1.Button, { disabled: !values || importing || disableImportOverwrite, onClick: handleSubmitOverwrite, color: 'primary', variant: 'contained' },
                    importing && react_1.default.createElement(core_1.CircularProgress, { size: 18, thickness: 2 }),
                    react_1.default.createElement("span", null, i18nProvider.translate('csv.dialog.importOverride')))))));
};
