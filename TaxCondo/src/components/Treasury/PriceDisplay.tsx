import { useState } from "react";

interface PriceDisplayProps {
  selectedPrice: number | undefined;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ selectedPrice }) => {
  const [area, setArea] = useState<number | "">("");
  const [copied, setCopied] = useState(false);

  if (!selectedPrice) return null;

  const total = area ? area * selectedPrice : 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(total.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <p className="text-sm text-gray-600 mb-1">ราคาประเมินต่อตารางเมตร</p>
      <p className="text-3xl font-bold text-blue-600">
        {selectedPrice.toLocaleString()} บาท
      </p>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm mb-2">
          กรอกขนาด (ตร.ม.)
        </label>
        <input
          type="number"
          value={area}
          onChange={(e) =>
            setArea(e.target.value === "" ? "" : parseFloat(e.target.value))
          }
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="กรอกขนาด (ตร.ม.)"
        />
      </div>

      {area && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">ราคารวม</p>
            <p className="text-2xl font-bold text-green-600">
              {total.toLocaleString()}
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
