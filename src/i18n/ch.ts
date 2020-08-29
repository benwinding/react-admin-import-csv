export default {
  csv: {
    main: {
      import: '导入',
    },
    error: {
      noId: "覆盖更新记录时，必须包含'id'字段",
      hasId: "创建新记录时，不能包含id字段",
      importing: '导入时发生错误',
      emptyResource:
        "'resource' 属性为空,你是否将{...props}设置到ImportButton了?",
    },
    alert: {
      imported: '导入完成',
    },
    dialog: {
      importTo: '导入到',
      dataFileReq: '数据文件要求',
      extension: "导入只支持'.csv' 或 '.tsv'的文件类型",
      idColumnCreate: "新增时不能包含'id'的列",
      idColumnUpdate: "更新时必须包含'id'的列",
      chooseFile: '选择文件',
      processed: '处理',
      rowCount: '记录合计',
      cancel: '取消',
      importNew: '新增导入',
      importOverride: '更新导入 ',
    },
  },
};
