'use client'
import { buttonVariants } from "@/components/ui/btn";
import { FileSearchIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { SelectPartner } from "../utils/types";
import DeletePartner from "./DeletePartner";
import UpdatePartner from "./UpdatePartner";

const PartnerList: FC<{ partners: SelectPartner[] }> = ({ partners }) => {

  return (
    <>
      <div className={`grid gap-3`}>
        {partners.map((partner, i) => (
          <div key={i} className={`bg-card rounded-2xl p-3 border shadow-sm text-sm grid xl:grid-cols-5 items-center gap-y-3 gap-x-4`}>
            <div className={`font-bold`}>
              {partner.name}
            </div>
            <div>
              {partner.taxnumber !== '' ? partner.taxnumber : '-'}
            </div>
            <div>
              {partner.email}
            </div>
            <div>
              {`${partner.zip} ${partner.city}, ${partner.address}`}
            </div>
            <div className={`flex items-center justify-center gap-4 border-t pt-3 md:justify-end md:border-t-0 md:pt-0`}>
              <Link href={`/dashboard/documents?search=${(partner.taxnumber != '' ? partner.taxnumber : partner.name)}`} className={`${buttonVariants({ variant: 'default', size: 'icon' })}`}>
                <FileSearchIcon />
              </Link>
              <UpdatePartner partner={partner} />
              <DeletePartner partner={partner} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PartnerList