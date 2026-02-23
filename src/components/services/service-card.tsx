"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submit-button";
import { ActionForm } from "@/components/forms/action-form";
import { updateServiceAction, deleteServiceAction } from "@/lib/actions/services";

type Service = {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
};

export const ServiceCard = ({ service }: { service: Service }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="border-gray-100 bg-white p-6 shadow-sm">
      {isEditing ? (
        <ActionForm
          action={updateServiceAction}
          className="grid gap-4"
          successMessage="Servicio actualizado"
        >
          <input type="hidden" name="service_id" value={service.id} />
          <Input name="name" defaultValue={service.name} required />
          <Input
            name="base_price"
            type="number"
            step="0.01"
            defaultValue={service.base_price}
            required
          />
          <Textarea
            name="description"
            rows={3}
            defaultValue={service.description ?? ""}
          />
          <div className="flex flex-wrap gap-2">
            <SubmitButton>Guardar</SubmitButton>
            <button
              type="button"
              className="rounded-lg border border-gray-100 px-4 py-2 text-sm"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </ActionForm>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm font-semibold">
              ${Number(service.base_price).toFixed(2)}
            </p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {service.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-100 px-4 py-2 text-sm"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
            <ActionForm
              action={deleteServiceAction}
              successMessage="Servicio eliminado"
            >
              <input type="hidden" name="service_id" value={service.id} />
              <SubmitButton
                variant="destructive"
                onClick={(event) => {
                  if (!window.confirm("¿Eliminar este servicio?")) {
                    event.preventDefault();
                  }
                }}
              >
                Eliminar
              </SubmitButton>
            </ActionForm>
          </div>
        </div>
      )}
    </Card>
  );
};
