import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRGeneratorProps {
  mosqueId: string;
  mosqueName: string;
}

export function QRGenerator({ mosqueId, mosqueName }: QRGeneratorProps) {
  const currentUrl = window.location.origin;
  const mosqueUrl = `${currentUrl}/mosque/${mosqueId}`;

  const downloadQR = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(document.querySelector('#qr-code-svg')!);
    const img = new Image();
    
    canvas.width = 300;
    canvas.height = 300;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 300, 300);
      
      const link = document.createElement('a');
      link.download = `qr-${mosqueName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-card">
      <QRCodeSVG
        id="qr-code-svg"
        value={mosqueUrl}
        size={200}
        bgColor="transparent"
        fgColor="currentColor"
        level="M"
        includeMargin={true}
      />
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">امسح الرمز للوصول إلى صفحة المسجد</p>
        <Button onClick={downloadQR} className="gap-2">
          <Download className="w-4 h-4" />
          تحميل رمز QR
        </Button>
      </div>
    </div>
  );
}