import { Fragment } from 'react'
import { Menu, Popover, Transition } from '@headlessui/react'
import Head from 'next/head'
import Link from 'next/link'
import Huddle from '@/components/Huddle'
import { EnvelopeIcon, PhoneIcon, LinkIcon } from '@heroicons/react/20/solid'

const people = [
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  // Generate more people here
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@hmail.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    role: 'Admin',
    email: 'janecooper@hmail.com',
    telephone: '+1-202-555-0170',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
]

import { BasicLayout } from '@/components/BasicLayout'

import {
  AcademicCapIcon,
  BanknotesIcon,
  Bars3Icon,
  BellIcon,
  CheckBadgeIcon,
  ClockIcon,
  ReceiptRefundIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const user = {
  name: 'Fabian Ferno',
  email: 'hello@fabianferno.com',
  role: 'DEPTO member',
  imageUrl: 'https://avatars.githubusercontent.com/u/57835412?v=4',
}
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Profile', href: '#', current: false },
  { name: 'Resources', href: '#', current: false },
  { name: 'Company Directory', href: '#', current: false },
  { name: 'Openings', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
const stats = [
  { label: 'Vacation days left', value: 12 },
  { label: 'Sick days left', value: 4 },
  { label: 'Personal days left', value: 2 },
]

const patent = {
  title: 'Wrist Band Sanitizer Spray Apparatus',
  organization: 'TVS Motor Company Limited',
  date: '22/06/2020',
  designNo: '2020-0001',
  classNo: '28-99',
  domain: 'Automobiles',
  email: 'ram@hsbcasas.com',
  mobile: '1234567890',
  category: 'Corporate',
}
function Patent({ patent }) {
  return (
    <li
      key={patent.email}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className=" truncate text-sm font-medium text-gray-900">
              {patent.organization}
            </h3>{' '}
            <div className="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              CL# {patent.classNo}
            </div>
            <img
              className="h-10 w-10 flex-shrink-0 rounded-lg  bg-gray-300"
              src={`https://ui-avatars.com/api/?background=4f46e5&color=fff&name=${patent.title}`}
              alt=""
            />{' '}
          </div>

          <p className="mt-1 truncate text-sm text-gray-500">{patent.title}</p>
          <p className="mt-1 truncate text-sm text-gray-500">{patent.date}</p>
          <p className="mt-1 truncate text-sm text-gray-500">
            Design No. {patent.designNo}
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`mailto:${patent.email}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">View Patent</span>
            </a>
          </div>
        </div>
      </div>
    </li>
  )
}
const recentHires = [
  {
    name: 'Leonard Krasner',
    handle: '0x64574dDbe98813b23364704e0B00E2e71fC5aD17',
    imageUrl:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Floyd Miles',
    handle: '0x64574dDbe98813b23364704e0B00E2e71fC5aD17',
    imageUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Emily Selman',
    handle: '0x64574dDbe98813b23364704e0B00E2e71fC5aD17',
    imageUrl:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
  {
    name: 'Kristin Watson',
    handle: '0x64574dDbe98813b23364704e0B00E2e71fC5aD17',
    imageUrl:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '#',
  },
]
const announcements = [
  {
    id: 1,
    title: 'Hyperspace Beta is live! - Feb 2023',
    href: '#',
    preview:
      'Bounty contract architecture where an SP can store the data and claim his rewards on Hyperspace testnet.',
  },
  {
    id: 2,
    title: 'Mainnet launch - April 2023',
    href: '#',
    preview:
      'Mainnet deployment with events indexing and optimized contracts - Beta Launch',
  },
  {
    id: 3,
    title: 'Bounty Contract v2 - July 2023',
    href: '#',
    preview:
      'Creating storage deals via actor calls replacing the bounty contract architecture - Beta Launch',
  },
  {
    id: 4,
    title: 'Staking for Patent Validation - Dec 2023',
    href: '#',
    preview:
      'DAO members staking mechanism for improved validation/verification and FIL slashing for bad acting - Production launch',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Patent - DEPTO</title>
      </Head>
      <BasicLayout title="Dashboard">
        <main className="pb-8">
          <div className="mx-auto ">
            <h1 className="sr-only">Profile</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section aria-labelledby="profile-overview-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <h2 className="sr-only" id="profile-overview-title">
                      Profile Overview
                    </h2>
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="flex-shrink-0">
                            <img
                              className="mx-auto h-20 w-20 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">
                              Welcome back,
                            </p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                              {user.name}
                            </p>
                            <p className="text-sm font-medium text-gray-600">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <Huddle meetCode="65a1sd5a1" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="px-6 py-5 text-center text-sm font-medium"
                        >
                          <span className="text-gray-900">{stat.value}</span>{' '}
                          <span className="text-gray-600">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="mt-10 border-b border-gray-200 pb-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Patent Applications
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Verify the patents listed in here to get rewarded. Get more
                    rewards for being the verifier.
                  </p>
                </div>

                {/* Patent Applications panel */}
                <section aria-labelledby="quick-links-title">
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
                  >
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                  </ul>
                </section>

                <div className="mt-10 border-b border-gray-200 pb-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Validate Approved Patents
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Validate
                  </p>
                </div>

                {/* Patent Applications panel */}
                <section aria-labelledby="quick-links-title">
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
                  >
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                  </ul>
                </section>

                <div className="mt-10 border-b border-gray-200 pb-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    False Claim Patents
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm text-gray-500">
                    Review patents marked as False claims.
                  </p>
                </div>

                {/* Patent Applications panel */}
                <section aria-labelledby="quick-links-title">
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
                  >
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                    <Patent patent={patent} />
                  </ul>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Announcements */}
                <section aria-labelledby="announcements-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2
                        className="text-base font-medium text-gray-900"
                        id="announcements-title"
                      >
                        Roadmap
                      </h2>
                      <div className="mt-6 flow-root">
                        <ul
                          role="list"
                          className="-my-5 divide-y divide-gray-200"
                        >
                          {announcements.map((announcement) => (
                            <li key={announcement.id} className="py-5">
                              <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                <h3 className="text-sm font-semibold text-gray-800">
                                  <a
                                    href={announcement.href}
                                    className="hover:underline focus:outline-none"
                                  >
                                    {/* Extend touch target to entire panel */}
                                    <span
                                      className="absolute inset-0"
                                      aria-hidden="true"
                                    />
                                    {announcement.title}
                                  </a>
                                </h3>
                                <p className="line-clamp-2 mt-1 text-sm text-gray-600">
                                  {announcement.preview}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Join our discord for more updates
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recent Hires */}
                <section aria-labelledby="recent-hires-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <h2
                        className="text-base font-medium text-gray-900"
                        id="recent-hires-title"
                      >
                        Validators
                      </h2>
                      <div className="mt-6 flow-root">
                        <ul
                          role="list"
                          className="-my-5 divide-y divide-gray-200"
                        >
                          {recentHires.map((person) => (
                            <li key={person.handle} className="py-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src={person.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {person.name}
                                  </p>
                                  <p className="truncate text-sm text-gray-500">
                                    {person.handle}
                                  </p>
                                </div>
                                <div>
                                  <a
                                    href={person.href}
                                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                                  >
                                    View
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          View all
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </BasicLayout>
    </>
  )
}
