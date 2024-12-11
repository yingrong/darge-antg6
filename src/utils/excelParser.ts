import * as XLSX from 'xlsx';

interface GraphNode {
  id: string;
  combo: string;
  data: {
    label: string;
  };
}

interface GraphEdge {
  source: string;
  target: string;
}

interface GraphCombo {
  id: string;
  label: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  combos: GraphCombo[];
}

export const parseExcelToGraphData = async (file: File): Promise<GraphData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 假设Excel的第一个sheet包含数据
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将Excel数据转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 用于存储已处理的节点和组合，避免重复
        const processedNodes = new Map<string, GraphNode>();
        const processedCombos = new Map<string, GraphCombo>();
        const edges: GraphEdge[] = [];
        
        // 处理每一行数据
        jsonData.forEach((row: any) => {
          // 假设Excel中有source, sourceCombo, target, targetCombo列
          const sourceId = row.source?.toString();
          const targetId = row.target?.toString();
          const sourceCombo = row.sourceCombo?.toString();
          const targetCombo = row.targetCombo?.toString();
          
          if (sourceId && !processedNodes.has(sourceId)) {
            processedNodes.set(sourceId, {
              id: sourceId,
              combo: sourceCombo,
              data: {
                label: row.sourceLabel || sourceId
              }
            });
            
            // 处理source的combo
            if (sourceCombo && !processedCombos.has(sourceCombo)) {
              processedCombos.set(sourceCombo, {
                id: sourceCombo,
                label: row.sourceComboLabel || sourceCombo
              });
            }
          }
          
          if (targetId && !processedNodes.has(targetId)) {
            processedNodes.set(targetId, {
              id: targetId,
              combo: targetCombo,
              data: {
                label: row.targetLabel || targetId
              }
            });
            
            // 处理target的combo
            if (targetCombo && !processedCombos.has(targetCombo)) {
              processedCombos.set(targetCombo, {
                id: targetCombo,
                label: row.targetComboLabel || targetCombo
              });
            }
          }
          
          if (sourceId && targetId) {
            edges.push({
              source: sourceId,
              target: targetId
            });
          }
        });
        
        const graphData: GraphData = {
          nodes: Array.from(processedNodes.values()),
          edges: edges,
          combos: Array.from(processedCombos.values())
        };
        
        resolve(graphData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// 添加生成模板的函数
export const generateExcelTemplate = () => {
  // 示例数据
  const templateData = [
    {
      source: 'kpi1',
      sourceLabel: '销售指标1',
      sourceCombo: 'dps1',
      sourceComboLabel: '销售部门',
      target: 'kpi2',
      targetLabel: '销售指标2',
      targetCombo: 'dps1',
      targetComboLabel: '销售部门'
    },
    {
      source: 'kpi1',
      sourceLabel: '销售指标1',
      sourceCombo: 'dps1',
      sourceComboLabel: '销售部门',
      target: 'kpi3',
      targetLabel: '运营指标1',
      targetCombo: 'dps3',
      targetComboLabel: '运营部门'
    }
  ];

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  
  // 将数据转换为工作表
  const ws = XLSX.utils.json_to_sheet(templateData);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  
  // 生成二进制数据
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
  // 创建Blob对象
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // 创建下载链接并触发下载
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'graph_template.xlsx';
  link.click();
  
  // 清理URL对象
  window.URL.revokeObjectURL(url);
};
