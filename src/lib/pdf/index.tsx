import { renderToBuffer } from "@react-pdf/renderer";
import { QuotePdf } from "./QuotePdf";

type QuotePdfData = Parameters<typeof QuotePdf>[0];

export const generateQuotePdfBuffer = async (data: QuotePdfData) => {
  return renderToBuffer(<QuotePdf {...data} />);
};
