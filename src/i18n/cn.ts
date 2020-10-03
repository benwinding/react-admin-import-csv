export default {
  csv: {
    buttonMain: {
      label: "进口",
      tooltip: "必须是“ .csv”或“ .tsv”文件",
      emptyResource:
        "'resource'属性为空，您是否将{... props}传递给ImportButton？",
    },
    parsing: {
      collidingIds: '找到冲突的“ id”字段',
      failedValidateRow: 'CSV未能通过验证要求',
      invalidCsv: '该文档无法解析为“ csv”文件',
    },
    dialogCommon: {
      subtitle: '将％{count}个项目从％{fileName}导入到“％{resource}”',
      conflictCount:
      "资源<strong>％{resource} </ strong>的ID冲突的记录还有<strong>％{conflictingCount} </ strong>个记录",
      buttons: {
        cancel: "取消",
      }
    },
    dialogImport: {
      alertClose: "导入的％{fname}",
      title: '导入到“％{resource}”',
      buttons: {
        replaceAllConflicts: "替换行",
        skipAllConflicts: "跳过这些行",
        letmeDecide: "让我为每一行决定",
      },
    },
    dialogDecide: {
      title: '将ID％{id}导入“％{resource}”',
      buttons: {
        replaceRow: "替换行id =％{id}",
        addAsNewRow: "添加为新行（请勿替换）",
        skipDontReplace: "跳过此行（请勿替换）",
      },
    },
    loading: "载入中...",
  },
};
