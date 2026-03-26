import { Next } from '@/lib/serverAction/createServerAction/types';
import { DocumentItemInputs } from '../../lib/types/document';
import { getDocument } from '../../queries';

export const getDocumentMiddleware = (paramIndex: number) => async (next: Next, req: any) => {
  const document = await getDocument(req.params[paramIndex])
  req.document = document
  return next()
}

export const calculateVatAmount = (item: DocumentItemInputs) => {
  return ((item.unitPrice * item.quantity) * (1 + (item.vatkey / 100))) - (item.unitPrice * item.quantity);
}

export const calculateGrossAmount = (item: DocumentItemInputs) => {
  return (item.unitPrice * item.quantity) * (1 + (item.vatkey / 100));
}

