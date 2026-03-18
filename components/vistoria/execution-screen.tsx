'use client';

import { useState, useRef } from 'react';
import { ArrowLeft, Camera, AlertTriangle, Check, Image as ImageIcon, ChevronRight, ChevronLeft, RefreshCw, Loader2 } from 'lucide-react';
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
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ExecutionScreenProps {
  atribuicao: Atribuicao;
  onBack: () => void;
  onComplete: () => void;
}

export function ExecutionScreen({ atribuicao, onBack, onComplete }: ExecutionScreenProps) {
  const [etapas, setEtapas] = useState<EtapaExecucao[]>(atribuicao.etapas);
  const [currentEtapaIndex, setCurrentEtapaIndex] = useState(0);
  const [impedimentoSheet, setImpedimentoSheet] = useState(false);
  const [localJustificativa, setLocalJustificativa] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const currentEtapa = etapas[currentEtapaIndex];
  const totalEtapas = etapas.length;

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const updateCurrentEtapa = (updates: Partial<EtapaExecucao>) => {
    const updatedEtapas = [...etapas];
    updatedEtapas[currentEtapaIndex] = { ...currentEtapa, ...updates };
    setEtapas(updatedEtapas);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Gera um nome único para o ficheiro
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `vistoria-${atribuicao.id}-etapa-${currentEtapa.id}-${Date.now()}.${fileExt}`;
      
      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('checklists-fotos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Obtém a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from('checklists-fotos')
        .getPublicUrl(fileName);

      updateCurrentEtapa({ 
        foto_url: publicUrlData.publicUrl, 
        status: 'concluida',
        justificativa: undefined 
      });

      toast({ title: "Sucesso", description: "Fotografia anexada com sucesso." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro de Upload", description: error.message });
    } finally {
      setIsUploading(false);
      // Limpa o input para permitir tirar a mesma foto de novo se necessário
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveImpedimento = () => {
    if (!localJustificativa.trim()) return;

    updateCurrentEtapa({
      status: 'impedida',
      justificativa: localJustificativa.trim(),
      foto_url: undefined
    });

    setLocalJustificativa('');
    setImpedimentoSheet(false);
  };

  const handleNext = () => {
    if (currentEtapa.status === 'pendente') {
      updateCurrentEtapa({ status: 'concluida' });
    }

    if (currentEtapaIndex < totalEtapas - 1) {
      setCurrentEtapaIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentEtapaIndex > 0) {
      setCurrentEtapaIndex(prev => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        atribuicao_id: atribuicao.id,
        resultados: etapas.map(e => ({
          id_etapa: e.id,
          foto_url: e.foto_url || null,
          justificativa: e.justificativa || null
        }))
      };

      const response = await fetch(`${API_URL}/api/execucoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao sincronizar vistoria com o servidor.');

      toast({ title: "Missão Cumprida", description: "A vistoria foi enviada para o gestor!" });
      onComplete();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro de Sincronização", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAdvance = !currentEtapa.requer_foto || !!currentEtapa.foto_url || !!currentEtapa.justificativa;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Vistoria Pronta!</h2>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Todas as etapas foram revistas. Clique abaixo para sincronizar os dados com a nuvem.
        </p>
        <Button 
          onClick={handleFinalSubmit} 
          disabled={isSubmitting}
          className="w-full max-w-xs h-14 bg-primary hover:bg-primary/90 text-lg shadow-lg"
        >
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> A Enviar...</> : 'Enviar para Auditoria'}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 h-14 px-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2">
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
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  etapa.status === 'concluida' ? 'bg-green-500'
                  : etapa.status === 'impedida' ? 'bg-amber-500'
                  : i === currentEtapaIndex ? 'bg-primary scale-y-125'
                  : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center font-medium">
            Etapa {currentEtapaIndex + 1} de {totalEtapas}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-5">
        <div className="mb-6">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
            Etapa {currentEtapaIndex + 1}
          </span>
          <h2 className="text-2xl font-bold text-foreground mt-3 leading-tight">
            {currentEtapa.descricao}
          </h2>
          {currentEtapa.requer_foto && (
            <p className="text-sm font-medium text-muted-foreground mt-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> OBRIGATÓRIO FOTOGRAFIA
            </p>
          )}
        </div>

        {/* Preview da Foto */}
        {currentEtapa.foto_url && (
          <div className="mb-6 relative rounded-2xl overflow-hidden aspect-square bg-muted shadow-inner border border-border">
            <img
              src={currentEtapa.foto_url}
              alt="Fotografia capturada"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md">
              <Check className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Aviso de Impedimento */}
        {currentEtapa.justificativa && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
              <AlertTriangle className="w-5 h-5" />
              <span>Impedimento Relatado</span>
            </div>
            <p className="text-sm text-amber-800 mt-2">{currentEtapa.justificativa}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={handleTakePhoto}
            disabled={isUploading}
            variant={currentEtapa.foto_url ? "outline" : "default"}
            className={`w-full h-14 font-semibold text-base ${!currentEtapa.foto_url ? 'bg-primary hover:bg-primary/90 shadow-md' : 'border-2'}`}
          >
            {isUploading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> A processar...</>
            ) : currentEtapa.foto_url ? (
              <><RefreshCw className="w-5 h-5 mr-2" /> Tirar Outra Fotografia</>
            ) : (
              <><Camera className="w-6 h-6 mr-2" /> Tirar Fotografia</>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setLocalJustificativa(currentEtapa.justificativa || '');
              setImpedimentoSheet(true);
            }}
            disabled={isUploading}
            className="w-full h-14 border-2 border-amber-200 text-amber-600 hover:bg-amber-50 font-semibold"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            {currentEtapa.justificativa ? 'Editar Impedimento' : 'Relatar Impedimento'}
          </Button>
        </div>
      </main>

      {/* Footer Fixo */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentEtapaIndex === 0 || isUploading}
          className="h-12 flex-1 border-2 font-semibold"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Anterior
        </Button>

        <Button 
          onClick={handleNext} 
          disabled={!canAdvance || isUploading}
          className="h-12 flex-1 font-semibold text-base bg-foreground text-background hover:bg-foreground/90 transition-all"
        >
          {currentEtapaIndex === totalEtapas - 1 ? 'Concluir' : 'Avançar'} <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Sheet de Impedimento */}
      <Sheet open={impedimentoSheet} onOpenChange={setImpedimentoSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[70vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Motivo do Impedimento
            </SheetTitle>
            <SheetDescription>
              Explique detalhadamente por que esta etapa não pode ser concluída ou fotografada.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Textarea
              placeholder="Ex: Portão trancado, área interditada pela segurança..."
              value={localJustificativa}
              onChange={(e) => setLocalJustificativa(e.target.value)}
              className="min-h-[150px] resize-none text-base p-4"
              autoFocus
            />
          </div>

          <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
            <Button
              onClick={handleSaveImpedimento}
              disabled={!localJustificativa.trim()}
              className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg"
            >
              Confirmar Impedimento
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}