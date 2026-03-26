import { SzamlazzXmlData } from "../../lib/types/document";
import { genSzamlazzHuXML } from "../../queries";

export const szamlazzHu = async (data: SzamlazzXmlData) => {

  const xml = genSzamlazzHuXML(data);

  const formData = new FormData();

  const blob = new Blob([xml], { type: 'text/xml' })
  formData.append('action-xmlagentxmlfile', blob, 'xml.xml')

  const res = await fetch(`https://www.szamlazz.hu/szamla/`, {
    method: 'post',
    body: formData
  });

  const error = res.headers.get('szlahu_error_code')

  if (error) throw new Error(`szamlazz.hu error: ${decodeURI(error)}`);

  return res

}