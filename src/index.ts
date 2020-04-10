/*
 * Fublic API Surface of ngx-firestate
 */

import { connect } from "react-redux";
import { ImportButton } from "./import-csv-button";
import { ImportConfig } from "./config.interface";

export { ImportButton, ImportConfig };
export default connect()(ImportButton);
