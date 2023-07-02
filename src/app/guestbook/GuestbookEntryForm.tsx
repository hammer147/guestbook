'use client'

import { useRef, useState } from 'react'
import { addEntry } from '../_actions'
import { ZodError } from 'zod'

export default function GuestbookEntryForm() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [serverError, setServerError] = useState<string>('')
  const [validationError, setValidationError] = useState<ZodError | null>(null)

  // client action calling a server action
  async function action(data: FormData) {
    const addEntryResult = await addEntry(data) // server action

    if (addEntryResult.serverError) {
      setServerError(addEntryResult.serverError)
    } else if (addEntryResult.zodError) {
      setValidationError(addEntryResult.zodError)
    } else {
      formRef.current!.reset()
      setServerError('')
      setValidationError(null)
    }
  }

  return (
    <form ref={formRef} className='flex max-w-sm flex-col gap-y-3 text-sm' action={action}>
      <input
        type='text'
        name='name'
        placeholder='Your name'
        className='rounded border bg-transparent px-3 py-1 dark:border-gray-600'
      />
      {validationError?.name && <p className='text-sm text-red-400'>{validationError.name}</p>}
      <input
        type='text'
        name='message'
        placeholder='Your message...'
        className='rounded border bg-transparent px-3 py-1 dark:border-gray-600'
      />
      {validationError?.message && (
        <p className='text-sm text-red-400'>{validationError.message}</p>
      )}
      <button
        type='submit'
        className='rounded bg-black px-3 py-1 text-white disabled:opacity-50 dark:bg-white dark:text-black'>
        Add
      </button>
      {serverError && <p className='text-sm text-red-400'>{serverError}</p>}
    </form>
  )
}
