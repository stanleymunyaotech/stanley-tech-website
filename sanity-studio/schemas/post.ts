import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name:'title', title:'Title', type:'string', validation: Rule => Rule.required().max(100)}),
    defineField({name:'slug', title:'Slug', type:'slug', options:{source:'title', maxLength:96}, validation: Rule => Rule.required()}),
    defineField({name:'excerpt', title:'Excerpt', type:'text', rows:3, validation: Rule => Rule.max(220)}),
    defineField({name:'coverImage', title:'Cover image', type:'image', options:{hotspot:true}}),
    defineField({name:'category', title:'Category', type:'reference', to:[{type:'category'}]}),
    defineField({name:'tags', title:'Tags', type:'array', of:[{type:'string'}], options:{layout:'tags'}}),
    defineField({name:'body', title:'Article content', type:'array', of:[{type:'block', styles:[{title:'Normal',value:'normal'},{title:'Heading 2',value:'h2'},{title:'Heading 3',value:'h3'},{title:'Quote',value:'blockquote'}], lists:[{title:'Bullet',value:'bullet'},{title:'Numbered',value:'number'}]},{type:'image', options:{hotspot:true}}]}),
    defineField({name:'publishedAt', title:'Publish date', type:'datetime'}),
    defineField({name:'featured', title:'Featured article', type:'boolean', initialValue:false}),
    defineField({name:'seoTitle', title:'SEO title', type:'string'}),
    defineField({name:'seoDescription', title:'SEO description', type:'text', rows:2})
  ],
  preview: {select:{title:'title', media:'coverImage', subtitle:'publishedAt'}}
})
