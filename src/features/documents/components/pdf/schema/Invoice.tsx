import { getVatRate } from '@/features/documents/utils/client';
import { InvoiceInputs } from '@/features/invoice/lib/types';
import { vatRates } from '@/features/items/lib/contants';
import { VatRate } from '@/features/items/utils/types';
import { paymentMethods } from '@/lib/constants';
import { formatPrice, normalizeDate } from '@/lib/utils';
import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer';
import { FC } from 'react';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
    },
    {
      src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
      fontWeight: 'bold',
    },
  ],
});





export const Invoice: FC<{ data: InvoiceInputs, title?: string, name: string, color: string, logo: string }> = ({ data, title, name, color, logo }) => {

  console.log({ tax: data?.customer?.taxnumber })

  const date = new Date();

  const exchangeRate = data.exchangeRate || 1

  const vatReasons = data.items && data.items.reduce((acc, curr) => {

    const vatAcc = [...acc]
    const vatRate = vatRates.find((vatKey) => vatKey.value === curr.vatkey) as VatRate
    const vatName = `${vatRate.value}${vatRate.reason ? ":" : ""} ${vatRate.reason}`

    const index = vatAcc.findIndex((vatRate) => vatRate.vatName === vatName)
    if (index >= 0) {
      vatAcc[index] = { vatName, price: vatAcc[index].price + vatRate.vatValue * curr.unitPrice * curr.quantity }
      return vatAcc
    } else {
      return [...vatAcc, { vatName, price: vatRate.vatValue * curr.unitPrice * curr.quantity }]
    }

  }, [] as ({ vatName: string, price: number })[])

  const grossAmountSummary = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (1 + getVatRate(item.vatkey).vatValue)), 0)
  const vatAmountSummary = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * getVatRate(item.vatkey).vatValue), 0)
  const netAmountSummary = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0)


  return (
    <Document >
      <Page size="A4" style={{ paddingHorizontal: '24px', paddingBottom: '42px', paddingTop: '24px', fontFamily: 'Inter', fontSize: 9, color: '#020617' }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', gap: "4px", width: '100%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: '22px' }}>{title || "Számla"}</Text>
            <View style={{ backgroundColor: "black", height: '1px', width: '100%' }} />
            <Text style={{ fontSize: "12px" }}>{name}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', gap: "12px", alignItems: "flex-end" }}>
            {logo !== 'default' && (
              <View style={{ maxWidth: '200px', maxHeight: '70px' }}>
                <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/images/${logo}`} style={{ width: 'auto', height: 'auto', objectFit: "contain" }} />
              </View>

            )}
            <View style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', gap: "4px", alignItems: 'flex-end', fontSize: "10px" }}>
              <Text >{data.supplier.name}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }} >Adószám:</Text>
                <Text>{data.supplier.taxnumber}</Text>
              </View>
              {data.supplier.groupMemberTaxNumber && (
                <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }} >Csoporttag adószám:</Text>
                  <Text>{data.supplier.groupMemberTaxNumber}</Text>
                </View>
              )}
              {data.supplier.communityVatNumber && (
                <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }} >Közösségi adószám:</Text>
                  <Text>{data.supplier.communityVatNumber}</Text>
                </View>
              )}
              <Text >{data.supplier.zip} {data.supplier.city}, {data.supplier.address}</Text>
              {data.supplier.mobile && <Text >{data.supplier.mobile}</Text>}
              {data.supplier.bankAccountNumber && (
                <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                  <Text style={{ fontWeight: "bold" }} >Bankszámlaszám:</Text>
                  <Text>{data.supplier.bankAccountNumber}</Text>
                </View>
              )}

            </View>
          </View>


        </View>
        <View style={{ backgroundColor: color, height: '2px', width: '100%', marginBottom: '16px' }} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>


          <View style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px', gap: "4px" }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Vevő</Text>
            <Text>{data?.customer?.name}</Text>
            {data?.customer?.taxnumber && (
              <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }} >Adószám:</Text>
                <Text>{data.customer.taxnumber}</Text>
              </View>
            )}
            {data?.customer?.groupMemberTaxNumber && (
              <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }} >Csoporttag adószám:</Text>
                <Text>{data.customer.groupMemberTaxNumber}</Text>
              </View>
            )}
            {data?.customer?.communityVatNumber && (
              <View style={{ display: 'flex', flexDirection: 'row', gap: "2px", alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }} >Közösségi adószám:</Text>
                <Text>{data.customer.communityVatNumber}</Text>
              </View>
            )}
            <Text>{data?.customer?.zip} {data?.customer?.city}, {data?.customer?.address}</Text>
            {data?.customer?.mobile && <Text>{data.customer.mobile}</Text>}

          </View>

          <View style={{ display: 'flex', width: 200, flexDirection: 'column', alignItems: "flex-end", marginBottom: '16px', gap: "4px" }}>
            <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold" }}>Kiállítva: </Text>
              <Text>{`${normalizeDate(date)}`}</Text>
            </View>
            <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold" }}>Fizetési mód: </Text>
              <Text>{paymentMethods.find(paymentMethod => paymentMethod.value === data.paymentMethod)?.label}</Text>
            </View>
            {data.currency !== "HUF" && data.exchangeRate && (
              <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "bold" }}>Árfolyam: </Text>
                <Text>{data.exchangeRate}</Text>
              </View>
            )}
            <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold" }}>Teljesítés dátuma: </Text>
              <Text>{data.completionDate}</Text>
            </View>
            <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "bold" }}>Fizetési határidő: </Text>
              <Text>{data.dueDate}</Text>
            </View>

          </View>

        </View>



        <View style={{ color: '#ffffff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: color, paddingVertical: '8px', paddingHorizontal: '12px', rowGap: '8px' }}>
          <Text style={{ fontWeight: 'bold', width: '30%' }}>Tétel</Text>
          <Text style={{ fontWeight: 'bold' }}>Mennyiség</Text>
          <Text style={{ fontWeight: 'bold' }}>Egységár</Text>
          <Text style={{ fontWeight: 'bold' }}>Nettó ár</Text>
          <Text style={{ fontWeight: 'bold' }}>Áfakulcs</Text>
          <Text style={{ fontWeight: 'bold' }}>Bruttó ár</Text>
        </View>
        {data.items && data.items && data.items.map((item, index) => {
          const bgColor = index % 2 ? '#f1f5f9' : '#ffffff';
          return (
            <View key={index} wrap={false} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: '8px', paddingHorizontal: '12px', rowGap: '8px', backgroundColor: bgColor }}>
              <Text style={{ width: '30%' }}>{item.name}</Text>
              <Text>{item.quantity} {item.unit}</Text>
              <Text>{formatPrice(item.unitPrice, data.currency)}</Text>
              <Text>{formatPrice((item.quantity * (item.unitPrice)), data.currency)}</Text>
              <Text>{item.vatkey}</Text>
              <Text>{formatPrice((item.quantity * (item.unitPrice) * (1 + getVatRate(item.vatkey).vatValue)), data.currency)}</Text>
            </View>
          )
        })}
        <View style={{ backgroundColor: color, height: '2px', width: '100%', marginBottom: '12px' }} />

        <View style={{ display: 'flex', width: 200, flexDirection: 'column', alignSelf: "flex-end", marginBottom: '12px', gap: "4px" }}>
          <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between" }}>
            <Text >Nettó összes: </Text>
            <Text style={{ fontWeight: "bold" }}>{formatPrice(netAmountSummary, data.currency)}</Text>
          </View>
          <View style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between", marginBottom: '8px' }}>
            <Text >Áfa összes: </Text>
            <Text style={{ fontWeight: "bold" }}>{formatPrice(vatAmountSummary, data.currency)} </Text>
          </View>

          {vatReasons && vatReasons.map((vatReason) => (
            <View key={vatReason.vatName} style={{ display: 'flex', width: "100%", flexDirection: 'row', gap: "2px", alignItems: "center", justifyContent: "space-between", color: "#7a7a7a" }}>
              <Text >{vatReason.vatName}</Text>
              <Text style={{ fontWeight: "bold" }}>{formatPrice(vatReason.price, data.currency)}</Text>
            </View>
          ))}

          <View style={{ display: 'flex', alignSelf: "flex-end", flexDirection: 'column', gap: "4px", minWidth: 200, alignItems: "flex-end", marginTop: "8px", paddingTop: "8px", borderTop: `2px solid ${color}` }}>
            <Text style={{ fontSize: "14px" }}>Összesen </Text>
            <Text style={{ fontWeight: "bold", fontSize: "20px" }}>{formatPrice(grossAmountSummary, data.currency)}</Text>
          </View>
          {data.currency !== "HUF" && (
            <View style={{ display: 'flex', width: "100%", flexDirection: 'column', alignSelf: "flex-end", marginBottom: '8px', gap: "4px" }}>
              <Text style={{ color: "#7a7a7a", alignSelf: "flex-end" }}>Áfa összes: {formatPrice(vatAmountSummary * exchangeRate, "HUF")}</Text>
              <Text style={{ color: "#7a7a7a", alignSelf: "flex-end" }}>Bruttó végösszeg: {formatPrice(grossAmountSummary * exchangeRate, "HUF")}</Text>

            </View>

          )}

        </View>
        <View style={{ backgroundColor: color, height: '2px', width: '100%', marginBottom: '14px' }} />

        <View style={{ display: 'flex', flexDirection: 'column', gap: "12px" }}>
          <Text style={{ fontSize: "12px" }}>Megjegyzés</Text>
          <Text >{data.comment}</Text>
        </View>

        <Text fixed style={{ position: 'absolute', bottom: '24px', left: '24px', textAlign: 'center', color: '#94a3b8', marginVertical: 'auto', fontSize: '9px' }}>Dokmester által létrehozva</Text>
        <Text fixed style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', marginVertical: 'auto', fontSize: '10px' }} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} />
        <View fixed style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
          <Image src={`/Banner.png`} style={{ width: '100%', maxWidth: '100px', opacity: .5 }} />
        </View>
      </Page>
    </Document>
  )
}
