/*
 * Fublic API Surface of ngx-firestate
 */

import { connect } from "react-redux";
import { MainCsvImport } from "./main-csv-button";
import { ImportConfig } from "./config.interface";
import * as i18n from "./i18n";

export { MainCsvImport as ImportButton, ImportConfig, i18n };
export default connect()(MainCsvImport);
