/*
 * Fublic API Surface of ngx-firestate
 */

import { connect } from "react-redux";
import { MainCsvImport } from "./main-csv-button";
import { ImportConfig } from "./config.interface";

export { MainCsvImport as ImportButton, ImportConfig };
export default connect()(MainCsvImport);
