import {defineType, defineField} from 'sanity'
import {DraftPreview} from '../components/DraftPreview'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'publishing', title: 'Publishing'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name:'title', title:'Title', type:'string', group:'content', validation: Rule => Rule.required().max(100)}),
    defineField({name:'slug', title:'URL slug', type:'slug', group:'content', options:{source:'title', maxLength:96}, validation: Rule => Rule.required()}),
    defineField({name:'excerpt', title:'Introduction / excerpt', type:'text', rows:3, group:'content', validation: Rule => Rule.max(260)}),
    defineField({name:'coverImage', title:'Featured image', type:'image', group:'content', options:{hotspot:true}, fields:[defineField({name:'alt',title:'Alternative text',type:'string',validation:Rule=>Rule.required()})]}),
    defineField({name:'category', title:'Category', type:'reference', group:'content', to:[{type:'category'}]}),
    defineField({name:'tags', title:'Tags', type:'array', group:'content', of:[{type:'string'}], options:{layout:'tags'}}),
    defineField({name:'body', title:'Article content', type:'array', group:'content', of:[{type:'block', styles:[{title:'Normal',value:'normal'},{title:'Heading 2',value:'h2'},{title:'Heading 3',value:'h3'},{title:'Quote',value:'blockquote'}], lists:[{title:'Bullet',value:'bullet'},{title:'Numbered',value:'number'}]},{type:'image', options:{hotspot:true}, fields:[defineField({name:'alt',title:'Alternative text',type:'string',validation:Rule=>Rule.required()})]}], validation: Rule => Rule.required().min(1)}),
    defineField({name:'featured', title:'Feature on homepage', type:'boolean', group:'publishing', initialValue:false}),
    defineField({name:'publishedAt', title:'Publication date', type:'datetime', group:'publishing', description:'Set this when the article is ready to publish. Use the Sanity Publish action to make it public.'}),
    defineField({name:'readingTime', title:'Estimated reading time (minutes)', type:'number', group:'publishing', validation:Rule=>Rule.min(1).max(60)}),
    defineField({name:'seoTitle', title:'SEO title', type:'string', group:'seo', validation:Rule=>Rule.max(65)}),
    defineField({name:'seoDescription', title:'SEO description', type:'text', rows:2, group:'seo', validation:Rule=>Rule.max(170)}),
    defineField({name:'editorPreview', title:'Article preview', type:'object', group:'publishing', readOnly:true, components:{input:DraftPreview}, fields:[defineField({name:'previewNote',type:'string',hidden:true})]}),
  ],
  preview: {select:{title:'title', media:'coverImage', subtitle:'category.title'}, prepare({title,media,subtitle}) {return {title:title || 'Untitled article', media, subtitle:subtitle || 'Uncategorised'}}}
})
