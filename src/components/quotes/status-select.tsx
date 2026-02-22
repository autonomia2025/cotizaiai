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
      className="h-10 w-full rounded-xl border border-border/60 bg-white/70 px-3 text-sm"
    >
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
};
