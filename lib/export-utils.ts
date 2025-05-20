import * as XLSX from 'xlsx';

interface ExportOptions {
  filename: string;
  sheetName?: string;
  headers: string[];
  data: any[];
  columnKeys: string[];
}

export function exportToExcel({
  filename,
  sheetName = 'Sheet1',
  headers,
  data,
  columnKeys,
}: ExportOptions) {
  // 准备数据
  const exportData = data.map(item => {
    const row: Record<string, any> = {};
    columnKeys.forEach((key, index) => {
      // 处理日期
      if (key === 'date') {
        row[headers[index]] = new Date(item[key]).toLocaleDateString();
      }
      // 处理数字
      else if (typeof item[key] === 'number') {
        row[headers[index]] = item[key].toLocaleString();
      }
      // 处理客户名称
      else if (key === 'customer') {
        row[headers[index]] = item[key].name;
      }
      // 其他字段
      else {
        row[headers[index]] = item[key];
      }
    });
    return row;
  });

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // 设置列宽
  const colWidths = headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidths;

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 导出文件
  XLSX.writeFile(wb, `${filename}.xlsx`);
} 