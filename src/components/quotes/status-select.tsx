"use client";

type StatusSelectProps = {
  value: string;
};

export const QuoteStatusSelect = ({ value }: StatusSelectProps) => {
  return (
    <select
      name="status"
      defaultValue={value}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="h-10 w-full rounded-lg border border-gray-100 bg-white px-3 text-sm"
    >
      <option value="draft">Borrador</option>
      <option value="sent">Enviada</option>
      <option value="accepted">Aceptada</option>
      <option value="rejected">Rechazada</option>
    </select>
  );
};
