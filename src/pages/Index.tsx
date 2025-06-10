
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import KaratsubaVisualization from '@/components/KaratsubaVisualization';
import { Calculator, BookOpen, Zap } from 'lucide-react';

const Index = () => {
  const [base, setBase] = useState<string>('10');
  const [number1, setNumber1] = useState<string>('');
  const [number2, setNumber2] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    if (!number1 || !number2) {
      alert('Mohon masukkan kedua bilangan!');
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculation = performKaratsuba(number1, number2, parseInt(base));
      setResult(calculation);
      setIsCalculating(false);
    }, 500);
  };

  const performKaratsuba = (x: string, y: string, base: number) => {
    // Convert to decimal for calculation
    const xDecimal = parseInt(x, base);
    const yDecimal = parseInt(y, base);
    
    if (isNaN(xDecimal) || isNaN(yDecimal)) {
      throw new Error('Bilangan tidak valid untuk basis yang dipilih');
    }

    const steps = [];
    const result = karatsubaRecursive(xDecimal, yDecimal, steps, base);
    
    return {
      originalX: x,
      originalY: y,
      base: base,
      decimalResult: result,
      baseResult: result.toString(base).toUpperCase(),
      steps: steps
    };
  };

  const karatsubaRecursive = (x: number, y: number, steps: any[], base: number, depth: number = 0): number => {
    // Base case
    if (x < base && y < base) {
      const result = x * y;
      steps.push({
        type: 'base_case',
        x: x.toString(base).toUpperCase(),
        y: y.toString(base).toUpperCase(),
        result: result.toString(base).toUpperCase(),
        decimal: result,
        depth
      });
      return result;
    }

    // Find the size of the numbers
    const size = Math.max(x.toString(base).length, y.toString(base).length);
    const m = Math.ceil(size / 2);

    // Split the numbers
    const basePower = Math.pow(base, m);
    const high1 = Math.floor(x / basePower);
    const low1 = x % basePower;
    const high2 = Math.floor(y / basePower);
    const low2 = y % basePower;

    steps.push({
      type: 'split',
      x: x.toString(base).toUpperCase(),
      y: y.toString(base).toUpperCase(),
      m: m,
      high1: high1.toString(base).toUpperCase(),
      low1: low1.toString(base).toUpperCase(),
      high2: high2.toString(base).toUpperCase(),
      low2: low2.toString(base).toUpperCase(),
      depth
    });

    // Three recursive calls
    const z2 = karatsubaRecursive(high1, high2, steps, base, depth + 1);
    const z0 = karatsubaRecursive(low1, low2, steps, base, depth + 1);
    const z1 = karatsubaRecursive(high1 + low1, high2 + low2, steps, base, depth + 1) - z2 - z0;

    // Calculate final result
    const result = z2 * Math.pow(basePower, 2) + z1 * basePower + z0;

    steps.push({
      type: 'combine',
      z2: z2.toString(base).toUpperCase(),
      z1: z1.toString(base).toUpperCase(),
      z0: z0.toString(base).toUpperCase(),
      basePower: basePower.toString(base).toUpperCase(),
      result: result.toString(base).toUpperCase(),
      decimal: result,
      depth
    });

    return result;
  };

  const getBaseExamples = (base: string) => {
    const examples = {
      '2': 'Contoh: 10101, 11001',
      '8': 'Contoh: 345, 267',
      '10': 'Contoh: 12345, 6789',
      '16': 'Contoh: 6E9, 4AC'
    };
    return examples[base as keyof typeof examples] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Algoritma Karatsuba
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Algoritma perkalian cepat untuk bilangan besar dengan kompleksitas O(n^1.585)
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Input Bilangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="base">Basis Bilangan (B)</Label>
                <Select value={base} onValueChange={setBase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">Basis 2 (Biner)</SelectItem>
                    <SelectItem value="8">Basis 8 (Oktal)</SelectItem>
                    <SelectItem value="10">Basis 10 (Desimal)</SelectItem>
                    <SelectItem value="16">Basis 16 (Heksadesimal)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getBaseExamples(base)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="number1">Bilangan Pertama (x)</Label>
                <Input
                  id="number1"
                  value={number1}
                  onChange={(e) => setNumber1(e.target.value.toUpperCase())}
                  placeholder={base === '16' ? 'Contoh: 6E9' : base === '2' ? 'Contoh: 10101' : 'Masukkan bilangan'}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number2">Bilangan Kedua (y)</Label>
                <Input
                  id="number2"
                  value={number2}
                  onChange={(e) => setNumber2(e.target.value.toUpperCase())}
                  placeholder={base === '16' ? 'Contoh: 4AC' : base === '2' ? 'Contoh: 11001' : 'Masukkan bilangan'}
                  className="font-mono"
                />
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={isCalculating || !number1 || !number2}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menghitung...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Hitung dengan Karatsuba
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Visualization */}
        {result && <KaratsubaVisualization result={result} />}
      </div>
    </div>
  );
};

export default Index;
