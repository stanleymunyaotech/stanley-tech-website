import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Blog category',
  type: 'document',
  fields: [
    defineField({name:'title', title:'Category name', type:'string', validation: Rule => Rule.required()}),
    defineField({name:'slug', title:'Slug', type:'slug', options:{source:'title'}, validation: Rule => Rule.required()}),
    defineField({name:'description', title:'Description', type:'text', rows:2})
  ]
})
