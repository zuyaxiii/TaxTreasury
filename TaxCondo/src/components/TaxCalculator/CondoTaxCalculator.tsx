"use client";
import React, { useState, useEffect } from "react";
import {
  TaxValues,
  CustomFees,
  PaymentShares,
  TaxResults,
  DetailedPeriod,
} from "@/app/api/types";
import { calculateTaxResults } from "@/app/utils/taxCalculator";
import {
  calculateDetailedHoldingPeriod,
  calculateHoldingPeriod,
  formatDetailedPeriod,
} from "@/app/utils/dateUtils";
import InputForm from "./InputForm";
import CustomFeesInput from "./CustomFeesInput";
import PaymentSharesSelector from "./PaymentSharesSelector";
import TaxResultsDisplay from "./TaxResultsDisplay";
import YoknewLogo from "@/app/Yoknew_logo.png";
import Image from "next/image";

const CondoTaxCalculator: React.FC = () => {
  const [values, setValues] = useState<TaxValues>({
    salePrice: "",
    assessedPrice: "",
    purchaseDate: "",
    saleDate: "",
    isRegistered: false,
    isRegisteredOverOneYear: false,
    loanAmount: "",
  });

  const [holdingPeriod, setHoldingPeriod] = useState<number | null>(null);
  const [registrationPeriod, _setRegistrationPeriod] = useState<number | null>(
    null
  );
  const [results, setResults] = useState<TaxResults | null>(null);

  const [useCustomFees, setUseCustomFees] = useState(false);
  const [customFees, setCustomFees] = useState<CustomFees>({
    transferFee: "",
    mortgageFee: "",
  });

  const [paymentShares, setPaymentShares] = useState<PaymentShares>({
    transferFee: "50-50",
    specificBusinessTax: "50-50",
    stampDuty: "50-50",
    withholdingTax: "50-50",
    mortgageFee: "50-50",
  });

  const [detailedPeriod, setDetailedPeriod] = useState<DetailedPeriod>({
    years: 0,
    months: 0,
    days: 0,
  });
  const [_formattedPeriod, setFormattedPeriod] = useState<string>("");

  const updatePaymentShare = (key: string, value: string) => {
    setPaymentShares((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [sellerType, setSellerType] = useState<"individual" | "corporate">(
    "individual"
  );

  useEffect(() => {
    if (values.purchaseDate && values.saleDate) {
      setHoldingPeriod(
        calculateHoldingPeriod(values.purchaseDate, values.saleDate)
      );

      const detailed = calculateDetailedHoldingPeriod(
        values.purchaseDate,
        values.saleDate
      );
      setDetailedPeriod(detailed);
      setFormattedPeriod(formatDetailedPeriod(detailed));
    }
  }, [values.purchaseDate, values.saleDate]);

  const calculate = () => {
    if (holdingPeriod === null || isNaN(holdingPeriod)) {
      alert("เกิดข้อผิดพลาดในการคำนวณระยะเวลาถือครอง");
      return;
    }

    if (!values.salePrice || !values.assessedPrice || !values.loanAmount) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const salePrice = parseFloat(values.salePrice);
    const assessedPrice = parseFloat(values.assessedPrice);
    const loanAmount = parseFloat(values.loanAmount);

    const transferFeeRate = useCustomFees
      ? parseFloat(customFees.transferFee) / 100 || 0
      : 0.02;

    const mortgageFeeRate = useCustomFees
      ? parseFloat(customFees.mortgageFee) / 100 || 0
      : 0.01;

    const isCorporate = sellerType === "corporate";

    const calculatedResults = calculateTaxResults(
      salePrice,
      assessedPrice,
      loanAmount,
      holdingPeriod,
      values.isRegistered,
      values.isRegisteredOverOneYear,
      registrationPeriod,
      transferFeeRate,
      mortgageFeeRate,
      isCorporate
    );

    setResults(calculatedResults);
  };

  const renderSellerTypeSelection = () => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ประเภทผู้ขาย
        </label>
        <div className="flex items-center">
          <div className="mr-4">
            <input
              type="radio"
              id="individual"
              name="sellerType"
              value="individual"
              checked={sellerType === "individual"}
              onChange={() => setSellerType("individual")}
              className="mr-2"
            />
            <label htmlFor="individual">บุคคลธรรมดา</label>
          </div>
          <div>
            <input
              type="radio"
              id="corporate"
              name="sellerType"
              value="corporate"
              checked={sellerType === "corporate"}
              onChange={() => setSellerType("corporate")}
              className="mr-2"
            />
            <label htmlFor="corporate">นิติบุคคล</label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-4xl mx-auto pt-6 pr-6">
        <div className="flex justify-end ml-10">
          <Image src={YoknewLogo} alt="Logo" width={150} height={150} />
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="font-prompt text-2xl font-bold mb-4">
          โปรแกรมคำนวณค่าโอนคอนโดมือสอง ภาษีธุรกิจเฉพาะ ค่าจดจำนอง
          และค่าธรรมเนียมอื่นๆ ที่จะต้องชำระ ณ สำนักงานที่ดิน
        </h1>

        <div className="mb-4 p-4 bg-white w-full rounded-xl shadow-lg">
          <div className="font-prompt font-medium mb-2">
            <h2 className="font-bold text-xl mb-4">ประเภทผู้ขาย</h2>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <input
                type="radio"
                id="individual"
                name="sellerType"
                value="individual"
                checked={sellerType === "individual"}
                onChange={() => setSellerType("individual")}
                className="mr-2"
              />
              <label htmlFor="individual" className="font-prompt">
                บุคคลธรรมดา
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="corporate"
                name="sellerType"
                value="corporate"
                checked={sellerType === "corporate"}
                onChange={() => setSellerType("corporate")}
                className="mr-2"
              />
              <label htmlFor="corporate" className="font-prompt">
                นิติบุคคล
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <InputForm
            values={values}
            setValues={setValues}
            sellerType={sellerType}
          />
        </div>

        <div className="mb-4">
          <CustomFeesInput
            useCustomFees={useCustomFees}
            setUseCustomFees={setUseCustomFees}
            customFees={customFees}
            setCustomFees={setCustomFees}
          />
        </div>

        <div className="mb-4">
          <PaymentSharesSelector
            paymentShares={paymentShares}
            updatePaymentShare={updatePaymentShare}
          />
        </div>

        <div className="mb-4">
          <button
            onClick={calculate}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            คำนวณค่าธรรมเนียมและภาษี
          </button>
        </div>

        {results && (
          <TaxResultsDisplay
            results={results}
            paymentShares={paymentShares}
            detailedPeriod={detailedPeriod}
            sellerType={sellerType}
          />
        )}
      </div>
    </>
  );
};

export default CondoTaxCalculator;
