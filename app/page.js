import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/plan/step-1/')
}
