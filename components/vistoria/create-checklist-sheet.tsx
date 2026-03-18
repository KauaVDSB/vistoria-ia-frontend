'use client';

import { useState } from 'react';
import { Plus, Trash2, Camera } from 'lucide-react';
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

interface EtapaForm {
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
    { descricao: '', requer_foto: true },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEtapa = () => {
    setEtapas([...etapas, { descricao: '', requer_foto: true }]);
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

    // TODO: Conectar à API Flask
    // const response = await fetch('API_BASE_URL/api/checklists', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //   },
    //   body: JSON.stringify(payload),
    // });

    // Simula delay de API
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
    setEtapas([{ descricao: '', requer_foto: true }]);
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

        <div className="flex-1 overflow-y-auto pb-20">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="titulo">Título do Checklist</FieldLabel>
              <Input
                id="titulo"
                placeholder="Ex: Vistoria Pátio A"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="staffEmail">E-mail do Responsável</FieldLabel>
              <Input
                id="staffEmail"
                type="email"
                placeholder="colaborador@empresa.com"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
              />
            </Field>
          </FieldGroup>

          {/* Etapas */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Etapas ({etapas.length})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddEtapa}
                className="text-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {etapas.map((etapa, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-xl space-y-3"
                >
                  <div className="flex gap-2">
                    <Input
                      placeholder={`Etapa ${index + 1} - Descrição`}
                      value={etapa.descricao}
                      onChange={(e) => handleEtapaChange(index, 'descricao', e.target.value)}
                      className="flex-1"
                    />
                    {etapas.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEtapa(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={etapa.requer_foto}
                      onCheckedChange={(checked) => handleEtapaChange(index, 'requer_foto', checked === true)}
                    />
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Exige foto</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !titulo.trim() || !staffEmail.trim() || etapas.some(e => !e.descricao.trim())}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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
