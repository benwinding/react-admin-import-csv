export default {
  csv: {
    main: {
      import: 'Import',
    },
    error: {
      noId: "Overwrite requires field 'id'",
      hasId: "Create should not include field 'id'",
      importing: 'Error importing',
      emptyResource:
        "The 'resource' property was empty, did you pass in the {...props} to the ImportButton?",
    },
    alert: {
      imported: 'Imported %{filename}',
    },
    dialog: {
      importTo: 'Import to',
      dataFileReq: 'Data file requirements',
      extension: "Must be a '.csv' or '.tsv' file",
      idColumnCreate: "Must not contain an 'id' column for new",
      idColumnUpdate: "Must contain an 'id' column for overwrite",
      chooseFile: 'Choose File',
      processed: 'Processed',
      rowCount: 'Row Count',
      cancel: 'Cancel',
      importNew: 'Import as New',
      importOverride: 'Import as Overwrite ',
    },
  },
};
