import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Blog category',
  type: 'document',
  fields: [
    defineField({name:'order', title:'Sort order', type:'number', initialValue:0}),
    defineField({name:'title', title:'Category name', type:'string', validation: Rule => Rule.required().max(60)}),
    defineField({name:'slug', title:'Slug', type:'slug', options:{source:'title', maxLength:80}, validation: Rule => Rule.required()}),
    defineField({name:'description', title:'Description', type:'text', rows:2, validation: Rule => Rule.max(180)})
  ],
  preview: {select:{title:'title',subtitle:'description'}}
})
