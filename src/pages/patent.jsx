import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import { BasicLayout } from '@/components/BasicLayout'
import { governorContract } from '@/contracts/helpers'
import { useContract, useSigner } from 'wagmi'
import { ethers } from 'ethers'

import { useSignMessage } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'

import axios from 'axios'

import {
  CheckIcon,
  HandThumbUpIcon,
  PaperClipIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from '@heroicons/react/20/solid'

const patent = {
  title: 'Wrist Band Sanitizer Spray Apparatus',
  classNo: '28-99',
  organization: 'TVS Motor Company Limited',
  nationality: 'India',
  category: 'Corporate',
  domain: 'Automobiles',
  previousId: '2020-0001',
  email: 'ram@hsbcasas.com',
  mobile: '1234567890',
  street: '123, Main Street',
  city: 'Chennai',
  state: 'Tamil Nadu',
  zip: '600008',
  country: 'India',
  created_date: '2020-06-25',
  designNo: '2020-0001',
  description:
    'A wrist band sanitizer spray apparatus for spraying sanitizer on the hands of the user.  The reservoir is connected to a pump which is operated by a battery.  The apparatus is worn on the wrist of the user and the user can spray sanitizer on his hands by pressing the pump.',
}

const user = {
  name: 'Whitney Francis',
  email: 'whitney@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
}

const attachments = [
  { name: 'design_v1.pdf', href: '#' },
  { name: 'design-rev-v2.pdf', href: '#' },
]
const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: 'bg-gray-400' },
  advanced: { icon: HandThumbUpIcon, bgColorClass: 'bg-indigo-500' },
  completed: { icon: CheckIcon, bgColorClass: 'bg-green-500' },
}
const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: 'Minted application',
    target: 'Patent #' + patent.designNo,
    date: 'Sep 20',
    datetime: '2020-09-20',
  },
  {
    id: 2,
    type: eventTypes.advanced,
    content: 'Verified by',
    target: 'DEPTO DAO agent',
    date: 'Sep 22',
    datetime: '2020-09-22',
  },
  {
    id: 5,
    type: eventTypes.completed,
    content: 'Validate and approved ',
    target: 'Patent #' + patent.designNo,
    date: 'Oct 4',
    datetime: '2020-10-04',
  },
]
const comments = [
  {
    id: 1,
    name: 'Leslie Alexander',
    date: '4d ago',
    imageId: '1494790108377-be9c29b29330',
    body: 'Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.',
  },
  {
    id: 2,
    name: 'Michael Foster',
    date: '4d ago',
    imageId: '1519244703995-f4e0f30006d5',
    body: 'Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    date: '4d ago',
    imageId: '1506794778202-cad84cf45f1d',
    body: 'Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CreatePatent() {
  const router = useRouter()

  const recoveredAddress = useRef()
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })
  const { _id } = router.query

  const [patent, setPatent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (_id) {
        let data = await axios.get(`/api/patent?_id=${_id}`).catch((err) => {
          console.log(err)
        })
        setPatent(data.data)
        setLoading(false)
      }
    })()
  }, [router])

  return (
    <>
      <Head>
        <title>Patent - DEPTO</title>
      </Head>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-gray-900">Loading...</p>
          </div>
        </div>
      ) : (
        <BasicLayout title={`Patent #${patent.designNo}`}>
          <main className="py-2">
            {/* Page header */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
              <div className="flex items-center space-x-5">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={`https://ui-avatars.com/api/?background=4f46e5&color=fff&name=${patent.title}`}
                      alt=""
                    />
                    <span
                      className="absolute inset-0 rounded-full shadow-inner"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {patent.title}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    Applied by{' '}
                    <a href="#" className="text-gray-900">
                      {patent.organization}
                    </a>{' '}
                    on{' '}
                    <time dateTime={patent.created_date}>
                      {patent.created_date}
                    </time>
                  </p>
                </div>
              </div>
              <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    signMessage({
                      message: 'Sign this message to prove ownership',
                    })
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  Propose false claim
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signMessage({
                      message: 'Sign this message to approve patent',
                    })
                  }}
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  Propose Patent Approval
                </button>
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                {/* Description list*/}
                <section aria-labelledby="applicant-information-title">
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="flex items-end justify-between px-4 py-5 sm:px-6">
                      <div>
                        <h2
                          id="applicant-information-title"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Patent Information
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Owner and application details
                        </p>
                      </div>

                      <img
                        className="h-36 rounded-lg"
                        src={`https://m.media-amazon.com/images/I/71LvFRKpkhL._SL1500_.jpg`}
                        alt=""
                      />
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Class Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            # {patent.classNo}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Nationality
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.nationality}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Category
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.category}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Design Domain
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.domain}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Previous ID
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.previousId}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.email}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Phone
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            +1 555-555-5555
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Description
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.description}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Registered Address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {patent.street} {patent.city} {patent.state}{' '}
                            {patent.zip} {patent.country}
                          </dd>
                        </div>

                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Attachments
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <ul
                              role="list"
                              className="divide-y divide-gray-200 rounded-md border border-gray-200"
                            >
                              {attachments.map((attachment) => (
                                <li
                                  key={attachment.name}
                                  className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                                >
                                  <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon
                                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-2 w-0 flex-1 truncate">
                                      {attachment.name}
                                    </span>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <a
                                      href={attachment.href}
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="block bg-gray-50 px-4 py-4 text-center text-sm font-medium text-gray-500 hover:text-gray-700 sm:rounded-b-lg"
                      >
                        Read full application
                      </a>
                    </div>
                  </div>
                </section>

                {/* Comments*/}
                <section aria-labelledby="notes-title">
                  <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-5 sm:px-6">
                        <h2
                          id="notes-title"
                          className="text-lg font-medium text-gray-900"
                        >
                          Comments - powered by Push Chat. (Coming soon)
                        </h2>
                      </div>
                      <div className="px-4 py-6 blur-sm sm:px-6">
                        <ul role="list" className="space-y-8">
                          {comments.map((comment) => (
                            <li key={comment.id}>
                              <div className="flex space-x-3">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={`https://images.unsplash.com/photo-${comment.imageId}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <div className="text-sm">
                                    <a
                                      href="#"
                                      className="font-medium text-gray-900"
                                    >
                                      {comment.name}
                                    </a>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-700">
                                    <p>{comment.body}</p>
                                  </div>
                                  <div className="mt-2 space-x-2 text-sm">
                                    <span className="font-medium text-gray-500">
                                      {comment.date}
                                    </span>{' '}
                                    <span className="font-medium text-gray-500">
                                      &middot;
                                    </span>{' '}
                                    <button
                                      type="button"
                                      className="font-medium text-gray-900"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <form action="#">
                            <div>
                              <label htmlFor="comment" className="sr-only">
                                About
                              </label>
                              <textarea
                                id="comment"
                                name="comment"
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Add a note"
                                defaultValue={''}
                              />
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <a
                                href="#"
                                className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
                              >
                                <QuestionMarkCircleIcon
                                  className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                                <span>Some HTML is okay.</span>
                              </a>
                              <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Comment
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section
                aria-labelledby="timeline-title"
                className="lg:col-span-1 lg:col-start-3"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <h2
                    id="timeline-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    Timeline
                  </h2>

                  {/* Activity Feed */}
                  <div className="mt-6 flow-root">
                    <ul role="list" className="-mb-8">
                      {timeline.map((item, itemIdx) => (
                        <li key={item.id}>
                          <div className="relative pb-8">
                            {itemIdx !== timeline.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={classNames(
                                    item.type.bgColorClass,
                                    'flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white'
                                  )}
                                >
                                  <item.type.icon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {item.content}{' '}
                                    <a
                                      href="#"
                                      className="font-medium text-gray-900"
                                    >
                                      {item.target}
                                    </a>
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <time dateTime={item.datetime}>
                                    {item.date}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </BasicLayout>
      )}
    </>
  )
}
