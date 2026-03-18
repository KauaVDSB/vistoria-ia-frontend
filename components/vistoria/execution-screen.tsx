'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Camera, AlertTriangle, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import type { Atribuicao, EtapaExecucao } from '@/lib/types';

interface ExecutionScreenProps {
  atribuicao: Atribuicao;
  onBack: () => void;
  onComplete: () => void;
}

export function ExecutionScreen({ atribuicao, onBack, onComplete }: ExecutionScreenProps) {
  const [etapas, setEtapas] = useState<EtapaExecucao[]>(atribuicao.etapas);
  const [currentEtapaIndex, setCurrentEtapaIndex] = useState(
    etapas.findIndex(e => e.status === 'pendente')
  );
  const [impedimentoSheet, setImpedimentoSheet] = useState(false);
  const [justificativa, setJustificativa] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentEtapa = etapas[currentEtapaIndex >= 0 ? currentEtapaIndex : 0];
  const totalEtapas = etapas.length;
  const etapasConcluidas = etapas.filter(e => e.status !== 'pendente').length;

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setCapturedPhoto(photoUrl);
        
        // TODO: Upload para Supabase Storage
        // const formData = new FormData();
        // formData.append('file', file);
        // const response = await fetch('API_BASE_URL/api/upload', {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        //   body: formData,
        // });
        // const { url } = await response.json();
        
        // Simula conclusão da etapa
        setTimeout(() => {
          completeCurrentEtapa(photoUrl);
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const completeCurrentEtapa = (photoUrl: string | null) => {
    const updatedEtapas = [...etapas];
    updatedEtapas[currentEtapaIndex] = {
      ...currentEtapa,
      status: 'concluida',
      foto_url: photoUrl || undefined,
    };
    setEtapas(updatedEtapas);
    setCapturedPhoto(null);

    // TODO: Conectar à API Flask
    // await fetch('API_BASE_URL/api/execucoes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify({
    //     id_etapa: currentEtapa.id,
    //     foto_url: photoUrl,
    //     justificativa: null,
    //   }),
    // });

    // Avança para próxima etapa pendente
    const nextPendingIndex = updatedEtapas.findIndex((e, i) => i > currentEtapaIndex && e.status === 'pendente');
    if (nextPendingIndex >= 0) {
      setCurrentEtapaIndex(nextPendingIndex);
    } else if (updatedEtapas.every(e => e.status !== 'pendente')) {
      // Todas concluídas
      setTimeout(onComplete, 500);
    }
  };

  const handleSaveImpedimento = () => {
    if (!justificativa.trim()) return;

    const updatedEtapas = [...etapas];
    updatedEtapas[currentEtapaIndex] = {
      ...currentEtapa,
      status: 'impedida',
      justificativa: justificativa.trim(),
    };
    setEtapas(updatedEtapas);

    // TODO: Conectar à API Flask
    // await fetch('API_BASE_URL/api/execucoes', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify({
    //     id_etapa: currentEtapa.id,
    //     foto_url: null,
    //     justificativa: justificativa.trim(),
    //   }),
    // });

    setJustificativa('');
    setImpedimentoSheet(false);

    // Avança para próxima etapa pendente
    const nextPendingIndex = updatedEtapas.findIndex((e, i) => i > currentEtapaIndex && e.status === 'pendente');
    if (nextPendingIndex >= 0) {
      setCurrentEtapaIndex(nextPendingIndex);
    } else if (updatedEtapas.every(e => e.status !== 'pendente')) {
      setTimeout(onComplete, 500);
    }
  };

  const allComplete = etapas.every(e => e.status !== 'pendente');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 h-14 px-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-foreground truncate text-sm">
              {atribuicao.titulo}
            </h1>
          </div>
        </div>

        {/* Progress Bar Segmentada */}
        <div className="px-4 pb-3">
          <div className="flex gap-1.5">
            {etapas.map((etapa, i) => (
              <div
                key={etapa.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  etapa.status === 'concluida'
                    ? 'bg-green-500'
                    : etapa.status === 'impedida'
                    ? 'bg-amber-500'
                    : i === currentEtapaIndex
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Etapa {currentEtapaIndex + 1} de {totalEtapas}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        {allComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Vistoria Concluída!
            </h2>
            <p className="text-muted-foreground mb-6">
              Todas as etapas foram registradas com sucesso.
            </p>
            <Button onClick={onComplete} className="bg-primary hover:bg-primary/90">
              Voltar ao Início
            </Button>
          </div>
        ) : (
          <>
            {/* Current Step Title */}
            <div className="mb-6">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Etapa {currentEtapaIndex + 1}
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
                {currentEtapa.descricao}
              </h2>
              {currentEtapa.requer_foto && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Esta etapa requer uma foto
                </p>
              )}
            </div>

            {/* Photo Preview Area */}
            {capturedPhoto && (
              <div className="mb-6 relative rounded-xl overflow-hidden aspect-square bg-muted">
                <img
                  src={capturedPhoto}
                  alt="Foto capturada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-6 h-6" />
                    <span className="font-medium">Salvando...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              {/* Take Photo Button */}
              <Button
                onClick={handleTakePhoto}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
              >
                <Camera className="w-6 h-6 mr-3" />
                Tirar Foto
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Button>

              {/* Skip without photo (if not required) */}
              {!currentEtapa.requer_foto && (
                <Button
                  variant="outline"
                  onClick={() => completeCurrentEtapa(null)}
                  className="w-full h-12"
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Prosseguir sem foto
                </Button>
              )}

              {/* Report Impediment */}
              <Button
                variant="outline"
                onClick={() => setImpedimentoSheet(true)}
                className="w-full h-12 border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Relatar Impedimento
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Impedimento Sheet */}
      <Sheet open={impedimentoSheet} onOpenChange={setImpedimentoSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Relatar Impedimento
            </SheetTitle>
            <SheetDescription>
              Descreva o motivo pelo qual não foi possível completar esta etapa
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <Textarea
              placeholder="Ex: Portão trancado, área em manutenção, equipamento indisponível..."
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <SheetFooter>
            <Button
              onClick={handleSaveImpedimento}
              disabled={!justificativa.trim()}
              className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              Salvar Impedimento
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
