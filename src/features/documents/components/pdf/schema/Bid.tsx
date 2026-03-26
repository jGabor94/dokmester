import { BidInputs } from '@/features/documents/lib/types/document';
import { vatRatesMap } from '@/features/items/lib/contants';
import { normalizeDate } from '@/lib/utils';
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

export const Bid: FC<{ data: BidInputs, name: string, color: string, logo: string }> = ({ data, name, color, logo }) => {

  const finalSummary = data.items && data.items.reduce((acc, curr) => acc + Number(Math.round((curr.unitPrice * (1 + (vatRatesMap[curr.vatkey].vatValue / 100))) * curr.quantity)), 0);
  const vatSummary = data.items && data.items.reduce((acc, curr) => acc + Number(Math.round((curr.unitPrice * ((vatRatesMap[curr.vatkey].vatValue / 100))) * curr.quantity)), 0);
  const itemsSummary = data.items && data.items.reduce((acc, curr) => acc + Number((curr.unitPrice * curr.quantity)), 0);
  const date = new Date();

  return (
    <Document>
      <Page size="A4" style={{ paddingHorizontal: '24px', paddingBottom: '42px', paddingTop: '24px', fontFamily: 'Inter', fontSize: '12px', color: '#020617' }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL}/images/${logo}`} style={{ width: 'auto', height: 'auto', maxWidth: '160px', maxHeight: '48px' }} />
          <Text style={{ fontWeight: 'bold', fontSize: '24px' }}>Árajánlat</Text>
        </View>
        <View style={{ borderTop: '2px', borderColor: color, marginBottom: '24px', paddingTop: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Kiállítva: {`${normalizeDate(date)}`}</Text>
          <Text>{name}</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Kérvényező adatai</Text>
            <Text style={{ marginBottom: '4px' }}>{data?.customer?.name}</Text>
            {data?.customer?.taxnumber && <Text style={{ marginBottom: '4px' }}>{data.customer.taxnumber}</Text>}
            <Text style={{ marginBottom: '4px' }}>{data?.customer?.zip} {data?.customer?.city}, {data?.customer?.address}</Text>
          </View>
          <View>
            <Text style={{ fontWeight: 'bold', marginBottom: '8px', marginLeft: 'auto', marginRight: '0', fontSize: '14px' }}>Kiállító adatai</Text>
            <Text style={{ marginLeft: 'auto', marginRight: '0', marginBottom: '4px' }}>{data.supplier.name}</Text>
            <Text style={{ marginLeft: 'auto', marginRight: '0', marginBottom: '4px' }}>{data.supplier.taxnumber}</Text>
            <Text style={{ marginLeft: 'auto', marginRight: '0', marginBottom: '4px' }}>{data.supplier.zip} {data.supplier.city}, {data.supplier.address}</Text>
          </View>
        </View>
        <View style={{ color: '#ffffff', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: color, paddingVertical: '8px', paddingHorizontal: '12px', rowGap: '8px' }}>
          <Text style={{ fontWeight: 'bold', width: '30%' }}>Tétel</Text>
          <Text style={{ fontWeight: 'bold' }}>Mennyiség</Text>
          <Text style={{ fontWeight: 'bold' }}>Egységár</Text>
          <Text style={{ fontWeight: 'bold' }}>Áfakulcs</Text>
          <Text style={{ fontWeight: 'bold' }}>Összeg</Text>
        </View>
        {data.items && data.items.map((item, index) => {
          const bgColor = index % 2 ? '#f1f5f9' : '#ffffff';
          return (
            <View key={index} wrap={false} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: '8px', paddingHorizontal: '12px', rowGap: '8px', backgroundColor: bgColor }}>
              <Text style={{ width: '30%' }}>{item.name}</Text>
              <Text style={{ textAlign: 'right', width: '20%' }}>{item.quantity} {item.unit}</Text>
              <Text style={{ textAlign: 'right', width: '20%' }}>{Number(item.unitPrice).toLocaleString('hu-HU')} Ft</Text>
              <Text style={{ textAlign: 'right', width: '10%' }}>{item.vatkey}%</Text>
              <Text style={{ textAlign: 'right', width: '20%' }}>{((item.quantity * (item.unitPrice))).toLocaleString('hu-HU')} Ft</Text>
            </View>
          )
        })}
        <View style={{ borderTop: '2px', borderColor: color, marginBottom: '16px', paddingTop: '16px', paddingHorizontal: '12px' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Text>Tételek összege</Text>
            <Text>{itemsSummary?.toLocaleString('hu-HU')} Ft</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Áfa összege</Text>
            <Text>{vatSummary?.toLocaleString('hu-HU')} Ft</Text>
          </View>
        </View>
        <View style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '12px' }}>
          <Text>Végösszeg</Text>
          <Text>{finalSummary?.toLocaleString('hu-HU')} Ft</Text>
        </View>
        <Text fixed style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', color: '#94a3b8', marginVertical: 'auto', fontSize: '10px' }} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} />
        <View fixed style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
          <Image src={`/Banner.png`} style={{ width: '100%', maxWidth: '100px', opacity: .5 }} />
        </View>
      </Page>
    </Document>
  )
};