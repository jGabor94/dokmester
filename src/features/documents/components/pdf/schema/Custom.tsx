import { Document, Font, Image, Page, Text, View } from '@react-pdf/renderer';
import { FC } from 'react';
import Html from 'react-pdf-html';

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

export const Custom: FC<{ data: any, name: string, color: string, logo: string }> = ({ data, name, color, logo }) => {

  /*const finalSummary = data.items && data.items.reduce((acc, curr) => acc + Number(Math.round((curr.price * (1 + (curr.vatkey / 100))) * curr.quantity)), 0);
  const vatSummary = data.items && data.items.reduce((acc, curr) => acc + Number(Math.round((curr.price * ((curr.vatkey / 100))) * curr.quantity)), 0);
  const itemsSummary = data.items && data.items.reduce((acc, curr) => acc + Number((curr.price * curr.quantity)), 0);
  const date = new Date();*/

  return (
    <Document>
      <Page size="A4" style={{ paddingHorizontal: '24px', paddingBottom: '42px', paddingTop: '24px', fontFamily: 'Inter', fontSize: '12px', color: '#020617' }}>
        <Html>{data}</Html>
        <Text fixed style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', color: '#94a3b8', marginVertical: 'auto', fontSize: '10px' }} render={({ pageNumber, totalPages }) => (`${pageNumber} / ${totalPages}`)} />
        <View fixed style={{ position: 'absolute', bottom: '24px', right: '24px' }}>
          <Image src={`/Banner.png`} style={{ width: '100%', maxWidth: '100px', opacity: .5 }} />
        </View>
      </Page>
    </Document>
  )
};