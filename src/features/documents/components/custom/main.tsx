'use client'

import { Button, buttonVariants } from "@/components/ui/btn"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FullCompany } from "@/features/company/utils/types"
import { SelectPartner } from "@/features/partners/utils/types"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, CircleCheckBigIcon, FileSearchIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListIcon, MinusIcon, PlusCircleIcon, UnderlineIcon } from "lucide-react"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { createSwapy, SlotItemMapArray, Swapy, utils } from 'swapy'
import PDFViewerContainer from "../pdf/PDFViewer"
import { Custom } from "../pdf/schema/Custom"
import Document from '@tiptap/extension-document'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import { Color } from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import HardBreak from '@tiptap/extension-hard-break'


type Item = {
  id: string
  title: string
}

const initialItems: Item[] = [
  { id: '1', title: '1' },
  { id: '2', title: '2' },
  { id: '3', title: '3' },
]

let id = 4

const ParagraphTypes = ['H1', 'H2', 'H3', 'P'];

const Main: FC<{ company: FullCompany, docName: string, issuerEmail: string }> = ({ company, docName, issuerEmail }) => {

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          style: 'font-size: 12px; margin-bottom: 0px; padding-bottom: 0px',
        }
      }),
      Text,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Color,
      HorizontalRule.configure({
        HTMLAttributes: {
          style: `border: 1px solid ${company.color ?? "#13a4ec"};`
        }
      }),
      HardBreak,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          style: 'font-size: 22px; padding-bottom: 0px; margin-bottom: 0px'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<h1>Webfejlesztési szerződés</h1>',
  })

  return (
    <section>
      <header className={`mb-4 text-center md:text-start`}>
        <h1 className={`font-bold text-4xl`}>Egyedi dokumentum</h1>
      </header>
      <div className={`mb-4 flex gap-4`}>
        <Button className={`flex items-center gap-2 `}>
          <CircleCheckBigIcon strokeWidth={1.5} />
          <span>Dokumentum elkészítése</span>
        </Button>
        <Dialog>
          <DialogTrigger className={`${buttonVariants({ variant: 'outline' })}`}>
            <FileSearchIcon />
            <span>Előnézet</span>
          </DialogTrigger>
          <DialogContent className={`max-h-[90dvh] max-w-[90dvw] md:max-w-[640px] h-full w-full rounded-2xl sm:rounded-2xl p-3`}>
            <DialogHeader className={`space-y-0`}>
              <DialogTitle className={`mb-4 text-lg`}>Egyedi dokumentum előnézete</DialogTitle>
              <PDFViewerContainer document={<Custom data={editor?.getHTML()} name={docName} color={company.color ?? "#13a4ec"} logo={company.logo}/>} className={`h-full w-full`} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className={`grid lg:grid-cols-3 gap-4`}>
        <div className={`border shadow-sm p-3 rounded-2xl bg-card w-full h-max flex flex-wrap gap-4`}>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleBold().run()}><BoldIcon strokeWidth={2}/></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleItalic().run()}><ItalicIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().setTextAlign('left').run()}><AlignLeftIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().setTextAlign('center').run()}><AlignCenterIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().setTextAlign('right').run()}><AlignRightIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleBulletList().run()}><ListIcon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleHeading({level: 1}).run()}><Heading1Icon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleHeading({level: 2}).run()}><Heading2Icon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().toggleHeading({level: 3}).run()}><Heading3Icon strokeWidth={1.5} /></Button>
        <Button variant={`outline`} size={`icon`} onClick={() => editor?.chain().focus().setHorizontalRule().run()}><MinusIcon strokeWidth={1.5} /></Button>
        </div>
        <div className={`border shadow-sm p-3 rounded-2xl  bg-card w-full h-max grid grid-cols-1 gap-4 lg:col-start-2 lg:col-end-4`}>
          <EditorContent editor={editor}/>
        </div>
      </div>
      <div className="container">
        <div className="items">

        </div>
      </div>
    </section>
  )
}

export default Main