"use strict";
/*
 * Fublic API Surface of ngx-firestate
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportButton = void 0;
var react_redux_1 = require("react-redux");
var import_csv_button_1 = require("./import-csv-button");
Object.defineProperty(exports, "ImportButton", { enumerable: true, get: function () { return import_csv_button_1.ImportButton; } });
exports.default = react_redux_1.connect()(import_csv_button_1.ImportButton);
