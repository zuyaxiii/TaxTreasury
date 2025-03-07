import html2canvas from 'html2canvas';
import { ExportOptions } from '../api/types';

/**
 * ฟังก์ชันสำหรับ export element เป็นไฟล์ JPG
 * @param elementId - ID ของ element ที่ต้องการ export
 * @param options - ตัวเลือกเพิ่มเติมสำหรับการ export
 */
export const exportElementAsJpg = async (
  elementId: string, 
  options: ExportOptions = {}
): Promise<void> => {
  const {
    scale = 2,
    quality = 0.9,
    backgroundColor = '#ffffff',
    filename = `export-${new Date().toISOString().split('T')[0]}`,
    includeHeader = false,
    addWatermark = false,
    watermarkText = 'สำเนาเอกสาร'
  } = options;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const exportElement = prepareElementForExport(element, {
      includeHeader,
      addWatermark,
      watermarkText
    });

    const canvas = await html2canvas(exportElement, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor,
      allowTaint: true
    });

    if (exportElement !== element) {
      document.body.removeChild(exportElement);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    downloadImage(dataUrl, `${filename}.jpg`);

    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting element as JPG:', error);
    return Promise.reject(error);
  }
};

/**
 * ฟังก์ชันสำหรับเตรียม element ก่อน export
 * @private
 */
const prepareElementForExport = (
  originalElement: HTMLElement, 
  options: Pick<ExportOptions, 'includeHeader' | 'addWatermark' | 'watermarkText'>
): HTMLElement => {
  const { includeHeader, addWatermark, watermarkText } = options;
  
  const exportWrapper = document.createElement('div');
  exportWrapper.id = 'temp-export-wrapper';
  exportWrapper.style.position = 'fixed';
  exportWrapper.style.left = '-9999px';
  exportWrapper.style.top = '-9999px';
  exportWrapper.style.background = '#ffffff';
  exportWrapper.style.padding = '20px';
  exportWrapper.style.width = `${originalElement.offsetWidth || 800}px`;
  
  const contentClone = originalElement.cloneNode(true) as HTMLElement;
  
  contentClone.classList.remove('hidden');
  contentClone.style.display = 'block';
  contentClone.style.visibility = 'visible';
  
  const allHiddenElements = contentClone.querySelectorAll('.hidden');
  allHiddenElements.forEach(el => {
    (el as HTMLElement).classList.remove('hidden');
    (el as HTMLElement).style.display = 'block';
    (el as HTMLElement).style.visibility = 'visible';
  });
  
  if (includeHeader) {
    const header = document.createElement('div');
    header.style.marginBottom = '20px';
    header.style.borderBottom = '1px solid #eaeaea';
    header.style.paddingBottom = '10px';
    header.innerHTML = `
      <h2 style="color: #333; margin: 0; font-size: 18px;">ข้อมูลอสังหาริมทรัพย์</h2>
      <p style="color: #666; margin: 5px 0 0;">วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
    `;
    exportWrapper.appendChild(header);
  }
  
  exportWrapper.appendChild(contentClone);
  
  if (addWatermark) {
    const watermark = document.createElement('div');
    watermark.style.position = 'absolute';
    watermark.style.top = '0';
    watermark.style.left = '0';
    watermark.style.width = '100%';
    watermark.style.height = '100%';
    watermark.style.display = 'flex';
    watermark.style.alignItems = 'center';
    watermark.style.justifyContent = 'center';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '1000';
    watermark.innerHTML = `
      <div style="transform: rotate(-45deg); font-size: 48px; opacity: 0.1; color: #000;">${watermarkText}</div>
    `;
    exportWrapper.appendChild(watermark);
  }

  document.body.appendChild(exportWrapper);
  
  return exportWrapper;
};

/**
 * ฟังก์ชันสำหรับดาวน์โหลดรูปภาพ
 * @private
 */
const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(dataUrl);
  }, 100);
};


export const exportElementAsPdf = async (
  elementId: string,
  options: ExportOptions = {}
): Promise<void> => {
  try {
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.default;
    
    const filename = options.filename || `export-${new Date().toISOString().split('T')[0]}`;
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }
    
    const exportElement = prepareElementForExport(element, {
      includeHeader: options.includeHeader,
      addWatermark: options.addWatermark,
      watermarkText: options.watermarkText
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const canvas = await html2canvas(exportElement, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false,
      backgroundColor: options.backgroundColor || '#ffffff'
    });
    
    if (exportElement !== element) {
      document.body.removeChild(exportElement);
    }

    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', options.quality || 0.95);
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
    pdf.save(`${filename}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error exporting element as PDF:', error);
    
    if (error instanceof Error && error.message.includes('jspdf')) {
      console.warn('Please install jspdf first: npm install jspdf jspdf-autotable');
    }
    
    return Promise.reject(error);
  }
};