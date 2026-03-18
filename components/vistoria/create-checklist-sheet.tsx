'use client';

import { useState } from 'react';
import { Plus, Trash2, Camera, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import type { CreateChecklistPayload } from '@/lib/types';
import { cn } from '@/lib/utils';

// Adicionamos um ID local apenas para controle perfeito do React durante o Drag and Drop
interface EtapaForm {
  id: string; 
  descricao: string;
  requer_foto: boolean;
}

interface CreateChecklistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateChecklistPayload) => void;
}

export function CreateChecklistSheet({ open, onOpenChange, onSubmit }: CreateChecklistSheetProps) {
  const [titulo, setTitulo] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [etapas, setEtapas] = useState<EtapaForm[]>([
    { id: crypto.randomUUID(), descricao: '', requer_foto: true },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddEtapa = () => {
    setEtapas([...etapas, { id: crypto.randomUUID(), descricao: '', requer_foto: true }]);
  };

  const handleRemoveEtapa = (index: number) => {
    if (etapas.length > 1) {
      setEtapas(etapas.filter((_, i) => i !== index));
    }
  };

  const handleEtapaChange = (index: number, field: keyof EtapaForm, value: string | boolean) => {
    const newEtapas = [...etapas];
    newEtapas[index] = { ...newEtapas[index], [field]: value };
    setEtapas(newEtapas);
  };

  // --- LÓGICA DE DRAG AND DROP NATIVA ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newEtapas = [...etapas];
    const draggedItem = newEtapas[draggedIndex];
    
    // Remove o item da posição original e insere na nova
    newEtapas.splice(draggedIndex, 1);
    newEtapas.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setEtapas(newEtapas);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  // ---------------------------------------

  const handleSubmit = async () => {
    if (!titulo.trim() || !staffEmail.trim() || etapas.some(e => !e.descricao.trim())) {
      return;
    }

    setIsSubmitting(true);

    const payload: CreateChecklistPayload = {
      titulo: titulo.trim(),
      staff_email: staffEmail.trim(),
      etapas: etapas.map(e => ({
        descricao: e.descricao.trim(),
        requer_foto: e.requer_foto,
      })),
    };

    setTimeout(() => {
      onSubmit(payload);
      resetForm();
      setIsSubmitting(false);
      onOpenChange(false);
    }, 800);
  };

  const resetForm = () => {
    setTitulo('');
    setStaffEmail('');
    setEtapas([{ id: crypto.randomUUID(), descricao: '', requer_foto: true }]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Criar Modelo de Checklist</SheetTitle>
          <SheetDescription>
            Defina as etapas da vistoria e atribua a um responsável
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pb-24 px-1">
          {/* Correção Demanda E: Espaçamentos (space-y-5) adicionados ao FieldGroup */}
          <FieldGroup className="space-y-5 mt-2">
            <Field>
              <FieldLabel htmlFor="titulo" className="mb-1.5 block font-medium">Título do Checklist</FieldLabel>
              <Input
                id="titulo"
                placeholder="Ex: Vistoria Pátio A"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="h-11"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="staffEmail" className="mb-1.5 block font-medium">E-mail do Responsável</FieldLabel>
              <Input
                id="staffEmail"
                type="email"
                placeholder="colaborador@empresa.com"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                className="h-11"
              />
            </Field>
          </FieldGroup>

          {/* Etapas */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-foreground">
                Etapas ({etapas.length})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddEtapa}
                className="text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {etapas.map((etapa, index) => (
                <div
                  key={etapa.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    "p-3 bg-muted rounded-xl space-y-3 border border-transparent transition-all",
                    draggedIndex === index ? "opacity-40 border-primary border-dashed shadow-sm" : "hover:border-border cursor-grab active:cursor-grabbing"
                  )}
                >
                  <div className="flex gap-2 items-center">
                    {/* Alça de Drag and Drop */}
                    <div className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab active:cursor-grabbing p-1 -ml-1">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <Input
                      placeholder={`Etapa ${index + 1} - Descrição`}
                      value={etapa.descricao}
                      onChange={(e) => handleEtapaChange(index, 'descricao', e.target.value)}
                      className="flex-1 bg-background"
                    />
                    {etapas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEtapa(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="pl-9">
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <Checkbox
                        checked={etapa.requer_foto}
                        onCheckedChange={(checked) => handleEtapaChange(index, 'requer_foto', checked === true)}
                      />
                      <Camera className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground select-none">Exige foto</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !titulo.trim() || !staffEmail.trim() || etapas.some(e => !e.descricao.trim())}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Criando...
              </span>
            ) : (
              'Criar Checklist'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}