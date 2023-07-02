'use server'

import { revalidatePath } from 'next/cache'
import { GuestEntrySchema } from '@/lib/schema'
import { createGuestbookEntry } from '@/lib/mongo/guestbook'
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export async function addEntry(data: FormData) {
  let addEntryResult: {
    serverError: string
    zodError: z.ZodError | null
  } = {
    serverError: '',
    zodError: null
  }

  let { name, message } = Object.fromEntries(data)

  // check that name and message are strings
  if (typeof name !== 'string' || typeof message !== 'string') {
    addEntryResult.serverError = 'Invalid form data.'
    return addEntryResult
  }

  // sanitize name and message with DOMPurify
  name = DOMPurify.sanitize(name)
  message = DOMPurify.sanitize(message)

  // validate name and message with zod
  const validationResult = GuestEntrySchema.safeParse({ name, message })
  if (!validationResult.success) {
    addEntryResult.zodError = validationResult.error
    return addEntryResult
  }

  // create entry in database
  const createEntryResult = await createGuestbookEntry(validationResult.data)

  if (!createEntryResult) {
    addEntryResult.serverError = 'Failed to create entry.'
    return addEntryResult
  }

  revalidatePath('/guestbook')
  return addEntryResult
}

// we could also create a wrapper for validation as suggested in the docs
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#validation
