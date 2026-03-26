"use client"

import { Button } from '@/components/ui/btn'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SA_SendInvoiceMail } from '@/features/email/actions'
import { SelectInvoice } from '@/features/invoice/lib/types'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Color from '@tiptap/extension-color'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Italic from '@tiptap/extension-italic'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, Heading1Icon, Heading2Icon, Heading3Icon, ItalicIcon, ListIcon, Minus, SendIcon, UnderlineIcon } from 'lucide-react'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'


const SendInvoice: FC<{ invoice: SelectInvoice }> = ({ invoice }) => {

  const [loading, setLoading] = useState(false)

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
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-5"
        }
      }),
      ListItem,
      Color,
      HardBreak,
      HorizontalRule.configure({
        HTMLAttributes: {
          style: `border: 1px solid #13a4ec;`
        }
      }),
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

    editorProps: {
      attributes: {
        class: ' border border-gray-300 overflow-y-scroll prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-3 focus:outline-none h-[300px]',
      },
    },
    content: "",
  })

  const handlePDFSend = async () => {
    if (editor) {
      setLoading(true)

      const res = await SA_SendInvoiceMail(invoice.id, !editor.isEmpty ? editor.getHTML() : "");
      if (res.statusCode === 200) {
        toast.success('E-mail sikeresen elküldve!');
      } else if (res.statusCode !== 500) {
        toast.error(res.error);
      } else {
        toast.error(res.statusMessage);
      }
      setLoading(false)
    }
  }

  const getToggleValue = (editor: Editor | null) => {
    if (!editor || !editor.isFocused) return []

    return [
      editor.isActive('bold') && 'bold',
      editor.isActive('italic') && 'italic',
      editor.isActive('underline') && 'underline',
      editor.isActive({ textAlign: 'left' }) && "align-left",
      editor.isActive({ textAlign: 'center' }) && "align-center",
      editor.isActive({ textAlign: 'right' }) && "align-right",
      editor.isActive({ heading: 1 }) && "heading-1",
      editor.isActive({ heading: 2 }) && "heading-2",
      editor.isActive({ heading: 3 }) && "heading-3",
      editor.isActive("horizontalrule") && "horizontalrule",
      editor.isActive("bulletList") && "bulletList",

    ].filter(Boolean) as string[]
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant={`outline`} loading={loading} className={`flex items-center gap-2 text-nowrap`} disabled={loading}>
          <SendIcon strokeWidth={1.5} />
          Küldés
        </Button>
      </DialogTrigger>
      <DialogContent className='h-fit '>
        <DialogHeader>
          <DialogTitle>Egyedi E-mail tartalom</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4 h-full ' >
          <ToggleGroup type="multiple" className="self-start w-fit" value={getToggleValue(editor)} size={"sm"}>
            <ToggleGroupItem value="bold" variant="outline" aria-label="Toggle bold" onClick={() => editor?.chain().focus().toggleBold().run()}>
              <BoldIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" variant="outline" aria-label="Toggle italic" onClick={() => editor?.chain().focus().toggleItalic().run()}>
              <ItalicIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" variant="outline" aria-label="Toggle underline" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="align-left" variant="outline" aria-label="Toggle align-left" onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
              <AlignLeftIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="align-center" variant="outline" aria-label="Toggle align-center" onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
              <AlignCenterIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="align-right" variant="outline" aria-label="Toggle align-right" onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
              <AlignRightIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="heading-1" variant="outline" aria-label="Toggle heading-1" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1Icon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="heading-2" variant="outline" aria-label="Toggle heading-2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2Icon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="heading-3" variant="outline" aria-label="Toggle heading-3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3Icon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="horizontalrule" variant="outline" aria-label="Toggle horizontalrule" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
              <Minus className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="bulletList" variant="outline" aria-label="Toggle bulletList" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
              <ListIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <EditorContent editor={editor} />
          <Button loading={loading} onClick={handlePDFSend} disabled={loading}>Küldés</Button>
        </div>


      </DialogContent>
    </Dialog>
  )
}

export default SendInvoice