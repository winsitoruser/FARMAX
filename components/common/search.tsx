import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { SearchIcon } from 'lucide-react'

const Search = () => {
  return (
    <div className='relative'>
      <Input type='text' className='pl-12 bg-white active:ring-0 active:border-transparent active:outline-dotted hover:outline-none target:outline-none' />
      <Button variant={'ghost'} className='absolute left-0 top-0'><SearchIcon height={18} /></Button>
    </div>
  )
}

export default Search