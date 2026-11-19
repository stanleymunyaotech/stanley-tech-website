import React from 'react'
import {useFormValue, type ObjectInputProps} from 'sanity'

type Block = { _type?: string; style?: string; children?: Array<{text?: string}>; listItem?: string }

export function DraftPreview(props: ObjectInputProps) {
  const title = (useFormValue(['title']) as string) || 'Untitled article'
  const excerpt = (useFormValue(['excerpt']) as string) || 'Add an introduction or excerpt to preview it here.'
  const body = (useFormValue(['body']) as Block[]) || []
  const paragraphs = body.filter(block => block._type === 'block').slice(0, 5).map(block => ({
    style: block.style || 'normal',
    text: (block.children || []).map(child => child.text || '').join(''),
  })).filter(block => block.text)

  return <div style={{border:'1px solid #d8e2da',borderRadius:12,background:'#f7faf6',padding:20,color:'#18362a'}}>
    <div style={{fontSize:11,fontWeight:700,letterSpacing:'.14em',color:'#4c8060',textTransform:'uppercase',marginBottom:12}}>Editor-only draft preview</div>
    <div style={{fontFamily:'Georgia,serif',fontSize:27,lineHeight:1.2,fontWeight:600,marginBottom:12}}>{title}</div>
    <p style={{fontSize:14,lineHeight:1.7,color:'#586a5f',margin:'0 0 18px'}}>{excerpt}</p>
    <div style={{borderTop:'1px solid #d8e2da',paddingTop:14}}>
      {paragraphs.length ? paragraphs.map((block,index) => block.style === 'h2' || block.style === 'h3'
        ? <div key={index} style={{fontWeight:700,fontSize:15,margin:'12px 0 5px'}}>{block.text}</div>
        : <p key={index} style={{fontSize:13,lineHeight:1.75,color:'#42564a',margin:'7px 0'}}>{block.text}</p>)
        : <p style={{fontSize:13,color:'#7b8b80'}}>Your article body preview will appear here as you write.</p>}
    </div>
    <div style={{marginTop:14,fontSize:11,color:'#728277'}}>This is a private editing preview inside Studio. Publishing is still required before the article appears on the public website.</div>
  </div>
}
