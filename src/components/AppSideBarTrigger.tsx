'use client'
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "./ui/btn"
import { PanelLeftIcon } from "lucide-react"
 
export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
 
  return (
    <>
      <Button onClick={toggleSidebar} variant={`default`} size={`icon`} className={`flex md:hidden fixed bottom-4 left-4`}><PanelLeftIcon/></Button>
    </>
  )
}