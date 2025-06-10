
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Target, Divide, Combine } from 'lucide-react';

interface KaratsubaVisualizationProps {
  result: {
    originalX: string;
    originalY: string;
    base: number;
    decimalResult: number;
    baseResult: string;
    steps: any[];
  };
}

const KaratsubaVisualization: React.FC<KaratsubaVisualizationProps> = ({ result }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { originalX, originalY, base, decimalResult, baseResult, steps } = result;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'split': return <Divide className="w-5 h-5" />;
      case 'base_case': return <Target className="w-5 h-5" />;
      case 'combine': return <Combine className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'split': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'base_case': return 'bg-green-100 text-green-800 border-green-200';
      case 'combine': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStep = (step: any, index: number) => {
    const isActive = index === currentStep;
    const isPast = index < currentStep;
    
    return (
      <div 
        key={index}
        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
          isActive 
            ? 'border-blue-500 bg-blue-50 transform scale-105' 
            : isPast 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {getStepIcon(step.type)}
          <Badge className={getStepColor(step.type)}>
            {step.type === 'split' && 'Pembagian'}
            {step.type === 'base_case' && 'Kasus Dasar'}
            {step.type === 'combine' && 'Penggabungan'}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Kedalaman: {step.depth}
          </span>
        </div>

        {step.type === 'split' && (
          <div className="space-y-2">
            <p className="font-semibold">Membagi bilangan menjadi bagian tinggi dan rendah:</p>
            <div className="bg-white p-3 rounded border">
              <p><strong>x = {step.x}</strong> → tinggi: {step.high1}, rendah: {step.low1}</p>
              <p><strong>y = {step.y}</strong> → tinggi: {step.high2}, rendah: {step.low2}</p>
              <p className="text-sm text-muted-foreground">m = {step.m} (setengah dari panjang digit terpanjang)</p>
            </div>
          </div>
        )}

        {step.type === 'base_case' && (
          <div className="space-y-2">
            <p className="font-semibold">Perkalian langsung (bilangan kecil):</p>
            <div className="bg-white p-3 rounded border">
              <p className="text-lg">
                <span className="font-mono">{step.x}</span> × <span className="font-mono">{step.y}</span> = <span className="font-mono font-bold text-green-600">{step.result}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                (Basis {base}: {step.decimal} dalam desimal)
              </p>
            </div>
          </div>
        )}

        {step.type === 'combine' && (
          <div className="space-y-2">
            <p className="font-semibold">Menggabungkan hasil rekursif:</p>
            <div className="bg-white p-3 rounded border space-y-1">
              <p>z₂ = {step.z2} (perkalian bagian tinggi)</p>
              <p>z₀ = {step.z0} (perkalian bagian rendah)</p>
              <p>z₁ = {step.z1} (perkalian campuran)</p>
              <div className="mt-2 pt-2 border-t">
                <p className="font-semibold text-purple-600">
                  Hasil = z₂ × B^(2m) + z₁ × B^m + z₀ = {step.result}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Result Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Hasil Perhitungan</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold font-mono">
            <span className="text-blue-600">{originalX}</span>
            <span className="text-gray-500 mx-4">×</span>
            <span className="text-purple-600">{originalY}</span>
            <span className="text-gray-500 mx-4">=</span>
            <span className="text-green-600">{baseResult}</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-lg">
            <Badge variant="outline" className="px-4 py-2">
              Basis {base}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Desimal: {decimalResult.toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Langkah-langkah Algoritma Karatsuba</CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Langkah {currentStep + 1} dari {steps.length}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep} 
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextStep} 
                disabled={currentStep === steps.length - 1}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step */}
          {steps.length > 0 && renderStep(steps[currentStep], currentStep)}

          {/* Step Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Divide className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-blue-800">Pembagian</p>
              <p className="text-sm text-blue-600">
                {steps.filter(s => s.type === 'split').length} langkah
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-green-800">Kasus Dasar</p>
              <p className="text-sm text-green-600">
                {steps.filter(s => s.type === 'base_case').length} langkah
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Combine className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold text-purple-800">Penggabungan</p>
              <p className="text-sm text-purple-600">
                {steps.filter(s => s.type === 'combine').length} langkah
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Explanation */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle>Tentang Algoritma Karatsuba</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Prinsip Kerja:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Membagi bilangan menjadi bagian tinggi dan rendah</li>
                <li>• Melakukan 3 perkalian rekursif (bukan 4 seperti metode biasa)</li>
                <li>• Menggabungkan hasil dengan formula: z₂B²ᵐ + z₁Bᵐ + z₀</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Keunggulan:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Kompleksitas O(n^1.585) vs O(n²) metode konvensional</li>
                <li>• Efisien untuk bilangan sangat besar</li>
                <li>• Mengurangi jumlah perkalian yang diperlukan</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaratsubaVisualization;
